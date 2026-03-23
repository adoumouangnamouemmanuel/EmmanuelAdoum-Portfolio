import BackgroundAnimation from "@/components/BackgroundAnimation";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import AboutSection from "@/components/sections/AboutSection";
import BlogSection from "@/components/sections/BlogSection";
import ContactSection from "@/components/sections/ContactSection";
import HeroSection from "@/components/sections/HeroSection";
import JourneySection from "@/components/sections/JourneySection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import SkillsSection from "@/components/sections/SkillsSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "/fr",
    languages: {
      "en-US": "/",
      "fr-FR": "/fr",
    },
  },
};

export default function HomeFr() {
  return (
    <>
      <BackgroundAnimation />
      <Header locale="fr" />
      <main>
        <HeroSection locale="fr" />
        <AboutSection locale="fr" />
        <SkillsSection locale="fr" />
        <ProjectsSection locale="fr" />
        <JourneySection locale="fr" />
        <BlogSection locale="fr" />
        <TestimonialsSection locale="fr" />
        <ContactSection locale="fr" />
      </main>
      <Footer locale="fr" />
    </>
  );
}
