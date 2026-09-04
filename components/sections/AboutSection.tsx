"use client";

import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Briefcase, Download, FolderGit2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, MouseEvent } from "react";

type Locale = "en" | "fr";

type AboutAction = {
  label: string;
  href: string;
  icon: React.ReactNode;
  download?: string;
};

function AboutActionButton({ action }: { action: AboutAction }) {
  const button = (
    <>
      <span className="absolute inset-0 rounded-[5px] bg-black/10 translate-y-0.5 transition-transform duration-200 ease-out group-hover:translate-y-1 group-active:translate-y-px" />
      <span className="absolute inset-0 rounded-[5px] bg-[linear-gradient(to_left,hsl(221_83%_36%)_0%,hsl(221_83%_53%)_8%,hsl(221_83%_53%)_92%,hsl(221_83%_36%)_100%)]" />
      <span className="relative flex w-full items-center justify-center gap-1.5 rounded-[5px] bg-slate-50 px-3 py-2 text-[11px] font-semibold text-slate-950 shadow-sm transition-all duration-200 ease-out -translate-y-1 group-hover:-translate-y-1.5 group-hover:bg-blue-500 group-hover:text-white group-active:-translate-y-0.5 sm:gap-2 sm:px-5 sm:py-2.5 sm:text-[15px] lg:px-6 lg:py-3 lg:text-lg">
        {action.icon}
        {action.label}
      </span>
    </>
  );

  const className =
    "group relative inline-block rounded-[5px] bg-transparent p-0 font-semibold transition-[filter] duration-200 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-slate-950";

  if (action.download) {
    return (
      <a href={action.href} download={action.download} className={className}>
        {button}
      </a>
    );
  }

  return (
    <Link href={action.href} className={className}>
      {button}
    </Link>
  );
}

export default function AboutSection({ locale = "en" }: { locale?: Locale }) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  
  // 3D Tilt Effect Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const t =
    locale === "fr"
      ? {
          title: "À PROPOS DE MOI",
          name: "Emmanuel Adoum",
          role: "Ingénieur Informatique & Développeur Logiciel",
          description:
            "Je conçois des solutions à de vrais problèmes, de l'éducation à la finance, en passant par les systèmes intelligents. Je suis attiré par les idées ambitieuses, en particulier là où la technologie peut rendre les choses plus rapides, plus intelligentes ou tout simplement possibles. Originaire du Tchad, je construis depuis le Ghana.",
          learnMore: "En savoir plus sur moi à travers mes :",
          actions: [
            { label: "Projets", href: "#projects", icon: <FolderGit2 className="h-4 w-4 lg:h-5 lg:w-5" /> },
            { label: "Parcours", href: "#journey", icon: <Briefcase className="h-4 w-4 lg:h-5 lg:w-5" /> },
            { label: "CV", href: "/resume_fr.pdf", download: "Emmanuel-Adoum-CV.pdf", icon: <Download className="h-4 w-4 lg:h-5 lg:w-5" /> },
          ] satisfies AboutAction[],
        }
      : {
          title: "ABOUT ME",
          name: "Emmanuel Adoum",
          role: "Computer Engineer & Software Developer",
          description:
            "I build things that solve real problems from education and finance to intelligent systems. I’m drawn to ambitious ideas, especially where technology can make something faster, smarter, or simply possible. Originally from Chad, I’m building from Ghana.",
          learnMore: "Learn More About Me From My:",
          actions: [
            { label: "Projects", href: "#projects", icon: <FolderGit2 className="h-4 w-4 lg:h-5 lg:w-5" /> },
            { label: "Experience", href: "#journey", icon: <Briefcase className="h-4 w-4 lg:h-5 lg:w-5" /> },
            { label: "Resume", href: "/resume.pdf", download: "Emmanuel-Adoum-Resume.pdf", icon: <Download className="h-4 w-4 lg:h-5 lg:w-5" /> },
          ] satisfies AboutAction[],
        };

  const panelVariants = {
    hidden: { opacity: 0, scale: 0.96 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.55,
        ease: [0.16, 1, 0.3, 1] as const,
        staggerChildren: 0.12,
      },
    },
  };

  const leftColumnVariants = {
    hidden: { opacity: 0, x: -40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const rightColumnVariants = {
    hidden: { opacity: 0, x: 40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const words = t.description.split(" ");

  return (
    <section
      id="about"
      className="relative flex min-h-[calc(100vh-52px)] items-center justify-center overflow-hidden bg-transparent py-12 text-center text-slate-950 dark:text-slate-100 sm:py-16 md:py-24"
    >
      <motion.div
        ref={sectionRef}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={panelVariants}
        className="relative z-10 w-full px-4 sm:px-6 lg:px-8"
      >
        <div
          data-about-panel
          className="mx-auto w-full max-w-6xl rounded-[20px] border border-slate-200/70 bg-gradient-to-br from-white/82 via-blue-50/48 to-white/68 p-6 shadow-[0_8px_32px_rgba(15,23,42,0.14)] backdrop-blur-[3px] dark:border-white/20 dark:from-white/10 dark:via-white/[0.04] dark:to-white/[0.02] dark:shadow-[0_8px_32px_rgba(0,0,0,0.37)] sm:p-10 lg:p-12"
        >
          <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-extrabold uppercase leading-tight tracking-normal text-slate-950 dark:text-slate-100">
            {t.title}
          </h2>

          <div className="mt-8 flex flex-col items-center justify-center gap-10 lg:flex-row lg:items-start lg:gap-14">
            
            {/* Left Column: 3D Tilt Image */}
            <motion.div
              variants={leftColumnVariants}
              className="flex w-full flex-1 flex-col items-center justify-center lg:items-end"
              style={{ perspective: 1000 }}
            >
              <motion.div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                  rotateX,
                  rotateY,
                  transformStyle: "preserve-3d",
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative aspect-square w-full overflow-visible rounded-[5%] shadow-[0_20px_40px_rgba(0,0,0,0.2)] transition-shadow duration-300 hover:shadow-[0_30px_60px_rgba(37,99,235,0.25)] sm:max-w-[380px] lg:max-w-[420px]"
              >
                <Image
                  src="/images/emma-hero.jpg"
                  alt="Emmanuel Adoum"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 380px, 420px"
                  className="rounded-[5%] object-cover object-center brightness-95 saturate-[90%]"
                />
                
                {/* 3D Glass Overlay for extra depth */}
                <div 
                  className="pointer-events-none absolute inset-0 rounded-[5%] bg-gradient-to-tr from-white/10 to-transparent mix-blend-overlay"
                  style={{ transform: "translateZ(30px)" }}
                />
              </motion.div>
            </motion.div>

            {/* Right Column: Bio & Buttons */}
            <motion.div
              variants={rightColumnVariants}
              className="flex w-full flex-[1.5] flex-col items-center gap-6 lg:items-start"
            >
              <div className="w-full rounded-xl border border-slate-300/70 bg-slate-100 px-5 py-5 text-left text-slate-950 shadow-sm sm:px-6 sm:py-6 md:text-justify">
                
                {/* Animated Name Gradient */}
                <motion.span 
                  animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  className="block bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-[length:200%_auto] bg-clip-text text-3xl font-bold leading-tight text-transparent dark:from-blue-400 dark:via-cyan-300 dark:to-blue-400 sm:text-3xl lg:text-4xl"
                >
                  {t.name}
                </motion.span>
                
                <p className="mt-1 text-base font-bold text-slate-700 dark:text-slate-500 sm:text-base">
                  {t.role}
                </p>
                
                {/* Staggered Word Reveal */}
                <motion.p 
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { staggerChildren: 0.015 } }
                  }}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  className="mt-4 flex flex-wrap gap-x-[0.25rem] text-base font-normal leading-relaxed sm:text-base lg:text-lg"
                >
                  {words.map((word, i) => (
                    <motion.span
                      key={i}
                      variants={{
                        hidden: { opacity: 0, y: 8 },
                        visible: { opacity: 1, y: 0 }
                      }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </motion.p>
              </div>

              <div className="mt-2 w-full text-center lg:text-left">
                <p className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {t.learnMore}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 lg:justify-start">
                  {t.actions.map((action) => (
                    <AboutActionButton key={action.label} action={action} />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
