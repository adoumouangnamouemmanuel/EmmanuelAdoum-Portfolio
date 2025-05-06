"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  Code,
  Database,
  Palette,
  Server,
  Terminal,
  Smartphone,
  Layers,
  Zap,
} from "lucide-react";

const skills = [
  {
    title: "Frontend Development",
    icon: <Code className="h-6 w-6" />,
    description:
      "Building responsive and interactive user interfaces with modern frameworks and libraries.",
    technologies: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
    ],
    color: "blue",
  },
  {
    title: "Backend Development",
    icon: <Server className="h-6 w-6" />,
    description:
      "Creating robust server-side applications and APIs to power web applications.",
    technologies: ["Node.js", "Express", "NestJS", "Python", "Django"],
    color: "green",
  },
  {
    title: "Database Management",
    icon: <Database className="h-6 w-6" />,
    description:
      "Designing and optimizing database schemas for efficient data storage and retrieval.",
    technologies: ["MongoDB", "PostgreSQL", "MySQL", "Redis", "Prisma"],
    color: "yellow",
  },
  {
    title: "UI/UX Design",
    icon: <Palette className="h-6 w-6" />,
    description:
      "Crafting beautiful and intuitive user experiences with attention to detail.",
    technologies: [
      "Figma",
      "Adobe XD",
      "Sketch",
      "Design Systems",
      "Prototyping",
    ],
    color: "purple",
  },
  {
    title: "DevOps",
    icon: <Terminal className="h-6 w-6" />,
    description:
      "Automating deployment processes and ensuring smooth operation of applications.",
    technologies: ["Docker", "Kubernetes", "CI/CD", "AWS", "Vercel"],
    color: "red",
  },
  {
    title: "Mobile Development",
    icon: <Smartphone className="h-6 w-6" />,
    description:
      "Building cross-platform mobile applications with web technologies.",
    technologies: [
      "React Native",
      "Expo",
      "Flutter",
      "Mobile UI Design",
      "App Store Deployment",
    ],
    color: "indigo",
  },
  {
    title: "Web Performance",
    icon: <Zap className="h-6 w-6" />,
    description:
      "Optimizing web applications for speed, accessibility, and search engine visibility.",
    technologies: [
      "Lighthouse",
      "Web Vitals",
      "SEO",
      "Accessibility",
      "Performance Monitoring",
    ],
    color: "orange",
  },
  {
    title: "Architecture",
    icon: <Layers className="h-6 w-6" />,
    description:
      "Designing scalable and maintainable software architectures for complex applications.",
    technologies: [
      "Microservices",
      "Serverless",
      "API Design",
      "System Design",
      "Domain-Driven Design",
    ],
    color: "teal",
  },
];

const getColorClasses = (color: string) => {
  const colorMap: {
    [key: string]: {
      bg: string;
      darkBg: string;
      text: string;
      darkText: string;
      hover: string;
      darkHover: string;
    };
  } = {
    blue: {
      bg: "bg-blue-100",
      darkBg: "dark:bg-blue-900/30",
      text: "text-blue-800",
      darkText: "dark:text-blue-300",
      hover: "group-hover:bg-blue-200",
      darkHover: "dark:group-hover:bg-blue-800/40",
    },
    green: {
      bg: "bg-green-100",
      darkBg: "dark:bg-green-900/30",
      text: "text-green-800",
      darkText: "dark:text-green-300",
      hover: "group-hover:bg-green-200",
      darkHover: "dark:group-hover:bg-green-800/40",
    },
    yellow: {
      bg: "bg-yellow-100",
      darkBg: "dark:bg-yellow-900/30",
      text: "text-yellow-800",
      darkText: "dark:text-yellow-300",
      hover: "group-hover:bg-yellow-200",
      darkHover: "dark:group-hover:bg-yellow-800/40",
    },
    purple: {
      bg: "bg-purple-100",
      darkBg: "dark:bg-purple-900/30",
      text: "text-purple-800",
      darkText: "dark:text-purple-300",
      hover: "group-hover:bg-purple-200",
      darkHover: "dark:group-hover:bg-purple-800/40",
    },
    red: {
      bg: "bg-red-100",
      darkBg: "dark:bg-red-900/30",
      text: "text-red-800",
      darkText: "dark:text-red-300",
      hover: "group-hover:bg-red-200",
      darkHover: "dark:group-hover:bg-red-800/40",
    },
    indigo: {
      bg: "bg-indigo-100",
      darkBg: "dark:bg-indigo-900/30",
      text: "text-indigo-800",
      darkText: "dark:text-indigo-300",
      hover: "group-hover:bg-indigo-200",
      darkHover: "dark:group-hover:bg-indigo-800/40",
    },
    orange: {
      bg: "bg-orange-100",
      darkBg: "dark:bg-orange-900/30",
      text: "text-orange-800",
      darkText: "dark:text-orange-300",
      hover: "group-hover:bg-orange-200",
      darkHover: "dark:group-hover:bg-orange-800/40",
    },
    teal: {
      bg: "bg-teal-100",
      darkBg: "dark:bg-teal-900/30",
      text: "text-teal-800",
      darkText: "dark:text-teal-300",
      hover: "group-hover:bg-teal-200",
      darkHover: "dark:group-hover:bg-teal-800/40",
    },
  };

  return colorMap[color] || colorMap.blue;
};

export default function SkillsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

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
        ease: "easeOut",
      },
    },
  };

  return (
    <section id="skills" className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"
          style={{ y }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 8,
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"
          style={{ y: useTransform(scrollYProgress, [0, 1], [-50, 50]) }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 10,
            delay: 1,
          }}
        />
      </div>

      <div className="section-container">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 shadow-md mb-4"
          >
            My Skills
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Technical <span className="gradient-text">Expertise</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            I've developed a diverse set of skills throughout my career,
            allowing me to build complete, scalable, and user-friendly
            applications.
          </motion.p>
        </div>

        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {skills.map((skill, index) => {
            const colorClasses = getColorClasses(skill.color);

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{
                  y: -10,
                  transition: { type: "spring", stiffness: 300, damping: 10 },
                }}
                className="group bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700"
              >
                <div
                  className={`p-3 ${colorClasses.bg} ${colorClasses.darkBg} ${colorClasses.hover} ${colorClasses.darkHover} rounded-lg inline-block mb-4 transition-colors`}
                >
                  <motion.div
                    className={`${colorClasses.text} ${colorClasses.darkText}`}
                    animate={{ rotate: [0, 5, 0, -5, 0] }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 5,
                      delay: index * 0.2,
                    }}
                  >
                    {skill.icon}
                  </motion.div>
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {skill.title}
                </h3>
                <p className="text-muted-foreground mb-4 text-xs">
                  {skill.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {skill.technologies.map((tech, techIndex) => (
                    <motion.span
                      key={techIndex}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-md transition-colors"
                      whileHover={{
                        scale: 1.05,
                        backgroundColor: "#e0e7ff",
                        color: "#4f46e5",
                      }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        transition: { delay: 0.3 + techIndex * 0.05 },
                      }}
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>

                {/* Progress indicator */}
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Proficiency</span>
                    <span>
                      {index % 3 === 0
                        ? "Expert"
                        : index % 3 === 1
                        ? "Advanced"
                        : "Proficient"}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${
                        index % 3 === 0
                          ? "bg-green-500"
                          : index % 3 === 1
                          ? "bg-blue-500"
                          : "bg-yellow-500"
                      }`}
                      initial={{ width: 0 }}
                      animate={{
                        width:
                          index % 3 === 0
                            ? "95%"
                            : index % 3 === 1
                            ? "85%"
                            : "75%",
                      }}
                      transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
