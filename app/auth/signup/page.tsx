"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
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
      setNameError("Name is required.");
      hasError = true;
    }

    if (!email.trim()) {
      setEmailError("Email is required.");
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address.");
      hasError = true;
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
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
        throw new Error(data.error || "Failed to register");
      }

      toast({
        title: "Success",
        description: "Account created successfully.",
      });

      router.push("/auth/login");
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
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
        title: "Error",
        description: "Failed to sign in with Google. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
      setAuthProvider(null);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <main className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-start mb-8"
        >
          <motion.div whileHover={{ scale: 1.05, x: -5 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="sm"
              className="shadow-md group bg-white dark:bg-gray-800"
              asChild
            >
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
                Back to Blog
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <Card className="border-none shadow-2xl overflow-hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none"></div>
            
            <CardHeader className="space-y-1 pb-6">
              <motion.div variants={itemVariants}>
                <CardTitle className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
                  Create an Account
                </CardTitle>
              </motion.div>
              <motion.div variants={itemVariants}>
                <CardDescription className="text-center">
                  Sign up to get started with our blog platform
                </CardDescription>
              </motion.div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <motion.div className="grid grid-cols-1 gap-4 place-items-center" variants={itemVariants}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full">
                  <Button
                    variant="outline"
                    className="w-full relative overflow-hidden group bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                  >
                    <div className="absolute inset-0 w-3 bg-gradient-to-r from-red-500 to-yellow-500 group-hover:w-full transition-all duration-300 opacity-80 group-hover:opacity-20"></div>
                    {isLoading && authProvider === "google" ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <svg
                        className="mr-2 h-4 w-4"
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fab"
                        data-icon="google"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 488 512"
                      >
                        <path
                          fill="currentColor"
                          d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                        ></path>
                      </svg>
                    )}
                    <span className="relative z-10">Google</span>
                  </Button>
                </motion.div>
              </motion.div>

              <motion.div className="relative" variants={itemVariants}>
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </motion.div>

              <motion.form onSubmit={handleSubmit} className="space-y-4" variants={itemVariants}>
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center text-sm font-medium">
                    <User className="h-4 w-4 mr-2 text-purple-500 dark:text-purple-400" />
                    Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Emmanuel Adoum"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="border-gray-200 dark:border-gray-700 focus:border-purple-500 dark:focus:border-purple-500 focus:ring-purple-500 dark:focus:ring-purple-500 transition-colors"
                  />
                  <AnimatePresence>
                    {nameError && (
                      <motion.p 
                        className="text-red-500 text-xs mt-1 flex items-center"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        {nameError}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center text-sm font-medium">
                    <Mail className="h-4 w-4 mr-2 text-purple-500 dark:text-purple-400" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="emmanuel.adoum@ashesi.edu.gh"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-gray-200 dark:border-gray-700 focus:border-purple-500 dark:focus:border-purple-500 focus:ring-purple-500 dark:focus:ring-purple-500 transition-colors"
                  />
                  <AnimatePresence>
                    {emailError && (
                      <motion.p 
                        className="text-red-500 text-xs mt-1 flex items-center"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        {emailError}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center text-sm font-medium">
                    <Lock className="h-4 w-4 mr-2 text-purple-500 dark:text-purple-400" />
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border-gray-200 dark:border-gray-700 focus:border-purple-500 dark:focus:border-purple-500 focus:ring-purple-500 dark:focus:ring-purple-500 transition-colors"
                  />
                  <AnimatePresence>
                    {passwordError && (
                      <motion.p 
                        className="text-red-500 text-xs mt-1 flex items-center"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        {passwordError}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="flex items-center text-sm font-medium">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-purple-500 dark:text-purple-400" />
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="border-gray-200 dark:border-gray-700 focus:border-purple-500 dark:focus:border-purple-500 focus:ring-purple-500 dark:focus:ring-purple-500 transition-colors"
                  />
                  <AnimatePresence>
                    {confirmPasswordError && (
                      <motion.p 
                        className="text-red-500 text-xs mt-1 flex items-center"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        {confirmPasswordError}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
                
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md"
                    disabled={isLoading}
                  >
                    {isLoading && authProvider === "credentials" ? (
                      <div className="flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </div>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" /> Sign up with Email
                      </>
                    )}
                  </Button>
                </motion.div>
              </motion.form>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4 pb-6">
              <motion.div className="text-center text-sm" variants={itemVariants}>
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
                >
                  Sign in
                </Link>
              </motion.div>
              
              <motion.div className="text-center text-xs text-muted-foreground" variants={itemVariants}>
                By signing up, you agree to our{" "}
                <Link
                  href="/terms"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Privacy Policy
                </Link>
                .
              </motion.div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}
