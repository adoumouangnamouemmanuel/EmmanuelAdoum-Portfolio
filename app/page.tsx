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
    canonical: "/",
    languages: {
      "en-US": "/",
      "fr-FR": "/fr",
    },
  },
};

export default function Home() {
  return (
    <>
      <GreetingLoader />
      <BackgroundAnimation />
      <Header />
      <main className="relative z-10">
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <JourneySection />
        <AchievementsSection />
        {/* <BlogSection /> */}
        {/* <TestimonialsSection /> */}
        <ContactSection />
      </main>
      <FloatingLinks />
      <ScrollToTop />
      <Footer />
    </>
  );
}
