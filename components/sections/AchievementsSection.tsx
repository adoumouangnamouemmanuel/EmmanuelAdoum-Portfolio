"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { leadership, leadershipFr, awards, awardsFr } from "@/data/achievements";
import { motion, useInView, useMotionTemplate, useMotionValue } from "framer-motion";
import { Medal, Star, Trophy, Award } from "lucide-react";
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

const iconMap = [Trophy, Medal, Star, Award];

function LeadershipCard({ item }: { item: any }) {
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
      variants={itemVariants}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="group relative overflow-hidden rounded-[24px] border border-slate-200/70 bg-gradient-to-br from-white/82 via-blue-50/48 to-white/68 p-6 shadow-[0_8px_32px_rgba(15,23,42,0.14)] backdrop-blur-[3px] transition-all duration-300 hover:border-slate-300 hover:shadow-[0_12px_40px_rgba(15,23,42,0.18)] dark:border-white/20 dark:from-white/10 dark:via-white/[0.04] dark:to-white/[0.02] dark:shadow-[0_8px_32px_rgba(0,0,0,0.37)] dark:hover:border-white/30 sm:p-8 w-full max-w-4xl mx-auto"
    >
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 hidden opacity-0 mix-blend-screen transition-opacity duration-300 group-hover:opacity-100 dark:block"
        style={{ background: bgDarkGlow }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:hidden"
        style={{ background: bgLightGlow }}
      />

      <div className="relative z-10 flex flex-col h-full">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
          {item.role}
        </h3>
        
        <h4 className="flex flex-wrap items-center gap-3 text-sm sm:text-base font-bold tracking-wide text-slate-600 dark:text-slate-300 mb-6">
          <span>{item.organization}</span>
          <span className="inline-block px-3 py-1 bg-slate-100/80 dark:bg-slate-800/80 rounded-full text-[10px] font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50">
            {item.date}
          </span>
        </h4>

        <ul className="space-y-3">
          {item.points.map((point: string, idx: number) => (
            <li
              key={idx}
              className="relative pl-6 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed"
            >
              <span className="absolute left-0 top-2 w-1.5 h-1.5 rounded-full bg-blue-500/60" />
              {point}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

function AwardCard({ item, index }: { item: any; index: number }) {
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

  const IconComponent = iconMap[index % iconMap.length];

  return (
    <motion.div
      variants={itemVariants}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="group relative overflow-hidden flex flex-col justify-between rounded-[20px] border border-slate-200/70 bg-gradient-to-br from-white/82 via-blue-50/48 to-white/68 p-6 shadow-[0_8px_32px_rgba(15,23,42,0.14)] backdrop-blur-[3px] transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_12px_40px_rgba(15,23,42,0.18)] dark:border-white/20 dark:from-white/10 dark:via-white/[0.04] dark:to-white/[0.02] dark:shadow-[0_8px_32px_rgba(0,0,0,0.37)] dark:hover:border-white/30"
    >
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 hidden opacity-0 mix-blend-screen transition-opacity duration-300 group-hover:opacity-100 dark:block"
        style={{ background: bgDarkGlow }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:hidden"
        style={{ background: bgLightGlow }}
      />

      <div className="relative z-10">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100/50 dark:bg-slate-800/50 border border-blue-200/50 dark:border-slate-700/50 shadow-sm transition-transform duration-300 group-hover:scale-110">
          <IconComponent className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-tight mb-2">
          {item.title}
        </h3>
        <p className="text-sm sm:text-base font-bold tracking-wide text-slate-600 dark:text-slate-300 mb-4">
          {item.issuer}
        </p>
      </div>
      <div className="relative z-10 mt-auto pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
        <span className="text-[11px] font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400">
          {item.date}
        </span>
      </div>
    </motion.div>
  );
}

export default function AchievementsSection({ locale = "en" }: { locale?: Locale }) {
  const t =
    locale === "fr"
      ? {
          eyebrow: "Impact & Reconnaissance",
          titleLead: "Leadership &",
          titleAccent: "Distinctions",
          tabLeadership: "Leadership",
          tabAwards: "Prix & Bourses",
        }
      : {
          eyebrow: "Impact & Recognition",
          titleLead: "Leadership &",
          titleAccent: "Awards",
          tabLeadership: "Leadership",
          tabAwards: "Awards",
        };

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [activeTab, setActiveTab] = useState("leadership");

  const leadershipData = locale === "fr" ? leadershipFr : leadership;
  const awardsData = locale === "fr" ? awardsFr : awards;

  return (
    <section
      id="achievements"
      className="py-16 lg:py-24 bg-transparent relative overflow-hidden"
    >
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
            defaultValue="leadership"
            className="w-full"
            onValueChange={setActiveTab}
          >
            <div className="flex justify-center mb-12 lg:mb-16 px-2 sm:px-0 z-20 relative">
              <TabsList className="grid grid-cols-2 w-full max-w-[400px] h-14 p-1.5 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.05)] border border-slate-200/80 dark:border-slate-700/50">
                <TabsTrigger
                  value="leadership"
                  className="rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:data-[state=active]:bg-blue-500 data-[state=active]:shadow-md transition-all duration-300"
                >
                  {t.tabLeadership}
                </TabsTrigger>
                <TabsTrigger
                  value="awards"
                  className="rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:data-[state=active]:bg-blue-500 data-[state=active]:shadow-md transition-all duration-300"
                >
                  {t.tabAwards}
                </TabsTrigger>
              </TabsList>
            </div>

            <div ref={ref} className="relative w-full">
              <TabsContent
                value="leadership"
                className="mt-0 opacity-100 transition-opacity duration-500"
              >
                <motion.div 
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  className="flex flex-col gap-6"
                >
                  {leadershipData.map((item, index) => (
                    <LeadershipCard key={`leadership-${index}`} item={item} />
                  ))}
                </motion.div>
              </TabsContent>

              <TabsContent
                value="awards"
                className="mt-0 transition-opacity duration-500"
              >
                <motion.div 
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.1
                      }
                    }
                  }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {awardsData.map((item, index) => (
                    <AwardCard key={`award-${index}`} item={item} index={index} />
                  ))}
                </motion.div>
              </TabsContent>
            </div>
          </Tabs>
        </motion.div>
      </div>
    </section>
  );
}
