import { NextRequest, NextResponse } from "next/server";
import {
  customerPasswordRegister,
  createCustomerToken,
  setCustomerCookie,
} from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // Rate limiting - 5 registration attempts per 15 minutes per IP
    const rateLimit = checkRateLimit(request, "register", {
      maxRequests: 5,
      windowMs: 15 * 60 * 1000,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many registration attempts. Please try again later." },
        { status: 429 }
      );
    }

    const {
      email,
      firstName,
      lastName,
      phone,
      acceptsMarketing,
      website,
      password,
    } = await request.json();

    // Honeypot protection - if website field is filled, it's likely a bot
    if (website) {
      console.log("Bot detected via honeypot field");
      return NextResponse.json(
        { error: "Registration failed" },
        { status: 400 }
      );
    }

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

    // Check for suspicious patterns
    if (email.includes("test") && email.includes("@test")) {
      return NextResponse.json(
        { error: "Registration failed" },
        { status: 400 }
      );
    }

    // Format phone number for Shopify (remove all non-digits and ensure it starts with +1 for US numbers)
    let formattedPhone = undefined;
    if (phone && phone.trim()) {
      // Remove all non-digit characters
      const digitsOnly = phone.replace(/\D/g, "");

      // If it's a US number (10 digits), add +1 prefix
      if (digitsOnly.length === 10) {
        formattedPhone = `+1${digitsOnly}`;
      } else if (digitsOnly.length === 11 && digitsOnly.startsWith("1")) {
        // If it's already 11 digits with 1 prefix, add + sign
        formattedPhone = `+${digitsOnly}`;
      } else if (digitsOnly.length > 0) {
        // For other formats, just add + prefix
        formattedPhone = `+${digitsOnly}`;
      }
      // If no valid digits, formattedPhone remains undefined
    }

    try {
      const result = await customerPasswordRegister({
        email,
        firstName,
        lastName,
        phone: formattedPhone,
        acceptsMarketing: acceptsMarketing || false,
        password,
      });

      if (!result.success) {
        return NextResponse.json({ error: result.message }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      console.error("Registration error:", error);

      // Check if it's a Shopify API error
      if (error instanceof Error) {
        return NextResponse.json(
          { error: `Registration failed: ${error.message}` },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: "Failed to send sign-in link. Please try again." },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
