"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/hooks/use-cart";
import {
  calculateTax,
  TaxCalculation,
  getTaxBreakdown,
  formatCurrency,
} from "@/lib/tax-calculator";
import { createCustomCheckoutWithTax } from "@/lib/shopify-checkout-api-client";
import { toast } from "sonner";
import { CheckoutForm } from "./checkout-form";
import { OrderSummary } from "./order-summary";
import { ShopifyPayments } from "./shopify-payments";
import { LoadingSpinner } from "./loading-spinner";
import { ErrorBoundary } from "./error-boundary";

interface CustomCheckoutProps {
  onComplete?: (checkoutUrl: string) => void;
}

export function CustomCheckout({ onComplete }: CustomCheckoutProps) {
  const { cart, items } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [taxCalculation, setTaxCalculation] = useState<TaxCalculation | null>(
    null
  );
  const [checkoutData, setCheckoutData] = useState<any>(null);
  const [selectedState, setSelectedState] = useState<string>("");

  // Calculate subtotal from cart items
  const subtotal = items.reduce((total, item) => {
    const price = parseFloat(item.merchandise.price.amount);
    return total + price * item.quantity;
  }, 0);

  // Update tax calculation when state changes
  useEffect(() => {
    if (selectedState) {
      const calculation = calculateTax(subtotal, selectedState);
      setTaxCalculation(calculation);
    }
  }, [subtotal, selectedState]);

  const handleFormSubmit = async (formData: any) => {
    setIsLoading(true);
    setError(null);

    try {
      // Store selected state for tax calculation
      setSelectedState(formData.shippingAddress.province);

      // Create checkout with tax calculation
      const result = await createCustomCheckoutWithTax(
        {
          lineItems: items.map((item) => ({
            variantId: item.merchandise.id,
            quantity: item.quantity,
          })),
          shippingAddress: formData.shippingAddress,
          email: formData.email,
          customAttributes: [
            {
              key: "checkout_type",
              value: "custom_checkout",
            },
          ],
        },
        subtotal
      );

      setCheckoutData(result.checkout);
      setTaxCalculation(result.taxCalculation);
      setCurrentStep(2);

      // Track checkout creation
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "begin_checkout", {
          currency: "USD",
          value: result.taxCalculation.total,
          items: items.map((item) => ({
            item_id: item.merchandise.id,
            item_name: item.merchandise.product.title,
            quantity: item.quantity,
            price: parseFloat(item.merchandise.price.amount),
          })),
        });
      }
    } catch (err) {
      console.error("Checkout creation failed:", err);
      setError(
        err instanceof Error ? err.message : "Failed to create checkout"
      );
      toast.error("Failed to create checkout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentComplete = (checkoutUrl: string) => {
    // Track payment initiation
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "add_payment_info", {
        currency: "USD",
        value: taxCalculation?.total || 0,
      });
    }

    onComplete?.(checkoutUrl);
  };

  if (!cart || items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600">
            Add some items to your cart to proceed with checkout.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {/* Progress Indicator */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center space-x-4">
                <div
                  className={`flex items-center ${
                    currentStep >= 1 ? "text-blue-600" : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep >= 1
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    1
                  </div>
                  <span className="ml-2 font-medium">Information</span>
                </div>
                <div
                  className={`flex items-center ${
                    currentStep >= 2 ? "text-blue-600" : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep >= 2
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    2
                  </div>
                  <span className="ml-2 font-medium">Payment</span>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Secure checkout powered by Shopify
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Main Content */}
            <div className="space-y-6">
              {currentStep === 1 && (
                <CheckoutForm
                  onSubmit={handleFormSubmit}
                  isLoading={isLoading}
                  error={error}
                  onStateChange={setSelectedState}
                />
              )}

              {currentStep === 2 && checkoutData && (
                <ShopifyPayments
                  checkout={checkoutData}
                  onComplete={handlePaymentComplete}
                  onError={(error) => setError(error)}
                  isLoading={isLoading}
                />
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:sticky lg:top-8">
              <OrderSummary
                items={items}
                subtotal={subtotal}
                taxCalculation={taxCalculation}
                currentStep={currentStep}
                stateCode={selectedState}
              />
            </div>
          </div>
        </div>

        {/* Loading Overlay */}
        {isLoading && <LoadingSpinner />}
      </div>
    </ErrorBoundary>
  );
}
