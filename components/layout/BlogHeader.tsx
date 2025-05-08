"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"
import { LogOut, Menu, Moon, Settings, Shield, Sun, User, X } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function Header() {
  const { data: session, status } = useSession()
  const { theme, setTheme } = useTheme()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // Update scroll state
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Blog", href: "/blog" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname?.startsWith(path)) return true
    return false
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/90 backdrop-blur-xl shadow-lg border-b border-slate-200/20 dark:border-slate-800/20"
          : "bg-background"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <span className="text-3xl font-extrabold bg-gradient-to-r from-violet-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Blog
              </span>
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-violet-600 via-purple-500 to-pink-500 rounded-full transform scale-x-0 transition-transform group-hover:scale-x-100"></span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive(item.href)
                    ? "bg-gradient-to-r from-violet-600/10 via-purple-500/10 to-pink-500/10 text-violet-600 dark:text-violet-400 font-semibold"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-violet-600 dark:hover:text-violet-400"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-3">
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

            {/* User menu or login/signup buttons */}
            {status === "loading" ? (
              <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
            ) : session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="rounded-full p-0.5 h-10 w-10 ring-2 ring-violet-200 dark:ring-violet-800 hover:ring-violet-300 dark:hover:ring-violet-700 transition-all duration-200 cursor-pointer"
                  >
                    <Avatar className="h-9 w-9 border-2 border-background">
                      <AvatarImage src={session.user.image || ""} alt={session.user.name || "User"} />
                      <AvatarFallback className="bg-gradient-to-br from-violet-600 to-pink-500 text-white">
                        {session.user.name
                          ? session.user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                          : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-72 mt-1 p-2 border border-violet-100 dark:border-violet-900/50 rounded-xl shadow-lg shadow-violet-100/20 dark:shadow-violet-900/10 bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-start gap-3 p-2 border-b border-violet-100/50 dark:border-violet-900/30 pb-3 mb-1">
                    <Avatar className="h-10 w-10 border-2 border-violet-100 dark:border-violet-900">
                      <AvatarImage src={session.user.image || ""} alt={session.user.name || "User"} />
                      <AvatarFallback className="bg-gradient-to-br from-violet-600 to-pink-500 text-white">
                        {session.user.name
                          ? session.user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                          : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1 leading-none">
                      {session.user.name && (
                        <p className="font-medium text-gray-900 dark:text-gray-100">{session.user.name}</p>
                      )}
                      {session.user.email && (
                        <p className="text-sm text-muted-foreground break-all">{session.user.email}</p>
                      )}
                    </div>
                  </div>
                  <div className="py-1">
                    <DropdownMenuItem
                      asChild
                      className="rounded-lg px-3 py-2.5 cursor-pointer hover:bg-violet-50 dark:hover:bg-violet-900/20 focus:bg-violet-50 dark:focus:bg-violet-900/20 transition-colors"
                    >
                      <Link href="/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4 text-violet-500" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      asChild
                      className="rounded-lg px-3 py-2.5 cursor-pointer hover:bg-violet-50 dark:hover:bg-violet-900/20 focus:bg-violet-50 dark:focus:bg-violet-900/20 transition-colors"
                    >
                      <Link href="/settings" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4 text-violet-500" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    {session.user.role === "admin" && (
                      <DropdownMenuItem
                        asChild
                        className="rounded-lg px-3 py-2.5 cursor-pointer hover:bg-violet-50 dark:hover:bg-violet-900/20 focus:bg-violet-50 dark:focus:bg-violet-900/20 transition-colors"
                      >
                        <Link href="/admin" className="flex items-center">
                          <Shield className="mr-2 h-4 w-4 text-violet-500" />
                          <span>Admin Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                  </div>
                  <DropdownMenuSeparator className="my-1 bg-violet-100 dark:bg-violet-900/30" />
                  <div className="py-1">
                    <DropdownMenuItem
                      className="rounded-lg px-3 py-2.5 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 focus:bg-red-50 dark:focus:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                      onSelect={(event) => {
                        event.preventDefault()
                        signOut({
                          callbackUrl: "/blog",
                        })
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="rounded-full px-4 py-2 text-sm font-medium hover:bg-violet-50 dark:hover:bg-violet-900/20 text-violet-600 dark:text-violet-400 cursor-pointer"
                >
                  <Link href="/auth/login">Log in</Link>
                </Button>
                <Button
                  size="sm"
                  asChild
                  className="rounded-full px-4 py-2 text-sm font-medium bg-gradient-to-r from-violet-600 to-pink-500 hover:from-violet-700 hover:to-pink-600 text-white border-0 shadow-md shadow-violet-500/20 hover:shadow-violet-500/30 transition-all duration-200 cursor-pointer"
                >
                  <Link href="/auth/signup">Sign up</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-10 w-10 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full cursor-pointer"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              ) : (
                <Menu className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden mt-2 pb-6 border-t border-violet-100 dark:border-violet-900/30 pt-4"
          >
            <nav className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    isActive(item.href)
                      ? "bg-gradient-to-r from-violet-600/10 via-purple-500/10 to-pink-500/10 text-violet-600 dark:text-violet-400 font-semibold"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-violet-600 dark:hover:text-violet-400"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              {status === "loading" ? (
                <div className="h-12 w-full rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
              ) : (
                !session && (
                  <div className="grid grid-cols-2 gap-3 mt-2 pt-3 border-t border-violet-100 dark:border-violet-900/30">
                    <Link
                      href="/auth/login"
                      className="px-4 py-3 rounded-xl text-center text-sm font-medium border border-violet-200 dark:border-violet-800 text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors cursor-pointer"
                    >
                      Log in
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="px-4 py-3 rounded-xl text-center text-sm font-medium bg-gradient-to-r from-violet-600 to-pink-500 text-white hover:from-violet-700 hover:to-pink-600 transition-colors cursor-pointer"
                    >
                      Sign up
                    </Link>
                  </div>
                )
              )}
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  )
}
