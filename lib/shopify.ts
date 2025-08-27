import 'server-only';
import { createStorefrontApiClient } from '@shopify/storefront-api-client';

export const shopify = createStorefrontApiClient({
  storeDomain: process.env.SHOPIFY_STORE_DOMAIN!,
  apiVersion: process.env.SHOPIFY_API_VERSION || '2025-07',
  publicAccessToken: process.env.SHOPIFY_STOREFRONT_API_TOKEN!,
});

// Helper function to make authenticated customer requests
export async function customerRequest<T>(
  query: string, 
  variables?: Record<string, any>, 
  accessToken?: string
): Promise<T> {
  const headers: Record<string, string> = {};
  
  if (accessToken) {
    headers['X-Shopify-Storefront-Access-Token'] = accessToken;
  }

  const { data, errors } = await shopify.request(query, { 
    variables,
    headers: Object.keys(headers).length > 0 ? headers : undefined
  });
  
  if (errors) {
    const errorMessages = Array.isArray(errors) 
      ? errors.map((e: any) => e.message).join('; ')
      : String(errors);
    throw new Error(errorMessages);
  }
  
  return data as T;
}

async function gql<T>(query: string, variables?: Record<string, any>): Promise<T> {
  const { data, errors } = await shopify.request(query, { variables });
  if (errors) {
    const errorMessages = Array.isArray(errors) 
      ? errors.map((e: any) => e.message).join('; ')
      : String(errors);
    throw new Error(errorMessages);
  }
  return data as T;
}

export async function listProducts(limit = 12) {
  const q = /* GraphQL */ `
    query Products($first: Int!) {
      products(first: $first) {
        nodes {
          id
          handle
          title
          featuredImage { url altText width height }
          priceRange { minVariantPrice { amount currencyCode } }
        }
      }
    }
  `;
  const data = await gql<{ products: { nodes: any[] } }>(q, { first: limit });
  return data.products.nodes;
}

export async function getProductByHandle(handle: string) {
  const q = /* GraphQL */ `
    query Product($handle: String!) {
      product(handle: $handle) {
        id
        title
        description
        featuredImage { url altText width height }
        images(first: 6) { nodes { url altText width height } }
        variants(first: 20) {
          nodes {
            id
            title
            availableForSale
            price { amount currencyCode }
          }
        }
      }
    }
  `;
  const data = await gql<{ product: any }>(q, { handle });
  return data.product;
}

export async function cartCreate(variantId: string, quantity = 1) {
  const q = /* GraphQL */ `
    mutation CartCreate($lines: [CartLineInput!]!) {
      cartCreate(input: { lines: $lines }) {
        cart {
          id
          checkoutUrl
        }
        userErrors { field message }
      }
    }
  `;
  const data = await gql<{ cartCreate: { cart: { id: string; checkoutUrl: string } } }>(q, {
    lines: [{ merchandiseId: variantId, quantity }],
  });
  return data.cartCreate.cart;
}

export async function cartLinesAdd(cartId: string, variantId: string, quantity = 1) {
  const q = /* GraphQL */ `
    mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { id checkoutUrl }
        userErrors { field message }
      }
    }
  `;
  const data = await gql<{ cartLinesAdd: { cart: { id: string; checkoutUrl: string } } }>(q, {
    cartId,
    lines: [{ merchandiseId: variantId, quantity }],
  });
  return data.cartLinesAdd.cart;
}

export async function getCart(cartId: string) {
  const q = /* GraphQL */ `
    query Cart($cartId: ID!) {
      cart(id: $cartId) {
        id
        checkoutUrl
        totalQuantity
        cost {
          subtotalAmount { amount currencyCode }
          totalAmount { amount currencyCode }
        }
        lines(first: 50) {
          nodes {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                product { title handle featuredImage { url width height altText } }
                price { amount currencyCode }
              }
            }
          }
        }
      }
    }
  `;
  const data = await gql<{ cart: any }>(q, { cartId });
  return data.cart;
}

export async function getCollectionByHandle(handle: string) {
  const q = /* GraphQL */ `
    query Collection($handle: String!) {
      collection(handle: $handle) {
        id
        title
        description
        products(first: 10) {
          nodes {
            id
            handle
            title
            featuredImage { 
              url 
              altText 
              width 
              height 
            }
            priceRange { 
              minVariantPrice { 
                amount 
                currencyCode 
              } 
            }
          }
        }
      }
    }
  `;
  const data = await gql<{ collection: any }>(q, { handle });
  return data.collection;
}


