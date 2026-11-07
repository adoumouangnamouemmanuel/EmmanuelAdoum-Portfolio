"use client";

import { experiences, experiencesFr } from "@/data/experiences";
import { projects, projectsFr } from "@/data/projects";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Check,
  Clock,
  Download,
  Layers,
  MapPin,
  Quote,
  Trophy,
  TrendingUp,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

// Decorative brand colour per company (RGB), used for washes and lines only,
// never for body text, so contrast stays safe in both themes.
const brand: Record<string, string> = {
  "project-manager-revna-biosciences": "59 110 200",
  "backend-intern-affinity-africa": "249 115 22",
  "quantitative-risk-mtn-ghana": "234 179 8",
  "record-to-report-nestle": "168 120 72",
};

// "Aug 2026" / "Août 2026" / "Present" -> month index
const MONTHS: Record<string, number> = {
  jan: 0, janv: 0, feb: 1, fev: 1, févr: 1, fevr: 1, mar: 2, mars: 2, apr: 3, avr: 3, may: 4, mai: 4,
  jun: 5, juin: 5, jul: 6, juil: 6, aug: 7, aout: 7, août: 7, sep: 8, sept: 8, oct: 9, nov: 10, dec: 11, déc: 11,
};
function toMonth(text: string): number | null {
  if (/present|actuel|présent/i.test(text)) {
    const now = new Date();
    return now.getFullYear() * 12 + now.getMonth();
  }
  const m = text.toLowerCase().replace(/\./g, "").match(/([a-zéû]+)\s+(\d{4})/);
  if (!m) return null;
  const key = Object.keys(MONTHS).find((k) => m[1].startsWith(k) && m[1].length <= k.length + 2);
  return key === undefined ? null : Number(m[2]) * 12 + MONTHS[key];
}
function duration(start: string, end: string, fr: boolean) {
  const a = toMonth(start);
  const b = toMonth(end);
  if (a === null || b === null || b < a) return null;
  const n = b - a + 1;
  return fr ? `${n} mois` : `${n} month${n > 1 ? "s" : ""}`;
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

export default function ExperienceDetailPage() {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const fr = !!pathname?.startsWith("/fr");
  const basePath = fr ? "/fr" : "";
  const slug = params?.slug as string | undefined;

  const collection = fr ? experiencesFr : experiences;
  const experience = useMemo(() => (slug ? collection.find((e) => e.slug === slug) : undefined), [slug, collection]);
  const index = collection.findIndex((e) => e.slug === slug);
  const prev = index > 0 ? collection[index - 1] : undefined;
  const next = index >= 0 && index < collection.length - 1 ? collection[index + 1] : undefined;

  const projectCollection = fr ? projectsFr : projects;
  const related = (experience?.relatedProjects ?? [])
    .map((s) => projectCollection.find((p) => p.slug === s))
    .filter((p): p is (typeof projectCollection)[number] => Boolean(p));

  // English case study is used as a fallback when a translation is missing
  const caseStudy =
    (experience as { caseStudy?: Record<string, string> } | undefined)?.caseStudy ??
    (experiences.find((e) => e.slug === slug) as { caseStudy?: Record<string, string> } | undefined)?.caseStudy;

  const t = fr
    ? {
        back: "Parcours",
        resume: "CV",
        website: "Site web",
        present: "Présent",
        nav: { overview: "Aperçu", story: "Étude de cas", work: "Contributions", related: "Projets" },
        overviewEyebrow: "Aperçu",
        overviewTitle: "Le rôle en bref",
        company: "L'entreprise",
        stack: "Stack technique",
        storyEyebrow: "Étude de cas",
        storyTitle: "Du problème à l'impact",
        steps: { problem: "Le contexte", procedures: "L'architecture", challenges: "Les défis", solution: "L'impact" },
        workEyebrow: "Contributions",
        workTitle: "Ce que j'ai fait et ce que ça a donné",
        responsibilities: "Responsabilités",
        achievements: "Réalisations",
        relatedEyebrow: "Projets associés",
        relatedTitle: "Construit en parallèle",
        prev: "Précédent",
        next: "Suivant",
        all: "Voir tout le parcours",
      }
    : {
        back: "Journey",
        resume: "Resume",
        website: "Website",
        present: "Present",
        nav: { overview: "Overview", story: "Case study", work: "Contributions", related: "Projects" },
        overviewEyebrow: "Overview",
        overviewTitle: "The role at a glance",
        company: "The company",
        stack: "Tech stack",
        storyEyebrow: "Case study",
        storyTitle: "From problem to impact",
        steps: { problem: "The context", procedures: "The architecture", challenges: "The challenges", solution: "The impact" },
        workEyebrow: "Contributions",
        workTitle: "What I did, and what came of it",
        responsibilities: "Responsibilities",
        achievements: "Achievements",
        relatedEyebrow: "Related projects",
        relatedTitle: "Built alongside",
        prev: "Previous",
        next: "Next",
        all: "View the full journey",
      };

  useEffect(() => {
    if (slug && !experience) router.push(`${basePath}/#journey`);
  }, [slug, experience, router, basePath]);

  // In-page navigation with scroll spy
  const sections = [
    { id: "overview", label: t.nav.overview, show: true },
    { id: "story", label: t.nav.story, show: !!caseStudy },
    { id: "work", label: t.nav.work, show: !!(experience?.responsibilities?.length || experience?.achievements?.length) },
    { id: "related", label: t.nav.related, show: related.length > 0 },
  ].filter((s) => s.show);
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
  }, [experience?.slug, sections.length]);

  // Progress line for the case-study story
  const storyRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: storyRef, offset: ["start 70%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  if (!experience) return null;

  const end = /present/i.test(experience.endDate) ? t.present : experience.endDate;
  const length = duration(experience.startDate, experience.endDate, fr);
  const style = { "--brand": brand[experience.slug] ?? "59 130 246" } as CSSProperties;
  const domain = experience.website?.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

  const steps = caseStudy
    ? ([
        { key: "problem", icon: <AlertTriangle className="h-4 w-4" />, tone: "bg-rose-500/10 text-rose-600 dark:text-rose-400" },
        { key: "procedures", icon: <Layers className="h-4 w-4" />, tone: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
        { key: "challenges", icon: <Zap className="h-4 w-4" />, tone: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
        { key: "solution", icon: <TrendingUp className="h-4 w-4" />, tone: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
      ] as const).filter((s) => caseStudy[s.key])
    : [];

  return (
    <main style={style} className="relative min-h-screen overflow-x-clip bg-[#f5f5f7] text-slate-900 selection:bg-blue-200 dark:bg-slate-950 dark:text-white dark:selection:bg-blue-900/50">
      {/* Brand-coloured wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[640px] opacity-80"
        style={{ background: "radial-gradient(55% 60% at 15% 0%, rgb(var(--brand) / 0.20), transparent 70%), radial-gradient(45% 50% at 90% 5%, rgb(99 102 241 / 0.12), transparent 70%)" }}
      />

      {/* Top bar */}
      <div className="sticky top-0 z-50 border-b border-slate-200/60 bg-[#f5f5f7]/75 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <Link
            href={`${basePath}/#journey`}
            className="group inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            {t.back}
          </Link>

          {/* Section tabs (desktop) */}
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
                  <motion.span layoutId="exp-tab" className="absolute inset-0 rounded-full bg-slate-900 dark:bg-white" transition={{ type: "spring", stiffness: 420, damping: 34 }} />
                )}
                <span className="relative">{s.label}</span>
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={fr ? "/resume_fr.pdf" : "/resume.pdf"}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200/70 dark:text-slate-300 dark:hover:bg-white/10 sm:inline-flex"
            >
              <Download className="h-4 w-4" />
              {t.resume}
            </a>
            {experience.website && (
              <a
                href={experience.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
              >
                {t.website}
                <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 pb-24 sm:px-6 lg:px-8">
        {/* ---------- Hero ---------- */}
        <header className="grid gap-10 pb-16 pt-12 sm:pt-16 lg:grid-cols-[1.15fr_1fr] lg:items-end lg:gap-14">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }}>
            <div className="flex items-center gap-4">
              {experience.logo && (
                <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white p-2.5 shadow-[0_8px_30px_rgb(var(--brand)/0.25)] ring-1 ring-slate-200/80 dark:ring-white/10">
                  <span className="relative h-full w-full">
                    <Image src={experience.logo} alt={`${experience.company} logo`} fill sizes="64px" className="object-contain" />
                  </span>
                </span>
              )}
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">{experience.company}</p>
                {domain && experience.website && (
                  <a href={experience.website} target="_blank" rel="noopener noreferrer" className="text-sm text-slate-500 hover:text-slate-900 hover:underline dark:text-slate-400 dark:hover:text-white">
                    {domain}
                  </a>
                )}
              </div>
            </div>

            <h1 className="mt-8 font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem]">
              {experience.role}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">{experience.description}</p>

            <ul className="mt-7 flex flex-wrap gap-2 text-sm">
              <li className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 font-medium text-slate-700 ring-1 ring-slate-200/80 dark:bg-white/5 dark:text-slate-300 dark:ring-white/10">
                <Calendar className="h-4 w-4 text-slate-400" />
                {experience.startDate} – {end}
              </li>
              {length && (
                <li className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 font-medium text-slate-700 ring-1 ring-slate-200/80 dark:bg-white/5 dark:text-slate-300 dark:ring-white/10">
                  <Clock className="h-4 w-4 text-slate-400" />
                  {length}
                </li>
              )}
              <li className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 font-medium text-slate-700 ring-1 ring-slate-200/80 dark:bg-white/5 dark:text-slate-300 dark:ring-white/10">
                <MapPin className="h-4 w-4 text-slate-400" />
                {experience.location}
              </li>
            </ul>
          </motion.div>

          {/* Snapshot: impact numbers as a small bento */}
          {experience.highlights && experience.highlights.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12, ease }}
              className="grid grid-cols-2 gap-3"
            >
              {experience.highlights.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`group relative overflow-hidden rounded-3xl bg-white p-5 ring-1 ring-slate-200/80 transition-transform duration-500 hover:-translate-y-0.5 dark:bg-slate-900/80 dark:ring-white/10 sm:p-6 ${
                    experience.highlights.length === 3 && i === 0 ? "col-span-2" : ""
                  }`}
                >
                  <span aria-hidden className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-[rgb(var(--brand)/0.14)] blur-xl transition-transform duration-700 group-hover:scale-150" />
                  <p className="relative font-display text-3xl font-semibold tracking-tight tabular-nums sm:text-[2.1rem]">{stat.value}</p>
                  <p className="relative mt-2 text-[13px] leading-snug text-slate-600 dark:text-slate-400">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          )}
        </header>

        {/* ---------- Overview ---------- */}
        <section id="overview" className="scroll-mt-24 border-t border-slate-200/80 pt-16 dark:border-white/10">
          <Reveal>
            <SectionHeading eyebrow={t.overviewEyebrow} title={t.overviewTitle} />
          </Reveal>
          <div className="grid gap-5 lg:grid-cols-3">
            {experience.companyContext && (
              <Reveal className="lg:col-span-2">
                <div className="relative h-full overflow-hidden rounded-[28px] bg-white p-7 ring-1 ring-slate-200/80 dark:bg-slate-900/80 dark:ring-white/10 sm:p-9">
                  <span aria-hidden className="absolute inset-y-0 left-0 w-1 bg-[rgb(var(--brand))]" />
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{t.company}</p>
                  <p className="mt-3 text-lg leading-relaxed text-slate-800 dark:text-slate-200 sm:text-xl">{experience.companyContext}</p>
                  {experience.website && (
                    <a
                      href={experience.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group mt-6 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline hover:underline-offset-4 dark:text-blue-400"
                    >
                      {domain}
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                  )}
                </div>
              </Reveal>
            )}
            {experience.technologies && experience.technologies.length > 0 && (
              <Reveal delay={0.08} className={experience.companyContext ? "" : "lg:col-span-3"}>
                <div className="h-full rounded-[28px] bg-slate-900 p-7 text-white dark:bg-white/[0.06] dark:ring-1 dark:ring-white/10 sm:p-9">
                  <p className="text-sm font-semibold text-slate-400">{t.stack}</p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {experience.technologies.map((tech) => (
                      <li key={tech} className="rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium text-white ring-1 ring-white/10">
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )}
          </div>
        </section>

        {/* ---------- Case study as a story ---------- */}
        {caseStudy && steps.length > 0 && (
          <section id="story" className="scroll-mt-24 pt-24">
            <div className="grid gap-10 lg:grid-cols-[280px_1fr] lg:gap-16">
              <Reveal className="lg:sticky lg:top-28 lg:self-start">
                <SectionHeading eyebrow={t.storyEyebrow} title={t.storyTitle} />
                <ol className="hidden space-y-2 lg:block">
                  {steps.map((s, i) => (
                    <li key={s.key} className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                      <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-xs font-semibold text-slate-700 ring-1 ring-slate-200 dark:bg-white/10 dark:text-slate-200 dark:ring-white/10">
                        {i + 1}
                      </span>
                      {t.steps[s.key]}
                    </li>
                  ))}
                </ol>
              </Reveal>

              <div ref={storyRef} className="relative">
                {/* Rail + scroll-driven progress */}
                <div aria-hidden className="absolute bottom-4 left-[19px] top-4 w-px bg-slate-200 dark:bg-white/10" />
                <motion.div
                  aria-hidden
                  style={{ scaleY: progress }}
                  className="absolute bottom-4 left-[19px] top-4 w-px origin-top bg-gradient-to-b from-[rgb(var(--brand))] via-blue-500 to-emerald-500"
                />
                <ol className="space-y-6">
                  {steps.map((s, i) => (
                    <Reveal key={s.key} delay={0.05 * i}>
                      <li className="relative flex gap-5">
                        <span className={`relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white ring-4 ring-[#f5f5f7] dark:bg-slate-900 dark:ring-slate-950 ${s.tone}`}>
                          {s.icon}
                        </span>
                        <div className="flex-1 rounded-[24px] bg-white p-6 ring-1 ring-slate-200/80 transition-shadow duration-500 hover:shadow-[0_20px_50px_rgba(15,23,42,0.08)] dark:bg-slate-900/80 dark:ring-white/10 sm:p-7">
                          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                            {String(i + 1).padStart(2, "0")} · {t.steps[s.key]}
                          </p>
                          <p className="mt-3 text-[15px] leading-relaxed text-slate-700 dark:text-slate-300 sm:text-base">{caseStudy[s.key]}</p>
                        </div>
                      </li>
                    </Reveal>
                  ))}
                </ol>
              </div>
            </div>
          </section>
        )}

        {/* ---------- Contributions ---------- */}
        {Boolean(experience.responsibilities?.length || experience.achievements?.length) && (
          <section id="work" className="scroll-mt-24 pt-24">
            <Reveal>
              <SectionHeading eyebrow={t.workEyebrow} title={t.workTitle} />
            </Reveal>
            <div className="grid gap-5 lg:grid-cols-5">
              {experience.responsibilities && experience.responsibilities.length > 0 && (
                <Reveal className="lg:col-span-3">
                  <div className="h-full rounded-[28px] bg-white p-7 ring-1 ring-slate-200/80 dark:bg-slate-900/80 dark:ring-white/10 sm:p-9">
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{t.responsibilities}</p>
                    <ul className="mt-5 divide-y divide-slate-100 dark:divide-white/5">
                      {experience.responsibilities.map((item) => (
                        <li key={item} className="flex gap-3 py-3.5 first:pt-0 last:pb-0">
                          <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                            <Check className="h-3 w-3" strokeWidth={3} />
                          </span>
                          <span className="text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              )}
              {experience.achievements && experience.achievements.length > 0 && (
                <Reveal delay={0.08} className="lg:col-span-2">
                  <div className="flex h-full flex-col gap-4">
                    <p className="px-1 text-sm font-semibold text-slate-500 dark:text-slate-400 lg:hidden">{t.achievements}</p>
                    {experience.achievements.map((item, i) => (
                      <div
                        key={item}
                        className="relative flex-1 overflow-hidden rounded-[28px] p-6 text-white sm:p-7"
                        style={{ background: i % 2 === 0 ? "linear-gradient(135deg, rgb(15 23 42), rgb(30 41 59))" : "linear-gradient(135deg, rgb(37 99 235), rgb(79 70 229))" }}
                      >
                        <span aria-hidden className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[rgb(var(--brand)/0.35)] blur-2xl" />
                        <Trophy className="relative h-5 w-5 text-white/70" />
                        <p className="relative mt-4 text-[15px] font-medium leading-relaxed sm:text-base">{item}</p>
                      </div>
                    ))}
                  </div>
                </Reveal>
              )}
            </div>
          </section>
        )}

        {/* Gallery - Commented out for now as per user request */}
        {/*
        {experience.gallery && experience.gallery.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-24 sm:mb-32"
          >
            <h2 className={sectionLabel}>{t.gallery}</h2>
            <div
              className={`grid grid-cols-1 gap-4 sm:gap-6 -mx-6 sm:-mx-12 lg:-mx-24 xl:-mx-32 ${
                experience.gallery.length === 2
                  ? "lg:grid-cols-2"
                  : "lg:grid-cols-3"
              }`}
            >
              {experience.gallery.map((item, index) => {
                const isLead = experience.gallery.length >= 3 && index === 0;
                const aspect =
                  experience.gallery.length === 2
                    ? "aspect-[4/3]"
                    : isLead
                      ? "aspect-video lg:aspect-auto"
                      : "aspect-video lg:aspect-square";
                const span = isLead
                  ? "lg:col-span-2 lg:row-span-2"
                  : "";
                const sizes = isLead
                  ? "(max-width: 1024px) 100vw, 66vw"
                  : "(max-width: 1024px) 100vw, 33vw";
                return (
                  <div
                    key={index}
                    className={`group relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 ${aspect} ${span}`}
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes={sizes}
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/10 to-transparent" />
                    <span className="absolute bottom-4 left-5 right-5 text-[11px] sm:text-sm font-bold tracking-widest uppercase text-white drop-shadow-md">
                      {item.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
        */}

        {/* Recommendation - Commented out for now as per user request */}
        {/*
        {experience.recommendation && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-24 sm:mb-32"
          >
            <h2 className={sectionLabel}>{t.recommendation}</h2>
            <figure className="relative overflow-hidden p-8 sm:p-12 rounded-[2rem] bg-slate-900 dark:bg-slate-900 border border-slate-800 shadow-xl">
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/20 blur-3xl rounded-full" />
              <Quote className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500/60 mb-8" />
              <blockquote className="text-lg sm:text-2xl font-light text-slate-100 leading-relaxed mb-10">
                &ldquo;{experience.recommendation.quote}&rdquo;
              </blockquote>
              <figcaption className="flex items-center gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm sm:text-base shrink-0">
                  {initials(experience.recommendation.author)}
                </div>
                <div>
                  <p className="text-base sm:text-lg font-bold text-white">
                    {experience.recommendation.author}
                  </p>
                  <p className="text-xs sm:text-sm font-semibold tracking-wide text-slate-400">
                    {experience.recommendation.role}
                  </p>
                </div>
              </figcaption>
            </figure>
          </motion.div>
        )}
        */}

        {/* ---------- Related projects ---------- */}
        {related.length > 0 && (
          <section id="related" className="scroll-mt-24 pt-24">
            <Reveal>
              <SectionHeading eyebrow={t.relatedEyebrow} title={t.relatedTitle} />
            </Reveal>
            <div className="grid gap-5 sm:grid-cols-2">
              {related.map((p, i) => (
                <Reveal key={p.slug} delay={0.06 * i}>
                  <Link
                    href={`${basePath}/projects/${p.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-[28px] bg-white p-3 ring-1 ring-slate-200/80 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(15,23,42,0.12)] dark:bg-slate-900/80 dark:ring-white/10"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden rounded-[20px] bg-slate-100 dark:bg-slate-800">
                      <Image src={p.image} alt={p.title} fill sizes="(max-width: 640px) 100vw, 540px" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                    </div>
                    <div className="flex items-end justify-between gap-4 p-4">
                      <div>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{p.category}</p>
                        <p className="mt-1 font-display text-lg font-semibold tracking-tight">{p.title}</p>
                      </div>
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-700 transition-colors group-hover:bg-slate-900 group-hover:text-white dark:bg-white/10 dark:text-slate-200 dark:group-hover:bg-white dark:group-hover:text-slate-900">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>
                  </Link>
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
                  href={`${basePath}/experience/${item.slug}`}
                  className={`group flex items-center gap-4 rounded-[28px] bg-white p-5 ring-1 ring-slate-200/80 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(15,23,42,0.10)] dark:bg-slate-900/80 dark:ring-white/10 sm:p-6 ${
                    i === 1 ? "sm:flex-row-reverse sm:text-right" : ""
                  }`}
                >
                  {item.logo && (
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white p-2 ring-1 ring-slate-200/80 dark:ring-white/10">
                      <span className="relative h-full w-full">
                        <Image src={item.logo} alt="" fill sizes="48px" className="object-contain" />
                      </span>
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className={`flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400 ${i === 1 ? "sm:justify-end" : ""}`}>
                      {i === 0 && <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />}
                      {i === 0 ? t.prev : t.next}
                      {i === 1 && <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />}
                    </p>
                    <p className="mt-1 truncate font-semibold text-slate-900 dark:text-white">{item.role}</p>
                    <p className="truncate text-sm text-slate-500 dark:text-slate-400">{item.company}</p>
                  </div>
                </Link>
              ) : (
                <div key={i} className="hidden sm:block" />
              ),
            )}
          </div>
          <div className="mt-10 text-center">
            <Link
              href={`${basePath}/#journey`}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            >
              {t.all}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
