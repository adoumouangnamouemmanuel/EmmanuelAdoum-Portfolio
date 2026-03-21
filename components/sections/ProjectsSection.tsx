"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { projects as rawProjects } from "@/data/projects";

const projects = rawProjects.map((project) => ({
  ...project,
  slug: project.title.toLowerCase().replace(/\s+/g, "-"),
}));

const ProjectCard = ({ project, index }: { project: any; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-100px" }}
      className={`flex flex-col ${
        isEven ? "lg:flex-row" : "lg:flex-row-reverse"
      } gap-12 lg:gap-20 items-center group`}
    >
      {/* Image Side */}
      <Link 
        href={`/projects/${project.slug}`}
        className="block cursor-pointer w-full lg:w-7/12 relative overflow-hidden rounded-[2rem] bg-slate-100 dark:bg-slate-900 aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] xl:aspect-[16/10]"
      >
        <motion.div
          style={{ y, scale: 1.15 }}
          className="absolute inset-0 w-full h-[120%]"
        >
          <Image
            src={project.image || "/images/projects/blog.png"}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
          />
        </motion.div>
        
        {/* Subtle inner shadow for premium feel */}
        <div className="absolute inset-0 rounded-[2rem] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] z-10 pointer-events-none" />
      </Link>

      {/* Text Side */}
      <div className="w-full lg:w-5/12 flex flex-col justify-center">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-6">
          {project.technologies.slice(0, 4).map((tech: string, i: number) => (
            <div key={i} className="flex items-center">
              <span className="text-[11px] font-bold tracking-widest uppercase text-blue-600 dark:text-blue-400">
                {tech}
              </span>
              {i < Math.min(project.technologies.length, 4) - 1 && (
                <span className="mx-3 text-slate-300 dark:text-slate-700">·</span>
              )}
            </div>
          ))}
        </div>

        <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tighter text-slate-900 dark:text-white mb-6">
          {project.title}
        </h3>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8 sm:mb-12">
          {project.description}
        </p>

        <div className="flex items-center gap-6">
          <Link
            href={`/projects/${project.slug}`}
            className="group/btn inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white overflow-hidden relative"
          >
            <span className="relative z-10 pb-1 border-b-2 border-slate-900 dark:border-white transition-colors group-hover/btn:border-blue-600 dark:group-hover/btn:border-blue-400">
              View Project
            </span>
            <ArrowUpRight className="h-5 w-5 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 text-blue-600 dark:text-blue-400" />
          </Link>

          {project.github && (
            <Link
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              aria-label="View source code on GitHub"
            >
              <Github className="h-6 w-6" />
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default function ProjectsSection() {
  return (
    <section id="projects" className="py-16 lg:py-20 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      <div className="section-container pl-4 pr-6 sm:pl-6 sm:pr-8 lg:pl-8 lg:pr-20 xl:pr-24 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-12 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-6"
          >
            <p className="inline-flex items-center rounded-full border border-blue-200/60 bg-blue-50/50 backdrop-blur-md px-4 py-1.5 text-xs font-bold tracking-widest uppercase text-blue-700 shadow-sm dark:border-blue-900/60 dark:bg-blue-900/20 dark:text-blue-400">
              Selected Work
            </p>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-slate-900 dark:text-white mb-6"
          >
            Featured{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              Projects
            </span>
          </motion.h2>
        </div>

        <div className="flex flex-col gap-16 lg:gap-24 mb-16 lg:mb-24">
          {projects.slice(0, 4).map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <Link
            href="/projects"
            className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-bold tracking-wide transition-all hover:scale-105 hover:shadow-xl hover:shadow-slate-900/20 dark:hover:shadow-white/20"
          >
            View Full Archive
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
