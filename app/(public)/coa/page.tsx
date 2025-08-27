import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const sleepCOA =
  "https://drive.google.com/file/d/1auWbXvSTbqqYHh81ROjXqELoTJ-AZaVJ/view";
const raspberryCOA =
  "https://drive.google.com/file/d/112hcXKmZ8FFA7vBghG6pUJa-zD4pY8zT/view";
const pastCOAs =
  "https://drive.google.com/drive/folders/1G6c0xHYdCzs_W3we-lID4QublNoepngU";

export default function COAPage() {
  return (
    <>
      <Container className="py-24">
        <h2 className="text-5xl font-bold text-center mb-24">
          Certificates of Analysis
        </h2>
        <div className="flex justify-center">
          <div className="flex flex-col">
            <Image
              src="/products/sleep_no_background.webp"
              alt="Sleep"
              width={750}
              height={750}
            />
            <h3 className="text-2xl font-bold text-center mb-6">
              SLEEP Gummies
            </h3>
            <Button
              asChild
              size="lg"
              className="self-center rounded-full bg-main-green"
            >
              <a href={sleepCOA} target="_blank" rel="noopener noreferrer">
                Open COA
              </a>
            </Button>
          </div>
          <div className="flex flex-col">
            <Image
              src="/products/raspberry_no_background.webp"
              alt="Raspberry"
              width={750}
              height={750}
            />
            <h3 className="text-2xl font-bold text-center mb-6">
              Real Raspberry Gummies
            </h3>
            <Button
              asChild
              size="lg"
              className="self-center rounded-full bg-main-green"
            >
              <a href={raspberryCOA} target="_blank" rel="noopener noreferrer">
                Open COA
              </a>
            </Button>
          </div>
        </div>
      </Container>
      <div className="bg-olive-green py-12 flex flex-col items-center gap-6">
        <h4 className="text-white text-2xl font-bold">Past COAs</h4>
        <p className="text-lg text-white">
          See the COAs for past Herb Garden Products
        </p>
        <Button
          asChild
          size="lg"
          className="self-center rounded-full bg-main-green"
        >
          <a href={pastCOAs} target="_blank" rel="noopener noreferrer">
            View Past COAs
          </a>
        </Button>
      </div>
    </>
  );
}
