import { SquareProducts } from "@/components/square-products";
import Container from "@/components/container";

export default function ShopPage() {
  return (
    <Container className="py-24">
      <div className="mb-8">
        <h2 className="text-5xl font-bold mb-12 text-center">
          Clean, Effective Edibles
        </h2>
      </div>
      <SquareProducts />
    </Container>
  );
}
