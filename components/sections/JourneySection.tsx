"use client";

import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { experiences } from "@/data/experiences";
import { education } from "@/data/education";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function JourneySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [activeTab, setActiveTab] = useState("experience");

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  };

  // Sort logic -> Newest first based on endDate. (For 'Present', it counts essentially as infinity).
  const getYear = (dateStr?: string) => {
    if (!dateStr) return 0;
    if (dateStr.toLowerCase() === "present") return 9999;
    return parseInt(dateStr.slice(-4)) || 0;
  };

  const sortedExperiences = [...experiences].sort((a, b) => getYear(b.endDate) - getYear(a.endDate));
  
  const degrees = education.filter((item) => item.type === "degree");
  const sortedDegrees = [...degrees].sort((a, b) => getYear(b.endDate) - getYear(a.endDate));
  
  const certifications = education.filter((item) => item.type === "certification");
  const sortedCerts = [...certifications].sort((a, b) => getYear(b.endDate) - getYear(a.endDate));

  return (
    <section id="journey" className="py-20 lg:py-32 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      <div className="section-container pl-4 pr-10 sm:pl-6 sm:pr-12 md:pr-16 lg:pl-8 lg:pr-24 xl:pr-32 max-w-7xl mx-auto">
        
        <div className="flex flex-col items-center text-center mb-16 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-4 lg:mb-5"
          >
            <p className="inline-flex items-center rounded-full border border-blue-200/60 bg-blue-50/50 backdrop-blur-md px-4 py-1.5 text-xs font-bold tracking-widest uppercase text-blue-700 shadow-sm dark:border-blue-900/60 dark:bg-blue-900/20 dark:text-blue-400">
              My Journey
            </p>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl lg:text-5xl font-bold tracking-tighter text-slate-900 dark:text-white"
          >
            Professional {" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              Path
            </span>
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-12 flex justify-center"
        >
          <Tabs defaultValue="experience" className="w-full max-w-5xl" onValueChange={setActiveTab}>
            <div className="flex justify-center mb-16 px-2 sm:px-0">
              <TabsList className="grid grid-cols-3 w-full max-w-[550px] h-14 p-1 bg-slate-200/60 dark:bg-slate-800/60 rounded-2xl shadow-inner border border-slate-300/50 dark:border-slate-700/50">
                <TabsTrigger 
                  value="experience" 
                  className="rounded-xl text-[9px] sm:text-[11px] font-bold uppercase tracking-widest data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-sm transition-all"
                >
                  Experience
                </TabsTrigger>
                <TabsTrigger 
                  value="education" 
                  className="rounded-xl text-[9px] sm:text-[11px] font-bold uppercase tracking-widest data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-sm transition-all"
                >
                  Education
                </TabsTrigger>
                <TabsTrigger 
                  value="certifications" 
                  className="rounded-xl text-[9px] sm:text-[11px] font-bold uppercase tracking-widest data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-sm transition-all"
                >
                  Certificates
                </TabsTrigger>
              </TabsList>
            </div>

            <div ref={ref} className="relative">
              {/* Central beautiful architectural timeline line on desktop */}
              <div className="hidden lg:block absolute left-[25%] top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-800" />

              <TabsContent value="experience" className="mt-0 opacity-100 transition-opacity duration-500">
                <div className="flex flex-col">
                  {sortedExperiences.map((experience, index) => {
                    const currentYear = getYear(experience.endDate);
                    const previousYear = index > 0 ? getYear(sortedExperiences[index - 1].endDate) : null;
                    const isSameYear = currentYear === previousYear;

                    return (
                    <motion.div
                      key={`exp-${index}`}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: "-50px" }}
                      variants={itemVariants}
                      className="group relative flex gap-6 lg:gap-0 py-10 lg:py-16 border-t border-slate-200 dark:border-slate-800/60 lg:border-t-0"
                    >
                      {/* Left Column: Dates (Desktop Only) */}
                      <div className="hidden lg:block lg:w-1/4 flex-shrink-0 lg:pr-12 lg:text-right relative">
                         <div className="absolute top-[10px] -right-[5px] w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700 transition-colors group-hover:bg-blue-500" />
                         
                         <p className={`text-sm font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500 sticky top-8 transition-colors group-hover:text-blue-500 ${isSameYear ? 'lg:opacity-0' : ''}`}>
                          {experience.startDate.slice(-4)} — {experience.endDate.slice(-4) === 'sent' ? 'PRESENT' : experience.endDate.slice(-4)}
                        </p>
                      </div>

                      {/* Right Column: Details */}
                      <div className="w-full lg:w-3/4 flex flex-col lg:pl-12">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4 mb-2">
                          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {experience.role}
                          </h3>
                          {/* Mobile Date Badge */}
                          <div className="lg:hidden shrink-0 mt-1 mb-2 sm:mb-0">
                             {!isSameYear && (
                               <span className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-800/80 rounded-full text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                 {experience.startDate.slice(-4)} — {experience.endDate.slice(-4) === 'sent' ? 'PRESENT' : experience.endDate.slice(-4)}
                               </span>
                             )}
                          </div>
                        </div>
                        
                        <h4 className="text-sm sm:text-base font-bold tracking-wide text-slate-600 dark:text-slate-300 mb-6 lg:mb-8">
                          {experience.company}
                        </h4>

                        <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-6 lg:mb-8">
                          {experience.description}
                        </p>

                        {experience.achievements && experience.achievements.length > 0 && (
                          <ul className="mb-8 lg:mb-10 space-y-3 lg:space-y-4">
                            {experience.achievements.map((achievement, actIndex) => (
                              <li key={actIndex} className="relative pl-6 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed group-hover:text-slate-800 dark:group-hover:text-slate-300 transition-colors">
                                <span className="absolute left-0 top-2.5 w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 opacity-60 group-hover:scale-125 group-hover:opacity-100 transition-all" />
                                {achievement}
                              </li>
                            ))}
                          </ul>
                        )}

                        {experience.technologies && experience.technologies.length > 0 && (
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-auto">
                            {experience.technologies.map((tech: string, techIndex: number) => (
                              <div key={techIndex} className="flex items-center">
                                <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                  {tech}
                                </span>
                                {techIndex < experience.technologies.length - 1 && (
                                  <span className="mx-2 sm:mx-3 text-slate-200 dark:text-slate-800">·</span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )})}
                </div>
              </TabsContent>

              <TabsContent value="education" className="mt-0 transition-opacity duration-500">
                <div className="flex flex-col">
                  {sortedDegrees.map((item, index) => {
                    const currentYear = getYear(item.endDate);
                    const previousYear = index > 0 ? getYear(sortedDegrees[index - 1].endDate) : null;
                    const isSameYear = currentYear === previousYear;
                    
                    return (
                    <motion.div
                      key={`degree-${index}`}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: "-50px" }}
                      variants={itemVariants}
                      className="group relative flex lg:flex-row gap-6 lg:gap-0 py-10 lg:py-16 border-t border-slate-200 dark:border-slate-800/60 lg:border-t-0"
                    >
                      <div className="hidden lg:block lg:w-1/4 flex-shrink-0 lg:pr-12 lg:text-right relative">
                         <div className="absolute top-[10px] -right-[5px] w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700 transition-colors group-hover:bg-blue-500" />
                         <p className={`text-sm font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500 sticky top-8 transition-colors group-hover:text-blue-500 ${isSameYear ? 'lg:opacity-0' : ''}`}>
                          {item.startDate ? `${item.startDate.slice(-4)} — ` : ""}{item.endDate?.slice(-4)}
                        </p>
                      </div>

                      <div className="w-full lg:w-3/4 flex flex-col lg:pl-12">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4 mb-2">
                          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {item.degree}
                          </h3>
                          <div className="lg:hidden shrink-0 mt-1 mb-2 sm:mb-0">
                             {!isSameYear && (
                               <span className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-800/80 rounded-full text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                 {item.startDate ? `${item.startDate.slice(-4)} — ` : ""}{item.endDate?.slice(-4)}
                               </span>
                             )}
                          </div>
                        </div>

                        <h4 className="text-sm sm:text-base font-bold tracking-wide text-slate-600 dark:text-slate-300 mb-6 lg:mb-8">
                          {item.institution}
                        </h4>

                        <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-6 lg:mb-8">
                          {item.description}
                        </p>

                        {item.courses && item.courses.length > 0 && (
                          <div className="flex flex-col mb-8 lg:mb-10">
                             <p className="text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-slate-900 dark:text-white mb-4">Relevant Coursework</p>
                             <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                              {item.courses.map((course: string, courseIndex: number) => (
                                <div key={courseIndex} className="flex items-center">
                                  <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
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
                              className="group/btn inline-flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white overflow-hidden relative"
                            >
                              <span className="relative z-10 pb-1 border-b-[1.5px] border-slate-900 dark:border-white transition-colors group-hover/btn:border-blue-600 dark:group-hover/btn:border-blue-400">
                                Institution Website
                              </span>
                              <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 text-blue-600 dark:text-blue-400" />
                            </Link>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )})}
                </div>
              </TabsContent>

              <TabsContent value="certifications" className="mt-0 opacity-100 transition-opacity duration-500">
                <div className="flex flex-col">
                  {sortedCerts.map((item, index) => {
                    const currentYear = getYear(item.endDate);
                    const previousYear = index > 0 ? getYear(sortedCerts[index - 1].endDate) : null;
                    const isSameYear = currentYear === previousYear;
                    
                    return (
                    <motion.div
                      key={`cert-${index}`}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: "-50px" }}
                      variants={itemVariants}
                      className="group relative flex lg:flex-row gap-6 lg:gap-0 py-10 lg:py-16 border-t border-slate-200 dark:border-slate-800/60 lg:border-t-0 first:border-0"
                    >
                      <div className="hidden lg:block lg:w-1/4 flex-shrink-0 lg:pr-12 lg:text-right relative">
                         <div className="absolute top-[10px] -right-[5px] w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700 transition-colors group-hover:bg-blue-500" />
                         <p className={`text-sm font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500 sticky top-8 transition-colors group-hover:text-blue-500 ${isSameYear ? 'lg:opacity-0' : ''}`}>
                          {item.endDate.slice(-4)}
                        </p>
                      </div>

                      <div className="w-full lg:w-3/4 flex flex-col lg:pl-12">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4 mb-2">
                          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {item.degree}
                          </h3>
                          <div className="lg:hidden shrink-0 mt-1 mb-2 sm:mb-0">
                             {!isSameYear && (
                               <span className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-800/80 rounded-full text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                 {item.endDate.slice(-4)}
                               </span>
                             )}
                          </div>
                        </div>

                        <h4 className="text-sm sm:text-base font-bold tracking-wide text-slate-600 dark:text-slate-300 mb-4 lg:mb-6">
                          {item.institution}
                        </h4>

                        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-6 lg:mb-8">
                          {item.description}
                        </p>
                        
                        {item.website && (
                          <div className="mt-auto inline-flex">
                            <Link
                              href={item.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group/btn inline-flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white overflow-hidden relative"
                            >
                              <span className="relative z-10 pb-1 border-b-[1.5px] border-slate-900 dark:border-white transition-colors group-hover/btn:border-blue-600 dark:group-hover/btn:border-blue-400">
                                View Certificate
                              </span>
                              <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 text-blue-600 dark:text-blue-400" />
                            </Link>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )})}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </motion.div>
      </div>
    </section>
  );
}
