"use client";

import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CartProps {
  isDrawer?: boolean;
  onClose?: () => void;
}

export function Cart({ isDrawer = false, onClose }: CartProps) {
  const {
    cart,
    items,
    itemCount,
    currency,
    loading: isLoading,
    error,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  // Use Shopify's calculated total
  const calculatedTotal = parseFloat(cart?.cost?.totalAmount?.amount || "0");

  const isEmpty = itemCount === 0;

  const handleCheckout = () => {
    if (isEmpty) return;
    // Always redirect to cart page for checkout options
    window.location.href = "/cart";
  };

  if (isEmpty) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Your Cart
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            Your cart is empty
          </p>
          <Button asChild className="w-full">
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Your Cart ({itemCount})
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearCart}
            disabled={isLoading}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3">
              {item.merchandise.product.featuredImage && (
                <div className="relative w-16 h-16 flex-shrink-0">
                  <Image
                    src={item.merchandise.product.featuredImage.url}
                    alt={
                      item.merchandise.product.featuredImage.altText ||
                      item.merchandise.product.title
                    }
                    fill
                    className="object-cover rounded"
                  />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <Link
                  href={`/shop/${item.merchandise.product.handle}`}
                  className="font-medium hover:underline truncate block"
                >
                  {item.merchandise.product.title}
                </Link>
                <p className="text-sm text-muted-foreground">
                  {item.merchandise.title &&
                    item.merchandise.title !== "Default Title" && (
                      <span className="block">{item.merchandise.title}</span>
                    )}
                  ${parseFloat(item.merchandise.price.amount).toFixed(2)}{" "}
                  {item.merchandise.price.currencyCode}
                  {(!item.merchandise.availableForSale ||
                    item.merchandise.currentlyNotInStock) && (
                    <span className="block text-red-600 text-xs">
                      Out of Stock
                    </span>
                  )}
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={isLoading}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>

                  <span className="text-sm w-8 text-center">
                    {item.quantity}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={isLoading}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    disabled={isLoading}
                    className="ml-auto"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>
              $
              {parseFloat(cart?.cost?.subtotalAmount?.amount || "0").toFixed(2)}{" "}
              {currency}
            </span>
          </div>

          <Separator />

          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>
              ${calculatedTotal.toFixed(2)} {currency}
            </span>
          </div>

          {isDrawer ? (
            // Drawer buttons - View Cart or Continue Shopping
            <>
              <Button asChild className="w-full" size="lg">
                <Link href="/cart" onClick={onClose}>
                  View Cart
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/shop" onClick={onClose}>
                  Continue Shopping
                </Link>
              </Button>
            </>
          ) : (
            // Cart page buttons - Secure Checkout or Continue Shopping
            <>
              <Button
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  "Loading..."
                ) : (
                  <>
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/shop">Continue Shopping</Link>
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
