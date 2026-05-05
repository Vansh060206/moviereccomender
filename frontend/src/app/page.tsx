"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MovieCarousel from "@/components/MovieCarousel";
import RecommendationPanel from "@/components/RecommendationPanel";
import Footer from "@/components/Footer";
import BackgroundEffects from "@/components/BackgroundEffects";

export default function Home() {
  return (
    <main className="relative min-h-screen selection:bg-cyan-500/30">
      <BackgroundEffects />
      <Navbar />
      
      <div className="relative z-10 flex flex-col">
        <Hero />
        
        <section className="py-20 relative">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"></div>
          <div className="container mx-auto px-6 lg:px-12 mb-8">
            <h2 className="text-3xl font-bold text-white flex items-center gap-4">
              Trending Now
              <span className="h-px bg-white/10 flex-1 ml-4 mt-1 hidden sm:block"></span>
            </h2>
          </div>
          <MovieCarousel />
        </section>
        
        <section className="relative">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>
          <RecommendationPanel />
        </section>
      </div>

      <Footer />
    </main>
  );
}
