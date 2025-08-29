import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Cart, CartLine, CartCost } from "./cart-service-client";

interface CartStore {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  setCart: (cart: Cart | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      cart: null,
      loading: false,
      error: null,
      setCart: (cart) => set({ cart, error: null }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error, loading: false }),
      clearCart: () => set({ cart: null, error: null }),
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);
