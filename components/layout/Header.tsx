"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronRight, Moon, Sun } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "next-themes"

const navItems = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Journey", href: "#journey" },
  { name: "Testimonials", href: "#testimonials" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "#contact" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { theme, setTheme } = useTheme()
  const [activeSection, setActiveSection] = useState("home");
  
  const [sectionPositions, setSectionPositions] = useState<{
    [key: string]: number;
  }>({});
  
  const headerRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();
  const { scrollY, scrollYProgress } = useScroll();

  // Progress Bar
  const horizontalProgress = useTransform(scrollYProgress, [0, 1], [0, 100]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      const sections = navItems
        .filter((item) => item.href.startsWith("#"))
        .map((item) => item.href.substring(1));

      const currentSection = sections.find((section) => {
        const element = document.getElementById(section);
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return rect.top <= 200 && rect.bottom >= 100;
      });

      if (currentSection) setActiveSection(currentSection);
    };

    const calculateSectionPositions = () => {
      const positions: { [key: string]: number } = {};
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      navItems
        .filter((item) => item.href.startsWith("#"))
        .forEach((item) => {
          const element = document.getElementById(item.href.substring(1));
          if (element) {
            const position = (element.offsetTop / totalHeight) * 100;
            positions[item.href.substring(1)] = Math.min(position, 100);
          }
        });
      setSectionPositions(positions);
    };

    window.addEventListener("scroll", handleScroll);
    calculateSectionPositions();
    window.addEventListener("resize", calculateSectionPositions);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", calculateSectionPositions);
    };
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  // Framer Variants
  const logoVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    hover: { scale: 1.05, transition: { duration: 0.3 } },
  };

  const mobileMenuVariants = {
    closed: {
      y: "-100%",
      opacity: 0,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
    },
    open: {
      y: "0%",
      opacity: 1,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.05, delayChildren: 0.1 }
    },
  };

  const mobileItemVariants = {
    closed: { opacity: 0, y: 20 },
    open: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <>
      {/* Universal Progress Line (absolute top) */}
      <motion.div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 z-[60]"
        style={{ width: horizontalProgress.get() + "%" }}
      />

      {/* The Magnetic Floating Dock (Desktop & Mobile Wrapper) */}
      <header
        ref={headerRef}
        className={`fixed left-0 right-0 z-50 transition-all duration-500 ease-[0.16,1,0.3,1] ${
          isScrolled 
            ? "top-2 sm:top-4 lg:top-6" 
            : "top-4 sm:top-6 lg:top-8"
        }`}
      >
        <div className="flex justify-center w-full px-4 pointer-events-none">
           <div className={`pointer-events-auto flex items-center justify-between transition-all duration-500 rounded-full px-4 sm:px-6 py-2.5 sm:py-3 w-full lg:w-max mx-auto shadow-2xl border ${
             isScrolled
               ? "bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border-slate-200/50 dark:border-slate-800/50 shadow-slate-900/5 dark:shadow-black/20"
               : "bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border-slate-200/30 dark:border-slate-800/30 shadow-black/5"
           }`}>
             
             {/* Architectural Logo Node */}
             <Link href="/" className="flex items-center space-x-2 z-10 mr-4 lg:mr-8 flex-shrink-0" onClick={() => setMobileMenuOpen(false)}>
               <motion.div variants={logoVariants} initial="initial" animate="animate" whileHover="hover">
                 <span className="text-xl sm:text-2xl font-black tracking-tighter text-slate-900 dark:text-white">
                   EA.
                 </span>
               </motion.div>
             </Link>

             {/* Dynamic Magnetic Desktop Navigation */}
             <nav className="hidden lg:flex items-center gap-1.5 relative px-2">
               {navItems.map((item, i) => {
                 const isActive = activeSection === item.href.substring(1) && item.href.startsWith("#");
                 const isHovered = hoveredIndex === i;
                 return (
                   <motion.div
                     key={item.name}
                     initial={{ opacity: 0, y: -10 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.4, delay: 0.05 * i }}
                     onMouseEnter={() => setHoveredIndex(i)}
                     onMouseLeave={() => setHoveredIndex(null)}
                     className="relative"
                   >
                     <Link
                       href={item.href}
                       scroll={item.href.startsWith("#") ? false : true}
                       className={`relative z-20 px-4 py-2 text-xs font-bold tracking-[0.15em] uppercase transition-colors duration-300 block ${
                         isActive || isHovered
                           ? "text-slate-900 dark:text-white"
                           : "text-slate-500 dark:text-slate-400"
                       }`}
                       onClick={(e) => {
                         if (item.href.startsWith("#")) {
                           e.preventDefault();
                           document.querySelector(item.href)?.scrollIntoView({ behavior: "smooth" });
                           setActiveSection(item.href.substring(1));
                         }
                       }}
                     >
                       {item.name}
                     </Link>
                     
                     {/* The Target Pill (Hover state) */}
                     {isHovered && (
                       <motion.div
                         layoutId="nav-hover-pill"
                         className="absolute inset-0 z-10 bg-slate-200/50 dark:bg-slate-800/50 rounded-full"
                         transition={{ type: "spring", stiffness: 400, damping: 30 }}
                       />
                     )}
                     
                     {/* The Active Marker (Dot below) */}
                     {isActive && !isHovered && (
                       <motion.div
                         layoutId="nav-active-dot"
                         className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 z-10"
                         transition={{ type: "spring", stiffness: 400, damping: 30 }}
                       />
                     )}
                   </motion.div>
                 );
               })}
             </nav>

             {/* Utility End Nodes */}
             <div className="flex items-center gap-2 lg:gap-3 lg:ml-6 flex-shrink-0 z-10">
               {/* Theme Injector */}
               <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
                 <Button
                   variant="ghost"
                   size="icon"
                   onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                   className="rounded-full w-9 h-9 sm:w-10 sm:h-10 bg-transparent hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                   aria-label="Toggle structural theme"
                 >
                   <Sun className="h-[18px] w-[18px] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-slate-800" />
                   <Moon className="absolute h-[18px] w-[18px] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-slate-200" />
                 </Button>
               </motion.div>
               
               {/* Mobile Trigger */}
               <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className="lg:hidden">
                 <Button
                   variant="ghost"
                   size="icon"
                   className="rounded-full w-9 h-9 sm:w-10 sm:h-10 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 cursor-pointer"
                   onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                   aria-label="Toggle Command Center"
                 >
                   {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
                 </Button>
               </motion.div>
             </div>
             
           </div>
        </div>
      </header>

      {/* The Master Mobile Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl flex flex-col justify-center w-full h-[100dvh]"
          >
             <div className="flex flex-col gap-6 px-10">
                <motion.span variants={mobileItemVariants} className="text-[10px] font-bold tracking-[0.2em] uppercase text-blue-600 dark:text-blue-400 mb-4">
                   System Navigation
                </motion.span>
                {navItems.map((item) => {
                  const isActive = activeSection === item.href.substring(1) && item.href.startsWith("#");
                  return (
                    <motion.div key={item.name} variants={mobileItemVariants} className="w-full">
                       <Link
                         href={item.href}
                         className={`group flex items-center justify-between text-4xl font-bold tracking-tighter ${
                           isActive 
                             ? "text-slate-900 dark:text-white" 
                             : "text-slate-400 hover:text-slate-900 dark:hover:text-white"
                         } transition-colors duration-300 block`}
                         onClick={(e) => {
                           if (item.href.startsWith("#")) {
                             e.preventDefault();
                             document.querySelector(item.href)?.scrollIntoView({ behavior: "smooth" });
                             setActiveSection(item.href.substring(1));
                             setMobileMenuOpen(false);
                           } else {
                             setMobileMenuOpen(false);
                           }
                         }}
                       >
                         {item.name}
                         {isActive && <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400" />}
                       </Link>
                    </motion.div>
                  );
                })}
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legacy Right-Side Tracker (Keeping it because it's cool, but adjusting z-index and colors to match new theme) */}
      <div className="fixed top-0 right-8 h-screen z-30 hidden xl:flex items-center pointer-events-none">
        <div className="relative h-[60vh] flex flex-col justify-center items-center pointer-events-auto">
          <div className="absolute h-full w-[1px] bg-slate-200 dark:bg-slate-800"></div>
          <motion.div
            className="absolute top-0 w-[1px] bg-blue-600 dark:bg-blue-400 origin-top"
            style={{ height: scrollYProgress.get() * 100 + "%" }}
          />
          {navItems.filter((item) => item.href.startsWith("#")).map((item, index) => {
              const isActive = activeSection === item.href.substring(1);
              const sectionPosition = sectionPositions[item.href.substring(1)] || (index * 100) / navItems.length;
              return (
                <motion.div
                  key={item.name}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: isActive ? 1.5 : 1, opacity: 1 }}
                  whileHover={{ scale: 1.5 }}
                  className="absolute group cursor-pointer z-10"
                  style={{ top: `${sectionPosition}%` }}
                  onClick={() => {
                    document.querySelector(item.href)?.scrollIntoView({ behavior: "smooth" });
                    setActiveSection(item.href.substring(1));
                  }}
                >
                  <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      isActive ? "bg-blue-600 dark:bg-blue-400" : "bg-slate-300 dark:bg-slate-700"
                    }`}
                  />
                  <div className="absolute right-full mr-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-bold tracking-[0.2em] uppercase py-2 px-3 rounded-lg whitespace-nowrap shadow-xl">
                      {item.name}
                    </div>
                  </div>
                </motion.div>
              );
            })}
        </div>
      </div>
    </>
  );
}
