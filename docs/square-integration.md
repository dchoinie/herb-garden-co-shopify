# Square Catalog Integration

This project integrates with the Square Catalog API to fetch and display products from your Square store.

## Features

- ✅ Fetch all products from your Square catalog
- ✅ Filter products by category
- ✅ Pagination support for large catalogs
- ✅ TypeScript support with proper types
- ✅ React hooks for easy component integration
- ✅ Error handling and loading states

## API Endpoints

### Products

- `GET /api/square/catalog` - Fetch all products
- `GET /api/square/catalog?categoryId=CATEGORY_ID` - Fetch products by category
- `GET /api/square/catalog/[id]` - Fetch a single product by ID

### Categories

- `GET /api/square/categories` - Fetch all categories

## Usage

### Using the React Hook

```tsx
import { useSquareCatalog } from "@/hooks/use-square-catalog";

function MyComponent() {
  const {
    products,
    categories,
    loading,
    error,
    fetchProducts,
    fetchCategories,
  } = useSquareCatalog({
    categoryId: "optional-category-id",
    limit: 20,
    autoFetch: true,
  });

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {products.map((product) => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
        </div>
      ))}
    </div>
  );
}
```

### Using the Service Directly

```tsx
import { squareCatalogService } from "@/lib/square-catalog";

// Fetch all products
const response = await squareCatalogService.getAllProducts(100);

// Fetch products by category
const categoryResponse = await squareCatalogService.getProductsByCategory(
  "CATEGORY_ID"
);

// Fetch all categories
const categoriesResponse = await squareCatalogService.getAllCategories();
```

## Environment Variables

Make sure you have these environment variables set:

```env
SQUARE_ACCESS_TOKEN=your_square_access_token
SQUARE_ENVIRONMENT=sandbox # or 'production'
```

## Data Structure

### SquareProduct

```typescript
interface SquareProduct {
  id: string;
  name: string;
  description: string;
  categoryId?: string;
  variations: SquareProductVariation[];
  productType?: string;
  availableOnline?: boolean;
  availableForPickup?: boolean;
  availableElectronically?: boolean;
  imageIds: string[];
  taxIds: string[];
  // ... more fields
}
```

### SquareProductVariation

```typescript
interface SquareProductVariation {
  id: string;
  name: string;
  price?: {
    amount: number;
    currency: string;
  };
  sku?: string;
  trackInventory?: boolean;
  // ... more fields
}
```

## Testing

1. Visit `/square-products` to see the demo page
2. Use the category filter to test category-specific fetching
3. Check the browser's network tab to see the API calls

## Future Enhancements

- [ ] Image fetching and display
- [ ] Inventory tracking
- [ ] Product search functionality
- [ ] Caching for better performance
- [ ] Real-time updates via webhooks
