// Client-side cart service for browser components
// This version uses API routes to avoid exposing API tokens

// Cart types
export interface CartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    product: {
      title: string;
      handle: string;
      featuredImage?: {
        url: string;
        width: number;
        height: number;
        altText?: string;
      };
    };
    price: {
      amount: string;
      currencyCode: string;
    };
    availableForSale: boolean;
    currentlyNotInStock: boolean;
  };
}

export interface CartCost {
  subtotalAmount: {
    amount: string;
    currencyCode: string;
  };
  totalAmount: {
    amount: string;
    currencyCode: string;
  };
}

export interface CartAttribute {
  key: string;
  value: string;
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: CartCost;
  attributes?: CartAttribute[];
  lines: {
    nodes: CartLine[];
  };
}

class CartServiceClient {
  private async apiRequest(
    endpoint: string,
    method: string = "GET",
    body?: any
  ): Promise<any> {
    const response = await fetch(`/api/cart/${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}. ${errorText}`
      );
    }

    return response.json();
  }

  async createCart(variantId: string, quantity: number = 1): Promise<Cart> {
    try {
      const data = await this.apiRequest("create", "POST", {
        variantId,
        quantity,
      });

      if (data.error) {
        throw new Error(data.error);
      }

      return data.cart;
    } catch (error) {
      console.error("Error creating cart:", error);
      throw error;
    }
  }

  async addToCart(
    cartId: string,
    variantId: string,
    quantity: number = 1
  ): Promise<Cart> {
    try {
      const data = await this.apiRequest("add", "POST", {
        cartId,
        variantId,
        quantity,
      });

      if (data.error) {
        throw new Error(data.error);
      }

      return data.cart;
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  }

  async updateCartLine(
    cartId: string,
    lineId: string,
    quantity: number
  ): Promise<Cart> {
    try {
      const data = await this.apiRequest("update", "POST", {
        cartId,
        lineId,
        quantity,
      });

      if (data.error) {
        throw new Error(data.error);
      }

      return data.cart;
    } catch (error) {
      console.error("Error updating cart line:", error);
      throw error;
    }
  }

  async removeFromCart(cartId: string, lineIds: string[]): Promise<Cart> {
    try {
      const data = await this.apiRequest("remove", "POST", {
        cartId,
        lineIds,
      });

      if (data.error) {
        throw new Error(data.error);
      }

      return data.cart;
    } catch (error) {
      console.error("Error removing from cart:", error);
      throw error;
    }
  }

  async getCart(cartId: string): Promise<Cart | null> {
    try {
      const data = await this.apiRequest(
        `get?cartId=${encodeURIComponent(cartId)}`
      );

      if (data.error) {
        throw new Error(data.error);
      }

      return data.cart;
    } catch (error) {
      console.error("Error getting cart:", error);
      return null;
    }
  }
}

export const cartServiceClient = new CartServiceClient();
