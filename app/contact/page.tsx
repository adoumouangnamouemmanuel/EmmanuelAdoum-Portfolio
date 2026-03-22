"use client"

import { toast } from "@/components/ui/use-toast"
import { AnimatePresence, motion } from "framer-motion"
import {
    ArrowLeft,
    CheckCircle2,
    Facebook,
    Github,
    Linkedin,
    Mail,
    MapPin,
    Phone,
    Send,
    Twitter
} from "lucide-react"
import Link from "next/link"
import Script from "next/script"
import { useEffect, useRef, useState } from "react"
import { useScroll, useTransform } from "framer-motion"

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
  
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 300], [1, 0])
  const y = useTransform(scrollY, [0, 300], [0, 100])

  useEffect(() => {
    if (window.emailjs) {
      setEmailJSLoaded(true)
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
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
        title: "Link Terminated.",
        description: "Communication backend fails to mount. Retry initialization.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
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

      setFormSubmitted(true)
      resetForm()
    } catch (error) {
      console.error("Submission Error:", error)
      toast({
        title: "Message Failed.",
        description: "The packet dropped. Please ping socials directly.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: <Mail className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Electronic Mail",
      value: "emmanuel.adoum@ashesi.edu.gh",
      link: "mailto:emmanuel.adoum@ashesi.edu.gh",
    },
    {
      icon: <Phone className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Direct Line",
      value: "+233 50 367 3195",
      link: "tel:+233503673195",
    },
    {
      icon: <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Coordinates",
      value: "Accra, Ghana",
      link: "https://maps.google.com/?q=Accra,Ghana",
    },
  ]

  const socialLinks = [
    { icon: <Github className="w-6 h-6" />, url: "https://github.com/adoumouangnamouemmanuel" },
    { icon: <Linkedin className="w-6 h-6" />, url: "https://www.linkedin.com/in/emmanueladoum" },
    { icon: <Twitter className="w-6 h-6" />, url: "https://x.com/emmanueladoum" },
    { icon: <Facebook className="w-6 h-6" />, url: "https://facebook.com/adoumouangnamouemmanuel" }
  ]

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"
        onLoad={() => {
          window.emailjs.init("g5-_hb5q_TnaUc14K") // Using public key from original file
          setEmailJSLoaded(true)
        }}
      />

      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 selection:bg-blue-200 dark:selection:bg-blue-900/50">
        
        {/* Massive 80vh Typography Hero */}
        <section className="relative min-h-[60vh] lg:min-h-[80vh] flex flex-col justify-center overflow-hidden pt-32 pb-20">
           <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-blue-100/40 via-slate-50 to-slate-50 dark:from-blue-900/20 dark:via-slate-950 dark:to-slate-950 blur-3xl" />
           
           <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 w-full">
              <motion.div style={{ opacity, y }} className="relative z-10 w-full">
                  <Link href="/" className="inline-flex items-center text-[10px] sm:text-xs font-bold tracking-widest uppercase text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group mb-12 sm:mb-16">
                     <ArrowLeft className="mr-3 h-4 w-4 group-hover:-translate-x-2 transition-transform duration-300" />
                     Return Home
                  </Link>
                  
                  <motion.h1 
                     initial={{ opacity: 0, y: 40 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                     className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-slate-900 dark:text-white leading-[0.9] max-w-5xl mb-12 lg:mb-20"
                  >
                     Initiate <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Connection.</span>
                  </motion.h1>

                  <motion.div 
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                     className="flex flex-col sm:flex-row gap-8 sm:gap-16 border-l-2 border-blue-600 dark:border-blue-400 pl-6 sm:pl-10"
                  >
                     <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 font-light max-w-2xl leading-relaxed">
                        Currently entertaining freelance projects, system architecture inquiries, and high-impact full-stack collaborations.
                     </p>
                     
                     <div className="flex gap-4 sm:gap-6 items-end">
                        {socialLinks.map((social, idx) => (
                           <a 
                             key={idx} 
                             href={social.url} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:-translate-y-2 transition-all duration-300"
                           >
                              {social.icon}
                           </a>
                        ))}
                     </div>
                  </motion.div>
              </motion.div>
           </div>
        </section>

        {/* Form and Map Layout Engine */}
        <section className="pb-32 relative z-20">
           <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16">
              <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
                 
                 {/* Left: The Typography Form */}
                 <div className="w-full lg:w-7/12">
                    <AnimatePresence mode="wait">
                      {formSubmitted ? (
                        <motion.div
                          key="success"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                          className="bg-slate-100 dark:bg-slate-900/50 rounded-[3rem] p-12 sm:p-20 border border-slate-200 dark:border-slate-800 text-center flex flex-col items-center justify-center min-h-[500px]"
                        >
                          <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-8">
                             <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                          </div>
                          <h2 className="text-4xl sm:text-5xl font-bold tracking-tighter text-slate-900 dark:text-white mb-6">Message Sent.</h2>
                          <p className="text-lg text-slate-500 dark:text-slate-400 font-light max-w-md">
                            The communication packet was successfully routed. You will receive a response shortly.
                          </p>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="form"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="w-full"
                        >
                          <form onSubmit={handleSubmit} className="flex flex-col gap-12 sm:gap-16">
                             
                             <div className="group relative">
                               <input
                                 type="text"
                                 name="name"
                                 required
                                 placeholder="Enter your name"
                                 value={formData.name}
                                 onChange={handleChange}
                                 className="w-full bg-transparent border-b-2 border-slate-200 dark:border-slate-800 py-6 text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700 outline-none focus:border-blue-600 dark:focus:border-blue-400 transition-colors"
                               />
                               <span className="absolute left-0 -top-6 text-[10px] font-bold tracking-[0.2em] uppercase text-blue-600 dark:text-blue-400">01. Identification</span>
                             </div>

                             <div className="group relative">
                               <input
                                 type="email"
                                 name="email"
                                 required
                                 placeholder="Enter your email"
                                 value={formData.email}
                                 onChange={handleChange}
                                 className="w-full bg-transparent border-b-2 border-slate-200 dark:border-slate-800 py-6 text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700 outline-none focus:border-blue-600 dark:focus:border-blue-400 transition-colors"
                               />
                               <span className="absolute left-0 -top-6 text-[10px] font-bold tracking-[0.2em] uppercase text-blue-600 dark:text-blue-400">02. Return Protocol</span>
                             </div>

                             <div className="group relative">
                               <input
                                 type="text"
                                 name="subject"
                                 required
                                 placeholder="Inquiry Subject"
                                 value={formData.subject}
                                 onChange={handleChange}
                                 className="w-full bg-transparent border-b-2 border-slate-200 dark:border-slate-800 py-6 text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700 outline-none focus:border-blue-600 dark:focus:border-blue-400 transition-colors"
                               />
                               <span className="absolute left-0 -top-6 text-[10px] font-bold tracking-[0.2em] uppercase text-blue-600 dark:text-blue-400">03. Header</span>
                             </div>

                             <div className="group relative">
                               <textarea
                                 name="message"
                                 required
                                 placeholder="Outline the architecture..."
                                 value={formData.message}
                                 onChange={handleChange}
                                 rows={4}
                                 className="w-full bg-transparent border-b-2 border-slate-200 dark:border-slate-800 py-6 text-xl sm:text-3xl font-medium tracking-tight text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700 outline-none focus:border-blue-600 dark:focus:border-blue-400 transition-colors resize-none leading-relaxed"
                               />
                               <span className="absolute left-0 -top-6 text-[10px] font-bold tracking-[0.2em] uppercase text-blue-600 dark:text-blue-400">04. Payload</span>
                             </div>

                             <div className="pt-8">
                                <button
                                   type="submit"
                                   disabled={isSubmitting || !emailJSLoaded}
                                   className="group relative inline-flex items-center justify-center gap-4 px-10 sm:px-14 py-6 sm:py-8 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs sm:text-sm font-bold tracking-[0.2em] uppercase hover:scale-105 transition-all duration-500 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl hover:shadow-blue-500/20"
                                >
                                   {isSubmitting ? (
                                      <>
                                         <div className="w-5 h-5 rounded-full border-2 border-white/30 dark:border-slate-900/30 border-t-white dark:border-t-slate-900 animate-spin" />
                                         Transmitting
                                      </>
                                   ) : !emailJSLoaded ? (
                                      "Initializing API"
                                   ) : (
                                      <>
                                         Send Payload
                                         <Send className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                                      </>
                                   )}
                                </button>
                             </div>

                          </form>
                        </motion.div>
                      )}
                    </AnimatePresence>
                 </div>

                 {/* Right: The Data Node Column */}
                 <div className="w-full lg:w-5/12 flex flex-col gap-12 sm:gap-16">
                    
                    <div>
                       <h3 className="text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-slate-400 mb-8 flex items-center gap-3">
                          <span className="w-4 h-[2px] bg-slate-200 dark:bg-slate-800" />
                          Contact Information
                       </h3>
                       <div className="flex flex-col gap-4">
                          {contactInfo.map((node, i) => (
                             <a 
                               key={i} 
                               href={node.link} 
                               target={node.title === "Coordinates" ? "_blank" : undefined}
                               rel={node.title === "Coordinates" ? "noopener noreferrer" : undefined}
                               className="group flex flex-col p-8 sm:p-10 rounded-3xl bg-slate-100 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-all duration-300 shadow-sm hover:shadow-xl"
                             >
                                <div className="p-4 sm:p-5 rounded-full bg-white dark:bg-slate-950 text-blue-600 dark:text-blue-400 mb-6 sm:mb-8 self-start shadow-md group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                   {node.icon}
                                </div>
                                <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400 mb-2">
                                   {node.title}
                               </h4>
                               <p className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white break-words">
                                  {node.value}
                               </p>
                             </a>
                          ))}
                       </div>
                    </div>

                    <div className="rounded-3xl overflow-hidden h-[300px] sm:h-[400px] shadow-xl border border-slate-200 dark:border-slate-800 grayscale hover:grayscale-0 transition-all duration-1000">
                       <iframe
                         src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d254936.9721468518!2d-0.2661244684939731!3d5.594388035731884!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9084b2b7a773%3A0xbed14ed8650e2dd3!2sAccra%2C%20Ghana!5e0!3m2!1sen!2sus!4v1651868767581!5m2!1sen!2sus"
                         width="100%"
                         height="100%"
                         style={{ border: 0 }}
                         allowFullScreen
                         loading="lazy"
                         referrerPolicy="no-referrer-when-downgrade"
                         title="Map Base"
                       ></iframe>
                    </div>

                 </div>

              </div>
           </div>
        </section>
      </main>
    </>
  )
}