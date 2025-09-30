/**
 * Cart Service for managing shopping cart state and operations
 * Integrates with Square catalog and tax calculation
 */

import { SquareCatalogObject } from "./square-catalog";
import { calculateTax, TaxCalculation } from "./tax-calculator";

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  description?: string;
}

export interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: TaxCalculation | null;
  total: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
}

class CartService {
  private carts: Map<string, Cart> = new Map();
  private currentCartId: string | null = null;

  /**
   * Create a new cart with an item
   */
  async createCart(variantId: string, quantity: number = 1): Promise<Cart> {
    const cartId = this.generateCartId();

    // For now, we'll create a simple cart structure
    // In a real app, you'd fetch product details from Square
    const cart: Cart = {
      id: cartId,
      items: [],
      subtotal: 0,
      tax: null,
      total: 0,
      currency: "USD",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.carts.set(cartId, cart);
    this.currentCartId = cartId;

    return cart;
  }

  /**
   * Add item to existing cart
   */
  async addToCart(
    cartId: string,
    variantId: string,
    quantity: number = 1
  ): Promise<Cart> {
    const cart = this.carts.get(cartId);
    if (!cart) {
      throw new Error("Cart not found");
    }

    // For now, we'll create a mock item
    // In a real app, you'd fetch product details from Square
    const newItem: CartItem = {
      id: `${variantId}-${Date.now()}`,
      productId: variantId,
      variantId,
      name: "Sample Product",
      price: 25.0,
      quantity,
      image: "/products/raspberry.webp",
      description: "Sample product description",
    };

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.variantId === variantId
    );

    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push(newItem);
    }

    cart.updatedAt = new Date();
    this.carts.set(cartId, cart);

    return cart;
  }

  /**
   * Get cart by ID
   */
  async getCart(cartId: string): Promise<Cart> {
    const cart = this.carts.get(cartId);
    if (!cart) {
      throw new Error("Cart not found");
    }
    return cart;
  }

  /**
   * Update item quantity in cart
   */
  async updateCartItem(
    cartId: string,
    itemId: string,
    quantity: number
  ): Promise<Cart> {
    const cart = this.carts.get(cartId);
    if (!cart) {
      throw new Error("Cart not found");
    }

    const itemIndex = cart.items.findIndex((item) => item.id === itemId);
    if (itemIndex === -1) {
      throw new Error("Item not found in cart");
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    cart.updatedAt = new Date();
    this.carts.set(cartId, cart);

    return cart;
  }

  /**
   * Remove item from cart
   */
  async removeFromCart(cartId: string, itemId: string): Promise<Cart> {
    const cart = this.carts.get(cartId);
    if (!cart) {
      throw new Error("Cart not found");
    }

    cart.items = cart.items.filter((item) => item.id !== itemId);
    cart.updatedAt = new Date();
    this.carts.set(cartId, cart);

    return cart;
  }

  /**
   * Calculate cart totals with tax
   */
  async calculateCartTotals(cartId: string, stateCode?: string): Promise<Cart> {
    const cart = this.carts.get(cartId);
    if (!cart) {
      throw new Error("Cart not found");
    }

    // Calculate subtotal
    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    cart.subtotal = subtotal;

    // Calculate tax if state is provided
    if (stateCode) {
      cart.tax = calculateTax(subtotal, stateCode, cart.currency);
      cart.total = cart.tax.total;
    } else {
      cart.tax = null;
      cart.total = subtotal;
    }

    cart.updatedAt = new Date();
    this.carts.set(cartId, cart);

    return cart;
  }

  /**
   * Clear cart
   */
  async clearCart(cartId: string): Promise<Cart> {
    const cart = this.carts.get(cartId);
    if (!cart) {
      throw new Error("Cart not found");
    }

    cart.items = [];
    cart.subtotal = 0;
    cart.tax = null;
    cart.total = 0;
    cart.updatedAt = new Date();
    this.carts.set(cartId, cart);

    return cart;
  }

  /**
   * Get current cart ID
   */
  getCurrentCartId(): string | null {
    return this.currentCartId;
  }

  /**
   * Set current cart ID
   */
  setCurrentCartId(cartId: string): void {
    this.currentCartId = cartId;
  }

  /**
   * Generate unique cart ID
   */
  private generateCartId(): string {
    return `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const cartService = new CartService();
