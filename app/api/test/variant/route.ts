import { NextRequest, NextResponse } from "next/server";
import { shopify } from "@/lib/shopify";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const variantId = searchParams.get("id");

  if (!variantId) {
    return NextResponse.json(
      {
        error: "Variant ID is required. Use ?id=YOUR_VARIANT_ID",
      },
      { status: 400 }
    );
  }

  try {
    const query = /* GraphQL */ `
      query ProductVariant($id: ID!) {
        node(id: $id) {
          ... on ProductVariant {
            id
            title
            price {
              amount
              currencyCode
            }
            availableForSale
            currentlyNotInStock
            product {
              id
              title
              handle
              productType
              vendor
              tags
              createdAt
              updatedAt
              publishedAt
              onlineStoreUrl
              options {
                id
                name
                values
              }
              variants(first: 10) {
                nodes {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                  currentlyNotInStock
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
          }
        }
      }
    `;

    const { data, errors } = await shopify.request(query, {
      variables: { id: variantId },
    });

    if (errors) {
      return NextResponse.json(
        {
          error: "GraphQL errors",
          details: errors,
        },
        { status: 500 }
      );
    }

    if (!data.node) {
      return NextResponse.json(
        {
          error: "Product variant not found",
          variantId: variantId,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      variant: data.node,
    });
  } catch (error) {
    console.error("Error fetching variant:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch variant",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
