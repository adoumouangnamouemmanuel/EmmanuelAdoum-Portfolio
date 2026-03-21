"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { ArrowLeft, KeyRound, Loader2, Lock, Mail } from 'lucide-react'
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/blog"
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [authProvider, setAuthProvider] = useState<string | null>(null)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setAuthProvider("credentials")

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        toast({
          title: "Access Denied",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Access Granted",
          description: "Successfully logged in.",
          variant: "default",
        })
        router.push(callbackUrl)
      }
    } catch (error) {
      toast({
        title: "System Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setAuthProvider(null)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setAuthProvider("google")
    try {
      await signIn("google", { callbackUrl })
    } catch (error) {
      toast({
        title: "OAuth Error",
        description: "Google sign-in failed. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
      setAuthProvider(null)
    }
  }

  return (
    <main className="min-h-screen relative flex flex-col justify-center items-center px-6 py-12 bg-slate-50 dark:bg-slate-950 selection:bg-blue-200 dark:selection:bg-blue-900/50 overflow-hidden">
      
      {/* Ambient Cinematic Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] bg-blue-600/10 dark:bg-blue-500/10 blur-[100px] sm:blur-[140px] rounded-full pointer-events-none" />
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
        className="w-full max-w-[440px] relative z-10"
      >
        {/* Glassmorphic Node */}
        <div className="relative rounded-[2.5rem] bg-white/60 dark:bg-slate-900/40 backdrop-blur-3xl border border-white/40 dark:border-slate-800/60 shadow-2xl overflow-hidden shadow-black/5 dark:shadow-black/40">
          
          {/* Top Edge Highlight */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

          <div className="p-8 sm:p-12">
            <div className="mb-10 text-center">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tighter text-slate-900 dark:text-white mb-3">
                Welcome Back<span className="text-blue-600 dark:text-blue-400">.</span>
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-light translate-y-2">
                Sign in to access your account.
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
                <span className="relative z-10">Sign in with Google</span>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </motion.div>

            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
              <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-slate-400">Or continue with email</span>
              <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                    className="w-full px-6 py-6 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all font-light"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between ml-2 mr-2">
                  <Label htmlFor="password" className="flex items-center text-[10px] font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400">
                    <Lock className="w-3 h-3 mr-2" />
                    Password
                  </Label>
                  <Link href="/auth/forgot-password" className="text-[10px] font-bold tracking-widest uppercase text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                    Reset?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  placeholder="••••••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-6 py-6 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all font-light"
                />
              </div>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="pt-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-2xl bg-blue-600 hover:bg-blue-700 text-white px-6 py-6 flex items-center justify-center gap-3 font-bold tracking-widest text-[10px] sm:text-xs uppercase transition-all shadow-xl shadow-blue-500/20"
                >
                  {isLoading && authProvider === "credentials" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" /> Sign In
                    </>
                  )}
                </Button>
              </motion.div>
            </form>
          </div>
          
          <div className="bg-slate-50/50 dark:bg-slate-950/50 px-8 py-6 border-t border-slate-200/50 dark:border-slate-800/50 text-center flex flex-col items-center justify-center">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide">
              Don't have an account?{" "}
              <Link href="/auth/signup" className="text-blue-600 dark:text-blue-400 font-bold tracking-widest uppercase hover:text-blue-700 dark:hover:text-blue-300 transition-colors ml-2 border-b border-transparent hover:border-blue-500">
                Sign Up
              </Link>
            </span>
          </div>

        </div>
      </motion.div>
    </main>
  )
}
