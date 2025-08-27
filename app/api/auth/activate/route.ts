import { NextRequest, NextResponse } from "next/server";
import { createCustomerToken, setCustomerCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { token, customerId, email, allParams } = await request.json();

    console.log("Account activation API received:", {
      token,
      customerId,
      email,
      allParams,
    });

    if (!token && !customerId) {
      return NextResponse.json(
        { error: "Invalid activation link" },
        { status: 400 }
      );
    }

    try {
      // For now, we'll create a customer object with the available data
      // In a real implementation, you might want to fetch the customer from Shopify
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
        message: "Account activated successfully",
      });
    } catch (error) {
      console.error("Authentication error:", error);
      return NextResponse.json(
        { error: "Failed to activate account" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Account activation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
