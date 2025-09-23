"use client";

import { SquareCatalogObject } from "@/lib/square-catalog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, ImageIcon } from "lucide-react";
import Image from "next/image";

interface SquareProductsProps {
  className?: string;
  products: SquareCatalogObject[];
}

export function SquareProducts({ className, products }: SquareProductsProps) {
  const hasProducts = Array.isArray(products) && products.length > 0;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Products Grid */}
      <div className="space-y-4">
        {hasProducts ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No products found</p>
              </div>
            </CardContent>
          </Card>
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
    <Card className="h-full flex flex-col relative">
      {/* Fixed header with image and title */}
      <CardHeader className="flex-shrink-0">
        <div className="relative w-full h-64 mb-4">
          {itemData.ecomImageUris && itemData.ecomImageUris.length > 0 ? (
            <Image
              src={itemData.ecomImageUris[0]}
              alt={itemData.name}
              fill
              className="object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
              <ImageIcon className="h-12 w-12 text-gray-400" />
            </div>
          )}
        </div>
        <CardTitle className="text-lg">{itemData.name}</CardTitle>
      </CardHeader>

      {/* Flexible middle content area */}
      <CardContent className="flex-grow flex flex-col justify-between">
        <div className="space-y-4">
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
        </div>

        {/* Fixed bottom price section */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <span className="text-2xl font-bold">{formatPrice(price)}</span>
          {itemData.categoryId && (
            <Badge variant="secondary">Categorized</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
