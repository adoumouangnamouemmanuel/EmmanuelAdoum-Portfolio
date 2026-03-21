"use client"

import { motion } from "framer-motion"
import { ArrowUpRight, BookOpen, Code, Download, ExternalLink, Github, Linkedin, Mail, MapPin, Twitter, Zap, ArrowRight, CornerDownRight, Plus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useScroll, useTransform } from "framer-motion"

type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  coverImage?: string;
};

export default function AboutPage() {
  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0])
  const heroY = useTransform(scrollY, [0, 600], [0, 150])

  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([])
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [postsError, setPostsError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPosts() {
      setLoadingPosts(true)
      setPostsError(null)
      try {
        const res = await fetch("/api/posts?limit=3&published=true")
        if (!res.ok) throw new Error("Failed to fetch posts")
        const data = await res.json()
        setRecentPosts(data.posts || [])
      } catch (err) {
        setPostsError("Could not load blog posts.")
      } finally {
        setLoadingPosts(false)
      }
    }
    fetchPosts()
  }, [])

  const skills = [
    { category: "Core", items: ["JavaScript", "TypeScript", "Python", "Java", "C++"] },
    { category: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "Framer Motion", "UI/UX Architecture"] },
    { category: "Backend", items: ["Node.js", "Express", "Firebase", "PostgreSQL", "NoSQL"] },
    { category: "Engine", items: ["System Architecture", "AI Integration", "Performance Optimization"] }
  ]

  const experiences = [
    {
      title: "Software Engineer",
      company: "Tech Innovators",
      period: "2022 - Present",
      description: "Architecting high-performance educational technology solutions optimized for scale. Refactoring monolithic legacy structures into modular Next.js arrays.",
    },
    {
      title: "Full Stack Developer",
      company: "Digital Solutions",
      period: "2020 - 2022",
      description: "Engineered robust full-stack web applications with deep data-layer integrations focused on sustainability telemetry and tracking.",
    },
    {
      title: "Research Assistant",
      company: "Ashesi University",
      period: "2018 - 2020",
      description: "Spearheaded research protocols identifying core technical solutions resolving fundamental African community infrastructure limitations.",
    },
  ]

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 selection:bg-blue-200 dark:selection:bg-blue-900/50 pb-24">
      
      {/* 1. Cinematic Dual-Axis Hero */}
      <section className="relative min-h-[85vh] flex items-center pt-24 pb-12 overflow-hidden">
         {/* Monochromatic background matrix */}
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-slate-50 to-slate-50 dark:from-blue-900/20 dark:via-slate-950 dark:to-slate-950 -z-10" />
         
         <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 w-full relative z-10">
            <motion.div style={{ opacity: heroOpacity, y: heroY }} className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
               
               {/* Typographic Axis */}
               <div className="flex-1 w-full flex flex-col items-center lg:items-start text-center lg:text-left pt-12 lg:pt-0">
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-8">
                     <span className="px-4 py-1.5 rounded-full bg-slate-200 dark:bg-slate-800 text-[10px] font-bold tracking-[0.2em] uppercase text-slate-600 dark:text-slate-300 shadow-sm">
                        <Code className="inline-block w-3.5 h-3.5 mr-2" />
                        Principal Engineer & Architect
                     </span>
                     <span className="px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-[10px] font-bold tracking-[0.2em] uppercase text-blue-600 dark:text-blue-400 shadow-sm border border-blue-200 dark:border-blue-800/50">
                        <MapPin className="inline-block w-3.5 h-3.5 mr-2" />
                        Chad / Global Grid
                     </span>
                  </div>
                  
                  <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-slate-900 dark:text-white leading-[0.9] lg:leading-[0.95] mb-8">
                     Emmanuel <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Adoum.</span>
                  </h1>
                  
                  <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 font-light max-w-xl leading-relaxed mb-10">
                     A visionary engineer and systems architect focused on deploying deep technological innovation to resolve fundamental infrastructural challenges. Translating complex matrices into breathtaking interfaces.
                  </p>
                  
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                     <Link href="/contact" className="group flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold tracking-[0.2em] uppercase hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl">
                        Initiate Connection
                        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                     </Link>
                     <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-slate-200/50 dark:bg-slate-900/50 text-slate-900 dark:text-white text-xs font-bold tracking-[0.2em] uppercase border border-slate-300 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                        Inspect Documentation
                        <Download className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
                     </a>
                  </div>
               </div>
               
               {/* Visual Axis (Massive Frosted Display) */}
               <div className="w-full max-w-md lg:max-w-none lg:w-[45%] relative mt-12 lg:mt-0">
                  <div className="absolute inset-x-10 bottom-0 h-4/5 bg-gradient-to-t from-blue-500/20 to-transparent blur-3xl rounded-full" />
                  <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden border border-slate-200/50 dark:border-slate-800/50 bg-slate-100/50 dark:bg-slate-900/50 backdrop-blur-xl shadow-2xl p-4">
                     <div className="w-full h-full relative rounded-[2.5rem] overflow-hidden bg-slate-200 dark:bg-slate-800 grayscale hover:grayscale-0 transition-all duration-700">
                        <Image
                          src="/images/emma-head.png"
                          alt="Emmanuel Adoum"
                          fill
                          className="object-cover object-center"
                          priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />
                     </div>
                     <div className="absolute bottom-10 left-10 flex gap-4 z-20">
                        <a href="https://github.com/adoumouangnamouemmanuel" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all shadow-lg hover:-translate-y-2">
                           <Github className="w-5 h-5" />
                        </a>
                        <a href="https://www.linkedin.com/in/emmanueladoum" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-blue-600 hover:border-transparent transition-all shadow-lg hover:-translate-y-2">
                           <Linkedin className="w-5 h-5" />
                        </a>
                        <a href="https://x.com/adoumouangnamou" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black hover:border-transparent transition-all shadow-lg hover:-translate-y-2">
                           <Twitter className="w-5 h-5" />
                        </a>
                     </div>
                  </div>
               </div>

            </motion.div>
         </div>
      </section>

      {/* Origin Bio Statement */}
      <section className="py-24 border-t border-slate-200 dark:border-slate-800/60">
         <div className="max-w-4xl mx-auto px-6 sm:px-12 text-center">
            <Zap className="w-12 h-12 mx-auto text-blue-600 dark:text-blue-400 mb-8" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight mb-8">
               "A relentless operator engineering scalable systems to obliterate modern bottlenecks."
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 font-light leading-relaxed">
               I combine a deep theoretical understanding of computer science with brutal pragmatism in deployment. My architecture focuses on creating absolute seamless experiences, whether building complex databases for sustainability or constructing high-converting frontend matrices. 
            </p>
         </div>
      </section>

      {/* 2. Operational History (Experience) */}
      <section className="py-24 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800/60">
         <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16">
            <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
               
               <div className="w-full lg:w-4/12">
                  <div className="sticky top-32">
                     <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-3">
                        <span className="w-4 h-[2px] bg-blue-600 dark:bg-blue-400" />
                        Log 01
                     </h2>
                     <h3 className="text-4xl sm:text-5xl font-bold tracking-tighter text-slate-900 dark:text-white mb-6">
                        Operational <br/>History.
                     </h3>
                     <p className="text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                        A chronological extraction of previous engineering deployments and structural command roles.
                     </p>
                  </div>
               </div>

               <div className="w-full lg:w-8/12 flex flex-col gap-8">
                  {experiences.map((exp, idx) => (
                     <div key={idx} className="group relative p-8 sm:p-10 rounded-3xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 hover:border-blue-600 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 sm:gap-12 mb-6 border-b border-slate-200 dark:border-slate-800/60 pb-6">
                           <div>
                              <h4 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                 {exp.title}
                              </h4>
                              <span className="text-lg font-medium text-slate-600 dark:text-slate-300">
                                 {exp.company}
                              </span>
                           </div>
                           <div className="text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-slate-400 bg-slate-200/50 dark:bg-slate-800 px-4 py-2 rounded-lg whitespace-nowrap">
                              {exp.period}
                           </div>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 font-light leading-relaxed sm:text-lg">
                           {exp.description}
                        </p>
                        <CornerDownRight className="absolute bottom-8 right-8 w-6 h-6 text-slate-300 dark:text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                     </div>
                  ))}
               </div>

            </div>
         </div>
      </section>

      {/* 3. Technical Matrix (Skills) */}
      <section className="pt-32 pb-24 overflow-hidden relative">
         <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 text-center mb-16 relative z-10">
            <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-purple-600 dark:text-purple-400 mb-4 flex items-center justify-center gap-3">
               <span className="w-4 h-[2px] bg-purple-600 dark:bg-purple-400" />
               Log 02
               <span className="w-4 h-[2px] bg-purple-600 dark:bg-purple-400" />
            </h2>
            <h3 className="text-4xl sm:text-5xl font-bold tracking-tighter text-slate-900 dark:text-white">
               Technical Matrix.
            </h3>
         </div>
         
         <div className="flex flex-col gap-6 lg:gap-8 max-w-[100vw] overflow-hidden px-4 relative z-10">
            {skills.map((skillGroup, idx) => (
               <div key={idx} className={`flex flex-wrap items-center justify-center gap-3 lg:gap-4 w-full ${idx % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className="hidden lg:flex items-center justify-center px-6 py-4 rounded-3xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-bold tracking-[0.2em] uppercase mr-8">
                     {skillGroup.category} Array
                  </div>
                  {skillGroup.items.map((item, i) => (
                     <div key={i} className="px-6 sm:px-8 py-4 sm:py-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-sm sm:text-base font-bold tracking-tight shadow-sm hover:-translate-y-2 hover:border-purple-500 dark:hover:border-purple-400 hover:text-purple-600 dark:hover:text-purple-400 hover:shadow-xl transition-all duration-300 cursor-default">
                        {item}
                     </div>
                  ))}
               </div>
            ))}
         </div>
         
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/5 dark:bg-purple-500/10 blur-[100px] rounded-full -z-10 pointer-events-none" />
      </section>

      {/* 4. Knowledge Base Integration (Blog Posts mapping Vault UI) */}
      <section className="py-24 bg-slate-100 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-800/60">
         <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16">
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-8 mb-16 text-center sm:text-left">
               <div>
                  <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-emerald-600 dark:text-emerald-400 mb-4 flex items-center justify-center sm:justify-start gap-3">
                     <span className="w-4 h-[2px] bg-emerald-600 dark:bg-emerald-400" />
                     Log 03
                  </h2>
                  <h3 className="text-4xl sm:text-5xl font-bold tracking-tighter text-slate-900 dark:text-white">
                     Blog Transmissions.
                  </h3>
               </div>
               <Link href="/blog" className="group flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 text-xs font-bold tracking-[0.2em] uppercase hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors shadow-sm">
                  Access Master Index
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
               </Link>
            </div>

            {loadingPosts ? (
               <div className="flex justify-center py-20">
                  <div className="w-12 h-12 rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-emerald-500 dark:border-t-emerald-400 animate-spin" />
               </div>
            ) : postsError || recentPosts.length === 0 ? (
               <div className="py-20 text-center border border-dashed border-slate-300 dark:border-slate-700 rounded-3xl">
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Null Data Read</h4>
                  <p className="text-slate-500 dark:text-slate-400">No blog posts published yet.</p>
               </div>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {recentPosts.map((post, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="group relative flex flex-col overflow-hidden rounded-[2.5rem] bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all duration-500 shadow-sm hover:shadow-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50"
                    >
                      <Link href={`/blog/${post.slug}`} className="absolute inset-0 z-20" aria-label={`Read ${post.title}`} />
                      
                      <div className="w-full aspect-[16/10] overflow-hidden relative bg-slate-100 dark:bg-slate-800">
                        <Image
                          src={post.coverImage || "/images/posts/blog.avif"}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-700 ease-[0.16,1,0.3,1] group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-colors duration-500" />
                      </div>
                      
                      <div className="p-8 sm:p-10 flex-1 flex flex-col relative z-10 pointer-events-none">
                        <div className="flex-1 mb-8">
                          <h4 className="text-2xl font-bold mb-4 tracking-tight text-slate-900 dark:text-white line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {post.title}
                          </h4>
                          <p className="text-slate-500 dark:text-slate-400 font-light text-base leading-relaxed line-clamp-2">
                            {post.excerpt}
                          </p>
                        </div>
                        
                        <div className="flex justify-between items-center pt-6 border-t border-slate-200 dark:border-slate-800 mt-auto">
                          <div className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-slate-400 bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-md">
                            {post.date}
                          </div>
                          <span className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                            Decrypt <ArrowRight className="h-3 w-3" />
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
               </div>
            )}
         </div>
      </section>

    </main>
  )
}
