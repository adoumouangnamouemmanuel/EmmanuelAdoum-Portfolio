import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import JourneySection from "@/components/sections/JourneySection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import BlogSection from "@/components/sections/BlogSection";
import ContactSection from "@/components/sections/ContactSection";
import BackgroundAnimation from "@/components/BackgroundAnimation";

export default function Home() {
  return (
    <>
      <BackgroundAnimation />
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <JourneySection />
        <TestimonialsSection />
        <BlogSection />
        <ContactSection />
      </main>
    </>
  );
}
