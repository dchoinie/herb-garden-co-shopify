// Client-safe auth types that can be imported by client components
// This file contains only TypeScript interfaces and types, no server-only code

export interface CustomerSession {
  customerId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  expiresAt: number;
}

// Enhanced customer data interface with Admin API fields
export interface CustomerAccount {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  acceptsMarketing: boolean;
  createdAt: string;
  updatedAt: string;
  // Additional Admin API fields
  numberOfOrders?: number;
  amountSpent?: {
    amount: string;
    currencyCode: string;
  };
  verifiedEmail?: boolean;
  validEmailAddress?: boolean;
  tags?: string[];
  lifetimeDuration?: string;
  note?: string;
  state?: string;
  taxExempt?: boolean;
  taxExemptions?: string[];
  defaultAddress?: {
    id?: string;
    formattedArea?: string;
    address1?: string;
    address2?: string;
    city?: string;
    province?: string;
    country?: string;
    zip?: string;
    company?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
  addresses?: Array<{
    id?: string;
    address1?: string;
    address2?: string;
    city?: string;
    province?: string;
    country?: string;
    zip?: string;
    company?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  }>;
  image?: {
    id?: string;
    src?: string;
    altText?: string;
    width?: number;
    height?: number;
  };
  canDelete?: boolean;
  orders?: {
    nodes: Array<{
      id: string;
      name: string;
      createdAt: string;
      fulfillmentStatus: string;
      financialStatus: string;
      totalPriceSet: {
        shopMoney: {
          amount: string;
          currencyCode: string;
        };
      };
      lineItems: {
        nodes: Array<{
          id: string;
          title: string;
          quantity: number;
          variant: {
            id: string;
            title: string;
            price: {
              amount: string;
              currencyCode: string;
            };
            product: {
              title: string;
              handle: string;
              featuredImage?: {
                url: string;
                altText?: string;
              };
            };
          };
        }>;
      };
    }>;
  };
}
