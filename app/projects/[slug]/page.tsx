"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { projects } from "@/data/projects";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Award,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Code,
  Copy,
  ExternalLink,
  Github,
  Layers,
  Lightbulb,
  Tag,
  Target,
  Workflow,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Define the Project type to match your new data structure
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
  const slug = params.slug as string;

  // Find the project by slug
  const [project, setProject] = useState<Project | undefined>(
    projects.find((p) => p.slug === slug) as Project
  );
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  const toggleImageExpansion = (image: string) => {
    setExpandedImage((prev) => (prev === image ? null : image));
  };

  useEffect(() => {
    // If project doesn't exist, redirect to projects page
    if (!project) {
      router.push("/projects");
      return;
    }

    // Find related projects with similar technologies
    const related = projects
      .filter(
        (p) =>
          p.slug !== slug &&
          p.technologies.some((tech) => project.technologies.includes(tech))
      )
      .slice(0, 3) as Project[];

    setRelatedProjects(related);
  }, [project, router, slug]);

  if (!project) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <main className="min-h-screen">
      {/* Hero section */}
      <section className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 py-16 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                size="sm"
                className="shadow-md group"
                asChild
              >
                <Link href="/projects">
                  <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                  Back to Projects
                </Link>
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap gap-2 mb-4"
          >
            <Badge variant="secondary" className="shadow-sm">
              {project.category || "Web Development"}
            </Badge>
            {project.client && (
              <Badge variant="outline" className="shadow-sm">
                Client: {project.client}
              </Badge>
            )}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
          >
            {project.title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center space-x-6 text-sm text-muted-foreground mb-8"
          >
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
              <span>{project.date || "2023"}</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative rounded-xl overflow-hidden shadow-xl mb-8 aspect-video"
          >
            <Image
              src={project.image || "/images/projects/blog.png"}
              alt={project.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex flex-wrap gap-2 mb-2">
                  {project.technologies.slice(0, 4).map((tech, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-black/30 text-white border-white/20"
                    >
                      {tech}
                    </Badge>
                  ))}
                  {project.technologies.length > 4 && (
                    <Badge
                      variant="outline"
                      className="bg-black/30 text-white border-white/20"
                    >
                      +{project.technologies.length - 4}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-4 mb-8"
          >
            {project.github && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  className="bg-gray-900 hover:bg-black text-white shadow-md group"
                  asChild
                >
                  <Link
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="mr-2 h-4 w-4" />
                    View Source Code
                  </Link>
                </Button>
              </motion.div>
            )}

            {project.demo && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  className="bg-blue-600 hover:bg-blue-700 shadow-md group"
                  asChild
                >
                  <Link
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Live Demo
                  </Link>
                </Button>
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={copyToClipboard}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 shadow-md"
            >
              {copied ? (
                <Check className="mr-2 h-4 w-4" />
              ) : (
                <Copy className="mr-2 h-4 w-4" />
              )}
              {copied ? "Copied!" : "Share"}
            </motion.button>
          </motion.div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2">
              {/* Tab navigation */}
              <div className="mb-8 border-b border-gray-200 dark:border-gray-700">
                <div className="flex space-x-8 overflow-x-auto">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`pb-4 px-1 font-medium text-sm transition-colors relative ${
                      activeTab === "overview"
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                  >
                    Overview
                    {activeTab === "overview" && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
                      />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab("features")}
                    className={`pb-4 px-1 font-medium text-sm transition-colors relative ${
                      activeTab === "features"
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                  >
                    Features
                    {activeTab === "features" && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
                      />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab("process")}
                    className={`pb-4 px-1 font-medium text-sm transition-colors relative ${
                      activeTab === "process"
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                  >
                    Development Process
                    {activeTab === "process" && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
                      />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab("challenges")}
                    className={`pb-4 px-1 font-medium text-sm transition-colors relative ${
                      activeTab === "challenges"
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                  >
                    Challenges
                    {activeTab === "challenges" && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
                      />
                    )}
                  </button>
                </div>
              </div>

              {/* Tab content */}
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 md:p-8 shadow-lg"
              >
                {activeTab === "overview" && (
                  <div className="space-y-8">
                    <motion.div
                      variants={fadeInUp}
                      initial="hidden"
                      animate="visible"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h2 className="text-2xl font-bold">Project Overview</h2>
                      </div>
                      <div className="pl-12">
                        <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-6">
                          {project.description}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                          <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-lg border border-gray-100 dark:border-gray-700">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
                              <Target className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                              Project Goal
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                              {project.goal}
                            </p>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-lg border border-gray-100 dark:border-gray-700">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
                              <Award className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                              Project Outcome
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                              {project.outcome}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      variants={fadeInUp}
                      initial="hidden"
                      animate="visible"
                      className="mt-12"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                          <Code className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h2 className="text-2xl font-bold">
                          Technologies Used
                        </h2>
                      </div>
                      <div className="pl-12">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                          {project.technologies.map((tech, index) => (
                            <div
                              key={index}
                              className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow flex items-center gap-3"
                            >
                              <div className="w-2 h-10 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                              <span className="font-medium">{tech}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}

                {activeTab === "features" && (
                  <div className="space-y-8">
                    <motion.div
                      variants={fadeInUp}
                      initial="hidden"
                      animate="visible"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                          <Zap className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <h2 className="text-2xl font-bold">Key Features</h2>
                      </div>
                      <div className="pl-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {(
                            project.keyFeatures || [
                              "Multi-role login and access control",
                              "School and class management dashboard",
                              "Real-time grade and attendance tracking",
                              "Offline-first mobile support",
                              "Bilingual support (French and Arabic)",
                            ]
                          ).map((feature, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="bg-white dark:bg-gray-800 p-5 rounded-lg border-l-4 border-green-500 dark:border-green-400 shadow-md"
                            >
                              <div className="flex items-start">
                                <CheckCircle2 className="h-5 w-5 text-green-500 dark:text-green-400 mt-0.5 mr-3 flex-shrink-0" />
                                <div>
                                  <p className="font-medium text-gray-800 dark:text-gray-200">
                                    {feature}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}

                {activeTab === "process" && (
                  <div className="space-y-8">
                    <motion.div
                      variants={fadeInUp}
                      initial="hidden"
                      animate="visible"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                          <Workflow className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <h2 className="text-2xl font-bold">
                          Development Process
                        </h2>
                      </div>
                      <div className="pl-12">
                        <div className="relative border-l-2 border-orange-200 dark:border-orange-800 pl-8 pb-8">
                          {(
                            project.developmentProcess || [
                              "Conducted field research across 5 regions in Chad",
                              "Built a modular architecture for role-based access (admin, teacher, student)",
                              "Implemented real-time database sync using Firebase",
                              "Deployed with CI/CD pipelines using Vercel and GitHub Actions",
                            ]
                          ).map((step, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.2 }}
                              className="mb-8 relative"
                            >
                              <div className="absolute -left-10 w-6 h-6 rounded-full bg-orange-500 dark:bg-orange-400 flex items-center justify-center text-white font-bold text-xs">
                                {index + 1}
                              </div>
                              <div className="bg-orange-50 dark:bg-orange-900/20 p-5 rounded-lg">
                                <p className="text-gray-800 dark:text-gray-200">
                                  {step}
                                </p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}

                {activeTab === "challenges" && (
                  <div className="space-y-8">
                    <motion.div
                      variants={fadeInUp}
                      initial="hidden"
                      animate="visible"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                          <Layers className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </div>
                        <h2 className="text-2xl font-bold">
                          Challenges & Solutions
                        </h2>
                      </div>
                      <div className="pl-12">
                        {(
                          project.challenges || [
                            "Unstable internet connectivity in rural areas",
                            "Limited access to digital devices in some schools",
                            "Language and curriculum standardization",
                          ]
                        ).map((challenge, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.15 }}
                            className="mb-6"
                          >
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
                              <h3 className="text-lg font-semibold mb-3 text-red-600 dark:text-red-400 flex items-center">
                                <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-3">
                                  <span className="font-bold">{index + 1}</span>
                                </div>
                                Challenge: {challenge}
                              </h3>
                              <div className="ml-11">
                                <h4 className="font-medium text-green-600 dark:text-green-400 mb-2">
                                  Solution:
                                </h4>

                                <p className="text-gray-700 dark:text-gray-300">
                                  {project.solutions?.[index] ||
                                    "Solution not provided."}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                )}
              </motion.div>

              {/* Project gallery */}
              {project.gallery && project.gallery.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mt-12"
                >
                  <h3 className="text-2xl font-bold mb-6 flex items-center">
                    <span className="w-10 h-1 bg-blue-600 dark:bg-blue-400 mr-3"></span>
                    Project Gallery
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {project.gallery.map((item, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ y: -5, scale: 1.02 }}
                        className={`rounded-xl overflow-hidden shadow-lg group relative ${
                          expandedImage === item.image ? "z-50" : ""
                        }`}
                        onClick={() => toggleImageExpansion(item.image)}
                      >
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={600}
                          height={400}
                          className={`w-full h-auto object-cover transition-transform duration-700 ${
                            expandedImage === item.image
                              ? "scale-125"
                              : "group-hover:scale-105"
                          }`}
                        />
                        <div
                          className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                            expandedImage === item.image ? "opacity-100" : ""
                          }`}
                        >
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <p className="text-white font-medium">
                              {item.title}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Related projects */}
              {relatedProjects.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mt-16"
                >
                  <h3 className="text-2xl font-bold mb-8 flex items-center">
                    <span className="w-10 h-1 bg-purple-600 dark:bg-purple-400 mr-3"></span>
                    Related Projects
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {relatedProjects.map((relatedProject, index) => (
                      <motion.div
                        key={index}
                        whileHover={{
                          y: -8,
                          transition: {
                            type: "spring",
                            stiffness: 300,
                            damping: 10,
                          },
                        }}
                        className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col group"
                      >
                        <Link
                          href={`/projects/${relatedProject.slug}`}
                          className="block h-48 relative"
                        >
                          <Image
                            src={
                              relatedProject.image ||
                              "/images/projects/blog.png"
                            }
                            alt={relatedProject.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                              <p className="text-white font-medium">
                                View Project
                              </p>
                            </div>
                          </div>
                        </Link>
                        <div className="p-6 flex-1 flex flex-col">
                          <div className="flex-1">
                            <div className="flex flex-wrap gap-2 mb-3">
                              {relatedProject.technologies
                                .slice(0, 3)
                                .map((tech, techIndex) => (
                                  <Badge
                                    key={techIndex}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {tech}
                                  </Badge>
                                ))}
                            </div>
                            <h4 className="font-bold text-lg mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              <Link href={`/projects/${relatedProject.slug}`}>
                                {relatedProject.title}
                              </Link>
                            </h4>
                            <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                              {relatedProject.description}
                            </p>
                          </div>
                          <div className="flex justify-between items-center text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>{relatedProject.date || "2023"}</span>
                            </div>
                            <Link
                              href={`/projects/${relatedProject.slug}`}
                              className="text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center"
                            >
                              View Details
                              <ChevronRight className="ml-1 h-4 w-4" />
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg sticky top-24"
              >
                <h3 className="text-xl font-semibold mb-6 flex items-center">
                  <div className="w-1 h-6 bg-blue-600 dark:bg-blue-400 mr-3"></div>
                  Project Details
                </h3>

                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Category
                    </h4>
                    <p className="font-medium">
                      {project.category || "Web Development"}
                    </p>
                  </div>

                  {project.client && (
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Client
                      </h4>
                      <p className="font-medium">{project.client}</p>
                    </div>
                  )}

                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Date
                    </h4>
                    <p className="font-medium">{project.date || "2023"}</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 my-6 pt-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <div className="w-1 h-6 bg-blue-600 dark:bg-blue-400 mr-3"></div>
                    Technologies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="shadow-sm"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                {project.github || project.demo ? (
                  <div className="border-t border-gray-200 dark:border-gray-700 my-6 pt-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <div className="w-1 h-6 bg-blue-600 dark:bg-blue-400 mr-3"></div>
                      Links
                    </h3>
                    <div className="space-y-3">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          <Github className="h-4 w-4 mr-2" />
                          <span>GitHub Repository</span>
                        </a>
                      )}
                      {project.demo && (
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          <span>Live Demo</span>
                        </a>
                      )}
                    </div>
                  </div>
                ) : null}

                <div className="border-t border-gray-200 dark:border-gray-700 my-6 pt-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <div className="w-1 h-6 bg-blue-600 dark:bg-blue-400 mr-3"></div>
                    Share
                  </h3>
                  <div className="flex space-x-2">
                    <motion.a
                      href={`https://x.com/AdoumOuangnamou/intent/tweet?url=${encodeURIComponent(
                        typeof window !== "undefined"
                          ? window.location.href
                          : ""
                      )}&text=${encodeURIComponent(project.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ y: -3, scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800/40 transition-colors"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </motion.a>
                    <motion.button
                      whileHover={{ y: -3, scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800/40 transition-colors"
                      onClick={() => copyToClipboard()}
                    >
                      {copied ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <Copy className="h-5 w-5" />
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
