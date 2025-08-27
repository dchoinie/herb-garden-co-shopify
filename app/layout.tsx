import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { getCustomerSession } from "@/lib/auth";
import { CustomerNav } from "@/components/customer-nav";
import Footer from "@/components/footer";

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
  const session = await getCustomerSession();

  return (
    <html lang="en">
      <body
        className={`${domine.variable} ${funnel.variable} ${funnelItalic.variable} antialiased`}
      >
        <CustomerNav session={session} />
        <div className="bg-gray-100">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
