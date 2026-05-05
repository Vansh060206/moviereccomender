"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Star, Heart } from "lucide-react";
import React, { useRef, useState, useEffect } from "react";
import { database } from "@/lib/firebase";
import { ref as dbRef, set, remove, onValue } from "firebase/database";
import { useAuth } from "@/context/AuthContext";

import { cleanMovieTitle } from "@/lib/utils";

interface Movie {
  title: string;
  similarity_score?: string;
  explanation?: string;
  poster_path?: string;
  rating?: number;
  year?: string;
}

export default function MovieCard({ movie, index = 0 }: { movie: Movie; index?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  
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

  const { cleanTitle: displayTitle } = cleanMovieTitle(movie.title);

  const [posterUrl, setPosterUrl] = React.useState<string>(
    movie.poster_path 
      ? (movie.poster_path.startsWith('http') ? movie.poster_path : `https://image.tmdb.org/t/p/w500${movie.poster_path}`)
      : `https://via.placeholder.com/500x750/1a1a2e/8b5cf6?text=${encodeURIComponent(displayTitle)}`
  );

  const [imgError, setImgError] = useState(false);
  const [isFetchingImage, setIsFetchingImage] = useState(!movie.poster_path);

  React.useEffect(() => {
    if (!movie.poster_path) {
      const { cleanTitle, year } = cleanMovieTitle(movie.title);

      const fetchPoster = async () => {
        try {
          const apiKey = process.env.NEXT_PUBLIC_OMDB_API_KEY || "baeeb89";
          let url = "";
          
          // Use IMDb ID if available (from the new dataset) for flawless and instant matching
          // @ts-ignore (ignore TS error if imdb_id doesn't exist on the type yet)
          if (movie.imdb_id) {
            // @ts-ignore
            url = `https://www.omdbapi.com/?apikey=${apiKey}&i=${movie.imdb_id}`;
          } else {
            url = `https://www.omdbapi.com/?apikey=${apiKey}&t=${encodeURIComponent(cleanTitle)}`;
            if (year) url += `&y=${year}`;
          }

          const res = await fetch(url);
          const data = await res.json();
          if (data.Poster && data.Poster !== "N/A") {
            setPosterUrl(data.Poster);
            setImgError(false);
          } else {
            setImgError(true);
          }
        } catch (e) {
          console.error("Failed to fetch poster from OMDb", e);
          setImgError(true);
        } finally {
          setIsFetchingImage(false);
        }
      };
      
      fetchPoster();
    } else {
      setIsFetchingImage(false);
    }
  }, [movie.title, movie.poster_path]);

  useEffect(() => {
    if (!user) {
      setIsLiked(false);
      return;
    }
    
    const safeTitle = movie.title.replace(/[\.\#\$\[\]]/g, ''); // Firebase keys can't contain . # $ [ ]
    const movieRef = dbRef(database, `users/${user.uid}/likes/${safeTitle}`);
    
    const unsubscribe = onValue(movieRef, (snapshot) => {
      setIsLiked(snapshot.exists());
    });

    return () => unsubscribe();
  }, [user, movie.title]);

  const toggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      alert("Please sign in to save your favorite movies!");
      return;
    }

    const safeTitle = movie.title.replace(/[\.\#\$\[\]]/g, '');
    const movieRef = dbRef(database, `users/${user.uid}/likes/${safeTitle}`);

    if (isLiked) {
      remove(movieRef);
    } else {
      set(movieRef, {
        title: movie.title,
        poster_path: posterUrl,
        addedAt: Date.now()
      });
    }
  };

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
        
        <div 
          className="absolute top-4 right-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={toggleLike}
        >
          <button className="p-2 bg-black/40 backdrop-blur-md rounded-full hover:bg-black/60 transition-colors shadow-lg shadow-black/50 border border-white/10 hover:border-white/30">
            <Heart className={`w-5 h-5 transition-all ${isLiked ? "fill-red-500 text-red-500 scale-110" : "text-white"}`} />
          </button>
        </div>

        {isFetchingImage ? (
          <div className="w-full h-full bg-slate-900/50 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-10 h-10 border-2 border-cyan-500/50 border-t-cyan-400 rounded-full animate-spin mb-4"></div>
            <div className="h-4 w-3/4 bg-slate-700/50 rounded-full animate-pulse"></div>
            <div className="h-3 w-1/2 bg-slate-700/50 rounded-full animate-pulse mt-2"></div>
          </div>
        ) : !imgError ? (
          <img
            src={posterUrl}
            alt={movie.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center p-6 text-center transition-transform duration-500 group-hover:scale-110">
            <span className="text-xl font-bold text-slate-600 uppercase tracking-widest break-words">{displayTitle}</span>
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/80 to-transparent z-20 translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <h3 className="text-white font-bold text-lg truncate drop-shadow-md">{movie.title}</h3>
          
          <div className="flex items-center gap-2 mt-1">
            {movie.similarity_score && (
              <span className="flex items-center gap-1 text-cyan-400 text-xs font-semibold bg-cyan-900/40 px-2 py-1 rounded-md backdrop-blur-md">
                Match: {(parseFloat(movie.similarity_score) * 100).toFixed(0)}%
              </span>
            )}
            {movie.rating && (
              <span className="flex items-center gap-1 text-yellow-400 text-xs font-semibold bg-black/40 px-2 py-1 rounded-md backdrop-blur-md">
                <Star className="w-3 h-3 fill-yellow-400" />
                {movie.rating.toFixed(1)}
              </span>
            )}
          </div>
          
          {movie.explanation && (
            <p className="text-slate-300 text-xs mt-2 line-clamp-3 leading-snug">
              {movie.explanation}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
