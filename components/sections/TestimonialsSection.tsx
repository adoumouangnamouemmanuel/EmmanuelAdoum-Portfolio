"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useInView,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { testimonials } from "@/data/testimonials";

export default function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -30]);

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

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    // Reset autoplay timer when manually changing
    if (autoplayRef.current) {
      clearTimeout(autoplayRef.current);
      startAutoplay();
    }
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    // Reset autoplay timer when manually changing
    if (autoplayRef.current) {
      clearTimeout(autoplayRef.current);
      startAutoplay();
    }
  };

  const startAutoplay = () => {
    if (autoplay) {
      autoplayRef.current = setTimeout(() => {
        setActiveIndex((prev) =>
          prev === testimonials.length - 1 ? 0 : prev + 1
        );
        startAutoplay();
      }, 5000);
    }
  };

  // Handle autoplay
  useEffect(() => {
    startAutoplay();

    return () => {
      if (autoplayRef.current) {
        clearTimeout(autoplayRef.current);
      }
    };
  }, [autoplay]);

  // Pause autoplay on hover
  const handleMouseEnter = () => {
    if (autoplayRef.current) {
      clearTimeout(autoplayRef.current);
    }
  };

  const handleMouseLeave = () => {
    startAutoplay();
  };

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden">
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
            Testimonials
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            What <span className="gradient-text">People Say</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Feedback from clients and colleagues I've had the pleasure to work
            with throughout my career.
          </motion.p>
        </div>

        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="relative max-w-4xl mx-auto"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 relative"
            >
              <Quote className="absolute top-6 left-6 h-12 w-12 text-blue-100 dark:text-blue-900/30" />
              <Quote className="absolute bottom-6 right-6 h-12 w-12 text-blue-100 dark:text-blue-900/30 rotate-180" />

              <div className="relative z-10">
                <div className="flex justify-center mb-8">
                  <motion.div
                    className="w-20 h-20 rounded-full overflow-hidden border-4 border-blue-100 dark:border-blue-900/30 shadow-lg"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Image
                      src={
                        testimonials[activeIndex].avatar ||
                        "/placeholder.svg?height=80&width=80"
                      }
                      alt={testimonials[activeIndex].name}
                      width={80}
                      height={80}
                      className="object-cover"
                    />
                  </motion.div>
                </div>

                <div className="flex justify-center mb-4">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.div
                        key={star}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + star * 0.1 }}
                      >
                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      </motion.div>
                    ))}
                  </div>
                </div>

                <motion.p
                  className="text-lg md:text-xl italic mb-6 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  "{testimonials[activeIndex].quote}"
                </motion.p>

                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h4 className="font-bold text-lg text-blue-600 dark:text-blue-400">
                    {testimonials[activeIndex].name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {testimonials[activeIndex].title},{" "}
                    {testimonials[activeIndex].company}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation controls */}
          <div className="flex justify-between items-center mt-8">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="outline"
                size="icon"
                onClick={prevTestimonial}
                className="rounded-full shadow-md hover:shadow-lg"
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="sr-only">Previous testimonial</span>
              </Button>
            </motion.div>

            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    index === activeIndex
                      ? "bg-blue-600 scale-125"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="outline"
                size="icon"
                onClick={nextTestimonial}
                className="rounded-full shadow-md hover:shadow-lg"
              >
                <ChevronRight className="h-5 w-5" />
                <span className="sr-only">Next testimonial</span>
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Additional testimonials in grid */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16"
        >
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                y: -10,
                transition: { type: "spring", stiffness: 300, damping: 10 },
              }}
              className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-start space-x-4 mb-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-blue-100 dark:border-blue-900/30">
                  <Image
                    src={
                      testimonial.avatar ||
                      "/placeholder.svg?height=48&width=48"
                    }
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-blue-600 dark:text-blue-400">
                    {testimonial.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.title}, {testimonial.company}
                  </p>
                </div>
              </div>

              <div className="flex mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-4 w-4 text-yellow-500 fill-yellow-500"
                  />
                ))}
              </div>

              <p className="text-xs text-muted-foreground italic">
                "{testimonial.quote}"
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
