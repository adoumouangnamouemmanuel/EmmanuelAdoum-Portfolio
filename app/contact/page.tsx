"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { AnimatePresence, motion } from "framer-motion"
import {
    BookOpen,
    CheckCircle2,
    Facebook,
    Github,
    Home,
    Linkedin,
    Mail,
    MapPin,
    Phone,
    Send,
    Twitter,
} from "lucide-react"
import Link from "next/link"
import Script from "next/script"
import { useEffect, useRef, useState } from "react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailJSLoaded, setEmailJSLoaded] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    // Check if EmailJS is loaded
    if (window.emailjs) {
      setEmailJSLoaded(true)
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    // Reset form after 5 seconds
    setTimeout(() => {
      setFormSubmitted(false)
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
    }, 5000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!emailJSLoaded) {
      toast({
        title: "Error",
        description: "Email service is not loaded. Please try again later.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Replace these with your actual EmailJS service ID, template ID, and public key
       const serviceId = "service_3y81tlr"
      const templateId = "template_erff06q"
        const publicKey = "g5-_hb5q_TnaUc14K"
        
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        to_name: "Emmanuel Adoum",
      }

      await window.emailjs.send(serviceId, templateId, templateParams, publicKey)

      toast({
        title: "Message sent!",
        description: "Thank you for reaching out. I'll get back to you soon.",
      })

      setFormSubmitted(true)
      resetForm()
    } catch (error) {
      console.error("Error sending email:", error)
      toast({
        title: "Error",
        description: "Failed to send your message. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  }

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email",
      value: "emmanuel.adoum@ashesi.edu.gh",
      link: "mailto:emmanuel.adoum@ashesi.edu.gh",
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Phone",
      value: "+233 50 367 3195",
      link: "tel:+233503673195",
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Location",
      value: "Accra, Ghana",
      link: "https://maps.google.com/?q=Accra,Ghana",
    },
  ]

  const socialLinks = [
    {
      icon: <Github className="h-5 w-5" />,
      name: "GitHub",
      url: "https://github.com/adoumouangnamouemmanuel",
      color: "hover:bg-gray-800 hover:text-white",
    },
    {
      icon: <Linkedin className="h-5 w-5" />,
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/ouang-namou-emmanuel-adoum",
      color: "hover:bg-blue-600 hover:text-white",
    },
    {
      icon: <Twitter className="h-5 w-5" />,
      name: "Twitter",
      url: "https://x.com/adoumouangnamou",
      color: "hover:bg-sky-500 hover:text-white",
    },
    {
      icon: <Facebook className="h-5 w-5" />,
      name: "Facebook",
      url: "https://facebook.com/adoumouangnamouemmanuel",
      color: "hover:bg-blue-700 hover:text-white",
    },
  ]

  const navigationButtons = [
    {
      icon: <Home className="h-5 w-5" />,
      name: "Visit Portfolio",
      url: "/",
      color: "from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700",
    },
    {
      icon: <BookOpen className="h-5 w-5" />,
      name: "Read My Blog",
      url: "/blog",
      color: "from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600",
    },
  ]

  return (
    <>
      {/* EmailJS Script */}
      <Script
        src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"
        onLoad={() => {
          window.emailjs.init("your_public_key")
          setEmailJSLoaded(true)
        }}
      />

      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent mb-4"
            >
              Get in Touch
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8"
            >
              Have a question or want to work together? Feel free to reach out using the form below or through any of my
              social channels.
            </motion.p>

            {/* Navigation Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap justify-center gap-4 mb-8"
            >
              {navigationButtons.map((button) => (
                <Button
                  key={button.name}
                  asChild
                  className={`bg-gradient-to-r ${button.color} text-white shadow-md hover:shadow-lg transition-all duration-300`}
                >
                  <Link href={button.url} className="flex items-center gap-2">
                    {button.icon}
                    <span>{button.name}</span>
                  </Link>
                </Button>
              ))}
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Contact Info */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="lg:col-span-2 space-y-8"
            >
              {/* Contact Cards */}
              <div className="space-y-4">
                {contactInfo.map((item) => (
                  <motion.a
                    key={item.title}
                    href={item.link}
                    target={item.title === "Location" ? "_blank" : undefined}
                    rel={item.title === "Location" ? "noopener noreferrer" : undefined}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-start gap-4 p-5 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">{item.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 break-all">{item.value}</p>
                    </div>
                  </motion.a>
                ))}
              </div>

              {/* Social Links */}
              <motion.div
                variants={itemVariants}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-700"
              >
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Connect with me</h3>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((social) => (
                    <motion.a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 ${social.color} transition-colors`}
                    >
                      {social.icon}
                      <span className="text-sm">{social.name}</span>
                    </motion.a>
                  ))}
                </div>
              </motion.div>

              {/* Availability */}
              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-r from-violet-600/10 to-pink-500/10 backdrop-blur-sm rounded-xl p-6 border border-violet-200/30 dark:border-violet-800/30"
              >
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Current Availability</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  I'm currently available for freelance work and collaborations on innovative projects.
                </p>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm text-green-600 dark:text-green-400">Available for new opportunities</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:col-span-3"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 md:p-8 shadow-lg border border-gray-100 dark:border-gray-700 min-h-[500px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {formSubmitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ type: "spring", stiffness: 100, damping: 15 }}
                      className="text-center py-10 px-6"
                    >
                      <div className="flex justify-center mb-6">
                        <CheckCircle2 className="h-20 w-20 text-green-500" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Message Sent!</h2>
                      <p className="text-gray-600 dark:text-gray-300 mb-6">
                        Thank you for reaching out. I'll get back to you as soon as possible.
                      </p>
                      <div className="w-16 h-1 bg-gradient-to-r from-violet-600 to-pink-500 mx-auto rounded-full"></div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full"
                    >
                      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Send me a message</h2>
                      <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Your Name
                            </label>
                            <Input
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              placeholder="Emmanuel Adoum"
                              required
                              className="border-gray-300 dark:border-gray-600 focus:ring-violet-500 focus:border-violet-500 placeholder:opacity-40"
                            />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Your Email
                            </label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="emmanuel.adoum@ashesi.edu.gh"
                              required
                              className="border-gray-300 dark:border-gray-600 focus:ring-violet-500 focus:border-violet-500 placeholder:opacity-40"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="subject" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Subject
                          </label>
                          <Input
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="How can I help you?"
                            required
                            className="border-gray-300 dark:border-gray-600 focus:ring-violet-500 focus:border-violet-500 placeholder:opacity-40"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="message" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Message
                          </label>
                          <Textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Your message here..."
                            rows={6}
                            required
                            className="border-gray-300 dark:border-gray-600 focus:ring-violet-500 focus:border-violet-500 resize-none placeholder:opacity-40"
                          />
                        </div>
                        <Button
                          type="submit"
                          disabled={isSubmitting || !emailJSLoaded}
                          className="w-full bg-gradient-to-r from-violet-600 to-pink-500 hover:from-violet-700 hover:to-pink-600 text-white shadow-md shadow-violet-500/20 hover:shadow-violet-500/30 transition-all duration-200"
                        >
                          {isSubmitting ? (
                            <div className="flex items-center">
                              <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Sending...
                            </div>
                          ) : !emailJSLoaded ? (
                            "Loading..."
                          ) : (
                            <div className="flex items-center">
                              <Send className="mr-2 h-4 w-4" />
                              Send Message
                            </div>
                          )}
                        </Button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Map Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-16 rounded-xl overflow-hidden h-[300px] md:h-[400px] shadow-lg border border-gray-100 dark:border-gray-700"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d254936.9721468518!2d-0.2661244684939731!3d5.594388035731884!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9084b2b7a773%3A0xbed14ed8650e2dd3!2sAccra%2C%20Ghana!5e0!3m2!1sen!2sus!4v1651868767581!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Map showing Accra, Ghana"
              className="grayscale hover:grayscale-0 transition-all duration-500"
            ></iframe>
          </motion.div>
        </div>
      </div>
    </>
  )
}

// Add TypeScript declaration for EmailJS
declare global {
  interface Window {
    emailjs: {
      init: (publicKey: string) => void
      send: (serviceId: string, templateId: string, templateParams: any, publicKey: string) => Promise<any>
    }
  }
}