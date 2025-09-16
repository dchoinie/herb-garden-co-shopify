import { NextRequest, NextResponse } from "next/server";
import { setMinnesotaTaxEligibility } from "@/lib/shopify-tax-override";

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

    // Set Minnesota tax eligibility based on shipping address
    const updatedCart = await setMinnesotaTaxEligibility(
      cartId,
      shippingAddress
    );

    if (!updatedCart) {
      return NextResponse.json(
        { error: "Failed to update Minnesota tax eligibility" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      cart: updatedCart,
      success: true,
    });
  } catch (error) {
    console.error("Error setting Minnesota tax eligibility:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to set Minnesota tax eligibility",
      },
      { status: 500 }
    );
  }
}
