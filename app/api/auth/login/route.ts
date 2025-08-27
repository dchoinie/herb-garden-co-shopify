import { NextRequest, NextResponse } from "next/server";
import { customerLogin } from "@/lib/auth";
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

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Additional validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    try {
      console.log("Calling customerLogin with email:", email);

      // For passwordless auth, we send a sign-in link via email
      // The actual authentication happens when they click the email link
      const result = await customerLogin(email);

      console.log("customerLogin result:", result);

      if (!result.success) {
        console.log("Login failed:", result.message);
        return NextResponse.json({ error: result.message }, { status: 400 });
      }

      console.log("Login successful, returning success response");
      return NextResponse.json({
        success: true,
        message: result.message,
      });
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
