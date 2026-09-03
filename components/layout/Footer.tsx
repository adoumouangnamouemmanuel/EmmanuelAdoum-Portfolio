"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import PortfolioViews from "./PortfolioViews";
import Link from "next/link";
import { useState, useEffect } from "react";

type Locale = "en" | "fr";

function LiveClock({ locale }: { locale: string }) {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) return <div className="h-7"></div>; // avoid hydration mismatch, preserve layout height

  const timeString = time.toLocaleTimeString(
    locale === "fr" ? "fr-FR" : "en-US",
    {
      timeZone: "Africa/Accra",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: locale !== "fr", // 24h format for FR
    }
  );

  return (
    <div className="flex items-center gap-2 text-slate-900 dark:text-white font-mono text-lg sm:text-xl">
      <span className="relative flex h-2 w-2 mr-2 mt-0.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
      </span>
      {timeString}
    </div>
  );
}

export default function Footer({ locale = "en" }: { locale?: Locale }) {
  const currentYear = new Date().getFullYear();
  const basePath = locale === "fr" ? "/fr" : "";

  const t =
    locale === "fr"
      ? {
          quickLinks: "Navigation",
          socials: "Réseaux",
          localTime: "Heure locale (Accra, GMT)",
          email: "Email",
          builtBy: "Créé par Emmanuel Adoum",
          links: [
            { name: "Accueil", href: "#home" },
            { name: "Projets", href: "#projects" },
            { name: "Parcours", href: "#journey" },
            { name: "Distinctions", href: "#achievements" },
          ],
        }
      : {
          quickLinks: "Quick Links",
          socials: "Socials",
          localTime: "Local Time (Accra, GMT)",
          email: "Email",
          builtBy: "Built by Emmanuel Adoum",
          links: [
            { name: "Home", href: "#home" },
            { name: "Projects", href: "#projects" },
            { name: "Journey", href: "#journey" },
            { name: "Awards", href: "#achievements" },
          ],
        };

  return (
    <footer className="bg-slate-50 dark:bg-slate-950 pt-20 pb-10 relative overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16">
        
        {/* Main Footer Content Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 lg:gap-8 mb-20">
          
          {/* Quick Links Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="col-span-1 flex flex-col gap-4"
          >
            <h3 className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500 mb-2">
              {t.quickLinks}
            </h3>
            <ul className="flex flex-col gap-3">
              {t.links.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Socials Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="col-span-1 flex flex-col gap-4"
          >
            <h3 className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500 mb-2">
              {t.socials}
            </h3>
            <div className="flex flex-col gap-4">
              <a
                href="https://github.com/adoumouangnamouemmanuel"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 w-fit text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-200/50 dark:bg-slate-800/50 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                  <Github className="w-4 h-4" />
                </div>
                <span>GitHub</span>
              </a>
              <a
                href="https://linkedin.com/in/emmanueladoum"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 w-fit text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-200/50 dark:bg-slate-800/50 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                  <Linkedin className="w-4 h-4" />
                </div>
                <span>LinkedIn</span>
              </a>
              <a
                href="mailto:emmanuel.adoum@ashesi.edu.gh"
                className="group flex items-center gap-3 w-fit text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-200/50 dark:bg-slate-800/50 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <span>{t.email}</span>
              </a>
            </div>
          </motion.div>

          {/* Timezone Clock Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="col-span-2 md:col-span-1 flex flex-col gap-4 md:items-end mt-8 md:mt-0"
          >
            <div className="flex flex-col gap-2 md:items-end">
              <h3 className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500 mb-2">
                {t.localTime}
              </h3>
              <LiveClock locale={locale} />
            </div>
          </motion.div>

        </div>

        {/* Razor-thin Copyright Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-slate-200 dark:border-slate-800/60 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-slate-400 dark:text-slate-600"
        >
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <span>© {currentYear}</span>
            <span className="hidden sm:block text-slate-300 dark:text-slate-700">
              ·
            </span>
            <a
              href="https://github.com/adoumouangnamouemmanuel/EmmanuelAdoum-Portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {t.builtBy}
            </a>
          </div>

          <PortfolioViews />
        </motion.div>
      </div>
    </footer>
  );
}
