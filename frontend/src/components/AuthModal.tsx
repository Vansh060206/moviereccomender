"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, Loader2, ArrowRight, CheckCircle2 } from "lucide-react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { cn } from "@/lib/utils";

// --- Reusable Subcomponents ---

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ElementType;
  label: string;
  error?: string;
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ icon: Icon, label, error, className, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div className="space-y-1.5 w-full">
        <label className="text-sm font-medium text-slate-300 ml-1">{label}</label>
        <div className="relative group">
          <div className={cn(
            "absolute inset-0 rounded-xl transition-all duration-300 pointer-events-none",
            isFocused ? "ring-2 ring-cyan-500/50 bg-cyan-500/5" : "bg-slate-900/50 group-hover:bg-slate-900/80",
            error ? "ring-2 ring-red-500/50 bg-red-500/5" : "border border-white/10"
          )} />
          <Icon className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 z-10",
            isFocused ? "text-cyan-400" : "text-slate-500",
            error && "text-red-400"
          )} />
          <input
            ref={ref}
            onFocus={(e) => { setIsFocused(true); props.onFocus?.(e); }}
            onBlur={(e) => { setIsFocused(false); props.onBlur?.(e); }}
            className={cn(
              "w-full bg-transparent py-3.5 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none z-20 relative",
              className
            )}
            {...props}
          />
        </div>
        <AnimatePresence>
          {error && (
            <motion.p 
              initial={{ opacity: 0, height: 0, y: -5 }} 
              animate={{ opacity: 1, height: "auto", y: 0 }} 
              exit={{ opacity: 0, height: 0, y: -5 }}
              className="text-red-400 text-xs ml-1 font-medium"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);
InputField.displayName = "InputField";

const AuthButton = ({ 
  children, loading, ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      {...props}
      className={cn(
        "relative w-full group overflow-hidden rounded-xl font-semibold text-white shadow-[0_0_40px_-10px_rgba(6,182,212,0.3)] transition-all duration-300",
        props.disabled ? "opacity-70 cursor-not-allowed" : "hover:shadow-[0_0_60px_-15px_rgba(6,182,212,0.5)]"
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 group-hover:opacity-90 transition-opacity duration-300" />
      <div className="relative flex items-center justify-center gap-2 py-3.5">
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : children}
      </div>
    </motion.button>
  );
};

// --- Main Modal Component ---

export default function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Validation States
  const isEmailValid = email.length > 0 ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) : true;
  const passwordsMatch = !isLogin && confirmPassword.length > 0 ? password === confirmPassword : true;
  const isPasswordStrong = !isLogin && password.length > 0 ? password.length >= 6 : true;

  // Reset states when switching tabs or closing
  useEffect(() => {
    setError("");
    setSuccessMsg("");
    if (!isOpen) {
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    }
  }, [isLogin, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!isEmailValid) return setError("Please enter a valid email address.");
    if (!isLogin && !passwordsMatch) return setError("Passwords do not match.");
    if (!isLogin && !isPasswordStrong) return setError("Password must be at least 6 characters long.");

    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        setSuccessMsg("Successfully signed in!");
        setTimeout(() => onClose(), 1000);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        setSuccessMsg("Account created successfully!");
        setTimeout(() => onClose(), 1000);
      }
    } catch (err: any) {
      const msg = err.message.replace("Firebase: ", "").replace(/\(auth.*\)/, "").trim();
      setError(msg || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          />
          
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md z-[101]"
          >
            <div className="relative overflow-hidden glass p-8 sm:p-10 rounded-3xl border border-white/10 shadow-2xl shadow-cyan-900/20">
              
              {/* Dynamic Animated Background Orbs inside Card */}
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-32 -right-32 w-64 h-64 bg-purple-600/30 rounded-full blur-[80px] pointer-events-none" 
              />
              <motion.div 
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-32 -left-32 w-64 h-64 bg-cyan-600/30 rounded-full blur-[80px] pointer-events-none" 
              />

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors z-20"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative z-10">
                <div className="text-center mb-10">
                  <motion.h2 
                    layout="position"
                    className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 mb-3"
                  >
                    {isLogin ? "Welcome Back" : "Create Account"}
                  </motion.h2>
                  <motion.p layout="position" className="text-slate-400 text-sm font-medium">
                    {isLogin 
                      ? "Sign in to access your cinematic universe" 
                      : "Join CineSync and start exploring"}
                  </motion.p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <AnimatePresence mode="popLayout">
                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm font-medium text-center shadow-inner"
                      >
                        {error}
                      </motion.div>
                    )}
                    {successMsg && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="p-3.5 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm font-medium text-center shadow-inner flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        {successMsg}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.div layout className="space-y-5">
                    <InputField
                      icon={Mail}
                      label="Email Address"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      error={!isEmailValid ? "Invalid email format" : undefined}
                    />

                    <InputField
                      icon={Lock}
                      label="Password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      error={!isPasswordStrong ? "Must be at least 6 characters" : undefined}
                    />

                    <AnimatePresence>
                      {!isLogin && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-5">
                            <InputField
                              icon={Lock}
                              label="Confirm Password"
                              type="password"
                              placeholder="••••••••"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              required={!isLogin}
                              error={!passwordsMatch ? "Passwords do not match" : undefined}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {isLogin && (
                    <motion.div layout className="flex justify-end pt-1">
                      <button type="button" className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors">
                        Forgot password?
                      </button>
                    </motion.div>
                  )}

                  <motion.div layout className="pt-2">
                    <AuthButton 
                      type="submit" 
                      disabled={loading || !isEmailValid || (!isLogin && (!passwordsMatch || !isPasswordStrong))}
                      loading={loading}
                    >
                      {isLogin ? "Sign In" : "Create Account"}
                      {!loading && <ArrowRight className="w-4 h-4 ml-1" />}
                    </AuthButton>
                  </motion.div>
                </form>

                <motion.div layout className="mt-8 text-center border-t border-white/5 pt-6">
                  <p className="text-sm text-slate-400">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button
                      onClick={() => setIsLogin(!isLogin)}
                      className="ml-2 font-semibold text-white hover:text-cyan-400 transition-colors focus:outline-none focus:underline"
                    >
                      {isLogin ? "Sign up" : "Sign in"}
                    </button>
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
