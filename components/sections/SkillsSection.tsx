"use client";

import { motion, useInView } from "framer-motion";
import { MonitorSmartphone, Server, BrainCircuit, Cpu } from "lucide-react";
import { useRef, useState } from "react";

type Locale = "en" | "fr";
type SkillTheme = "blue" | "green" | "purple" | "amber";

type SkillGroup = {
  id: string;
  title: string;
  description: string;
  level: "Proficient" | "Intermediate" | "Growing";
  technologies: string[];
  theme: SkillTheme;
};

const skillsEn: SkillGroup[] = [
  {
    id: "frontend",
    title: "Frontend & Mobile",
    description: "Building responsive, cross-platform, and interactive user interfaces.",
    level: "Proficient",
    technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS", "React Native", "Expo", "Figma", "UI/UX"],
    theme: "blue",
  },
  {
    id: "backend",
    title: "Backend & Systems",
    description: "Architecting robust APIs, efficient databases, and scalable servers.",
    level: "Proficient",
    technologies: ["Node.js", "Python", "NestJS", "Express", "Django", "PostgreSQL", "MongoDB", "Prisma"],
    theme: "green",
  },
  {
    id: "ai",
    title: "AI & Data Science",
    description: "Developing intelligent models and extracting actionable insights.",
    level: "Intermediate",
    technologies: ["Scikit-Learn", "TensorFlow", "PyTorch", "NLP", "Transformers", "Pandas", "NumPy", "Data Viz"],
    theme: "purple",
  },
  {
    id: "engineering",
    title: "Computer Engineering",
    description: "Designing low-level hardware, microcontrollers, and embedded systems.",
    level: "Proficient",
    technologies: ["C/C++", "MATLAB", "Circuits", "Electronics", "Control Systems", "Arduino", "CPU Design", "Architecture"],
    theme: "amber",
  },
];

const skillsFr: SkillGroup[] = [
  {
    id: "frontend",
    title: "Frontend & Mobile",
    description: "Création d'interfaces responsives, interactives et multi-plateformes.",
    level: "Proficient",
    technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS", "React Native", "Expo", "Figma", "UI/UX"],
    theme: "blue",
  },
  {
    id: "backend",
    title: "Backend & Systèmes",
    description: "Conception d'API robustes, de bases de données efficaces et de serveurs évolutifs.",
    level: "Proficient",
    technologies: ["Node.js", "Python", "NestJS", "Express", "Django", "PostgreSQL", "MongoDB", "Prisma"],
    theme: "green",
  },
  {
    id: "ai",
    title: "IA & Data Science",
    description: "Développement de modèles intelligents et extraction d'insights actionnables.",
    level: "Intermediate",
    technologies: ["Scikit-Learn", "TensorFlow", "PyTorch", "NLP", "Transformers", "Pandas", "NumPy", "Data Viz"],
    theme: "purple",
  },
  {
    id: "engineering",
    title: "Ingénierie Informatique",
    description: "Conception de matériel bas niveau, de microcontrôleurs et de systèmes embarqués.",
    level: "Proficient",
    technologies: ["C/C++", "MATLAB", "Circuits", "Électronique", "Systèmes de Contrôle", "Arduino", "Design CPU", "Architecture"],
    theme: "amber",
  },
];

const getIcon = (id: string, className: string) => {
  switch (id) {
    case "frontend":
      return <MonitorSmartphone className={className} />;
    case "backend":
      return <Server className={className} />;
    case "ai":
      return <BrainCircuit className={className} />;
    case "engineering":
      return <Cpu className={className} />;
    default:
      return null;
  }
};

const getThemeClasses = (theme: SkillTheme) => {
  switch (theme) {
    case "blue":
      return "border-blue-200 bg-blue-50/60 text-blue-700 hover:border-blue-300 dark:border-blue-500/20 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:border-blue-500/50";
    case "green":
      return "border-emerald-200 bg-emerald-50/60 text-emerald-700 hover:border-emerald-300 dark:border-emerald-500/20 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:border-emerald-500/50";
    case "purple":
      return "border-purple-200 bg-purple-50/60 text-purple-700 hover:border-purple-300 dark:border-purple-500/20 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:border-purple-500/50";
    case "amber":
      return "border-amber-200 bg-amber-50/60 text-amber-700 hover:border-amber-300 dark:border-amber-500/20 dark:bg-amber-900/30 dark:text-amber-300 dark:hover:border-amber-500/50";
  }
};

const getIconTheme = (theme: SkillTheme) => {
  switch (theme) {
    case "blue":
      return "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 border border-blue-200/50 dark:border-blue-400/20";
    case "green":
      return "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-400/20";
    case "purple":
      return "bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400 border border-purple-200/50 dark:border-purple-400/20";
    case "amber":
      return "bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400 border border-amber-200/50 dark:border-amber-400/20";
  }
};

function SkillCard({ skill }: { skill: SkillGroup }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white/60 p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:bg-white/85 hover:shadow-md dark:border-white/10 dark:bg-slate-950/35 dark:hover:border-white/20 dark:hover:bg-slate-900/55"
      onMouseMove={handleMouseMove}
    >
      {/* Light mode glow */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:hidden"
        style={{
          background: `radial-gradient(circle 250px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.7), transparent 80%)`,
        }}
      />
      
      {/* Dark mode glow */}
      <div
        className="pointer-events-none absolute inset-0 z-0 hidden opacity-0 mix-blend-screen transition-opacity duration-300 group-hover:opacity-100 dark:block"
        style={{
          background: `radial-gradient(circle 250px at ${mousePosition.x}px ${mousePosition.y}px, rgba(59,130,246,0.12), transparent 80%)`,
        }}
      />

      <div className="relative z-10 flex items-start gap-4">
        <div className={`mt-0.5 rounded-xl p-2.5 shadow-sm ${getIconTheme(skill.theme)}`}>
          {getIcon(skill.id, "h-5 w-5")}
        </div>
        <div className="flex-1">
          <span className="block text-lg font-extrabold leading-tight text-slate-950 dark:text-slate-100 sm:text-xl">
            {skill.title}
          </span>
          <div className="mt-1.5">
            <span className="inline-flex shrink-0 rounded-full border border-slate-200/70 bg-slate-50/75 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-slate-600 dark:border-slate-600/30 dark:bg-slate-800/40 dark:text-slate-400 sm:text-[10px]">
              {skill.level}
            </span>
          </div>
        </div>
      </div>

      <p className="relative z-10 mt-5 flex-grow text-xs font-medium leading-relaxed text-slate-700 dark:text-slate-300 sm:text-sm">
        {skill.description}
      </p>

      <div className="relative z-10 mt-6 flex flex-wrap gap-2">
        {skill.technologies.map((tech) => (
          <span
            key={tech}
            className={`inline-flex items-center rounded-md border px-2.5 py-1 text-[11px] sm:text-xs font-semibold transition-colors ${getThemeClasses(skill.theme)}`}
          >
            {tech}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default function SkillsSection({ locale = "en" }: { locale?: Locale }) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  const skills = locale === "fr" ? skillsFr : skillsEn;

  const t =
    locale === "fr"
      ? {
          title: "COMPÉTENCES",
          techStack: "Mon TechStack",
        }
      : {
          title: "SKILLS",
          techStack: "My TechStack",
        };

  return (
    <section
      id="skills"
      className="relative flex min-h-[calc(100vh-52px)] items-center justify-center overflow-hidden bg-transparent py-16 text-center text-slate-950 dark:text-slate-100 sm:py-24"
    >
      <motion.div
        ref={sectionRef}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="w-full px-4 sm:px-6 lg:px-8"
      >
        <div className="mx-auto w-full max-w-6xl rounded-[20px] border border-slate-200/70 bg-gradient-to-br from-white/84 via-blue-50/48 to-white/70 p-6 shadow-[0_8px_24px_rgba(15,23,42,0.08)] backdrop-blur-[3px] dark:border-white/20 dark:from-white/10 dark:via-white/[0.04] dark:to-white/[0.02] dark:text-slate-100 dark:shadow-[0_8px_32px_rgba(0,0,0,0.37)] sm:p-10 lg:p-12">
          <div className="relative z-10 text-center">
            <h2 className="text-3xl font-extrabold uppercase leading-tight tracking-normal text-slate-950 dark:text-slate-100 sm:text-4xl lg:text-[2.5rem]">
              {t.title}
            </h2>
            <p className="mt-2 text-lg font-bold leading-tight sm:text-xl">
              {t.techStack}
            </p>

            <motion.div
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.15,
                  },
                },
              }}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="mt-10 grid gap-6 lg:grid-cols-4"
            >
              {skills.map((skill) => (
                <SkillCard key={skill.title} skill={skill} />
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
