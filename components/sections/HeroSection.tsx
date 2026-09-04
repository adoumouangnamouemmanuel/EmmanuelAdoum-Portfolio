"use client";

import { Button } from "@/components/ui/button";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Download, Github, Linkedin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type Locale = "en" | "fr";

const TAGLINE_INTERVAL_MS = 2600;

export default function HeroSection({ locale = "en" }: { locale?: Locale }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.22]);
  const backgroundBlur = useTransform(
    scrollYProgress,
    [0, 0.55, 1],
    ["blur(0px)", "blur(5px)", "blur(12px)"],
  );
  const t = useMemo(
    () =>
      locale === "fr"
        ? {
            name: "Emmanuel Adoum",
            taglines: [
              "Ingenierie informatique & IA",
              "Developpeur logiciel full stack",
              "Produits web, mobiles et IA",
            ],
            description:
              "Je transforme des idees complexes en systemes performants, durables et utiles.",
            ctaPrimary: "Demarrer une conversation",
            ctaSecondary: "Telecharger le CV",
            githubAria: "GitHub",
            linkedinAria: "LinkedIn",
            portraitAlt: "Portrait d'Emmanuel Adoum",
          }
        : {
            name: "Emmanuel Adoum",
            taglines: [
              "Computer Engineering & AI",
              "Full Stack Software Developer",
              "Web, mobile, and AI-driven products",
            ],
            description:
              "I turn complex ideas into high-performance systems that last.",
            ctaPrimary: "Start a Conversation",
            ctaSecondary: "Download Resume",
            githubAria: "GitHub",
            linkedinAria: "LinkedIn",
            portraitAlt: "Portrait of Emmanuel Adoum",
          },
    [locale],
  );
  const [taglineIndex, setTaglineIndex] = useState(0);
  const activeTagline = t.taglines[taglineIndex % t.taglines.length];

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setTaglineIndex((current) => (current + 1) % t.taglines.length);
    }, TAGLINE_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [t.taglines.length]);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-slate-950 px-4 pb-12 pt-24 text-center text-white sm:px-6 lg:min-h-screen"
    >
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          style={{ scale: backgroundScale, filter: backgroundBlur }}
          className="absolute inset-[-7%] will-change-transform"
        >
          <Image
            src="/home-bg.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </motion.div>
        <div className="absolute inset-0 bg-slate-950/42 dark:bg-slate-950/54" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(2,6,23,0.42),rgba(2,6,23,0.24)_45%,rgba(2,6,23,0.82))] dark:bg-[linear-gradient(to_bottom,rgba(2,6,23,0.48),rgba(2,6,23,0.36)_45%,rgba(2,6,23,0.88))]" />
        <div className="absolute inset-x-0 top-0 h-40 bg-slate-950/34 dark:bg-slate-950/44" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.05, rotate: 3 }}
          className="relative h-36 w-36 overflow-hidden rounded-full border-[5px] border-white bg-white shadow-[0_18px_40px_rgba(15,23,42,0.25)] ring-1 ring-blue-900/10 transition-[filter] duration-500 dark:border-slate-100 dark:bg-slate-100 sm:h-44 sm:w-44 lg:h-52 lg:w-52"
        >
          <Image
            src="/images/emma-head.png"
            alt={t.portraitAlt}
            fill
            priority
            sizes="(max-width: 640px) 144px, (max-width: 1024px) 176px, 208px"
            className="object-cover object-center transition duration-500"
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 text-[clamp(2.7rem,8vw,5.6rem)] font-extrabold leading-[0.98] tracking-normal text-white drop-shadow-[0_5px_18px_rgba(0,0,0,0.46)]"
        >
          {t.name}
        </motion.h1>

        <div className="mt-4 flex min-h-[2.4rem] items-center justify-center overflow-hidden sm:min-h-[3rem]">
          <AnimatePresence mode="wait">
            <motion.p
              key={activeTagline}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="text-balance text-lg font-semibold text-blue-100 sm:text-2xl"
            >
              {activeTagline}
            </motion.p>
          </AnimatePresence>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="mt-3 max-w-2xl text-balance text-sm font-medium leading-relaxed text-slate-100/90 sm:text-base"
        >
          {t.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.58, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center"
        >
          <Button
            asChild
            size="lg"
            className="group h-12 rounded-full bg-blue-600 px-7 text-sm font-semibold text-white shadow-xl shadow-blue-950/30 transition-all hover:scale-105 hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400 sm:h-14 sm:text-base"
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
            className="group h-12 rounded-full border-white/30 bg-white/16 px-7 text-sm font-semibold text-white shadow-sm backdrop-blur transition-all hover:scale-105 hover:bg-white/24 dark:border-white/20 dark:bg-slate-950/56 dark:text-white dark:hover:bg-slate-900/80 sm:h-14 sm:text-base"
          >
            <Link
              href={locale === "fr" ? "/resume_fr.pdf" : "/resume.pdf"}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.ctaSecondary}
              <Download className="ml-2 h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mt-7 flex items-center gap-5 text-slate-100/85"
        >
          <Link
            href="https://github.com/adoumouangnamouemmanuel"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full p-2 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            aria-label={t.githubAria}
          >
            <Github className="h-5 w-5 sm:h-6 sm:w-6" />
          </Link>
          <span className="h-5 w-px bg-slate-100/45" />
          <Link
            href="https://www.linkedin.com/in/emmanueladoum/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full p-2 transition-colors hover:text-blue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            aria-label={t.linkedinAria}
          >
            <Linkedin className="h-5 w-5 sm:h-6 sm:w-6" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
