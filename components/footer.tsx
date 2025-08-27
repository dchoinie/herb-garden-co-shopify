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
    <footer className="bg-main-green py-12">
      <Container>
        <div className="flex flex-col">
          <Image
            src="/logos/svg/HerbGarden_Logos-02.svg"
            alt="Logo"
            width={300}
            height={300}
            className="mb-3"
          />
          <div className="flex justify-between w-full">
            <div className="flex gap-3 text-white">
              {footerNavItems.map((item: FooterNavItem) => (
                <Link href={item.link} key={item.label}>
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="flex gap-3">
              {footerSocials.map((social, i) => (
                <Link href={social.link} key={`${social.link}-${i}`}>
                  <div className="bg-white rounded-full p-2 flex items-center justify-center">
                    <div className="text-black">{social.icon}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <hr className="my-6 border border-gray-300" />
          <div className="flex justify-between w-full">
            <div className="flex flex-col w-1/2">
              <h6 className="text-white text-xl font-bold">Join The Garden</h6>
              <div className="flex mt-6">
                <input
                  type="email"
                  placeholder="Email"
                  className="px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-white/20 text-black border border-white placeholder:text-gray-200 w-full"
                />
                <button className="bg-white text-main-green px-6 py-2 rounded-r-md font-medium hover:bg-gray-100 transition-colors whitespace-nowrap rounded-tr-full rounded-br-full">
                  Sign Up
                </button>
              </div>
            </div>
            <div className="flex flex-col text-white text-sm text-right justify-end">
              <p>Herb Garden Co &copy; {new Date().getFullYear()}</p>
              <div className="flex gap-3">
                {legalLinks.map((link, i) => (
                  <Link
                    href={link.link}
                    key={`${link.link}-${i}`}
                    className="underline"
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
