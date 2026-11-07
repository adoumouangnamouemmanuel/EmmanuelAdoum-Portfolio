"use client";

import { animate, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Locale = "en" | "fr";

type Stat = { value: number; suffix?: string; label: string };

const statsEn: Stat[] = [
  { value: 4, label: "Industry roles" },
  { value: 10, suffix: "+", label: "Projects shipped" },
  { value: 400, suffix: "+", label: "Students led" },
  { value: 3, label: "Competition wins" },
];

const statsFr: Stat[] = [
  { value: 4, label: "Expériences en entreprise" },
  { value: 10, suffix: "+", label: "Projets réalisés" },
  { value: 400, suffix: "+", label: "Étudiants représentés" },
  { value: 3, label: "Compétitions gagnées" },
];

function CountUp({ to, suffix = "", start }: { to: number; suffix?: string; start: boolean }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!start) return;
    const controls = animate(0, to, {
      duration: 1.1,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [start, to]);

  return (
    <>
      {display}
      {suffix}
    </>
  );
}

export default function StatsStrip({ locale = "en" }: { locale?: Locale }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const stats = locale === "fr" ? statsFr : statsEn;

  return (
    <section aria-label={locale === "fr" ? "Chiffres clés" : "Key numbers"} className="relative px-4 py-6 sm:px-6 lg:px-8">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto grid max-w-6xl grid-cols-2 overflow-hidden rounded-[20px] border border-slate-200/70 bg-white/80 shadow-[0_8px_32px_rgba(15,23,42,0.10)] backdrop-blur-[3px] dark:border-white/15 dark:bg-white/[0.06] md:grid-cols-4"
      >
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`flex flex-col items-center justify-center gap-1 px-4 py-6 text-center sm:py-8 ${
              i % 2 === 0 ? "border-r" : ""
            } ${i < 2 ? "border-b md:border-b-0" : ""} ${i === 1 ? "md:border-r" : ""} border-slate-200/70 dark:border-white/10`}
          >
            <span className="font-display text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl lg:text-5xl">
              <CountUp to={stat.value} suffix={stat.suffix} start={inView} />
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400 sm:text-sm">
              {stat.label}
            </span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
