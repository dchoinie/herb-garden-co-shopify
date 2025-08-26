import 'server-only';
import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!;

export interface CustomerSession {
  customerId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  expiresAt: number;
}

export interface CustomerAccount {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  acceptsMarketing: boolean;
  createdAt: string;
  updatedAt: string;
}

// JWT token management
export async function createCustomerToken(customer: CustomerAccount): Promise<string> {
  const secret = new TextEncoder().encode(JWT_SECRET);
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  const token = await new SignJWT({
    customerId: customer.id,
    email: customer.email,
    firstName: customer.firstName,
    lastName: customer.lastName,
    expiresAt,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);

  return token;
}

export async function verifyCustomerToken(token: string): Promise<CustomerSession | null> {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    if (payload.expiresAt && Date.now() > payload.expiresAt) {
      return null;
    }

    return payload as CustomerSession;
  } catch {
    return null;
  }
}

// Cookie management
export async function setCustomerCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('customer_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60, // 24 hours
    path: '/',
  });
}

export async function getCustomerCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('customer_token')?.value || null;
}

export async function clearCustomerCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('customer_token');
}

// Authentication helpers
export async function getCustomerSession(): Promise<CustomerSession | null> {
  const token = await getCustomerCookie();
  if (!token) return null;
  
  return await verifyCustomerToken(token);
}

export async function requireCustomerSession(): Promise<CustomerSession> {
  const session = await getCustomerSession();
  if (!session) {
    redirect('/account/login');
  }
  return session;
}

// Shopify Customer Account API helpers
export async function getCustomerAccount(customerId: string): Promise<CustomerAccount | null> {
  const { shopify } = await import('./shopify');
  
  const query = /* GraphQL */ `
    query Customer($id: ID!) {
      customer(id: $id) {
        id
        email
        firstName
        lastName
        phone
        acceptsMarketing
        createdAt
        updatedAt
      }
    }
  `;

  try {
    const { data } = await shopify.request(query, { 
      variables: { id: customerId } 
    });
    return data.customer;
  } catch (error) {
    console.error('Error fetching customer:', error);
    return null;
  }
}

export async function customerLogin(email: string, password: string): Promise<CustomerAccount | null> {
  const { shopify, customerRequest } = await import('./shopify');
  
  const mutation = /* GraphQL */ `
    mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken {
          accessToken
          expiresAt
        }
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `;

  try {
    const data = await customerRequest<{
      customerAccessTokenCreate: {
        customerAccessToken: { accessToken: string; expiresAt: string } | null;
        customerUserErrors: Array<{ code: string; field: string; message: string }>;
      };
    }>(mutation, {
      input: { email, password }
    });

    if (data.customerAccessTokenCreate.customerUserErrors.length > 0) {
      return null;
    }

    const accessToken = data.customerAccessTokenCreate.customerAccessToken?.accessToken;
    if (!accessToken) {
      return null;
    }
    
    // Get customer details using the access token
    const customerQuery = /* GraphQL */ `
      query {
        customer {
          id
          email
          firstName
          lastName
          phone
          acceptsMarketing
          createdAt
          updatedAt
        }
      }
    `;

    const customerData = await customerRequest<{ customer: CustomerAccount }>(
      customerQuery,
      undefined,
      accessToken
    );

    return customerData.customer;
  } catch (error) {
    console.error('Error during customer login:', error);
    return null;
  }
}

export async function customerRegister(input: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  acceptsMarketing?: boolean;
}): Promise<CustomerAccount | null> {
  const { customerRequest } = await import('./shopify');
  
  const mutation = /* GraphQL */ `
    mutation customerCreate($input: CustomerInput!) {
      customerCreate(input: $input) {
        customer {
          id
          email
          firstName
          lastName
          phone
          acceptsMarketing
          createdAt
          updatedAt
        }
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `;

  try {
    const data = await customerRequest<{
      customerCreate: {
        customer: CustomerAccount | null;
        customerUserErrors: Array<{ code: string; field: string; message: string }>;
      };
    }>(mutation, { input });

    if (data.customerCreate.customerUserErrors.length > 0) {
      return null;
    }

    return data.customerCreate.customer;
  } catch (error) {
    console.error('Error during customer registration:', error);
    return null;
  }
}

export async function customerLogout(): Promise<void> {
  const { customerRequest } = await import('./shopify');
  
  const mutation = /* GraphQL */ `
    mutation customerAccessTokenDelete($customerAccessToken: String!) {
      customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
        deletedAccessToken
        deletedCustomerAccessTokenId
        userErrors {
          field
          message
        }
      }
    }
  `;

  try {
    // Get the current access token from cookies
    const token = await getCustomerCookie();
    if (token) {
      await customerRequest(mutation, { customerAccessToken: token });
    }
  } catch (error) {
    console.error('Error during customer logout:', error);
  } finally {
    await clearCustomerCookie();
  }
}
