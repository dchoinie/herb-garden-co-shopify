import React from 'react'
import Image from 'next/image'
import Container from './container'
import Link from 'next/link';
import { Button } from './ui/button';

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

export default function FeaturedProduct({ name, contains, craftedWith, pairedWith, flavoredWith, link, tagline, image, invert, buttonBackground, buttonText, buttonTextColor }: Props) {
  return (
    <Container>
        <div className="flex">
            <div className={`flex w-1/2 ${invert ? 'order-2' : 'order-1'}`}>
            <Image src={image} alt={name} width={500} height={500} className="rounded-lg w-full" />
            </div>
            <div className={`flex flex-col justify-center w-1/2 ${invert ? 'order-1' : 'order-2'} ${!invert ? 'px-24' : ''}`}>
                <h6 className="text-sm !font-funnel mb-6">{tagline}</h6>
                <h3 className="text-4xl mb-6 uppercase">{name}</h3>
                <div className="flex flex-col mb-6">
                    <p className="font-bold text-lg">Each Gummy Contains</p>
                    <p>{contains}</p>
                </div>
                {craftedWith && (
                <div className="flex flex-col mb-6">
                    <p className="font-bold text-lg">Crafted With</p>
                    <p>{craftedWith}</p>
                </div>
                )}
                {pairedWith && (
                <div className="flex flex-col mb-6">
                    <p className="font-bold text-lg">Paired With</p>
                    <p>{pairedWith}</p>
                </div>
                )}
                <div className="flex flex-col mb-6">
                    <p className="font-bold">Flavored With</p>
                    <p>{flavoredWith}</p>
                </div>
                <Button asChild className={`${buttonBackground} self-start rounded-full ${buttonTextColor ? buttonTextColor : 'text-black'}`}>
                    <Link href={link}>{buttonText}</Link>
                </Button>
            </div>
        </div>
    </Container>
  )
}