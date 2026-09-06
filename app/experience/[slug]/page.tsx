"use client";

import { experiences, experiencesFr } from "@/data/experiences";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Briefcase,
  Calendar,
  MapPin,
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

  const t = isFr
    ? {
        backJourney: "Retour au parcours",
        visitWebsite: "Visiter le site",
        overview: "01. Vue d'ensemble",
        achievements: "02. Réalisations",
        journeyLead: "Retour au",
        journeyAccent: "parcours.",
        viewAll: "Voir tout le parcours",
        present: "ACTUEL",
        locationLabel: "Lieu",
        periodLabel: "Période",
      }
    : {
        backJourney: "Back to Journey",
        visitWebsite: "Visit Website",
        overview: "01. Overview",
        achievements: "02. Key Achievements",
        journeyLead: "Return to the",
        journeyAccent: "Journey.",
        viewAll: "View Full Journey",
        present: "PRESENT",
        locationLabel: "Location",
        periodLabel: "Period",
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
          {/* Overview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-24 sm:mb-32"
          >
            <h2 className="text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase text-blue-600 dark:text-blue-400 mb-8 sm:mb-12">
              {t.overview}
            </h2>
            <p className="text-2xl sm:text-4xl font-light text-slate-900 dark:text-slate-100 leading-relaxed tracking-tight">
              {experience.description}
            </p>
          </motion.div>

          {/* Achievements */}
          {experience.achievements && experience.achievements.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase text-blue-600 dark:text-blue-400 mb-8 sm:mb-12">
                {t.achievements}
              </h2>
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