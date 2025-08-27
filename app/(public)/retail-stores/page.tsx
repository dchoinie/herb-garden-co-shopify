import Container from "@/components/container";

interface Stores {
  name: string;
  location: string;
}

const retailStores: Stores[] = [
  {
    name: "Buds Seed & Supply",
    location: "Minneapolis",
  },
  {
    name: "Daily Dose",
    location: "Apple Valley",
  },
  {
    name: "Da Spot",
    location: "Minneapolis",
  },
  {
    name: "Canna JOY MN",
    location: "Minneapolis",
  },
  {
    name: "CBD RS",
    location: "Andover,Fridley",
  },
  {
    name: "Green Canopy",
    location: "Lakeland Shores",
  },
  {
    name: "Green Leaf Depot",
    location: "Savage",
  },
  {
    name: "higherplace",
    location: "Chaska",
  },
  {
    name: "Larsmont Cottages",
    location: "Two Harbors",
  },
  {
    name: "Marigold",
    location: "Minneapolis, St. Paul",
  },
  {
    name: "North Star THC",
    location: "Plymouth",
  },
  {
    name: "Prana Plant Wellness",
    location: "Golden Valley",
  },
  {
    name: "Sacred Leaf",
    location: "Elk River & Albertville",
  },
  {
    name: "Two Harbors Cannabis",
    location: "Two Harbors",
  },
  {
    name: "Uffda Cannabis Co.",
    location: "Both South Minneapolis Locations",
  },
];

export default function RetailStores() {
  return (
    <Container className="py-24">
      <h2 className="text-5xl font-bold mb-24 text-center">
        Find Us In Stores
      </h2>
      <div className="grid grid-cols-3 gap-12 justify-center text-center">
        {retailStores.map((store: Stores, i: number) => (
          <div key={`${store.name}-${i}`}>
            <h3 className="text-3xl">{store.name}</h3>
            <p className="italic">{store.location}</p>
          </div>
        ))}
      </div>
    </Container>
  );
}
