"use client";

import { Button } from "@/components/ui/button";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

export default function AboutSection() {
  const ref = useRef(null);
  const textRef = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const isTextInView = useInView(textRef, { once: true, amount: 0.3 });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Parallax and rotation effects
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const x = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 5]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 1.1]);

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

  const skills = [
    "Artificial Intelligence",
    "Responsive Web Design",
    "Frontend Development",
    "Backend Development",
    "Database Management",
    "Deep Learning",
    "API Development",
    "UI/UX Design",
    "Performance Optimization",
    "DevOps & Deployment",
  ];

  return (
    <section
      id="about"
      className="py-24 bg-gradient-to-b from-white to-blue-50 dark:from-gray-950 dark:to-gray-900 overflow-hidden"
    >
      <div className="section-container">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          {/* Left side with image - keeping this untouched as requested */}
          <div className="relative">
            <motion.div
              variants={itemVariants}
              className="relative z-10"
              style={{ y, rotate }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl group h-[200px] w-[200px] md:h-[500px] md:w-[500px] lg:h-[600px] lg:w-[600px]">
                <Image
                  src="/images/emma-hero.png"
                  alt="Developer portrait"
                  width={600}
                  height={600}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-white text-xl font-bold">
                      Emmanuel Adoum
                    </h3>
                    <p className="text-blue-300">
                      Full-Stack Developer & AI Enthousiast
                    </p>
                  </div>
                </div>
              </div>

              {/* Experience badge */}
              <motion.div
                className="absolute -top-6 -right-6 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg"
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.5, type: "spring" }}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                3+ Years Experience
              </motion.div>

              {/* Floating card */}
              <motion.div
                className="absolute -bottom-8 -left-8 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl max-w-[200px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                whileHover={{
                  y: -5,
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
              >
                <div className="flex items-start space-x-2">
                  <span className="text-4xl">🚀</span>
                  <div>
                    <h4 className="font-bold text-sm">
                      Passionate about creating
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Turning ideas into reality through code
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Decorative elements */}
            <motion.div
              className="absolute -bottom-12 -right-12 w-64 h-64 bg-blue-400/10 rounded-full -z-10 blur-3xl"
              style={{ x, scale }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.7, 0.5],
              }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 8,
              }}
            />

            <motion.div
              className="absolute -top-12 -left-12 w-48 h-48 bg-purple-500/10 rounded-full -z-10 blur-3xl"
              style={{ x: useTransform(scrollYProgress, [0, 1], [0, 50]) }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.7, 0.5],
              }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 6,
                delay: 1,
              }}
            />
          </div>

          {/* Right side with text - enhancing this part */}
          <motion.div
            ref={textRef}
            variants={containerVariants}
            className="relative"
          >
            {/* Subtle background elements */}
            <div className="absolute -z-10 top-1/4 right-0 w-64 h-64 bg-blue-100/30 dark:bg-blue-900/10 rounded-full blur-3xl" />
            <div className="absolute -z-10 bottom-0 left-1/4 w-48 h-48 bg-purple-100/30 dark:bg-purple-900/10 rounded-full blur-3xl" />

            <motion.span
              variants={itemVariants}
              className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 shadow-md mb-4"
              whileHover={{ scale: 1.05 }}
              animate={{
                boxShadow: [
                  "0 2px 4px rgba(59, 130, 246, 0.2)",
                  "0 4px 8px rgba(59, 130, 246, 0.3)",
                  "0 2px 4px rgba(59, 130, 246, 0.2)",
                ],
              }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3 }}
            >
              About Me
            </motion.span>

            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold mb-6"
              whileHover={{ scale: 1.01 }}
            >
              Passionate Developer with a{" "}
              <motion.span
                className="gradient-text"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              >
                Creative Edge
              </motion.span>
            </motion.h2>

            <motion.div
              variants={itemVariants}
              className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-lg p-6 border border-blue-100/50 dark:border-blue-900/50 shadow-sm mb-6"
            >
              <motion.p className="text-muted-foreground mb-4 leading-relaxed">
                <motion.span
                  className="text-blue-600 dark:text-blue-400 font-medium"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Emmanuel Adoum
                </motion.span>{" "}
                is a tech enthusiast from Chad, focused on using innovation to
                tackle community challenges. With skills in computer science and
                engineering, he works on projects that improve education and
                sustainability.
              </motion.p>

              <motion.p className="text-muted-foreground leading-relaxed">
                A strong leader, Emmanuel combines{" "}
                <motion.span
                  className="relative inline-block"
                  whileHover={{
                    color: "hsl(var(--primary))",
                  }}
                >
                  technical expertise
                  <motion.span
                    className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-500"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.span>{" "}
                with a passion for{" "}
                <motion.span
                  className="relative inline-block"
                  whileHover={{
                    color: "hsl(var(--primary))",
                  }}
                >
                  social impact
                  <motion.span
                    className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-500"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.span>
                , aiming to solve real-world problems through creative
                solutions.
              </motion.p>
            </motion.div>

            {/* Skills section - enhanced with animation and styling */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 gap-4 mb-8"
            >
              <div className="space-y-3">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <motion.span
                    className="w-6 h-0.5 bg-blue-600 inline-block mr-2"
                    animate={{
                      width: ["24px", "12px", "24px"],
                    }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 2,
                    }}
                  />
                  Key Skills
                </h3>
                <ul className="space-y-2">
                  {skills.slice(0, 5).map((skill, index) => (
                    <motion.li
                      key={index}
                      className="flex items-center text-muted-foreground bg-white/50 dark:bg-gray-800/50 p-2 rounded-md border border-gray-100 dark:border-gray-700 shadow-sm"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      whileHover={{
                        x: 5,
                        backgroundColor: "rgba(59, 130, 246, 0.1)",
                        borderColor: "rgba(59, 130, 246, 0.3)",
                      }}
                    >
                      <CheckCircle2 className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0" />
                      <span>{skill}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <motion.span
                    className="w-6 h-0.5 bg-blue-600 inline-block mr-2"
                    animate={{
                      width: ["24px", "12px", "24px"],
                    }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 2,
                      delay: 0.5,
                    }}
                  />
                  Expertise
                </h3>
                <ul className="space-y-2">
                  {skills.slice(5).map((skill, index) => (
                    <motion.li
                      key={index}
                      className="flex items-center text-muted-foreground bg-white/50 dark:bg-gray-800/50 p-2 rounded-md border border-gray-100 dark:border-gray-700 shadow-sm"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + index * 0.1 }}
                      whileHover={{
                        x: 5,
                        backgroundColor: "rgba(59, 130, 246, 0.1)",
                        borderColor: "rgba(59, 130, 246, 0.3)",
                      }}
                    >
                      <CheckCircle2 className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0" />
                      <span>{skill}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: [
                  "0 4px 6px rgba(59, 130, 246, 0.1)",
                  "0 10px 15px rgba(59, 130, 246, 0.2)",
                  "0 4px 6px rgba(59, 130, 246, 0.1)",
                ],
              }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3 }}
            >
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all group relative overflow-hidden"
                asChild
              >
                <Link href="#projects">
                  <span className="relative z-10">View My Work</span>
                  <ArrowRight className="relative z-10 ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  <motion.span
                    className="absolute inset-0 bg-blue-700"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: 0 }}
                    transition={{
                      type: "tween",
                      ease: "easeInOut",
                      duration: 0.3,
                    }}
                  />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
