"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { ArrowRightIcon, Sparkles, Loader2 } from "lucide-react";
import MovieCard from "./MovieCard";

interface Movie {
  id: number | string;
  title: string;
  poster_path?: string;
  rating?: number;
  year?: string;
}

export default function RecommendationPanel() {
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleGetRecommendations = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim()) return;

    setLoading(true);
    setHasSearched(true);
    
    try {
      const response = await axios.get(`http://127.0.0.1:8000/recommend/${userId}`);
      if (response.data && Array.isArray(response.data)) {
        setRecommendations(response.data);
      } else if (response.data && response.data.recommendations) {
        setRecommendations(response.data.recommendations);
      }
    } catch (error) {
      console.error("Failed to fetch recommendations:", error);
      // Fallback data
      setRecommendations([
        { id: 201, title: "The Matrix", rating: 8.7, year: "1999" },
        { id: 202, title: "Avatar", rating: 7.9, year: "2009" },
        { id: 203, title: "Pulp Fiction", rating: 8.9, year: "1994" },
        { id: 204, title: "Fight Club", rating: 8.8, year: "1999" }
      ] as Movie[]);
    } finally {
      setLoading(false);
    }
  };

  const containerParams = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-20">
      <div className="flex flex-col items-center justify-center text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-purple-500/30 text-purple-300 mb-6"
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium tracking-wide uppercase">AI Personalization</span>
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold mb-6 text-glow"
        >
          Your Cinematic Journey
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-lg text-slate-400 max-w-2xl mx-auto mb-10"
        >
          Enter your User ID to get our hyper-personalized AI movie recommendations tailored exactly to your unique taste.
        </motion.p>

        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          onSubmit={handleGetRecommendations}
          className="flex w-full max-w-md mx-auto relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative flex w-full">
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter User ID..."
              className="w-full px-6 py-4 bg-slate-900/80 backdrop-blur-sm border-y border-l border-white/10 rounded-l-xl focus:border-cyan-500/50 outline-none text-white transition-colors"
            />
            <button 
              type="submit"
              disabled={loading || !userId.trim()}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-r-xl font-semibold text-white flex items-center justify-center gap-2 hover:from-purple-500 hover:to-cyan-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Get
                  <ArrowRightIcon className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </motion.form>
      </div>

      {hasSearched && (
        <div className="min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-6">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border-t-2 border-cyan-400 animate-spin"></div>
                <div className="absolute inset-0 rounded-full border-r-2 border-purple-500 animate-[spin_1.5s_linear_infinite_reverse]"></div>
                <div className="absolute inset-4 rounded-full border-b-2 border-white animate-[spin_2s_linear_infinite]"></div>
              </div>
              <p className="text-cyan-400 animate-pulse font-medium tracking-widest uppercase text-sm">Analyzing Synapses...</p>
            </div>
          ) : (
            <motion.div 
              variants={containerParams}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center"
            >
              {recommendations.length > 0 ? (
                recommendations.map((movie: any, idx) => (
                  <MovieCard key={movie.id || idx} movie={movie} index={idx} />
                ))
              ) : (
                <div className="col-span-full text-slate-400 text-center py-20">
                  <p className="text-xl">No recommendations found for this user.</p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
