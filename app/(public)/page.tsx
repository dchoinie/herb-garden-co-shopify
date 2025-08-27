import React, { JSX } from "react";
import Hero from "@/components/hero";
import Marquee from "@/components/marquee";
import FeaturedProduct from "@/components/featuredProduct";
import Features from "@/components/features";
import SingleProducts from "@/components/singleProducts";
import { Heart } from "lucide-react";
import Testimonials from "@/components/testimonials";
import Map from "@/components/map";

const Page = (): JSX.Element => {
  return (
    <div>
      <Hero />
      <Marquee backgroundColor="bg-olive-green" textColor="text-gray-900">
        Clean, Smart, and Effective THC and CBD Gummies Designed for You
      </Marquee>
      <div className="py-12">
        <FeaturedProduct
          name="Sleep"
          contains="5mg THC, 10mg CBN, & 25mg CBD"
          pairedWith="Indica Terpenes, Lemon Balm, & Reishi Mushroom"
          flavoredWith="Vegan Blackberry Lavender"
          link="/products/sleep"
          tagline="Your Nighttime Companion"
          image="/products/sleep.webp"
          buttonBackground="bg-lavender"
          buttonText="Shop Now"
        />
      </div>
      <div className="py-12">
        <FeaturedProduct
          name="Real Raspberry"
          contains="5mg THC & 20mg CBD"
          craftedWith="Real organic fruit and nano-ionized extraction for superior bioavailability"
          flavoredWith="Raspberry fruit pectin & dehydrated fruit flavoring"
          link="/products/raspberry"
          tagline="Good Time Anytime"
          image="/products/raspberry.webp"
          buttonBackground="bg-raspberry"
          buttonText="Shop Now"
          invert
          buttonTextColor="text-white"
        />
      </div>
      <Features />
      <SingleProducts />
      <Marquee backgroundColor="bg-main-green" textColor="text-white">
        <Heart className="mr-2" /> from our customers
      </Marquee>
      <Testimonials />
      <Map />
    </div>
  );
};

export default Page;
