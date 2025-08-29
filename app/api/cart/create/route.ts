import { NextRequest, NextResponse } from "next/server";
import { cartService } from "@/lib/cart-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { variantId, quantity = 1 } = body;

    if (!variantId) {
      return NextResponse.json(
        { error: "Variant ID is required" },
        { status: 400 }
      );
    }

    const cart = await cartService.createCart(variantId, quantity);

    return NextResponse.json({ cart });
  } catch (error) {
    console.error("Error creating cart:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create cart",
      },
      { status: 500 }
    );
  }
}
