import { client } from "@/lib/square";

export interface PaymentRequest {
  amount: number;
  currency: string;
  sourceId: string;
  orderId: string;
  customerId?: string;
  autocomplete?: boolean;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  paymentId?: string;
  orderId?: string;
  status?: string;
  error?: string;
}

export async function processSquarePayment(
  paymentRequest: PaymentRequest
): Promise<PaymentResult> {
  try {
    const {
      amount,
      currency,
      sourceId,
      orderId,
      customerId,
      autocomplete = true,
    } = paymentRequest;

    // Create payment request
    const request = {
      idempotencyKey: `payment_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      sourceId: sourceId,
      amountMoney: {
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency,
      },
      orderId: orderId,
      customerId: customerId,
      autocomplete: autocomplete,
      note: "Online order payment",
    };

    console.log("Processing Square payment:", request);

    // Process the payment
    const response = await client.paymentsApi.createPayment(request);

    if (!response.result.payment) {
      throw new Error("Failed to create payment");
    }

    const payment = response.result.payment;

    return {
      success: true,
      transactionId: payment.id,
      paymentId: payment.id,
      orderId: orderId,
      status: payment.status,
    };
  } catch (error) {
    console.error("Square payment processing error:", error);

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Payment processing failed",
    };
  }
}

export async function createSquareCustomer(customerInfo: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}): Promise<{ success: boolean; customerId?: string; error?: string }> {
  try {
    const request = {
      idempotencyKey: `customer_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      givenName: customerInfo.firstName,
      familyName: customerInfo.lastName,
      emailAddress: customerInfo.email,
      phoneNumber: customerInfo.phone || undefined,
    };

    console.log("Creating Square customer:", request);

    const response = await client.customersApi.createCustomer(request);

    if (!response.result.customer) {
      throw new Error("Failed to create customer");
    }

    return {
      success: true,
      customerId: response.result.customer.id,
    };
  } catch (error) {
    console.error("Square customer creation error:", error);

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Customer creation failed",
    };
  }
}

export async function createSquareOrder(orderData: {
  locationId: string;
  lineItems: Array<{
    name: string;
    quantity: string;
    basePriceMoney: {
      amount: number;
      currency: string;
    };
  }>;
  taxes?: Array<{
    name: string;
    percentage: string;
    scope: string;
  }>;
  shippingAddress?: {
    addressLine1: string;
    addressLine2?: string;
    locality: string;
    administrativeDistrictLevel1: string;
    postalCode: string;
    country: string;
  };
}): Promise<{ success: boolean; orderId?: string; error?: string }> {
  try {
    const orderRequest = {
      order: {
        locationId: orderData.locationId,
        lineItems: orderData.lineItems,
        taxes: orderData.taxes || [],
        shippingAddress: orderData.shippingAddress,
      },
    };

    console.log("Creating Square order:", orderRequest);

    const response = await client.ordersApi.createOrder(orderRequest);

    if (!response.result.order) {
      throw new Error("Failed to create order");
    }

    return {
      success: true,
      orderId: response.result.order.id,
    };
  } catch (error) {
    console.error("Square order creation error:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Order creation failed",
    };
  }
}
