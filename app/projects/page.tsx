"use client";

import { projects, projectsFr } from "@/data/projects";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  BrainCircuit,
  ChevronRight,
  Cpu,
  FlaskConical,
  Github,
  LayoutGrid,
  Search,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState, type MouseEvent, type ReactNode } from "react";

// French entries are the English ones with overrides, so this type covers both
type Project = (typeof projectsFr)[number];
type Bucket = "all" | "product" | "data" | "systems" | "research";
type Shelf = Exclude<Bucket, "all">;
type Variant = "wide" | "overlay" | "standard" | "half" | "full";

// Group the many fine-grained categories into a few readable shelves,
// keyed by slug so English and French share the same grouping.
const bucketOf = (slug: string): Shelf => {
  const category = projects.find((p) => p.slug === slug)?.category ?? "";
  if (/Data|AI/.test(category)) return "data";
  if (/Algorithms|Systems/.test(category)) return "systems";
  if (/Research|Simulation/.test(category)) return "research";
  return "product";
};

// Each shelf gets its own accent so the grid reads as families, not clones.
// Class strings are written out in full so Tailwind can see them.
const accents: Record<
  Shelf,
  { icon: ReactNode; chip: string; link: string; tint: string; glow: string; bar: string }
> = {
  product: {
    icon: <LayoutGrid className="h-3.5 w-3.5" />,
    chip: "bg-blue-500/10 text-blue-700 dark:bg-blue-400/15 dark:text-blue-300",
    link: "text-blue-600 dark:text-blue-400",
    tint: "from-blue-50 via-white to-white dark:from-blue-500/[0.14] dark:via-slate-900 dark:to-slate-900",
    glow: "rgba(59,130,246,0.16)",
    bar: "from-blue-500 to-indigo-500",
  },
  data: {
    icon: <BrainCircuit className="h-3.5 w-3.5" />,
    chip: "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300",
    link: "text-emerald-700 dark:text-emerald-400",
    tint: "from-emerald-50 via-white to-white dark:from-emerald-500/[0.13] dark:via-slate-900 dark:to-slate-900",
    glow: "rgba(16,185,129,0.16)",
    bar: "from-emerald-500 to-teal-500",
  },
  systems: {
    icon: <Cpu className="h-3.5 w-3.5" />,
    chip: "bg-violet-500/10 text-violet-700 dark:bg-violet-400/15 dark:text-violet-300",
    link: "text-violet-700 dark:text-violet-400",
    tint: "from-violet-50 via-white to-white dark:from-violet-500/[0.14] dark:via-slate-900 dark:to-slate-900",
    glow: "rgba(139,92,246,0.16)",
    bar: "from-violet-500 to-fuchsia-500",
  },
  research: {
    icon: <FlaskConical className="h-3.5 w-3.5" />,
    chip: "bg-amber-500/10 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300",
    link: "text-amber-700 dark:text-amber-400",
    tint: "from-amber-50 via-white to-white dark:from-amber-500/[0.12] dark:via-slate-900 dark:to-slate-900",
    glow: "rgba(245,158,11,0.16)",
    bar: "from-amber-500 to-orange-500",
  },
};

// Bento rhythm: every 5 cards fill a 6-column x 4-row block exactly
// (wide 4x2, overlay 2x2, standard 2x2, overlay 2x2, standard 2x2).
// Leftover cards get shapes that still close the last row.
const MODULE: Variant[] = ["wide", "overlay", "standard", "overlay", "standard"];
function layoutFor(count: number): Variant[] {
  const full = Math.floor(count / 5) * 5;
  const out: Variant[] = [];
  for (let i = 0; i < full; i++) out.push(MODULE[i % 5]);
  const tail = count - full;
  if (tail === 1) out.push("full");
  if (tail === 2) out.push("half", "half");
  if (tail === 3) out.push("standard", "overlay", "standard");
  if (tail === 4) out.push("wide", "overlay", "half", "half");
  return out;
}

const spans: Record<Variant, string> = {
  wide: "md:col-span-2 lg:col-span-4 lg:row-span-2",
  overlay: "lg:col-span-2 lg:row-span-2",
  standard: "lg:col-span-2 lg:row-span-2",
  half: "lg:col-span-3 lg:row-span-2",
  full: "md:col-span-2 lg:col-span-6 lg:row-span-2",
};

const isLogoImage = (src: string) => src.endsWith("/logo.png");
const imageOf = (p: Project) => p.image || "/images/projects/portfolio-cover.png";
const ease = [0.16, 1, 0.3, 1] as const;

function formatDate(date: string, fr: boolean) {
  const d = new Date(`${date}T00:00:00`);
  if (Number.isNaN(d.getTime())) return date;
  return new Intl.DateTimeFormat(fr ? "fr-FR" : "en-US", { month: "short", year: "numeric" }).format(d);
}

/* ---------- small building blocks ---------- */

function Chip({ shelf, label }: { shelf: Shelf; label: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${accents[shelf].chip}`}>
      {accents[shelf].icon}
      {label}
    </span>
  );
}

function Tags({ project, max, onDark = false }: { project: Project; max: number; onDark?: boolean }) {
  if (max === 0) return null;
  return (
    <ul className="flex flex-wrap gap-1.5">
      {project.technologies.slice(0, max).map((tech) => (
        <li
          key={tech}
          className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
            onDark
              ? "bg-white/15 text-white backdrop-blur-md"
              : "border border-slate-200 text-slate-600 dark:border-white/10 dark:text-slate-300"
          }`}
        >
          {tech}
        </li>
      ))}
      {project.technologies.length > max && (
        <li className={`px-1 py-1 text-[11px] font-medium ${onDark ? "text-white/70" : "text-slate-500 dark:text-slate-400"}`}>
          +{project.technologies.length - max}
        </li>
      )}
    </ul>
  );
}

function IconLink({ href, label, onDark, children }: { href: string; label: string; onDark?: boolean; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`pointer-events-auto relative z-20 grid h-9 w-9 cursor-pointer place-items-center rounded-full transition-colors ${
        onDark
          ? "bg-white/15 text-white backdrop-blur-md hover:bg-white hover:text-slate-900"
          : "bg-slate-100 text-slate-700 hover:bg-slate-900 hover:text-white dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white dark:hover:text-slate-900"
      }`}
    >
      {children}
    </a>
  );
}

function Footer({ project, shelf, label, href, onDark = false }: { project: Project; shelf: Shelf; label: string; href: string; onDark?: boolean }) {
  const demo = project.demo && project.demo !== project.github ? project.demo : null;
  return (
    <div className="flex items-center justify-between gap-3">
      <Link
        href={href}
        className={`pointer-events-auto inline-flex cursor-pointer items-center rounded-full text-sm font-semibold hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${onDark ? "text-white" : accents[shelf].link}`}
      >
        {label}
        <ChevronRight className="ml-0.5 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
      <div className="flex items-center gap-2">
        {project.github && (
          <IconLink href={project.github} label="GitHub" onDark={onDark}>
            <Github className="h-4 w-4" />
          </IconLink>
        )}
        {demo && (
          <IconLink href={demo} label="Live" onDark={onDark}>
            <ArrowUpRight className="h-4 w-4" />
          </IconLink>
        )}
      </div>
    </div>
  );
}

/* ---------- card shell with cursor spotlight ---------- */

function CardShell({
  project,
  shelf,
  href,
  className,
  index,
  children,
}: {
  project: Project;
  shelf: Shelf;
  href: string;
  className: string;
  index: number;
  children: ReactNode;
}) {
  const onMove = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <motion.article
      layout
      onMouseMove={onMove}
      initial={{ opacity: 0, y: 28, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.55, delay: Math.min(index, 8) * 0.045, ease }}
      className={`group relative isolate overflow-hidden rounded-[28px] border border-slate-200/80 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_30px_rgba(15,23,42,0.06)] transition-[box-shadow,transform,border-color] duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-[0_2px_6px_rgba(15,23,42,0.06),0_28px_60px_rgba(15,23,42,0.14)] dark:border-white/10 dark:shadow-none dark:hover:border-white/20 ${className}`}
    >
      {/* Cursor-following spotlight in the shelf colour */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), ${accents[shelf].glow}, transparent 60%)` }}
      />
      {/* Thin accent line along the top edge */}
      <div aria-hidden className={`absolute inset-x-8 top-0 z-10 h-px bg-gradient-to-r ${accents[shelf].bar} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
      {children}
      {/* Whole card is the link; icon buttons sit above it */}
      <Link href={href} aria-label={project.title} className="absolute inset-0 z-[15] rounded-[28px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" />
    </motion.article>
  );
}

/* ---------- card variants ---------- */

type CardProps = { project: Project; variant: Variant; index: number; fr: boolean; href: string; t: { learnMore: string; featured: string } };

function ProjectCard({ project, variant, index, fr, href, t }: CardProps) {
  const shelf = bucketOf(project.slug);
  const src = imageOf(project);
  const logo = isLogoImage(src);
  const meta = (
    <div className="flex flex-wrap items-center gap-2">
      <Chip shelf={shelf} label={project.category} />
      {project.featured && (
        <span className="rounded-full bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-white dark:bg-white dark:text-slate-900">
          {t.featured}
        </span>
      )}
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{formatDate(project.date, fr)}</span>
    </div>
  );

  // Full-bleed image, text on a dark scrim (always visible)
  if (variant === "overlay") {
    return (
      <CardShell project={project} shelf={shelf} href={href} index={index} className={`${spans.overlay} min-h-[440px] bg-slate-900 lg:min-h-0`}>
        <Image
          src={src}
          alt={project.title}
          fill
          sizes="(max-width: 1024px) 100vw, 380px"
          className={`transition-transform [transition-duration:1.2s] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06] ${logo ? "object-contain p-16" : "object-cover"}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/0" />
        <div className="pointer-events-none relative z-20 flex h-full flex-col justify-end gap-3 p-6 text-white">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
              {accents[shelf].icon}
              {project.category}
            </span>
            <span className="text-xs font-medium text-white/70">{formatDate(project.date, fr)}</span>
          </div>
          <h2 className="font-display text-xl font-semibold leading-snug tracking-tight sm:text-2xl">{project.title}</h2>
          <p className="line-clamp-2 text-sm leading-relaxed text-white/80">{project.description}</p>
          <div className="pt-1">
            <Footer href={href} project={project} shelf={shelf} label={t.learnMore} onDark />
          </div>
        </div>
      </CardShell>
    );
  }

  // Tinted, text-led card with the image bleeding off the corner
  if (variant === "wide" || variant === "full") {
    return (
      <CardShell
        project={project}
        shelf={shelf}
        href={href}
        index={index}
        className={`${spans[variant]} flex flex-col bg-gradient-to-br ${accents[shelf].tint} lg:flex-row`}
      >
        <div className="pointer-events-none relative z-20 flex flex-col gap-3 p-6 sm:p-8 lg:w-[46%] lg:justify-center">
          {meta}
          <h2 className="font-display text-2xl font-semibold leading-tight tracking-tight sm:text-[1.75rem]">{project.title}</h2>
          <p className="line-clamp-3 text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">{project.description}</p>
          <Tags project={project} max={variant === "full" ? 5 : 3} />
          <div className="pt-2">
            <Footer href={href} project={project} shelf={shelf} label={t.learnMore} />
          </div>
        </div>
        <div className="relative h-56 flex-1 sm:h-72 lg:h-auto">
          <div
            className={`absolute left-6 right-[-12%] top-2 bottom-[-18%] overflow-hidden rounded-2xl border border-slate-200/80 shadow-[0_20px_50px_rgba(15,23,42,0.18)] transition-transform duration-700 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2 group-hover:-rotate-1 dark:border-white/10 lg:left-0 lg:top-10 ${
              logo ? "bg-white dark:bg-slate-800" : "bg-slate-100 dark:bg-slate-800"
            }`}
          >
            <Image
              src={src}
              alt={project.title}
              fill
              sizes="(max-width: 1024px) 90vw, 520px"
              className={logo ? "object-contain p-10" : "object-cover object-left-top"}
            />
          </div>
        </div>
      </CardShell>
    );
  }

  // Standard / half: inset image on top, details below
  return (
    <CardShell project={project} shelf={shelf} href={href} index={index} className={`${spans[variant]} flex flex-col bg-white p-3 dark:bg-slate-900/80`}>
      <div
        className={`relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-[20px] lg:aspect-auto lg:min-h-[150px] lg:flex-1 ${
          logo ? "bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900" : "bg-slate-100 dark:bg-slate-800"
        }`}
      >
        <Image
          src={src}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 560px"
          className={`transition-transform duration-700 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05] ${logo ? "object-contain p-8" : "object-cover"}`}
        />
      </div>
      <div className="pointer-events-none relative z-20 flex flex-col gap-2.5 p-3 pt-4">
        {meta}
        <h2 className="font-display text-lg font-semibold leading-snug tracking-tight sm:text-xl">{project.title}</h2>
        <p className="line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{project.description}</p>
        <div className="pt-1">
          <Footer href={href} project={project} shelf={shelf} label={t.learnMore} />
        </div>
      </div>
    </CardShell>
  );
}

/* ---------- featured hero ---------- */

function HeroCard({ project, fr, href, t }: { project: Project; fr: boolean; href: string; t: { learnMore: string; featured: string } }) {
  const shelf = bucketOf(project.slug);
  return (
    <CardShell
      project={project}
      shelf={shelf}
      href={href}
      index={0}
      className={`flex flex-col bg-gradient-to-br ${accents[shelf].tint} lg:flex-row lg:items-center`}
    >
      <div className="pointer-events-none relative z-20 flex flex-col gap-4 p-6 sm:p-10 lg:w-[42%]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-white dark:bg-white dark:text-slate-900">
            {t.featured}
          </span>
          <Chip shelf={shelf} label={project.category} />
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{formatDate(project.date, fr)}</span>
        </div>
        <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{project.title}</h2>
        <p className="text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">{project.description}</p>
        {project.outcome && (
          <p className="rounded-2xl bg-white/70 p-4 text-sm leading-relaxed text-slate-700 ring-1 ring-slate-200/80 backdrop-blur dark:bg-white/5 dark:text-slate-300 dark:ring-white/10">
            {project.outcome}
          </p>
        )}
        <Tags project={project} max={5} />
        <div className="pt-1">
          <Footer href={href} project={project} shelf={shelf} label={t.learnMore} />
        </div>
      </div>
      <div className="relative h-64 flex-1 self-stretch sm:h-96 lg:h-auto lg:min-h-[460px]">
        <div className="absolute left-6 right-[-8%] top-4 bottom-[-12%] overflow-hidden rounded-2xl border border-slate-200/80 shadow-[0_30px_80px_rgba(15,23,42,0.25)] transition-transform duration-700 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2 dark:border-white/10 lg:left-0 lg:top-12">
          <Image src={imageOf(project)} alt={project.title} fill priority sizes="(max-width: 1024px) 95vw, 720px" className="object-cover object-left-top" />
        </div>
      </div>
    </CardShell>
  );
}

/* ---------- page ---------- */

export default function ProjectsPage() {
  const pathname = usePathname();
  const fr = !!pathname?.startsWith("/fr");
  const basePath = fr ? "/fr" : "";
  const all: Project[] = fr ? projectsFr : projects;

  const t = fr
    ? {
        backHome: "Accueil",
        eyebrow: "Projets",
        title: "Des choses que j'ai construites.",
        subtitle: "Plateformes en production, systèmes de données, recherche et outils, du campus à l'entreprise.",
        search: "Rechercher",
        featured: "À la une",
        learnMore: "En savoir plus",
        count: (n: number) => `${n} projet${n > 1 ? "s" : ""}`,
        noMatchTitle: "Aucun projet trouvé",
        noMatchBody: "Essayez un autre mot-clé ou une autre catégorie.",
        reset: "Réinitialiser",
        buckets: { all: "Tout", product: "Produits & Web", data: "Data & IA", systems: "Systèmes & Algorithmes", research: "Recherche & Simulation" },
      }
    : {
        backHome: "Home",
        eyebrow: "Projects",
        title: "Things I've built.",
        subtitle: "Production platforms, data systems, research and tools, from campus to enterprise.",
        search: "Search",
        featured: "Featured",
        learnMore: "Learn more",
        count: (n: number) => `${n} project${n === 1 ? "" : "s"}`,
        noMatchTitle: "No projects found",
        noMatchBody: "Try a different keyword or category.",
        reset: "Reset",
        buckets: { all: "All", product: "Product & Web", data: "Data & AI", systems: "Systems & Algorithms", research: "Research & Simulation" },
      };

  const [query, setQuery] = useState("");
  const [bucket, setBucket] = useState<Bucket>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return all.filter((p) => {
      const inBucket = bucket === "all" || bucketOf(p.slug) === bucket;
      const inQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.technologies.some((tech) => tech.toLowerCase().includes(q));
      return inBucket && inQuery;
    });
  }, [all, bucket, query]);

  // Featured first, newest first within each group
  const ordered = useMemo(
    () => [...filtered].sort((a, b) => Number(b.featured) - Number(a.featured) || b.date.localeCompare(a.date)),
    [filtered],
  );
  const hero = ordered[0]?.featured ? ordered[0] : null;
  const rest = hero ? ordered.slice(1) : ordered;
  const variants = layoutFor(rest.length);

  const bucketKeys = (Object.keys(t.buckets) as Bucket[]).filter(
    (key) => key === "all" || all.some((p) => bucketOf(p.slug) === key),
  );
  const shelfCount = (key: Bucket) => (key === "all" ? all.length : all.filter((p) => bucketOf(p.slug) === key).length);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f5f5f7] text-slate-900 dark:bg-slate-950 dark:text-white">
      {/* Soft colour wash behind the heading */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[520px] bg-[radial-gradient(60%_60%_at_20%_0%,rgba(59,130,246,0.14),transparent),radial-gradient(40%_50%_at_85%_10%,rgba(139,92,246,0.12),transparent)] dark:bg-[radial-gradient(60%_60%_at_20%_0%,rgba(59,130,246,0.18),transparent),radial-gradient(40%_50%_at_85%_10%,rgba(139,92,246,0.14),transparent)]" />

      <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-8 sm:px-6 sm:pt-12 lg:px-8">
        <Link
          href={basePath || "/"}
          className="group inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          {t.backHome}
        </Link>

        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="mt-10 max-w-3xl sm:mt-14"
        >
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">{t.eyebrow}</p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            {t.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">{t.subtitle}</p>
        </motion.header>

        {/* Toolbar: segmented shelves + search */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease }}
          className="z-30 mt-10 flex flex-col gap-3 rounded-[22px] border border-slate-200/80 bg-white/75 p-2 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/75 md:sticky md:top-3 md:flex-row md:items-center md:justify-between"
        >
          <div className="-mx-1 flex gap-1 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="tablist">
            {bucketKeys.map((key) => {
              const active = bucket === key;
              return (
                <button
                  key={key}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setBucket(key)}
                  className={`relative shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    active ? "text-white dark:text-slate-900" : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="bucket-pill"
                      className="absolute inset-0 rounded-full bg-slate-900 dark:bg-white"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="relative flex items-center gap-1.5">
                    {key !== "all" && <span className={active ? "" : "opacity-70"}>{accents[key].icon}</span>}
                    {t.buckets[key]}
                    <span className={`text-xs tabular-nums ${active ? "opacity-70" : "opacity-50"}`}>{shelfCount(key)}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <label className="relative flex items-center md:w-64">
            <Search className="pointer-events-none absolute left-3.5 h-4 w-4 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.search}
              className="h-10 w-full rounded-full bg-slate-100 pl-10 pr-9 text-sm text-slate-900 outline-none ring-blue-500/40 transition placeholder:text-slate-500 focus:bg-white focus:ring-2 dark:bg-white/10 dark:text-white dark:placeholder:text-slate-400 dark:focus:bg-white/15 [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-2 grid h-6 w-6 place-items-center rounded-full bg-slate-300/70 text-slate-700 hover:bg-slate-400/70 dark:bg-white/20 dark:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </label>
        </motion.div>

        <p className="mt-6 px-1 text-sm text-slate-500 dark:text-slate-400" aria-live="polite">
          {t.count(filtered.length)}
        </p>

        {ordered.length === 0 ? (
          <div className="mt-6 rounded-[28px] border border-slate-200/80 bg-white px-6 py-20 text-center dark:border-white/10 dark:bg-slate-900/70">
            <p className="font-display text-2xl font-semibold">{t.noMatchTitle}</p>
            <p className="mt-2 text-slate-500 dark:text-slate-400">{t.noMatchBody}</p>
            <button
              onClick={() => {
                setQuery("");
                setBucket("all");
              }}
              className="mt-6 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            >
              {t.reset}
            </button>
          </div>
        ) : (
          <>
          <AnimatePresence mode="popLayout">
            {hero && (
              <motion.div key={hero.slug} layout className="mt-4 grid">
                <HeroCard project={hero} fr={fr} href={`${basePath}/projects/${hero.slug}`} t={t} />
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div
            layout
            className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 lg:mt-6 lg:auto-rows-[236px] lg:grid-cols-6 lg:gap-6"
          >
            <AnimatePresence mode="popLayout">
              {rest.map((project, i) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  variant={variants[i]}
                  index={i + 1}
                  fr={fr}
                  href={`${basePath}/projects/${project.slug}`}
                  t={t}
                />
              ))}
            </AnimatePresence>
          </motion.div>
          </>
        )}
      </div>
    </main>
  );
}
