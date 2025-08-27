"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  Clock, 
  CreditCard, 
  Package
} from "lucide-react";

interface UserAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserAccountModal({ isOpen, onClose }: UserAccountModalProps) {
  const features = [
    {
      icon: Bell,
      title: "Get order status notifications",
      description: "Stay updated on your order progress with real-time notifications"
    },
    {
      icon: Clock,
      title: "View your order history",
      description: "Access past orders and quickly reorder your favorites"
    },
    {
      icon: CreditCard,
      title: "Manage payment details",
      description: "Save payment methods for faster checkout experience"
    },
    {
      icon: Package,
      title: "Track your shipments",
      description: "Monitor delivery status and get shipping updates"
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Sign in or create an account
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Features list */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-main-green/10 rounded-full flex items-center justify-center">
                  <feature.icon className="w-4 h-4 text-main-green" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-sm">{feature.title}</h3>
                  <p className="text-xs text-gray-600 mt-1">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Sign up/Sign in button */}
          <div className="space-y-3">
            <Button 
              className="w-full bg-main-green hover:bg-main-green/90 text-white"
              asChild
            >
              <Link href="/account/login">
                Sign Up or Sign In
              </Link>
            </Button>
            
            <p className="text-xs text-center text-gray-500">
              By signing in, you agree to our{" "}
              <Link href="/terms" className="text-main-green hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-main-green hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
