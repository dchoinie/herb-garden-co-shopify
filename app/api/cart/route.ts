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

    // For now, we'll create a new cart each time
    // In a real app, you'd want to manage cart persistence
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
