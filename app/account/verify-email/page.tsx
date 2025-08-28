"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, Mail, ArrowRight } from "lucide-react";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setError(
        "Invalid verification link. Please check your email for the correct link."
      );
      setIsLoading(false);
      return;
    }

    verifyEmail(token);
  }, [searchParams]);

  const verifyEmail = async (token: string) => {
    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Verification failed");
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setEmail(data.email || "");
      setIsLoading(false);
    } catch (error) {
      console.error("Verification error:", error);
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!email) {
      setError("Email address not found. Please try registering again.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to resend verification email");
        setIsLoading(false);
        return;
      }

      setError("");
      setIsLoading(false);
      // Show success message
      alert("Verification email sent! Please check your inbox.");
    } catch (error) {
      console.error("Resend error:", error);
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <span className="ml-3">Verifying your email...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center gap-2">
            {success ? (
              <>
                <CheckCircle className="h-6 w-6 text-green-500" />
                Email Verified
              </>
            ) : (
              <>
                <XCircle className="h-6 w-6 text-red-500" />
                Verification Failed
              </>
            )}
          </CardTitle>
          <CardDescription className="text-center">
            {success
              ? "Your email address has been successfully verified!"
              : "We couldn't verify your email address"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {success && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Your account is now active! You can sign in to access your
                account.
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Button
              onClick={() => router.push("/account/login")}
              className="w-full"
            >
              Sign In
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}

          {!success && (
            <div className="space-y-3">
              <Button
                onClick={handleResendEmail}
                disabled={isLoading}
                variant="outline"
                className="w-full"
              >
                <Mail className="mr-2 h-4 w-4" />
                Resend Verification Email
              </Button>

              <Button
                onClick={() => router.push("/account/register")}
                variant="outline"
                className="w-full"
              >
                Create New Account
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
