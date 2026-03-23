import BlogLayout from "@/components/layout/BlogLayout";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  alternates: {
    canonical: "/blog",
    languages: {
      "en-US": "/blog",
      "fr-FR": "/fr/blog",
    },
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <BlogLayout>{children}</BlogLayout>;
}
