import { useCallback, useEffect } from "react";
import { useCartStore } from "@/lib/cart-store";
import { cartServiceClient } from "@/lib/cart-service-client";

export function useCart() {
  const { cart, loading, error, setCart, setLoading, setError, clearCart } =
    useCartStore();

  // Load cart from storage on mount
  useEffect(() => {
    if (cart?.id) {
      // Refresh cart data from server
      refreshCart();
    }
  }, []);

  const refreshCart = useCallback(async () => {
    if (!cart?.id) return;

    try {
      setLoading(true);
      setError(null);
      const updatedCart = await cartServiceClient.getCart(cart.id);
      if (updatedCart) {
        setCart(updatedCart);
      } else {
        // Cart no longer exists, clear it
        clearCart();
      }
    } catch (err) {
      console.error("Error refreshing cart:", err);
      setError(err instanceof Error ? err.message : "Failed to refresh cart");
    } finally {
      setLoading(false);
    }
  }, [cart?.id, setCart, setLoading, setError, clearCart]);

  const addItem = useCallback(
    async (variantId: string, quantity: number = 1) => {
      try {
        setLoading(true);
        setError(null);

        let updatedCart: any;

        if (!cart) {
          // Create new cart
          updatedCart = await cartServiceClient.createCart(variantId, quantity);
        } else {
          // Add to existing cart
          updatedCart = await cartServiceClient.addToCart(
            cart.id,
            variantId,
            quantity
          );
        }

        setCart(updatedCart);
        return updatedCart;
      } catch (err) {
        console.error("Error adding item to cart:", err);
        const message =
          err instanceof Error ? err.message : "Failed to add item to cart";

        // Check if it's an environment variable error
        if (
          message.includes("not configured") ||
          message.includes("environment variables")
        ) {
          setError(
            "Cart system is not properly configured. Please check your environment variables."
          );
        } else {
          setError(message);
        }
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [cart, setCart, setLoading, setError]
  );

  const updateQuantity = useCallback(
    async (lineId: string, quantity: number) => {
      if (!cart?.id) {
        throw new Error("No cart available");
      }

      try {
        setLoading(true);
        setError(null);

        if (quantity <= 0) {
          // Remove item if quantity is 0 or negative
          const updatedCart = await cartServiceClient.removeFromCart(cart.id, [
            lineId,
          ]);
          setCart(updatedCart);
        } else {
          // Update quantity
          const updatedCart = await cartServiceClient.updateCartLine(
            cart.id,
            lineId,
            quantity
          );
          setCart(updatedCart);
        }
      } catch (err) {
        console.error("Error updating cart quantity:", err);
        const message =
          err instanceof Error ? err.message : "Failed to update quantity";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [cart?.id, setCart, setLoading, setError]
  );

  const removeItem = useCallback(
    async (lineId: string) => {
      if (!cart?.id) {
        throw new Error("No cart available");
      }

      try {
        setLoading(true);
        setError(null);
        const updatedCart = await cartServiceClient.removeFromCart(cart.id, [
          lineId,
        ]);
        setCart(updatedCart);
      } catch (err) {
        console.error("Error removing item from cart:", err);
        const message =
          err instanceof Error ? err.message : "Failed to remove item";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [cart?.id, setCart, setLoading, setError]
  );

  const clearCartData = useCallback(() => {
    clearCart();
  }, [clearCart]);

  // Calculate item count excluding tax items
  const filteredItems =
    cart?.lines?.nodes?.filter((item: any) => {
      // Check if this is a tax item by looking for tax_type attribute
      return !item.attributes?.some(
        (attr: any) =>
          attr.key === "tax_type" && attr.value === "minnesota_hemp_tax"
      );
    }) || [];

  const filteredItemCount = filteredItems.reduce((total: number, item: any) => {
    return total + item.quantity;
  }, 0);

  return {
    cart,
    items: cart?.lines?.nodes || [],
    itemCount: filteredItemCount, // Use filtered count instead of totalQuantity
    totalPrice: cart?.cost?.totalAmount?.amount || "0",
    currency: cart?.cost?.totalAmount?.currencyCode || "USD",
    checkoutUrl: cart?.checkoutUrl,
    loading,
    error,
    addItem,
    updateQuantity,
    removeItem,
    clearCart: clearCartData,
    refreshCart,
  };
}
