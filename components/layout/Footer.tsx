"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
    ArrowRight,
    ChevronDown,
    ChevronUp,
    Github,
    Heart,
    Linkedin,
    Mail,
    MapPin,
    Phone,
    Twitter,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import PortfolioViews from "./PortfolioViews";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 pt-16 pb-8 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Footer - Unchanged */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
        >
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-xl font-bold gradient-text">Emmanuel Adoum</h3>
            <p className="text-muted-foreground text-sm">
              Building beautiful, interactive, and high-performance web
              applications with modern technologies and best practices.
            </p>
            <div className="flex space-x-3">
              <motion.a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-colors"
                whileHover={{ y: -3, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </motion.a>
              <motion.a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-colors"
                whileHover={{ y: -3, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Twitter className="h-5 w-5 text-blue-400" />
                <span className="sr-only">Twitter</span>
              </motion.a>
              <motion.a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-colors"
                whileHover={{ y: -3, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Linkedin className="h-5 w-5 text-blue-600" />
                <span className="sr-only">LinkedIn</span>
              </motion.a>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              {["Home", "About", "Skills", "Projects", "Blog", "Contact"].map(
                (item, index) => (
                  <motion.li
                    key={index}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Link
                      href={item === "Home" ? "/" : `/#${item.toLowerCase()}`}
                      className="text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center"
                    >
                      <ArrowRight className="h-3 w-3 mr-2" />
                      {item}
                    </Link>
                  </motion.li>
                )
              )}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3" />
                <a
                  href="mailto:hello@example.com"
                  className="text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  hello@example.com
                </a>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3" />
                <a
                  href="tel:+11234567890"
                  className="text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  +233 50 367 3195
                </a>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3" />
                <span className="text-muted-foreground">
                  1 University Avenue, Berekuso
                </span>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-lg font-semibold">Newsletter</h3>
            <p className="text-muted-foreground text-sm">
              Subscribe to receive updates on new projects and blog posts.
            </p>
            <div className="flex space-x-2">
              <Input
                type="email"
                placeholder="Your email"
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <Button
                className="bg-blue-600 hover:bg-blue-700 shadow-md"
                size="sm"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </motion.div>

        {/* Mobile Footer - Optimized */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="md:hidden space-y-8 mb-8"
        >
          {/* Main Info */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-xl font-bold gradient-text text-center">
              Emmanuel Adoum
            </h3>
            <p className="text-muted-foreground text-sm text-center">
              Building beautiful, interactive, and high-performance web
              applications with modern technologies and best practices.
            </p>
            <div className="flex justify-center space-x-4">
              <motion.a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-colors"
                whileHover={{ y: -3, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </motion.a>
              <motion.a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-colors"
                whileHover={{ y: -3, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Twitter className="h-5 w-5 text-blue-400" />
                <span className="sr-only">Twitter</span>
              </motion.a>
              <motion.a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-colors"
                whileHover={{ y: -3, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Linkedin className="h-5 w-5 text-blue-600" />
                <span className="sr-only">LinkedIn</span>
              </motion.a>
            </div>
          </motion.div>

          {/* Newsletter - Always visible on mobile */}
          <motion.div variants={itemVariants} className="space-y-4 px-4">
            <h3 className="text-lg font-semibold text-center">Newsletter</h3>
            <p className="text-muted-foreground text-sm text-center">
              Subscribe to receive updates on new projects and blog posts.
            </p>
            <div className="flex space-x-2">
              <Input
                type="email"
                placeholder="Your email"
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <Button
                className="bg-blue-600 hover:bg-blue-700 shadow-md"
                size="sm"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>

          {/* Collapsible sections for mobile */}
          <div className="space-y-2 border-t border-gray-200 dark:border-gray-800 pt-4">
            {/* Quick Links - Collapsible */}
            <div className="border-b border-gray-200 dark:border-gray-800 pb-2">
              <button
                onClick={() => toggleSection("quickLinks")}
                className="w-full flex justify-between items-center py-2 px-1"
              >
                <span className="font-semibold">Quick Links</span>
                {expandedSection === "quickLinks" ? (
                  <ChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </button>

              {expandedSection === "quickLinks" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="py-2 px-4"
                >
                  <ul className="space-y-2">
                    {[
                      "Home",
                      "About",
                      "Skills",
                      "Projects",
                      "Blog",
                      "Contact",
                    ].map((item, index) => (
                      <li key={index} className="py-1">
                        <Link
                          href={
                            item === "Home" ? "/" : `/#${item.toLowerCase()}`
                          }
                          className="text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center"
                        >
                          <ArrowRight className="h-3 w-3 mr-2" />
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>

            {/* Contact Info - Collapsible */}
            <div className="border-b border-gray-200 dark:border-gray-800 pb-2">
              <button
                onClick={() => toggleSection("contactInfo")}
                className="w-full flex justify-between items-center py-2 px-1"
              >
                <span className="font-semibold">Contact Info</span>
                {expandedSection === "contactInfo" ? (
                  <ChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </button>

              {expandedSection === "contactInfo" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="py-2 px-4"
                >
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3" />
                      <a
                        href="mailto:hello@example.com"
                        className="text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        emmanuel.adoum@ashesi.edu.gh
                      </a>
                    </li>
                    <li className="flex items-start">
                      <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3" />
                      <a
                        href="tel:+11234567890"
                        className="text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        +233 50 367 3195
                      </a>
                    </li>
                    <li className="flex items-start">
                      <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3" />
                      <span className="text-muted-foreground">
                        1 University Avenue, Berekuso
                      </span>
                    </li>
                  </ul>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="border-t border-gray-200 dark:border-gray-800 pt-8 text-center"
        >
          <p className="text-muted-foreground text-sm flex items-center justify-center flex-wrap">
            <span>© {currentYear} DevPortfolio. All rights reserved.</span>
            <span className="flex items-center mx-1">
              Made with
              <Heart
                className="h-4 w-4 text-red-500 mx-1 inline-block"
                fill="currentColor"
              />
              using Next.js
            </span>
          </p>
        </motion.div>

        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              Built by{" "}
              <a
                href="https://github.com/adoumouangnamouemmanuel"
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4"
              >
                Emmanuel Adoum
              </a>
              . The source code is available on{" "}
              <a
                href="https://github.com/adoumouangnamouemmanuel/Emmanuel-Adoum-Portfolio"
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4"
              >
                GitHub
              </a>
              .
            </p>
          </div>
          <PortfolioViews />
        </div>
      </div>
    </footer>
  );
}