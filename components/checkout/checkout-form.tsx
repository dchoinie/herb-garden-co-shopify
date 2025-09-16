"use client";

import { useState, useEffect } from "react";
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
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  calculateTax,
  STATE_TAX_RATES,
  getStateName,
} from "@/lib/tax-calculator";
import { Lock, Shield, Truck } from "lucide-react";

interface CheckoutFormProps {
  onSubmit: (data: any) => void;
  isLoading: boolean;
  error: string | null;
  onStateChange?: (stateCode: string) => void;
}

interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  province: string;
  zip: string;
  country: string;
  phone: string;
}

const US_STATES = Object.keys(STATE_TAX_RATES).map((code) => ({
  code,
  name: getStateName(code),
  taxRate: STATE_TAX_RATES[code],
}));

export function CheckoutForm({
  onSubmit,
  isLoading,
  error,
  onStateChange,
}: CheckoutFormProps) {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    city: "",
    province: "",
    zip: "",
    country: "US",
    phone: "",
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [selectedState, setSelectedState] = useState<string>("");

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    // Trigger tax calculation when state changes
    if (field === "province" && onStateChange) {
      onStateChange(value);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.address1) newErrors.address1 = "Address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.province) newErrors.province = "State is required";
    if (!formData.zip) newErrors.zip = "ZIP code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit({
      email: formData.email,
      shippingAddress: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        address1: formData.address1,
        address2: formData.address2,
        city: formData.city,
        province: formData.province,
        zip: formData.zip,
        country: formData.country,
        phone: formData.phone,
      },
    });
  };

  const selectedStateInfo = US_STATES.find(
    (state) => state.code === formData.province
  );

  return (
    <div className="space-y-6">
      {/* Security Badges */}
      <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
        <div className="flex items-center">
          <Shield className="w-4 h-4 mr-1" />
          <span>SSL Secured</span>
        </div>
        <div className="flex items-center">
          <Lock className="w-4 h-4 mr-1" />
          <span>PCI Compliant</span>
        </div>
        <div className="flex items-center">
          <Truck className="w-4 h-4 mr-1" />
          <span>Fast Shipping</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={errors.email ? "border-red-500" : ""}
                required
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Shipping Address */}
        <Card>
          <CardHeader>
            <CardTitle>Shipping Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  className={errors.firstName ? "border-red-500" : ""}
                  required
                  autoComplete="given-name"
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  className={errors.lastName ? "border-red-500" : ""}
                  required
                  autoComplete="family-name"
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="address1">Street Address *</Label>
              <Input
                id="address1"
                value={formData.address1}
                onChange={(e) => handleInputChange("address1", e.target.value)}
                className={errors.address1 ? "border-red-500" : ""}
                required
                autoComplete="address-line1"
              />
              {errors.address1 && (
                <p className="text-sm text-red-500 mt-1">{errors.address1}</p>
              )}
            </div>

            <div>
              <Label htmlFor="address2">
                Apartment, suite, etc. (optional)
              </Label>
              <Input
                id="address2"
                value={formData.address2}
                onChange={(e) => handleInputChange("address2", e.target.value)}
                autoComplete="address-line2"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className={errors.city ? "border-red-500" : ""}
                  required
                  autoComplete="address-level2"
                />
                {errors.city && (
                  <p className="text-sm text-red-500 mt-1">{errors.city}</p>
                )}
              </div>
              <div>
                <Label htmlFor="province">State *</Label>
                <Select
                  value={formData.province}
                  onValueChange={(value) =>
                    handleInputChange("province", value)
                  }
                >
                  <SelectTrigger
                    className={errors.province ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {US_STATES.map((state) => (
                      <SelectItem key={state.code} value={state.code}>
                        {state.name} ({state.taxRate}%)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.province && (
                  <p className="text-sm text-red-500 mt-1">{errors.province}</p>
                )}
              </div>
              <div>
                <Label htmlFor="zip">ZIP Code *</Label>
                <Input
                  id="zip"
                  value={formData.zip}
                  onChange={(e) => handleInputChange("zip", e.target.value)}
                  className={errors.zip ? "border-red-500" : ""}
                  required
                  autoComplete="postal-code"
                />
                {errors.zip && (
                  <p className="text-sm text-red-500 mt-1">{errors.zip}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Phone Number (optional)</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                autoComplete="tel"
              />
            </div>
          </CardContent>
        </Card>

        {/* Tax Information */}
        {selectedStateInfo && (
          <Card>
            <CardHeader>
              <CardTitle>Tax Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="text-blue-600 mr-3">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-800">
                      Tax Rate for {selectedStateInfo.name}
                    </h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Sales tax rate: {selectedStateInfo.taxRate}%
                      {selectedStateInfo.code === "MN" && (
                        <span className="block mt-1">
                          Plus 15% Minnesota Cannabis/Hemp Tax
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Submit Button */}
        <Button type="submit" disabled={isLoading} className="w-full" size="lg">
          {isLoading ? "Creating Checkout..." : "Continue to Payment"}
        </Button>
      </form>
    </div>
  );
}
