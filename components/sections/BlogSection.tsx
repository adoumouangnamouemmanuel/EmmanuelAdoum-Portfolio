"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Calendar, Clock, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Locale = "en" | "fr";

export default function BlogSection({ locale = "en" }: { locale?: Locale }) {
  const basePath = locale === "fr" ? "/fr" : "";
  const t =
    locale === "fr"
      ? {
          eyebrow: "Le Journal",
          titleLead: "Derniers",
          titleAccent: "Articles.",
          indexBtn: "Voir tous les articles",
          emptyTitle: "Aucun article disponible.",
          emptyDescription:
            "Le journal est actuellement vide. Revenez bientôt pour les prochaines mises à jour.",
          minutes: "min de lecture",
          editorsPick: "Lire l'article à la une",
          publishingSoon: "D'autres articles arrivent bientôt",
        }
      : {
          eyebrow: "The Journal",
          titleLead: "Latest",
          titleAccent: "Articles.",
          indexBtn: "View Complete Index",
          emptyTitle: "No broadcasts available.",
          emptyDescription:
            "The journal is currently empty. Check back shortly for new updates.",
          minutes: "Min Read",
          editorsPick: "Read Editor's Pick",
          publishingSoon: "More articles publishing soon",
        };

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [30, -30]);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      try {
        const res = await fetch("/api/posts?published=true&limit=3");
        const data = await res.json();
        setPosts(data.posts || []);
      } catch (e) {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const formatDate = (dateValue: any) => {
    if (!dateValue) return "";
    return typeof dateValue === "string"
      ? dateValue.split("T")[0]
      : new Date(dateValue.seconds * 1000).toISOString().split("T")[0];
  };

  return (
    <section
      id="articles"
      className="py-24 lg:py-32 relative overflow-hidden bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800"
    >
      {/* Editorial Header */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 mb-16 lg:mb-24 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-6"
          >
            <p className="inline-flex items-center text-[10px] sm:text-xs font-bold tracking-widest uppercase text-blue-600 dark:text-blue-400">
              {t.eyebrow}
            </p>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter text-slate-900 dark:text-white leading-[1.0] max-w-2xl"
          >
            {t.titleLead}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              {t.titleAccent}
            </span>
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Link
            href={`${basePath}/blog`}
            className="group/btn inline-flex items-center justify-center gap-3 px-8 py-4 bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white rounded-full font-bold tracking-widest text-[10px] sm:text-xs uppercase transition-all hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900"
          >
            {t.indexBtn}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
          </Link>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16" ref={ref}>
        {loading ? (
          <div className="w-full py-32 flex justify-center items-center">
            <div className="w-8 h-8 rounded-full border-2 border-slate-300 dark:border-slate-700 border-t-blue-600 dark:border-t-blue-400 animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="w-full py-32 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
              {t.emptyTitle}
            </h3>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
              {t.emptyDescription}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            {/* 1. Massive Featured Post (Index 0) */}
            {posts[0] && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true, margin: "-100px" }}
                className="lg:col-span-7 group relative overflow-hidden rounded-[2rem] bg-slate-100 dark:bg-slate-900 min-h-[500px] lg:min-h-[700px] flex flex-col justify-end"
              >
                <Link
                  href={`${basePath}/blog/${posts[0].slug}`}
                  className="absolute inset-0 z-20"
                  aria-label={`Read ${posts[0].title}`}
                />

                <motion.div
                  style={{ y: y1, scale: 1.15 }}
                  className="absolute inset-0 w-full h-[120%] z-0"
                >
                  <Image
                    src={posts[0].coverImage || "/images/posts/blog.avif"}
                    alt={posts[0].title}
                    fill
                    className="object-cover transition-transform duration-1000 ease-[0.16,1,0.3,1] group-hover:scale-105"
                  />
                </motion.div>

                {/* Editorial Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/40 to-transparent z-10 transition-opacity duration-700 pointer-events-none" />

                <div className="relative z-10 p-8 sm:p-12 h-full flex flex-col justify-end pointer-events-none">
                  <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
                    {(posts[0].categories || []).map(
                      (cat: string, i: number) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[9px] sm:text-[10px] font-bold tracking-widest uppercase text-white shadow-xl"
                        >
                          {cat}
                        </span>
                      ),
                    )}
                  </div>

                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4 line-clamp-3 group-hover:text-blue-300 transition-colors">
                    {posts[0].title}
                  </h3>

                  <p className="text-base sm:text-lg text-slate-300 font-light line-clamp-2 mb-8 max-w-xl">
                    {posts[0].excerpt}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-6 border-t border-slate-700/50 pt-6">
                    <div className="flex items-center gap-6">
                      <span className="flex items-center gap-2 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-slate-400">
                        <Calendar className="w-4 h-4 text-blue-400" />
                        {formatDate(posts[0].createdAt)}
                      </span>
                      <span className="flex items-center gap-2 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-slate-400">
                        <Clock className="w-4 h-4 text-purple-400" />
                        {posts[0].readTime || 5} {t.minutes}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-white opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                      {t.editorsPick}
                      <ArrowUpRight className="w-5 h-5 text-blue-400" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 2. Secondary Stacked Posts (Indices 1 & 2) */}
            <div className="lg:col-span-5 flex flex-col gap-6 sm:gap-8 h-full">
              {posts.slice(1, 3).map((post, index) => (
                <motion.div
                  key={post.id || index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.7,
                    delay: index * 0.15,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="group relative flex flex-col overflow-hidden rounded-[2rem] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex-1 min-h-[350px] transition-all hover:bg-white dark:hover:bg-slate-800 shadow-sm hover:shadow-2xl"
                >
                  <Link
                    href={`${basePath}/blog/${post.slug}`}
                    className="absolute inset-0 z-20"
                    aria-label={`Read ${post.title}`}
                  />

                  <div className="relative w-full h-[60%] sm:h-[50%] overflow-hidden">
                    <Image
                      src={post.coverImage || "/images/posts/blog.avif"}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-1000 ease-[0.16,1,0.3,1] group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10" />

                    {/* Hover Overlay Arrow */}
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-blue-600/0 group-hover:bg-blue-600/20 backdrop-blur-none group-hover:backdrop-blur-sm transition-all duration-500">
                      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-[0.4s] delay-75 ease-[0.16,1,0.3,1] shadow-xl">
                        <ArrowUpRight className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8 flex flex-col justify-between flex-1 pointer-events-none relative z-10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-3xl">
                    <div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {(post.categories || [])
                          .slice(0, 2)
                          .map((cat: string, i: number) => (
                            <span
                              key={i}
                              className="text-[9px] sm:text-[10px] font-bold tracking-widest uppercase text-blue-600 dark:text-blue-400"
                            >
                              {cat}
                              {i === 0 && post.categories.length > 1 && (
                                <span className="ml-2 text-slate-300 dark:text-slate-600">
                                  ·
                                </span>
                              )}
                            </span>
                          ))}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-light line-clamp-2">
                        {post.excerpt}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-6">
                      <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-slate-500">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(post.createdAt)}
                      </span>
                      <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-slate-500">
                        <Eye className="w-3.5 h-3.5" />
                        {post.views || 0}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Optional Fill if there is only a Hero and ONE secondary post */}
              {posts.length === 2 && (
                <div className="flex-1 rounded-[2rem] bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 border-dashed flex items-center justify-center min-h-[350px]">
                  <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-slate-400">
                    {t.publishingSoon}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
