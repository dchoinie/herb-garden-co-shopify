import { NextRequest, NextResponse } from "next/server";
import {
  updateMinnesotaTax,
  getMinnesotaTaxFromCart,
} from "@/lib/minnesota-tax";
import { cartService } from "@/lib/cart-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cartId, shippingAddress } = body;

    if (!cartId) {
      return NextResponse.json(
        { error: "Cart ID is required" },
        { status: 400 }
      );
    }

    // Update Minnesota tax based on shipping address
    const updatedCart = await updateMinnesotaTax(cartId, shippingAddress);

    if (!updatedCart) {
      return NextResponse.json(
        { error: "Failed to update Minnesota tax" },
        { status: 500 }
      );
    }

    // Get Minnesota tax information from the updated cart
    const minnesotaTaxInfo = getMinnesotaTaxFromCart(updatedCart);

    return NextResponse.json({
      cart: updatedCart,
      minnesotaTax: minnesotaTaxInfo,
    });
  } catch (error) {
    console.error("Error updating Minnesota tax:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to update Minnesota tax",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cartId = searchParams.get("cartId");

  if (!cartId) {
    return NextResponse.json({ error: "Cart ID is required" }, { status: 400 });
  }

  try {
    const cart = await cartService.getCart(cartId);

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    // Get Minnesota tax information from the cart
    const minnesotaTaxInfo = getMinnesotaTaxFromCart(cart);

    return NextResponse.json({
      minnesotaTax: minnesotaTaxInfo,
    });
  } catch (error) {
    console.error("Error getting Minnesota tax info:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to get Minnesota tax info",
      },
      { status: 500 }
    );
  }
}
