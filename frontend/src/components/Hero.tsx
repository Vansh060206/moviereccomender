"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import SearchBar from "./SearchBar";

export default function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden">
      {/* Background Parallax Elements */}
      <motion.div 
        style={{ y, opacity }}
        className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center"
      >
        <div className="w-[800px] h-[800px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute w-[600px] h-[600px] bg-cyan-600/20 rounded-full blur-[100px] mix-blend-screen translate-x-1/2 -translate-y-1/4" />
      </motion.div>

      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-6"
        >
          <span className="inline-block py-1 px-3 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-semibold tracking-wider mb-6">
            THE FUTURE OF CINEMA
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight text-white drop-shadow-2xl">
            Discover Movies <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
              You&apos;ll Love
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed mb-12">
            AI-powered recommendations tailored to your cinematic taste. Don&apos;t just watch — experience.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="w-full max-w-3xl mx-auto"
        >
          <SearchBar />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-slate-400 tracking-widest uppercase">Scroll</span>
        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 border-2 border-slate-500 rounded-full flex justify-center p-1"
        >
          <div className="w-1 h-2 bg-cyan-400 rounded-full" />
        </motion.div>
      </motion.div>
    </div>
  );
}
