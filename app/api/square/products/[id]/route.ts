import { NextRequest, NextResponse } from "next/server";
import { getCatalogApi, isSquareConfigured } from "@/lib/square";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isSquareConfigured()) {
      return NextResponse.json(
        { error: "Square client not configured" },
        { status: 500 }
      );
    }

    const { id } = await params;

    // Get the catalog API and retrieve the specific item from Square
    const catalogApi = getCatalogApi();
    const response = await catalogApi.retrieveCatalogObject(id, true);

    if (!response.result?.object) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const item = response.result.object;
    const itemData = item.itemData;
    const variations = itemData?.variations || [];

    // Transform Square item to our product format
    const product = {
      id: item.id,
      handle:
        itemData?.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || item.id,
      title: itemData?.name || "Untitled Product",
      description: itemData?.description || "",
      descriptionHtml: itemData?.description || "",
      vendor: itemData?.categoryId || "",
      productType: itemData?.categoryId || "",
      tags: itemData?.categoryId ? [itemData.categoryId] : [],
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: item.updatedAt || new Date().toISOString(),
      publishedAt: item.createdAt || new Date().toISOString(),
      status: "ACTIVE",
      featuredImage:
        itemData?.imageIds && itemData.imageIds.length > 0
          ? {
              url: `https://square-cdn.com/${itemData.imageIds[0]}`,
              altText: itemData.name || "Product Image",
              width: 800,
              height: 800,
            }
          : undefined,
      images: itemData?.imageIds
        ? itemData.imageIds.map((imageId: string) => ({
            url: `https://square-cdn.com/${imageId}`,
            altText: itemData.name || "Product Image",
            width: 800,
            height: 800,
          }))
        : [],
      variants: variations.map((variation: any) => {
        const price = variation.itemVariationData?.priceMoney;
        return {
          id: variation.id,
          title: variation.itemVariationData?.name || "Default",
          price: {
            amount: price ? (price.amount / 100).toFixed(2) : "0.00",
            currencyCode: price?.currency || "USD",
          },
          availableForSale:
            variation.itemVariationData?.availableForBooking !== false,
          currentlyNotInStock:
            variation.itemVariationData?.availableForBooking === false,
          quantityAvailable:
            variation.itemVariationData?.availableForBooking !== false
              ? 999
              : 0,
          selectedOptions: [],
          sku: variation.itemVariationData?.sku || "",
        };
      }),
      options: [],
      seo: {
        title: itemData?.name,
        description: itemData?.description,
      },
    };

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching Square product:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
