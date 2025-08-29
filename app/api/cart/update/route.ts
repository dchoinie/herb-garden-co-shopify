import { NextRequest, NextResponse } from "next/server";
import { cartService } from "@/lib/cart-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cartId, lineId, quantity } = body;

    if (!cartId || !lineId || quantity === undefined) {
      return NextResponse.json(
        { error: "Cart ID, Line ID, and quantity are required" },
        { status: 400 }
      );
    }

    const cart = await cartService.updateCartLine(cartId, lineId, quantity);

    return NextResponse.json({ cart });
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to update cart",
      },
      { status: 500 }
    );
  }
}
