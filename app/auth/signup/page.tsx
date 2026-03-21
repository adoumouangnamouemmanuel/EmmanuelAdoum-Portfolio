"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Loader2, Lock, Mail, User } from 'lucide-react';
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [authProvider, setAuthProvider] = useState<string | null>(null);

  // Error states for inline validation
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthProvider("credentials");

    // Reset error states
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    // Client-side validation
    let hasError = false;

    if (!name.trim()) {
      setNameError("Name is Required.");
      hasError = true;
    }

    if (!email.trim()) {
      setEmailError("Email is Required.");
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Invalid Email Address.");
      hasError = true;
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      hasError = true;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      hasError = true;
    }

    if (hasError) {
      setIsLoading(false);
      setAuthProvider(null);
      return;
    }

    try {
      console.log("Attempting to register user:", { name, email });

      // Register the user
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      console.log("Registration response status:", response.status);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Registration Failed");
      }

      toast({
        title: "Account Created",
        description: "Your account has been successfully created.",
      });

      router.push("/auth/login");
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Error",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setAuthProvider(null);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setAuthProvider("google");
    try {
      console.log("Attempting to sign in with Google");
      await signIn("google", { callbackUrl: "/blog" });
    } catch (error) {
      console.error("Google sign in error:", error);
      toast({
        title: "OAuth Error",
        description: "Google sign-up failed. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
      setAuthProvider(null);
    }
  };

  return (
    <main className="min-h-screen relative flex flex-col justify-center items-center px-6 py-16 bg-slate-50 dark:bg-slate-950 selection:bg-purple-200 dark:selection:bg-purple-900/50 overflow-hidden">
      
      {/* Ambient Cinematic Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[600px] sm:h-[900px] bg-purple-600/10 dark:bg-purple-500/10 blur-[100px] sm:blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] dark:opacity-[0.02] mix-blend-overlay pointer-events-none" />

      {/* Top Left Return Button */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-8 left-6 sm:left-12 z-20"
      >
        <Link href="/blog" className="group inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm hover:shadow-md">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Blog
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="w-full max-w-[460px] relative z-10 my-auto"
      >
        {/* Glassmorphic Node */}
        <div className="relative rounded-[2.5rem] bg-white/60 dark:bg-slate-900/40 backdrop-blur-3xl border border-white/40 dark:border-slate-800/60 shadow-2xl overflow-hidden shadow-black/5 dark:shadow-black/40">
          
          {/* Top Edge Highlight */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

          <div className="p-8 sm:p-12">
            <div className="mb-10 text-center">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tighter text-slate-900 dark:text-white mb-3">
                Create Account<span className="text-purple-600 dark:text-purple-400">.</span>
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-light translate-y-2">
                Sign up to get started.
              </p>
            </div>

            {/* Google OAuth Access */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mb-8">
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full relative group overflow-hidden rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-4 flex items-center justify-center gap-3 font-bold tracking-widest text-[10px] sm:text-xs uppercase transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading && authProvider === "google" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                )}
                <span className="relative z-10">Sign up with Google</span>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </motion.div>

            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
              <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-slate-400">Or register with email</span>
              <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center text-[10px] font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400 ml-2">
                  <User className="w-3 h-3 mr-2" />
                  Full Name
                </Label>
                <div className="relative">
                  <Input
                    id="name"
                    placeholder="Emmanuel Adoum"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-6 py-5 sm:py-6 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10 text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all font-light"
                  />
                  <AnimatePresence>
                    {nameError && (
                      <motion.p 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-rose-500 text-[10px] font-bold tracking-widest uppercase mt-2 ml-2"
                      >
                        {nameError}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center text-[10px] font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400 ml-2">
                  <Mail className="w-3 h-3 mr-2" />
                  Email Address
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="emmanuel.adoum@ashesi.edu.gh"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-6 py-5 sm:py-6 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10 text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all font-light"
                  />
                  <AnimatePresence>
                    {emailError && (
                      <motion.p 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-rose-500 text-[10px] font-bold tracking-widest uppercase mt-2 ml-2"
                      >
                        {emailError}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center text-[10px] font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400 ml-2">
                  <Lock className="w-3 h-3 mr-2" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    placeholder="••••••••••••"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-6 py-5 sm:py-6 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10 text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all font-light"
                  />
                  <AnimatePresence>
                    {passwordError && (
                      <motion.p 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-rose-500 text-[10px] font-bold tracking-widest uppercase mt-2 ml-2"
                      >
                        {passwordError}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="flex items-center text-[10px] font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400 ml-2">
                  <CheckCircle2 className="w-3 h-3 mr-2" />
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    placeholder="••••••••••••"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-6 py-5 sm:py-6 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10 text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all font-light"
                  />
                  <AnimatePresence>
                    {confirmPasswordError && (
                      <motion.p 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-rose-500 text-[10px] font-bold tracking-widest uppercase mt-2 ml-2"
                      >
                        {confirmPasswordError}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-2xl bg-purple-600 hover:bg-purple-700 text-white px-6 py-6 flex items-center justify-center gap-3 font-bold tracking-widest text-[10px] sm:text-xs uppercase transition-all shadow-xl shadow-purple-500/20"
                >
                  {isLoading && authProvider === "credentials" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Mail className="w-4 h-4" /> Create Account
                    </>
                  )}
                </Button>
              </motion.div>
            </form>
          </div>
          
          <div className="bg-slate-50/50 dark:bg-slate-950/50 px-8 py-6 border-t border-slate-200/50 dark:border-slate-800/50 text-center flex flex-col items-center justify-center">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-purple-600 dark:text-purple-400 font-bold tracking-widest uppercase hover:text-purple-700 dark:hover:text-purple-300 transition-colors ml-2 border-b border-transparent hover:border-purple-500">
                Sign In
              </Link>
            </span>
          </div>

        </div>
      </motion.div>
    </main>
  );
}
