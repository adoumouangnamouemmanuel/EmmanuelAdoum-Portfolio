"use client";

import { useRef, useState } from "react";
import {
  motion,
  useInView,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ExternalLink,
  Github,
  ArrowRight,
  ArrowLeft,
  Code,
  Eye,
  Bookmark,
} from "lucide-react";
import { projects } from "@/data/projects";

export default function ProjectsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [activeProject, setActiveProject] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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

  const nextProject = () => {
    setActiveProject((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
  };

  const prevProject = () => {
    setActiveProject((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  };

  return (
    <section
      id="projects"
      className="py-24 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"
          style={{ y: y1 }}
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
          style={{ y: y2 }}
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
            My Projects
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Featured <span className="gradient-text">Work</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Here are some of my recent projects that showcase my skills and
            expertise in building modern web applications.
          </motion.p>
        </div>

        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="mb-20"
        >
          <motion.div variants={itemVariants} className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProject}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
              >
                <div className="relative group card-3d">
                  <div className="card-3d-content relative rounded-xl overflow-hidden shadow-2xl">
                    <Image
                      src={
                        projects[activeProject].image ||
                        "/placeholder.svg?height=600&width=800"
                      }
                      alt={projects[activeProject].title}
                      width={600}
                      height={400}
                      className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <div className="p-6 w-full">
                        <div className="flex justify-between items-center">
                          <h3 className="text-white text-xl font-bold">
                            {projects[activeProject].title}
                          </h3>
                          <div className="flex space-x-2">
                            {projects[activeProject].github && (
                              <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Link
                                  href={projects[activeProject].github}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 bg-white/20 rounded-full hover:bg-white/40 transition-colors"
                                >
                                  <Github className="h-5 w-5 text-white" />
                                  <span className="sr-only">GitHub</span>
                                </Link>
                              </motion.div>
                            )}
                            {projects[activeProject].demo && (
                              <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Link
                                  href={projects[activeProject].demo}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 bg-white/20 rounded-full hover:bg-white/40 transition-colors"
                                >
                                  <ExternalLink className="h-5 w-5 text-white" />
                                  <span className="sr-only">Live Demo</span>
                                </Link>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Project number badge */}
                  <motion.div
                    className="absolute -top-4 -left-4 bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg z-10"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                      delay: 0.3,
                    }}
                  >
                    #{activeProject + 1}
                  </motion.div>
                </div>

                <div>
                  <motion.h3
                    className="text-2xl font-bold mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {projects[activeProject].title}
                  </motion.h3>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {projects[activeProject].technologies.map((tech, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.05 }}
                        whileHover={{ y: -2, scale: 1.05 }}
                      >
                        <Badge variant="secondary" className="shadow-sm">
                          {tech}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>

                  <motion.p
                    className="text-muted-foreground mb-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    {projects[activeProject].description}
                  </motion.p>

                  <div className="flex flex-wrap gap-4">
                    {projects[activeProject].github && (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="shadow-sm group"
                          asChild
                        >
                          <Link
                            href={projects[activeProject].github}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Github className="mr-2 h-4 w-4" /> View Code
                          </Link>
                        </Button>
                      </motion.div>
                    )}
                    {projects[activeProject].demo && (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 shadow-md group"
                          asChild
                        >
                          <Link
                            href={projects[activeProject].demo}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="mr-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />{" "}
                            Live Demo
                          </Link>
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center mt-8 space-x-4">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevProject}
                  aria-label="Previous project"
                  className="shadow-md hover:shadow-lg transition-all"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </motion.div>

              <div className="flex space-x-2">
                {projects.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setActiveProject(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === activeProject
                        ? "bg-blue-600 scale-125"
                        : "bg-blue-300 dark:bg-blue-700"
                    }`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={`Go to project ${index + 1}`}
                  />
                ))}
              </div>

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextProject}
                  aria-label="Next project"
                  className="shadow-md hover:shadow-lg transition-all"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {projects.slice(0, 6).map((project, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                y: -10,
                transition: { type: "spring", stiffness: 300, damping: 10 },
              }}
              onHoverStart={() => setHoveredCard(index)}
              onHoverEnd={() => setHoveredCard(null)}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-gray-100 dark:border-gray-700 group"
            >
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={project.image || "/placeholder.svg?height=400&width=600"}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-white font-medium">
                        {project.title}
                      </h4>
                      <div className="flex space-x-2">
                        {project.github && (
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Link
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 bg-white/20 rounded-full hover:bg-white/40 transition-colors"
                            >
                              <Github className="h-4 w-4 text-white" />
                              <span className="sr-only">GitHub</span>
                            </Link>
                          </motion.div>
                        )}
                        {project.demo && (
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Link
                              href={project.demo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 bg-white/20 rounded-full hover:bg-white/40 transition-colors"
                            >
                              <ExternalLink className="h-4 w-4 text-white" />
                              <span className="sr-only">Live Demo</span>
                            </Link>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.technologies.slice(0, 3).map((tech, techIndex) => (
                    <Badge
                      key={techIndex}
                      variant="secondary"
                      className="shadow-sm"
                    >
                      {tech}
                    </Badge>
                  ))}
                  {project.technologies.length > 3 && (
                    <Badge variant="outline">
                      +{project.technologies.length - 3}
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground mb-4 line-clamp-3 text-sm">
                  {project.description}
                </p>

                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <motion.div
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Code className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Eye className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Bookmark className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    </motion.div>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveProject(index)}
                      className="group"
                    >
                      Details
                      <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-12">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              variant="outline"
              className="shadow-lg hover:shadow-xl transition-all group"
              asChild
            >
              <Link href="/projects">
                View All Projects{" "}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
