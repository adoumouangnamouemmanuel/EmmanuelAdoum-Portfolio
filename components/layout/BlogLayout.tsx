"use client";

import Header from "@/components/layout/BlogHeader";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { SessionProvider } from "next-auth/react"; // Import SessionProvider
import type { ReactNode } from "react";

interface BlogLayoutProps {
  children: ReactNode;
}

export default function BlogLayout({ children }: BlogLayoutProps) {
  return (
    <SessionProvider>
      {" "}
      {/* Wrap the blog layout in SessionProvider */}
      <div className="flex flex-col min-h-screen">
        <Header />
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-grow pt-24"
        >
          {children}
        </motion.main>
        {/* <Footer /> */}
      </div>
    </SessionProvider>
  );
}
