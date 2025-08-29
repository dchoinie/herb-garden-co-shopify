"use client";

import Container from "@/components/container";
import { Cart } from "@/components/cart";

export default function CartPage() {
  return (
    <Container className="py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Shopping Cart</h1>
        <Cart />
      </div>
    </Container>
  );
}
