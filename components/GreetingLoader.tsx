"use client";

import { AnimatePresence, motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";

const greetings = [
  { text: "Emmanuel Adoum", flag: "🇹🇩", lang: "Chad / Ghana" },
  { text: "Bonjour", flag: "🇫🇷", lang: "Français" },
  { text: "Hello", flag: "🇬🇧", lang: "English" },
  { text: "Hola", flag: "🇪🇸", lang: "Español" },
  { text: "你好", flag: "🇨🇳", lang: "中文" },
];

const GREETING_STEP_MS = 1100;
const TOTAL_MS = greetings.length * GREETING_STEP_MS;

export default function GreetingLoader() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  // Progress 0→1 over total duration — GPU-friendly (no layout triggers)
  const progress = useMotionValue(0);
  const scaleX = useTransform(progress, [0, 1], [0, 1]);

  useEffect(() => {
    if (
      process.env.NODE_ENV === "development" &&
      new URLSearchParams(window.location.search).has("skipIntro")
    ) {
      setIsVisible(false);
      return;
    }

    // Animate progress bar
    const controls = animate(progress, 1, {
      duration: TOTAL_MS / 1000,
      ease: "linear",
    });

    const timeouts = greetings.map((_, index) =>
      window.setTimeout(() => setActiveIndex(index), index * GREETING_STEP_MS)
    );

    // Trigger curtain exit
    timeouts.push(
      window.setTimeout(() => setExiting(true), TOTAL_MS + 200)
    );
    timeouts.push(
      window.setTimeout(() => setIsVisible(false), TOTAL_MS + 900)
    );

    return () => {
      controls.stop();
      timeouts.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes loader-ring {
          0%   { transform: scale(0.85); opacity: 0.6; }
          60%  { opacity: 0.15; }
          100% { transform: scale(1.25); opacity: 0; }
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50%       { background-position: 100% 50%; }
        }
        .animate-gradient-x { animation: gradient-x 3s ease infinite; }
      `}</style>
      <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: exiting ? "-100%" : 0 }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[10000] grid place-items-center bg-slate-950 text-white overflow-hidden"
          role="status"
          aria-live="polite"
          aria-label="Loading portfolio"
        >
          {/* Faint animated rings — pure CSS transforms, GPU only */}
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="pointer-events-none absolute rounded-full border border-blue-500/10"
              style={{
                width: `${320 + i * 180}px`,
                height: `${320 + i * 180}px`,
                animation: `loader-ring ${2.4 + i * 0.6}s ease-out ${i * 0.4}s infinite`,
              }}
            />
          ))}

          {/* EA. monogram — top left */}
          <motion.span
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="absolute top-8 left-8 text-2xl font-black tracking-tighter text-white/90"
          >
            EA.
          </motion.span>

          {/* Step counter — top right */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="absolute top-9 right-8 text-[10px] font-bold tracking-[0.3em] uppercase text-slate-500"
          >
            {String(activeIndex + 1).padStart(2, "0")} / {String(greetings.length).padStart(2, "0")}
          </motion.span>

          {/* Center content */}
          <div className="relative flex flex-col items-center gap-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={greetings[activeIndex].text}
                initial={
                  activeIndex === 0
                    ? { opacity: 1, y: 0, filter: "blur(0px)" }
                    : { opacity: 0, y: 20, filter: "blur(10px)" }
                }
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center gap-4"
              >
                {/* Greeting text with gradient */}
                <h1 className="px-6 text-center text-[clamp(2.5rem,9vw,5.5rem)] font-extrabold leading-none tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-400 bg-[length:200%_auto] animate-gradient-x">
                  {greetings[activeIndex].text}
                </h1>

                {/* Flag + language tag */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.15 }}
                  className="flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm"
                >
                  <span className="text-xl leading-none">{greetings[activeIndex].flag}</span>
                  <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-slate-400">
                    {greetings[activeIndex].lang}
                  </span>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress bar — bottom, GPU-accelerated scaleX */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-800">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400 origin-left"
              style={{ scaleX }}
            />
          </div>
        </motion.div>
      )}

    </AnimatePresence>
    </>
  );
}
