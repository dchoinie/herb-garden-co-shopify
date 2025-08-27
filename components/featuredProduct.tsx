import React from "react";
import Image from "next/image";
import Container from "./container";
import Link from "next/link";
import { Button } from "./ui/button";

interface Props {
  name: string;
  contains: string;
  craftedWith?: string;
  pairedWith?: string;
  flavoredWith: string;
  link: string;
  tagline: string;
  image: string;
  invert?: boolean;
  buttonBackground: string;
  buttonText: string;
  buttonTextColor?: string;
}

export default function FeaturedProduct({
  name,
  contains,
  craftedWith,
  pairedWith,
  flavoredWith,
  link,
  tagline,
  image,
  invert,
  buttonBackground,
  buttonText,
  buttonTextColor,
}: Props) {
  return (
    <Container>
      <div className="flex flex-col lg:flex-row">
        <div
          className={`flex w-full lg:w-1/2 ${
            invert ? "lg:order-2" : "lg:order-1"
          } order-1`}
        >
          <Image
            src={image}
            alt={name}
            width={500}
            height={500}
            className="rounded-lg w-full"
          />
        </div>
        <div
          className={`flex flex-col justify-center w-full lg:w-1/2 ${
            invert ? "lg:order-1" : "lg:order-2"
          } order-2 px-6 lg:px-24 py-8 lg:py-0`}
        >
          <h6 className="text-xs lg:text-sm !font-funnel mb-4 lg:mb-6">
            {tagline}
          </h6>
          <h3 className="text-2xl lg:text-4xl mb-4 lg:mb-6 uppercase">
            {name}
          </h3>
          <div className="flex flex-col mb-4 lg:mb-6">
            <p className="font-bold text-base lg:text-lg">
              Each Gummy Contains
            </p>
            <p className="text-sm lg:text-base">{contains}</p>
          </div>
          {craftedWith && (
            <div className="flex flex-col mb-4 lg:mb-6">
              <p className="font-bold text-base lg:text-lg">Crafted With</p>
              <p className="text-sm lg:text-base">{craftedWith}</p>
            </div>
          )}
          {pairedWith && (
            <div className="flex flex-col mb-4 lg:mb-6">
              <p className="font-bold text-base lg:text-lg">Paired With</p>
              <p className="text-sm lg:text-base">{pairedWith}</p>
            </div>
          )}
          <div className="flex flex-col mb-6">
            <p className="font-bold text-base lg:text-lg">Flavored With</p>
            <p className="text-sm lg:text-base">{flavoredWith}</p>
          </div>
          <Button
            asChild
            className={`${buttonBackground} self-start rounded-full p-4 lg:p-6 text-sm lg:text-base ${
              buttonTextColor ? buttonTextColor : "text-black"
            }`}
          >
            <Link href={link}>{buttonText}</Link>
          </Button>
        </div>
      </div>
    </Container>
  );
}
