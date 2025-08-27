import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

export default function Hero() {
  return (
    <div className="lg:min-h-[calc(100vh-6rem)]">
      <div className="flex flex-col lg:flex-row h-full">
        <div className="flex w-full lg:w-1/2 h-64 lg:h-full">
          <Image
            src="/hero.webp"
            alt="Hero"
            width={500}
            height={500}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="w-full lg:w-1/2">
          <div className="flex flex-col h-full justify-center px-6 lg:px-24 py-8 lg:py-0">
            <p className="text-sm lg:text-xl uppercase">
              5mg THC, 10mg CBN, & 25mg CBD
            </p>
            <h1 className="text-3xl lg:text-6xl py-4 lg:py-6">
              SLEEP Delivered to your Door
            </h1>
            <h6 className="text-base lg:text-xl !font-funnel">
              Meet our bestselling SLEEP Gummies, your perfect nighttime
              companion.
            </h6>
            <Button
              asChild
              className="bg-dark-purple rounded-full self-start p-4 lg:p-6 mt-6 lg:mt-8 text-base lg:text-lg"
            >
              <Link href="/products">Shop Sleep</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
