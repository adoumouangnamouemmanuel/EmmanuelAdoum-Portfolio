"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  FileText,
  Github,
  Link2,
  Linkedin,
  Mail,
  MessageCircle,
  Twitter,
  Plus,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Locale = "en" | "fr";

type FloatingLink = {
  label: string;
  href: string;
  icon: LucideIcon;
  external?: boolean;
};

const baseLinks: FloatingLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/adoumouangnamouemmanuel",
    icon: Github,
    external: true,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/emmanueladoum",
    icon: Linkedin,
    external: true,
  },
  {
    label: "X",
    href: "https://x.com/emmanueladoum",
    icon: Twitter,
    external: true,
  },
  {
    label: "Email",
    href: "mailto:emmanuel.adoum@ashesi.edu.gh",
    icon: Mail,
  },
  {
    label: "Contact",
    href: "#contact",
    icon: MessageCircle,
  },
];

function getLinks(locale: Locale): FloatingLink[] {
  return [
    ...baseLinks.map((item) =>
      locale === "fr" && item.label === "Contact"
        ? { ...item, label: "Contact" }
        : item,
    ),
    {
      label: locale === "fr" ? "CV" : "Resume",
      href: locale === "fr" ? "/resume_fr.pdf" : "/resume.pdf",
      icon: FileText,
      external: true,
    },
    {
      label: locale === "fr" ? "Rendez-vous" : "Book Time",
      href: "mailto:emmanuel.adoum@ashesi.edu.gh?subject=Portfolio%20Meeting%20Request",
      icon: CalendarDays,
    },
  ];
}

export default function FloatingLinks({ locale = "en" }: { locale?: Locale }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const links = getLinks(locale);

  useEffect(() => {
    if (!isOpen) return;

    const close = () => setIsOpen(false);
    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (
        menuRef.current &&
        event.target instanceof Node &&
        !menuRef.current.contains(event.target)
      ) {
        close();
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", close, { passive: true });

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", close);
    };
  }, [isOpen]);

  const launcherLabel =
    locale === "fr" ? "Ouvrir les liens sociaux" : "Open social links";

  return (
    <div
      ref={menuRef}
      className="fixed bottom-4 left-4 z-[70] flex flex-col items-start"
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="mb-4 flex flex-col items-start gap-3"
          >
            {links.map((item, index) => {
              const Icon = item.icon;
              const className =
                "group/item flex items-center gap-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-slate-950";
              const content = (
                <>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200/50 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-[0_8px_16px_rgba(0,0,0,0.1)] transition-all duration-300 group-hover/item:-translate-y-1 group-hover/item:bg-blue-600 group-hover/item:border-blue-500 group-hover/item:text-white group-hover/item:shadow-[0_8px_20px_rgba(37,99,235,0.4)] text-slate-700 dark:text-slate-300 sm:h-12 sm:w-12">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="rounded-xl border border-slate-200/50 dark:border-white/10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3.5 py-2 text-xs font-bold tracking-wide text-slate-700 dark:text-slate-300 shadow-[0_8px_16px_rgba(0,0,0,0.1)] transition-all duration-300 group-hover/item:-translate-y-1 group-hover/item:border-blue-200 dark:group-hover/item:border-blue-900/50 group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400">
                    {item.label}
                  </span>
                </>
              );

              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{
                    duration: 0.18,
                    delay: index * 0.025,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {item.external || item.href.startsWith("mailto:") ? (
                    <a
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                      className={className}
                    >
                      {content}
                    </a>
                  ) : item.href.startsWith("#") ? (
                    <a
                      href={item.href}
                      className={className}
                      onClick={() => setIsOpen(false)}
                    >
                      {content}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className={className}
                      onClick={() => setIsOpen(false)}
                    >
                      {content}
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        aria-label={launcherLabel}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        whileTap={{ scale: 0.9 }}
        className="flex h-14 w-14 items-center justify-center rounded-full border border-slate-200/50 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl text-slate-800 dark:text-slate-200 shadow-[0_8px_32px_rgba(0,0,0,0.15)] transition-all duration-500 hover:scale-105 hover:bg-blue-600 hover:text-white hover:border-blue-500 hover:shadow-[0_12px_40px_rgba(37,99,235,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-slate-950"
      >
        <motion.div
          animate={{ rotate: isOpen ? 135 : 0 }}
          transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 15 }}
        >
          <Link2 className="h-6 w-6" aria-hidden="true" />
        </motion.div>
      </motion.button>
    </div>
  );
}
