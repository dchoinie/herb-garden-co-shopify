import Container from "@/components/container";
import Image from "next/image";

interface Value {
  image: string;
  title: string;
  text: string;
}

const values: Value[] = [
  {
    image: "/caring.webp",
    title: "Caring",
    text: "Thoughtfully crafted with clean ingredients, our products are made to support and nurture you through life's everyday moments.",
  },
  {
    image: "/natural.webp",
    title: "Natural",
    text: "Made with real, plant-based ingredients and nothing artificial. We believe in the power of nature to support and enhance everyday life.",
  },
  {
    image: "/rooted.webp",
    title: "Rooted",
    text: "Grounded in nature and authenticity, we believe in keeping things simple and real. With integrity at our core, we create with purpose.",
  },
  {
    image: "/intentional.webp",
    title: "Intentional",
    text: "Every ingredient is carefully selected and every product is thoughtfully designed for maximum positive impact, ensuring quality in every step.",
  },
  {
    image: "/balanced.webp",
    title: "Balanced",
    text: "We embrace the power of partnership, intentionally blending cannabinoids, herbs, and mushrooms to create a seamless experience.",
  },
];

export default function AboutUsPage() {
  return (
    <div>
      <div className="flex">
        <div className="flex w-1/2">
          <Image
            src="/about.webp"
            alt="About Us"
            width={750}
            height={750}
            className="w-full"
          />
        </div>
        <div className="flex flex-col justify-center w-1/2 px-24">
          <h2 className="text-5xl mb-6">
            Committed to Better from the Beginning
          </h2>
          <p>
            At Herb Garden, doing things the right way has always mattered. From
            day one, we&apos;ve focused on clean ingredients, mindful
            formulations, and products that support real moments in life.
            We&apos;re here to bring you simple, honest wellness you can feel
            good about - every step of the way.
          </p>
        </div>
      </div>
      <Container className="py-12">
        <div className="grid grid-cols-3 gap-12 justify-center">
          <h2 className="text-5xl font-bold self-center">
            Our <br /> Brand Values
          </h2>
          {values.map((value: Value, i: number) => (
            <div key={`${value.title}-${i}`}>
              <Image
                src={value.image}
                alt={value.title}
                width={150}
                height={150}
              />
              <h3 className="text-2xl font-bold !font-funnel mb-3">
                {value.title}
              </h3>
              <p>{value.text}</p>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
