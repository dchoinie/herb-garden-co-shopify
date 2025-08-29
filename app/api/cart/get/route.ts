import { NextRequest, NextResponse } from "next/server";
import { cartService } from "@/lib/cart-service";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cartId = searchParams.get("cartId");

  if (!cartId) {
    return NextResponse.json({ error: "Cart ID is required" }, { status: 400 });
  }

  try {
    const cart = await cartService.getCart(cartId);
    return NextResponse.json({ cart });
  } catch (error) {
    console.error("Error getting cart:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to get cart" },
      { status: 500 }
    );
  }
}
