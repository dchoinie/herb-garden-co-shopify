"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CustomCheckout } from "@/components/checkout/custom-checkout";
import { initializeAnalytics } from "@/lib/analytics";
import { preloadCriticalResources } from "@/lib/performance";

export default function CustomCheckoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Initialize analytics and performance optimizations
    initializeAnalytics();
    preloadCriticalResources();

    // Track page view
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "page_view", {
        page_title: "Custom Checkout",
        page_location: window.location.href,
      });
    }
  }, []);

  const handleCheckoutComplete = (checkoutUrl: string) => {
    // Track successful checkout creation
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "checkout_complete", {
        checkout_url: checkoutUrl,
      });
    }

    // Redirect to Shopify's secure payment page
    window.location.href = checkoutUrl;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Secure Checkout
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">Powered by Shopify</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <CustomCheckout onComplete={handleCheckoutComplete} />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-500">
            <p>
              Your payment information is secure and encrypted. We use
              industry-standard SSL encryption to protect your data.
            </p>
            <div className="mt-4 flex items-center justify-center space-x-6">
              <span>🔒 SSL Secured</span>
              <span>🛡️ PCI Compliant</span>
              <span>⚡ Fast Checkout</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
