// import Footer from "@/components/layout/Footer";
import { metadata as sharedMetadata, personJsonLd } from "@/app/metadata";
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
      <body
        className={`${outfit.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              personJsonLd(
                process.env.NEXT_PUBLIC_SITE_URL ||
                  "https://emmanueladoum.com",
              ),
            ),
          }}
        />
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
