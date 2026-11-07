"use client";

import { projects, projectsFr } from "@/data/projects";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Check,
  Github,
  Layers,
  Lightbulb,
  Target,
  Trophy,
  Users,
  Wrench,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";

type Project = (typeof projectsFr)[number];
type Shelf = "product" | "data" | "systems" | "research";

const ease = [0.16, 1, 0.3, 1] as const;

// Same shelves and colours as the projects grid, keyed by slug
const shelfOf = (slug: string): Shelf => {
  const category = projects.find((p) => p.slug === slug)?.category ?? "";
  if (/Data|AI/.test(category)) return "data";
  if (/Algorithms|Systems/.test(category)) return "systems";
  if (/Research|Simulation/.test(category)) return "research";
  return "product";
};
const brand: Record<Shelf, string> = {
  product: "59 130 246",
  data: "16 185 129",
  systems: "139 92 246",
  research: "245 158 11",
};

const isLogoImage = (src: string) => src.endsWith("/logo.png");

function formatDate(date: string | undefined, fr: boolean) {
  if (!date) return null;
  const d = new Date(`${date}T00:00:00`);
  if (Number.isNaN(d.getTime())) return date;
  return new Intl.DateTimeFormat(fr ? "fr-FR" : "en-US", { month: "long", year: "numeric" }).format(d);
}

function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-8 sm:mb-10">
      <p className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
        <span aria-hidden className="h-2 w-2 rounded-full bg-[rgb(var(--brand))]" />
        {eyebrow}
      </p>
      <h2 className="mt-1.5 font-display text-2xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
        {title}
      </h2>
    </div>
  );
}

export default function ProjectDetailPage() {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const fr = !!pathname?.startsWith("/fr");
  const basePath = fr ? "/fr" : "";
  const slug = params?.slug as string | undefined;

  const collection: Project[] = fr ? projectsFr : projects;
  const project = useMemo(() => (slug ? collection.find((p) => p.slug === slug) : undefined), [slug, collection]);
  const index = collection.findIndex((p) => p.slug === slug);
  const prev = index > 0 ? collection[index - 1] : undefined;
  const next = index >= 0 && index < collection.length - 1 ? collection[index + 1] : undefined;

  const t = fr
    ? {
        back: "Projets",
        live: "Voir en ligne",
        code: "Code",
        nav: { overview: "Aperçu", features: "Fonctionnalités", process: "Méthode", challenges: "Défis", gallery: "Galerie" },
        client: "Pour",
        stackCount: (n: number) => `${n} technologies`,
        overviewEyebrow: "Aperçu",
        overviewTitle: "Le projet en bref",
        objective: "L'objectif",
        outcome: "Le résultat",
        stack: "Stack technique",
        featuresEyebrow: "Fonctionnalités",
        featuresTitle: "Ce qu'il fait",
        processEyebrow: "Méthode",
        processTitle: "Comment je l'ai construit",
        challengesEyebrow: "Défis",
        challengesTitle: "Problèmes rencontrés, solutions apportées",
        challenge: "Défi",
        solution: "Solution",
        galleryEyebrow: "Galerie",
        galleryTitle: "En images",
        prev: "Précédent",
        next: "Suivant",
        all: "Voir tous les projets",
        close: "Fermer",
      }
    : {
        back: "Projects",
        live: "View live",
        code: "Code",
        nav: { overview: "Overview", features: "Features", process: "Process", challenges: "Challenges", gallery: "Gallery" },
        client: "For",
        stackCount: (n: number) => `${n} technologies`,
        overviewEyebrow: "Overview",
        overviewTitle: "The project at a glance",
        objective: "The objective",
        outcome: "The outcome",
        stack: "Tech stack",
        featuresEyebrow: "Features",
        featuresTitle: "What it does",
        processEyebrow: "Process",
        processTitle: "How I built it",
        challengesEyebrow: "Challenges",
        challengesTitle: "Problems faced, and how I solved them",
        challenge: "Challenge",
        solution: "Solution",
        galleryEyebrow: "Gallery",
        galleryTitle: "In pictures",
        prev: "Previous",
        next: "Next",
        all: "View all projects",
        close: "Close",
      };

  useEffect(() => {
    if (slug && !project) router.push(`${basePath}/projects`);
  }, [slug, project, router, basePath]);

  const features = project?.keyFeatures ?? [];
  const steps = project?.developmentProcess ?? [];
  const challenges = project?.challenges ?? [];
  const gallery = (project?.gallery ?? []) as { image: string; title: string }[];

  const sections = [
    { id: "overview", label: t.nav.overview, show: true },
    { id: "features", label: t.nav.features, show: features.length > 0 },
    { id: "process", label: t.nav.process, show: steps.length > 0 },
    { id: "challenges", label: t.nav.challenges, show: challenges.length > 0 },
    { id: "gallery", label: t.nav.gallery, show: gallery.length > 0 },
  ].filter((s) => s.show);

  // Scroll spy for the section tabs
  const [active, setActive] = useState("overview");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project?.slug, sections.length]);

  // Progress line for the build process
  const processRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: processRef, offset: ["start 70%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  // Gallery lightbox
  const [lightbox, setLightbox] = useState<number | null>(null);
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setLightbox(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  if (!project) return null;

  const shelf = shelfOf(project.slug);
  const style = { "--brand": brand[shelf] } as CSSProperties;
  // A logo makes a weak hero: prefer the first real screenshot when there is one
  const cover = project.image || "/images/projects/portfolio-cover.png";
  const image = isLogoImage(cover) && gallery[0] ? gallery[0].image : cover;
  const logo = isLogoImage(image);
  const demo = project.demo && project.demo !== project.github ? project.demo : null;
  const date = formatDate(project.date, fr);

  return (
    <main style={style} className="relative min-h-screen overflow-x-clip bg-[#f5f5f7] text-slate-900 selection:bg-blue-200 dark:bg-slate-950 dark:text-white dark:selection:bg-blue-900/50">
      {/* Category-coloured wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[720px]"
        style={{ background: "radial-gradient(55% 55% at 15% 0%, rgb(var(--brand) / 0.20), transparent 70%), radial-gradient(45% 50% at 90% 10%, rgb(99 102 241 / 0.12), transparent 70%)" }}
      />

      {/* Top bar */}
      <div className="sticky top-0 z-50 border-b border-slate-200/60 bg-[#f5f5f7]/75 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <Link
            href={`${basePath}/projects`}
            className="group inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            {t.back}
          </Link>

          <nav className="hidden items-center gap-1 rounded-full bg-white/70 p-1 ring-1 ring-slate-200/80 dark:bg-white/5 dark:ring-white/10 md:flex">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`relative rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                  active === s.id ? "text-white dark:text-slate-900" : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                {active === s.id && (
                  <motion.span layoutId="project-tab" className="absolute inset-0 rounded-full bg-slate-900 dark:bg-white" transition={{ type: "spring", stiffness: 420, damping: 34 }} />
                )}
                <span className="relative">{s.label}</span>
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="grid h-9 w-9 place-items-center rounded-full text-slate-700 transition-colors hover:bg-slate-200/70 dark:text-slate-300 dark:hover:bg-white/10"
              >
                <Github className="h-[18px] w-[18px]" />
              </a>
            )}
            {(demo || project.github) && (
              <a
                href={demo ?? project.github ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
              >
                {demo ? t.live : t.code}
                <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 pb-24 sm:px-6 lg:px-8">
        {/* ---------- Hero ---------- */}
        <header className="pb-16 pt-12 sm:pt-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }} className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/80 dark:bg-white/5 dark:text-slate-300 dark:ring-white/10">
              <span aria-hidden className="h-2 w-2 rounded-full bg-[rgb(var(--brand))]" />
              {project.category}
            </span>
            <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem]">
              {project.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-600 dark:text-slate-400">{project.description}</p>

            <ul className="mt-7 flex flex-wrap gap-2 text-sm">
              {date && (
                <li className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 font-medium text-slate-700 ring-1 ring-slate-200/80 dark:bg-white/5 dark:text-slate-300 dark:ring-white/10">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  {date}
                </li>
              )}
              {project.client && (
                <li className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 font-medium text-slate-700 ring-1 ring-slate-200/80 dark:bg-white/5 dark:text-slate-300 dark:ring-white/10">
                  <Users className="h-4 w-4 text-slate-400" />
                  {t.client} {project.client}
                </li>
              )}
              <li className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 font-medium text-slate-700 ring-1 ring-slate-200/80 dark:bg-white/5 dark:text-slate-300 dark:ring-white/10">
                <Layers className="h-4 w-4 text-slate-400" />
                {t.stackCount(project.technologies.length)}
              </li>
            </ul>

            {(demo || project.github) && (
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {demo && (
                  <a
                    href={demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-blue-600 px-6 text-base font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:scale-[1.02] hover:bg-blue-500"
                  >
                    {t.live}
                    <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-base font-semibold text-slate-800 ring-1 ring-slate-200 transition-colors hover:bg-slate-100 dark:bg-white/5 dark:text-slate-100 dark:ring-white/15 dark:hover:bg-white/10"
                  >
                    <Github className="h-5 w-5" />
                    GitHub
                  </a>
                )}
              </div>
            )}
          </motion.div>

          {/* Framed cover, like a product shot */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15, ease }}
            className="relative mt-12 sm:mt-14"
          >
            <div aria-hidden className="absolute -inset-x-6 -bottom-10 top-10 rounded-[40px] bg-[rgb(var(--brand)/0.18)] blur-3xl" />
            <div className="relative overflow-hidden rounded-[24px] bg-white p-2 shadow-[0_30px_80px_rgba(15,23,42,0.18)] ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-white/10 sm:rounded-[32px] sm:p-3">
              <div className={`relative aspect-[16/9] overflow-hidden rounded-[18px] sm:rounded-[24px] ${logo ? "bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900" : "bg-slate-100 dark:bg-slate-800"}`}>
                <Image src={image} alt={project.title} fill priority sizes="(max-width: 1200px) 100vw, 1140px" className={logo ? "object-contain p-16" : "object-cover object-left-top"} />
              </div>
            </div>
          </motion.div>
        </header>

        {/* ---------- Overview ---------- */}
        <section id="overview" className="scroll-mt-24 border-t border-slate-200/80 pt-16 dark:border-white/10">
          <Reveal>
            <SectionHeading eyebrow={t.overviewEyebrow} title={t.overviewTitle} />
          </Reveal>
          <div className="grid gap-5 lg:grid-cols-3">
            {project.goal && (
              <Reveal>
                <div className="relative h-full overflow-hidden rounded-[28px] bg-white p-7 ring-1 ring-slate-200/80 dark:bg-slate-900/80 dark:ring-white/10 sm:p-8">
                  <span aria-hidden className="absolute inset-y-0 left-0 w-1 bg-[rgb(var(--brand))]" />
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <Target className="h-5 w-5" />
                  </span>
                  <p className="mt-5 text-sm font-semibold text-slate-500 dark:text-slate-400">{t.objective}</p>
                  <p className="mt-2 text-[15px] leading-relaxed text-slate-700 dark:text-slate-300 sm:text-base">{project.goal}</p>
                </div>
              </Reveal>
            )}
            {project.outcome && (
              <Reveal delay={0.06}>
                <div className="relative h-full overflow-hidden rounded-[28px] p-7 text-white sm:p-8" style={{ background: "linear-gradient(135deg, rgb(37 99 235), rgb(79 70 229))" }}>
                  <span aria-hidden className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[rgb(var(--brand)/0.45)] blur-2xl" />
                  <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-white/15">
                    <Trophy className="h-5 w-5" />
                  </span>
                  <p className="relative mt-5 text-sm font-semibold text-white/75">{t.outcome}</p>
                  <p className="relative mt-2 text-[15px] font-medium leading-relaxed sm:text-base">{project.outcome}</p>
                </div>
              </Reveal>
            )}
            <Reveal delay={0.12}>
              <div className="h-full rounded-[28px] bg-slate-900 p-7 text-white dark:bg-white/[0.06] dark:ring-1 dark:ring-white/10 sm:p-8">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10">
                  <Layers className="h-5 w-5" />
                </span>
                <p className="mt-5 text-sm font-semibold text-slate-400">{t.stack}</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <li key={tech} className="rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium text-white ring-1 ring-white/10">
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ---------- Features ---------- */}
        {features.length > 0 && (
          <section id="features" className="scroll-mt-24 pt-24">
            <Reveal>
              <SectionHeading eyebrow={t.featuresEyebrow} title={t.featuresTitle} />
            </Reveal>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, i) => (
                <Reveal key={feature} delay={0.04 * (i % 3)}>
                  <li className="group flex h-full gap-4 rounded-[24px] bg-white p-5 ring-1 ring-slate-200/80 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(15,23,42,0.08)] dark:bg-slate-900/80 dark:ring-white/10 sm:p-6">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[rgb(var(--brand)/0.12)] text-xs font-bold tabular-nums text-slate-700 transition-colors group-hover:bg-[rgb(var(--brand))] group-hover:text-white dark:text-slate-200">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="pt-1.5 text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">{feature}</span>
                  </li>
                </Reveal>
              ))}
            </ul>
          </section>
        )}

        {/* ---------- Process as a story ---------- */}
        {steps.length > 0 && (
          <section id="process" className="scroll-mt-24 pt-24">
            <div className="grid gap-10 lg:grid-cols-[280px_1fr] lg:gap-16">
              <Reveal className="lg:sticky lg:top-28 lg:self-start">
                <SectionHeading eyebrow={t.processEyebrow} title={t.processTitle} />
              </Reveal>
              <div ref={processRef} className="relative">
                <div aria-hidden className="absolute bottom-4 left-[19px] top-4 w-px bg-slate-200 dark:bg-white/10" />
                <motion.div
                  aria-hidden
                  style={{ scaleY: progress }}
                  className="absolute bottom-4 left-[19px] top-4 w-px origin-top bg-gradient-to-b from-[rgb(var(--brand))] via-blue-500 to-emerald-500"
                />
                <ol className="space-y-5">
                  {steps.map((step, i) => (
                    <Reveal key={step} delay={0.04 * i}>
                      <li className="relative flex gap-5">
                        <span className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-xs font-bold tabular-nums text-slate-700 ring-4 ring-[#f5f5f7] dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-950">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div className="flex-1 rounded-[22px] bg-white p-5 ring-1 ring-slate-200/80 dark:bg-slate-900/80 dark:ring-white/10 sm:p-6">
                          <p className="text-[15px] leading-relaxed text-slate-700 dark:text-slate-300 sm:text-base">{step}</p>
                        </div>
                      </li>
                    </Reveal>
                  ))}
                </ol>
              </div>
            </div>
          </section>
        )}

        {/* ---------- Challenges -> solutions ---------- */}
        {challenges.length > 0 && (
          <section id="challenges" className="scroll-mt-24 pt-24">
            <Reveal>
              <SectionHeading eyebrow={t.challengesEyebrow} title={t.challengesTitle} />
            </Reveal>
            <div className="space-y-4">
              {challenges.map((challenge, i) => {
                const solution = project.solutions?.[i];
                return (
                  <Reveal key={challenge} delay={0.04 * i}>
                    <div className="grid overflow-hidden rounded-[28px] ring-1 ring-slate-200/80 dark:ring-white/10 md:grid-cols-2">
                      <div className="bg-white p-6 dark:bg-slate-900/80 sm:p-7">
                        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-rose-600 dark:text-rose-400">
                          <Wrench className="h-4 w-4" />
                          {t.challenge} {String(i + 1).padStart(2, "0")}
                        </p>
                        <p className="mt-3 text-[15px] leading-relaxed text-slate-700 dark:text-slate-300 sm:text-base">{challenge}</p>
                      </div>
                      {solution && (
                        <div className="relative bg-slate-900 p-6 text-white dark:bg-white/[0.06] sm:p-7">
                          <span aria-hidden className="absolute left-0 top-1/2 hidden h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-slate-900 shadow ring-4 ring-[#f5f5f7] dark:ring-slate-950 md:grid">
                            <ArrowRight className="h-4 w-4" />
                          </span>
                          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-400">
                            <Lightbulb className="h-4 w-4" />
                            {t.solution}
                          </p>
                          <p className="mt-3 text-[15px] leading-relaxed text-slate-200 sm:text-base">{solution}</p>
                        </div>
                      )}
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </section>
        )}

        {/* ---------- Gallery ---------- */}
        {gallery.length > 0 && (
          <section id="gallery" className="scroll-mt-24 pt-24">
            <Reveal>
              <SectionHeading eyebrow={t.galleryEyebrow} title={t.galleryTitle} />
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((item, i) => (
                <Reveal key={item.image} delay={0.05 * i} className={gallery.length >= 3 && i === 0 ? "sm:col-span-2 lg:col-span-2 lg:row-span-2" : ""}>
                  <button
                    type="button"
                    onClick={() => setLightbox(i)}
                    className="group relative block h-full w-full overflow-hidden rounded-[24px] bg-white p-2 text-left ring-1 ring-slate-200/80 transition-shadow hover:shadow-[0_24px_50px_rgba(15,23,42,0.12)] dark:bg-slate-900/80 dark:ring-white/10"
                  >
                    <div className={`relative overflow-hidden rounded-[18px] bg-slate-100 dark:bg-slate-800 ${gallery.length >= 3 && i === 0 ? "aspect-[16/10] lg:aspect-auto lg:h-[calc(100%-2.5rem)]" : "aspect-[16/10]"}`}>
                      <Image src={item.image} alt={item.title} fill sizes="(max-width: 640px) 100vw, 560px" className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]" />
                    </div>
                    <p className="px-2 pb-1 pt-3 text-sm font-medium text-slate-700 dark:text-slate-300">{item.title}</p>
                  </button>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* ---------- Previous / next ---------- */}
        <section className="pt-24">
          <div className="grid gap-4 sm:grid-cols-2">
            {[prev, next].map((item, i) =>
              item ? (
                <Link
                  key={item.slug}
                  href={`${basePath}/projects/${item.slug}`}
                  className={`group flex items-center gap-4 rounded-[28px] bg-white p-3 ring-1 ring-slate-200/80 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(15,23,42,0.10)] dark:bg-slate-900/80 dark:ring-white/10 ${
                    i === 1 ? "sm:flex-row-reverse sm:text-right" : ""
                  }`}
                >
                  <span className="relative h-20 w-28 shrink-0 overflow-hidden rounded-[18px] bg-slate-100 dark:bg-slate-800">
                    <Image
                      src={item.image || "/images/projects/portfolio-cover.png"}
                      alt=""
                      fill
                      sizes="112px"
                      className={isLogoImage(item.image || "") ? "object-contain p-3" : "object-cover"}
                    />
                  </span>
                  <div className="min-w-0 flex-1 pr-3">
                    <p className={`flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400 ${i === 1 ? "sm:justify-end" : ""}`}>
                      {i === 0 && <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />}
                      {i === 0 ? t.prev : t.next}
                      {i === 1 && <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />}
                    </p>
                    <p className="mt-1 truncate font-semibold text-slate-900 dark:text-white">{item.title}</p>
                    <p className="truncate text-sm text-slate-500 dark:text-slate-400">{item.category}</p>
                  </div>
                </Link>
              ) : (
                <div key={i} className="hidden sm:block" />
              ),
            )}
          </div>
          <div className="mt-10 text-center">
            <Link
              href={`${basePath}/projects`}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            >
              {t.all}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>

      {/* Lightbox */}
      {lightbox !== null && gallery[lightbox] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={gallery[lightbox].title}
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-[60] grid place-items-center bg-slate-950/85 p-4 backdrop-blur-sm"
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            aria-label={t.close}
            className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
          <figure className="w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-slate-900">
              <Image src={gallery[lightbox].image} alt={gallery[lightbox].title} fill sizes="100vw" className="object-contain" />
            </div>
            <figcaption className="mt-3 text-center text-sm font-medium text-white/80">{gallery[lightbox].title}</figcaption>
          </figure>
        </div>
      )}
    </main>
  );
}
