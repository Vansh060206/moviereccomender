"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Star } from "lucide-react";
import React, { useRef } from "react";

interface Movie {
  id: number | string;
  title: string;
  poster_path?: string;
  rating?: number;
  year?: string;
}

export default function MovieCard({ movie, index = 0 }: { movie: Movie; index?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  
  // 3D Tilt Effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Mock poster image if none provided
  const posterUrl = movie.poster_path 
    ? (movie.poster_path.startsWith('http') ? movie.poster_path : `https://image.tmdb.org/t/p/w500${movie.poster_path}`)
    : `https://via.placeholder.com/500x750/1a1a2e/8b5cf6?text=${encodeURIComponent(movie.title)}`;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex-shrink-0 w-64 h-[24rem] rounded-2xl group cursor-pointer perspective-1000"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
      
      <div 
        className="absolute inset-0 rounded-2xl overflow-hidden glass border border-white/5 transition-all duration-300 group-hover:neon-border"
        style={{ transform: "translateZ(30px)" }}
      >
        <div className="absolute inset-0 bg-slate-900/40 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        
        <img
          src={posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-20 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <h3 className="text-white font-bold text-lg truncate drop-shadow-md">{movie.title}</h3>
          
          <div className="flex items-center gap-2 mt-2">
            <span className="flex items-center gap-1 text-yellow-400 text-sm font-semibold bg-black/40 px-2 py-1 rounded-md backdrop-blur-md">
              <Star className="w-3.5 h-3.5 fill-yellow-400" />
              {movie.rating ? movie.rating.toFixed(1) : "N/A"}
            </span>
            {movie.year && (
              <span className="text-slate-300 text-xs px-2 py-1 bg-white/10 rounded-md backdrop-blur-md">
                {movie.year}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
