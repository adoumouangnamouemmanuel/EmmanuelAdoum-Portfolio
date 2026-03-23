import BlogLayout from "@/components/layout/BlogLayout";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  alternates: {
    canonical: "/about",
    languages: {
      "en-US": "/about",
      "fr-FR": "/fr/about",
    },
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <BlogLayout>{children}</BlogLayout>;
}
