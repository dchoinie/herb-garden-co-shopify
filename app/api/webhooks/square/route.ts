import { NextRequest, NextResponse } from "next/server";
import { client } from "@/lib/square";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-square-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // Verify webhook signature
    const isValid = await client.webhooksApi.validateWebhookSignature({
      body,
      signature,
      webhookUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/square`,
      webhookSecret: process.env.SQUARE_WEBHOOK_SECRET as string,
    });

    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const webhookData = JSON.parse(body);
    const { type, data } = webhookData;

    console.log("Square webhook received:", { type, data });

    // Handle different webhook types
    switch (type) {
      case "payment.updated":
        await handlePaymentUpdate(data);
        break;
      case "order.updated":
        await handleOrderUpdate(data);
        break;
      case "payment.created":
        await handlePaymentCreated(data);
        break;
      default:
        console.log("Unhandled webhook type:", type);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

async function handlePaymentUpdate(data: any) {
  console.log("Payment updated:", data);
  // Handle payment status changes
  // Update order status in your database
}

async function handleOrderUpdate(data: any) {
  console.log("Order updated:", data);
  // Handle order status changes
  // Update order status in your database
}

async function handlePaymentCreated(data: any) {
  console.log("Payment created:", data);
  // Handle new payment creation
  // Update order status to paid
}
