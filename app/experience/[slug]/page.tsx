"use client";

import { experiences, experiencesFr } from "@/data/experiences";
import { projects, projectsFr } from "@/data/projects";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Download,
  FolderGit2,
  MapPin,
  Quote,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

export default function ExperienceDetailPage() {
  const params = useParams();
  const pathname = usePathname();
  const isFr = pathname?.startsWith("/fr");
  const basePath = isFr ? "/fr" : "";
  const router = useRouter();
  const slug = params?.slug as string | undefined;

  const experience = useMemo(
    () =>
      slug
        ? (isFr ? experiencesFr : experiences).find((e) => e.slug === slug)
        : undefined,
    [slug, isFr],
  );

  const collection = isFr ? experiencesFr : experiences;
  const currentIndex = collection.findIndex((e) => e.slug === slug);
  const prevExperience =
    currentIndex > 0 ? collection[currentIndex - 1] : undefined;
  const nextExperience =
    currentIndex >= 0 && currentIndex < collection.length - 1
      ? collection[currentIndex + 1]
      : undefined;

  const projectCollection = isFr ? projectsFr : projects;
  const relatedProjects = (experience?.relatedProjects ?? [])
    .map((projectSlug) =>
      projectCollection.find((p) => p.slug === projectSlug),
    )
    .filter((p): p is (typeof projectCollection)[number] => Boolean(p));

  const t = isFr
    ? {
        backJourney: "Retour au parcours",
        downloadResume: "Télécharger le CV",
        visitWebsite: "Visiter le site",
        home: "Accueil",
        journey: "Parcours",
        impact: "00. Impact",
        overview: "01. Vue d'ensemble",
        company: "02. L'Entreprise",
        responsibilities: "03. Responsabilités clés",
        achievements: "04. Réalisations clés",
        gallery: "05. Galerie",
        recommendation: "06. Recommandation",
        related: "07. Projets associés",
        viewProject: "Voir le projet",
        prev: "Expérience précédente",
        next: "Expérience suivante",
        journeyLead: "Retour au",
        journeyAccent: "parcours.",
        viewAll: "Voir tout le parcours",
        present: "ACTUEL",
      }
    : {
        backJourney: "Back to Journey",
        downloadResume: "Download Resume",
        visitWebsite: "Visit Website",
        home: "Home",
        journey: "Journey",
        impact: "00. Impact",
        overview: "01. Overview",
        company: "02. The Company",
        responsibilities: "03. Key Responsibilities",
        achievements: "04. Key Achievements",
        gallery: "05. Gallery",
        recommendation: "06. Recommendation",
        related: "07. Related Projects",
        viewProject: "View Project",
        prev: "Previous Experience",
        next: "Next Experience",
        journeyLead: "Return to the",
        journeyAccent: "Journey.",
        viewAll: "View Full Journey",
        present: "PRESENT",
      };

  useEffect(() => {
    if (slug && !experience) {
      router.push(`${basePath}/#journey`);
    }
  }, [slug, experience, router, basePath]);

  if (!experience) return null;

  const endText =
    experience.endDate.toLowerCase() === "present"
      ? t.present
      : experience.endDate;

  const initials = (name: string) =>
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const sectionLabel =
    "text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase text-blue-600 dark:text-blue-400 mb-8 sm:mb-12";

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 selection:bg-blue-200 dark:selection:bg-blue-900/50">
      {/* Sticky Glass Action Bar */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-12 py-4 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50"
      >
        <Link
          href={`${basePath}/#journey`}
          className="flex items-center gap-3 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center group-hover:bg-slate-200 dark:group-hover:bg-slate-800 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="hidden sm:block">{t.backJourney}</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href={isFr ? "/resume_fr.pdf" : "/resume.pdf"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="hidden sm:flex items-center gap-2 sm:gap-3 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-slate-700 hover:bg-slate-600 text-white text-[9px] sm:text-[10px] font-bold tracking-widest uppercase transition-all duration-300 shadow-lg">
              <Download className="w-3 h-3 sm:w-4 sm:h-4" />
              {t.downloadResume}
            </button>
          </Link>
          {experience.website && (
            <Link
              href={experience.website}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="flex items-center gap-2 sm:gap-3 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-[9px] sm:text-[10px] font-bold tracking-widest uppercase transition-all duration-300 shadow-lg shadow-blue-600/20">
                {t.visitWebsite}
                <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </Link>
          )}
        </div>
      </motion.div>

      {/* Cinematic Hero */}
      <section className="relative flex items-end min-h-[70vh] overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full" />
        </div>

        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pb-16 sm:pb-24 pt-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Breadcrumb */}
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-2 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-slate-400 mb-10"
            >
              <Link
                href={`${basePath}/`}
                className="transition-colors hover:text-white"
              >
                {t.home}
              </Link>
              <span className="text-slate-600">/</span>
              <Link
                href={`${basePath}/#journey`}
                className="transition-colors hover:text-white"
              >
                {t.journey}
              </Link>
              <span className="text-slate-600">/</span>
              <span className="text-blue-400 truncate max-w-[45vw] sm:max-w-none">
                {experience.role}
              </span>
            </nav>

            {experience.logo && (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-white/20 bg-[radial-gradient(circle_at_30%_30%,#f8fafc,#cbd5e1_60%,#94a3b8)] dark:bg-slate-800 flex items-center justify-center p-3 mb-8 shadow-2xl">
                <div className="relative w-full h-full mix-blend-multiply">
                  <Image
                    src={experience.logo}
                    alt={`${experience.company} logo`}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-6 sm:mb-8 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-slate-300">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                {experience.startDate} - {endText}
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-400" />
                {experience.location}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6 leading-tight max-w-5xl">
              {experience.role}
            </h1>

            <p className="flex flex-wrap items-center gap-3 text-lg sm:text-2xl font-bold tracking-wide text-blue-400 mb-8">
              <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />
              {experience.company}
            </p>

            {experience.technologies && experience.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {experience.technologies.map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    className="px-4 py-2 rounded-full bg-slate-900/60 backdrop-blur-md border border-slate-700/50 text-[9px] sm:text-[10px] font-bold tracking-widest uppercase text-white shadow-xl"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="relative z-30 bg-white dark:bg-slate-950 rounded-t-[3rem] -mt-10 py-24 sm:py-32">
        <div className="max-w-4xl mx-auto px-6 sm:px-12">
          {/* Impact Stats */}
          {experience.highlights && experience.highlights.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mb-24 sm:mb-32"
            >
              <h2 className={sectionLabel}>{t.impact}</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {experience.highlights.map((stat, index) => (
                  <div
                    key={index}
                    className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-7 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-300/80 hover:shadow-lg hover:shadow-blue-500/10 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700/60"
                  >
                    <span className="pointer-events-none absolute inset-x-4 top-0 h-[3px] rounded-b-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-70 transition-opacity duration-300 group-hover:opacity-100" />
                    <p className="mb-4 text-[clamp(1.5rem,3vw,2.25rem)] font-extrabold leading-none tracking-tight text-transparent whitespace-nowrap bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 tabular-nums dark:from-blue-400 dark:to-indigo-400">
                      {stat.value}
                    </p>
                    <p className="text-[10px] font-bold uppercase leading-snug text-slate-500 dark:text-slate-400">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Overview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-24 sm:mb-32"
          >
            <h2 className={sectionLabel}>{t.overview}</h2>
            <p className="text-2xl sm:text-4xl font-light text-slate-900 dark:text-slate-100 leading-relaxed tracking-tight">
              {experience.description}
            </p>
          </motion.div>

          {/* The Company */}
          {experience.companyContext && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mb-24 sm:mb-32"
            >
              <h2 className={sectionLabel}>{t.company}</h2>
              <div className="relative overflow-hidden p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-50 to-blue-50/40 dark:from-slate-900 dark:to-blue-950/20 border border-slate-200 dark:border-slate-800 transition-shadow duration-500 hover:shadow-xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full" />
                <div className="flex items-start gap-5 sm:gap-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3">
                      {experience.company}
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-light leading-relaxed">
                      {experience.companyContext}
                    </p>
                    {experience.website && (
                      <Link
                        href={experience.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white group/company"
                      >
                        <span className="pb-0.5 border-b-2 border-transparent transition-colors group-hover/company:border-blue-500">
                          {experience.website.replace(/^https?:\/\/(www\.)?/, "")}
                        </span>
                        <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover/company:translate-x-0.5 group-hover/company:-translate-y-0.5 text-blue-600" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Key Responsibilities */}
          {experience.responsibilities &&
            experience.responsibilities.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="mb-24 sm:mb-32"
              >
                <h2 className={sectionLabel}>{t.responsibilities}</h2>
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                  {experience.responsibilities.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-6 sm:p-7 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800/80 hover:shadow-xl transition-all duration-500 group"
                    >
                      <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
                      <p className="text-sm sm:text-base font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          {/* Key Achievements */}
          {experience.achievements && experience.achievements.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mb-24 sm:mb-32"
            >
              <h2 className={sectionLabel}>{t.achievements}</h2>
              <div className="space-y-6 sm:space-y-8">
                {experience.achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-start gap-6 p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800/80 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden group"
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shrink-0 group-hover:scale-110 transition-transform duration-500">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <p className="text-lg sm:text-xl font-medium text-slate-900 dark:text-slate-100 leading-relaxed">
                      {achievement}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Gallery */}
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

          {/* Recommendation */}
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
                <blockquote className="text-xl sm:text-3xl font-light text-slate-100 leading-relaxed mb-10">
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

          {/* Related Projects */}
          {relatedProjects.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mb-24 sm:mb-32"
            >
              <h2 className={sectionLabel}>{t.related}</h2>
              <div className="space-y-4 sm:space-y-6">
                {relatedProjects.map((project) => (
                  <Link
                    key={project.slug}
                    href={`${basePath}/projects/${project.slug}`}
                    className="group flex items-center gap-5 sm:gap-8 p-4 sm:p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800/80 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-900 transition-all duration-500 overflow-hidden"
                  >
                    <div className="relative w-24 h-16 sm:w-36 sm:h-24 rounded-2xl overflow-hidden shrink-0 bg-slate-200 dark:bg-slate-800">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] sm:text-[10px] font-bold tracking-widest uppercase text-blue-600 dark:text-blue-400 mb-1.5">
                        {project.category || "Project"}
                      </p>
                      <h3 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {project.title}
                      </h3>
                    </div>
                    <FolderGit2 className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300 dark:text-slate-700 shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-blue-500 dark:group-hover:text-blue-400" />
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          {/* Prev / Next Navigation */}
          {(prevExperience || nextExperience) && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mb-24 sm:mb-32"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {prevExperience ? (
                  <Link
                    href={`${basePath}/experience/${prevExperience.slug}`}
                    className="group flex flex-col gap-2 p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800/80 hover:shadow-xl transition-all duration-500"
                  >
                    <span className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-slate-400">
                      <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
                      {t.prev}
                    </span>
                    <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                      {prevExperience.role}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {prevExperience.company}
                    </span>
                  </Link>
                ) : (
                  <div className="hidden sm:block" />
                )}
                {nextExperience ? (
                  <Link
                    href={`${basePath}/experience/${nextExperience.slug}`}
                    className="group flex flex-col items-end gap-2 p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800/80 hover:shadow-xl transition-all duration-500 text-right"
                  >
                    <span className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-slate-400">
                      {t.next}
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                    <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                      {nextExperience.role}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {nextExperience.company}
                    </span>
                  </Link>
                ) : (
                  <div className="hidden sm:block" />
                )}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Interstitial Action Closure */}
      <section className="py-24 sm:py-32 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-6 sm:px-12 text-center">
          <h2 className="text-4xl sm:text-6xl font-bold tracking-tighter text-slate-900 dark:text-white mb-10">
            {t.journeyLead}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              {t.journeyAccent}
            </span>
          </h2>
          <Link href={`${basePath}/#journey`}>
            <button className="px-10 py-5 sm:px-12 sm:py-6 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold tracking-widest text-[10px] sm:text-xs uppercase hover:scale-105 hover:shadow-2xl transition-all duration-300">
              {t.viewAll}
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}