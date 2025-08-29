import { NextRequest, NextResponse } from "next/server";
import { cartService } from "@/lib/cart-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cartId, lineIds } = body;

    if (!cartId || !lineIds || !Array.isArray(lineIds)) {
      return NextResponse.json(
        { error: "Cart ID and line IDs array are required" },
        { status: 400 }
      );
    }

    const cart = await cartService.removeFromCart(cartId, lineIds);

    return NextResponse.json({ cart });
  } catch (error) {
    console.error("Error removing from cart:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to remove item from cart",
      },
      { status: 500 }
    );
  }
}
