"use client";

import { testimonials, testimonialsFr } from "@/data/testimonials";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Locale = "en" | "fr";

export default function TestimonialsSection({
  locale = "en",
}: {
  locale?: Locale;
}) {
  const t =
    locale === "fr"
      ? {
          eyebrow: "Témoignages",
          titleLead: "Retours",
          titleAccent: "Clients",
          dotAria: "Aller au témoignage",
        }
      : {
          eyebrow: "Testimonials",
          titleLead: "Client",
          titleAccent: "Endorsements",
          dotAria: "Go to testimonial",
        };

  const testimonialItems = locale === "fr" ? testimonialsFr : testimonials;

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoplay = () => {
    if (autoplay) {
      autoplayRef.current = setTimeout(() => {
        setActiveIndex((prev) =>
          prev === testimonialItems.length - 1 ? 0 : prev + 1,
        );
      }, 7000);
    }
  };

  useEffect(() => {
    startAutoplay();
    return () => {
      if (autoplayRef.current) clearTimeout(autoplayRef.current);
    };
  }, [activeIndex, autoplay]);

  const nextTestimonial = () => {
    if (autoplayRef.current) clearTimeout(autoplayRef.current);
    setAutoplay(false); // Stop autoplay when user manually interacts
    setActiveIndex((prev) =>
      prev === testimonialItems.length - 1 ? 0 : prev + 1,
    );
  };

  const prevTestimonial = () => {
    if (autoplayRef.current) clearTimeout(autoplayRef.current);
    setAutoplay(false);
    setActiveIndex((prev) =>
      prev === 0 ? testimonialItems.length - 1 : prev - 1,
    );
  };

  const handleDotClick = (index: number) => {
    if (autoplayRef.current) clearTimeout(autoplayRef.current);
    setAutoplay(false);
    setActiveIndex(index);
  };

  return (
    <section
      id="testimonials"
      className="py-12 lg:py-16 bg-white dark:bg-slate-950 flex flex-col justify-center items-center overflow-hidden border-t border-slate-200 dark:border-slate-900/50"
    >
      <div
        ref={ref}
        className="section-container relative w-full px-6 lg:px-12 max-w-6xl mx-auto flex flex-col items-center"
      >
        {/* Abstract Background Quote Watermark */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={
            isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }
          }
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute top-1/2 left-[15%] lg:left-1/4 -translate-y-1/2 text-slate-100 dark:text-slate-900 z-0 pointer-events-none hidden md:block"
        >
          <Quote className="w-[200px] h-[200px] lg:w-[400px] lg:h-[400px] opacity-30 transform -rotate-12" />
        </motion.div>

        {/* Header - FAANG Minimalist Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 lg:mb-12 text-center z-10 w-full"
        >
          <p className="inline-flex items-center rounded-full border border-blue-200/60 bg-blue-50/50 backdrop-blur-md px-4 py-1.5 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-blue-700 shadow-sm dark:border-blue-900/60 dark:bg-blue-900/20 dark:text-blue-400 mb-5">
            {t.eyebrow}
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-5xl font-bold tracking-tighter text-slate-900 dark:text-white">
            {t.titleLead}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              {t.titleAccent}
            </span>
          </h2>
        </motion.div>

        {/* The Massive Typography Carousel */}
        <div className="relative w-full z-10 flex flex-col items-center justify-center min-h-[280px] sm:min-h-[200px] lg:min-h-[240px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center text-center w-full max-w-4xl"
            >
              <h3 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-light leading-snug lg:leading-relaxed tracking-tight text-slate-900 dark:text-slate-100 mb-6 lg:mb-10 italic">
                "{testimonialItems[activeIndex].quote}"
              </h3>

              <div className="flex flex-col items-center gap-3">
                <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white uppercase tracking-widest">
                  {testimonialItems[activeIndex].name}
                </p>
                <div className="flex items-center flex-wrap justify-center text-[10px] sm:text-xs font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400 gap-y-2">
                  <span className="text-blue-600 dark:text-blue-400 whitespace-nowrap">
                    {testimonialItems[activeIndex].title}
                  </span>
                  <span className="mx-2 sm:mx-3 text-slate-300 dark:text-slate-700">
                    ·
                  </span>
                  <span className="whitespace-nowrap">
                    {testimonialItems[activeIndex].company}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Minimalist Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex items-center gap-6 sm:gap-8 mt-6 lg:mt-12 z-10"
        >
          <button
            onClick={prevTestimonial}
            className="p-3 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group rounded-full border border-transparent hover:border-blue-200 dark:hover:border-blue-900/50 hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:-translate-x-1" />
          </button>

          <div className="flex gap-2 sm:gap-3">
            {testimonialItems.map((_, i) => (
              <button
                key={i}
                onClick={() => handleDotClick(i)}
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-500 ${i === activeIndex ? "bg-blue-600 dark:bg-blue-400 w-6 sm:w-8" : "bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 w-1.5 sm:w-2"}`}
                aria-label={`${t.dotAria} ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextTestimonial}
            className="p-3 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group rounded-full border border-transparent hover:border-blue-200 dark:hover:border-blue-900/50 hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
