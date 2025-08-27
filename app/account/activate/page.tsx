import { redirect } from "next/navigation";
import { createCustomerToken, setCustomerCookie } from "@/lib/auth";

interface ActivatePageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

// Server Action for handling activation
async function handleActivation(formData: FormData) {
  "use server";

  const email = formData.get("email") as string;
  const token = formData.get("token") as string;
  const customerId = formData.get("customerId") as string;

  console.log("Server Action - Account activation parameters:", {
    token,
    customerId,
    email,
  });

  if (token || customerId || email) {
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

      console.log("Server Action - Creating customer token for:", customer);

      const jwtToken = await createCustomerToken(customer);
      console.log(
        "Server Action - JWT token created:",
        jwtToken.substring(0, 50) + "..."
      );

      await setCustomerCookie(jwtToken);
      console.log("Server Action - Cookie set successfully");

      console.log(
        "Server Action - Successfully created JWT token and set cookie"
      );

      // Redirect to account page immediately - this will throw NEXT_REDIRECT which is normal
      redirect("/account");
    } catch (error) {
      // Check if this is a Next.js redirect (which is normal)
      if (error instanceof Error && error.message === "NEXT_REDIRECT") {
        console.log("Server Action - Redirect successful, this is normal");
        // Re-throw the redirect error so Next.js can handle it
        throw error;
      }

      console.error("Server Action - Authentication error:", error);
      console.error("Server Action - Error details:", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        customerData: {
          id: customerId || `gid://shopify/Customer/${Date.now()}`,
          email: email || "user@example.com",
        },
      });
      redirect("/account/login?error=activation-failed");
    }
  } else {
    console.log(
      "Server Action - No token, customerId, or email found, redirecting to login"
    );
    redirect("/account/login?error=no-activation-params");
  }
}

export default async function ActivatePage({
  searchParams,
}: ActivatePageProps) {
  // Check if this is a Shopify account confirmation redirect
  const params = await searchParams;
  const token = params.token as string;
  const customerId = params.customer_id as string;
  const email = params.email as string;

  console.log("Account activation URL parameters:", {
    token,
    customerId,
    email,
    allParams: params,
  });

  if (token || customerId || email) {
    // Use Server Action to handle the authentication
    return (
      <form action={handleActivation}>
        <input type="hidden" name="token" value={token || ""} />
        <input type="hidden" name="customerId" value={customerId || ""} />
        <input type="hidden" name="email" value={email || ""} />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">
              Activating your account...
            </h1>
            <p className="text-gray-600 mb-4">
              Please wait while we set up your account.
            </p>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Complete Activation
            </button>
          </div>
        </div>
      </form>
    );
  } else {
    console.log("No token, customerId, or email found, redirecting to login");
    redirect("/account/login?error=no-activation-params");
  }
}
