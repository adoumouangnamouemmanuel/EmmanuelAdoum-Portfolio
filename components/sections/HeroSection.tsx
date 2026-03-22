"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Download, Github, Linkedin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Locale = "en" | "fr";

export default function HeroSection({ locale = "en" }: { locale?: Locale }) {
  const t =
    locale === "fr"
      ? {
          greeting: "Salut, je suis",
          subtitleLead: "Je conçois des produits",
          subtitleTail: "avec un design propre et une ingénierie solide.",
          description:
            "Je transforme des idées complexes en systèmes performants et durables.",
          ctaPrimary: "Démarrer une conversation",
          ctaSecondary: "Télécharger le CV",
          githubAria: "GitHub",
          linkedinAria: "LinkedIn",
        }
      : {
          greeting: "Hi, I'm",
          subtitleLead: "I build",
          subtitleTail: "products with clean design and strong engineering.",
          description:
            "I turn complex ideas into high-performance systems that last.",
          ctaPrimary: "Start a Conversation",
          ctaSecondary: "Download Resume",
          githubAria: "GitHub",
          linkedinAria: "LinkedIn",
        };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section
      id="home"
      className="relative lg:min-h-screen block lg:flex lg:items-center pt-24 pb-12 lg:pb-16 overflow-hidden bg-white dark:bg-slate-950"
    >
      {/* Bold Background Image Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Desktop Gradient Overlay - fades image seamlessly into text container */}
        <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent dark:from-slate-950 dark:via-slate-950/90 z-10" />

        {/* Mobile/Tablet Gradient Overlay - Strong left-to-right fade for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/20 lg:hidden dark:from-slate-950/95 dark:via-slate-950/80 dark:to-slate-950/20 z-10" />
        {/* Mobile bottom fade to ensure content lower down is readable */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white via-white/80 to-transparent lg:hidden dark:from-slate-950 dark:via-slate-950/80 z-10" />

        {/* Global Dark Mode Tint */}
        <div className="hidden dark:block absolute inset-0 bg-slate-950/0 z-10" />

        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute right-0 top-[10%] lg:top-[12%] h-[90%] lg:h-[88%] w-full lg:w-[65%] object-cover object-center lg:object-right"
        >
          <Image
            src="/images/emmanuel.jpeg"
            alt="Emmanuel Adoum Background"
            fill
            className="object-cover object-[75%_15%] lg:object-[center_15%] opacity-100 dark:opacity-100"
            priority
          />
        </motion.div>
      </div>

      <div className="section-container relative z-20 px-4 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-2xl pt-12 sm:pt-20 lg:pt-0"
        >
          {/* Main Typography */}
          <motion.h1
            variants={itemVariants}
            className="text-balance text-[3.5rem] leading-[1.05] font-bold tracking-tighter text-slate-900 sm:text-7xl lg:text-[5.5rem] dark:text-white"
          >
            {t.greeting}{" "}
            <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              Emmanuel
            </span>
          </motion.h1>

          <motion.h2
            variants={itemVariants}
            className="mt-4 sm:mt-6 max-w-xl text-balance text-xl sm:text-2xl md:text-3xl font-medium tracking-tight text-slate-800 dark:text-slate-200"
          >
            {t.subtitleLead}{" "}
            <span className="font-semibold text-blue-700 dark:text-blue-400">
              scalable web
            </span>
            {locale === "fr" ? " et " : " and "}
            <span className="font-semibold text-indigo-700 dark:text-indigo-400">
              AI-driven
            </span>{" "}
            {t.subtitleTail}
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="mt-4 sm:mt-5 max-w-xl text-balance text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-300 border-l-[3px] border-blue-600 pl-4 sm:pl-5 dark:border-blue-400"
          >
            {t.description}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
          >
            <Button
              asChild
              size="lg"
              className="group h-14 w-full sm:w-auto rounded-full bg-blue-600 px-8 text-base font-medium shadow-xl shadow-blue-600/20 transition-all hover:scale-105 hover:bg-blue-700 dark:bg-blue-500 dark:shadow-blue-900/40 dark:hover:bg-blue-400 text-white justify-center"
            >
              <Link href="#contact">
                {t.ctaPrimary}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="group h-14 w-full sm:w-auto rounded-full border-slate-300 bg-white/80 backdrop-blur-sm px-8 text-base font-medium shadow-sm transition-all hover:scale-105 hover:bg-white dark:border-slate-700 dark:bg-slate-900/80 dark:hover:bg-slate-800 dark:text-white text-slate-900 justify-center"
            >
              <Link
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.ctaSecondary}
                <Download className="ml-2 h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
              </Link>
            </Button>
          </motion.div>

          {/* Social Links */}
          <motion.div
            variants={itemVariants}
            className="mt-10 sm:mt-12 flex items-center gap-6 text-slate-500 dark:text-slate-400"
          >
            <Link
              href="https://github.com/adoumouangnamouemmanuel"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-slate-900 dark:hover:text-white"
              aria-label={t.githubAria}
            >
              <Github className="h-6 w-6 lg:h-7 lg:w-7" />
            </Link>
            <span className="h-5 w-px bg-slate-300 dark:bg-slate-700" />
            <Link
              href="https://www.linkedin.com/in/emmanueladoum/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[#0A66C2] dark:hover:text-blue-400"
              aria-label={t.linkedinAria}
            >
              <Linkedin className="h-6 w-6 lg:h-7 lg:w-7" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
