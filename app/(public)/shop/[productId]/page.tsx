"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Minus, Plus } from "lucide-react";
import Container from "@/components/container";
import { useCart } from "@/hooks/use-cart";
import { AddToCartButton } from "@/components/add-to-cart-button";

interface ProductImage {
  url: string;
  altText: string;
  width: number;
  height: number;
}

interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable: number;
  currentlyNotInStock: boolean;
  price: {
    amount: string;
    currencyCode: string;
  };
}

interface Product {
  id: string;
  title: string;
  description: string;
  featuredImage: ProductImage;
  images: {
    nodes: ProductImage[];
  };
  variants: {
    nodes: ProductVariant[];
  };
}

export default function ProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );

  const { addItem, loading: isLoading } = useCart();

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const resolvedParams = await params;
        const response = await fetch(
          `/api/product/${resolvedParams.productId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }
        const data = await response.json();
        setProduct(data);
        // Set the first variant as default
        if (data.variants.nodes.length > 0) {
          setSelectedVariant(data.variants.nodes[0]);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch product"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [params]);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedVariant || !product) {
      console.log("No variant or product selected");
      return;
    }

    try {
      console.log("Adding to cart:", {
        variantId: selectedVariant.id,
        quantity,
      });
      // Use the full Shopify GID for the variant
      await addItem(selectedVariant.id, quantity);

      // You could add a success notification here
      console.log("Added to cart successfully");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const totalPrice = selectedVariant
    ? parseFloat(selectedVariant.price.amount) * quantity
    : 0;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="animate-pulse">
            <div className="bg-gray-200 h-96 rounded-lg mb-4"></div>
            <div className="bg-gray-200 h-24 rounded-lg"></div>
          </div>
          <div className="animate-pulse space-y-4">
            <div className="bg-gray-200 h-8 rounded w-3/4"></div>
            <div className="bg-gray-200 h-6 rounded w-1/4"></div>
            <div className="bg-gray-200 h-32 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          <p>Error loading product: {error}</p>
        </div>
      </div>
    );
  }

  const allImages = [product.featuredImage, ...product.images.nodes];

  return (
    <Container className="py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left side - Images */}
        <div>
          {/* Main feature image */}
          <div className="aspect-square relative mb-6">
            <Image
              src={allImages[selectedImageIndex].url}
              alt={allImages[selectedImageIndex].altText || product.title}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Image carousel */}
          {allImages.length > 1 && (
            <div className="relative">
              <Carousel className="w-full">
                <CarouselContent>
                  {allImages.map((image, index) => (
                    <CarouselItem key={index} className="basis-1/4">
                      <div
                        className="aspect-square relative cursor-pointer"
                        onClick={() => setSelectedImageIndex(index)}
                      >
                        <Image
                          src={image.url}
                          alt={image.altText || product.title}
                          fill
                          className={`object-cover rounded-lg border-2 transition-all ${
                            selectedImageIndex === index
                              ? "border-main-green"
                              : "border-transparent hover:border-gray-300"
                          }`}
                          sizes="(max-width: 1024px) 25vw, 12.5vw"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          )}
        </div>

        {/* Right side - Product details */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.title}</h1>

          {selectedVariant && (
            <p className="text-2xl font-bold">
              ${parseFloat(selectedVariant.price.amount).toFixed(2)}
            </p>
          )}

          {/* Quantity selector */}
          <div className="flex items-center space-x-4">
            <span className="font-semibold">Quantity:</span>
            <div className="flex items-center border rounded-lg">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                className="rounded-r-none border-r-0"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="px-4 py-2 min-w-[60px] text-center">
                {quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(quantity + 1)}
                className="rounded-l-none border-l-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Add to cart button */}
          {selectedVariant && (
            <AddToCartButton
              variantId={selectedVariant.id}
              availableForSale={selectedVariant.availableForSale}
              currentlyNotInStock={selectedVariant.currentlyNotInStock}
              className="bg-main-green rounded-full hover:bg-main-green/90 text-white py-4 text-lg"
            >
              Add To Cart - ${totalPrice.toFixed(2)}
            </AddToCartButton>
          )}

          {/* Accordion */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="description">
              <AccordionTrigger>Description</AccordionTrigger>
              <AccordionContent>
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="shipping">
              <AccordionTrigger>Shipping & Returns</AccordionTrigger>
              <AccordionContent>
                <p className="mb-4">
                  For information about shipping and returns, please visit our{" "}
                  <Link
                    href="/shipping-returns"
                    className="text-main-green hover:underline"
                  >
                    shipping & returns page
                  </Link>
                  .
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </Container>
  );
}
