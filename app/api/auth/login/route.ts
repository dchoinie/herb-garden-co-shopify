import { NextRequest, NextResponse } from "next/server";
import { customerPasswordLogin, createCustomerToken } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    console.log("Login API called");

    // Rate limiting - 10 login attempts per 15 minutes per IP
    const rateLimit = checkRateLimit(request, "login", {
      maxRequests: 10,
      windowMs: 15 * 60 * 1000,
    });

    console.log("Rate limit check:", rateLimit);

    if (!rateLimit.allowed) {
      console.log("Rate limit exceeded");
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429 }
      );
    }

    const { email, password } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    // Additional validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    try {
      console.log("Calling customerPasswordLogin with email:", email);

      // Authenticate customer with email and password
      const result = await customerPasswordLogin(email, password);

      console.log("customerPasswordLogin result:", result);

      if (!result.success) {
        console.log("Login failed:", result.message);
        if (result.requiresVerification) {
          return NextResponse.json(
            {
              error: result.message,
              requiresVerification: true,
            },
            { status: 403 }
          );
        }
        return NextResponse.json({ error: result.message }, { status: 400 });
      }

      if (!result.customer) {
        console.log("No customer data returned");
        return NextResponse.json(
          { error: "Failed to retrieve customer data" },
          { status: 400 }
        );
      }

      console.log("Login successful, creating JWT session");

      // Create JWT token
      const jwtToken = await createCustomerToken(result.customer);

      // Set the cookie
      const response = NextResponse.json({
        success: true,
        message: "Login successful",
        redirect: "/account",
      });

      // Set the cookie in the response
      response.cookies.set("customer_token", jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60, // 24 hours
        path: "/",
      });

      return response;
    } catch (error) {
      console.error("Login error:", error);

      // Check if it's a Shopify API error
      if (error instanceof Error) {
        return NextResponse.json(
          { error: `Login failed: ${error.message}` },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: "Failed to send sign-in link. Please try again." },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
