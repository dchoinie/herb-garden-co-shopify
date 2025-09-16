"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CreditCard } from "lucide-react";
import {
  formatCardNumber,
  getCardType,
  validatePaymentMethod,
} from "@/lib/shopify-payments";

interface CreditCardFormProps {
  onPaymentSubmit: (paymentData: any) => void;
  isLoading: boolean;
  error: string | null;
}

interface CardData {
  number: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  name: string;
}

export function CreditCardForm({
  onPaymentSubmit,
  isLoading,
  error,
}: CreditCardFormProps) {
  const [cardData, setCardData] = useState<CardData>({
    number: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    name: "",
  });
  const [errors, setErrors] = useState<Partial<CardData>>({});

  const handleInputChange = (field: keyof CardData, value: string) => {
    let processedValue = value;

    // Format card number
    if (field === "number") {
      processedValue = formatCardNumber(value);
    }

    // Limit CVV to 4 digits
    if (field === "cvv") {
      processedValue = value.replace(/\D/g, "").substring(0, 4);
    }

    // Limit expiry month to 2 digits
    if (field === "expiryMonth") {
      processedValue = value.replace(/\D/g, "").substring(0, 2);
    }

    // Limit expiry year to 4 digits
    if (field === "expiryYear") {
      processedValue = value.replace(/\D/g, "").substring(0, 4);
    }

    setCardData((prev) => ({ ...prev, [field]: processedValue }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CardData> = {};

    if (!cardData.name.trim()) {
      newErrors.name = "Cardholder name is required";
    }

    if (!cardData.number.replace(/\D/g, "")) {
      newErrors.number = "Card number is required";
    } else if (cardData.number.replace(/\D/g, "").length < 13) {
      newErrors.number = "Please enter a valid card number";
    }

    if (!cardData.expiryMonth) {
      newErrors.expiryMonth = "Expiry month is required";
    } else if (
      parseInt(cardData.expiryMonth) < 1 ||
      parseInt(cardData.expiryMonth) > 12
    ) {
      newErrors.expiryMonth = "Please enter a valid month";
    }

    if (!cardData.expiryYear) {
      newErrors.expiryYear = "Expiry year is required";
    } else if (cardData.expiryYear.length !== 4) {
      newErrors.expiryYear = "Please enter a valid year";
    }

    if (!cardData.cvv) {
      newErrors.cvv = "CVV is required";
    } else if (cardData.cvv.length < 3) {
      newErrors.cvv = "Please enter a valid CVV";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const paymentData = {
      type: "credit_card",
      data: {
        number: cardData.number.replace(/\D/g, ""),
        expiryMonth: parseInt(cardData.expiryMonth),
        expiryYear: parseInt(cardData.expiryYear),
        cvv: cardData.cvv,
        name: cardData.name,
        cardType: getCardType(cardData.number),
      },
    };

    onPaymentSubmit(paymentData);
  };

  const cardType = getCardType(cardData.number);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="w-5 h-5 mr-2" />
          Credit Card Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Cardholder Name */}
          <div>
            <Label htmlFor="cardName">Cardholder Name</Label>
            <Input
              id="cardName"
              type="text"
              placeholder="John Doe"
              value={cardData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Card Number */}
          <div>
            <Label htmlFor="cardNumber">Card Number</Label>
            <div className="relative">
              <Input
                id="cardNumber"
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardData.number}
                onChange={(e) => handleInputChange("number", e.target.value)}
                className={errors.number ? "border-red-500" : ""}
                maxLength={19}
              />
              {cardType !== "unknown" && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div
                    className={`w-6 h-4 rounded text-xs flex items-center justify-center text-white font-bold ${
                      cardType === "visa"
                        ? "bg-blue-600"
                        : cardType === "mastercard"
                        ? "bg-red-600"
                        : cardType === "amex"
                        ? "bg-green-600"
                        : "bg-gray-600"
                    }`}
                  >
                    {cardType === "visa"
                      ? "V"
                      : cardType === "mastercard"
                      ? "M"
                      : cardType === "amex"
                      ? "A"
                      : "?"}
                  </div>
                </div>
              )}
            </div>
            {errors.number && (
              <p className="text-sm text-red-500 mt-1">{errors.number}</p>
            )}
          </div>

          {/* Expiry and CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiryMonth">Expiry Month</Label>
              <Input
                id="expiryMonth"
                type="text"
                placeholder="MM"
                value={cardData.expiryMonth}
                onChange={(e) =>
                  handleInputChange("expiryMonth", e.target.value)
                }
                className={errors.expiryMonth ? "border-red-500" : ""}
                maxLength={2}
              />
              {errors.expiryMonth && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.expiryMonth}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="expiryYear">Expiry Year</Label>
              <Input
                id="expiryYear"
                type="text"
                placeholder="YYYY"
                value={cardData.expiryYear}
                onChange={(e) =>
                  handleInputChange("expiryYear", e.target.value)
                }
                className={errors.expiryYear ? "border-red-500" : ""}
                maxLength={4}
              />
              {errors.expiryYear && (
                <p className="text-sm text-red-500 mt-1">{errors.expiryYear}</p>
              )}
            </div>
          </div>

          {/* CVV */}
          <div>
            <Label htmlFor="cvv">CVV</Label>
            <Input
              id="cvv"
              type="text"
              placeholder="123"
              value={cardData.cvv}
              onChange={(e) => handleInputChange("cvv", e.target.value)}
              className={errors.cvv ? "border-red-500" : ""}
              maxLength={4}
            />
            {errors.cvv && (
              <p className="text-sm text-red-500 mt-1">{errors.cvv}</p>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? "Processing Payment..." : "Complete Payment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
