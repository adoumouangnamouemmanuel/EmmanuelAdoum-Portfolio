"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BriefcaseIcon,
  GraduationCap,
  Calendar,
  MapPin,
  Building,
  Award,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { experiences } from "@/data/experiences";
import { education } from "@/data/education";

export default function JourneySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [activeTab, setActiveTab] = useState("experience");
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

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

  const tabVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <section
      id="journey"
      className="py-24 bg-gradient-to-b from-white to-blue-50 dark:from-gray-950 dark:to-gray-900 overflow-hidden"
    >
      <div className="section-container">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 shadow-md mb-4"
          >
            My Journey
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Professional Path & <span className="gradient-text">Education</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            My career journey and educational background that have shaped my
            skills and expertise.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <Tabs
            defaultValue="experience"
            className="w-full"
            onValueChange={setActiveTab}
          >
            <div className="flex justify-center mb-12">
              <TabsList className="grid grid-cols-2 w-full max-w-md shadow-xl rounded-xl overflow-hidden p-1 bg-white dark:bg-gray-800">
                <TabsTrigger
                  value="experience"
                  className="flex items-center gap-2 py-3 data-[state=active]:shadow-md data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:data-[state=active]:bg-blue-600 rounded-lg transition-all"
                >
                  <BriefcaseIcon className="h-4 w-4" />
                  <span>Experience</span>
                </TabsTrigger>
                <TabsTrigger
                  value="education"
                  className="flex items-center gap-2 py-3 data-[state=active]:shadow-md data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:data-[state=active]:bg-blue-600 rounded-lg transition-all"
                >
                  <GraduationCap className="h-4 w-4" />
                  <span>Education</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === "experience" && (
                <TabsContent value="experience" className="mt-0">
                  <motion.div
                    key="experience"
                    variants={tabVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    ref={ref}
                    className="relative"
                  >
                    {/* Timeline line */}
                    <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 via-purple-500 to-blue-600 dark:from-blue-500 dark:via-purple-400 dark:to-blue-500"></div>

                    {experiences.map((experience, index) => (
                      <motion.div
                        key={index}
                        variants={itemVariants}
                        custom={index}
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        transition={{ delay: index * 0.1 }}
                        className={`relative mb-10 md:mb-16 md:w-1/2 ${
                          index % 2 === 0
                            ? "md:pr-10 md:ml-0"
                            : "md:pl-10 md:ml-auto"
                        }`}
                        onMouseEnter={() => setHoveredItem(index)}
                        onMouseLeave={() => setHoveredItem(null)}
                      >
                        {/* Timeline dot */}
                        <motion.div
                          className={`absolute top-6 ${
                            index % 2 === 0
                              ? "right-0 md:-right-3"
                              : "left-0 md:-left-3"
                          } w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center z-10 shadow-lg`}
                          animate={{
                            scale: hoveredItem === index ? 1.2 : 1,
                            boxShadow:
                              hoveredItem === index
                                ? "0 0 0 4px rgba(59, 130, 246, 0.3)"
                                : "none",
                          }}
                        >
                          <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                        </motion.div>

                        <motion.div
                          className="relative p-5 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-blue-100 dark:border-blue-900/30 overflow-hidden group"
                          whileHover={{
                            y: -5,
                            boxShadow:
                              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                          }}
                        >
                          {/* Background gradient on hover */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                          />

                          <div className="relative z-10">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="text-lg font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                  {experience.role}
                                </h3>
                                <p className="text-blue-600 dark:text-blue-400 font-medium flex items-center text-sm">
                                  <Building className="w-3.5 h-3.5 mr-1" />
                                  {experience.company}
                                </p>
                              </div>
                              <Badge
                                variant="outline"
                                className="bg-blue-50 dark:bg-blue-900/20 shadow-sm flex items-center text-xs"
                              >
                                <Calendar className="w-3 h-3 mr-1" />
                                {experience.startDate} - {experience.endDate}
                              </Badge>
                            </div>

                            <p className="text-muted-foreground mb-3 text-sm">
                              {experience.description}
                            </p>

                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {experience.technologies.map(
                                (tech, techIndex) => (
                                  <motion.div
                                    key={techIndex}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{
                                      delay: 0.5 + techIndex * 0.05,
                                    }}
                                    whileHover={{ y: -2, scale: 1.05 }}
                                  >
                                    <Badge
                                      variant="secondary"
                                      className="shadow-sm text-xs"
                                    >
                                      {tech}
                                    </Badge>
                                  </motion.div>
                                )
                              )}
                            </div>

                            {experience.achievements && (
                              <motion.div
                                className="mt-3 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{
                                  opacity: 1,
                                  height: "auto",
                                  transition: { delay: 0.3, duration: 0.3 },
                                }}
                              >
                                <h4 className="font-semibold mb-2 text-blue-800 dark:text-blue-300 flex items-center text-sm">
                                  <Award className="h-3.5 w-3.5 mr-1.5" />
                                  Key Achievements:
                                </h4>
                                <ul className="space-y-1.5">
                                  {experience.achievements.map(
                                    (achievement, achievementIndex) => (
                                      <motion.li
                                        key={achievementIndex}
                                        className="flex items-start text-muted-foreground text-xs"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                          delay: 0.5 + achievementIndex * 0.1,
                                        }}
                                      >
                                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-600 mt-1 mr-2"></span>
                                        {achievement}
                                      </motion.li>
                                    )
                                  )}
                                </ul>
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      </motion.div>
                    ))}
                  </motion.div>
                </TabsContent>
              )}

              {activeTab === "education" && (
                <TabsContent value="education" className="mt-0">
                  <motion.div
                    key="education"
                    variants={tabVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="relative"
                  >
                    {/* Timeline line for education */}
                    <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-[22rem] w-0.5 bg-gradient-to-b from-blue-600 via-purple-500 to-blue-600 dark:from-blue-500 dark:via-purple-400 dark:to-blue-500"></div>

                    {education
                      .filter((item) => item.type === "degree")
                      .map((item, index) => (
                        <motion.div
                          key={index}
                          variants={itemVariants}
                          custom={index}
                          initial="hidden"
                          animate="visible"
                          transition={{ delay: index * 0.1 }}
                          className={`relative mb-10 md:mb-16 md:w-1/2 ${
                            index % 2 === 0
                              ? "md:pr-10 md:ml-0"
                              : "md:pl-10 md:ml-auto"
                          }`}
                          onMouseEnter={() => setHoveredItem(index)}
                          onMouseLeave={() => setHoveredItem(null)}
                        >
                          {/* Timeline dot */}
                          <motion.div
                            className={`absolute top-6 ${
                              index % 2 === 0
                                ? "right-0 md:-right-3"
                                : "left-0 md:-left-3"
                            } w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center z-10 shadow-lg`}
                            animate={{
                              scale: hoveredItem === index ? 1.2 : 1,
                              boxShadow:
                                hoveredItem === index
                                  ? "0 0 0 4px rgba(59, 130, 246, 0.3)"
                                  : "none",
                            }}
                          >
                            <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                          </motion.div>

                          <motion.div
                            className="relative p-5 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-blue-100 dark:border-blue-900/30 overflow-hidden group"
                            whileHover={{
                              y: -5,
                              boxShadow:
                                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                            }}
                          >
                            {/* Background gradient on hover */}
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              initial={{ opacity: 0 }}
                              whileHover={{ opacity: 1 }}
                            />

                            <div className="relative z-10">
                              <div className="flex items-start gap-3">
                                <motion.div
                                  className="w-12 h-12 relative flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 rounded-lg p-1.5 shadow-md"
                                  whileHover={{ rotate: 5 }}
                                >
                                  <Image
                                    src={
                                      item.logo ||
                                      "/placeholder.svg?height=48&width=48"
                                    }
                                    alt={item.institution}
                                    fill
                                    className="object-contain p-1"
                                  />
                                </motion.div>

                                <div>
                                  <h3 className="text-lg font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {item.degree}
                                  </h3>
                                  <p className="text-blue-600 dark:text-blue-400 font-medium text-sm">
                                    {item.institution}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1 mb-2">
                                    <Badge
                                      variant="outline"
                                      className="bg-blue-50 dark:bg-blue-900/20 shadow-sm flex items-center text-xs"
                                    >
                                      <Calendar className="w-3 h-3 mr-1" />
                                      {item.startDate} - {item.endDate}
                                    </Badge>
                                    {item.location && (
                                      <span className="text-xs text-muted-foreground flex items-center">
                                        <MapPin className="w-3 h-3 mr-1" />
                                        {item.location}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-muted-foreground text-sm">
                                    {item.description}
                                  </p>

                                  {item.courses && (
                                    <motion.div
                                      className="mt-3 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg"
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{
                                        opacity: 1,
                                        height: "auto",
                                        transition: {
                                          delay: 0.3,
                                          duration: 0.3,
                                        },
                                      }}
                                    >
                                      <h4 className="font-semibold mb-2 text-blue-800 dark:text-blue-300 text-sm">
                                        Relevant Courses:
                                      </h4>
                                      <div className="flex flex-wrap gap-1.5">
                                        {item.courses.map(
                                          (course, courseIndex) => (
                                            <motion.div
                                              key={courseIndex}
                                              initial={{
                                                opacity: 0,
                                                scale: 0.8,
                                              }}
                                              animate={{ opacity: 1, scale: 1 }}
                                              transition={{
                                                delay: 0.5 + courseIndex * 0.05,
                                              }}
                                              whileHover={{
                                                y: -2,
                                                scale: 1.05,
                                              }}
                                            >
                                              <Badge
                                                variant="secondary"
                                                className="shadow-sm text-xs"
                                              >
                                                {course}
                                              </Badge>
                                            </motion.div>
                                          )
                                        )}
                                      </div>
                                    </motion.div>
                                  )}

                                  {item.website && (
                                    <motion.div
                                      className="mt-3"
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="group text-xs h-8"
                                        asChild
                                      >
                                        <Link
                                          href={item.website}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          Visit Website
                                          <ExternalLink className="ml-1.5 h-3 w-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </Link>
                                      </Button>
                                    </motion.div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </motion.div>
                      ))}

                    {/* Certifications */}
                    <motion.div
                      className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <h3 className="text-2xl font-bold mb-8 text-center">
                        <span className="gradient-text">Certifications</span> &
                        Additional Training
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {education
                          .filter((item) => item.type === "certification")
                          .map((cert, index) => (
                            <motion.div
                              key={index}
                              variants={itemVariants}
                              initial="hidden"
                              animate="visible"
                              transition={{ delay: 0.7 + index * 0.1 }}
                              whileHover={{
                                y: -5,
                                boxShadow:
                                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                              }}
                              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-blue-100 dark:border-blue-900/30 group"
                            >
                              <div className="flex items-center gap-3 mb-3">
                                <motion.div
                                  className="w-10 h-10 relative flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 rounded-lg p-1 shadow-md"
                                  whileHover={{ rotate: 5 }}
                                >
                                  <Image
                                    src={
                                      cert.logo ||
                                      "/placeholder.svg?height=32&width=32"
                                    }
                                    alt={cert.institution}
                                    fill
                                    className="object-contain p-1"
                                  />
                                </motion.div>
                                <div>
                                  <h4 className="font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm">
                                    {cert.degree}
                                  </h4>
                                  <p className="text-xs text-muted-foreground">
                                    {cert.institution}
                                  </p>
                                </div>
                              </div>
                              <Badge
                                variant="outline"
                                className="mb-2 bg-blue-50 dark:bg-blue-900/20 shadow-sm flex items-center w-fit text-xs"
                              >
                                <Calendar className="w-3 h-3 mr-1" />
                                {cert.endDate}
                              </Badge>
                              <p className="text-xs text-muted-foreground">
                                {cert.description}
                              </p>

                              {cert.website && (
                                <motion.div
                                  className="mt-3"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="group text-xs h-8"
                                    asChild
                                  >
                                    <Link
                                      href={cert.website}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      View Certificate
                                      <ExternalLink className="ml-1.5 h-3 w-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </Link>
                                  </Button>
                                </motion.div>
                              )}
                            </motion.div>
                          ))}
                      </div>
                    </motion.div>
                  </motion.div>
                </TabsContent>
              )}
            </AnimatePresence>
          </Tabs>
        </motion.div>
      </div>
    </section>
  );
}
