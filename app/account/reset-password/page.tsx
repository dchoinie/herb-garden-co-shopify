import { redirect } from "next/navigation";
import { createCustomerToken, setCustomerCookie } from "@/lib/auth";

interface ResetPasswordPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  // Check if this is a Shopify password reset redirect
  const params = await searchParams;
  const token = params.token as string;
  const customerId = params.customer_id as string;
  const email = params.email as string;

  console.log("Reset password URL parameters:", {
    token,
    customerId,
    email,
    allParams: params,
  });

  if (token || customerId) {
    try {
      // Create a customer object for authentication
      const customer = {
        id: customerId || `gid://shopify/Customer/${Date.now()}`,
        email: email || "user@example.com",
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

      // Redirect to account page immediately
      redirect("/account");
    } catch (error) {
      console.error("Authentication error:", error);
      redirect("/account/login?error=reset-failed");
    }
  } else if (email) {
    try {
      // Try to authenticate the user with just the email
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

      // Redirect to account page immediately
      redirect("/account");
    } catch (error) {
      console.error("Email-based authentication error:", error);
      redirect(
        `/account/login?message=use-signin-link&email=${encodeURIComponent(
          email
        )}`
      );
    }
  } else {
    // No reset parameters, redirect to login
    redirect("/account/login?message=use-signin-link");
  }
}
