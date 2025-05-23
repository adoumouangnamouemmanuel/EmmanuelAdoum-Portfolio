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
import { ModeToggle } from "@/components/theme/mode-toggle";
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
  { name: "Latest Articles", href: "#articles" },
  { name: "Contact", href: "#contact" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
   const { theme, setTheme } = useTheme()
  const [activeSection, setActiveSection] = useState("home");
  const [sectionPositions, setSectionPositions] = useState<{
    [key: string]: number;
  }>({});
  const headerRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();
  const { scrollY, scrollYProgress } = useScroll();

  // Calculate progress for the horizontal progress bar
  const horizontalProgress = useTransform(scrollYProgress, [0, 1], [0, 100]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);

      // Find the active section based on scroll position
      const sections = navItems
        .filter((item) => item.href.startsWith("#"))
        .map((item) => item.href.substring(1));

      const currentSection = sections.find((section) => {
        const element = document.getElementById(section);
        if (!element) return false;

        const rect = element.getBoundingClientRect();
        const headerHeight = headerRef.current?.offsetHeight || 0;
        return rect.top <= 100 + headerHeight && rect.bottom >= 100;
      });

      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    // Calculate section positions for the progress indicator
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

  // Prevent body scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const logoVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
    hover: {
      scale: 1.05,
      rotate: [0, -5, 5, -5, 0],
      transition: { duration: 0.5 },
    },
  };

  const navItemVariants = {
    initial: { opacity: 0, y: -10 },
    animate: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        delay: 0.1 * i,
      },
    }),
    hover: {
      y: -3,
      color: "hsl(var(--primary))",
      transition: { duration: 0.2 },
    },
  };

  // Updated mobile menu variants to slide from right
  const mobileMenuVariants = {
    closed: {
      x: "100%",
      opacity: 0,
      transition: {
        duration: 0.3,
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
    open: {
      x: "0%",
      opacity: 1,
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const mobileItemVariants = {
    closed: { opacity: 0, x: 20 }, // Changed to slide from right
    open: { opacity: 1, x: 0 },
  };

  // Backdrop variants for the semi-transparent overlay
  const backdropVariants = {
    closed: {
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
    open: {
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-lg py-3"
          : "bg-transparent py-5"
      }`}
    >
      {/* Horizontal progress bar at the top */}
      <motion.div
        className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 z-50"
        style={{ width: horizontalProgress.get() + "%" }}
      />

      {/* Vertical progress indicator (fixed on the right side) */}
      <div className="fixed top-0 right-8 h-screen z-50 hidden lg:flex items-center">
        <div className="relative h-[70vh] flex flex-col justify-center items-center">
          {/* Vertical line */}
          <div className="absolute h-full w-0.5 bg-gray-200 dark:bg-gray-700 rounded-full"></div>

          {/* Progress overlay */}
          <motion.div
            className="absolute top-0 w-0.5 bg-gradient-to-b from-blue-600 via-purple-500 to-blue-600 rounded-full origin-top"
            style={{ height: scrollYProgress.get() * 100 + "%" }}
          />

          {/* Navigation dots */}
          {navItems
            .filter((item) => item.href.startsWith("#"))
            .map((item, index) => {
              const isActive = activeSection === item.href.substring(1);
              const sectionPosition =
                sectionPositions[item.href.substring(1)] ||
                (index * 100) / navItems.length;

              return (
                <motion.div
                  key={item.name}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{
                    scale: isActive ? 1.2 : 1,
                    opacity: 1,
                  }}
                  whileHover={{ scale: 1.5 }}
                  className="absolute group cursor-pointer z-10"
                  style={{ top: `${sectionPosition}%` }}
                  onClick={() => {
                    document.querySelector(item.href)?.scrollIntoView({
                      behavior: "smooth",
                    });
                    setActiveSection(item.href.substring(1));
                  }}
                >
                  <div
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      isActive
                        ? "bg-blue-600 dark:bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  />
                  <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white dark:bg-gray-800 text-sm font-medium py-1 px-2 rounded shadow-lg whitespace-nowrap">
                      {item.name}
                    </div>
                  </div>
                </motion.div>
              );
            })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 z-10">
            <motion.div
              variants={logoVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
            >
              <span className="text-2xl font-bold gradient-text">
                Emmanuel Adoum
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item, i) => (
              <motion.div
                key={item.name}
                custom={i}
                variants={navItemVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
              >
                <Link
                  href={item.href}
                  className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                    activeSection === item.href.substring(1) &&
                    item.href.startsWith("#")
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                  onClick={(e) => {
                    if (item.href.startsWith("#")) {
                      e.preventDefault();
                      document.querySelector(item.href)?.scrollIntoView({
                        behavior: "smooth",
                      });
                      setActiveSection(item.href.substring(1));
                    }
                  }}
                >
                  {item.name}
                  {activeSection === item.href.substring(1) &&
                    item.href.startsWith("#") && (
                      <motion.div
                        className="absolute bottom-0 left-0 h-0.5 bg-blue-600 dark:bg-blue-400"
                        layoutId="activeSection"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              whileHover={{ rotate: 180 }}
              className="ml-2"
            >
              {/* <ModeToggle /> */}
               {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full h-10 w-10 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
              aria-label="Toggle theme"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-indigo-400" />
            </Button>
            </motion.div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              whileHover={{ rotate: 180 }}
            >
              {/* <ModeToggle /> */}
               {/* <ModeToggle /> */}
               {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full h-10 w-10 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
              aria-label="Toggle theme"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-indigo-400" />
            </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="ml-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Redesigned to slide from right */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Semi-transparent backdrop */}
            <motion.div
              variants={backdropVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="md:hidden fixed inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Sliding menu panel */}
            <motion.div
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="md:hidden fixed top-0 right-0 bottom-0 w-[75%] max-w-xs bg-white dark:bg-gray-900 shadow-xl z-50 flex flex-col"
              style={{ height: "100vh" }} // Ensure full viewport height
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <span className="font-bold text-lg">Menu</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X size={20} />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto py-2">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.name}
                    variants={mobileItemVariants}
                    custom={i}
                    className="block"
                  >
                    <Link
                      href={item.href}
                      className={`flex items-center justify-between py-3 px-4 mx-2 my-1 text-base font-medium rounded-lg ${
                        activeSection === item.href.substring(1) &&
                        item.href.startsWith("#")
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                      onClick={(e) => {
                        if (item.href.startsWith("#")) {
                          e.preventDefault();
                          document.querySelector(item.href)?.scrollIntoView({
                            behavior: "smooth",
                          });
                          setActiveSection(item.href.substring(1));
                          setMobileMenuOpen(false);
                        } else {
                          setMobileMenuOpen(false);
                        }
                      }}
                    >
                      <span>{item.name}</span>
                      <motion.div
                        whileHover={{ x: 5 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  className="w-full justify-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Close Menu
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
