import { experiencesFr } from "@/data/experiences";
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
  const experience = experiencesFr.find((exp) => exp.slug === slug);

  if (!experience) {
    return {
      title: "Expérience | Emmanuel Adoum",
    };
  }

  const title = `${experience.role} chez ${experience.company} | Emmanuel Adoum`;
  const description = experience.description.slice(0, 155);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      url: `/fr/experience/${experience.slug}`,
      siteName: "Emmanuel Adoum | Portfolio",
      locale: "fr_FR",
    },
    alternates: {
      canonical: `/fr/experience/${slug}`,
      languages: {
        "en-US": `/experience/${slug}`,
        "fr-FR": `/fr/experience/${slug}`,
      },
    },
  };
}

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}