"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Send } from "lucide-react";
import Container from "@/components/container";

export default function WholesaleInquiryPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    email: "",
    address: "",
    productInterests: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Here you would typically send the data to your API
    console.log("Wholesale inquiry submitted:", formData);

    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({
      fullName: "",
      companyName: "",
      email: "",
      address: "",
      productInterests: "",
    });
  };

  if (isSubmitted) {
    return (
      <Container className="py-24">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-900">Thank You!</h2>
          <p className="text-gray-600">
            Your wholesale inquiry has been submitted successfully. We&apos;ll
            get back to you within 2-3 business days.
          </p>
          <Button onClick={() => setIsSubmitted(false)} className="mt-4">
            Submit Another Inquiry
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-24">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-5xl font-bold mb-6 text-center">
          Wholesale Inquiry
        </h2>
        <p className="text-center mb-12">
          Interested in carrying our products? Fill out the form below and
          we&apos;ll get back to you with wholesale pricing and availability.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 w-full flex flex-col"
        >
          <div className="space-y-2">
            <Label htmlFor="fullName" className="hidden">
              Full Name
            </Label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Full Name"
              required
              value={formData.fullName}
              onChange={handleInputChange}
              className="border-gray-300 focus:border-primary focus:ring-primary h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyName" className="hidden">
              Company Name
            </Label>
            <Input
              id="companyName"
              name="companyName"
              type="text"
              placeholder="Company Name"
              required
              value={formData.companyName}
              onChange={handleInputChange}
              className="border-gray-300 focus:border-primary focus:ring-primary h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="hidden">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="border-gray-300 focus:border-primary focus:ring-primary h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="hidden">
              Business Address
            </Label>
            <Textarea
              id="address"
              name="address"
              placeholder="Business Address"
              rows={3}
              required
              value={formData.address}
              onChange={handleInputChange}
              className="border-gray-300 focus:border-primary focus:ring-primary min-h-32"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="productInterests" className="hidden">
              Product Interests
            </Label>
            <Textarea
              id="productInterests"
              name="productInterests"
              placeholder="What products are you interested in?"
              rows={4}
              required
              value={formData.productInterests}
              onChange={handleInputChange}
              className="border-gray-300 focus:border-primary focus:ring-primary min-h-32"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="self-center rounded-full bg-main-green"
            size="lg"
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Submitting...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span>Submit</span>
              </div>
            )}
          </Button>
        </form>
      </div>
    </Container>
  );
}
