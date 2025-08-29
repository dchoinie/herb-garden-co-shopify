import { shopify } from "./shopify";

export interface MinnesotaTaxInfo {
  isMinnesota: boolean;
  taxAmount: string;
  taxPercentage: number;
}

export const MINNESOTA_TAX_RATE = 0.15; // 15%
export const MINNESOTA_STATE_CODE = "MN";

// TODO: Replace this with the actual variant ID from your Shopify admin
// after creating the Minnesota Tax product
export const MINNESOTA_TAX_VARIANT_ID =
  "gid://shopify/ProductVariant/YOUR_VARIANT_ID_HERE";

/**
 * Check if a shipping address is in Minnesota
 */
export function isMinnesotaAddress(shippingAddress: {
  province?: string;
  provinceCode?: string;
  country?: string;
  countryCode?: string;
}): boolean {
  if (!shippingAddress) return false;

  // Check if the address is in Minnesota
  return (
    shippingAddress.provinceCode === MINNESOTA_STATE_CODE ||
    shippingAddress.province === "Minnesota" ||
    (shippingAddress.provinceCode === "MN" &&
      shippingAddress.countryCode === "US")
  );
}

/**
 * Calculate Minnesota hemp/cannabis tax amount
 */
export function calculateMinnesotaTax(subtotalAmount: string): string {
  const subtotal = parseFloat(subtotalAmount);
  if (isNaN(subtotal) || subtotal <= 0) return "0.00";

  const taxAmount = subtotal * MINNESOTA_TAX_RATE;
  return taxAmount.toFixed(2);
}

/**
 * Set cart attributes for Minnesota tax calculation
 */
export async function setMinnesotaTaxAttributes(
  cartId: string,
  shippingAddress?: any
): Promise<any> {
  const isMinnesota = shippingAddress
    ? isMinnesotaAddress(shippingAddress)
    : false;

  const mutation = /* GraphQL */ `
    mutation CartAttributesUpdate(
      $cartId: ID!
      $attributes: [AttributeInput!]!
    ) {
      cartAttributesUpdate(cartId: $cartId, attributes: $attributes) {
        cart {
          id
          checkoutUrl
          totalQuantity
          cost {
            subtotalAmount {
              amount
              currencyCode
            }
            totalAmount {
              amount
              currencyCode
            }
          }
          lines(first: 50) {
            nodes {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product {
                    title
                    handle
                    featuredImage {
                      url
                      width
                      height
                      altText
                    }
                  }
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                  currentlyNotInStock
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  try {
    const attributes = [
      {
        key: "minnesota_tax_eligible",
        value: isMinnesota.toString(),
      },
    ];

    if (isMinnesota) {
      // Get current cart subtotal to calculate tax
      const getCartQuery = /* GraphQL */ `
        query Cart($cartId: ID!) {
          cart(id: $cartId) {
            id
            cost {
              subtotalAmount {
                amount
                currencyCode
              }
            }
          }
        }
      `;

      const { data: cartData } = await shopify.request(getCartQuery, {
        variables: { cartId },
      });

      const subtotalAmount = cartData.cart.cost.subtotalAmount.amount;
      const taxAmount = calculateMinnesotaTax(subtotalAmount);

      attributes.push(
        {
          key: "minnesota_tax_amount",
          value: taxAmount,
        },
        {
          key: "minnesota_tax_rate",
          value: (MINNESOTA_TAX_RATE * 100).toString(),
        }
      );
    }

    const { data, errors } = await shopify.request(mutation, {
      variables: {
        cartId,
        attributes,
      },
    });

    if (errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(errors)}`);
    }

    if (
      data.cartAttributesUpdate.userErrors &&
      data.cartAttributesUpdate.userErrors.length > 0
    ) {
      throw new Error(
        data.cartAttributesUpdate.userErrors
          .map((e: any) => e.message)
          .join(", ")
      );
    }

    return data.cartAttributesUpdate.cart;
  } catch (error) {
    console.error("Error setting Minnesota tax attributes:", error);
    throw error;
  }
}

/**
 * Get Minnesota tax information from cart attributes
 */
export function getMinnesotaTaxFromCart(cart: any): MinnesotaTaxInfo | null {
  if (!cart?.attributes) return null;

  const taxEligibleAttr = cart.attributes.find(
    (attr: any) => attr.key === "minnesota_tax_eligible"
  );
  const taxAmountAttr = cart.attributes.find(
    (attr: any) => attr.key === "minnesota_tax_amount"
  );
  const taxRateAttr = cart.attributes.find(
    (attr: any) => attr.key === "minnesota_tax_rate"
  );

  if (!taxEligibleAttr || taxEligibleAttr.value !== "true") {
    return null;
  }

  return {
    isMinnesota: true,
    taxAmount: taxAmountAttr?.value || "0.00",
    taxPercentage: parseFloat(taxRateAttr?.value || "15"),
  };
}

/**
 * Add Minnesota tax line item to cart
 */
export async function addMinnesotaTaxToCart(
  cartId: string,
  subtotalAmount: string
): Promise<any> {
  const taxAmount = calculateMinnesotaTax(subtotalAmount);

  if (parseFloat(taxAmount) <= 0) {
    return null; // No tax to add
  }

  const mutation = /* GraphQL */ `
    mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          totalQuantity
          cost {
            subtotalAmount {
              amount
              currencyCode
            }
            totalAmount {
              amount
              currencyCode
            }
          }
          attributes {
            key
            value
          }
          lines(first: 50) {
            nodes {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product {
                    title
                    handle
                    featuredImage {
                      url
                      width
                      height
                      altText
                    }
                  }
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                  currentlyNotInStock
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  try {
    const { data, errors } = await shopify.request(mutation, {
      variables: {
        cartId,
        lines: [
          {
            merchandiseId: MINNESOTA_TAX_VARIANT_ID,
            quantity: 1,
            attributes: [
              {
                key: "tax_type",
                value: "minnesota_hemp_tax",
              },
              {
                key: "tax_amount",
                value: taxAmount,
              },
              {
                key: "tax_percentage",
                value: (MINNESOTA_TAX_RATE * 100).toString(),
              },
            ],
          },
        ],
      },
    });

    if (errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(errors)}`);
    }

    if (
      data.cartLinesAdd.userErrors &&
      data.cartLinesAdd.userErrors.length > 0
    ) {
      throw new Error(
        data.cartLinesAdd.userErrors.map((e: any) => e.message).join(", ")
      );
    }

    return data.cartLinesAdd.cart;
  } catch (error) {
    console.error("Error adding Minnesota tax to cart:", error);
    throw error;
  }
}

/**
 * Remove Minnesota tax line items from cart
 */
export async function removeMinnesotaTaxFromCart(cartId: string): Promise<any> {
  // First, get the cart to find tax line items
  const getCartQuery = /* GraphQL */ `
    query Cart($cartId: ID!) {
      cart(id: $cartId) {
        id
        lines(first: 50) {
          nodes {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
              }
            }
            attributes {
              key
              value
            }
          }
        }
      }
    }
  `;

  try {
    const { data: cartData } = await shopify.request(getCartQuery, {
      variables: { cartId },
    });

    // Find tax line items
    const taxLineIds = cartData.cart.lines.nodes
      .filter((line: any) => {
        const taxTypeAttr = line.attributes?.find(
          (attr: any) => attr.key === "tax_type"
        );
        return taxTypeAttr && taxTypeAttr.value === "minnesota_hemp_tax";
      })
      .map((line: any) => line.id);

    if (taxLineIds.length === 0) {
      return null; // No tax items to remove
    }

    // Remove tax line items
    const removeMutation = /* GraphQL */ `
      mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart {
            id
            checkoutUrl
            totalQuantity
            cost {
              subtotalAmount {
                amount
                currencyCode
              }
              totalAmount {
                amount
                currencyCode
              }
            }
            attributes {
              key
              value
            }
            lines(first: 50) {
              nodes {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product {
                      title
                      handle
                      featuredImage {
                        url
                        width
                        height
                        altText
                      }
                    }
                    price {
                      amount
                      currencyCode
                    }
                    availableForSale
                    currentlyNotInStock
                  }
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const { data, errors } = await shopify.request(removeMutation, {
      variables: {
        cartId,
        lineIds: taxLineIds,
      },
    });

    if (errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(errors)}`);
    }

    if (
      data.cartLinesRemove.userErrors &&
      data.cartLinesRemove.userErrors.length > 0
    ) {
      throw new Error(
        data.cartLinesRemove.userErrors.map((e: any) => e.message).join(", ")
      );
    }

    return data.cartLinesRemove.cart;
  } catch (error) {
    console.error("Error removing Minnesota tax from cart:", error);
    throw error;
  }
}

/**
 * Update Minnesota tax based on current cart state and shipping address
 */
export async function updateMinnesotaTax(
  cartId: string,
  shippingAddress?: any
): Promise<any> {
  try {
    // First, remove any existing tax items
    await removeMinnesotaTaxFromCart(cartId);

    // Set cart attributes for tracking
    await setMinnesotaTaxAttributes(cartId, shippingAddress);

    // Check if shipping address is in Minnesota
    if (!shippingAddress || !isMinnesotaAddress(shippingAddress)) {
      return null; // No tax needed
    }

    // Get current cart to calculate subtotal
    const getCartQuery = /* GraphQL */ `
      query Cart($cartId: ID!) {
        cart(id: $cartId) {
          id
          cost {
            subtotalAmount {
              amount
              currencyCode
            }
          }
        }
      }
    `;

    const { data: cartData } = await shopify.request(getCartQuery, {
      variables: { cartId },
    });

    const subtotalAmount = cartData.cart.cost.subtotalAmount.amount;

    // Add tax if subtotal is greater than 0
    if (parseFloat(subtotalAmount) > 0) {
      return await addMinnesotaTaxToCart(cartId, subtotalAmount);
    }

    return null;
  } catch (error) {
    console.error("Error updating Minnesota tax:", error);
    throw error;
  }
}
