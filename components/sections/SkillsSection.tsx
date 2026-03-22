"use client";

import { motion, useInView } from "framer-motion";
import {
  BarChart3,
  BrainCircuit,
  Code2,
  Database,
  Layout,
  Network,
  Server,
  Smartphone,
} from "lucide-react";
import { useRef } from "react";

const skillsEn = [
  {
    title: "Frontend",
    icon: <Layout className="h-5 w-5" />,
    description:
      "Building responsive, beautiful, and interactive user interfaces.",
    technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    title: "Backend",
    icon: <Server className="h-5 w-5" />,
    description: "Architecting robust APIs and scalable server-side solutions.",
    technologies: ["Node.js", "Python", "NestJS", "Express", "Django"],
  },
  {
    title: "Database",
    icon: <Database className="h-5 w-5" />,
    description: "Designing efficient schemas and optimizing data retrieval.",
    technologies: ["PostgreSQL", "MongoDB", "MySQL"],
  },
  {
    title: "ML",
    icon: <BrainCircuit className="h-5 w-5" />,
    description:
      "Developing intelligent models to solve predictive computing challenges.",
    technologies: ["Scikit-Learn", "TensorFlow", "XGBoost", "NLP", "LLMs"],
  },
  {
    title: "Deep Learning",
    icon: <Network className="h-5 w-5" />,
    description:
      "Building complex neural networks for advanced pattern recognition.",
    technologies: [
      "PyTorch",
      "Neural Networks",
      "Computer Vision",
      "Transformers",
    ],
  },
  {
    title: "Data Analytics",
    icon: <BarChart3 className="h-5 w-5" />,
    description: "Extracting actionable insights from vast datasets.",
    technologies: [
      "Pandas",
      "Data Visualization",
      "NumPy",
      "Statistical Analysis",
    ],
  },
  {
    title: "Mobile Dev",
    icon: <Smartphone className="h-5 w-5" />,
    description: "Creating seamless cross-platform mobile experiences.",
    technologies: ["React Native", "Expo", "Cross-Platform UI"],
  },
  {
    title: "UI/UX Design",
    icon: <Code2 className="h-5 w-5" />,
    description:
      "Crafting intuitive and aesthetically pleasing digital experiences.",
    technologies: ["Figma", "Design Systems", "Prototyping", "Wireframing"],
  },
];

const skillsFr = [
  {
    title: "Frontend",
    icon: <Layout className="h-5 w-5" />,
    description:
      "Création d'interfaces responsives, esthétiques et interactives.",
    technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    title: "Backend",
    icon: <Server className="h-5 w-5" />,
    description:
      "Conception d'API robustes et de solutions serveur évolutives.",
    technologies: ["Node.js", "Python", "NestJS", "Express", "Django"],
  },
  {
    title: "Base de Données",
    icon: <Database className="h-5 w-5" />,
    description:
      "Modélisation efficace et optimisation des requêtes de données.",
    technologies: ["PostgreSQL", "MongoDB", "MySQL"],
  },
  {
    title: "ML",
    icon: <BrainCircuit className="h-5 w-5" />,
    description:
      "Développement de modèles intelligents pour des problèmes prédictifs.",
    technologies: ["Scikit-Learn", "TensorFlow", "XGBoost", "NLP", "LLMs"],
  },
  {
    title: "Deep Learning",
    icon: <Network className="h-5 w-5" />,
    description: "Conception de réseaux neuronaux pour des usages avancés.",
    technologies: [
      "PyTorch",
      "Neural Networks",
      "Computer Vision",
      "Transformers",
    ],
  },
  {
    title: "Analyse de Données",
    icon: <BarChart3 className="h-5 w-5" />,
    description:
      "Extraction d'insights actionnables a partir de grands volumes.",
    technologies: [
      "Pandas",
      "Data Visualization",
      "NumPy",
      "Statistical Analysis",
    ],
  },
  {
    title: "Mobile",
    icon: <Smartphone className="h-5 w-5" />,
    description: "Création d'expériences mobiles fluides multi-plateformes.",
    technologies: ["React Native", "Expo", "Cross-Platform UI"],
  },
  {
    title: "Design UI/UX",
    icon: <Code2 className="h-5 w-5" />,
    description: "Conception d'expériences numériques intuitives et élégantes.",
    technologies: ["Figma", "Design Systems", "Prototyping", "Wireframing"],
  },
];

type Locale = "en" | "fr";

export default function SkillsSection({ locale = "en" }: { locale?: Locale }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const skills = locale === "fr" ? skillsFr : skillsEn;
  const t =
    locale === "fr"
      ? {
          eyebrow: "Capacités",
          titleLead: "Arsenal",
          titleAccent: "Technique",
          description:
            "Un ensemble de technologies et de domaines maîtrisés pour concevoir, développer et déployer des systèmes complets.",
        }
      : {
          eyebrow: "Capabilities",
          titleLead: "Technical",
          titleAccent: "Arsenal",
          description:
            "A carefully curated and deeply internalised set of technologies and domains that allow me to architect, build, and deploy complete systems.",
        };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section
      id="skills"
      className="py-16 lg:py-12 lg:min-h-screen lg:flex lg:items-center bg-white dark:bg-slate-950 relative overflow-hidden"
    >
      <div className="section-container w-full pl-4 pr-6 sm:pl-6 sm:pr-8 lg:pl-8 lg:pr-20 xl:pr-24 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-10 lg:mb-12">
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
            className="text-4xl sm:text-5xl font-bold tracking-tighter text-slate-900 dark:text-white mb-6"
          >
            {t.titleLead}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              {t.titleAccent}
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            {t.description}
          </motion.p>
        </div>

        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8"
        >
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative flex flex-col p-5 sm:p-6 lg:p-7 bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 hover:bg-white dark:hover:bg-slate-900 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 dark:hover:shadow-blue-900/10 transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-4 lg:mb-5">
                <div className="flex items-center justify-center h-10 w-10 lg:h-12 lg:w-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:border-blue-200 dark:group-hover:border-blue-900 transition-colors">
                  {skill.icon}
                </div>
                <h3 className="text-base lg:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                  {skill.title}
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-5 lg:mb-6 flex-grow leading-relaxed">
                {skill.description}
              </p>

              <div className="flex flex-wrap gap-2 mt-auto">
                {skill.technologies.map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold tracking-wide text-slate-600 dark:text-slate-300 rounded-full group-hover:border-blue-100 dark:group-hover:border-blue-900/50 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
