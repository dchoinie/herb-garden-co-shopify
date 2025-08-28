import { NextRequest, NextResponse } from "next/server";
import { sendVerificationEmail } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // Rate limiting - 3 resend attempts per 15 minutes per IP
    const rateLimit = checkRateLimit(request, "resend-verification", {
      maxRequests: 3,
      windowMs: 15 * 60 * 1000,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many resend attempts. Please try again later." },
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

    // Find the customer by email to get their ID
    const { customerRequest } = await import("@/lib/shopify");

    const query = /* GraphQL */ `
      query getCustomerByEmail($email: String!) {
        customers(first: 1, query: $email) {
          nodes {
            id
            email
            verifiedEmail
          }
        }
      }
    `;

    const data = await customerRequest<{
      customers: {
        nodes: Array<{
          id: string;
          email: string;
          verifiedEmail: boolean;
        }>;
      };
    }>(query, { email });

    const customer = data.customers.nodes[0];

    if (!customer) {
      return NextResponse.json(
        { error: "No account found with this email address" },
        { status: 404 }
      );
    }

    if (customer.verifiedEmail) {
      return NextResponse.json(
        { error: "This email address is already verified" },
        { status: 400 }
      );
    }

    // Send verification email
    const emailSent = await sendVerificationEmail(customer.id, customer.email);

    if (!emailSent) {
      return NextResponse.json(
        { error: "Failed to send verification email. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Verification email sent successfully",
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
