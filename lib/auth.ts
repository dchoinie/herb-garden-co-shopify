import "server-only";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
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

// Shopify Customer Account API helpers
export async function getCustomerAccount(
  customerId: string
): Promise<CustomerAccount | null> {
  const { shopify } = await import("./shopify");

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
      variables: { id: customerId },
    });
    return data.customer;
  } catch (error) {
    console.error("Error fetching customer:", error);
    return null;
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

export async function getCustomerOrders(
  customerId: string
): Promise<any[] | null> {
  const { customerRequest } = await import("./shopify");

  const query = /* GraphQL */ `
    query CustomerOrders($customerId: ID!) {
      customer(id: $customerId) {
        orders(first: 50) {
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
            lineItems(first: 10) {
              nodes {
                title
                quantity
                originalTotalSet {
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
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
      }
    }
  `;

  try {
    const data = await customerRequest<{
      customer: {
        orders: {
          nodes: any[];
        };
      };
    }>(query, { customerId });

    return data.customer.orders.nodes;
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    return null;
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
