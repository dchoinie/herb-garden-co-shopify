"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get order details from URL parameters or make API call
    const orderId = searchParams.get("orderId");
    const paymentId = searchParams.get("paymentId");

    if (orderId) {
      // In a real app, you'd fetch order details from your API
      setOrderDetails({
        orderId,
        paymentId,
        status: "completed",
        total: "$0.00", // This would come from your API
      });
    }

    setIsLoading(false);
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />

        <h1 className="text-3xl font-bold mb-4 text-green-600">
          Order Confirmed!
        </h1>

        <p className="text-gray-600 mb-8">
          Thank you for your purchase. Your order has been successfully
          processed.
        </p>

        {orderDetails && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Order ID:</span>
                <span className="text-gray-600">{orderDetails.orderId}</span>
              </div>
              {orderDetails.paymentId && (
                <div className="flex justify-between">
                  <span className="font-medium">Payment ID:</span>
                  <span className="text-gray-600">
                    {orderDetails.paymentId}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="font-medium">Status:</span>
                <span className="text-green-600 font-medium capitalize">
                  {orderDetails.status}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          <p className="text-gray-600">
            You will receive an email confirmation shortly with your order
            details and tracking information.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop">
              <Button variant="outline" className="w-full sm:w-auto">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>

            <Link href="/">
              <Button className="w-full sm:w-auto">Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
