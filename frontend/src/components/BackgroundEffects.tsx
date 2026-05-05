import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Star {
  id: number;
  size: number;
  top: number;
  left: number;
  duration: number;
  delay: number;
}

export default function BackgroundEffects() {
  const [mounted, setMounted] = useState(false);
  const [stars] = useState<Star[]>(() => 
    Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      size: Math.random() * 2 + 1,
      top: Math.random() * 100,
      left: Math.random() * 100,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }))
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-slate-950">
      {/* Cinematic Gradient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black opacity-80" />
      
      {/* Light Beams */}
      <motion.div 
        animate={{ 
          x: ["-100%", "100%"], 
          opacity: [0, 0.1, 0] 
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className="absolute top-0 bottom-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent skew-x-12"
      />
      <motion.div 
        animate={{ 
          x: ["100%", "-100%"], 
          opacity: [0, 0.1, 0] 
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: "linear",
          delay: 5 
        }}
        className="absolute top-0 bottom-0 right-0 w-1/3 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent -skew-x-12"
      />

      {/* Particles resembling stars */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute bg-white rounded-full"
          style={{
            width: star.size,
            height: star.size,
            top: `${star.top}%`,
            left: `${star.left}%`,
          }}
          animate={{
            opacity: [0.1, 0.8, 0.1],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Film grain noise overlay */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
    </div>
  );
}
