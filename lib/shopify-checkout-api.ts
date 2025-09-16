import { shopify } from "./shopify";
import { calculateTax, TaxCalculation } from "./tax-calculator";
// import {
//   createAdminCheckout,
//   addTaxAttributesToAdminCheckout,
// } from "./shopify-admin-checkout";

/**
 * Enhanced Shopify Checkout API Implementation
 * This allows full control over checkout while using Shopify's payment processing
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
    province: string;
    zip: string;
    country: string;
    phone?: string;
  };
  email?: string;
  customAttributes?: Array<{
    key: string;
    value: string;
  }>;
}

export interface CheckoutResult {
  checkout: any;
  taxCalculation: TaxCalculation;
  webUrl: string;
}

/**
 * Create a checkout with comprehensive tax calculation using Admin API
 */
export async function createCustomCheckoutWithTax(
  input: CheckoutInput,
  subtotal: number
): Promise<CheckoutResult> {
  // Calculate tax based on state
  const stateCode = input.shippingAddress?.province || "";
  const taxCalculation = calculateTax(subtotal, stateCode);

  // Fix: Ensure shippingAddress uses 'state' instead of 'province' to match CheckoutInput type
  const { shippingAddress, ...restInput } = input;
  const fixedShippingAddress = shippingAddress
    ? {
        ...shippingAddress,
        state: shippingAddress.province,
      }
    : undefined;

  // Create checkout using Admin API
  // const checkout = await createAdminCheckout({
  //   ...restInput,
  //   shippingAddress: fixedShippingAddress,
  //   customAttributes: [
  //     ...(input.customAttributes || []),
  //     {
  //       key: "calculated_subtotal",
  //       value: subtotal.toString(),
  //     },
  //     {
  //       key: "calculated_total",
  //       value: taxCalculation.total.toString(),
  //     },
  //     {
  //       key: "tax_breakdown",
  //       value: JSON.stringify({
  //         stateTax: taxCalculation.stateTax,
  //         stateTaxRate: taxCalculation.stateTaxRate,
  //         cannabisTax: taxCalculation.cannabisTax,
  //         cannabisTaxRate: taxCalculation.cannabisTaxRate,
  //         totalTax: taxCalculation.totalTax,
  //       }),
  //     },
  //   ],
  // });

  // // Add additional tax attributes
  // await addTaxAttributesToAdminCheckout(checkout.id, taxCalculation);

  // Temporary mock checkout for testing
  const checkout = {
    id: "mock-checkout-id",
    webUrl: "https://checkout.shopify.com/mock-checkout",
    totalPrice: {
      amount: taxCalculation.total.toString(),
      currencyCode: "USD",
    },
    subtotalPrice: { amount: subtotal.toString(), currencyCode: "USD" },
    totalTax: {
      amount: (taxCalculation.stateTax + taxCalculation.cannabisTax).toString(),
      currencyCode: "USD",
    },
  };

  return {
    checkout,
    taxCalculation,
    webUrl: checkout.webUrl,
  };
}

/**
 * Get cart checkout URL (Storefront API doesn't support creating checkouts)
 * We'll use the existing cart and redirect to its checkout URL
 */
export async function getCartCheckoutUrl(cartId: string): Promise<string> {
  const query = /* GraphQL */ `
    query GetCart($id: ID!) {
      cart(id: $id) {
        id
        checkoutUrl
        totalQuantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
      }
    }
  `;

  try {
    const { data, errors } = await shopify.request(query, {
      variables: { id: cartId },
    });

    if (errors) {
      console.error("GraphQL errors:", errors);
      throw new Error(`GraphQL errors: ${JSON.stringify(errors)}`);
    }

    if (!data.cart) {
      throw new Error("Cart not found");
    }

    if (!data.cart.checkoutUrl) {
      throw new Error("Checkout URL not available");
    }

    return data.cart.checkoutUrl;
  } catch (error) {
    console.error("Error getting cart checkout URL:", error);
    throw error;
  }
}

// Note: The following functions are not used in the current implementation
// since we're using the existing cart system instead of creating new checkouts

/**
 * Add tax information as custom attributes to checkout
 * Since we're using custom checkout, we don't need tax line items
 */
export async function addTaxAttributesToCheckout(
  checkoutId: string,
  taxCalculation: TaxCalculation
): Promise<any> {
  const mutation = /* GraphQL */ `
    mutation CheckoutAttributesUpdateV2(
      $checkoutId: ID!
      $input: CheckoutAttributesUpdateV2Input!
    ) {
      checkoutAttributesUpdateV2(checkoutId: $checkoutId, input: $input) {
        checkout {
          id
          customAttributes {
            key
            value
          }
        }
        checkoutUserErrors {
          field
          message
        }
      }
    }
  `;

  try {
    const { data, errors } = await shopify.request(mutation, {
      variables: {
        checkoutId,
        input: {
          customAttributes: [
            {
              key: "state_tax_amount",
              value: taxCalculation.stateTax.toString(),
            },
            {
              key: "state_tax_rate",
              value: taxCalculation.stateTaxRate.toString(),
            },
            {
              key: "cannabis_tax_amount",
              value: taxCalculation.cannabisTax.toString(),
            },
            {
              key: "cannabis_tax_rate",
              value: taxCalculation.cannabisTaxRate.toString(),
            },
            {
              key: "total_tax_amount",
              value: taxCalculation.totalTax.toString(),
            },
            {
              key: "tax_calculation_method",
              value: "custom_checkout",
            },
          ],
        },
      },
    });

    if (errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(errors)}`);
    }

    if (data.checkoutAttributesUpdateV2.checkoutUserErrors?.length > 0) {
      throw new Error(
        data.checkoutAttributesUpdateV2.checkoutUserErrors
          .map((e: any) => e.message)
          .join(", ")
      );
    }

    return data.checkoutAttributesUpdateV2.checkout;
  } catch (error) {
    console.error("Error adding tax attributes to checkout:", error);
    throw error;
  }
}

/**
 * Add line items to checkout
 */
export async function addLineItemsToCheckout(
  checkoutId: string,
  lineItems: Array<{
    variantId: string;
    quantity: number;
    customAttributes?: Array<{ key: string; value: string }>;
  }>
): Promise<any> {
  const mutation = /* GraphQL */ `
    mutation CheckoutLineItemsAdd(
      $checkoutId: ID!
      $lineItems: [CheckoutLineItemInput!]!
    ) {
      checkoutLineItemsAdd(checkoutId: $checkoutId, lineItems: $lineItems) {
        checkout {
          id
          webUrl
          totalPrice {
            amount
            currencyCode
          }
          subtotalPrice {
            amount
            currencyCode
          }
          totalTax {
            amount
            currencyCode
          }
          lineItems(first: 50) {
            nodes {
              id
              title
              quantity
              variant {
                id
                title
                price {
                  amount
                  currencyCode
                }
                product {
                  title
                }
              }
            }
          }
        }
        checkoutUserErrors {
          field
          message
        }
      }
    }
  `;

  try {
    const { data, errors } = await shopify.request(mutation, {
      variables: {
        checkoutId,
        lineItems: lineItems.map((item) => ({
          variantId: item.variantId,
          quantity: item.quantity,
          customAttributes: item.customAttributes,
        })),
      },
    });

    if (errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(errors)}`);
    }

    if (data.checkoutLineItemsAdd.checkoutUserErrors?.length > 0) {
      throw new Error(
        data.checkoutLineItemsAdd.checkoutUserErrors
          .map((e: any) => e.message)
          .join(", ")
      );
    }

    return data.checkoutLineItemsAdd.checkout;
  } catch (error) {
    console.error("Error adding tax to checkout:", error);
    throw error;
  }
}

/**
 * Complete the checkout (redirect to payment)
 */
export async function completeCheckout(checkoutId: string): Promise<string> {
  const mutation = /* GraphQL */ `
    mutation CheckoutComplete($checkoutId: ID!) {
      checkoutComplete(checkoutId: $checkoutId) {
        checkout {
          id
          webUrl
          order {
            id
            orderNumber
          }
        }
        checkoutUserErrors {
          field
          message
        }
      }
    }
  `;

  try {
    const { data, errors } = await shopify.request(mutation, {
      variables: { checkoutId },
    });

    if (errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(errors)}`);
    }

    if (data.checkoutComplete.checkoutUserErrors?.length > 0) {
      throw new Error(
        data.checkoutComplete.checkoutUserErrors
          .map((e: any) => e.message)
          .join(", ")
      );
    }

    return data.checkoutComplete.checkout.webUrl;
  } catch (error) {
    console.error("Error completing checkout:", error);
    throw error;
  }
}
