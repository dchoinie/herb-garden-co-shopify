"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, Search, ShoppingCart } from "lucide-react";
import { CustomerSession } from "@/lib/auth";
import Container from "./container";
import { UserAccountModal } from "./user-account-modal";

interface CustomerNavProps {
  session: CustomerSession | null;
}

interface NavItems {
  label: string;
  href?: string;
  subItems?: NavItems[];
}

const navItems: NavItems[] = [
  {
    label: "Shop",
    href: "/products",
  },
  {
    label: "About",
    subItems: [
      {
        label: "About Us",
        href: "/about-us",
      },
      {
        label: "Certificates of Analysis",
        href: "/coa",
      },
      {
        label: "Retail Stores",
        href: "/retail-stores",
      },
      {
        label: "Events",
        href: "/events",
      },
    ],
  },
  {
    label: "Contact",
    subItems: [
      {
        label: "Get In Touch",
        href: "/get-in-touch",
      },
      {
        label: "Wholesale Inquiry",
        href: "/wholesale-inquiry",
      },
    ],
  },
];

export function CustomerNav({ session }: CustomerNavProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

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
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative group"
                onMouseEnter={() => setHoveredItem(item.label)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {item.href ? (
                  <Link href={item.href} className="font-medium">
                    {item.label}
                  </Link>
                ) : (
                  <span className="font-medium cursor-pointer">
                    {item.label}
                  </span>
                )}

                {/* Dropdown menu */}
                {item.subItems && hoveredItem === item.label && (
                  <div
                    className="absolute top-full left-0 w-48 bg-main-green rounded-md shadow-lg py-2 z-50"
                    onMouseEnter={() => setHoveredItem(item.label)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.label}
                        href={subItem.href || "#"}
                        className="block px-4 py-2 text-white hover:underline transition-colors"
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
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
            <button className="p-2 hover:text-gray-300 transition-colors cursor-pointer">
              <Search className="h-6 w-6" />
            </button>
            <button
              className="p-2 hover:text-gray-300 transition-colors cursor-pointer"
              onClick={() => setIsUserModalOpen(true)}
            >
              <User className="h-6 w-6" />
            </button>
            <button className="p-2 hover:text-gray-300 transition-colors cursor-pointer">
              <ShoppingCart className="h-6 w-6" />
            </button>
          </div>
        </div>
      </Container>

      {/* User Account Modal */}
      <UserAccountModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
      />
    </div>
  );
}
