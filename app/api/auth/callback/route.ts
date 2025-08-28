import { NextRequest, NextResponse } from "next/server";
import {
  handleCustomerAccessToken,
  createCustomerToken,
  setCustomerCookie,
} from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const customerId = searchParams.get("id");

    console.log("Auth callback received:", { token: !!token, customerId });

    if (!token) {
      console.log("No token provided in callback");
      return NextResponse.redirect(
        new URL("/account/login?error=invalid_token", request.url)
      );
    }

    // Handle the customer access token from Shopify
    const customer = await handleCustomerAccessToken(token);

    if (!customer) {
      console.log("Failed to get customer data from access token");
      return NextResponse.redirect(
        new URL("/account/login?error=invalid_token", request.url)
      );
    }

    console.log("Customer authenticated:", customer.email);

    // Create our JWT token
    const jwtToken = await createCustomerToken(customer);

    // Set the cookie
    const response = NextResponse.redirect(new URL("/account", request.url));

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
    console.error("Auth callback error:", error);
    return NextResponse.redirect(
      new URL("/account/login?error=callback_failed", request.url)
    );
  }
}
