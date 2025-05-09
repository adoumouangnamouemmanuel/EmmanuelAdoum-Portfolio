"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { BookOpen, Code, Download, ExternalLink, Github, Linkedin, Mail, MapPin, Twitter } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

// BlogPost type for recent posts
type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
};

export default function AboutPage() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  }

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
      },
    },
  }

  const skills = [
    { name: "JavaScript", level: 90 },
    { name: "React", level: 85 },
    { name: "Node.js", level: 80 },
    { name: "Next.js", level: 85 },
    { name: "TypeScript", level: 75 },
    { name: "Python", level: 70 },
    { name: "UI/UX Design", level: 65 },
    { name: "Database Management", level: 75 },
  ]

  const experiences = [
    {
      title: "Software Engineer",
      company: "Tech Innovators",
      period: "2022 - Present",
      description:
        "Leading development of educational technology solutions aimed at improving access to quality education in underserved communities.",
    },
    {
      title: "Web Developer",
      company: "Digital Solutions",
      period: "2020 - 2022",
      description:
        "Developed responsive web applications focused on sustainability tracking and environmental impact assessment.",
    },
    {
      title: "Research Assistant",
      company: "Ashesi University",
      period: "2018 - 2020",
      description:
        "Conducted research on innovative technological solutions for community development challenges in Africa.",
    },
  ]

  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [postsError, setPostsError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      setLoadingPosts(true);
      setPostsError(null);
      try {
        const res = await fetch("/api/posts?limit=3&published=true");
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();
        setRecentPosts(data.posts || []);
      } catch (err) {
        setPostsError("Could not load blog posts.");
      } finally {
        setLoadingPosts(false);
      }
    }
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl overflow-hidden mb-16"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-pink-500/20 backdrop-blur-sm z-0"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 p-8 md:p-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl"
            >
              <Image
                src="/images/emma-head.png"
                alt="Emmanuel Adoum"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-violet-900/50 to-transparent"></div>
            </motion.div>
            <div className="text-center md:text-left">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent mb-4"
              >
                Emmanuel Adoum
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-wrap justify-center md:justify-start gap-3 mb-6"
              >
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-300">
                  <Code className="mr-1 h-3.5 w-3.5" />
                  Software Engineer & AI Engineer
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300">
                  <MapPin className="mr-1 h-3.5 w-3.5" />
                  Chad
                </span>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl"
              >
                Tech enthusiast focused on using innovation to tackle community challenges. Combining technical
                expertise with a passion for social impact to create solutions that make a difference.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex flex-wrap justify-center md:justify-start gap-3"
              >
                <Button
                  asChild
                  className="rounded-full bg-gradient-to-r from-violet-600 to-pink-500 hover:from-violet-700 hover:to-pink-600 text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 transition-all duration-200"
                >
                  <Link href="/contact">Get in Touch</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border-violet-200 dark:border-violet-800 hover:bg-violet-50 dark:hover:bg-violet-900/30 text-violet-700 dark:text-violet-300"
                >
                    <Link
                        href="/resume.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center">
                    <Download className="mr-2 h-4 w-4" />
                    Download CV
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border-violet-200 dark:border-violet-800 hover:bg-violet-50 dark:hover:bg-violet-900/30 text-violet-700 dark:text-violet-300"
                >
                  <Link href="/" className="flex items-center">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Visit Portfolio
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border-violet-200 dark:border-violet-800 hover:bg-violet-50 dark:hover:bg-violet-900/30 text-violet-700 dark:text-violet-300"
                >
                  <Link href="/blog" className="flex items-center">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Read My Blog
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Bio Section */}
        <motion.section variants={containerVariants} initial="hidden" animate="visible" className="mb-16">
          <motion.h2
            variants={itemVariants}
            className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent mb-6"
          >
            About Me
          </motion.h2>
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100 dark:border-gray-700"
          >
            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              Emmanuel Adoum is a tech enthusiast from Chad, focused on using innovation to tackle community challenges.
              With skills in computer science and engineering, he works on projects that improve education and
              sustainability.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              A strong leader, Emmanuel combines technical expertise with a passion for social impact, aiming to solve
              real-world problems through creative solutions.
            </p>
          </motion.div>
        </motion.section>

        {/* Blog Section */}
        <motion.section variants={containerVariants} initial="hidden" animate="visible" className="mb-16">
          <motion.h2
            variants={itemVariants}
            className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent mb-6"
          >
            My Blog
          </motion.h2>
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100 dark:border-gray-700 mb-6"
          >
            <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
              I write about technology, innovation, and development in Africa. My blog is a platform where I share
              insights, tutorials, and thoughts on how technology can be leveraged to address challenges in developing
              regions.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {loadingPosts ? (
                <div className="col-span-3 text-center text-gray-500 dark:text-gray-400">Loading...</div>
              ) : postsError ? (
                <div className="col-span-3 text-center text-red-500">{postsError}</div>
              ) : recentPosts.length === 0 ? (
                <div className="col-span-3 text-center text-gray-500 dark:text-gray-400">No posts found.</div>
              ) : (
                recentPosts.map((post, index) => (
                  <motion.div
                    key={post.slug}
                    variants={itemVariants}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all"
                    >
                        <Image src={"/images/posts/blog.avif"} alt={post.title} width={300} height={100} />
                    <span className="text-xs text-violet-600 dark:text-violet-400">{post.date}</span>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 mt-1 mb-2 line-clamp-2">{post.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">{post.excerpt}</p>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-sm font-medium text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300"
                    >
                      Read more →
                    </Link>
                  </motion.div>
                ))
              )}
            </div>

            <div className="text-center">
              <Button
                asChild
                className="rounded-full bg-gradient-to-r from-violet-600 to-pink-500 hover:from-violet-700 hover:to-pink-600 text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 transition-all duration-200"
              >
                <Link href="/blog" className="flex items-center">
                  <BookOpen className="mr-2 h-4 w-4" />
                  View All Posts
                </Link>
              </Button>
            </div>
          </motion.div>
        </motion.section>

        {/* Skills Section */}
        <motion.section variants={containerVariants} initial="hidden" animate="visible" className="mb-16">
          <motion.h2
            variants={itemVariants}
            className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent mb-6"
          >
            Skills & Expertise
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                variants={itemVariants}
                className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md border border-gray-100 dark:border-gray-700"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">{skill.name}</h3>
                  <span className="text-sm text-violet-600 dark:text-violet-400">{skill.level}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <motion.div
                    className="bg-gradient-to-r from-violet-600 to-pink-500 h-2.5 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                  ></motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Experience Section */}
        <motion.section variants={containerVariants} initial="hidden" animate="visible" className="mb-16">
          <motion.h2
            variants={itemVariants}
            className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent mb-6"
          >
            Experience
          </motion.h2>
          <div className="relative pl-8 border-l-2 border-violet-200 dark:border-violet-800 space-y-10">
            {experiences.map((exp, index) => (
              <motion.div key={exp.title} variants={itemVariants} className="relative">
                <div className="absolute -left-[41px] h-8 w-8 rounded-full bg-gradient-to-r from-violet-600 to-pink-500 flex items-center justify-center shadow-lg">
                  <div className="h-3 w-3 rounded-full bg-white"></div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-700">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-300 mb-3">
                    {exp.period}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">{exp.title}</h3>
                  <h4 className="text-violet-600 dark:text-violet-400 mb-3">{exp.company}</h4>
                  <p className="text-gray-600 dark:text-gray-300">{exp.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Connect Section */}
        <motion.section variants={fadeInVariants} initial="hidden" animate="visible" className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent mb-6">
            Let&apos;s Connect
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            I&apos;m always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <motion.a
              href="https://github.com/adoumouangnamouemmanuel"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-violet-100 dark:hover:bg-violet-900/30 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
            >
              <Github className="h-5 w-5" />
            </motion.a>
            <motion.a
              href="https://www.linkedin.com/in/ouang-namou-emmanuel-adoum"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-violet-100 dark:hover:bg-violet-900/30 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
            >
              <Linkedin className="h-5 w-5" />
            </motion.a>
            <motion.a
              href="https://x.com/adoumouangnamou"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-violet-100 dark:hover:bg-violet-900/30 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
            >
              <Twitter className="h-5 w-5" />
            </motion.a>
            <motion.a
              href="mailto:emmanuel.adoum@ashesi.edu.gh"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-violet-100 dark:hover:bg-violet-900/30 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
            >
              <Mail className="h-5 w-5" />
            </motion.a>
          </div>
        </motion.section>
      </div>
    </div>
  )
}
