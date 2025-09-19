import { NextRequest, NextResponse } from "next/server";
import { squareCatalogService } from "@/lib/square-catalog";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "100");
    const cursor = searchParams.get("cursor") || undefined;

    const response = await squareCatalogService.getAllCategories(limit, cursor);

    if (!response.success) {
      return NextResponse.json(
        {
          success: false,
          error: response.error || "Failed to fetch categories",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
