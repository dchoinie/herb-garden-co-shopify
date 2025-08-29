"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/hooks/use-cart";

interface ShippingAddress {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  province: string;
  provinceCode: string;
  country: string;
  countryCode: string;
  zip: string;
}

interface ShippingAddressFormProps {
  onAddressChange?: (address: ShippingAddress) => void;
  className?: string;
}

export function ShippingAddressForm({
  onAddressChange,
  className,
}: ShippingAddressFormProps) {
  const { cart, refreshCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<ShippingAddress>({
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    city: "",
    province: "",
    provinceCode: "",
    country: "United States",
    countryCode: "US",
    zip: "",
  });

  const handleAddressChange = async (
    field: keyof ShippingAddress,
    value: string
  ) => {
    const newAddress = { ...address, [field]: value };
    setAddress(newAddress);

    // If we have a complete address with state, check for Minnesota tax
    if (
      newAddress.provinceCode &&
      newAddress.city &&
      newAddress.zip &&
      cart?.id
    ) {
      setLoading(true);
      try {
        const response = await fetch("/api/cart/minnesota-tax", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cartId: cart.id,
            shippingAddress: newAddress,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          // Refresh the cart to get updated tax information
          await refreshCart();
          console.log("Minnesota tax updated:", data.minnesotaTax);
        } else {
          const errorData = await response.json();
          console.error("Failed to update Minnesota tax:", errorData.error);
        }
      } catch (error) {
        console.error("Error updating Minnesota tax:", error);
      } finally {
        setLoading(false);
      }
    }

    onAddressChange?.(newAddress);
  };

  const usStates = [
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

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Shipping Address</CardTitle>
        {loading && (
          <p className="text-sm text-amber-600">Calculating Minnesota tax...</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={address.firstName}
              onChange={(e) => handleAddressChange("firstName", e.target.value)}
              placeholder="First name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={address.lastName}
              onChange={(e) => handleAddressChange("lastName", e.target.value)}
              placeholder="Last name"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address1">Address Line 1</Label>
          <Input
            id="address1"
            value={address.address1}
            onChange={(e) => handleAddressChange("address1", e.target.value)}
            placeholder="Street address"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address2">Address Line 2 (Optional)</Label>
          <Input
            id="address2"
            value={address.address2}
            onChange={(e) => handleAddressChange("address2", e.target.value)}
            placeholder="Apartment, suite, etc."
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={address.city}
              onChange={(e) => handleAddressChange("city", e.target.value)}
              placeholder="City"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="province">State</Label>
            <Select
              value={address.provinceCode}
              onValueChange={(value) => {
                const state = usStates.find((s) => s.code === value);
                handleAddressChange("provinceCode", value);
                handleAddressChange("province", state?.name || "");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {usStates.map((state) => (
                  <SelectItem key={state.code} value={state.code}>
                    {state.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="zip">ZIP Code</Label>
            <Input
              id="zip"
              value={address.zip}
              onChange={(e) => handleAddressChange("zip", e.target.value)}
              placeholder="ZIP code"
            />
          </div>
        </div>

        {address.provinceCode === "MN" && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
            <p className="text-sm text-amber-800">
              <strong>Minnesota Hemp/Cannabis Tax Notice:</strong> A 15%
              hemp/cannabis tax will be applied to your order subtotal for
              shipments to Minnesota.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
