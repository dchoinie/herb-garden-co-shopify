import { shopify } from "./shopify";
import type { Cart } from "./cart-service-client";

// GraphQL queries and mutations for cart operations
const CART_CREATE_MUTATION = /* GraphQL */ `
  mutation CartCreate($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
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
          totalTaxAmount {
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
            attributes {
              key
              value
            }
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

const CART_LINES_ADD_MUTATION = /* GraphQL */ `
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
          totalTaxAmount {
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
            attributes {
              key
              value
            }
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

const CART_LINES_UPDATE_MUTATION = /* GraphQL */ `
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
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
          totalTaxAmount {
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
            attributes {
              key
              value
            }
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

const CART_LINES_REMOVE_MUTATION = /* GraphQL */ `
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
          totalTaxAmount {
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
            attributes {
              key
              value
            }
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

const GET_CART_QUERY = /* GraphQL */ `
  query Cart($cartId: ID!) {
    cart(id: $cartId) {
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
        totalTaxAmount {
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
          attributes {
            key
            value
          }
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
  }
`;

class CartService {
  async createCart(variantId: string, quantity: number = 1): Promise<Cart> {
    try {
      const { data, errors } = await shopify.request(CART_CREATE_MUTATION, {
        variables: {
          lines: [{ merchandiseId: variantId, quantity }],
        },
      });

      if (errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(errors)}`);
      }

      if (data.cartCreate.userErrors && data.cartCreate.userErrors.length > 0) {
        throw new Error(
          data.cartCreate.userErrors.map((e: any) => e.message).join(", ")
        );
      }

      return data.cartCreate.cart;
    } catch (error) {
      console.error("Error creating cart:", error);
      throw error;
    }
  }

  async addToCart(
    cartId: string,
    variantId: string,
    quantity: number = 1
  ): Promise<Cart> {
    try {
      const { data, errors } = await shopify.request(CART_LINES_ADD_MUTATION, {
        variables: {
          cartId,
          lines: [{ merchandiseId: variantId, quantity }],
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
      console.error("Error adding to cart:", error);
      throw error;
    }
  }

  async updateCartLine(
    cartId: string,
    lineId: string,
    quantity: number
  ): Promise<Cart> {
    try {
      const { data, errors } = await shopify.request(
        CART_LINES_UPDATE_MUTATION,
        {
          variables: {
            cartId,
            lines: [{ id: lineId, quantity }],
          },
        }
      );

      if (errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(errors)}`);
      }

      if (
        data.cartLinesUpdate.userErrors &&
        data.cartLinesUpdate.userErrors.length > 0
      ) {
        throw new Error(
          data.cartLinesUpdate.userErrors.map((e: any) => e.message).join(", ")
        );
      }

      return data.cartLinesUpdate.cart;
    } catch (error) {
      console.error("Error updating cart line:", error);
      throw error;
    }
  }

  async removeFromCart(cartId: string, lineIds: string[]): Promise<Cart> {
    try {
      const { data, errors } = await shopify.request(
        CART_LINES_REMOVE_MUTATION,
        {
          variables: {
            cartId,
            lineIds,
          },
        }
      );

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
      console.error("Error removing from cart:", error);
      throw error;
    }
  }

  async getCart(cartId: string): Promise<Cart | null> {
    try {
      const { data, errors } = await shopify.request(GET_CART_QUERY, {
        variables: { cartId },
      });

      if (errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(errors)}`);
      }

      return data.cart;
    } catch (error) {
      console.error("Error getting cart:", error);
      return null;
    }
  }
}

export const cartService = new CartService();
