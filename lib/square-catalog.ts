import { client } from "@/lib/square";

// Square API Response Interfaces
export interface SquareCatalogListResponse {
  objects: SquareCatalogObject[];
}

export interface SquareCatalogObject {
  type:
    | "ITEM"
    | "CATEGORY"
    | "ITEM_VARIATION"
    | "MODIFIER_LIST"
    | "MODIFIER"
    | "TAX"
    | "DISCOUNT"
    | "IMAGE";
  id: string;
  updated_at: string;
  created_at: string;
  version: number;
  is_deleted: boolean;
  present_at_all_locations: boolean;
  item_data?: SquareItemData;
  category_data?: SquareCategoryData;
}

export interface SquareItemData {
  name: string;
  description: string;
  is_taxable: boolean;
  variations: SquareItemVariation[];
  product_type: "REGULAR" | "GIFT_CARD" | "APPOINTMENTS_SERVICE";
  skip_modifier_screen: boolean;
  description_html: string;
  description_plaintext: string;
  is_archived: boolean;
  is_alcoholic: boolean;
  category_id?: string;
  available_for_booking?: boolean;
  available_online?: boolean;
  available_for_pickup?: boolean;
  available_electronically?: boolean;
  image_ids?: string[];
  tax_ids?: string[];
  modifier_list_info?: any[];
}

export interface SquareItemVariation {
  type: "ITEM_VARIATION";
  id: string;
  updated_at: string;
  created_at: string;
  version: number;
  is_deleted: boolean;
  present_at_all_locations: boolean;
  item_variation_data: SquareItemVariationData;
}

export interface SquareItemVariationData {
  item_id: string;
  name: string;
  ordinal: number;
  pricing_type: "FIXED_PRICING" | "VARIABLE_PRICING";
  track_inventory: boolean;
  sellable: boolean;
  stockable: boolean;
  price_money?: {
    amount: number;
    currency: string;
  };
  sku?: string;
  available_for_booking?: boolean;
}

export interface SquareCategoryData {
  name: string;
  image_ids?: string[];
}

// Transformed Product Interfaces
export interface SquareProduct {
  id: string;
  name: string;
  description: string;
  categoryId?: string;
  variations: SquareProductVariation[];
  productType?: string;
  skipModifierScreen?: boolean;
  availableForBooking?: boolean;
  availableOnline?: boolean;
  availableForPickup?: boolean;
  availableElectronically?: boolean;
  imageIds: string[];
  taxIds: string[];
  modifierListInfo: any[];
  isTaxable?: boolean;
  isArchived?: boolean;
  isAlcoholic?: boolean;
  updatedAt?: string;
  createdAt?: string;
  version?: number;
}

export interface SquareProductVariation {
  id: string;
  name: string;
  price?: {
    amount: number;
    currency: string;
  };
  sku?: string;
  trackInventory?: boolean;
  availableForBooking?: boolean;
  ordinal?: number;
  pricingType?: string;
  sellable?: boolean;
  stockable?: boolean;
  updatedAt?: string;
  createdAt?: string;
  version?: number;
}

export interface SquareCategory {
  id: string;
  name: string;
  imageIds: string[];
}

export interface SquareCatalogResponse<T> {
  success: boolean;
  data: {
    products?: T[];
    categories?: T[];
    cursor?: string;
    hasMore: boolean;
    totalItems?: number;
    totalCategories?: number;
  };
  error?: string;
  details?: any[];
}

export const squareCatalogService = {
  getAllProducts: async (): Promise<SquareCatalogObject[]> => {
    try {
      console.log("Calling Square API...");
      const response = await client.catalog.list({
        types: "ITEM",
      });
      console.log("Square API response:", response);
      // The response is a Pageable object, we need to access the data property
      return response.data || [];
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  },
};
