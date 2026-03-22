// import Footer from "@/components/layout/Footer";
import { metadata as sharedMetadata } from "@/app/metadata";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/components/ui/ToastProvider";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import type React from "react";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = sharedMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <ToastProvider children={children} />
        </ThemeProvider>
      </body>
    </html>
  );
}
