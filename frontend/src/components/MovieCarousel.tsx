"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import MovieCard from "./MovieCard";

interface Movie {
  id: number | string;
  title: string;
  poster_path?: string;
  rating?: number;
  year?: string;
}

export default function MovieCarousel() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        const response = await axios.get(`${apiUrl}/movies`);
        if (response.data && Array.isArray(response.data)) {
          setMovies(response.data);
        } else if (response.data && response.data.movies) {
          setMovies(response.data.movies);
        }
      } catch (error) {
        console.error("Failed to fetch movies:", error);
        // Fallback mock data in case backend isn't up during test
        setMovies([
          { id: 1, title: "Dune: Part Two", rating: 8.8, year: "2024" },
          { id: 2, title: "Oppenheimer", rating: 8.4, year: "2023" },
          { id: 3, title: "Interstellar", rating: 8.7, year: "2014" },
          { id: 4, title: "Blade Runner 2049", rating: 8.0, year: "2017" },
          { id: 5, title: "The Dark Knight", rating: 9.0, year: "2008" },
          { id: 6, title: "Inception", rating: 8.8, year: "2010" }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth + 100 : scrollLeft + clientWidth - 100;
      carouselRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center h-80">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="relative group/carousel w-full py-10">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />
      
      <button 
        onClick={() => scroll("left")}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full glass flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 hover:bg-white/10 transition-all duration-300"
      >
        <ChevronLeft className="text-white" />
      </button>
      
      <button 
        onClick={() => scroll("right")}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full glass flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 hover:bg-white/10 transition-all duration-300"
      >
        <ChevronRight className="text-white" />
      </button>

      <div 
        ref={carouselRef}
        className="flex gap-6 overflow-x-auto hide-scrollbar px-12 md:px-24 snap-x snap-mandatory pt-10 pb-20"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {movies.map((movie, index) => (
          <div key={movie.id || index} className="snap-start">
            <MovieCard movie={movie} index={index} />
          </div>
        ))}
      </div>
    </div>
  );
}
