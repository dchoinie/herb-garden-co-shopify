"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Shield, CreditCard, Smartphone, Loader2 } from "lucide-react";
import { CreditCardForm } from "./credit-card-form";
import { processPayment } from "@/lib/shopify-payments";

interface ShopifyPaymentsProps {
  checkout: any;
  onComplete: (checkoutUrl: string) => void;
  onError: (error: string) => void;
  isLoading: boolean;
}

export function ShopifyPayments({
  checkout,
  onComplete,
  onError,
  isLoading,
}: ShopifyPaymentsProps) {
  const [paymentMethod, setPaymentMethod] = useState<string>("shopify");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize payment system
    console.log("Payment system initialized");
  }, []);

  const handlePaymentMethodSelect = (method: string) => {
    setPaymentMethod(method);
    setError(null);
  };

  const handlePaymentSubmit = async (paymentData: any) => {
    setIsProcessing(true);
    setError(null);

    try {
      // Track payment method selection
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "select_payment_method", {
          payment_method: paymentMethod,
        });
      }

      // Process payment
      const paymentRequest = {
        checkoutId: checkout.id,
        paymentMethod: paymentData,
        amount: parseFloat(checkout.totalPrice.amount),
        currency: checkout.totalPrice.currencyCode,
      };

      const result = await processPayment(paymentRequest);

      if (result.success) {
        // Payment successful - redirect to success page or complete checkout
        onComplete(checkout.webUrl);
      } else {
        throw new Error(result.error || "Payment processing failed");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Payment processing failed";
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProceedToPayment = async () => {
    // For non-credit card payments, redirect to Shopify's payment page
    setIsProcessing(true);
    setError(null);

    try {
      // Track payment method selection
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "select_payment_method", {
          payment_method: paymentMethod,
        });
      }

      onComplete(checkout.webUrl);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Payment processing failed";
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Shopify Payments */}
          <div
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
              paymentMethod === "shopify"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => handlePaymentMethodSelect("shopify")}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    Shopify Payments
                  </h4>
                  <p className="text-sm text-gray-600">
                    Credit cards, PayPal, Apple Pay, Google Pay
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">Secure</Badge>
                <div
                  className={`w-4 h-4 rounded-full border-2 ${
                    paymentMethod === "shopify"
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {paymentMethod === "shopify" && (
                    <div className="w-full h-full rounded-full bg-white scale-50"></div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Icons */}
          <div className="flex items-center justify-center space-x-4 pt-4 border-t">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <CreditCard className="w-4 h-4" />
              <span>Visa</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <CreditCard className="w-4 h-4" />
              <span>Mastercard</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <CreditCard className="w-4 h-4" />
              <span>American Express</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Smartphone className="w-4 h-4" />
              <span>Apple Pay</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Smartphone className="w-4 h-4" />
              <span>Google Pay</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Credit Card Form */}
      {paymentMethod === "shopify" && (
        <CreditCardForm
          onPaymentSubmit={handlePaymentSubmit}
          isLoading={isProcessing}
          error={error}
        />
      )}

      {/* Proceed Button - Only show for non-credit card payments */}
      {paymentMethod !== "shopify" && (
        <Button
          onClick={handleProceedToPayment}
          disabled={isLoading || isProcessing}
          className="w-full"
          size="lg"
        >
          {isLoading || isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            "Complete Payment"
          )}
        </Button>
      )}
    </div>
  );
}
