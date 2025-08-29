"use client";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { Cart } from "./cart";
import { useIsMobile } from "@/hooks/use-mobile";

export function CartIcon() {
  const [isOpen, setIsOpen] = useState(false);
  const { itemCount } = useCart();
  const isMobile = useIsMobile();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="p-2 hover:text-gray-300 transition-colors cursor-pointer relative">
          <ShoppingCart className={`${isMobile ? "h-5 w-5" : "h-6 w-6"}`} />
          {itemCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {itemCount > 99 ? "99+" : itemCount}
            </Badge>
          )}
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <Cart />
        </div>
      </SheetContent>
    </Sheet>
  );
}
