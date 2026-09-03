"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { 
  AlertCircle, 
  CheckCircle2, 
  Send, 
  Mail, 
  Phone, 
  MapPin, 
  Download, 
  Github, 
  Linkedin 
} from "lucide-react";
import Script from "next/script";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import Link from "next/link";

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  subject: z
    .string()
    .min(5, { message: "Subject must be at least 5 characters" }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters" }),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

type Locale = "en" | "fr";

export default function ContactSection({ locale = "en" }: { locale?: Locale }) {
  const t =
    locale === "fr"
      ? {
          titleLine1: "Prêt à collaborer ?",
          titleLine2: "Contactez-moi.",
          successTitle: "Message envoyé.",
          successBody:
            "Merci pour votre message. Je reviendrai vers vous très rapidement.",
          errorTitle: "Erreur d'envoi",
          errorBody:
            "Une erreur réseau est survenue pendant l'envoi. Veuillez réessayer.",
          nameLabel: "Quel est votre nom ?",
          namePlaceholder: "Jean Dupont *",
          emailLabel: "Quelle est votre adresse e-mail ?",
          emailPlaceholder: "jean@exemple.com *",
          subjectLabel: "Quel est le sujet ?",
          subjectPlaceholder: "Demande de projet *",
          messageLabel: "Votre message",
          sendMessage: "Envoyer",
          sending: "Envoi en cours...",
          initializing: "Initialisation...",
          status: "Ouvert aux nouvelles opportunités",
          directContact: "Contact Direct",
          location: "Accra, Ghana (GMT)",
          downloadResume: "Télécharger le CV",
          socials: "Réseaux Sociaux",
        }
      : {
          titleLine1: "Ready to connect?",
          titleLine2: "Let's talk.",
          successTitle: "Message sent.",
          successBody:
            "Thank you for reaching out. I'll review your details and get back to you shortly.",
          errorTitle: "Error Sending Message",
          errorBody:
            "There was a network error connecting to the delivery service. Please try again.",
          nameLabel: "What's your name?",
          namePlaceholder: "John Doe *",
          emailLabel: "What's your email?",
          emailPlaceholder: "john@doe.com *",
          subjectLabel: "What's the subject?",
          subjectPlaceholder: "Project Inquiry *",
          messageLabel: "Your message",
          sendMessage: "Send Message",
          sending: "Sending...",
          initializing: "Initializing...",
          status: "Open to New Opportunities",
          directContact: "Direct Contact",
          location: "Accra, Ghana (GMT)",
          downloadResume: "Download Resume",
          socials: "Social Profiles",
        };

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null,
  );
  const [activeInput, setActiveInput] = useState<keyof ContactFormData | null>(
    null,
  );
  const [emailJSLoaded, setEmailJSLoaded] = useState(false);
  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    if (window.emailjs) {
      setEmailJSLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (submitStatus === "success") {
      setShowForm(false);
      const timer = setTimeout(() => {
        setShowForm(true);
        setSubmitStatus(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    try {
      contactFormSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<ContactFormData> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof ContactFormData] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (!emailJSLoaded) {
      setSubmitStatus("error");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const serviceId = "service_3y81tlr";
      const templateId = "template_erff06q";
      const publicKey = "g5-_hb5q_TnaUc14K";

      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
      };

      await window.emailjs.send(
        serviceId,
        templateId,
        templateParams,
        publicKey,
      );

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setSubmitStatus("success");
    } catch (error) {
      console.error("Error sending email:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"
        onLoad={() => {
          if (window.emailjs) {
            window.emailjs.init("g5-_hb5q_TnaUc14K");
            setEmailJSLoaded(true);
          }
        }}
      />

      <section
        id="contact"
        className="py-24 lg:py-40 bg-white dark:bg-slate-950 relative overflow-hidden border-t border-slate-200 dark:border-slate-900/50"
      >
        {/* Background Gradients */}
        <div className="pointer-events-none absolute right-0 bottom-0 -z-10 h-[800px] w-[800px] translate-x-1/3 translate-y-1/3 rounded-full bg-blue-50/50 blur-[120px] dark:bg-blue-900/10" />
        
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16" ref={ref}>
          {/* Header Typography */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="mb-16 lg:mb-24"
          >
            <motion.h2
              variants={itemVariants}
              className="text-[clamp(1.5rem,3vw,2.5rem)] font-extrabold uppercase leading-tight tracking-normal text-slate-950 dark:text-slate-100"
            >
              {t.titleLine1} <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 pr-4">
                {t.titleLine2}
              </span>
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 lg:gap-24">
            {/* Left Column: Direct Contact Hub */}
            <motion.div 
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={containerVariants}
              className="lg:col-span-2 flex flex-col gap-10"
            >
              {/* Availability Badge */}
              <motion.div variants={itemVariants} className="inline-flex items-center gap-3 w-fit px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-sm font-bold tracking-wide text-slate-700 dark:text-slate-300">
                  {t.status}
                </span>
              </motion.div>

              {/* Direct Info */}
              <motion.div variants={itemVariants} className="space-y-6">
                <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-slate-400 dark:text-slate-500 mb-6">
                  {t.directContact}
                </h3>
                
                <a href="mailto:emmanuel.ouangnamou@gmail.com" className="group flex items-center gap-4 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-900 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span className="text-lg sm:text-xl font-light">emmanuel.ouangnamou@gmail.com</span>
                </a>
                
                <a href="tel:+233503673195" className="group flex items-center gap-4 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-900 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <span className="text-lg sm:text-xl font-light">+233 50 367 3195</span>
                </a>

                <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-900">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="text-lg sm:text-xl font-light">{t.location}</span>
                </div>
              </motion.div>

              {/* Socials & Resume */}
              <motion.div variants={itemVariants} className="space-y-6 pt-4">
                <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-slate-400 dark:text-slate-500 mb-6">
                  {t.socials}
                </h3>
                <div className="flex gap-4">
                  <a href="https://www.linkedin.com/in/emmanueladoum/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 transition-all shadow-sm hover:shadow-md hover:-translate-y-1">
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a href="https://github.com/adoumouangnamouemmanuel" target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-all shadow-sm hover:shadow-md hover:-translate-y-1">
                    <Github className="w-5 h-5" />
                  </a>
                </div>

                <div className="pt-6">
                  <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white font-bold tracking-wide hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-800">
                    <Download className="w-5 h-5" />
                    {t.downloadResume}
                  </a>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column: Form */}
            <motion.div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                {!showForm ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col min-h-[400px] py-10"
                  >
                    <div className="w-24 h-24 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center mb-8">
                      <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-4xl sm:text-6xl font-bold text-slate-900 dark:text-white mb-6 tracking-tighter">
                      {t.successTitle}
                    </h3>
                    <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 font-light max-w-lg leading-relaxed">
                      {t.successBody}
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={containerVariants}
                    className="flex flex-col gap-12"
                  >
                    {submitStatus === "error" && (
                      <motion.div
                        variants={itemVariants}
                        className="p-6 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50 rounded-2xl flex items-start gap-4"
                      >
                        <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 shrink-0" />
                        <div>
                          <h4 className="font-bold text-red-900 dark:text-red-300">
                            {t.errorTitle}
                          </h4>
                          <p className="text-red-700 dark:text-red-400/80 text-sm mt-1">
                            {t.errorBody}
                          </p>
                        </div>
                      </motion.div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      {/* Name field */}
                      <motion.div variants={itemVariants} className="relative group">
                        <label
                          htmlFor="name"
                          className={`text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase transition-colors duration-300 ${activeInput === "name" || formData.name ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500"}`}
                        >
                          {t.nameLabel}
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          onFocus={() => setActiveInput("name")}
                          onBlur={() => setActiveInput(null)}
                          placeholder={t.namePlaceholder}
                          className={`w-full bg-transparent border-b-2 py-4 text-xl sm:text-2xl font-light text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700 outline-none transition-colors duration-300 
                            ${errors.name ? "border-red-500" : activeInput === "name" ? "border-blue-600 dark:border-blue-400" : "border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600"}`}
                        />
                        <AnimatePresence>
                          {errors.name && (
                            <motion.span
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              className="absolute -bottom-6 left-0 text-xs font-bold text-red-500"
                            >
                              {errors.name}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.div>

                      {/* Email field */}
                      <motion.div variants={itemVariants} className="relative group">
                        <label
                          htmlFor="email"
                          className={`text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase transition-colors duration-300 ${activeInput === "email" || formData.email ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500"}`}
                        >
                          {t.emailLabel}
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          onFocus={() => setActiveInput("email")}
                          onBlur={() => setActiveInput(null)}
                          placeholder={t.emailPlaceholder}
                          className={`w-full bg-transparent border-b-2 py-4 text-xl sm:text-2xl font-light text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700 outline-none transition-colors duration-300
                            ${errors.email ? "border-red-500" : activeInput === "email" ? "border-blue-600 dark:border-blue-400" : "border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600"}`}
                        />
                        <AnimatePresence>
                          {errors.email && (
                            <motion.span
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              className="absolute -bottom-6 left-0 text-xs font-bold text-red-500"
                            >
                              {errors.email}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </div>

                    {/* Subject field */}
                    <motion.div variants={itemVariants} className="relative group">
                      <label
                        htmlFor="subject"
                        className={`text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase transition-colors duration-300 ${activeInput === "subject" || formData.subject ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500"}`}
                      >
                        {t.subjectLabel}
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        onFocus={() => setActiveInput("subject")}
                        onBlur={() => setActiveInput(null)}
                        placeholder={t.subjectPlaceholder}
                        className={`w-full bg-transparent border-b-2 py-4 text-xl sm:text-2xl font-light text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700 outline-none transition-colors duration-300
                          ${errors.subject ? "border-red-500" : activeInput === "subject" ? "border-blue-600 dark:border-blue-400" : "border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600"}`}
                      />
                      <AnimatePresence>
                        {errors.subject && (
                          <motion.span
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="absolute -bottom-6 left-0 text-xs font-bold text-red-500"
                          >
                            {errors.subject}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* Message field */}
                    <motion.div variants={itemVariants} className="relative group">
                      <label
                        htmlFor="message"
                        className={`text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase transition-colors duration-300 ${activeInput === "message" || formData.message ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500"}`}
                      >
                        {t.messageLabel}
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        onFocus={() => setActiveInput("message")}
                        onBlur={() => setActiveInput(null)}
                        placeholder="Hello Emmanuel, can you help me build..."
                        className={`w-full bg-transparent border-b-2 py-4 text-xl sm:text-2xl font-light text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700 outline-none transition-colors duration-300 resize-none overflow-hidden min-h-[120px]
                          ${errors.message ? "border-red-500" : activeInput === "message" ? "border-blue-600 dark:border-blue-400" : "border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600"}`}
                      />
                      <AnimatePresence>
                        {errors.message && (
                          <motion.span
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="absolute -bottom-6 left-0 text-xs font-bold text-red-500"
                          >
                            {errors.message}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* Submit Node */}
                    <motion.div variants={itemVariants} className="pt-8">
                      <button
                        type="submit"
                        disabled={isSubmitting || !emailJSLoaded}
                        className="group relative flex items-center justify-between w-fit px-10 sm:px-14 py-4 sm:py-5 rounded-full bg-slate-900 dark:bg-white overflow-hidden transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl"
                      >
                        <div className="absolute inset-0 bg-blue-600 dark:bg-blue-400 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 transition-timing-function-[0.16,1,0.3,1] z-0" />

                        <span className="relative z-10 flex items-center gap-3">
                          {isSubmitting ? (
                            <>
                              <svg
                                className="animate-spin h-5 w-5 text-white dark:text-slate-900 group-hover:text-white"
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
                              <span className="text-sm font-bold tracking-widest uppercase text-white dark:text-slate-900 group-hover:text-white transition-colors duration-300">
                                {t.sending}
                              </span>
                            </>
                          ) : !emailJSLoaded ? (
                            <span className="text-sm font-bold tracking-widest uppercase text-white dark:text-slate-900 transition-colors duration-300">
                              {t.initializing}
                            </span>
                          ) : (
                            <>
                              <span className="text-sm font-bold tracking-widest uppercase text-white dark:text-slate-900 group-hover:text-white transition-colors duration-500 transform group-hover:-translate-x-2">
                                {t.sendMessage}
                              </span>
                              <Send className="w-5 h-5 text-white absolute -right-8 opacity-0 transform translate-x-4 group-hover:-translate-x-12 group-hover:opacity-100 transition-all duration-500" />
                            </>
                          )}
                        </span>
                      </button>
                    </motion.div>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}

declare global {
  interface Window {
    emailjs: {
      init: (publicKey: string) => void;
      send: (
        serviceId: string,
        templateId: string,
        templateParams: any,
        publicKey: string,
      ) => Promise<any>;
    };
  }
}
