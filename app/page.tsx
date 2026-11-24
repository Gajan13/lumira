import { Hero } from "@/components/sections/Hero";
import { Quotes } from "@/components/sections/Quotes";
import { RoutePath } from "@/components/sections/RoutePath";
import { ScrollScenes } from "@/components/sections/ScrollScenes";
import { SpecsStrip } from "@/components/sections/SpecsStrip";
import { StoreFinderBar } from "@/components/sections/StoreFinderBar";
import { BikeStageLoader } from "@/components/three/BikeStageLoader";

export default function Home() {
  return (
    <main className="relative flex-1">
      <BikeStageLoader />
      <RoutePath />
      <Hero />
      <ScrollScenes />
      <SpecsStrip />
      <Quotes />
      <StoreFinderBar />
    </main>
  );
}
