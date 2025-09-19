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
  categories?: string[]; // Array of category IDs
  available_for_booking?: boolean;
  available_online?: boolean;
  available_for_pickup?: boolean;
  available_electronically?: boolean;
  image_ids?: string[];
  tax_ids?: string[];
  modifier_list_info?: any[];
  ecomImageUris?: string[]; // E-commerce image URIs
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

  getAllCategories: async (limit: number = 100, cursor?: string) => {
    try {
      console.log("Calling Square API for categories...");
      const response = await client.catalog.list({
        types: "CATEGORY",
        limit,
        cursor,
      });
      console.log("Square API categories response:", response);

      const categories = response.data || [];
      const hasMore = !!response.cursor;

      return {
        success: true,
        data: {
          categories,
          cursor: response.cursor,
          hasMore,
          totalCategories: categories.length,
        },
      };
    } catch (error) {
      console.error("Error fetching categories:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        data: {
          categories: [],
          hasMore: false,
          totalCategories: 0,
        },
      };
    }
  },

  getProductsByCategory: async (
    categoryName: string
  ): Promise<SquareCatalogObject[]> => {
    try {
      console.log(
        `Calling Square API for products in category: ${categoryName}`
      );

      // First, get all categories to find the one with the matching name
      const categoriesResponse = await client.catalog.list({
        types: "CATEGORY",
      });

      const categories = categoriesResponse.data || [];
      const targetCategory = categories.find(
        (cat: any) => cat.categoryData?.name === categoryName
      );

      if (!targetCategory) {
        console.log(`Category "${categoryName}" not found`);
        return [];
      }

      console.log(
        `Found category: ${categoryName} with ID: ${targetCategory.id}`
      );

      // Now get all items and filter by category_id or categories array
      const itemsResponse = await client.catalog.list({
        types: "ITEM",
      });

      const allItems = itemsResponse.data || [];
      const filteredItems = allItems.filter((item: any) => {
        const itemData = item.itemData;
        if (!itemData) return false;

        // Check if the item ONLY has the target category ID in its categories array
        // Categories array contains objects with id property, not just strings
        return (
          itemData.categories &&
          itemData.categories.length === 1 &&
          itemData.categories[0].id === targetCategory.id
        );
      });

      console.log(
        `Found ${filteredItems.length} products in category "${categoryName}"`
      );
      return filteredItems;
    } catch (error) {
      console.error("Error fetching products by category:", error);
      return [];
    }
  },

  getCategories: async (): Promise<SquareCatalogObject[]> => {
    try {
      console.log("Calling Square API for categories...");
      const response = await client.catalog.list({
        types: "CATEGORY",
      });
      console.log("Square API categories response:", response);
      return response.data || [];
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  },

  getOnlineProducts: async (): Promise<SquareCatalogObject[]> => {
    try {
      console.log("Fetching products from Online Products category...");

      // First, get all categories to find the one with the matching name
      const categoriesResponse = await client.catalog.list({
        types: "CATEGORY",
      });

      const categories = categoriesResponse.data || [];
      const targetCategory = categories.find(
        (cat: any) => cat.categoryData?.name === "Online Products"
      );

      if (!targetCategory) {
        console.log('Category "Online Products" not found');
        return [];
      }

      console.log(
        `Found category: Online Products with ID: ${targetCategory.id}`
      );

      // Now get all items and filter by categories array
      const itemsResponse = await client.catalog.list({
        types: "ITEM",
      });

      const allItems = itemsResponse.data || [];

      // Debug logging to see what categories each product has
      console.log(`Total items found: ${allItems.length}`);
      allItems.slice(0, 3).forEach((item: any, index: number) => {
        const itemData = item.itemData;
        if (itemData) {
          console.log(`Product ${index + 1} (${itemData.name}):`, {
            categories: itemData.categories,
            categoryId: itemData.categoryId,
            hasCategoriesArray: !!itemData.categories,
            categoriesLength: itemData.categories?.length || 0,
          });
        }
      });

      const filteredItems = allItems.filter((item: any) => {
        const itemData = item.itemData;
        if (!itemData) return false;

        // Check if the item ONLY has the target category ID in its categories array
        // Categories array contains objects with id property, not just strings
        return (
          itemData.categories &&
          itemData.categories.length === 1 &&
          itemData.categories[0].id === targetCategory.id
        );
      });

      console.log(
        `Found ${filteredItems.length} products in category "Online Products"`
      );
      return filteredItems;
    } catch (error) {
      console.error("Error fetching online products:", error);
      return [];
    }
  },
};
