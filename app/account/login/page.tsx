"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, CheckCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [showActivationMessage, setShowActivationMessage] = useState(false);

  useEffect(() => {
    // Check if user was redirected from account activation or reset password
    const message = searchParams.get("message");
    const preFilledEmail = searchParams.get("email");

    if (message === "account-activated") {
      setShowActivationMessage(true);
    } else if (message === "use-signin-link") {
      setShowActivationMessage(true);
    }

    // Pre-fill email if provided in URL
    if (preFilledEmail) {
      setEmail(preFilledEmail);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    console.log("Submitting login form with email:", email);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      console.log("Login API response status:", response.status);
      const data = await response.json();
      console.log("Login API response data:", data);

      if (!response.ok) {
        if (response.status === 429) {
          setError(
            "Too many login attempts. Please wait a few minutes and try again."
          );
        } else {
          setError(data.error || "Login failed");
        }
        return;
      }

      setSuccess(true);
      // Don't redirect - show success message instead
    } catch (error) {
      console.error("Login form error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="mt-4">Check your email</CardTitle>
            <CardDescription>
              We've sent a sign-in link to {email}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Click the link in your email to sign in to your account. The link
              will expire in 24 hours.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSuccess(false);
                setEmail("");
              }}
              className="w-full"
            >
              Try another email
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Sign in to your account</CardTitle>
          <CardDescription className="text-center">
            Enter your email to receive a sign-in link
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {showActivationMessage && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  {searchParams.get("message") === "use-signin-link"
                    ? "Please enter your email to receive a sign-in link."
                    : "Your account has been activated! Please sign in to continue."}
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Sending sign-in link..." : "Send sign-in link"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto font-semibold"
                onClick={() => router.push("/account/register")}
              >
                Create one
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
