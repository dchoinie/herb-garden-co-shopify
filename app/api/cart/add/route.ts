import { NextRequest, NextResponse } from "next/server";
import { cartService } from "@/lib/cart-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cartId, variantId, quantity = 1 } = body;

    if (!cartId || !variantId) {
      return NextResponse.json(
        { error: "Cart ID and Variant ID are required" },
        { status: 400 }
      );
    }

    const cart = await cartService.addToCart(cartId, variantId, quantity);

    return NextResponse.json({ cart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to add item to cart",
      },
      { status: 500 }
    );
  }
}
