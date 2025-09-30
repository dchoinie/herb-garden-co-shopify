"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import { Cart, CartItem, CartState } from "./cart-service";

interface CartContextType extends CartState {
  addToCart: (productData: any, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  calculateTotals: (stateCode?: string) => Promise<void>;
  setCart: (cart: Cart) => void;
  isDrawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: React.ReactNode;
}

type CartAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_CART"; payload: Cart | null }
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "UPDATE_ITEM"; payload: { itemId: string; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "CLEAR_CART" };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_CART":
      return { ...state, cart: action.payload, isLoading: false, error: null };
    case "ADD_ITEM":
      if (!state.cart) {
        const newCart: Cart = {
          id: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          items: [action.payload],
          subtotal: action.payload.price * action.payload.quantity,
          tax: null,
          total: action.payload.price * action.payload.quantity,
          currency: "USD",
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        return { ...state, cart: newCart };
      }
      const existingItemIndex = state.cart.items.findIndex(
        (item) => item.variantId === action.payload.variantId
      );
      let newItems;
      if (existingItemIndex >= 0) {
        newItems = [...state.cart.items];
        newItems[existingItemIndex].quantity += action.payload.quantity;
      } else {
        newItems = [...state.cart.items, action.payload];
      }
      const updatedCart = {
        ...state.cart,
        items: newItems,
        subtotal: newItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
        updatedAt: new Date(),
      };
      return {
        ...state,
        cart: updatedCart,
      };
    case "UPDATE_ITEM":
      if (!state.cart) return state;
      const updatedItems = state.cart.items
        .map((item) =>
          item.id === action.payload.itemId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
        .filter((item) => item.quantity > 0);
      return {
        ...state,
        cart: {
          ...state.cart,
          items: updatedItems,
          updatedAt: new Date(),
        },
      };
    case "REMOVE_ITEM":
      if (!state.cart) return state;
      return {
        ...state,
        cart: {
          ...state.cart,
          items: state.cart.items.filter((item) => item.id !== action.payload),
          updatedAt: new Date(),
        },
      };
    case "CLEAR_CART":
      if (!state.cart) return state;
      return {
        ...state,
        cart: {
          ...state.cart,
          items: [],
          subtotal: 0,
          tax: null,
          total: 0,
          updatedAt: new Date(),
        },
      };
    default:
      return state;
  }
}

export function CartProvider({ children }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, {
    cart: null,
    isLoading: false,
    error: null,
  });
  const [isDrawerOpen, setDrawerOpen] = React.useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const cart = JSON.parse(savedCart);
        dispatch({ type: "SET_CART", payload: cart });
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (state.cart) {
      localStorage.setItem("cart", JSON.stringify(state.cart));
    }
  }, [state.cart]);

  const addToCart = async (productData: any, quantity: number = 1) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      console.log("Adding product to cart with data:", productData);

      // Extract product information from Square catalog data
      const itemData = productData.itemData;
      const primaryVariation = itemData.variations[0];
      const price = primaryVariation?.itemVariationData?.priceMoney;

      const newItem: CartItem = {
        id: `${productData.id}-${Date.now()}`,
        productId: productData.id,
        variantId: primaryVariation?.id || productData.id,
        name: itemData.name || "Product",
        price: price ? price.amount / 100 : 25.0, // Convert from cents to dollars
        quantity,
        image: itemData.ecomImageUris?.[0] || "/products/raspberry.webp",
        description: itemData.description || "",
      };

      dispatch({ type: "ADD_ITEM", payload: newItem });
      // Automatically open the drawer when item is added
      setDrawerOpen(true);
    } catch (error) {
      console.error("CartContext: Error adding to cart", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to add item to cart" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      dispatch({ type: "UPDATE_ITEM", payload: { itemId, quantity } });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to update item quantity",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const removeFromCart = async (itemId: string) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      dispatch({ type: "REMOVE_ITEM", payload: itemId });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to remove item from cart",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const clearCart = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      dispatch({ type: "CLEAR_CART" });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to clear cart" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const calculateTotals = async (stateCode?: string) => {
    if (!state.cart) return;

    dispatch({ type: "SET_LOADING", payload: true });
    try {
      // Calculate subtotal
      const subtotal = state.cart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      // Calculate tax if state is provided
      let tax = null;
      let total = subtotal;

      if (stateCode) {
        const { calculateTax } = await import("./tax-calculator");
        tax = calculateTax(subtotal, stateCode, state.cart.currency);
        total = tax.total;
      }

      const updatedCart: Cart = {
        ...state.cart,
        subtotal,
        tax,
        total,
        updatedAt: new Date(),
      };

      dispatch({ type: "SET_CART", payload: updatedCart });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to calculate totals" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const setCart = (cart: Cart) => {
    dispatch({ type: "SET_CART", payload: cart });
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        calculateTotals,
        setCart,
        isDrawerOpen,
        setDrawerOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
