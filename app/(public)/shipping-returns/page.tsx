import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ShippingReturns() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Button asChild variant="ghost" className="mb-8">
          <Link href="/shop">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Shop
          </Link>
        </Button>

        <h1 className="text-4xl font-bold mb-8">Shipping & Returns</h1>

        <div className="space-y-12">
          {/* Shipping Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 text-main-green">
              Shipping Information
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Processing Time</h3>
                <p className="text-gray-700">
                  Orders are typically processed within 1-2 business days.
                  During peak seasons, processing may take up to 3-5 business
                  days.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Shipping Methods</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>
                    <strong>Standard Shipping:</strong> 5-7 business days
                  </li>
                  <li>
                    <strong>Express Shipping:</strong> 2-3 business days
                  </li>
                  <li>
                    <strong>Overnight Shipping:</strong> 1 business day
                    (available for select areas)
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Shipping Costs</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Free shipping on orders over $50</li>
                  <li>Standard shipping: $5.99</li>
                  <li>Express shipping: $12.99</li>
                  <li>Overnight shipping: $24.99</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Age Verification</h3>
                <p className="text-gray-700">
                  All orders require age verification. You must be 21 or older
                  to purchase our products. A valid government-issued ID will be
                  required upon delivery.
                </p>
              </div>
            </div>
          </section>

          {/* Returns Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 text-main-green">
              Returns & Refunds
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Return Policy</h3>
                <p className="text-gray-700">
                  Due to the nature of our products, we do not accept returns on
                  opened or used items. Unopened, unused products in their
                  original packaging may be returned within 30 days of purchase
                  for a full refund.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Defective Products</h3>
                <p className="text-gray-700">
                  If you receive a defective product, please contact our
                  customer service team within 7 days of delivery. We will
                  provide a replacement or full refund.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">How to Return</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>
                    Contact our customer service team to initiate a return
                  </li>
                  <li>Receive a return authorization number</li>
                  <li>Package the item securely in its original packaging</li>
                  <li>
                    Include the return authorization number with your package
                  </li>
                  <li>Ship to the provided return address</li>
                </ol>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Refund Processing</h3>
                <p className="text-gray-700">
                  Refunds will be processed within 5-7 business days of
                  receiving your return. The refund will be issued to the
                  original payment method used for the purchase.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 text-main-green">
              Need Help?
            </h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about shipping or returns, please don't
              hesitate to contact us.
            </p>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Email:</strong> support@herbgarden.com
              </p>
              <p>
                <strong>Phone:</strong> (555) 123-4567
              </p>
              <p>
                <strong>Hours:</strong> Monday - Friday, 9 AM - 6 PM EST
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
