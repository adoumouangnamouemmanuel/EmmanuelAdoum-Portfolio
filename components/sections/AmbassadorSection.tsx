"use client";

import { AnthropicLogo, ClaudeLogo } from "@/components/icons/BrandLogos";
import { ambassador, ambassadorFr, type AmbassadorPillar } from "@/data/ambassador";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Hammer, Presentation, Users } from "lucide-react";
import Link from "next/link";

type Locale = "en" | "fr";

const pillarIcons: Record<AmbassadorPillar["icon"], React.ReactNode> = {
  workshop: <Presentation className="h-5 w-5" />,
  community: <Users className="h-5 w-5" />,
  build: <Hammer className="h-5 w-5" />,
};

const ease = [0.16, 1, 0.3, 1] as const;

export default function AmbassadorSection({ locale = "en" }: { locale?: Locale }) {
  const t = locale === "fr" ? ambassadorFr : ambassador;

  return (
    <section
      id="ambassador"
      className="relative overflow-hidden bg-transparent px-4 py-16 text-slate-950 dark:text-slate-100 sm:px-6 lg:px-8 lg:py-24"
    >
      {/* Warm Claude-coloured glow, distinct from the blue used elsewhere */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[520px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d97757]/10 blur-[120px] dark:bg-[#d97757]/[0.12]" />

      <div className="mx-auto max-w-6xl">
        {/* Section heading */}
        <div className="mb-12 flex flex-col items-center text-center lg:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#d97757]/30 bg-[#d97757]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#b85c3c] shadow-sm backdrop-blur-md dark:text-[#f0a184]"
          >
            <ClaudeLogo className="h-3.5 w-3.5" />
            {t.eyebrow}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.05, ease }}
            className="text-[clamp(1.5rem,3vw,2.5rem)] font-extrabold uppercase leading-tight tracking-normal"
          >
            {t.titleLead}{" "}
            <span className="bg-gradient-to-r from-[#d97757] to-[#e9a27c] bg-clip-text text-transparent">
              {t.titleAccent}
            </span>
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.55, ease }}
          className="relative overflow-hidden rounded-[20px] border border-slate-200/70 bg-gradient-to-br from-white/90 via-orange-50/50 to-white/80 shadow-[0_8px_32px_rgba(15,23,42,0.14)] backdrop-blur-[3px] dark:border-white/15 dark:from-white/10 dark:via-[#d97757]/[0.06] dark:to-white/[0.02] dark:shadow-[0_8px_32px_rgba(0,0,0,0.37)]"
        >
          {/* Oversized Claude mark as a watermark */}
          <ClaudeLogo
            title=""
            className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rotate-12 text-[#d97757]/[0.07] dark:text-[#d97757]/[0.08]"
          />

          {/* 1. Identity: who, where, since when */}
          <div className="relative flex flex-col gap-6 p-6 sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:p-12 lg:pb-8">
            <div className="flex items-center gap-4 text-left">
              <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-[#d97757] text-white shadow-lg shadow-[#d97757]/30">
                <ClaudeLogo className="h-9 w-9" />
              </span>
              <div>
                <p className="font-display text-2xl font-bold leading-tight sm:text-3xl">{t.role}</p>
                <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-semibold text-slate-600 dark:text-slate-400">
                  <AnthropicLogo className="h-3.5 w-3.5 text-slate-800 dark:text-slate-200" />
                  {t.organization}
                  <span className="opacity-50">•</span>
                  <span className="rounded-full bg-[#d97757]/10 px-2 py-0.5 text-xs text-[#b85c3c] dark:text-[#f0a184]">
                    {t.date}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href={t.ctaPrimary.href}
                className="group inline-flex h-11 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white/60 px-6 text-sm font-semibold text-slate-800 transition-colors hover:bg-white dark:border-white/20 dark:bg-white/5 dark:text-slate-100 dark:hover:bg-white/10"
              >
                {t.ctaPrimary.label}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          <p className="relative max-w-3xl px-6 text-left text-base leading-relaxed text-slate-700 dark:text-slate-300 sm:px-10 lg:px-12 lg:text-lg">
            {t.summary}
          </p>

          {t.highlights.length > 0 && (
            <dl className="relative mt-8 grid grid-cols-2 gap-4 px-6 sm:grid-cols-3 sm:px-10 lg:px-12">
              {t.highlights.map((h) => (
                <div key={h.label} className="rounded-xl border border-slate-200/70 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5">
                  <dt className="text-xs font-semibold text-slate-500 dark:text-slate-400">{h.label}</dt>
                  <dd className="mt-1 text-2xl font-extrabold text-[#c4623f] dark:text-[#f0a184]">{h.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {/* 2. What I do */}
          <div className="relative px-6 pb-8 pt-10 sm:px-10 lg:px-12">
            <p className="mb-4 text-left text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              {t.whatIDo}
            </p>
            <ul className="grid gap-4 md:grid-cols-3">
              {t.pillars.map((pillar, i) => (
                <motion.li
                  key={pillar.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.08 * i, ease }}
                  className="group flex flex-col gap-3 rounded-2xl border border-slate-200/70 bg-white/70 p-5 text-left transition-colors hover:border-[#d97757]/40 dark:border-white/10 dark:bg-slate-950/40 dark:hover:border-[#d97757]/40"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#d97757]/10 text-[#c4623f] transition-colors group-hover:bg-[#d97757] group-hover:text-white dark:text-[#f0a184]">
                    {pillarIcons[pillar.icon]}
                  </span>
                  <p className="font-bold text-slate-900 dark:text-slate-100">{pillar.title}</p>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {pillar.description}
                  </p>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* 3. Sign up call to action */}
          <div className="relative flex flex-col items-start gap-4 border-t border-[#d97757]/20 bg-[#d97757]/[0.08] px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-12">
            <div className="text-left">
              <p className="font-display text-lg font-bold">{t.signup.title}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">{t.signup.text}</p>
            </div>
            <a
              href={t.signup.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-full bg-[#d97757] px-6 text-sm font-semibold text-white shadow-lg shadow-[#d97757]/25 transition-all hover:scale-[1.03] hover:bg-[#c96a4b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d97757] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 sm:w-auto"
            >
              <ClaudeLogo className="h-4 w-4" />
              {t.signup.label}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
