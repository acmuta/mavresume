import { HomeHeaderBarClient } from "@/components/elements/HomeHeaderBarClient";
import { HomePageClientWrapper } from "@/components/sections/HomePageClientWrapper";
import { HeroSection } from "@/components/sections/HeroSection";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#101113] text-white">
      <div className="absolute inset-0 bg-gradient-to-b from-[#11131a] via-[#0d0e12] to-[#09090b]" />
      <HomeHeaderBarClient />
      <HomePageClientWrapper>
        <HeroSection />
      </HomePageClientWrapper>
    </div>
  );
}
