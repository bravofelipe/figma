import CarouselStudio from "@/components/CarouselStudio";
import { loadAllBrands } from "@/lib/brand-loader";

export default async function Home() {
  const brands = await loadAllBrands();
  return <CarouselStudio brands={brands} />;
}
