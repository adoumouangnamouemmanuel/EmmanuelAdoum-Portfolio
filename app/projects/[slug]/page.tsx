"use client";

import { projects } from "@/data/projects";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  ArrowLeft, 
  ExternalLink, 
  Github, 
  Target, 
  Award, 
  Code,
  Zap, 
  Layers, 
  CheckCircle2,
  Calendar,
  Briefcase
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Project = {
  title: string;
  description: string;
  image: string;
  goal: string;
  outcome: string;
  technologies: string[];
  github?: string;
  demo?: string;
  featured: boolean;
  category?: string;
  client?: string;
  date?: string;
  content?: string;
  gallery?: { image: string; title: string }[];
  slug: string;
  challenges?: string[];
  solutions?: string[];
  developmentProcess?: string[];
  keyFeatures?: string[];
};

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string | undefined;

  const project = useMemo<Project | undefined>(
    () => (slug ? (projects.find((p) => p.slug === slug) as Project) : undefined),
    [slug]
  );
  
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    // Only redirect once slug is defined and no project is found
    if (slug && !project) {
      router.push("/projects");
    }
  }, [slug, project, router]);

  if (!project) return null;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 selection:bg-blue-200 dark:selection:bg-blue-900/50">
      
      {/* Stick Glass Action Bar */}
      <motion.div 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-12 py-4 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50"
      >
        <Link 
          href="/projects" 
          className="flex items-center gap-3 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center group-hover:bg-slate-200 dark:group-hover:bg-slate-800 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="hidden sm:block">Back to Archive</span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          {project.github && (
            <Link href={project.github} target="_blank" rel="noopener noreferrer">
              <button className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all duration-300">
                <Github className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </Link>
          )}
          {project.demo && project.demo !== project.github ? (
            <Link href={project.demo} target="_blank" rel="noopener noreferrer">
              <button className="flex items-center gap-2 sm:gap-3 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-[9px] sm:text-[10px] font-bold tracking-widest uppercase transition-all duration-300 shadow-lg shadow-blue-600/20">
                Live Demo
                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </Link>
          ) : project.github ? (
            <Link href={project.github} target="_blank" rel="noopener noreferrer">
              <button className="flex items-center gap-2 sm:gap-3 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-slate-700 hover:bg-slate-600 text-white text-[9px] sm:text-[10px] font-bold tracking-widest uppercase transition-all duration-300 shadow-lg">
                View on GitHub
                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </Link>
          ) : null}

        </div>
      </motion.div>

      {/* Massive Cinematic Hero */}
      <section className="relative w-full h-[85vh] sm:h-[90vh] flex items-end overflow-hidden">
        <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
          <Image 
            src={project.image || "/images/posts/blog.png"} 
            alt={project.title} 
            fill 
            priority
            className="object-cover"
          />
        </motion.div>
        {/* Gradients to ensure text readability */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
        <div className="absolute inset-0 z-10 bg-black/20" />
        
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pb-16 sm:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-6 sm:mb-8 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-slate-300">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                {project.date || "2023"}
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <span className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-purple-400" />
                {project.category || "Web Architecture"}
              </span>
            </div>

            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tighter text-white mb-8 leading-[1.05] sm:leading-[1.1] max-w-5xl">
              {project.title}
            </h1>

            <div className="flex flex-wrap gap-2 sm:gap-3">
               {project.technologies.slice(0, 5).map((tech, techIndex) => (
                  <span key={techIndex} className="px-4 py-2 rounded-full bg-slate-900/60 backdrop-blur-md border border-slate-700/50 text-[9px] sm:text-[10px] font-bold tracking-widest uppercase text-white shadow-xl">
                    {tech}
                  </span>
               ))}
               {project.technologies.length > 5 && (
                  <span className="px-4 py-2 rounded-full bg-slate-900/30 backdrop-blur-md border border-slate-700/30 text-[9px] sm:text-[10px] font-bold tracking-widest uppercase text-slate-300 shadow-xl">
                    +{project.technologies.length - 5}
                  </span>
               )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Unrolled Cinematic Scroll Content */}
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
            <h2 className="text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase text-blue-600 dark:text-blue-400 mb-8 sm:mb-10">01. Overview</h2>
            <p className="text-2xl sm:text-4xl font-light text-slate-900 dark:text-slate-100 leading-relaxed sm:leading-relaxed mb-16 tracking-tight">
              {project.description}
            </p>

            {/* Goal vs Outcome Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div className="p-8 sm:p-10 rounded-3xl bg-slate-50 dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
                <Target className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-6" />
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4">The Objective</h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-light leading-relaxed">
                  {project.goal}
                </p>
              </div>
              <div className="p-8 sm:p-10 rounded-3xl bg-slate-50 dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
                <Award className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-6" />
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4">The Outcome</h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-light leading-relaxed">
                  {project.outcome}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Full Tech Stack */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-24 sm:mb-32"
          >
            <h2 className="text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase text-blue-600 dark:text-blue-400 mb-8 sm:mb-12">02. Stack Architecture</h2>
            <div className="flex flex-wrap gap-3 sm:gap-4">
               {project.technologies.map((tech, index) => (
                  <div key={index} className="flex items-center gap-3 px-6 py-4 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm hover:border-blue-300 dark:hover:border-blue-800 hover:shadow-md transition-all duration-300">
                     <Code className="w-4 h-4 text-slate-400" />
                     <span className="text-sm sm:text-base font-medium text-slate-700 dark:text-slate-200">{tech}</span>
                  </div>
               ))}
            </div>
          </motion.div>

          {/* Key Features */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-24 sm:mb-32"
          >
            <h2 className="text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase text-blue-600 dark:text-blue-400 mb-8 sm:mb-12">03. Key Features</h2>
            <div className="space-y-4 sm:space-y-6">
               {(project.keyFeatures || [
                  "Multi-role login and highly secure data routing logic",
                  "Cross-platform responsiveness targeting mobile usability standards",
                  "Real-time database payload tracking and synchronization",
                  "Progressive offline-first execution logic"
               ]).map((feature, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-6 p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800/80 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden group">
                     <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shrink-0 group-hover:scale-110 transition-transform duration-500">
                        <Zap className="w-5 h-5" />
                     </div>
                     <div className="pt-1 sm:pt-0">
                        <p className="text-lg sm:text-xl font-medium text-slate-900 dark:text-slate-100">
                           {feature}
                        </p>
                     </div>
                  </div>
               ))}
            </div>
          </motion.div>

          {/* Pipeline */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-24 sm:mb-32"
          >
            <h2 className="text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase text-blue-600 dark:text-blue-400 mb-8 sm:mb-12">04. Engineering Pipeline</h2>
            <div className="relative border-l border-slate-200 dark:border-slate-800 ml-6 sm:ml-8 pl-10 sm:pl-16 space-y-12 sm:space-y-16">
               {(project.developmentProcess || [
                  "Architected the foundational database schema and models",
                  "Developed secure backend API routing arrays",
                  "Constructed sweeping frontend UI arrays and layout components",
                  "Deployed full-scale CI/CD operational pipelines"
               ]).map((step, index) => (
                  <div key={index} className="relative group">
                     <span className="absolute -left-[58px] sm:-left-[82px] top-1 flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 text-[10px] sm:text-xs font-bold text-slate-400 group-hover:border-blue-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                        0{index + 1}
                     </span>
                     <p className="text-xl sm:text-2xl font-light text-slate-800 dark:text-slate-300 leading-relaxed group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                        {step}
                     </p>
                  </div>
               ))}
            </div>
          </motion.div>

          {/* Challenges */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase text-blue-600 dark:text-blue-400 mb-8 sm:mb-12">05. Challenges & Execution</h2>
            <div className="space-y-8 sm:space-y-12">
               {(project.challenges || [
                  "Optimizing heavy frontend DOM rendering payload operations.",
                  "Managing extremely complex user validation constraints safely."
               ]).map((challenge, index) => (
                  <div key={index} className="p-8 sm:p-12 rounded-3xl bg-slate-900 dark:bg-slate-900 border border-slate-800 shadow-xl space-y-8 sm:space-y-10 group">
                     <div>
                        <div className="flex items-center gap-4 mb-4">
                           <Layers className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
                           <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">The Constraint</h3>
                        </div>
                        <p className="text-lg sm:text-xl font-light text-slate-400 leading-relaxed">
                           {challenge}
                        </p>
                     </div>
                     <div className="h-px w-full bg-gradient-to-r from-slate-800 to-transparent group-hover:from-blue-900/50 transition-colors duration-500" />
                     <div>
                        <div className="flex items-center gap-4 mb-4">
                           <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />
                           <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">The Execution</h3>
                        </div>
                        <p className="text-lg sm:text-xl font-light text-slate-300 leading-relaxed">
                           {project.solutions?.[index] || "Engineered an abstract logic wrapper that cleanly parsed the data streams before DOM computation, guaranteeing flawless operation metrics."}
                        </p>
                     </div>
                  </div>
               ))}
            </div>
          </motion.div>

        </div>
      </section>

      {/* Interstitial Action Closure */}
      <section className="py-24 sm:py-32 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-6 sm:px-12 text-center">
            <h2 className="text-4xl sm:text-6xl font-bold tracking-tighter text-slate-900 dark:text-white mb-10">Return to the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Archive.</span></h2>
            <Link href="/projects">
              <button className="px-10 py-5 sm:px-12 sm:py-6 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold tracking-widest text-[10px] sm:text-xs uppercase hover:scale-105 hover:shadow-2xl transition-all duration-300">
                View All Projects
              </button>
            </Link>
        </div>
      </section>
      
    </main>
  );
}
