import "server-only";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createAdminApiClient } from "@shopify/admin-api-client";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!;
const SHOPIFY_ADMIN_API_ACCESS_TOKEN =
  process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN!;

// Initialize Admin API client
const adminClient = createAdminApiClient({
  storeDomain: SHOPIFY_STORE_DOMAIN,
  apiVersion: "2025-07",
  accessToken: SHOPIFY_ADMIN_API_ACCESS_TOKEN,
});

export interface CustomerSession {
  customerId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  expiresAt: number;
}

// Enhanced customer data interface with Admin API fields
export interface CustomerAccount {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  acceptsMarketing: boolean;
  createdAt: string;
  updatedAt: string;
  // Additional Admin API fields
  numberOfOrders?: number;
  amountSpent?: {
    amount: string;
    currencyCode: string;
  };
  verifiedEmail?: boolean;
  validEmailAddress?: boolean;
  tags?: string[];
  lifetimeDuration?: string;
  note?: string;
  state?: string;
  taxExempt?: boolean;
  taxExemptions?: string[];
  defaultAddress?: {
    id?: string;
    formattedArea?: string;
    address1?: string;
    address2?: string;
    city?: string;
    province?: string;
    country?: string;
    zip?: string;
    company?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
  addresses?: Array<{
    id?: string;
    address1?: string;
    address2?: string;
    city?: string;
    province?: string;
    country?: string;
    zip?: string;
    company?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  }>;
  image?: {
    id?: string;
    src?: string;
    altText?: string;
    width?: number;
    height?: number;
  };
  canDelete?: boolean;
  orders?: {
    nodes: Array<{
      id: string;
      name: string;
      createdAt: string;
      fulfillmentStatus: string;
      financialStatus: string;
      totalPriceSet: {
        shopMoney: {
          amount: string;
          currencyCode: string;
        };
      };
      lineItems: {
        nodes: Array<{
          title: string;
          quantity: number;
          variant?: {
            image?: {
              url: string;
              altText?: string;
            };
          };
        }>;
      };
    }>;
  };
  metafields?: {
    nodes: Array<{
      id: string;
      namespace: string;
      key: string;
      value: string;
      type: string;
    }>;
  };
}

// JWT token management
export async function createCustomerToken(
  customer: CustomerAccount
): Promise<string> {
  const secret = new TextEncoder().encode(JWT_SECRET);
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  const token = await new SignJWT({
    customerId: customer.id,
    email: customer.email,
    firstName: customer.firstName,
    lastName: customer.lastName,
    expiresAt,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret);

  return token;
}

export async function verifyCustomerToken(
  token: string
): Promise<CustomerSession | null> {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    // Check if the token has expired
    if (
      payload.expiresAt &&
      typeof payload.expiresAt === "number" &&
      Date.now() > payload.expiresAt
    ) {
      return null;
    }

    // Validate required fields
    if (!payload.customerId || !payload.email) {
      return null;
    }

    return {
      customerId: payload.customerId as string,
      email: payload.email as string,
      firstName: payload.firstName as string | undefined,
      lastName: payload.lastName as string | undefined,
      expiresAt: payload.expiresAt as number,
    } as CustomerSession;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}

// Cookie management
export async function setCustomerCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("customer_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60, // 24 hours
    path: "/",
  });
}

export async function getCustomerCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("customer_token")?.value || null;
}

export async function clearCustomerCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("customer_token");
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
    redirect("/account/login");
  }
  return session;
}

// Enhanced customer account fetching using Admin GraphQL API
export async function getCustomerAccount(
  customerId: string
): Promise<CustomerAccount | null> {
  // Use Admin API for more comprehensive customer data
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
        numberOfOrders
        amountSpent {
          amount
          currencyCode
        }
        verifiedEmail
        validEmailAddress
        tags
        lifetimeDuration
        note
        state
        taxExempt
        taxExemptions
        defaultAddress {
          id
          formattedArea
          address1
          address2
          city
          province
          country
          zip
          company
          firstName
          lastName
          phone
        }
        addresses {
          id
          address1
          address2
          city
          province
          country
          zip
          company
          firstName
          lastName
          phone
        }
        image {
          id
          src
          altText
          width
          height
        }
        canDelete
        orders(first: 5, reverse: true) {
          nodes {
            id
            name
            createdAt
            fulfillmentStatus
            financialStatus
            totalPriceSet {
              shopMoney {
                amount
                currencyCode
              }
            }
            lineItems(first: 3) {
              nodes {
                title
                quantity
                variant {
                  image {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
        metafields(first: 10) {
          nodes {
            id
            namespace
            key
            value
            type
          }
        }
      }
    }
  `;

  try {
    const response = await adminClient.request(query, {
      variables: { id: customerId },
    });

    // Check if response has the expected structure
    if (!response || !response.data || !response.data.customer) {
      console.error("Admin API response missing customer data:", response);
      return null;
    }

    return response.data.customer;
  } catch (error) {
    console.error("Error fetching customer via Admin API:", error);

    // Fallback to Storefront API if Admin API fails
    const { shopify } = await import("./shopify");

    const fallbackQuery = /* GraphQL */ `
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
      const { data } = await shopify.request(fallbackQuery, {
        variables: { id: customerId },
      });
      return data.customer;
    } catch (fallbackError) {
      console.error(
        "Error fetching customer via Storefront API:",
        fallbackError
      );
      return null;
    }
  }
}

export async function customerLogin(
  email: string
): Promise<{ success: boolean; message: string }> {
  const { customerRequest } = await import("./shopify");

  console.log("Attempting to send recovery email for:", email);

  // For passwordless authentication, we use customerRecover to send a sign-in link
  // This is Shopify's recommended approach for passwordless auth
  const mutation = /* GraphQL */ `
    mutation customerRecover($email: String!) {
      customerRecover(email: $email) {
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
      customerRecover: {
        customerUserErrors: Array<{
          code: string;
          field: string;
          message: string;
        }>;
      };
    }>(mutation, { email });

    console.log("CustomerRecover response:", data);

    if (data.customerRecover.customerUserErrors.length > 0) {
      console.error(
        "Customer recovery errors:",
        data.customerRecover.customerUserErrors
      );
      return {
        success: false,
        message: data.customerRecover.customerUserErrors[0].message,
      };
    }

    console.log("Successfully sent recovery email to:", email);
    return {
      success: true,
      message: "Check your email for a sign-in link",
    };
  } catch (error) {
    console.error("Error during customer login:", error);
    throw error;
  }
}

// Password-based customer login
export async function customerPasswordLogin(
  email: string,
  password: string
): Promise<{ success: boolean; message: string; customer?: CustomerAccount }> {
  const { customerRequest } = await import("./shopify");

  console.log("Attempting password-based login for:", email);

  // Create customer access token using email and password
  const tokenMutation = /* GraphQL */ `
    mutation customerAccessTokenCreate(
      $input: CustomerAccessTokenCreateInput!
    ) {
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
    const tokenData = await customerRequest<{
      customerAccessTokenCreate: {
        customerAccessToken: {
          accessToken: string;
          expiresAt: string;
        } | null;
        customerUserErrors: Array<{
          code: string;
          field: string;
          message: string;
        }>;
      };
    }>(tokenMutation, {
      input: {
        email: email,
        password: password,
      },
    });

    console.log("CustomerAccessTokenCreate response:", tokenData);

    if (tokenData.customerAccessTokenCreate.customerUserErrors.length > 0) {
      console.error(
        "Customer access token creation errors:",
        tokenData.customerAccessTokenCreate.customerUserErrors
      );
      return {
        success: false,
        message:
          tokenData.customerAccessTokenCreate.customerUserErrors[0].message,
      };
    }

    if (!tokenData.customerAccessTokenCreate.customerAccessToken) {
      return {
        success: false,
        message: "Failed to create access token",
      };
    }

    // Now get the customer data using the access token
    const customer = await getCustomerWithAccessToken(
      tokenData.customerAccessTokenCreate.customerAccessToken.accessToken
    );

    if (!customer) {
      return {
        success: false,
        message: "Failed to retrieve customer data",
      };
    }

    console.log("Successfully authenticated customer:", customer.email);
    return {
      success: true,
      message: "Login successful",
      customer: customer,
    };
  } catch (error) {
    console.error("Error during customer login:", error);
    throw error;
  }
}

// Get customer data using Storefront API with access token
export async function getCustomerWithAccessToken(
  accessToken: string
): Promise<CustomerAccount | null> {
  const { customerRequest } = await import("./shopify");

  const query = /* GraphQL */ `
    query Customer($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        id
        email
        firstName
        lastName
        phone
        acceptsMarketing
        createdAt
        updatedAt
        numberOfOrders
      }
    }
  `;

  try {
    const data = await customerRequest<{
      customer: CustomerAccount;
    }>(query, { customerAccessToken: accessToken });

    return data.customer;
  } catch (error) {
    console.error("Error fetching customer with access token:", error);
    return null;
  }
}

export async function customerPasswordRegister(input: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  acceptsMarketing?: boolean;
}): Promise<{ success: boolean; message: string }> {
  const { customerRequest } = await import("./shopify");

  // Create customer with the provided password
  const createMutation = /* GraphQL */ `
    mutation customerCreate($input: CustomerCreateInput!) {
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
    const createData = await customerRequest<{
      customerCreate: {
        customer: CustomerAccount | null;
        customerUserErrors: Array<{
          code: string;
          field: string;
          message: string;
        }>;
      };
    }>(createMutation, {
      input: {
        email: input.email,
        password: input.password, // Use the provided password
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone,
        acceptsMarketing: input.acceptsMarketing || false,
      },
    });

    // If customer was created successfully
    if (createData.customerCreate.customer) {
      return {
        success: true,
        message:
          "Account created successfully! You can now sign in with your email and password.",
      };
    }

    // If customer creation failed, check if it's because customer already exists
    const userErrors = createData.customerCreate.customerUserErrors;
    const customerExists = userErrors.some(
      (error) =>
        error.code === "CUSTOMER_DISABLED" ||
        error.message.toLowerCase().includes("already exists") ||
        error.message.toLowerCase().includes("customer")
    );

    if (customerExists) {
      return {
        success: false,
        message:
          "An account with this email already exists. Please sign in instead.",
      };
    }

    // Other creation errors
    console.error("Customer creation errors:", userErrors);
    return {
      success: false,
      message: userErrors[0]?.message || "Failed to create account",
    };
  } catch (error) {
    console.error("Error during customer registration:", error);
    throw error;
  }
}

export async function customerRegister(input: {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  acceptsMarketing?: boolean;
}): Promise<{ success: boolean; message: string }> {
  const { customerRequest } = await import("./shopify");

  // For passwordless auth, we need to create a customer with a temporary password
  // Shopify will automatically send an account confirmation email
  const createMutation = /* GraphQL */ `
    mutation customerCreate($input: CustomerCreateInput!) {
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
    // Generate a secure temporary password for the customer
    const tempPassword =
      Math.random().toString(36).slice(-12) +
      Math.random().toString(36).slice(-12);

    const createData = await customerRequest<{
      customerCreate: {
        customer: CustomerAccount | null;
        customerUserErrors: Array<{
          code: string;
          field: string;
          message: string;
        }>;
      };
    }>(createMutation, {
      input: {
        email: input.email,
        password: tempPassword, // Temporary password required by Shopify
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone,
        acceptsMarketing: input.acceptsMarketing || false,
      },
    });

    // If customer was created successfully
    if (createData.customerCreate.customer) {
      return {
        success: true,
        message: "Account created! Check your email to activate your account.",
      };
    }

    // If customer creation failed, check if it's because customer already exists
    const userErrors = createData.customerCreate.customerUserErrors;
    const customerExists = userErrors.some(
      (error) =>
        error.code === "CUSTOMER_DISABLED" ||
        error.message.toLowerCase().includes("already exists") ||
        error.message.toLowerCase().includes("customer")
    );

    if (customerExists) {
      return {
        success: false,
        message:
          "An account with this email already exists. Please sign in instead.",
      };
    }

    // Other creation errors
    console.error("Customer creation errors:", userErrors);
    return {
      success: false,
      message: userErrors[0]?.message || "Failed to create account",
    };
  } catch (error) {
    console.error("Error during customer registration:", error);
    throw error;
  }
}

// Get customer orders using REST Admin API
export async function getCustomerOrders(customerId: string): Promise<any[]> {
  try {
    const ordersUrl = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2025-07/customers/${customerId}/orders.json`;

    const ordersResponse = await fetch(ordersUrl, {
      headers: {
        "X-Shopify-Access-Token": SHOPIFY_ADMIN_API_ACCESS_TOKEN,
        "Content-Type": "application/json",
      },
    });

    if (!ordersResponse.ok) {
      console.error(
        "Failed to fetch customer orders:",
        ordersResponse.statusText
      );
      return [];
    }

    const ordersData = await ordersResponse.json();
    return ordersData.orders || [];
  } catch (error) {
    console.error("Error fetching customer orders via REST Admin API:", error);
    return [];
  }
}

export async function customerLogout(): Promise<void> {
  const { customerRequest } = await import("./shopify");

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
    console.error("Error during customer logout:", error);
  } finally {
    await clearCustomerCookie();
  }
}

// Customer Access Token management for passwordless auth
export async function createCustomerAccessToken(
  email: string
): Promise<{ success: boolean; message: string; token?: string }> {
  const { customerRequest } = await import("./shopify");

  // For passwordless auth, we need to use Shopify's Customer Accounts OAuth
  // This requires setting up OAuth in the Shopify Partner dashboard

  // For now, we'll use a temporary approach that creates a customer access token
  // In production, you should use the OAuth flow

  try {
    // Generate a temporary password for the customer
    const tempPassword =
      Math.random().toString(36).slice(-12) +
      Math.random().toString(36).slice(-12);

    // Create a customer access token
    const tokenMutation = /* GraphQL */ `
      mutation customerAccessTokenCreate(
        $input: CustomerAccessTokenCreateInput!
      ) {
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

    const tokenData = await customerRequest<{
      customerAccessTokenCreate: {
        customerAccessToken: {
          accessToken: string;
          expiresAt: string;
        } | null;
        customerUserErrors: Array<{
          code: string;
          field: string;
          message: string;
        }>;
      };
    }>(tokenMutation, {
      input: {
        email: email,
        password: tempPassword,
      },
    });

    if (tokenData.customerAccessTokenCreate.customerUserErrors.length > 0) {
      // Customer might not exist or password is wrong
      // For passwordless auth, we should use OAuth instead
      return {
        success: false,
        message: "Please use the sign-in link sent to your email",
      };
    }

    if (tokenData.customerAccessTokenCreate.customerAccessToken) {
      return {
        success: true,
        message: "Sign-in successful",
        token:
          tokenData.customerAccessTokenCreate.customerAccessToken.accessToken,
      };
    }

    return {
      success: false,
      message: "Failed to create access token",
    };
  } catch (error) {
    console.error("Error creating access token:", error);
    return {
      success: false,
      message: "Failed to sign in",
    };
  }
}
// Handle the customer access token from the email link
export async function handleCustomerAccessToken(
  accessToken: string
): Promise<CustomerAccount | null> {
  const { customerRequest } = await import("./shopify");

  // Use the access token to get customer data
  const customerQuery = /* GraphQL */ `
    query Customer($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        id
        email
        firstName
        lastName
        phone
        acceptsMarketing
        createdAt
        updatedAt
        numberOfOrders
        amountSpent {
          amount
          currencyCode
        }
        verifiedEmail
        validEmailAddress
        tags
        lifetimeDuration
        note
        state
        taxExempt
        taxExemptions
        defaultAddress {
          id
          formattedArea
          address1
          address2
          city
          province
          country
          zip
          company
          firstName
          lastName
          phone
        }
        addresses {
          id
          address1
          address2
          city
          province
          country
          zip
          company
          firstName
          lastName
          phone
        }
        image {
          id
          src
          altText
          width
          height
        }
        canDelete
        orders(first: 5, reverse: true) {
          nodes {
            id
            name
            createdAt
            fulfillmentStatus
            financialStatus
            totalPriceSet {
              shopMoney {
                amount
                currencyCode
              }
            }
            lineItems(first: 3) {
              nodes {
                title
                quantity
                variant {
                  image {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
        metafields(first: 10) {
          nodes {
            id
            namespace
            key
            value
            type
          }
        }
      }
    }
  `;

  try {
    const data = await customerRequest<{
      customer: CustomerAccount;
    }>(customerQuery, { customerAccessToken: accessToken });

    return data.customer;
  } catch (error) {
    console.error("Error fetching customer with access token:", error);
    return null;
  }
}

// Get customer data by email using REST Admin API
export async function getCustomerByEmail(
  email: string
): Promise<CustomerAccount | null> {
  try {
    // First, search for the customer by email using the search endpoint
    const searchUrl = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2025-07/customers/search.json?query=email:${encodeURIComponent(
      email
    )}`;

    const searchResponse = await fetch(searchUrl, {
      headers: {
        "X-Shopify-Access-Token": SHOPIFY_ADMIN_API_ACCESS_TOKEN,
        "Content-Type": "application/json",
      },
    });

    if (!searchResponse.ok) {
      console.error(
        "Failed to search for customer:",
        searchResponse.statusText
      );
      console.error("Response status:", searchResponse.status);
      console.error(
        "Response headers:",
        Object.fromEntries(searchResponse.headers.entries())
      );
      return null;
    }

    const searchData = await searchResponse.json();

    if (!searchData.customers || searchData.customers.length === 0) {
      console.log("No customer found with email:", email);
      console.log("Search response:", searchData);
      return null;
    }

    const customerId = searchData.customers[0].id;

    // Now get the full customer details using the customer endpoint
    const customerUrl = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2025-07/customers/${customerId}.json`;

    const customerResponse = await fetch(customerUrl, {
      headers: {
        "X-Shopify-Access-Token": SHOPIFY_ADMIN_API_ACCESS_TOKEN,
        "Content-Type": "application/json",
      },
    });

    if (!customerResponse.ok) {
      console.error(
        "Failed to fetch customer details:",
        customerResponse.statusText
      );
      return null;
    }

    const customerData = await customerResponse.json();
    const customer = customerData.customer;

    // Transform the REST API response to match our CustomerAccount interface
    return {
      id: customer.id.toString(),
      email: customer.email,
      firstName: customer.first_name,
      lastName: customer.last_name,
      phone: customer.phone,
      acceptsMarketing: customer.accepts_marketing || false,
      createdAt: customer.created_at,
      updatedAt: customer.updated_at,
      numberOfOrders: customer.orders_count,
      amountSpent: customer.total_spent
        ? {
            amount: customer.total_spent,
            currencyCode: customer.currency || "USD",
          }
        : undefined,
      verifiedEmail: customer.verified_email,
      validEmailAddress: customer.verified_email, // Assuming verified email means valid
      tags: customer.tags
        ? customer.tags.split(",").map((tag: string) => tag.trim())
        : [],
      lifetimeDuration: customer.lifetime_duration,
      note: customer.note,
      state: customer.state,
      taxExempt: customer.tax_exempt,
      taxExemptions: customer.tax_exemptions || [],
      defaultAddress: customer.default_address
        ? {
            id: customer.default_address.id?.toString(),
            formattedArea: `${customer.default_address.city}, ${customer.default_address.province} ${customer.default_address.zip}`,
            address1: customer.default_address.address1,
            address2: customer.default_address.address2,
            city: customer.default_address.city,
            province: customer.default_address.province,
            country: customer.default_address.country,
            zip: customer.default_address.zip,
            company: customer.default_address.company,
            firstName: customer.default_address.first_name,
            lastName: customer.default_address.last_name,
            phone: customer.default_address.phone,
          }
        : undefined,
      addresses:
        customer.addresses?.map((address: any) => ({
          id: address.id?.toString(),
          address1: address.address1,
          address2: address.address2,
          city: address.city,
          province: address.province,
          country: address.country,
          zip: address.zip,
          company: address.company,
          firstName: address.first_name,
          lastName: address.last_name,
          phone: address.phone,
        })) || [],
      image: customer.image
        ? {
            id: customer.image.id?.toString(),
            src: customer.image.src,
            altText: customer.image.alt,
            width: customer.image.width,
            height: customer.image.height,
          }
        : undefined,
      canDelete: customer.can_delete,
      // Note: Orders would need a separate API call to /customers/{customer_id}/orders.json
      orders: {
        nodes: [],
      },
      metafields: {
        nodes: [],
      },
    };
  } catch (error) {
    console.error(
      "Error fetching customer by email via REST Admin API:",
      error
    );
    return null;
  }
}

// Update customer information using REST Admin API
export async function updateCustomer(
  customerId: string,
  updates: {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    note?: string;
    tags?: string;
    accepts_marketing?: boolean;
    tax_exempt?: boolean;
    tax_exemptions?: string[];
  }
): Promise<CustomerAccount | null> {
  try {
    const updateUrl = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2025-07/customers/${customerId}.json`;

    const updateResponse = await fetch(updateUrl, {
      method: "PUT",
      headers: {
        "X-Shopify-Access-Token": SHOPIFY_ADMIN_API_ACCESS_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer: {
          id: customerId,
          ...updates,
        },
      }),
    });

    if (!updateResponse.ok) {
      console.error("Failed to update customer:", updateResponse.statusText);
      return null;
    }

    const updateData = await updateResponse.json();
    const customer = updateData.customer;

    // Transform the response to match our CustomerAccount interface
    return {
      id: customer.id.toString(),
      email: customer.email,
      firstName: customer.first_name,
      lastName: customer.last_name,
      phone: customer.phone,
      acceptsMarketing: customer.accepts_marketing || false,
      createdAt: customer.created_at,
      updatedAt: customer.updated_at,
      numberOfOrders: customer.orders_count,
      amountSpent: customer.total_spent
        ? {
            amount: customer.total_spent,
            currencyCode: customer.currency || "USD",
          }
        : undefined,
      verifiedEmail: customer.verified_email,
      validEmailAddress: customer.verified_email,
      tags: customer.tags
        ? customer.tags.split(",").map((tag: string) => tag.trim())
        : [],
      lifetimeDuration: customer.lifetime_duration,
      note: customer.note,
      state: customer.state,
      taxExempt: customer.tax_exempt,
      taxExemptions: customer.tax_exemptions || [],
      defaultAddress: customer.default_address
        ? {
            id: customer.default_address.id?.toString(),
            formattedArea: `${customer.default_address.city}, ${customer.default_address.province} ${customer.default_address.zip}`,
            address1: customer.default_address.address1,
            address2: customer.default_address.address2,
            city: customer.default_address.city,
            province: customer.default_address.province,
            country: customer.default_address.country,
            zip: customer.default_address.zip,
            company: customer.default_address.company,
            firstName: customer.default_address.first_name,
            lastName: customer.default_address.last_name,
            phone: customer.default_address.phone,
          }
        : undefined,
      addresses:
        customer.addresses?.map((address: any) => ({
          id: address.id?.toString(),
          address1: address.address1,
          address2: address.address2,
          city: address.city,
          province: address.province,
          country: address.country,
          zip: address.zip,
          company: address.company,
          firstName: address.first_name,
          lastName: address.last_name,
          phone: address.phone,
        })) || [],
      image: customer.image
        ? {
            id: customer.image.id?.toString(),
            src: customer.image.src,
            altText: customer.image.alt,
            width: customer.image.width,
            height: customer.image.height,
          }
        : undefined,
      canDelete: customer.can_delete,
      orders: {
        nodes: [],
      },
      metafields: {
        nodes: [],
      },
    };
  } catch (error) {
    console.error("Error updating customer via REST Admin API:", error);
    return null;
  }
}
