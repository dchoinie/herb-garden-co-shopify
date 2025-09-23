import { SquareProducts } from "@/components/square-products";
import Container from "@/components/container";
import { unstable_cache } from "next/cache";
import { squareCatalogService } from "@/lib/square-catalog";

export const revalidate = 3600; // Revalidate every hour

function sanitizeForClient<T>(value: T): T {
  const seen = new WeakMap();

  function inner(v: any): any {
    if (typeof v === "bigint") {
      return Number(v);
    }
    if (v === null || typeof v !== "object") {
      return v;
    }
    if (seen.has(v)) {
      return seen.get(v);
    }
    if (Array.isArray(v)) {
      const arr = v.map(inner);
      seen.set(v, arr);
      return arr;
    }
    const out: Record<string, any> = {};
    seen.set(v, out);
    for (const key of Object.keys(v)) {
      out[key] = inner((v as any)[key]);
    }
    return out;
  }

  return inner(value);
}

const getProductsCached = unstable_cache(
  async () => {
    // Prefer online products subset if available, fallback to all items
    const online = await squareCatalogService.getOnlineProducts();
    const data =
      online && online.length > 0
        ? online
        : await squareCatalogService.getAllProducts();
    return sanitizeForClient(data);
  },
  ["square-catalog"],
  { revalidate: 3600, tags: ["square-catalog"] }
);

export default async function ShopPage() {
  const products = await getProductsCached();
  return (
    <Container className="py-24">
      <div className="mb-8">
        <h2 className="text-5xl font-bold mb-12 text-center">
          Clean, Effective Edibles
        </h2>
      </div>
      <SquareProducts products={products} />
    </Container>
  );
}
