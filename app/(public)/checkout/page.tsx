"use client";

import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

// US States data
const US_STATES = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
];

// Declare Square Web Payments SDK types
interface SquarePayments {
  card: (options?: Record<string, unknown>) => {
    attach?: (element: HTMLElement) => void;
    mount?: (element: HTMLElement) => void;
    tokenize: () => Promise<{
      status: string;
      token?: string;
      errors?: Array<{ detail: string }>;
    }>;
    destroy: () => void;
  };
}

declare global {
  interface Window {
    Square?: {
      payments: (
        applicationId: string,
        locationId: string,
        options?: { environment?: string }
      ) => SquarePayments;
    };
  }
}

export default function CheckoutPage() {
  const { cart, calculateTotals } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [squareLoaded, setSquareLoaded] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const paymentsRef = useRef<SquarePayments | null>(null);
  const cardRef = useRef<ReturnType<SquarePayments["card"]> | null>(null);

  const [customerInfo, setCustomerInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [address, setAddress] = useState({
    address1: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [useSeparateBilling, setUseSeparateBilling] = useState(false);
  const [billingAddress, setBillingAddress] = useState({
    address1: "",
    city: "",
    state: "",
    zipCode: "",
  });

  // Load Square Web Payments SDK
  useEffect(() => {
    const loadSquareSDK = async () => {
      try {
        console.log("Starting Square SDK load...");

        // Get Square configuration
        const configResponse = await fetch("/api/square/config");
        const configData = await configResponse.json();

        console.log("Square config response:", configData);

        if (!configData.success) {
          throw new Error(
            `Failed to get Square configuration: ${configData.error}`
          );
        }

        const { config } = configData;
        console.log("Square config:", config);

        // Check if required config is present
        if (!config.applicationId || !config.locationId) {
          throw new Error("Missing Square application ID or location ID");
        }

        // Load Square Web Payments SDK
        const script = document.createElement("script");
        // Use the sandbox-specific URL to force sandbox environment
        script.src = "https://sandbox.web.squarecdn.com/v1/square.js";
        script.async = true;
        script.onload = async () => {
          console.log("Square SDK script loaded");
          console.log("Window.Square available:", !!window.Square);
          console.log("Card container available:", !!cardContainerRef.current);

          if (window.Square && cardContainerRef.current) {
            try {
              console.log("Initializing Square payments...", {
                applicationId: config.applicationId,
                locationId: config.locationId,
                environment: "sandbox",
              });

              // Initialize Square payments with environment configuration
              // Try different initialization approach for sandbox
              let payments;
              try {
                // First try with explicit sandbox environment
                payments = window.Square.payments(
                  config.applicationId,
                  config.locationId,
                  {
                    environment: "sandbox",
                  }
                );
              } catch (error) {
                console.log(
                  "Failed with explicit environment, trying without...",
                  error
                );
                // Fallback to basic initialization
                payments = window.Square.payments(
                  config.applicationId,
                  config.locationId
                );
              }

              const card = payments.card({
                style: {
                  ".input-container": {
                    borderColor: "#E0E0E0",
                    borderRadius: "6px",
                  },
                  ".input-container.is-focus": {
                    borderColor: "#0066CC",
                  },
                  ".input-container.is-error": {
                    borderColor: "#CC0000",
                  },
                  ".message-text": {
                    color: "#666666",
                  },
                  ".message-icon": {
                    color: "#CC0000",
                  },
                },
              });

              console.log("Card object created:", card);
              console.log("Card is a Promise:", card instanceof Promise);

              // The sandbox SDK returns a Promise, so we need to await it
              const resolvedCard = await card;

              console.log("Resolved card object:", resolvedCard);
              console.log("Card methods available:", Object.keys(resolvedCard));
              console.log(
                "Attaching card to container:",
                cardContainerRef.current
              );

              // Try different attachment methods for sandbox SDK
              if (typeof resolvedCard.attach === "function") {
                resolvedCard.attach(cardContainerRef.current);
              } else if (typeof resolvedCard.mount === "function") {
                resolvedCard.mount(cardContainerRef.current);
              } else {
                console.error("No attach or mount method found on card object");
                throw new Error(
                  "Card object does not have attach or mount method"
                );
              }

              paymentsRef.current = payments;
              cardRef.current = resolvedCard;
              setSquareLoaded(true);
              console.log("Square payments initialized successfully");
            } catch (error) {
              console.error("Failed to initialize Square payments:", error);
              setPaymentError(
                `Failed to initialize payment form: ${
                  error instanceof Error ? error.message : "Unknown error"
                }`
              );
            }
          } else {
            console.error(
              "Square SDK not available or card container not ready"
            );
            setPaymentError("Square SDK not available");
          }
        };
        script.onerror = () => {
          console.error("Failed to load Square SDK script");
          setPaymentError("Failed to load Square payment SDK");
        };

        document.head.appendChild(script);
      } catch (error) {
        console.error("Error loading Square SDK:", error);
        setPaymentError(
          `Failed to load payment system: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    };

    // Wait for the DOM to be ready
    const timer = setTimeout(() => {
      if (cardContainerRef.current) {
        loadSquareSDK();
      } else {
        console.error("Card container not ready after timeout");
        setPaymentError("Payment form container not ready");
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      // Cleanup
      if (cardRef.current) {
        cardRef.current.destroy();
      }
    };
  }, []);

  // Calculate tax when state changes
  useEffect(() => {
    if (cart) {
      if (address.state) {
        calculateTotals(address.state);
      } else {
        // Clear tax data when no state is selected
        calculateTotals();
      }
    }
  }, [address.state]); // Only depend on address.state to prevent infinite loops

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

    if (!squareLoaded || !cardRef.current) {
      alert("Payment system is not ready. Please wait a moment and try again.");
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      // First, create the order and customer
      const checkoutResponse = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart,
          customerInfo,
          shippingAddress: address,
          billingAddress: useSeparateBilling ? billingAddress : address,
        }),
      });

      if (!checkoutResponse.ok) {
        const errorData = await checkoutResponse.json();
        throw new Error(errorData.error || "Failed to create checkout session");
      }

      const { orderId, customerId, amount, currency } =
        await checkoutResponse.json();

      // Tokenize the card
      const result = await cardRef.current.tokenize();

      if (result.status === "OK") {
        // Process the payment
        const paymentResponse = await fetch("/api/payments/process", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId,
            sourceId: result.token,
            amount,
            currency,
            customerId,
          }),
        });

        if (!paymentResponse.ok) {
          const errorData = await paymentResponse.json();
          throw new Error(errorData.error || "Payment processing failed");
        }

        const paymentResult = await paymentResponse.json();

        if (paymentResult.success) {
          // Redirect to success page
          window.location.href = `/checkout/success?orderId=${orderId}&paymentId=${paymentResult.paymentId}`;
        } else {
          throw new Error(paymentResult.error || "Payment failed");
        }
      } else {
        throw new Error(
          result.errors?.[0]?.detail || "Card tokenization failed"
        );
      }
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentError(
        error instanceof Error ? error.message : "Payment processing failed"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <Button asChild size="lg">
            <Link href="/shop">Continue Shopping</Link>
          </Button>
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
            <Card className="h-fit">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={customerInfo.firstName}
                      onChange={(e) =>
                        setCustomerInfo((prev) => ({
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
                      value={customerInfo.lastName}
                      onChange={(e) =>
                        setCustomerInfo((prev) => ({
                          ...prev,
                          lastName: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) =>
                      setCustomerInfo((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number (Optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) =>
                      setCustomerInfo((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="pt-4">
                  <p className="text-sm text-gray-600">
                    We&apos;ll use this information to send you order updates
                    and receipts.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                    <Select
                      value={address.state}
                      onValueChange={(value) =>
                        setAddress((prev) => ({
                          ...prev,
                          state: value,
                        }))
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your state" />
                      </SelectTrigger>
                      <SelectContent>
                        {US_STATES.map((state) => (
                          <SelectItem key={state.code} value={state.code}>
                            {state.name} ({state.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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

            <Card>
              <CardHeader>
                <CardTitle>Billing Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="separate-billing"
                    checked={useSeparateBilling}
                    onCheckedChange={(checked) =>
                      setUseSeparateBilling(checked as boolean)
                    }
                  />
                  <Label htmlFor="separate-billing">
                    Use a different billing address
                  </Label>
                </div>

                {useSeparateBilling && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="billingAddress1">Address *</Label>
                      <Input
                        id="billingAddress1"
                        value={billingAddress.address1}
                        onChange={(e) =>
                          setBillingAddress((prev) => ({
                            ...prev,
                            address1: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="billingCity">City *</Label>
                        <Input
                          id="billingCity"
                          value={billingAddress.city}
                          onChange={(e) =>
                            setBillingAddress((prev) => ({
                              ...prev,
                              city: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="billingState">State *</Label>
                        <Select
                          value={billingAddress.state}
                          onValueChange={(value) =>
                            setBillingAddress((prev) => ({
                              ...prev,
                              state: value,
                            }))
                          }
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select your state" />
                          </SelectTrigger>
                          <SelectContent>
                            {US_STATES.map((state) => (
                              <SelectItem key={state.code} value={state.code}>
                                {state.name} ({state.code})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="billingZipCode">ZIP Code *</Label>
                        <Input
                          id="billingZipCode"
                          value={billingAddress.zipCode}
                          onChange={(e) =>
                            setBillingAddress((prev) => ({
                              ...prev,
                              zipCode: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {!useSeparateBilling && (
                  <p className="text-sm text-gray-600">
                    Billing address will be the same as shipping address
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Card Information *</Label>
                  <div
                    ref={cardContainerRef}
                    id="card-container"
                    className="min-h-[120px] border border-gray-300 rounded-md p-3"
                  >
                    {!squareLoaded && (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        {paymentError
                          ? `Error: ${paymentError}`
                          : "Loading payment form..."}
                      </div>
                    )}
                    {squareLoaded && (
                      <div className="text-green-600 text-sm">
                        ✓ Payment form loaded successfully
                      </div>
                    )}
                  </div>
                  {paymentError && (
                    <p className="text-red-600 text-sm mt-2">{paymentError}</p>
                  )}
                </div>
                <div className="pt-4">
                  <p className="text-sm text-gray-600">
                    Your payment information is secure and encrypted. We accept
                    all major credit cards.
                  </p>
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
                    !squareLoaded ||
                    !customerInfo.firstName ||
                    !customerInfo.lastName ||
                    !customerInfo.email ||
                    !address.address1 ||
                    !address.city ||
                    !address.state ||
                    !address.zipCode ||
                    (useSeparateBilling &&
                      (!billingAddress.address1 ||
                        !billingAddress.city ||
                        !billingAddress.state ||
                        !billingAddress.zipCode))
                  }
                  className="w-full"
                  size="lg"
                >
                  {isProcessing
                    ? "Processing..."
                    : squareLoaded
                    ? "Complete Purchase"
                    : "Loading..."}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
