// Payment utility functions for credit card handling

export function formatCardNumber(value: string): string {
  // Remove all non-digits
  const digits = value.replace(/\D/g, "");

  // Add spaces every 4 digits
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

export function getCardType(cardNumber: string): string {
  const digits = cardNumber.replace(/\D/g, "");

  if (/^4/.test(digits)) return "visa";
  if (/^5[1-5]/.test(digits)) return "mastercard";
  if (/^3[47]/.test(digits)) return "amex";
  if (/^6/.test(digits)) return "discover";

  return "unknown";
}

export function validatePaymentMethod(paymentData: {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate card number
  const cardNumber = paymentData.cardNumber.replace(/\D/g, "");
  if (cardNumber.length < 13 || cardNumber.length > 19) {
    errors.push("Invalid card number");
  }

  // Validate expiry date
  const [month, year] = paymentData.expiryDate.split("/");
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;

  if (!month || !year) {
    errors.push("Invalid expiry date format");
  } else {
    const expMonth = parseInt(month);
    const expYear = parseInt(year);

    if (expMonth < 1 || expMonth > 12) {
      errors.push("Invalid expiry month");
    }

    if (
      expYear < currentYear ||
      (expYear === currentYear && expMonth < currentMonth)
    ) {
      errors.push("Card has expired");
    }
  }

  // Validate CVV
  const cvv = paymentData.cvv.replace(/\D/g, "");
  if (cvv.length < 3 || cvv.length > 4) {
    errors.push("Invalid CVV");
  }

  // Validate cardholder name
  if (!paymentData.cardholderName.trim()) {
    errors.push("Cardholder name is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
