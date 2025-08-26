"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  User,
  Search,
  ShoppingCart,
} from "lucide-react";
import { CustomerSession } from "@/lib/auth";
import Container from "./container";

interface CustomerNavProps {
  session: CustomerSession | null;
}

export function CustomerNav({ session }: CustomerNavProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="bg-main-green">
      <Container className="py-4">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Navigation links */}
          <div className="flex items-center space-x-8 text-white">
            <Link
              href="/products"
              className="font-medium"
            >
              Shop
            </Link>
            <Link
              href="/about"
              className="font-medium"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="font-medium"
            >
              Contact
            </Link>
          </div>

          {/* Center - Logo */}
          <div className="flex-1 flex justify-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/logos/svg/HerbGarden_Logos-02.svg"
                alt="Herb Garden Co."
                width={200}
                height={150}
                className="h-14 w-auto"
              />
            </Link>
          </div>

          {/* Right side - Icons */}
          <div className="flex items-center space-x-4 text-white">
            <button className="p-2 hover:text-gray-300 transition-colors">
              <Search className="h-6 w-6" />
            </button>
            <button className="p-2 hover:text-gray-300 transition-colors">
              <User className="h-6 w-6" />
            </button>
            <button className="p-2 hover:text-gray-300 transition-colors">
              <ShoppingCart className="h-6 w-6" />
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
}
