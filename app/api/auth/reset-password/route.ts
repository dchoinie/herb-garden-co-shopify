import { NextRequest, NextResponse } from "next/server";
import { createCustomerToken, setCustomerCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { token, customerId, email, allParams } = await request.json();

    // Log all received parameters for debugging
    console.log("Reset password API received:", {
      token,
      customerId,
      email,
      allParams,
    });

    // If we have token or customerId, use them for authentication
    if (token || customerId) {
      try {
        // Create a customer object for authentication
        const customer = {
          id: customerId || `gid://shopify/Customer/${Date.now()}`,
          email: email || "user@example.com", // Fallback email if not provided
          firstName: "",
          lastName: "",
          phone: "",
          acceptsMarketing: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        console.log("Creating customer token for:", customer);

        const jwtToken = await createCustomerToken(customer);
        await setCustomerCookie(jwtToken);

        console.log("Successfully created JWT token and set cookie");

        return NextResponse.json({
          success: true,
          message: "Successfully authenticated",
        });
      } catch (error) {
        console.error("Authentication error:", error);
        return NextResponse.json(
          { error: "Failed to authenticate user" },
          { status: 500 }
        );
      }
    }

    // If we only have email, try to authenticate based on email
    if (email) {
      try {
        // In a real implementation, you would fetch the customer from Shopify using the email
        // For now, we'll create a customer object with the email
        const customer = {
          id: `gid://shopify/Customer/${Date.now()}`,
          email: email,
          firstName: "",
          lastName: "",
          phone: "",
          acceptsMarketing: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        console.log("Creating customer token for email:", email);

        const jwtToken = await createCustomerToken(customer);
        await setCustomerCookie(jwtToken);

        console.log("Successfully created JWT token and set cookie");

        return NextResponse.json({
          success: true,
          message: "Successfully authenticated",
        });
      } catch (error) {
        console.error("Email-based authentication error:", error);
        return NextResponse.json(
          { error: "Failed to authenticate user" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ error: "Invalid reset link" }, { status: 400 });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
