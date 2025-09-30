import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Nav } from "@/components/nav";
import Footer from "@/components/footer";
import { CartProvider } from "@/lib/cart-context";

const domine = localFont({
  src: "../public/fonts/Domine-VariableFont_wght.ttf",
  variable: "--font-domine",
  display: "swap",
});

const funnel = localFont({
  src: "../public/fonts/FunnelSans-VariableFont_wght.ttf",
  variable: "--font-funnel",
  display: "swap",
});

const funnelItalic = localFont({
  src: "../public/fonts/FunnelSans-Italic-VariableFont_wght.ttf",
  variable: "--font-funnel-italic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Herb Garden Co.",
  description: "Herb Garden Co.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${domine.variable} ${funnel.variable} ${funnelItalic.variable} antialiased`}
      >
        <CartProvider>
          <Nav />
          <div className="bg-gray-100">{children}</div>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
