"use client";

import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function CheckoutPage() {
  const { cart, calculateTotals } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    address1: "",
    city: "",
    state: "",
    zipCode: "",
  });

  useEffect(() => {
    if (address.state && cart) {
      calculateTotals(address.state);
    }
  }, [address.state, cart, calculateTotals]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleProceedToPayment = async () => {
    if (!cart || cart.items.length === 0) {
      alert("Your cart is empty");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart, shippingAddress: address }),
      });

      if (!response.ok) throw new Error("Failed to create checkout session");

      const { checkoutUrl } = await response.json();
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to process checkout. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <Link href="/shop">
            <Button size="lg">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Link>
          <h1 className="text-3xl font-bold mt-4">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={address.firstName}
                      onChange={(e) =>
                        setAddress((prev) => ({
                          ...prev,
                          firstName: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={address.lastName}
                      onChange={(e) =>
                        setAddress((prev) => ({
                          ...prev,
                          lastName: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address1">Address *</Label>
                  <Input
                    id="address1"
                    value={address.address1}
                    onChange={(e) =>
                      setAddress((prev) => ({
                        ...prev,
                        address1: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={address.city}
                      onChange={(e) =>
                        setAddress((prev) => ({
                          ...prev,
                          city: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={address.state}
                      onChange={(e) =>
                        setAddress((prev) => ({
                          ...prev,
                          state: e.target.value.toUpperCase(),
                        }))
                      }
                      placeholder="MN"
                      maxLength={2}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      value={address.zipCode}
                      onChange={(e) =>
                        setAddress((prev) => ({
                          ...prev,
                          zipCode: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      {item.image && (
                        <div className="relative w-12 h-12 flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                      )}
                      <div className="flex-grow">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(cart.subtotal)}</span>
                  </div>

                  {cart.tax && (
                    <>
                      {cart.tax.stateTax > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>State Tax ({cart.tax.stateTaxRate}%)</span>
                          <span>{formatCurrency(cart.tax.stateTax)}</span>
                        </div>
                      )}
                      {cart.tax.cannabisTax > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>
                            Cannabis Tax ({cart.tax.cannabisTaxRate}%)
                          </span>
                          <span>{formatCurrency(cart.tax.cannabisTax)}</span>
                        </div>
                      )}
                    </>
                  )}

                  <Separator />

                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formatCurrency(cart.total)}</span>
                  </div>
                </div>

                <Button
                  onClick={handleProceedToPayment}
                  disabled={
                    isProcessing ||
                    !address.firstName ||
                    !address.lastName ||
                    !address.address1 ||
                    !address.city ||
                    !address.state ||
                    !address.zipCode
                  }
                  className="w-full"
                  size="lg"
                >
                  {isProcessing ? "Processing..." : "Proceed to Payment"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
