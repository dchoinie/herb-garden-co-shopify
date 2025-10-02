import { NextRequest, NextResponse } from "next/server";
import { createSquareOrder, createSquareCustomer } from "@/lib/square-payments";
import { Cart } from "@/lib/cart-service";

export async function POST(request: NextRequest) {
  try {
    const { cart, customerInfo, shippingAddress, billingAddress } =
      await request.json();

    if (!cart || !cart.items || cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (!process.env.SQUARE_LOCATION_ID) {
      return NextResponse.json(
        { error: "Square location ID not configured" },
        { status: 500 }
      );
    }

    // Create Square Customer
    const customerResult = await createSquareCustomer(customerInfo);
    if (!customerResult.success) {
      console.error("Failed to create customer:", customerResult.error);
      // Continue without customer ID if customer creation fails
    }

    // Create Square Order
    const orderResult = await createSquareOrder({
      locationId: process.env.SQUARE_LOCATION_ID,
      lineItems: cart.items.map((item: any) => ({
        name: item.name,
        quantity: item.quantity.toString(),
        basePriceMoney: {
          amount: Math.round(item.price * 100), // Convert to cents
          currency: "USD",
        },
      })),
      taxes: cart.tax
        ? [
            ...(cart.tax.stateTax > 0
              ? [
                  {
                    name: "State Sales Tax",
                    percentage: cart.tax.stateTaxRate.toString(),
                    scope: "ORDER",
                  },
                ]
              : []),
            ...(cart.tax.cannabisTax > 0
              ? [
                  {
                    name: "Minnesota Cannabis Tax",
                    percentage: cart.tax.cannabisTaxRate.toString(),
                    scope: "ORDER",
                  },
                ]
              : []),
          ]
        : [],
      shippingAddress: {
        addressLine1: shippingAddress.address1,
        addressLine2: shippingAddress.address2 || "",
        locality: shippingAddress.city,
        administrativeDistrictLevel1: shippingAddress.state,
        postalCode: shippingAddress.zipCode,
        country: "US",
      },
    });

    if (!orderResult.success) {
      throw new Error(orderResult.error || "Failed to create order");
    }

    return NextResponse.json({
      success: true,
      orderId: orderResult.orderId,
      customerId: customerResult.customerId,
      amount: cart.total,
      currency: "USD",
    });
  } catch (error) {
    console.error("Checkout creation error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to create checkout",
      },
      { status: 500 }
    );
  }
}
