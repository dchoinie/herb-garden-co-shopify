import { NextRequest, NextResponse } from "next/server";
import { createCustomCheckoutWithTax } from "@/lib/shopify-checkout-api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Checkout API received:", { body });
    const { lineItems, shippingAddress, email, subtotal } = body;

    if (!lineItems || !Array.isArray(lineItems) || lineItems.length === 0) {
      return NextResponse.json(
        { error: "Line items are required" },
        { status: 400 }
      );
    }

    if (!subtotal || subtotal <= 0) {
      return NextResponse.json(
        { error: "Valid subtotal is required" },
        { status: 400 }
      );
    }

    const result = await createCustomCheckoutWithTax(
      {
        lineItems,
        shippingAddress,
        email,
        customAttributes: [
          {
            key: "checkout_type",
            value: "custom_checkout",
          },
          {
            key: "created_at",
            value: new Date().toISOString(),
          },
        ],
      },
      subtotal
    );

    return NextResponse.json({
      success: true,
      checkout: result.checkout,
      taxCalculation: result.taxCalculation,
      webUrl: result.webUrl,
    });
  } catch (error) {
    console.error("Error creating custom checkout:", error);
    return NextResponse.json(
      {
        error: "Failed to create checkout",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
