import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  alternates: {
    canonical: "/projects",
    languages: {
      "en-US": "/projects",
      "fr-FR": "/fr/projects",
    },
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
