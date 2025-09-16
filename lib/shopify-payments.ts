/**
 * Shopify Payments Integration
 * Handles payment processing for custom checkout
 */

export interface PaymentRequest {
  checkoutId: string;
  paymentMethod: {
    type: "credit_card" | "paypal" | "apple_pay" | "google_pay";
    data: any;
  };
  amount: number;
  currency: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  error?: string;
  redirectUrl?: string;
}

/**
 * Process payment using Shopify Payments
 */
export async function processPayment(
  paymentRequest: PaymentRequest
): Promise<PaymentResponse> {
  try {
    const response = await fetch("/api/payments/process", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentRequest),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Payment processing failed");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Payment processing error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Payment processing failed",
    };
  }
}

/**
 * Create payment session for Apple Pay / Google Pay
 */
export async function createPaymentSession(checkoutId: string): Promise<any> {
  try {
    const response = await fetch("/api/payments/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ checkoutId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create payment session");
    }

    return await response.json();
  } catch (error) {
    console.error("Payment session creation error:", error);
    throw error;
  }
}

/**
 * Validate payment method
 */
export function validatePaymentMethod(paymentMethod: any): boolean {
  if (!paymentMethod || !paymentMethod.type) {
    return false;
  }

  switch (paymentMethod.type) {
    case "credit_card":
      return validateCreditCard(paymentMethod.data);
    case "paypal":
      return true; // PayPal validation handled by PayPal SDK
    case "apple_pay":
    case "google_pay":
      return true; // These are validated by the respective SDKs
    default:
      return false;
  }
}

/**
 * Validate credit card data
 */
function validateCreditCard(cardData: any): boolean {
  if (!cardData) return false;

  const { number, expiryMonth, expiryYear, cvv } = cardData;

  // Basic validation
  if (!number || !expiryMonth || !expiryYear || !cvv) {
    return false;
  }

  // Card number validation (Luhn algorithm)
  if (!validateCardNumber(number)) {
    return false;
  }

  // Expiry date validation
  const currentDate = new Date();
  const expiryDate = new Date(expiryYear, expiryMonth - 1);
  if (expiryDate < currentDate) {
    return false;
  }

  // CVV validation
  if (cvv.length < 3 || cvv.length > 4) {
    return false;
  }

  return true;
}

/**
 * Luhn algorithm for card number validation
 */
function validateCardNumber(cardNumber: string): boolean {
  const cleaned = cardNumber.replace(/\D/g, "");

  if (cleaned.length < 13 || cleaned.length > 19) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

/**
 * Get supported payment methods for the checkout
 */
export function getSupportedPaymentMethods(): string[] {
  return ["credit_card", "paypal", "apple_pay", "google_pay"];
}

/**
 * Format card number for display
 */
export function formatCardNumber(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\D/g, "");
  const groups = cleaned.match(/.{1,4}/g) || [];
  return groups.join(" ").substring(0, 19);
}

/**
 * Get card type from number
 */
export function getCardType(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\D/g, "");

  if (cleaned.startsWith("4")) return "visa";
  if (cleaned.startsWith("5") || cleaned.startsWith("2")) return "mastercard";
  if (cleaned.startsWith("3")) return "amex";
  if (cleaned.startsWith("6")) return "discover";

  return "unknown";
}
