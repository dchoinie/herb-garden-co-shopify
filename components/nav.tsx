"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, Search, Menu } from "lucide-react";
import Container from "./container";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingCart } from "lucide-react";

interface NavProps {
  // TODO: Add Square customer session type when ready
}

interface NavItems {
  label: string;
  href?: string;
  subItems?: NavItems[];
}

const navItems: NavItems[] = [
  {
    label: "Shop",
    href: "/shop",
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

export function Nav({}: NavProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const renderNavItems = (isMobileMenu = false) => (
    <>
      {navItems.map((item) => (
        <div
          key={item.label}
          className={`relative ${isMobileMenu ? "w-full" : "group"}`}
          onMouseEnter={() => !isMobileMenu && setHoveredItem(item.label)}
          onMouseLeave={() => !isMobileMenu && setHoveredItem(null)}
        >
          {item.href ? (
            <Link
              href={item.href}
              className={`font-medium ${
                isMobileMenu
                  ? "block w-full py-3 px-4 hover:bg-main-green/20 transition-colors"
                  : ""
              }`}
            >
              {item.label}
            </Link>
          ) : (
            <span
              className={`font-medium cursor-pointer ${
                isMobileMenu ? "block w-full py-3 px-4" : ""
              }`}
            >
              {item.label}
            </span>
          )}

          {/* Dropdown menu - only show on desktop */}
          {item.subItems && !isMobileMenu && hoveredItem === item.label && (
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

          {/* Mobile submenu */}
          {item.subItems && isMobileMenu && (
            <div className="ml-4 mt-2 space-y-1">
              {item.subItems.map((subItem) => (
                <Link
                  key={subItem.label}
                  href={subItem.href || "#"}
                  className="block py-2 px-4 text-white/80 hover:text-white hover:bg-main-green/20 transition-colors text-sm"
                >
                  {subItem.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </>
  );

  return (
    <div className="bg-main-green">
      <Container className="py-4">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Navigation links (desktop only) */}
          {!isMobile && (
            <div className="flex items-center space-x-8 text-white">
              {renderNavItems()}
            </div>
          )}

          {/* Mobile hamburger menu */}
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <button className="p-2 text-white hover:text-gray-300 transition-colors">
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="bg-main-green border-r-main-green/20 text-white"
              >
                <SheetHeader>
                  <SheetTitle className="text-white text-left">Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-2 text-white">
                  {renderNavItems(true)}
                </div>
              </SheetContent>
            </Sheet>
          )}

          {/* Center - Logo */}
          <div className="flex-1 flex justify-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/logos/svg/HerbGarden_Logos-02.svg"
                alt="Herb Garden Co."
                width={200}
                height={150}
                className={`${isMobile ? "h-10" : "h-14"} w-auto`}
              />
            </Link>
          </div>

          {/* Right side - Icons */}
          <div className="flex items-center space-x-1 text-white">
            <button className="p-2 hover:text-gray-300 transition-colors cursor-pointer">
              <Search className={`${isMobile ? "h-5 w-5" : "h-6 w-6"}`} />
            </button>
            <button className="p-2 hover:text-gray-300 transition-colors cursor-pointer">
              <User className={`${isMobile ? "h-5 w-5" : "h-6 w-6"}`} />
            </button>
            <ShoppingCart className={`${isMobile ? "h-5 w-5" : "h-6 w-6"}`} />
          </div>
        </div>
      </Container>

      {/* TODO: Add Square customer account modal when ready */}
    </div>
  );
}
