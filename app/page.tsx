import Hero from "@/components/Hero";
import NewsList from "@/components/NewsList";
import HeroSection from "@/components/HeroSection";

export default function Home() {
  return (
    <div className="space-y-12">
      <HeroSection />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        <div className="bg-oxy-blue/20 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/20 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]">
          <Hero />
        </div>

        <div className="bg-oxy-blue/20 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/20 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]">
          <NewsList />
        </div>
      </div>
    </div>
  );
}
