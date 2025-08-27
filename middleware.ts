import { NextRequest, NextResponse } from "next/server";
import { verifyCustomerToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log("Middleware processing path:", pathname);

  // Define protected routes that require authentication
  const isProtectedRoute =
    pathname.startsWith("/account") &&
    !pathname.startsWith("/account/login") &&
    !pathname.startsWith("/account/register") &&
    !pathname.startsWith("/account/reset-password") &&
    !pathname.startsWith("/account/activate");

  console.log("Path checks:", {
    startsWithAccount: pathname.startsWith("/account"),
    startsWithLogin: pathname.startsWith("/account/login"),
    startsWithRegister: pathname.startsWith("/account/register"),
    startsWithResetPassword: pathname.startsWith("/account/reset-password"),
    startsWithActivate: pathname.startsWith("/account/activate"),
  });

  console.log("Is protected route:", isProtectedRoute);

  if (isProtectedRoute) {
    console.log("Processing protected route:", pathname);
    const customerToken = request.cookies.get("customer_token")?.value;

    if (!customerToken) {
      console.log("No token found, redirecting to login");
      // No token found, redirect to login
      return redirectToLogin(request, pathname);
    }

    try {
      // Verify the token
      const session = await verifyCustomerToken(customerToken);

      if (!session) {
        // Invalid or expired token, redirect to login
        return redirectToLogin(request, pathname);
      }

      // Token is valid, allow the request to proceed
      return NextResponse.next();
    } catch (error) {
      // Error verifying token, redirect to login
      return redirectToLogin(request, pathname);
    }
  }

  // For non-protected routes, allow the request to proceed
  return NextResponse.next();
}

function redirectToLogin(request: NextRequest, originalPath: string) {
  const loginUrl = new URL("/account/login", request.url);
  loginUrl.searchParams.set("redirect", originalPath);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
