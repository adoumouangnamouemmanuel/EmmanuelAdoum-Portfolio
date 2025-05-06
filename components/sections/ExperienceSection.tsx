"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { experiences } from "@/data/experiences"

export default function ExperienceSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

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
  }

  return (
    <section id="experience" className="py-20">
      <div className="section-container">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary mb-4">
            My Experience
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Professional Journey</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A timeline of my professional experience and the companies I've had the pleasure to work with throughout my
            career.
          </p>
        </div>

        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="relative"
        >
          {/* Timeline line */}
          <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-border"></div>

          {experiences.map((experience, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`relative mb-12 md:mb-0 md:w-1/2 ${
                index % 2 === 0 ? "md:pr-12 md:ml-0" : "md:pl-12 md:ml-auto"
              }`}
            >
              {/* Timeline dot */}
              <div
                className={`absolute top-6 ${
                  index % 2 === 0 ? "right-0 md:-right-3.5" : "left-0 md:-left-3.5"
                } w-7 h-7 rounded-full bg-primary flex items-center justify-center z-10`}
              >
                <div className="w-3 h-3 rounded-full bg-background"></div>
              </div>

              <div className="relative p-6 bg-card rounded-lg shadow-sm border border-border hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{experience.role}</h3>
                    <p className="text-primary font-medium">{experience.company}</p>
                  </div>
                  <Badge variant="outline">
                    {experience.startDate} - {experience.endDate}
                  </Badge>
                </div>

                <p className="text-muted-foreground mb-4">{experience.description}</p>

                <div className="flex flex-wrap gap-2">
                  {experience.technologies.map((tech, techIndex) => (
                    <Badge key={techIndex} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>

                {experience.achievements && (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Key Achievements:</h4>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      {experience.achievements.map((achievement, achievementIndex) => (
                        <li key={achievementIndex}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
