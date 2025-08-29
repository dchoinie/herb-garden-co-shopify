"use client";

import Container from "@/components/container";
import { Cart } from "@/components/cart";
import { ShippingAddressForm } from "@/components/shipping-address-form";

export default function CartPage() {
  return (
    <Container className="py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Shopping Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Cart Items</h2>
            <Cart />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
            <ShippingAddressForm />
          </div>
        </div>
      </div>
    </Container>
  );
}
