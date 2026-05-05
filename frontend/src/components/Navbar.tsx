"use client";

import { motion } from "framer-motion";
import { Film, Search, User, LogOut } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "./AuthModal";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { user, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-300",
          scrolled ? "glass py-4" : "bg-transparent py-6"
        )}
      >
        <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Film className="w-8 h-8 text-cyan-400 group-hover:text-purple-400 transition-colors duration-300 relative z-10" />
              <div className="absolute inset-0 bg-cyan-400/50 blur-xl rounded-full scale-110 group-hover:bg-purple-400/50 transition-colors duration-300"></div>
            </div>
            <span className="text-xl font-bold tracking-wider text-white uppercase text-glow hidden sm:block">
              CineSync
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <button className="text-slate-300 hover:text-cyan-400 transition-colors duration-300">
              <Search className="w-5 h-5" />
            </button>
            <div className="h-6 w-px bg-white/20"></div>
            
            {!loading && (
              user ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-purple-400">
                    <User className="w-5 h-5" />
                    <span className="hidden sm:block text-sm font-medium">
                      {user.email?.split('@')[0]}
                    </span>
                  </div>
                  <button 
                    onClick={() => signOut(auth)}
                    className="text-slate-400 hover:text-red-400 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsAuthOpen(true)}
                  className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition-colors duration-300"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden sm:block text-sm font-medium">Sign In</span>
                </button>
              )
            )}
          </div>
        </div>
      </motion.nav>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}
