import { NextRequest, NextResponse } from "next/server";
import { processSquarePayment } from "@/lib/square-payments";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, sourceId, amount, currency, customerId } = body;

    if (!orderId || !sourceId || !amount || !currency) {
      return NextResponse.json(
        { error: "Missing required payment information" },
        { status: 400 }
      );
    }

    console.log("Processing Square payment:", {
      orderId,
      amount,
      currency,
    });

    // Process payment using Square
    const paymentRequest = {
      amount: parseFloat(amount),
      currency: currency,
      sourceId: sourceId,
      orderId: orderId,
      customerId: customerId,
      autocomplete: true,
    };

    const result = await processSquarePayment(paymentRequest);

    if (result.success) {
      return NextResponse.json({
        success: true,
        transactionId: result.transactionId,
        paymentId: result.paymentId,
        orderId: result.orderId,
        status: result.status,
        message: "Payment processed successfully",
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "Payment processing failed",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Payment processing error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Payment processing failed",
      },
      { status: 500 }
    );
  }
}
