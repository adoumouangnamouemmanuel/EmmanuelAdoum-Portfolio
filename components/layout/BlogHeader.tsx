"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AnimatePresence, motion } from "framer-motion";
import {
  Home,
  LogOut,
  Menu,
  Moon,
  Settings,
  Shield,
  Sun,
  User,
  X,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function BlogHeader() {
  const { data: session, status } = useSession();
  const { theme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const pathname = usePathname();
  const isFrenchRoute = pathname?.startsWith("/fr");
  const basePath = isFrenchRoute ? "/fr" : "";
  const homePath = basePath || "/";

  const t = isFrenchRoute
    ? {
        home: "Accueil",
        blog: "Blog",
        about: "À propos",
        contact: "Contact",
        profile: "Profil",
        settings: "Paramètres",
        adminPanel: "Espace admin",
        signOut: "Déconnexion",
        signIn: "Connexion",
        register: "Inscription",
        blogNavigation: "Navigation Blog",
        toggleTheme: "Changer le thème",
        toggleMobileMenu: "Basculer le menu mobile",
      }
    : {
        home: "Home",
        blog: "Blog",
        about: "About",
        contact: "Contact",
        profile: "Profile",
        settings: "Settings",
        adminPanel: "Admin Panel",
        signOut: "Sign Out",
        signIn: "Sign In",
        register: "Register",
        blogNavigation: "Blog Navigation",
        toggleTheme: "Toggle structural theme",
        toggleMobileMenu: "Toggle Mobile Menu",
      };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navItems = [
    { name: t.home, href: homePath },
    { name: t.blog, href: `${basePath}/blog` },
    { name: t.about, href: `${basePath}/about` },
    { name: t.contact, href: `${basePath}/contact` },
  ];

  const isActive = (path: string) => {
    if (!pathname) return false;
    if (path === homePath) return pathname === homePath;
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  // Mobile Menu Variants
  const mobileMenuVariants = {
    hidden: {
      y: "-100%",
      opacity: 0,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
    },
    visible: {
      y: "0%",
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
    exit: {
      y: "-100%",
      opacity: 0,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const mobileItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const logoVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    hover: { scale: 1.05, transition: { duration: 0.3 } },
  };

  return (
    <>
      <header
        className={`fixed left-0 right-0 z-50 transition-all duration-500 ease-[0.16,1,0.3,1] ${
          isScrolled ? "top-2 sm:top-4 lg:top-6" : "top-4 sm:top-6 lg:top-8"
        }`}
      >
        <div className="flex justify-center w-full px-4 pointer-events-none">
          <div
            className={`pointer-events-auto flex items-center justify-between transition-all duration-500 rounded-full px-4 sm:px-6 py-2.5 sm:py-3 w-full lg:w-max mx-auto shadow-2xl border ${
              isScrolled
                ? "bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border-slate-200/50 dark:border-slate-800/50 shadow-slate-900/5 dark:shadow-black/20"
                : "bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border-slate-200/30 dark:border-slate-800/30 shadow-black/5"
            }`}
          >
            {/* Architectural Logo Node */}
            <Link
              href={`${basePath}/blog`}
              className="flex items-center space-x-2 z-10 mr-4 lg:mr-8 flex-shrink-0"
            >
              <motion.div
                variants={logoVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
              >
                <span className="text-xl sm:text-2xl font-black tracking-tighter text-slate-900 dark:text-white">
                  Blog
                </span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex flex-1 justify-center space-x-1 relative px-2">
              {navItems.map((item, i) => {
                const active = isActive(item.href);
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
                      className={`relative z-20 px-4 py-2 text-xs font-bold tracking-[0.15em] uppercase transition-colors duration-300 block ${
                        active || isHovered
                          ? "text-slate-900 dark:text-white"
                          : "text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {item.name}
                    </Link>

                    {/* Magnetic Hover Pill */}
                    {isHovered && (
                      <motion.div
                        layoutId="blog-hover-pill"
                        className="absolute inset-0 z-10 bg-slate-200/50 dark:bg-slate-800/50 rounded-full"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}

                    {/* Active State Marker */}
                    {active && !isHovered && (
                      <motion.div
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-slate-900 dark:bg-white z-10"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                  </motion.div>
                );
              })}
            </nav>

            {/* Utility End Nodes */}
            <div className="flex items-center gap-2 lg:gap-3 lg:ml-6 flex-shrink-0 z-10">
              {/* Theme Injector */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="hidden sm:flex rounded-full w-9 h-9 sm:w-10 sm:h-10 bg-transparent hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                  aria-label={t.toggleTheme}
                >
                  <Sun className="h-[18px] w-[18px] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-slate-800" />
                  <Moon className="absolute h-[18px] w-[18px] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-slate-200" />
                </Button>
              </motion.div>

              {/* Secure Interface (Auth) */}
              {status === "loading" ? (
                <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
              ) : session ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="rounded-full p-0 flex h-9 w-9 sm:h-10 sm:w-10 transition-transform cursor-pointer hover:scale-105"
                    >
                      <Avatar className="h-full w-full border border-slate-200 dark:border-slate-800">
                        <AvatarImage
                          src={
                            session.user.image || "/images/posts/profile.jpeg"
                          }
                          alt={session.user.name || "User"}
                        />
                        <AvatarFallback className="bg-slate-900 text-white font-bold text-xs uppercase">
                          {session.user.name
                            ? session.user.name.substring(0, 2)
                            : "ID"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-72 mt-4 p-2 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-2xl shadow-slate-900/10 dark:shadow-black/40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl"
                  >
                    <div className="flex items-center justify-start gap-4 p-4 border-b border-slate-200/50 dark:border-slate-800/50 mb-2">
                      <Avatar className="h-12 w-12 border border-slate-200 dark:border-slate-800">
                        <AvatarImage
                          src={
                            session.user.image || "/images/posts/profile.jpeg"
                          }
                          alt={session.user.name || "User"}
                        />
                        <AvatarFallback className="bg-slate-900 text-white">
                          ID
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <p className="font-bold text-slate-900 dark:text-white tracking-tight">
                          {session.user.name}
                        </p>
                        <p className="text-xs text-slate-500 font-mono break-all">
                          {session.user.email}
                        </p>
                      </div>
                    </div>

                    <div className="px-1 py-1 space-y-1">
                      <DropdownMenuItem
                        asChild
                        className="rounded-xl px-4 py-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900/50 font-medium text-slate-700 dark:text-slate-300 transition-colors"
                      >
                        <Link
                          href={`${basePath}/profile`}
                          className="flex items-center gap-3"
                        >
                          <User className="h-4 w-4" /> {t.profile}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        asChild
                        className="rounded-xl px-4 py-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900/50 font-medium text-slate-700 dark:text-slate-300 transition-colors"
                      >
                        <Link
                          href="/settings"
                          className="flex items-center gap-3"
                        >
                          <Settings className="h-4 w-4" /> {t.settings}
                        </Link>
                      </DropdownMenuItem>
                      {session.user.role === "admin" && (
                        <DropdownMenuItem
                          asChild
                          className="rounded-xl px-4 py-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900/50 font-medium text-slate-700 dark:text-slate-300 transition-colors"
                        >
                          <Link
                            href="/admin"
                            className="flex items-center gap-3"
                          >
                            <Shield className="h-4 w-4 text-rose-500" />{" "}
                            {t.adminPanel}
                          </Link>
                        </DropdownMenuItem>
                      )}
                    </div>

                    <DropdownMenuSeparator className="my-2 bg-slate-200/50 dark:bg-slate-800/50" />

                    <div className="px-1 py-1">
                      <DropdownMenuItem
                        className="rounded-xl px-4 py-3 cursor-pointer text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/50 transition-colors font-bold uppercase tracking-widest text-xs"
                        onSelect={(e) => {
                          e.preventDefault();
                          signOut({ callbackUrl: `${basePath}/blog` });
                        }}
                      >
                        <LogOut className="mr-3 h-4 w-4" /> {t.signOut}
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    href="/auth/login"
                    className="hidden sm:block px-4 py-2 text-xs font-bold tracking-[0.1em] uppercase text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    {t.signIn}
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="px-5 py-2.5 rounded-full text-xs font-bold tracking-[0.1em] uppercase bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:scale-105 transition-transform shadow-xl"
                  >
                    {t.register}
                  </Link>
                </div>
              )}

              {/* Mobile Trigger */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="lg:hidden"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full w-9 h-9 sm:w-10 sm:h-10 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer border border-slate-200 dark:border-slate-800"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  aria-label={t.toggleMobileMenu}
                >
                  {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      {/* The Master Mobile Overlay for Vault Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl flex flex-col justify-center w-full h-[100dvh]"
          >
            {/* Dynamic Theme Injector inside Mobile Menu since Header hides it */}
            <div className="absolute top-6 left-6 sm:hidden">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full w-10 h-10 border-slate-200 dark:border-slate-800 bg-transparent"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
            </div>

            <div className="flex flex-col gap-6 px-10">
              <motion.span
                variants={mobileItemVariants}
                className="text-[10px] font-bold tracking-[0.2em] uppercase text-emerald-600 dark:text-emerald-400 mb-4"
              >
                {t.blogNavigation}
              </motion.span>
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <motion.div
                    key={item.name}
                    variants={mobileItemVariants}
                    className="w-full"
                  >
                    <Link
                      href={item.href}
                      className={`group flex items-center justify-between text-4xl sm:text-5xl font-bold tracking-tighter ${
                        active
                          ? "text-slate-900 dark:text-white"
                          : "text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      } transition-colors duration-300 block`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name === t.home ? (
                        <span className="flex items-center gap-3">
                          <Home className="w-8 h-8 opacity-50" />
                          {item.name}
                        </span>
                      ) : (
                        item.name
                      )}
                      {active && (
                        <span className="w-2 h-2 rounded-full bg-slate-900 dark:bg-white" />
                      )}
                    </Link>
                  </motion.div>
                );
              })}

              <motion.div
                variants={mobileItemVariants}
                className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800"
              >
                {status === "unauthenticated" && (
                  <Link
                    href="/auth/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-4 text-lg font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    {t.signIn}
                  </Link>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
