"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, CreditCard, Smartphone } from "lucide-react";

interface PaymentSectionProps {
  checkout: any;
  onComplete: (checkoutUrl: string) => void;
  isLoading: boolean;
  error: string | null;
}

export function PaymentSection({
  checkout,
  onComplete,
  isLoading,
  error,
}: PaymentSectionProps) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("shopify");

  const handlePaymentMethodSelect = (method: string) => {
    setSelectedPaymentMethod(method);
  };

  const handleProceedToPayment = () => {
    // Track payment method selection
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "select_payment_method", {
        payment_method: selectedPaymentMethod,
      });
    }

    // Redirect to Shopify's secure payment page
    onComplete(checkout.webUrl);
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
              selectedPaymentMethod === "shopify"
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
                  <h4 className="font-medium text-gray-900">Secure Payment</h4>
                  <p className="text-sm text-gray-600">
                    Credit cards, PayPal, Apple Pay, Google Pay
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">Recommended</Badge>
                <div
                  className={`w-4 h-4 rounded-full border-2 ${
                    selectedPaymentMethod === "shopify"
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {selectedPaymentMethod === "shopify" && (
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
          </div>
        </CardContent>
      </Card>

      {/* Security Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Payment Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start space-x-3">
            <Lock className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900">PCI Compliant</h4>
              <p className="text-sm text-gray-600">
                Your payment information is encrypted and secure
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900">SSL Protected</h4>
              <p className="text-sm text-gray-600">
                256-bit encryption protects your data
              </p>
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

      {/* Proceed Button */}
      <Button
        onClick={handleProceedToPayment}
        disabled={isLoading}
        className="w-full"
        size="lg"
      >
        {isLoading ? "Processing..." : "Complete Payment"}
      </Button>

      {/* Trust Indicators */}
      <div className="text-center text-sm text-gray-500">
        <p>You will be redirected to Shopify's secure payment page</p>
        <p className="mt-1">
          <Lock className="w-3 h-3 inline mr-1" />
          Your payment information is never stored on our servers
        </p>
      </div>
    </div>
  );
}
