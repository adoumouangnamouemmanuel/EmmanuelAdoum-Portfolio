import BackgroundAnimation from "@/components/BackgroundAnimation";
import FloatingLinks from "@/components/FloatingLinks";
import ScrollToTop from "@/components/ScrollToTop";
import GreetingLoader from "@/components/GreetingLoader";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import AboutSection from "@/components/sections/AboutSection";
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
      <GreetingLoader />
      <BackgroundAnimation />
      <Header locale="fr" />
      <main className="relative z-10">
        <HeroSection locale="fr" />
        <AboutSection locale="fr" />
        <SkillsSection locale="fr" />
        <ProjectsSection locale="fr" />
        <JourneySection locale="fr" />
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
