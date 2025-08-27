"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, AlertCircle, Mail } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<
    "loading" | "success" | "error" | "redirect"
  >("loading");

  useEffect(() => {
    const handleReset = async () => {
      try {
        // Check if this is a Shopify password reset redirect
        const token = searchParams.get("token");
        const customerId = searchParams.get("customer_id");
        const email = searchParams.get("email");

        // Log all search parameters to see what Shopify sends
        console.log("Reset password URL parameters:", {
          token,
          customerId,
          email,
          allParams: Object.fromEntries(searchParams.entries()),
        });

        if (token || customerId) {
          // This is a valid password reset link
          // We need to authenticate the user using the reset token
          setStatus("loading");

          // Call our API to authenticate the user with the reset token
          const response = await fetch("/api/auth/reset-password", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token,
              customerId,
              email,
              // Send all search parameters for debugging
              allParams: Object.fromEntries(searchParams.entries()),
            }),
          });

          const data = await response.json();
          console.log("Reset password API response:", data);

          if (response.ok && data.success) {
            setStatus("success");
            // Redirect to account page after successful authentication
            setTimeout(() => {
              router.replace("/account");
            }, 2000);
          } else {
            setError(
              data.error ||
                "Failed to authenticate. Please try signing in again."
            );
            setStatus("error");
          }
        } else {
          // No reset parameters - this is likely a direct link from email
          // Since Shopify doesn't pass authentication tokens to custom URLs,
          // we'll try to authenticate the user based on the email parameter
          const emailParam = searchParams.get("email");

          if (emailParam) {
            // Try to authenticate the user with just the email
            setStatus("loading");

            const response = await fetch("/api/auth/reset-password", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: emailParam,
                allParams: Object.fromEntries(searchParams.entries()),
              }),
            });

            const data = await response.json();
            console.log("Password reset API response:", data);

            if (response.ok && data.success) {
              setStatus("success");
              // Redirect to account page after successful authentication
              setTimeout(() => {
                router.replace("/account");
              }, 2000);
            } else {
              // If authentication fails, redirect to login with pre-filled email
              setStatus("redirect");
              setTimeout(() => {
                router.replace(
                  `/account/login?message=use-signin-link&email=${encodeURIComponent(
                    emailParam
                  )}`
                );
              }, 3000);
            }
          } else {
            // No email parameter, redirect to login
            setStatus("redirect");
            setTimeout(() => {
              router.replace("/account/login?message=use-signin-link");
            }, 3000);
          }
        }
      } catch (error) {
        console.error("Password reset error:", error);
        setError(
          "Failed to process password reset. Please try signing in again."
        );
        setStatus("error");
      } finally {
        setIsLoading(false);
      }
    };

    handleReset();
  }, [searchParams, router]);

  if (status === "redirect") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="mt-4">Sign in to your account</CardTitle>
            <CardDescription>
              Please use the sign-in link sent to your email
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Redirecting you to the sign-in page...
            </p>
            <div className="flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="mt-4">Welcome back!</CardTitle>
            <CardDescription>
              You've been successfully signed in.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Redirecting you to your account...
            </p>
            <div className="flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="mt-4">Sign-in Failed</CardTitle>
            <CardDescription>
              There was an issue signing you in.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button
              onClick={() => router.push("/account/login")}
              className="w-full"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          </div>
          <CardTitle className="mt-4">Signing you in</CardTitle>
          <CardDescription>
            Please wait while we authenticate your account...
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
