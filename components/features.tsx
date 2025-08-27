import Image from "next/image";
import Container from "./container";
import { Button } from "./ui/button";
import Link from "next/link";

interface FeatureProps {
  image: string;
  title: string;
  description: string;
}

const Feature = ({ title, description, image }: FeatureProps) => {
  return (
    <div className="flex flex-col items-center text-center">
      <Image
        src={image}
        alt={title}
        width={100}
        height={100}
        className="h-32 lg:h-64 w-auto"
      />
      <h3 className="text-lg lg:text-2xl mb-2 lg:mb-3 !font-funnel">{title}</h3>
      <p className="text-sm lg:text-lg">{description}</p>
    </div>
  );
};

export default function Features() {
  return (
    <div className="bg-olive-green py-12 lg:py-24">
      <Container>
        <h2 className="text-center text-2xl lg:text-4xl font-bold mb-8 lg:mb-12">
          Not Your Average Edibles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Feature
            title="Hemp Derived & Federally Legal"
            description="Crafted from premium hemp and compliant with federal regulations for your peace of mind."
            image="/features/leaf.webp"
          />
          <Feature
            title="Beneficial Terpenes & Mushrooms"
            description="Harnessing the power of nature with targeted terpenes and adaptogenic mushrooms."
            image="/features/mushroom.webp"
          />
          <Feature
            title="Clean Ingredients & Nothing Artificial"
            description="Only the good stuff — pure, simple, and free from seed oils & corn syrup."
            image="/features/drop.webp"
          />
          <Feature
            title="Vegan, Vegetarian, & Gluten Free"
            description="Mindfully made to fit your plant-based, gluten-free lifestyle."
            image="/features/plant.webp"
          />
        </div>
        <div className="flex justify-center w-full mt-12 lg:mt-24">
          <Button
            asChild
            className="bg-white text-black rounded-full p-4 lg:p-6 text-sm lg:text-base"
            size="lg"
          >
            <Link href="/about">Learn More About Us</Link>
          </Button>
        </div>
      </Container>
    </div>
  );
}
