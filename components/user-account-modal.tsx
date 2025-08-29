"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Clock,
  CreditCard,
  Package,
  User,
  LogOut,
  Settings,
  ShoppingBag,
} from "lucide-react";
import { CustomerSession } from "@/lib/auth-types";

interface UserAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: CustomerSession | null;
}

export function UserAccountModal({
  isOpen,
  onClose,
  session,
}: UserAccountModalProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const features = [
    {
      icon: Bell,
      title: "Get order status notifications",
      description:
        "Stay updated on your order progress with real-time notifications",
    },
    {
      icon: Clock,
      title: "View your order history",
      description: "Access past orders and quickly reorder your favorites",
    },
    {
      icon: CreditCard,
      title: "Manage payment details",
      description: "Save payment methods for faster checkout experience",
    },
    {
      icon: Package,
      title: "Track your shipments",
      description: "Monitor delivery status and get shipping updates",
    },
  ];

  const accountActions = [
    {
      icon: User,
      title: "Account Details",
      href: "/account",
      description: "View and edit your profile information",
    },
    {
      icon: ShoppingBag,
      title: "Order History",
      href: "/account/orders",
      description: "View past orders and track current ones",
    },
    {
      icon: Settings,
      title: "Account Settings",
      href: "/account/preferences",
      description: "Manage your preferences and notifications",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            {session ? "My Account" : "Sign in or create an account"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {session ? (
            // Authenticated user view
            <>
              {/* Welcome message */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Welcome back, {session.firstName || session.email}!
                </p>
              </div>

              {/* Account actions */}
              <div className="space-y-3">
                {accountActions.map((action, index) => (
                  <Link key={index} href={action.href} onClick={onClose}>
                    <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex-shrink-0 w-8 h-8 bg-main-green/10 rounded-full flex items-center justify-center">
                        <action.icon className="w-4 h-4 text-main-green" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{action.title}</h3>
                        <p className="text-xs text-gray-600 mt-1">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Logout button */}
              <Button
                variant="outline"
                className="w-full"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                {isLoggingOut ? "Signing out..." : "Sign Out"}
              </Button>
            </>
          ) : (
            // Unauthenticated user view
            <>
              {/* Features list */}
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-main-green/10 rounded-full flex items-center justify-center">
                      <feature.icon className="w-4 h-4 text-main-green" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{feature.title}</h3>
                      <p className="text-xs text-gray-600 mt-1">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sign up/Sign in buttons */}
              <div className="space-y-3">
                <Button
                  className="w-full bg-main-green hover:bg-main-green/90 text-white"
                  asChild
                >
                  <Link href="/account/login" onClick={onClose}>
                    Sign In
                  </Link>
                </Button>

                <Button variant="outline" className="w-full" asChild>
                  <Link href="/account/register" onClick={onClose}>
                    Create Account
                  </Link>
                </Button>

                <p className="text-xs text-center text-gray-500">
                  By signing in, you agree to our{" "}
                  <Link
                    href="/terms"
                    className="text-main-green hover:underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-main-green hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
