"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2 } from "lucide-react";
import axios from "axios";
import { cn, cleanMovieTitle } from "@/lib/utils";

interface Movie {
  id: number | string;
  title: string;
  poster_path?: string;
  rating?: number;
  year?: string;
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setLoading(true);
      setIsOpen(true);
      
      try {
        const response = await axios.get(`http://127.0.0.1:8000/search?title=${query}`);
        let rawMovies = [];
        if (response.data && Array.isArray(response.data)) {
          rawMovies = response.data.slice(0, 5);
        } else if (response.data && response.data.results) {
          rawMovies = response.data.results.slice(0, 5);
        }
        
        // Enrich with OMDb posters
        const apiKey = process.env.NEXT_PUBLIC_OMDB_API_KEY || "baeeb89";
        const enrichedMovies = await Promise.all(rawMovies.map(async (m: Movie) => {
          try {
            const { cleanTitle, year } = cleanMovieTitle(m.title);
            
            let url = `https://www.omdbapi.com/?apikey=${apiKey}&t=${encodeURIComponent(cleanTitle)}`;
            if (year) url += `&y=${year}`;
            
            const res = await fetch(url);
            const data = await res.json();
            if (data.Poster && data.Poster !== "N/A") {
              return { ...m, poster_path: data.Poster };
            }
          } catch (e) {
            console.error(e);
          }
          return m;
        }));
        
        setResults(enrichedMovies);
      } catch (error) {
        console.error("Search failed:", error);
        // Fallback for visual demo when backend is down
        if (query.length > 2) {
            setResults([
               { id: 101, title: `Result for ${query} 1` },
               { id: 102, title: `Result for ${query} 2` }
            ] as Movie[]);
        }
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSearchResults, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  // Highlight matching text helper
  const highlightMatch = (text: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() ? 
        <span key={i} className="text-cyan-400 font-semibold">{part}</span> : part
    );
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto z-40">
      <div className={cn(
        "relative flex items-center w-full px-6 py-4 rounded-full glass border border-white/10 transition-all duration-300",
        isOpen && query ? "rounded-b-none border-b-transparent shadow-[0_0_30px_rgba(6,182,212,0.3)]" : "hover:border-white/20 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]"
      )}>
        <Search className="w-6 h-6 text-slate-400 mr-4" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder="Search for movies, directors, or genres..."
          className="w-full bg-transparent border-none outline-none text-white text-lg placeholder:text-slate-500"
        />
        {loading && <Loader2 className="w-5 h-5 text-cyan-400 animate-spin absolute right-6" />}
      </div>

      <AnimatePresence>
        {isOpen && query && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 glass rounded-b-2xl border border-white/10 border-t-0 shadow-2xl overflow-hidden"
          >
            {results.length > 0 ? (
              <ul className="py-2">
                {results.map((movie: Movie, idx) => (
                  <motion.li 
                    key={movie.id || idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="px-6 py-3 hover:bg-white/10 cursor-pointer transition-colors duration-200 flex items-center gap-4"
                  >
                    <div className="w-10 h-14 bg-slate-800 rounded-md overflow-hidden flex-shrink-0">
                      {movie.poster_path ? (
                        <img src={movie.poster_path.startsWith('http') ? movie.poster_path : `https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-slate-600 bg-slate-800">No Img</div>
                      )}
                    </div>
                    <div>
                      <p className="text-white text-lg">{highlightMatch(movie.title)}</p>
                      {movie.year && <p className="text-sm text-slate-400">{movie.year}</p>}
                    </div>
                  </motion.li>
                ))}
              </ul>
            ) : (
              !loading && <div className="p-6 text-center text-slate-400">No movies found</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
