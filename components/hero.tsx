import Image from "next/image"
import Link from "next/link"
import { Button } from "./ui/button"

export default function Hero() {
  return (
    <div className="h-[calc(100vh-6rem)] min-h-[calc(100vh-6rem)]">
      <div className="flex h-full">
        <div className="flex w-1/2">
            <Image src="/hero.webp" alt="Hero" width={500} height={500} className="object-cover w-full h-full" />
        </div>
        <div className="w-1/2">
        <div className="flex flex-col h-full justify-center px-24">
            <p className="text-xl uppercase">5mg THC, 10mg CBN, & 25mg CBD</p>
            <h1 className="text-6xl py-6">SLEEP Delivered to your Door</h1>
            <h6 className="text-xl !font-funnel">Meet our bestselling SLEEP Gummies, your perfect nighttime companion.</h6>
            <Button asChild className="bg-dark-purple rounded-full self-start p-6 mt-8 text-lg">
                <Link href="/products">
                Shop Sleep
                </Link>
            </Button>
        </div>
        </div>
      </div>
    </div>
  )
}