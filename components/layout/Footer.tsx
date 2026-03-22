"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";
import PortfolioViews from "./PortfolioViews";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 dark:bg-slate-950 pt-24 lg:pt-40 pb-10 relative overflow-hidden border-t border-slate-200 dark:border-slate-800/60 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 flex flex-col items-center">
        
        {/* The Massive Call To Action */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 lg:mb-24"
        >
          <p className="text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-blue-600 dark:text-blue-400 mb-6 lg:mb-8">
            Available for Impactful Opportunities
          </p>
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tighter text-slate-900 dark:text-white leading-[1.1]">
            Let's build something <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 pr-2">
              extraordinary.
            </span>
          </h2>
        </motion.div>

        {/* Minimalist Social Row */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-8 mb-24 lg:mb-32"
        >
          <a
            href="https://github.com/emmanueladoumemmanuel"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-900/50 hover:shadow-lg transition-all duration-300 group"
          >
            <Github className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-300" />
            <span>GitHub</span>
          </a>
          <a
            href="https://linkedin.com/in/emmanueladoum"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-900/50 hover:shadow-lg transition-all duration-300 group"
          >
            <Linkedin className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-300" />
            <span>LinkedIn</span>
          </a>
          <a
            href="https://twitter.com/emmanueladoum"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-900/50 hover:shadow-lg transition-all duration-300 group"
          >
            <Twitter className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-300" />
            <span>Twitter</span>
          </a>
          <a
            href="mailto:emmanuel.adoum@ashesi.edu.gh"
            className="flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-900/50 hover:shadow-lg transition-all duration-300 group"
          >
            <Mail className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-300" />
            <span>Email</span>
          </a>
        </motion.div>

        {/* Razor-thin Copyright Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-slate-200 dark:border-slate-800/60 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-slate-400 dark:text-slate-600"
        >
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <span>© {currentYear}</span>
            <span className="hidden sm:block text-slate-300 dark:text-slate-700">·</span>
            <a 
              href="https://github.com/emmanueladoumemmanuel/EmmanuelAdoum-Portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Built by Emmanuel Adoum
            </a>
          </div>
          
          <PortfolioViews />
        </motion.div>
      </div>
    </footer>
  );
}