import BackgroundAnimation from "@/components/BackgroundAnimation";
import FloatingLinks from "@/components/FloatingLinks";
import ScrollToTop from "@/components/ScrollToTop";
import GreetingLoader from "@/components/GreetingLoader";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import AboutSection from "@/components/sections/AboutSection";
import AmbassadorSection from "@/components/sections/AmbassadorSection";
import StatsStrip from "@/components/sections/StatsStrip";
import BlogSection from "@/components/sections/BlogSection";
import ContactSection from "@/components/sections/ContactSection";
import HeroSection from "@/components/sections/HeroSection";
import JourneySection from "@/components/sections/JourneySection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import SkillsSection from "@/components/sections/SkillsSection";
import AchievementsSection from "@/components/sections/AchievementsSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Emmanuel Adoum | Portfolio",
  description:
    "Portfolio d'Emmanuel Adoum — Ingénieur logiciel. Conception de systèmes évolutifs et orientés données pour des environnements critiques.",
  keywords: [
    "Emmanuel Adoum",
    "Portfolio",
    "Ingénieur logiciel",
    "Software Engineer",
    "Ingénieur informatique",
    "Développeur full stack",
    "Next.js",
    "TypeScript",
    "React",
    "Python",
    "Intelligence artificielle",
  ],
  alternates: {
    canonical: "/fr",
    languages: {
      "en-US": "/",
      "fr-FR": "/fr",
    },
  },
  openGraph: {
    title: "Emmanuel Adoum | Ingénieur Logiciel",
    description:
      "Ingénieur logiciel. Conception de systèmes évolutifs et orientés données pour des environnements critiques.",
    siteName: "Emmanuel Adoum | Portfolio",
    locale: "fr_FR",
    images: [
      {
        url: "/emma.png",
        width: 1200,
        height: 630,
        alt: "Emmanuel Adoum | Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Emmanuel Adoum | Ingénieur Logiciel",
    description:
      "Ingénieur logiciel. Conception de systèmes évolutifs et orientés données pour des environnements critiques.",
    images: ["/emma.png"],
    creator: "@emmanueladoum",
  },
};

export default function HomeFr() {
  return (
    <>
      <GreetingLoader />
      <BackgroundAnimation />
      <Header locale="fr" />
      <main className="relative z-10" data-portfolio>
        <HeroSection locale="fr" />
        <AboutSection locale="fr" />
        <StatsStrip locale="fr" />
        <SkillsSection locale="fr" />
        <ProjectsSection locale="fr" />
        <JourneySection locale="fr" />
        <AmbassadorSection locale="fr" />
        <AchievementsSection locale="fr" />
        {/* <BlogSection locale="fr" /> */}
        {/* <TestimonialsSection locale="fr" /> */}
        <ContactSection locale="fr" />
      </main>
      <FloatingLinks locale="fr" />
      <ScrollToTop />
      <Footer locale="fr" />
    </>
  );
}
