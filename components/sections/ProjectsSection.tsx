"use client";

import { projects, projectsFr } from "@/data/projects";
import { motion, useInView, useSpring, useTransform, useMotionValue, useScroll, useMotionTemplate } from "framer-motion";
import { ExternalLink, Github, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { MouseEvent, useRef, useState } from "react";

type Locale = "en" | "fr";
type PortfolioProject = (typeof projects)[number];

type ProjectAction = {
  label: string;
  href: string;
  icon?: React.ReactNode;
  external?: boolean;
};

function formatProjectDate(date: string, locale: Locale) {
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;

  return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", {
    month: "long",
    year: "numeric",
  }).format(parsed);
}

function ProjectActionButton({ action }: { action: ProjectAction }) {
  const content = (
    <>
      <span className="absolute inset-0 rounded-[5px] bg-black/10 translate-y-0.5 transition-transform duration-200 ease-out group-hover/btn:translate-y-1 group-active/btn:translate-y-px" />
      <span className="absolute inset-0 rounded-[5px] bg-[linear-gradient(to_left,hsl(221_83%_36%)_0%,hsl(221_83%_53%)_8%,hsl(221_83%_53%)_92%,hsl(221_83%_36%)_100%)]" />
      <span className="relative flex w-full items-center justify-center gap-1.5 rounded-[5px] bg-slate-50 px-3 py-2 text-[11px] font-semibold text-slate-950 shadow-sm transition-all duration-200 ease-out -translate-y-1 group-hover/btn:-translate-y-1.5 group-hover/btn:bg-blue-500 group-hover/btn:text-white group-active/btn:-translate-y-0.5 sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm">
        {action.icon}
        {action.label}
      </span>
    </>
  );

  const className =
    "group/btn relative inline-block rounded-[5px] bg-transparent p-0 transition-[filter] duration-200 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-slate-950";

  if (action.external) {
    return (
      <a
        href={action.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={action.href} className={className}>
      {content}
    </Link>
  );
}

function ProjectCard({
  project,
  index,
  locale,
}: {
  project: PortfolioProject;
  index: number;
  locale: Locale;
}) {
  const cardRef = useRef<HTMLElement>(null);
  
  // Radial glow coordinates
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Card Magnet Physics
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  const springConfig = { stiffness: 150, damping: 15, mass: 0.5 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);
  const springScale = useSpring(scale, springConfig);
  
  // Parallax Scroll for Image
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  
  const isEven = index % 2 === 0;
  const basePath = locale === "fr" ? "/fr" : "";
  const demoHref = project.demo && project.demo !== project.github ? project.demo : null;

  const actions: ProjectAction[] = [
    {
      label: locale === "fr" ? "Détails" : "Details",
      href: `${basePath}/projects/${project.slug}`,
      icon: <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />,
    },
    ...(project.github
      ? [
          {
            label: "Code",
            href: project.github,
            external: true,
            icon: <Github className="h-3.5 w-3.5 sm:h-4 sm:w-4" />,
          },
        ]
      : []),
    ...(demoHref
      ? [
          {
            label: "Live",
            href: demoHref,
            external: true,
            icon: <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4" />,
          },
        ]
      : []),
  ];

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    
    // Radial glow (no re-renders)
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
    
    // Card Magnet Physics
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    x.set((e.clientX - centerX) * 0.02);
    y.set((e.clientY - centerY) * 0.02);
    scale.set(1.01);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    scale.set(1);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const tagVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 200, damping: 12 } }
  };
  const bgLightGlow = useMotionTemplate`radial-gradient(circle 350px at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.5), transparent 80%)`;
  const bgDarkGlow = useMotionTemplate`radial-gradient(circle 350px at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.06), transparent 80%)`;

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="w-full"
    >
      <motion.article
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ x: springX, y: springY, scale: springScale }}
        className={`group relative mx-auto flex w-full max-w-6xl flex-col-reverse gap-6 overflow-hidden rounded-[20px] border border-slate-200/70 bg-gradient-to-br from-white/82 via-blue-50/48 to-white/68 p-4 shadow-[0_8px_32px_rgba(15,23,42,0.14)] backdrop-blur-[3px] transition-all duration-300 hover:border-slate-300 hover:shadow-[0_12px_40px_rgba(15,23,42,0.18)] dark:border-white/20 dark:from-white/10 dark:via-white/[0.04] dark:to-white/[0.02] dark:shadow-[0_8px_32px_rgba(0,0,0,0.37)] dark:hover:border-white/30 dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)] sm:p-5 md:gap-10 md:p-6 lg:p-8 ${
          isEven ? "md:flex-row" : "md:flex-row-reverse"
        }`}
      >

        {/* Dark mode radial glow */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-0 hidden opacity-0 mix-blend-screen transition-opacity duration-300 group-hover:opacity-100 dark:block"
          style={{ background: bgDarkGlow }}
        />
        {/* Light mode radial glow */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:hidden"
          style={{ background: bgLightGlow }}
        />

        {/* Content Column */}
        <div className="relative z-10 flex flex-1 flex-col justify-center text-left">
          {/* Editorial Number */}
          <div className={`pointer-events-none absolute -top-4 z-0 select-none text-[100px] font-black leading-none text-slate-900/[0.04] dark:text-white/[0.03] sm:-top-8 sm:text-[140px] md:text-[180px] ${isEven ? "-right-4 md:-right-12" : "-left-4 md:-left-12"}`}>
            0{index + 1}
          </div>

          <p className="relative z-10 text-xs font-bold leading-relaxed text-slate-500 dark:text-slate-400 sm:text-sm">
            {project.category} <span className="mx-2 opacity-50">•</span> {formatProjectDate(project.date, locale)}
          </p>

          <Link href={`${basePath}/projects/${project.slug}`} className="relative z-10 mt-2 block w-fit">
            <motion.span 
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              className="block bg-gradient-to-r from-slate-900 via-blue-700 to-slate-900 bg-[length:200%_auto] bg-clip-text text-[clamp(1.25rem,2vw,1.75rem)] font-extrabold leading-tight text-transparent transition-opacity hover:opacity-80 dark:from-slate-100 dark:via-blue-300 dark:to-slate-100"
            >
              {project.title}
            </motion.span>
          </Link>

          <div className="relative z-10 mt-4 h-px w-16 bg-blue-500/50" />

          <p className="relative z-10 mt-4 text-sm font-medium leading-relaxed text-slate-700 dark:text-slate-300 sm:text-base">
            {project.description}
          </p>

          <div className="relative z-10 mt-5 flex flex-wrap gap-2">
            {project.technologies.slice(0, 5).map((tech) => (
              <motion.span
                key={tech}
                variants={tagVariants}
                className="rounded-full border border-blue-200/60 bg-white/50 px-3 py-1 text-[11px] font-bold text-slate-700 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-200 sm:text-xs"
              >
                {tech}
              </motion.span>
            ))}
          </div>

          <div className="relative z-10 mt-7 flex flex-wrap items-center gap-3">
            {actions.map((action) => (
              <ProjectActionButton key={action.label} action={action} />
            ))}
          </div>
        </div>

        {/* Image Column */}
        <div className="relative z-10 flex flex-[1.2] items-center justify-center">
          <Link
            href={`${basePath}/projects/${project.slug}`}
            className="group/img relative block aspect-[16/9] w-full overflow-hidden rounded-xl border border-slate-200/60 bg-slate-100 shadow-[0_8px_24px_rgba(15,23,42,0.1)] dark:border-white/10 dark:bg-slate-900/50"
          >
            <motion.div style={{ y: imageY }} className="absolute inset-x-0 -top-[20%] bottom-0 h-[140%] w-full">
              <Image
                src={project.image || "/images/projects/blog.png"}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 90vw, 50vw"
                className="object-cover object-center transition-transform duration-700 group-hover/img:scale-[1.03]"
              />
            </motion.div>
            {/* Glass glare overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 transition-opacity duration-500 group-hover/img:opacity-100 mix-blend-overlay" />
          </Link>
        </div>
      </motion.article>
    </motion.div>
  );
}

export default function ProjectsSection({
  locale = "en",
}: {
  locale?: Locale;
}) {
  const basePath = locale === "fr" ? "/fr" : "";
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  
  const rawProjects = locale === "fr" ? projectsFr : projects;
  const featuredProjects = rawProjects.filter((project) => project.featured);
  const regularProjects = rawProjects.filter((project) => !project.featured);
  const visibleProjects = [...featuredProjects, ...regularProjects].slice(0, 3);

  const t =
    locale === "fr"
      ? {
          title: "SÉLECTION",
          archive: "Voir tous les projets",
        }
      : {
          title: "FEATURED WORK",
          archive: "View All Projects",
        };

  return (
    <section
      id="projects"
      className="relative min-h-[calc(100vh-52px)] overflow-hidden bg-transparent px-4 py-16 text-center text-slate-950 dark:text-slate-100 sm:px-6 lg:px-8 sm:py-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto mb-16 w-full max-w-6xl text-left"
      >
        <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-extrabold uppercase leading-tight tracking-normal text-slate-950 dark:text-slate-100 text-center">
          {t.title}
        </h2>
      </motion.div>

      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="relative mx-auto flex w-full flex-col gap-12 sm:gap-16 lg:gap-24"
      >
        {visibleProjects.map((project, index) => (
          <ProjectCard
            key={project.slug}
            project={project}
            index={index}
            locale={locale}
          />
        ))}
      </motion.div>

      <div className="relative z-40 mt-16 flex justify-center pb-8">
        <ProjectActionButton
          action={{
            label: t.archive,
            href: `${basePath}/projects`,
            icon: <ArrowRight className="h-4 w-4" />
          }}
        />
      </div>
    </section>
  );
}
