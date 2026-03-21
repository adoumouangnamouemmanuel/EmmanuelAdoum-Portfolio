"use client";

import { Button } from "@/components/ui/button";
import { motion, useInView } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

export default function AboutSection() {
  const ref = useRef(null);
  const textRef = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const skills = [
    "Artificial Intelligence",
    "Responsive Web Design",
    "Frontend Development",
    "Backend Architecture",
    "Database Management",
    "Deep Learning",
    "API Engineering",
    "UI/UX Implementation",
    "Performance Tuning",
    "DevOps & Deployment",
  ];

  return (
    <section
      id="about"
      className="pb-24 lg:pb-32 bg-slate-50 dark:bg-slate-950 overflow-hidden relative"
    >
      <div className="section-container px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-center"
        >
          {/* Left side with clean, professional image overlay */}
          <div className="relative mx-auto lg:mx-0 w-full max-w-lg lg:max-w-none">
            <motion.div
              variants={itemVariants}
              className="relative z-10 w-full aspect-[4/5] lg:aspect-square rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-300/50 dark:shadow-blue-900/10 border border-slate-200/50 dark:border-slate-800/50 group"
            >
              <Image
                src="/images/emma-hero.png"
                alt="Emmanuel Adoum"
                fill
                className="object-cover object-center"
              />
              {/* Professional subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent pointer-events-none" />
              
              <div className="absolute bottom-0 left-0 right-0 p-8 pointer-events-none">
                <h3 className="text-white text-2xl font-bold tracking-tight drop-shadow-md">
                  Emmanuel Adoum
                </h3>
                <p className="text-slate-200 font-medium mt-1 drop-shadow-md">
                  Software Engineer
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right side with text */}
          <motion.div
            ref={textRef}
            variants={containerVariants}
            className="relative lg:pl-10"
          >
            <motion.div variants={itemVariants} className="mb-6">
              <p className="inline-flex items-center rounded-full border border-blue-200/60 bg-blue-50/50 backdrop-blur-md px-4 py-1.5 text-xs font-bold tracking-widest uppercase text-blue-700 shadow-sm dark:border-blue-900/60 dark:bg-blue-900/20 dark:text-blue-400">
                Behind The Code
              </p>
            </motion.div>

            <motion.h2
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-[3.5rem] font-bold tracking-tighter mb-8 text-slate-900 dark:text-white leading-[1.1]"
            >
              Engineering with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                Purpose
              </span>{" "}
              & Precision.
            </motion.h2>

            <motion.div
              variants={itemVariants}
              className="space-y-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-10"
            >
              <p>
                I’m a software engineer focused on building scalable web and AI-driven systems that solve real-world problems.
              </p>
              <p>
                Beyond coding, I lead technical initiatives and work on projects aimed at improving access to technology and opportunity, particularly in underserved communities. I’m driven by building solutions that are not just functional, but meaningful and long-lasting.
              </p>
            </motion.div>

            {/* Skills section */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-12"
            >
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-6 h-1 bg-blue-600 rounded-full" />
                  Key Skills
                </h3>
                <ul className="space-y-3">
                  {skills.slice(0, 5).map((skill, index) => (
                    <motion.li
                      key={index}
                      className="flex items-center text-slate-700 dark:text-slate-300 font-medium text-sm sm:text-base group"
                    >
                      <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-500 mr-3 flex-shrink-0 transition-transform group-hover:scale-125" />
                      <span className="group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">{skill}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-6 h-1 bg-indigo-600 rounded-full" />
                  Expertise
                </h3>
                <ul className="space-y-3">
                  {skills.slice(5).map((skill, index) => (
                    <motion.li
                      key={index}
                      className="flex items-center text-slate-700 dark:text-slate-300 font-medium text-sm sm:text-base group"
                    >
                      <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 dark:text-indigo-500 mr-3 flex-shrink-0 transition-transform group-hover:scale-125" />
                      <span className="group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">{skill}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button
                asChild
                size="lg"
                className="group h-14 rounded-full bg-slate-900 text-white px-8 text-base shadow-xl shadow-slate-900/10 transition-all hover:scale-105 hover:bg-slate-800 dark:bg-blue-600 dark:shadow-blue-900/20 dark:hover:bg-blue-500 w-full sm:w-auto"
              >
                <Link href="#projects">
                  View My Work
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
