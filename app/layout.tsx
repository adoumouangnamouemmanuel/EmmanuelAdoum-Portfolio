// import Footer from "@/components/layout/Footer";
import { metadata as sharedMetadata, personJsonLd } from "@/app/metadata";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/components/ui/ToastProvider";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import type React from "react";
// Display font is bundled from npm instead of fetched from Google Fonts at
// build time: next/font's Space Grotesk download was failing on Vercel.
import "@fontsource-variable/space-grotesk/wght.css";
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
