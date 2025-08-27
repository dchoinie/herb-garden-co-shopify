import Container from "@/components/container";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Mail, Linkedin } from "lucide-react";

interface FooterNavItem {
  label: string;
  link: string;
}

const footerNavItems: FooterNavItem[] = [
  {
    label: "Shop",
    link: "/shop",
  },
  {
    label: "About Us",
    link: "/about-us",
  },
  {
    label: "COAs",
    link: "/coa",
  },
  {
    label: "Retail Stores",
    link: "/retail-stores",
  },
  {
    label: "Get In Touch",
    link: "/get-in-touch",
  },
  {
    label: "Wholesale Inquiry",
    link: "/wholesale-inquiry",
  },
];

const footerSocials = [
  {
    icon: <Facebook size={16} />,
    link: "https://www.facebook.com/profile.php?id=100093337656467",
  },
  {
    icon: <Instagram size={16} />,
    link: "https://www.instagram.com/herbgardengreek/",
  },
  {
    icon: <Mail size={16} />,
    link: "info@herbgardengreek.com",
  },
  {
    icon: <Linkedin size={16} />,
    link: "https://www.linkedin.com/company/herbgardengreek/",
  },
];

const legalLinks = [
  {
    label: "Shipping & Returns",
    link: "/shipping-returns",
  },
  {
    label: "Terms & Conditions",
    link: "/terms-conditions",
  },
  {
    label: "Privacy Policy",
    link: "/privacy-policy",
  },
];

export default function Footer() {
  return (
    <footer className="bg-main-green py-8 sm:py-12 px-6 lg:px-0">
      <Container>
        <div className="flex flex-col">
          <Image
            src="/logos/svg/HerbGarden_Logos-02.svg"
            alt="Logo"
            width={300}
            height={300}
            className="mb-6 sm:mb-3 w-auto lg:w-64"
          />
          <div className="flex flex-col sm:flex-row justify-between w-full gap-6 sm:gap-0">
            <div className="flex flex-wrap gap-3 text-white text-sm sm:text-base">
              {footerNavItems.map((item: FooterNavItem) => (
                <Link
                  href={item.link}
                  key={item.label}
                  className="hover:underline"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="flex gap-3">
              {footerSocials.map((social, i) => (
                <Link href={social.link} key={`${social.link}-${i}`}>
                  <div className="bg-white rounded-full p-2 flex items-center justify-center hover:bg-gray-100 transition-colors">
                    <div className="text-black">{social.icon}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <hr className="my-6 border border-gray-300" />
          <div className="flex flex-col lg:flex-row justify-between w-full gap-6 lg:gap-0">
            <div className="flex flex-col w-full lg:w-1/2">
              <h6 className="text-white text-lg sm:text-xl font-bold mb-4 sm:mb-6">
                Join The Garden
              </h6>
              <div className="flex flex-col sm:flex-row">
                <input
                  type="email"
                  placeholder="Email"
                  className="px-4 py-2 rounded-md sm:rounded-l-md sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-white/20 text-black border border-white placeholder:text-gray-200 w-full mb-2 sm:mb-0"
                />
                <button className="bg-white text-main-green px-6 py-2 rounded-md sm:rounded-l-none sm:rounded-r-md font-medium hover:bg-gray-100 transition-colors whitespace-nowrap">
                  Sign Up
                </button>
              </div>
            </div>
            <div className="flex flex-col text-white text-xs sm:text-sm text-center lg:text-right justify-end gap-2 sm:gap-0">
              <p>Herb Garden Co &copy; {new Date().getFullYear()}</p>
              <div className="flex flex-wrap justify-center lg:justify-end gap-2 sm:gap-3">
                {legalLinks.map((link, i) => (
                  <Link
                    href={link.link}
                    key={`${link.link}-${i}`}
                    className="underline hover:no-underline"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
