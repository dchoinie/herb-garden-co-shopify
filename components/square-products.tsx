"use client";

import { useState, useEffect } from "react";
import { SquareCatalogObject } from "@/lib/square-catalog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Package } from "lucide-react";

interface SquareProductsProps {
  className?: string;
}

export function SquareProducts({ className }: SquareProductsProps) {
  const [products, setProducts] = useState<SquareCatalogObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/square/catalog");
      const data = await response.json();

      if (data.success) {
        setProducts(data.data.objects);
      } else {
        throw new Error(data.error || "Failed to fetch products");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (error) {
    return (
      <div className={`p-6 ${className}`}>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <p>Error loading products: {error}</p>
              <Button onClick={fetchProducts} className="mt-4">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Products Grid */}
      <div className="space-y-4">
        {loading && products.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading products...</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {products.length === 0 && !loading && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center text-gray-500">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No products found</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}

interface ProductCardProps {
  product: SquareCatalogObject;
}

function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price?: { amount: number; currency: string }) => {
    if (!price) return "Price not set";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: price.currency,
    }).format(price.amount / 100);
  };

  // Cast to any to access the actual Square SDK response structure
  const productAny = product as any;
  if (!productAny.itemData) return null;

  const itemData = productAny.itemData;
  const primaryVariation = itemData.variations[0];
  const price = primaryVariation?.itemVariationData?.priceMoney;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">{itemData.name}</CardTitle>
        {itemData.description && (
          <CardDescription>{itemData.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">{formatPrice(price)}</span>
          {itemData.categoryId && (
            <Badge variant="secondary">Categorized</Badge>
          )}
        </div>

        {itemData.variations.length > 1 && (
          <div className="text-sm text-gray-600">
            {itemData.variations.length} variations available
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {itemData.availableOnline && (
            <Badge variant="outline" className="text-xs">
              Online
            </Badge>
          )}
          {itemData.availableForPickup && (
            <Badge variant="outline" className="text-xs">
              Pickup
            </Badge>
          )}
          {itemData.availableElectronically && (
            <Badge variant="outline" className="text-xs">
              Digital
            </Badge>
          )}
        </div>

        {primaryVariation?.itemVariationData?.sku && (
          <div className="text-xs text-gray-500">
            SKU: {primaryVariation.itemVariationData.sku}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
