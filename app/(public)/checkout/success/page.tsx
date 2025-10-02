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
      // Fetch order details from Square API
      fetchOrderDetails(orderId, paymentId);
    } else {
      setIsLoading(false);
    }
  }, [searchParams]);

  const fetchOrderDetails = async (
    orderId: string,
    paymentId: string | null
  ) => {
    try {
      // In a real implementation, you'd have an API endpoint to fetch order details
      // For now, we'll use the URL parameters and show a basic confirmation
      setOrderDetails({
        orderId,
        paymentId,
        status: "completed",
        total: "See email confirmation", // This would come from your API
        message: "Your payment has been processed successfully.",
      });
    } catch (error) {
      console.error("Failed to fetch order details:", error);
      setOrderDetails({
        orderId,
        paymentId,
        status: "completed",
        total: "See email confirmation",
        message: "Your payment has been processed successfully.",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
              {orderDetails.message && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-green-800 text-sm">
                    {orderDetails.message}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          <p className="text-gray-600">
            You will receive an email confirmation shortly with your order
            details and tracking information.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/shop">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Link>
            </Button>

            <Button asChild className="w-full sm:w-auto">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
