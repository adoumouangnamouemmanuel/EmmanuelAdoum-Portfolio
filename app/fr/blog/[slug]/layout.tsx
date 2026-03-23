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
      canonical: `/fr/blog/${slug}`,
      languages: {
        "en-US": `/blog/${slug}`,
        "fr-FR": `/fr/blog/${slug}`,
      },
    },
  };
}

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
