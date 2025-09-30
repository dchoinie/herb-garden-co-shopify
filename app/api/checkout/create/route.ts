import { NextRequest, NextResponse } from "next/server";
import { client } from "@/lib/square";
import { Cart } from "@/lib/cart-service";

export async function POST(request: NextRequest) {
  try {
    const { cart, shippingAddress } = await request.json();

    if (!cart || !cart.items || cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Create Square Order
    const orderRequest = {
      order: {
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
      },
    };

    // Create the order
    const orderResponse = await client.ordersApi.createOrder(orderRequest);

    if (!orderResponse.result.order) {
      throw new Error("Failed to create order");
    }

    const order = orderResponse.result.order;

    // Create Payment Link using Square Checkout API
    const paymentLinkRequest = {
      idempotencyKey: `checkout_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      paymentLink: {
        orderId: order.id,
        checkoutOptions: {
          allowTipping: true,
          customFields: [
            {
              title: "Special Instructions",
              type: "TEXT",
            },
          ],
          subscriptionPlanId: undefined, // No subscription for one-time purchases
          redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success`,
          merchantSupportEmail:
            process.env.SQUARE_MERCHANT_EMAIL || "support@example.com",
        },
      },
    };

    // Create the payment link
    const paymentLinkResponse = await client.checkoutApi.createPaymentLink(
      paymentLinkRequest
    );

    if (!paymentLinkResponse.result.paymentLink) {
      throw new Error("Failed to create payment link");
    }

    const paymentLink = paymentLinkResponse.result.paymentLink;

    return NextResponse.json({
      success: true,
      orderId: order.id,
      checkoutUrl: paymentLink.url,
      paymentLinkId: paymentLink.id,
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
