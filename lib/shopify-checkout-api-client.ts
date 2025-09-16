/**
 * Client-side Shopify Checkout API
 * Makes HTTP requests to server-side API routes instead of direct imports
 */

export interface CheckoutInput {
  lineItems: Array<{
    variantId: string;
    quantity: number;
  }>;
  shippingAddress?: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  email?: string;
  customAttributes?: Array<{
    key: string;
    value: string;
  }>;
}

export interface CheckoutResult {
  checkout: any;
  taxCalculation: any;
  webUrl: string;
}

/**
 * Create a checkout with comprehensive tax calculation
 */
export async function createCustomCheckoutWithTax(
  input: CheckoutInput,
  subtotal: number
): Promise<CheckoutResult> {
  try {
    const requestBody = {
      ...input,
      subtotal,
    };
    console.log("Sending checkout request:", requestBody);

    const response = await fetch("/api/checkout/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Checkout API error:", errorData);
      throw new Error(errorData.error || "Failed to create checkout");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error creating checkout:", error);
    throw error;
  }
}
