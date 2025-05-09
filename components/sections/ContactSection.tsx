"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import Script from "next/script"
import { AlertCircle, CheckCircle2, Mail, MapPin, Phone, Send } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { z } from "zod"

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
})

type ContactFormData = z.infer<typeof contactFormSchema>

export default function ContactSection() {
  const ref = useRef(null)
  const formRef = useRef<HTMLFormElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [errors, setErrors] = useState<Partial<ContactFormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null)
  const [activeInput, setActiveInput] = useState<keyof ContactFormData | null>(null)
  const [emailJSLoaded, setEmailJSLoaded] = useState(false)
  const [showForm, setShowForm] = useState(true)

  useEffect(() => {
    // Check if EmailJS is loaded
    if (window.emailjs) {
      setEmailJSLoaded(true)
    }
  }, [])

  // Reset form after success
  useEffect(() => {
    if (submitStatus === "success") {
      setShowForm(false)

      // Show form again after 5 seconds
      const timer = setTimeout(() => {
        setShowForm(true)
        setSubmitStatus(null)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [submitStatus])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

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
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user starts typing
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    try {
      contactFormSchema.parse(formData)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<ContactFormData> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof ContactFormData] = err.message
          }
        })
        setErrors(newErrors)
      }
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return
    if (!emailJSLoaded) {
      setSubmitStatus("error")
      return
    }

    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const serviceId = "service_3y81tlr"
      const templateId = "template_erff06q"
      const publicKey = "g5-_hb5q_TnaUc14K"

      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
      }

      await window.emailjs.send(serviceId, templateId, templateParams, publicKey)

      // Reset form on success
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
      setSubmitStatus("success")
    } catch (error) {
      console.error("Error sending email:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFocus = (field: keyof ContactFormData) => {
    setActiveInput(field)
  }

  const handleBlur = () => {
    setActiveInput(null)
  }

  return (
    <>
      {/* EmailJS Script */}
      <Script
        src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"
        onLoad={() => {
          window.emailjs.init("g5-_hb5q_TnaUc14K")
          setEmailJSLoaded(true)
        }}
      />

      <section
        id="contact"
        className="py-24 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 relative overflow-hidden"
      >
        {/* Background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
          </div>
        </div>

        <div className="section-container">
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 shadow-md mb-4"
            >
              Get In Touch
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Let's <span className="gradient-text">Work Together</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-muted-foreground max-w-2xl mx-auto"
            >
              Have a project in mind or just want to say hello? Feel free to reach out and I'll get back to you as soon
              as possible.
            </motion.p>
          </div>

          <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="max-w-5xl mx-auto"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Contact Info */}
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-8 text-white relative overflow-hidden">
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/2 translate-x-1/2 blur-2xl"></div>

                  <motion.div variants={itemVariants} className="relative z-10">
                    <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                    <p className="mb-8 text-white/80">Fill up the form and I'll get back to you within 24 hours.</p>

                    <div className="space-y-6">
                      <motion.div
                        className="flex items-start"
                        whileHover={{ x: 5 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        <div className="p-3 bg-white/10 rounded-lg mr-4">
                          <Mail className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm text-white/70 mb-1">Email</h4>
                          <a
                            href="mailto:emmanuel.adoum@ashesi.edu.gh"
                            className="hover:text-blue-200 transition-colors"
                          >
                            emmanuel.adoum@ashesi.edu.gh
                          </a>
                        </div>
                      </motion.div>

                      <motion.div
                        className="flex items-start"
                        whileHover={{ x: 5 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        <div className="p-3 bg-white/10 rounded-lg mr-4">
                          <Phone className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm text-white/70 mb-1">Phone</h4>
                          <a href="tel:+233503673195" className="hover:text-blue-200 transition-colors">
                            +233 50 367 3195
                          </a>
                        </div>
                      </motion.div>

                      <motion.div
                        className="flex items-start"
                        whileHover={{ x: 5 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        <div className="p-3 bg-white/10 rounded-lg mr-4">
                          <MapPin className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm text-white/70 mb-1">Location</h4>
                          <p>1 University Avenue Berekuso</p>
                        </div>
                      </motion.div>
                    </div>

                    <div className="mt-12">
                      <h4 className="font-medium mb-4">Connect with me</h4>
                      <div className="flex space-x-4">
                        <motion.a
                          href="https://github.com/adoumouangnamouemmanuel"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                          whileHover={{ y: -3 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path
                              fillRule="evenodd"
                              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </motion.a>

                        <motion.a
                          href="https://www.linkedin.com/in/ouang-namou-emmanuel-adoum"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                          whileHover={{ y: -3 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                        </motion.a>
                        <motion.a
                          href="https://x.com/AdoumOuangnamou"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                          whileHover={{ y: -3 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                          </svg>
                        </motion.a>
                        <motion.a
                          href="https://www.facebook.com/adoumouangnamouemmanuel"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                          whileHover={{ y: -3 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Image
                            src="/images/logos/2023_Facebook_icon.svg"
                            alt="Facebook"
                            width={50}
                            height={50}
                            className="h-5 w-5"
                          />
                        </motion.a>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Contact Form or Success Message */}
                <div className="p-8">
                  <motion.div variants={itemVariants} className="h-full">
                    <h3 className="text-2xl font-bold mb-6">Send a Message</h3>

                    <AnimatePresence mode="wait">
                      {submitStatus === "error" && (
                        <motion.div
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                          className="mb-6"
                        >
                          <Alert className="bg-destructive/10 text-destructive border-destructive/20 shadow-md">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error!</AlertTitle>
                            <AlertDescription>
                              There was an error sending your message. Please try again later.
                            </AlertDescription>
                          </Alert>
                        </motion.div>
                      )}

                      {!showForm ? (
                        <motion.div
                          key="success"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ type: "spring", stiffness: 100, damping: 15 }}
                          className="flex flex-col items-center justify-center h-[400px] text-center"
                        >
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
                            className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6"
                          >
                            <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
                          </motion.div>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Message Sent!</h3>
                          <p className="text-gray-600 dark:text-gray-300 max-w-md">
                            Thank you for reaching out. I'll get back to you as soon as possible.
                          </p>
                        </motion.div>
                      ) : (
                        <motion.form
                          key="form"
                          ref={formRef}
                          onSubmit={handleSubmit}
                          className="space-y-5"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                              <Label
                                htmlFor="name"
                                className={`transition-colors duration-200 ${
                                  activeInput === "name" ? "text-blue-600 dark:text-blue-400" : ""
                                }`}
                              >
                                Name
                              </Label>
                              <motion.div
                                animate={{
                                  scale: errors.name ? [1, 1.02, 1] : 1,
                                  borderColor: errors.name ? "#ef4444" : activeInput === "name" ? "#3b82f6" : "",
                                }}
                                transition={{ duration: 0.2 }}
                              >
                                <Input
                                  id="name"
                                  name="name"
                                  placeholder="Emmanuel Adoum"
                                  value={formData.name}
                                  onChange={handleChange}
                                  onFocus={() => handleFocus("name")}
                                  onBlur={handleBlur}
                                  className={`${
                                    errors.name
                                      ? "border-red-500 focus:ring-red-500"
                                      : activeInput === "name"
                                        ? "border-blue-500 focus:ring-blue-500"
                                        : ""
                                  } shadow-sm focus:shadow-md transition-all placeholder:opacity-40`}
                                />
                              </motion.div>
                              <AnimatePresence>
                                {errors.name && (
                                  <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="text-sm text-destructive"
                                  >
                                    {errors.name}
                                  </motion.p>
                                )}
                              </AnimatePresence>
                            </div>

                            <div className="space-y-2">
                              <Label
                                htmlFor="email"
                                className={`transition-colors duration-200 ${
                                  activeInput === "email" ? "text-blue-600 dark:text-blue-400" : ""
                                }`}
                              >
                                Email
                              </Label>
                              <motion.div
                                animate={{
                                  scale: errors.email ? [1, 1.02, 1] : 1,
                                  borderColor: errors.email ? "#ef4444" : activeInput === "email" ? "#3b82f6" : "",
                                }}
                                transition={{ duration: 0.2 }}
                              >
                                <Input
                                  id="email"
                                  name="email"
                                  type="email"
                                  placeholder="emmanuel.adoum@ashesi.edu.gh"
                                  value={formData.email}
                                  onChange={handleChange}
                                  onFocus={() => handleFocus("email")}
                                  onBlur={handleBlur}
                                  className={`${
                                    errors.email
                                      ? "border-red-500 focus:ring-red-500"
                                      : activeInput === "email"
                                        ? "border-blue-500 focus:ring-blue-500"
                                        : ""
                                  } shadow-sm focus:shadow-md transition-all placeholder:opacity-40`}
                                />
                              </motion.div>
                              <AnimatePresence>
                                {errors.email && (
                                  <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="text-sm text-destructive"
                                  >
                                    {errors.email}
                                  </motion.p>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label
                              htmlFor="subject"
                              className={`transition-colors duration-200 ${
                                activeInput === "subject" ? "text-blue-600 dark:text-blue-400" : ""
                              }`}
                            >
                              Subject
                            </Label>
                            <motion.div
                              animate={{
                                scale: errors.subject ? [1, 1.02, 1] : 1,
                                borderColor: errors.subject ? "#ef4444" : activeInput === "subject" ? "#3b82f6" : "",
                              }}
                              transition={{ duration: 0.2 }}
                            >
                              <Input
                                id="subject"
                                name="subject"
                                placeholder="Subject of your message"
                                value={formData.subject}
                                onChange={handleChange}
                                onFocus={() => handleFocus("subject")}
                                onBlur={handleBlur}
                                className={`${
                                  errors.subject
                                    ? "border-red-500 focus:ring-red-500"
                                    : activeInput === "subject"
                                      ? "border-blue-500 focus:ring-blue-500"
                                      : ""
                                } shadow-sm focus:shadow-md transition-all placeholder:opacity-40`}
                              />
                            </motion.div>
                            <AnimatePresence>
                              {errors.subject && (
                                <motion.p
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  className="text-sm text-destructive"
                                >
                                  {errors.subject}
                                </motion.p>
                              )}
                            </AnimatePresence>
                          </div>

                          <div className="space-y-2">
                            <Label
                              htmlFor="message"
                              className={`transition-colors duration-200 ${
                                activeInput === "message" ? "text-blue-600 dark:text-blue-400" : ""
                              }`}
                            >
                              Message
                            </Label>
                            <motion.div
                              animate={{
                                scale: errors.message ? [1, 1.02, 1] : 1,
                                borderColor: errors.message ? "#ef4444" : activeInput === "message" ? "#3b82f6" : "",
                              }}
                              transition={{ duration: 0.2 }}
                            >
                              <Textarea
                                id="message"
                                name="message"
                                placeholder="Your message"
                                rows={4}
                                value={formData.message}
                                onChange={handleChange}
                                onFocus={() => handleFocus("message")}
                                onBlur={handleBlur}
                                className={`${
                                  errors.message
                                    ? "border-red-500 focus:ring-red-500"
                                    : activeInput === "message"
                                      ? "border-blue-500 focus:ring-blue-500"
                                      : ""
                                } shadow-sm focus:shadow-md transition-all resize-none placeholder:opacity-40`}
                              />
                            </motion.div>
                            <AnimatePresence>
                              {errors.message && (
                                <motion.p
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  className="text-sm text-destructive"
                                >
                                  {errors.message}
                                </motion.p>
                              )}
                            </AnimatePresence>
                          </div>

                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                              type="submit"
                              size="lg"
                              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all group relative overflow-hidden"
                              disabled={isSubmitting || !emailJSLoaded}
                            >
                              <span className="relative z-10 flex items-center">
                                {isSubmitting ? (
                                  <>
                                    <svg
                                      className="animate-spin -ml-1 mr-2 h-4 w-4"
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
                                  </>
                                ) : !emailJSLoaded ? (
                                  "Loading..."
                                ) : (
                                  <>
                                    Send Message{" "}
                                    <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                  </>
                                )}
                              </span>
                            </Button>
                          </motion.div>
                        </motion.form>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
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
