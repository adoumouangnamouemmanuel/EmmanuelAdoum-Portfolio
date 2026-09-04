"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { education, educationFr } from "@/data/education";
import { experiences, experiencesFr } from "@/data/experiences";
import { motion, useInView, useMotionValue, useMotionTemplate } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, MouseEvent } from "react";

type Locale = "en" | "fr";

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const tagContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2,
    },
  },
};

const tagVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { type: "spring", stiffness: 200, damping: 12 } 
  },
};

function JourneyCard({ 
  dateText, 
  logo,
  children 
}: { 
  dateText: string;
  logo?: string;
  children: React.ReactNode;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const bgLightGlow = useMotionTemplate`radial-gradient(circle 350px at ${mouseX}px ${mouseY}px, rgba(59,130,246,0.15), transparent 80%)`;
  const bgDarkGlow = useMotionTemplate`radial-gradient(circle 350px at ${mouseX}px ${mouseY}px, rgba(59,130,246,0.15), transparent 80%)`;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={itemVariants}
      className="group relative flex flex-col lg:flex-row gap-6 lg:gap-0 py-6 lg:py-10"
    >
      {/* Left Column: Dates & Timeline Node (Desktop Only) */}
      <div className="hidden lg:block lg:w-1/4 flex-shrink-0 lg:pr-12 lg:text-right relative">
        {/* Timeline Node */}
        {logo ? (
          <div className="absolute top-[24px] -right-[28px] w-14 h-14 rounded-full border border-white/60 bg-[radial-gradient(circle_at_30%_30%,#ffffff,#f8fafc_60%,#e2e8f0)] shadow-[0_8px_16px_rgba(0,0,0,0.15),inset_-4px_-4px_12px_rgba(0,0,0,0.1),inset_4px_4px_10px_rgba(255,255,255,1)] dark:bg-[radial-gradient(circle_at_30%_30%,#f8fafc,#cbd5e1_60%,#94a3b8)] dark:shadow-[0_8px_20px_rgba(0,0,0,0.4),inset_-4px_-4px_12px_rgba(0,0,0,0.2),inset_4px_4px_10px_rgba(255,255,255,1)] flex items-center justify-center p-2.5 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_12px_30px_rgba(59,130,246,0.5)] z-20">
            <div className="relative w-full h-full drop-shadow-sm mix-blend-multiply">
              <Image src={logo} alt="Company Logo" fill className="object-contain" />
            </div>
          </div>
        ) : (
          <div className="absolute top-[38px] -right-[7px] w-3.5 h-3.5 rounded-full border-2 border-blue-500 bg-white dark:bg-slate-950 shadow-[0_0_12px_rgba(59,130,246,0.6)] transition-all duration-300 group-hover:scale-125 group-hover:bg-blue-500 z-20" />
        )}
        
        <p className={`sticky ${logo ? 'top-[42px] mt-10' : 'top-[38px] mt-8'} text-sm font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400`}>
          {dateText}
        </p>
      </div>

      {/* Right Column: Glass Card */}
      <div className="w-full lg:w-3/4 flex flex-col lg:pl-12">
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          className="relative overflow-hidden rounded-[24px] border border-slate-200/70 bg-gradient-to-br from-white/82 via-blue-50/48 to-white/68 p-6 shadow-[0_8px_32px_rgba(15,23,42,0.14)] backdrop-blur-[3px] transition-all duration-300 hover:border-slate-300 hover:shadow-[0_12px_40px_rgba(15,23,42,0.18)] dark:border-white/20 dark:from-white/10 dark:via-white/[0.04] dark:to-white/[0.02] dark:shadow-[0_8px_32px_rgba(0,0,0,0.37)] dark:hover:border-white/30 sm:p-8"
        >

          {/* Radial Glow */}
          <motion.div
            className="pointer-events-none absolute inset-0 z-0 hidden opacity-0 mix-blend-screen transition-opacity duration-300 group-hover:opacity-100 dark:block"
            style={{ background: bgDarkGlow }}
          />
          <motion.div
            className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:hidden"
            style={{ background: bgLightGlow }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col h-full">
            {/* Mobile logo + date row — hidden on desktop where timeline shows them */}
            {logo && (
              <div className="lg:hidden flex items-center gap-3 mb-4">
                <div className="relative w-11 h-11 rounded-full border border-white/60 bg-[radial-gradient(circle_at_30%_30%,#ffffff,#f8fafc_60%,#e2e8f0)] shadow-[0_4px_12px_rgba(0,0,0,0.12),inset_4px_4px_8px_rgba(255,255,255,0.9)] dark:bg-[radial-gradient(circle_at_30%_30%,#f8fafc,#cbd5e1_60%,#94a3b8)] flex items-center justify-center p-2 flex-shrink-0">
                  <div className="relative w-full h-full drop-shadow-sm mix-blend-multiply">
                    <Image src={logo} alt="Company Logo" fill className="object-contain" />
                  </div>
                </div>
              </div>
            )}
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function JourneySection({ locale = "en" }: { locale?: Locale }) {
  const t =
    locale === "fr"
      ? {
          eyebrow: "Mon Parcours",
          titleLead: "Parcours",
          titleAccent: "Professionnel",
          tabExperience: "Expérience",
          tabEducation: "Formation",
          tabCertificates: "Certificats",
          present: "ACTUEL",
          coursework: "Cours pertinents",
          institutionWebsite: "Site de l'institution",
          viewCertificate: "Voir le certificat",
        }
      : {
          eyebrow: "My Journey",
          titleLead: "Professional",
          titleAccent: "Path",
          tabExperience: "Experience",
          tabEducation: "Education",
          tabCertificates: "Certificates",
          present: "PRESENT",
          coursework: "Relevant Coursework",
          institutionWebsite: "Institution Website",
          viewCertificate: "View Certificate",
        };

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [activeTab, setActiveTab] = useState("experience");
  const [expandedCourses, setExpandedCourses] = useState<number[]>([]);

  const toggleCourses = (index: number) => {
    setExpandedCourses((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const getYear = (dateStr?: string) => {
    if (!dateStr) return 0;
    if (dateStr.toLowerCase() === "present") return 9999;
    return parseInt(dateStr.slice(-4)) || 0;
  };

  const journeyExperiences = locale === "fr" ? experiencesFr : experiences;
  const journeyEducation = locale === "fr" ? educationFr : education;

  const sortedExperiences = [...journeyExperiences].sort(
    (a, b) => getYear(b.endDate) - getYear(a.endDate),
  );

  const degrees = journeyEducation.filter((item) => item.type === "degree");
  const sortedDegrees = [...degrees].sort(
    (a, b) => getYear(b.endDate) - getYear(a.endDate),
  );

  const certifications = journeyEducation.filter(
    (item) => item.type === "certification",
  );
  const sortedCerts = [...certifications].sort(
    (a, b) => getYear(b.endDate) - getYear(a.endDate),
  );

  return (
    <section
      id="journey"
      className="py-16 lg:py-24 bg-transparent relative overflow-hidden"
    >
      {/* Ambient Background Blobs */}
      <div className="pointer-events-none absolute right-0 top-1/4 -z-10 h-[600px] w-[600px] translate-x-1/3 -translate-y-1/2 rounded-full bg-blue-100/40 blur-[120px] dark:bg-blue-900/20" />
      <div className="pointer-events-none absolute left-0 bottom-1/4 -z-10 h-[500px] w-[500px] -translate-x-1/3 translate-y-1/3 rounded-full bg-indigo-50/50 blur-[100px] dark:bg-indigo-900/10" />

      <div className="section-container px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="flex flex-col items-center text-center mb-12 lg:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-4 lg:mb-5"
          >
            <p className="inline-flex items-center rounded-full border border-blue-200/60 bg-blue-50/50 backdrop-blur-md px-4 py-1.5 text-xs font-bold tracking-widest uppercase text-blue-700 shadow-sm dark:border-blue-900/60 dark:bg-blue-900/20 dark:text-blue-400">
              {t.eyebrow}
            </p>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-[clamp(1.5rem,3vw,2.5rem)] font-extrabold uppercase leading-tight tracking-normal text-slate-950 dark:text-slate-100"
          >
            {t.titleLead}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              {t.titleAccent}
            </span>
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <Tabs
            defaultValue="experience"
            className="w-full"
            onValueChange={setActiveTab}
          >
            <div className="flex justify-center mb-12 lg:mb-16 px-2 sm:px-0 z-20 relative">
              <TabsList className="grid grid-cols-3 w-full max-w-[550px] h-14 p-1.5 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.05)] border border-slate-200/80 dark:border-slate-700/50">
                <TabsTrigger
                  value="experience"
                  className="rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:data-[state=active]:bg-blue-500 data-[state=active]:shadow-md transition-all duration-300"
                >
                  {t.tabExperience}
                </TabsTrigger>
                <TabsTrigger
                  value="education"
                  className="rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:data-[state=active]:bg-blue-500 data-[state=active]:shadow-md transition-all duration-300"
                >
                  {t.tabEducation}
                </TabsTrigger>
                <TabsTrigger
                  value="certifications"
                  className="rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:data-[state=active]:bg-blue-500 data-[state=active]:shadow-md transition-all duration-300"
                >
                  {t.tabCertificates}
                </TabsTrigger>
              </TabsList>
            </div>

            <div ref={ref} className="relative max-w-5xl mx-auto">
              {/* Premium Gradient Timeline Line (Desktop Only) */}
              <div className="hidden lg:block absolute left-[25%] top-10 bottom-10 w-px bg-gradient-to-b from-transparent via-blue-500/30 to-transparent" />

              <TabsContent
                value="experience"
                className="mt-0 opacity-100 transition-opacity duration-500"
              >
                <div className="flex flex-col">
                  {sortedExperiences.map((experience, index) => {
                    const dateText = `${experience.startDate} - ${
                      experience.endDate.toLowerCase() === "present"
                        ? t.present
                        : experience.endDate
                    }`;

                    return (
                      <JourneyCard key={`exp-${index}`} dateText={dateText} logo={experience.logo}>
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                          {experience.role}
                        </h3>

                        <h4 className="flex flex-wrap items-center gap-3 text-sm sm:text-base font-bold tracking-wide text-slate-600 dark:text-slate-300 mb-6">
                          <span>{experience.company}</span>
                          <span className="lg:hidden inline-block px-3 py-1 bg-slate-100/80 dark:bg-slate-800/80 rounded-full text-[10px] font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50">
                            {dateText}
                          </span>
                        </h4>

                        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                          {experience.description}
                        </p>

                        {experience.achievements && experience.achievements.length > 0 && (
                          <ul className="mb-8 space-y-3">
                            {experience.achievements.map((achievement, actIndex) => (
                              <li
                                key={actIndex}
                                className="relative pl-6 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed"
                              >
                                <span className="absolute left-0 top-2 w-1.5 h-1.5 rounded-full bg-blue-500/60" />
                                {achievement}
                              </li>
                            ))}
                          </ul>
                        )}

                        {experience.technologies && experience.technologies.length > 0 && (
                          <motion.div 
                            variants={tagContainerVariants}
                            className="flex flex-wrap items-center gap-2 mt-auto pt-4"
                          >
                            {experience.technologies.map((tech: string, techIndex: number) => (
                              <motion.span
                                key={techIndex}
                                variants={tagVariants}
                                className="rounded-full border border-blue-200/60 bg-white/50 px-3 py-1 text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-slate-600 shadow-sm backdrop-blur-sm transition-colors hover:bg-blue-50 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-300 dark:hover:bg-slate-800"
                              >
                                {tech}
                              </motion.span>
                            ))}
                          </motion.div>
                        )}
                      </JourneyCard>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent
                value="education"
                className="mt-0 transition-opacity duration-500"
              >
                <div className="flex flex-col">
                  {sortedDegrees.map((item, index) => {
                    const courses = item.courses ?? [];
                    const dateText = `${item.startDate ? `${item.startDate.slice(-4)} - ` : ""}${item.endDate?.slice(-4)}`;

                    return (
                      <JourneyCard key={`degree-${index}`} dateText={dateText} logo={item.logo}>
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                          {item.degree}
                        </h3>

                        <h4 className="flex flex-wrap items-center gap-3 text-sm sm:text-base font-bold tracking-wide text-slate-600 dark:text-slate-300 mb-6">
                          <span>{item.institution}</span>
                          <span className="lg:hidden inline-block px-3 py-1 bg-slate-100/80 dark:bg-slate-800/80 rounded-full text-[10px] font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50">
                            {dateText}
                          </span>
                        </h4>

                        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                          {item.description}
                        </p>

                        {courses.length > 0 && (
                          <div className="flex flex-col mb-8 mt-auto pt-4">
                            <button
                              onClick={() => toggleCourses(index)}
                              className="lg:hidden flex items-center justify-between w-fit gap-3 py-1.5 mb-3 text-[10px] font-bold tracking-widest uppercase text-slate-900 dark:text-white border-b border-slate-200/50 dark:border-slate-800/50 group/btn"
                            >
                              <span>{t.coursework}</span>
                              <span className="text-blue-600 text-lg leading-none font-light group-hover/btn:text-blue-700">
                                {expandedCourses.includes(index) ? "−" : "+"}
                              </span>
                            </button>

                            <p className="hidden lg:block text-[10px] font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500 mb-4">
                              {t.coursework}
                            </p>

                            <motion.div
                              variants={tagContainerVariants}
                              className={`${expandedCourses.includes(index) ? "flex" : "hidden"} lg:flex flex-wrap items-center gap-2`}
                            >
                              {courses.map((course: string, courseIndex: number) => (
                                <motion.span
                                  key={courseIndex}
                                  variants={tagVariants}
                                  className="rounded-full border border-slate-200/60 bg-slate-50/50 px-3 py-1 text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-slate-600 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-300"
                                >
                                  {course}
                                </motion.span>
                              ))}
                            </motion.div>
                          </div>
                        )}

                        {item.website && (
                          <div className="mt-4 inline-flex">
                            <Link
                              href={item.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group/link inline-flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white"
                            >
                              <span className="pb-0.5 border-b-2 border-transparent transition-colors group-hover/link:border-blue-500">
                                {t.institutionWebsite}
                              </span>
                              <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1 text-blue-600" />
                            </Link>
                          </div>
                        )}
                      </JourneyCard>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent
                value="certifications"
                className="mt-0 opacity-100 transition-opacity duration-500"
              >
                <div className="flex flex-col">
                  {sortedCerts.map((item, index) => {
                    const dateText = item.endDate.slice(-4);
                    return (
                      <JourneyCard key={`cert-${index}`} dateText={dateText} logo={item.logo}>
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                          {item.degree}
                        </h3>

                        <h4 className="flex flex-wrap items-center gap-3 text-sm sm:text-base font-bold tracking-wide text-slate-600 dark:text-slate-300 mb-6">
                          <span>{item.institution}</span>
                          <span className="lg:hidden inline-block px-3 py-1 bg-slate-100/80 dark:bg-slate-800/80 rounded-full text-[10px] font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50">
                            {dateText}
                          </span>
                        </h4>

                        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                          {item.description}
                        </p>

                        {item.website && (
                          <div className="mt-auto inline-flex pt-4">
                            <Link
                              href={item.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group/link inline-flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white"
                            >
                              <span className="pb-0.5 border-b-2 border-transparent transition-colors group-hover/link:border-blue-500">
                                {t.viewCertificate}
                              </span>
                              <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1 text-blue-600" />
                            </Link>
                          </div>
                        )}
                      </JourneyCard>
                    );
                  })}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </motion.div>
      </div>
    </section>
  );
}
