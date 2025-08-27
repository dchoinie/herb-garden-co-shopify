import Container from "./container";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";

export default function Map() {
  return (
    <Container className="py-8 sm:py-12">
      <div className="flex flex-col lg:flex-row">
        <div className="flex w-full lg:w-1/2 mb-6 lg:mb-0">
          <Image
            src="/map.webp"
            alt="Map"
            width={1000}
            height={1000}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col w-full lg:w-1/2 px-4 lg:px-24 justify-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl mb-3">
            Delivered to Your Door
          </h2>
          <h6 className="text-base sm:text-lg font-bold !font-funnel mb-3">
            We&apos;re delivering premium gummies to 47 states — and we&apos;re
            just getting started.
          </h6>
          <p className="!font-funnel mb-6">
            Give us a try and see why we&apos;re quickly becoming the go-to
            choice for clean & effective cannabis wellness.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
            <Button asChild size="lg" className="bg-main-green rounded-full">
              <Link href="/">Shop Online</Link>
            </Button>
            <Button asChild size="lg" className="bg-main-green rounded-full">
              <Link href="/">Shop Retail</Link>
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
}
