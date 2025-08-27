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
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ActivatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    const handleActivation = async () => {
      try {
        // Check if this is a Shopify account confirmation redirect
        const token = searchParams.get("token");
        const customerId = searchParams.get("customer_id");
        const email = searchParams.get("email");

        // Log all search parameters to see what Shopify sends
        console.log("Account activation URL parameters:", {
          token,
          customerId,
          email,
          allParams: Object.fromEntries(searchParams.entries()),
        });

        if (token || customerId) {
          // This is a Shopify confirmation link - authenticate the user
          setStatus("loading");

          // Call our API to authenticate the user with the confirmation token
          const response = await fetch("/api/auth/activate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token,
              customerId,
              email,
              allParams: Object.fromEntries(searchParams.entries()),
            }),
          });

          const data = await response.json();
          console.log("Account activation API response:", data);

          if (response.ok && data.success) {
            setStatus("success");
            // Redirect to account page after successful authentication
            setTimeout(() => {
              router.replace("/account");
            }, 2000);
          } else {
            setError(
              data.error || "Failed to activate account. Please try signing in."
            );
            setStatus("error");
          }
        } else {
          // No confirmation parameters, redirect to account
          router.replace("/account");
        }
      } catch (error) {
        console.error("Activation error:", error);
        setError("Failed to activate account. Please try signing in.");
        setStatus("error");
      } finally {
        setIsLoading(false);
      }
    };

    handleActivation();
  }, [searchParams, router]);

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="mt-4">Welcome!</CardTitle>
            <CardDescription>
              Your account has been successfully activated.
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
            <CardTitle className="mt-4">Activation Failed</CardTitle>
            <CardDescription>
              There was an issue activating your account.
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
              Go to Sign In
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
          <CardTitle className="mt-4">Activating your account</CardTitle>
          <CardDescription>
            Please wait while we set up your account...
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
