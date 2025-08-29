"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { ShoppingCart, Loader2 } from "lucide-react";

interface AddToCartButtonProps {
  variantId: string;
  className?: string;
  children?: React.ReactNode;
  availableForSale?: boolean;
  currentlyNotInStock?: boolean;
}

export function AddToCartButton({
  variantId,
  className,
  children,
  availableForSale = true,
  currentlyNotInStock = false,
}: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const { addItem, loading, error } = useCart();

  const isOutOfStock = !availableForSale || currentlyNotInStock;
  const isDisabled = loading || isAdding || isOutOfStock;

  const handleAddToCart = async () => {
    if (isOutOfStock) return;

    setIsAdding(true);

    try {
      await addItem(variantId, 1);
    } catch (err) {
      console.error("Failed to add item to cart:", err);
    } finally {
      setIsAdding(false);
    }
  };

  if (isOutOfStock) {
    return (
      <Button disabled className={className} size="sm" variant="outline">
        Out of Stock
      </Button>
    );
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isDisabled}
      className={className}
      size="sm"
    >
      {isDisabled ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <ShoppingCart className="mr-2 h-4 w-4" />
      )}
      {children || "Add to Cart"}
    </Button>
  );
}
