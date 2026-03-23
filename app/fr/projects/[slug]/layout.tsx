import type { Metadata } from "next";
import type { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: LayoutProps): Promise<Metadata> {
  const { slug } = await params;

  return {
    alternates: {
      canonical: `/fr/projects/${slug}`,
      languages: {
        "en-US": `/projects/${slug}`,
        "fr-FR": `/fr/projects/${slug}`,
      },
    },
  };
}

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
