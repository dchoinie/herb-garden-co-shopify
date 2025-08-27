'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from './ui/card';

interface Product {
  id: string;
  handle: string;
  title: string;
  featuredImage: {
    url: string;
    altText: string;
    width: number;
    height: number;
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
}

interface Collection {
  id: string;
  title: string;
  description: string;
  products: {
    nodes: Product[];
  };
}

export default function SingleProducts() {
  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCollection() {
      try {
        setLoading(true);
        const response = await fetch('/api/collection/singles');
        if (!response.ok) {
          throw new Error('Failed to fetch collection');
        }
        const data = await response.json();
        setCollection(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch collection');
      } finally {
        setLoading(false);
      }
    }

    fetchCollection();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
                <div className="bg-gray-200 h-6 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-1/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          <p>Error loading products: {error}</p>
        </div>
      </div>
    );
  }

  if (!collection || collection.products.nodes.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>No products found in the Singles collection.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
        {collection.products.nodes.map((product) => (
          <Card key={product.id} className="overflow-hidden shadow-none border-none bg-transparent">
            <CardContent className="p-0">
              <div className="aspect-square relative">
                <Image
                  src={product.featuredImage.url}
                  alt={product.featuredImage.altText || product.title}
                  fill
                  className="object-cover rounded-md"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl mb-2 !font-funnel">{product.title}</h3>
                <p className="text-lg font-semibold text-gray-900">
                  ${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
