"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  TaxCalculation,
  getTaxBreakdown,
  formatCurrency,
} from "@/lib/tax-calculator";
import Image from "next/image";
import { Package, Shield, Truck } from "lucide-react";

interface OrderSummaryProps {
  items: any[];
  subtotal: number;
  taxCalculation: TaxCalculation | null;
  currentStep: number;
  stateCode?: string;
}

export function OrderSummary({
  items,
  subtotal,
  taxCalculation,
  currentStep,
  stateCode,
}: OrderSummaryProps) {
  const taxBreakdown = taxCalculation
    ? getTaxBreakdown(taxCalculation, stateCode)
    : [];

  return (
    <div className="space-y-6">
      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center space-x-4">
                <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                  {item.merchandise.product.featuredImage && (
                    <Image
                      src={item.merchandise.product.featuredImage.url}
                      alt={item.merchandise.product.title}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {item.merchandise.product.title}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {item.merchandise.title}
                  </p>
                  <div className="flex items-center mt-1">
                    <span className="text-sm text-gray-600">
                      Qty: {item.quantity}
                    </span>
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {formatCurrency(
                    parseFloat(item.merchandise.price.amount) * item.quantity
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pricing Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Cost Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>

          {/* Tax Breakdown */}
          {taxBreakdown.map((tax, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-amber-700">{tax.label}</span>
              <span className="text-amber-700">{tax.formatted}</span>
            </div>
          ))}

          <Separator />

          <div className="flex justify-between font-medium text-lg">
            <span>Total</span>
            <span>
              {taxCalculation
                ? formatCurrency(taxCalculation.total)
                : formatCurrency(subtotal)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Progress Indicator for Mobile */}
      {currentStep === 1 && (
        <Card className="lg:hidden">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              </div>
              <p className="text-sm text-gray-600">
                Step 1 of 2: Shipping Information
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 2 && (
        <Card className="lg:hidden">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              </div>
              <p className="text-sm text-gray-600">Step 2 of 2: Payment</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
