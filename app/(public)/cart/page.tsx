"use client";

import { useRouter } from "next/navigation";
import Container from "@/components/container";
import { Cart } from "@/components/cart";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const { cart } = useCart();
  const router = useRouter();

  return (
    <Container className="py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Cart</h1>
          <p className="text-muted-foreground">
            Review your items and proceed to checkout
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Cart />

          {cart && cart.lines?.nodes?.length > 0 && (
            <div className="mt-6">
              <Button asChild>
                <Link href="/custom-checkout">Proceed to Checkout</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
