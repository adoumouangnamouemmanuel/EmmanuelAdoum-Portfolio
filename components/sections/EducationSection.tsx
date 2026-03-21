"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { education } from "@/data/education";

export default function EducationSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  };

  const degrees = education.filter((item) => item.type === "degree");
  const certifications = education.filter((item) => item.type === "certification");

  return (
    <section id="education" className="py-20 lg:py-32 bg-white dark:bg-slate-900 relative overflow-hidden">
      <div className="section-container pl-4 pr-10 sm:pl-6 sm:pr-12 md:pr-16 lg:pl-8 lg:pr-24 xl:pr-32 max-w-7xl mx-auto">
        
        <div className="flex flex-col items-start mb-16 lg:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-4 lg:mb-5"
          >
            <p className="inline-flex items-center rounded-full border border-blue-200/60 bg-blue-50/50 backdrop-blur-md px-4 py-1.5 text-xs font-bold tracking-widest uppercase text-blue-700 shadow-sm dark:border-blue-900/60 dark:bg-blue-900/20 dark:text-blue-400">
              Education
            </p>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl lg:text-5xl font-bold tracking-tighter text-slate-900 dark:text-white"
          >
            Academic{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              Background
            </span>
          </motion.h2>
        </div>

        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="flex flex-col"
        >
          {degrees.map((item, index) => (
            <motion.div
              key={`degree-${index}`}
              variants={itemVariants}
              className="group relative flex flex-col lg:flex-row gap-4 lg:gap-12 py-10 lg:py-16 border-t border-slate-200 dark:border-slate-800/60 first:border-0"
            >
              {/* Left Column: Dates */}
              <div className="lg:w-1/4 flex-shrink-0">
                <p className="text-xs sm:text-sm font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500 mb-2 mt-1 lg:mt-2 lg:sticky lg:top-8">
                  {item.startDate} — {item.endDate}
                </p>
              </div>

              {/* Right Column: Details */}
              <div className="lg:w-3/4 flex flex-col">
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1 lg:mb-2 leading-tight">
                  {item.degree}
                </h3>
                <h4 className="text-base sm:text-lg font-bold tracking-wide uppercase text-blue-600 dark:text-blue-400 mb-6 lg:mb-8">
                  {item.institution}
                </h4>

                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-6 lg:mb-8">
                  {item.description}
                </p>

                {item.courses && item.courses.length > 0 && (
                  <div className="flex flex-col mb-8 lg:mb-12">
                     <p className="text-xs font-bold tracking-widest uppercase text-slate-900 dark:text-white mb-4">Relevant Coursework</p>
                     <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                      {item.courses.map((course: string, courseIndex: number) => (
                        <div key={courseIndex} className="flex items-center">
                          <span className="text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {course}
                          </span>
                          {courseIndex < item.courses.length - 1 && (
                            <span className="mx-2 sm:mx-3 text-slate-200 dark:text-slate-800">·</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {item.website && (
                  <div className="mt-auto inline-flex">
                    <Link
                      href={item.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/btn inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white overflow-hidden relative"
                    >
                      <span className="relative z-10 pb-1 border-b-2 border-slate-900 dark:border-white transition-colors group-hover/btn:border-blue-600 dark:group-hover/btn:border-blue-400">
                        Institution Website
                      </span>
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 text-blue-600 dark:text-blue-400" />
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {certifications.length > 0 && (
             <motion.div variants={itemVariants} className="pt-16 pb-6 border-t border-slate-200 dark:border-slate-800/60">
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-10">Certifications & Training</h3>
             </motion.div>
          )}

          {certifications.map((item, index) => (
            <motion.div
              key={`cert-${index}`}
              variants={itemVariants}
              className="group relative flex flex-col lg:flex-row gap-4 lg:gap-12 py-10 lg:py-16 border-t border-slate-200 dark:border-slate-800/60"
            >
              <div className="lg:w-1/4 flex-shrink-0">
                <p className="text-xs sm:text-sm font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500 mb-2 mt-1 lg:mt-2 lg:sticky lg:top-8">
                  {item.endDate}
                </p>
              </div>

              <div className="lg:w-3/4 flex flex-col">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-1 lg:mb-2 leading-tight">
                  {item.degree}
                </h3>
                <h4 className="text-sm sm:text-base font-bold tracking-wide uppercase text-blue-600 dark:text-blue-400 mb-6 lg:mb-8">
                  {item.institution}
                </h4>

                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-6 lg:mb-8">
                  {item.description}
                </p>
                
                {item.website && (
                  <div className="mt-auto inline-flex">
                    <Link
                      href={item.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/btn inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white overflow-hidden relative"
                    >
                      <span className="relative z-10 pb-1 border-b-2 border-slate-900 dark:border-white transition-colors group-hover/btn:border-blue-600 dark:group-hover/btn:border-blue-400">
                        View Certificate
                      </span>
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 text-blue-600 dark:text-blue-400" />
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}