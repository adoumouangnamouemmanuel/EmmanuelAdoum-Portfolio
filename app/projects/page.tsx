"use client";

import { projects, projectsFr } from "@/data/projects";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Filter,
  Github,
  Search,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";

export default function ProjectsPage() {
  const pathname = usePathname();
  const isFr = pathname?.startsWith("/fr");
  const basePath = pathname?.startsWith("/fr") ? "/fr" : "";
  const typedProjects = isFr ? projectsFr : projects;
  const t = isFr
    ? {
        backHome: "Retour accueil",
        titleLead: "Les",
        titleAccent: "projets.",
        subtitle:
          "Analyses techniques, études de cas et systèmes conçus à la frontière de l'ingénierie web.",
        search: "Rechercher dans l'archive...",
        filterLibrary: "Filtrer la bibliothèque",
        allIndex: "Tout l'index",
        filterByTech: "Filtrer par techno",
        clearAll: "Tout effacer",
        all: "Tout",
        exploreProject: "Explorer",
        noMatchTitle: "Aucun résultat.",
        noMatchBody:
          "Aucun projet ne correspond à vos critères de recherche ou de filtre.",
        resetFilters: "Réinitialiser",
      }
    : {
        backHome: "Return Home",
        titleLead: "The",
        titleAccent: "Archive.",
        subtitle:
          "Deep technical dives, architectural patterns, and systemic insights from the frontier of web engineering.",
        search: "Search the archive...",
        filterLibrary: "Filter Library",
        allIndex: "All Index",
        filterByTech: "Filter by Tech",
        clearAll: "Clear All",
        all: "All",
        exploreProject: "Explore Project",
        noMatchTitle: "No match found.",
        noMatchBody:
          "The archive couldn't locate any projects matching your parameters.",
        resetFilters: "Reset Filters",
      };

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [searchQuery, setSearchQuery] = useState("");
  // Upgraded to multi-select array
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>(
    [],
  );
  // Mobile Dropdown State
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const allTechnologies = Array.from(
    new Set(typedProjects.flatMap((project) => project.technologies)),
  );

  const filteredProjects = typedProjects.filter((project) => {
    const matchesSearch =
      searchQuery === "" ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTechnology =
      selectedTechnologies.length === 0 ||
      selectedTechnologies.some((tech) => project.technologies.includes(tech));

    return matchesSearch && matchesTechnology;
  });

  const toggleTechnology = (tech: string) => {
    if (selectedTechnologies.includes(tech)) {
      setSelectedTechnologies(selectedTechnologies.filter((t) => t !== tech));
    } else {
      setSelectedTechnologies([...selectedTechnologies, tech]);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Hyper-Minimalist Hero */}
      <section className="pt-32 lg:pt-48 pb-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <Link
              href={basePath || "/"}
              className="inline-flex items-center text-[10px] sm:text-xs font-bold tracking-widest uppercase text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
            >
              <ArrowLeft className="mr-3 h-4 w-4 group-hover:-translate-x-2 transition-transform duration-300" />
              {t.backHome}
            </Link>
          </motion.div>

          <div className="max-w-4xl">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl sm:text-8xl lg:text-9xl font-bold tracking-tighter text-slate-900 dark:text-white mb-8 leading-[0.9]"
            >
              {t.titleLead}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 border-b-4 border-indigo-600/20 pb-2">
                {t.titleAccent}
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative max-w-xl group mt-16"
            >
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" />
              <input
                type="text"
                placeholder={t.search}
                className="w-full pl-16 pr-6 py-4 rounded-full border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl shadow-sm focus:shadow-md focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400 text-sm sm:text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Gallery Section */}
      <section className="pb-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pt-8">
          {/* Mobile Filter Dropdown */}
          <div className="block lg:hidden mb-8">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-full flex items-center justify-between px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-slate-700 dark:text-slate-300 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <Filter className="w-4 h-4 text-blue-600" />
                {t.filterLibrary}{" "}
                {selectedTechnologies.length > 0 && (
                  <span className="text-blue-600">
                    ({selectedTechnologies.length})
                  </span>
                )}
              </div>
              {isFilterOpen ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  className="overflow-hidden mt-3"
                >
                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap gap-2 shadow-sm">
                    <button
                      onClick={() => setSelectedTechnologies([])}
                      className={`px-4 py-2 rounded-full text-[9px] font-bold tracking-widest uppercase transition-colors ${
                        selectedTechnologies.length === 0
                          ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                      }`}
                    >
                      {t.allIndex}
                    </button>
                    {allTechnologies.map((tech, i) => (
                      <button
                        key={i}
                        onClick={() => toggleTechnology(tech)}
                        className={`px-4 py-2 rounded-full text-[9px] font-bold tracking-widest uppercase transition-colors ${
                          selectedTechnologies.includes(tech)
                            ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                        }`}
                      >
                        {tech}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Filter Dropdown */}
          <div className="hidden lg:block mb-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-slate-700 dark:text-slate-300 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                <Filter className="w-4 h-4 text-blue-600" />
                {t.filterByTech}{" "}
                {selectedTechnologies.length > 0 && (
                  <span className="ml-1 px-2 py-0.5 rounded-full bg-blue-600 text-white text-[9px]">
                    {selectedTechnologies.length}
                  </span>
                )}
                {isFilterOpen ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              {selectedTechnologies.length > 0 && (
                <button
                  onClick={() => setSelectedTechnologies([])}
                  className="text-[10px] font-bold tracking-widest uppercase text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {t.clearAll}
                </button>
              )}
            </div>
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  className="overflow-hidden mt-3"
                >
                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap gap-2 shadow-sm">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedTechnologies([])}
                      className={`px-5 py-2.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all duration-300 ${
                        selectedTechnologies.length === 0
                          ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:border-slate-300"
                      }`}
                    >
                      {t.all}
                    </motion.button>
                    {allTechnologies.map((tech, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleTechnology(tech)}
                        className={`px-5 py-2.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all duration-300 ${
                          selectedTechnologies.includes(tech)
                            ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:border-slate-300"
                        }`}
                      >
                        {tech}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* The Magic Hover Grid */}
          <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={containerVariants}
          >
            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 pl-0">
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="group relative rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-900 aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] shadow-sm hover:shadow-2xl transition-all duration-700"
                  >
                    <Image
                      src={project.image || "/images/posts/blog.png"}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-[1.5s] ease-[0.16,1,0.3,1] group-hover:scale-110"
                    />

                    {/* The Cinematic Glass Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 backdrop-blur-[2px] pointer-events-none" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                    {/* Hidden Hover Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-10 opacity-0 translate-y-12 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700 ease-[0.16,1,0.3,1]">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies
                          .slice(0, 3)
                          .map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[9px] sm:text-[10px] font-bold tracking-widest uppercase text-white shadow-xl"
                            >
                              {tech}
                            </span>
                          ))}
                      </div>

                      <Link
                        href={`${basePath}/projects/${project.slug}`}
                        className="block"
                      >
                        <h3 className="text-3xl sm:text-4xl font-bold text-white mb-3 hover:text-blue-300 transition-colors">
                          {project.title}
                        </h3>
                      </Link>

                      <p className="text-slate-300 text-sm sm:text-base line-clamp-2 mb-8 font-light max-w-md">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-4">
                        <Link href={`${basePath}/projects/${project.slug}`}>
                          <button className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 rounded-full bg-white text-slate-900 text-[10px] sm:text-xs font-bold tracking-widest uppercase hover:bg-blue-600 hover:text-white transition-colors duration-300">
                            {t.exploreProject}
                          </button>
                        </Link>
                        {project.github && (
                          <Link
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <button className="flex items-center justify-center p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-slate-900 transition-colors duration-300">
                              <Github className="w-5 h-5" />
                            </button>
                          </Link>
                        )}
                        {project.demo && (
                          <Link
                            href={project.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <button className="flex items-center justify-center p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-slate-900 transition-colors duration-300">
                              <ExternalLink className="w-5 h-5" />
                            </button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                variants={itemVariants}
                className="py-32 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800"
              >
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 tracking-tighter">
                  {t.noMatchTitle}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">
                  {t.noMatchBody}
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedTechnologies([]);
                  }}
                  className="px-8 py-4 rounded-full border border-slate-200 dark:border-slate-800 text-[10px] sm:text-xs font-bold tracking-widest uppercase hover:bg-slate-100 dark:hover:bg-slate-950 transition-colors"
                >
                  {t.resetFilters}
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
    </main>
  );
}
