"use client";

import { Button } from "@/components/ui/button";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ClaudeLogo } from "@/components/icons/BrandLogos";
import { ArrowRight, Download, Github, Linkedin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type Locale = "en" | "fr";

const TAGLINE_INTERVAL_MS = 2600;

// Rendered as white silhouettes; raster logos with a white background are
// inverted and screen-blended so the background disappears.
const companyLogos = [
  { name: "MTN Ghana", src: "/images/logos/mtn-logo.svg", className: "h-7 sm:h-8" },
  { name: "Nestlé", src: "/images/logos/nestle-logo.jpg", className: "h-10 sm:h-10", raster: true },
  { name: "Affinity Africa", src: "/images/logos/affinity-logo.svg", className: "h-6 sm:h-7" },
  { name: "Revna Biosciences", src: "/images/logos/Revna-Logo.svg", className: "h-7 sm:h-8" },
];

export default function HeroSection({ locale = "en" }: { locale?: Locale }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.22]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.55, 1], [0, 0.15, 0.45]);
  const t = useMemo(
    () =>
      locale === "fr"
        ? {
            name: "Emmanuel Adoum",
            taglines: [
              "Ingénieur Logiciel",
              "Systèmes orientés données",
              "Architecture Haute Performance",
            ],
            description:
              "Je conçois des systèmes de risque, de données et d'IA fiables pour des environnements critiques.",
            badge: "Ambassadeur Claude",
            trustedBy: "Expérience chez",
            ctaPrimary: "Démarrer une conversation",
            ctaSecondary: "Télécharger le CV",
            githubAria: "GitHub",
            linkedinAria: "LinkedIn",
            portraitAlt: "Portrait d'Emmanuel Adoum",
          }
        : {
            name: "Emmanuel Adoum",
            taglines: [
              "Software Engineer",
              "Data-Intensive Systems",
              "High-Performance Architecture",
            ],
            description:
              "I build risk, data and AI systems that hold up in high-stakes environments.",
            badge: "Claude Ambassador",
            trustedBy: "Experience at",
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
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-slate-950 px-4 pb-10 pt-24 text-center text-white sm:px-6 md:pb-6 md:pt-24 lg:min-h-screen"
    >
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          style={{ scale: backgroundScale }}
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
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-slate-950 will-change-[opacity]"
        />
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
          className="relative"
        >
          {/* Slow rotating blue-to-Claude-orange halo */}
          <span
            aria-hidden
            className="hero-halo pointer-events-none absolute -inset-2 rounded-full opacity-80 blur-[2px]"
          />
          <motion.div
            whileHover={{ scale: 1.04, rotate: 3 }}
            className="relative h-44 w-44 overflow-hidden rounded-full border-[5px] border-white bg-white shadow-[0_18px_40px_rgba(15,23,42,0.35)] dark:border-slate-100 dark:bg-slate-100 sm:h-52 sm:w-52 lg:h-[min(15.5rem,27vh)] lg:w-[min(15.5rem,27vh)]"
          >
            <Image
              src="/images/emma.jpg"
              alt={t.portraitAlt}
              fill
              priority
              sizes="(max-width: 640px) 176px, (max-width: 1024px) 208px, 248px"
              className="object-cover object-center"
            />
          </motion.div>

          {/* Claude Ambassador seal on the portrait */}
          <Link
            href="#ambassador"
            aria-label={t.badge}
            className="group absolute -bottom-1 -right-1 flex items-center sm:bottom-1 sm:right-0"
          >
            <span className="grid h-12 w-12 place-items-center rounded-full border-[3px] border-white bg-[#d97757] text-white shadow-lg shadow-black/30 transition-transform group-hover:rotate-[20deg] group-hover:scale-110 sm:h-14 sm:w-14">
              <ClaudeLogo className="h-6 w-6 sm:h-7 sm:w-7" />
            </span>
            <span className="pointer-events-none absolute left-full ml-2 hidden whitespace-nowrap rounded-full bg-slate-950/85 px-3 py-1 text-xs font-semibold text-orange-100 opacity-0 shadow-lg ring-1 ring-white/10 backdrop-blur transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 sm:block">
              {t.badge}
            </span>
          </Link>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 text-[clamp(2.5rem,min(8vw,9vh),5.25rem)] font-bold leading-[0.95] tracking-tight text-white drop-shadow-[0_5px_18px_rgba(0,0,0,0.46)]"
        >
          {t.name}
        </motion.h1>

        <div className="mt-2 flex min-h-[2.8rem] items-center justify-center overflow-hidden sm:min-h-[3rem] md:mt-1 lg:mt-2">
          <AnimatePresence mode="wait">
            <motion.p
              key={activeTagline}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="text-balance text-[1.4rem] font-semibold text-blue-100 sm:text-2xl"
            >
              {activeTagline}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Description hidden for now
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="mt-3 max-w-xl text-balance text-base font-medium leading-relaxed text-slate-100/90 sm:text-lg"
        >
          {t.description}
        </motion.p>
        */}

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.58, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center"
        >
          <Button
            asChild
            size="lg"
            className="group h-14 rounded-full bg-blue-600 px-7 text-base font-semibold text-white shadow-xl shadow-blue-950/30 transition-all hover:scale-105 hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400 sm:h-12 sm:text-base"
          >
            <Link href="#contact">
              {t.ctaPrimary}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1 sm:h-4 sm:w-4" />
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="group h-14 rounded-full border-white/30 bg-white/16 px-7 text-base font-semibold text-white shadow-sm backdrop-blur transition-all hover:scale-105 hover:bg-white/24 hover:text-white dark:border-white/20 dark:bg-slate-950/56 dark:text-white dark:hover:bg-slate-900/80 sm:h-12 sm:text-base"
          >
            <Link
              href={locale === "fr" ? "/resume_fr.pdf" : "/resume.pdf"}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.ctaSecondary}
              <Download className="ml-2 h-5 w-5 transition-transform group-hover:-translate-y-0.5 sm:h-4 sm:w-4" />
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 flex items-center gap-5 text-slate-100/85 md:mt-3"
        >
          <Link
            href="https://github.com/adoumouangnamouemmanuel"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full p-2 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            aria-label={t.githubAria}
          >
            <Github className="h-6 w-6" />
          </Link>
          <span className="h-5 w-px bg-slate-100/45" />
          <Link
            href="https://www.linkedin.com/in/emmanueladoum/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full p-2 transition-colors hover:text-blue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            aria-label={t.linkedinAria}
          >
            <Linkedin className="h-6 w-6" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 flex w-full max-w-2xl flex-col items-center gap-3 md:mt-5"
        >
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-300/80">
            {t.trustedBy}
          </p>
          <ul className="grid w-full grid-cols-4 items-center gap-x-4 sm:gap-x-10">
            {companyLogos.map((logo) => (
              <li key={logo.name} className="flex h-10 items-center justify-center">
                <Image
                  src={logo.src}
                  alt={logo.name}
                  title={logo.name}
                  width={120}
                  height={40}
                  className={`w-auto max-w-full object-contain opacity-70 transition-opacity duration-300 hover:opacity-100 ${logo.className} ${
                    logo.raster ? "mix-blend-screen grayscale invert" : "brightness-0 invert"
                  }`}
                />
              </li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </section>
  );
}
