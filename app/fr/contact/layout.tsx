import BlogLayout from "@/components/layout/BlogLayout";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  alternates: {
    canonical: "/fr/contact",
    languages: {
      "en-US": "/contact",
      "fr-FR": "/fr/contact",
    },
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <BlogLayout>{children}</BlogLayout>;
}
