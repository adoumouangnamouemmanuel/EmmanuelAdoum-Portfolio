"use client";

import BlogContent from "@/components/blog/BlogContent";
import CommentSection from "@/components/blog/CommentSection";
import LikeButton from "@/components/blog/LikeButton";
import TableOfContents from "@/components/blog/TableOfContents";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  Copy,
  Edit,
  Eye,
  Linkedin,
  Share2,
  Twitter,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Define the BlogPost type
type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  date: string;
  readTime: number;
  categories: string[];
  authorId?: string;
  author?: {
    id: string;
    name: string;
    image: string;
    bio?: string;
    displayName?: string;
    photoURL?: string;
    description?: string;
    github?: string;
    twitter?: string;
    linkedin?: string;
    social?: {
      github?: string;
      twitter?: string;
      linkedin?: string;
    };
  };
  views: number;
  _count?: {
    comments: number;
    likes: number;
  };
};

export default function BlogPostPage() {
  const params = useParams();
  const pathname = usePathname();
  const basePath = pathname?.startsWith("/fr") ? "/fr" : "";
  const isFr = pathname?.startsWith("/fr");
  const router = useRouter();
  const { data: session } = useSession();
  const slug = (params?.slug as string) || "";
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showCoverViewer, setShowCoverViewer] = useState(false);

  const t = isFr
    ? {
        notFound: "Contenu introuvable",
        returnBlog: "Retour au blog",
        author: "Auteur",
        unknownAuthor: "Auteur inconnu",
        minRead: "MIN LECTURE",
        views: "VUES",
        blogShort: "Blog",
        editPost: "Modifier",
        linkCopied: "Lien copié !",
        copyUrl: "Copier l'URL",
        shareX: "Partager sur X",
        shareLinkedIn: "Partager sur LinkedIn",
        min: "MIN",
        writtenBy: "Écrit par",
        defaultBio:
          "Ingénieur principal structurant des produits à fort impact.",
        comments: "Commentaires",
        tableOfContents: "Table des matières",
        relatedPosts: "Articles associés",
        read: "Lire",
        viewCover: "Voir l'image",
        closeViewer: "Fermer",
      }
    : {
        notFound: "Record Not Found",
        returnBlog: "Return to Blog",
        author: "Author",
        unknownAuthor: "Unknown Author",
        minRead: "MIN READ",
        views: "VIEWS",
        blogShort: "Blog",
        editPost: "Edit Post",
        linkCopied: "Link Copied!",
        copyUrl: "Copy URL",
        shareX: "Share to X",
        shareLinkedIn: "Share to LinkedIn",
        min: "MIN",
        writtenBy: "Written By",
        defaultBio:
          "Principal Architect and Engineer structuring high-end layouts.",
        comments: "Comments",
        tableOfContents: "Table of Contents",
        relatedPosts: "Related Posts",
        read: "Read",
        viewCover: "View Cover",
        closeViewer: "Close",
      };

  const { scrollY } = useScroll();
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const actionBackground = useTransform(
    scrollY,
    [0, 300],
    ["rgba(255,255,255,0)", "rgba(255,255,255,0.8)"],
  );
  const actionBackgroundDark = useTransform(
    scrollY,
    [0, 300],
    ["rgba(15,23,42,0)", "rgba(15,23,42,0.85)"],
  );
  const actionBorder = useTransform(
    scrollY,
    [0, 300],
    ["rgba(200,200,200,0)", "rgba(200,200,200,0.3)"],
  );

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch from API
        const response = await fetch(`/api/posts/${slug}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError(isFr ? "Article introuvable" : "Post not found");
            setLoading(false);
            return;
          }
          throw new Error(`Error fetching post: ${response.statusText}`);
        }

        const data = await response.json();

        // Ensure author data is properly structured
        const postData = {
          ...data,
          author: {
            id: data.author?.id || data.authorId || "",
            name: data.author?.name || data.author?.displayName || "Unknown",
            image:
              data.author?.image ||
              data.author?.photoURL ||
              "/images/posts/profile.jpeg",
            bio: data.author?.bio || data.author?.description || "",
            social: {
              github: data.author?.social?.github || data.author?.github || "",
              twitter:
                data.author?.social?.twitter || data.author?.twitter || "",
              linkedin:
                data.author?.social?.linkedin || data.author?.linkedin || "",
            },
          },
        };

        setPost(postData);

        // Fetch related posts
        const categories = Array.isArray(data.categories)
          ? data.categories
          : [];
        const primaryCategory =
          categories.find(
            (category: unknown) =>
              typeof category === "string" &&
              category.trim() &&
              category.toLowerCase() !== "uncategorized",
          ) ||
          categories[0] ||
          "";

        const relatedResponse = await fetch(
          `/api/posts?category=${encodeURIComponent(primaryCategory)}&limit=3`,
        );
        if (relatedResponse.ok) {
          const relatedData = await relatedResponse.json();
          const filteredPosts = relatedData.posts
            .filter((p: BlogPost) => p.slug !== slug)
            .map((p: BlogPost) => ({
              ...p,
              author: {
                id: p.author?.id || p.authorId || "",
                name: p.author?.name || p.author?.displayName || "Unknown",
                image:
                  p.author?.image ||
                  p.author?.photoURL ||
                  "/images/posts/profile.jpeg",
                bio: p.author?.bio || p.author?.description || "",
              },
            }));
          setRelatedPosts(filteredPosts.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching blog post:", error);
        setError(
          isFr ? "Impossible de charger l'article" : "Failed to load blog post",
        );
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug, isFr]);

  useEffect(() => {
    if (!slug || typeof window === "undefined") return;

    const viewKey = `post_${slug}_viewed`;
    const hasViewed = localStorage.getItem(viewKey);

    if (!hasViewed) {
      fetch(`/api/posts/${slug}/views`, { method: "POST" })
        .then((res) => {
          if (res.ok) {
            localStorage.setItem(viewKey, "1");
          }
        })
        .catch((err) => {
          console.error("Error incrementing view count:", err);
        });
    }
  }, [slug]);

  const copyToClipboard = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      setShowShareMenu(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex justify-center items-center">
        <div className="w-12 h-12 rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-blue-600 dark:border-t-blue-400 animate-spin" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center py-16 px-6">
        <h1 className="text-4xl font-bold mb-4 tracking-tighter text-slate-900 dark:text-white">
          {t.notFound}
        </h1>
        <p className="mb-10 text-slate-500 font-light text-lg">{error}</p>
        <Link href={`${basePath}/blog`}>
          <button className="px-8 py-4 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold tracking-widest uppercase hover:scale-105 transition-transform duration-300">
            {t.returnBlog}
          </button>
        </Link>
      </main>
    );
  }

  if (!post) return null;

  const author = post.author || {
    id: post.authorId || "",
    name: t.unknownAuthor,
    image: "/images/posts/profile.jpeg",
    bio: "",
    social: {},
  };

  const displayCategories = (() => {
    const cleaned = (post.categories || [])
      .filter((category) => typeof category === "string")
      .map((category) => category.trim())
      .filter(Boolean);

    const nonFallback = cleaned.filter(
      (category) => category.toLowerCase() !== "uncategorized",
    );

    return nonFallback.length > 0
      ? nonFallback
      : cleaned.length > 0
        ? cleaned
        : ["Uncategorized"];
  })();

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 selection:bg-blue-200 dark:selection:bg-blue-900/50 pt-24 sm:pt-28 pb-24 overflow-x-hidden">
      {/* 1. Cinematic Edge-to-Edge Cover */}
      <section className="relative w-full h-[70vh] sm:h-[78vh] lg:h-[84vh] flex items-end overflow-hidden bg-slate-950">
        <motion.div
          className="absolute inset-0 z-0 origin-top"
          style={{ opacity: heroOpacity, y: heroY, scale: 1.05 }}
        >
          <Image
            src={post.coverImage || "/images/posts/blog.avif"}
            alt={post.title}
            fill
            priority
            className="object-cover"
          />
        </motion.div>

        {/* Cinematic Gradients */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
        <div className="absolute inset-0 z-10 bg-black/20" />

        {/* Mastermind Hover Elements Overlay */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pb-14 sm:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-6 sm:mb-8 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-slate-300">
              <button
                type="button"
                onClick={() => setShowCoverViewer(true)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-white/30 bg-slate-900/45 backdrop-blur-md text-white hover:bg-slate-900/60 transition-colors"
              >
                <Eye className="w-4 h-4" />
                {t.viewCover}
              </button>
              <span className="w-1 h-1 rounded-full bg-slate-500" />
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" /> {post.date}
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-500" />
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-400" /> {post.readTime}{" "}
                {t.minRead}
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-500" />
              <span className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-400" /> {post.views}{" "}
                {t.views}
              </span>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.2,
              }}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white mb-8 leading-[1.05] sm:leading-[1.1] max-w-5xl"
              style={{ textShadow: "0 3px 20px rgba(0, 0, 0, 0.4)" }}
            >
              {post.title}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.3,
              }}
              className="flex flex-col gap-6"
            >
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {displayCategories.map((category, index) => (
                  <span
                    key={index}
                    className="px-4 py-1.5 rounded-full bg-gradient-to-r from-violet-500/35 to-indigo-500/35 backdrop-blur-md border border-white/25 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-white shadow-xl"
                  >
                    {category}
                  </span>
                ))}
              </div>

              {/* Author Chip Inside Hero */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-white/20">
                  <Image
                    src={author.image || "/images/posts/profile.jpeg"}
                    alt={author.name}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-white font-medium text-sm sm:text-base">
                    {author.name}
                  </div>
                  <div className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-slate-300">
                    {t.author}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {showCoverViewer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/90 backdrop-blur-sm"
          >
            <button
              type="button"
              onClick={() => setShowCoverViewer(false)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/25 bg-black/35 text-white text-xs font-bold tracking-widest uppercase hover:bg-black/55 transition-colors"
            >
              <X className="w-4 h-4" />
              {t.closeViewer}
            </button>
            <div className="relative w-full h-full p-6 sm:p-12 md:p-16">
              <Image
                src={post.coverImage || "/images/posts/blog.avif"}
                alt={post.title}
                fill
                priority
                className="object-contain"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Glassmorphic Apple-Style Floating Bar */}
      <motion.div
        className="sticky top-14 sm:top-16 lg:top-20 z-40 w-full border-b border-transparent transition-all backdrop-blur-0"
        style={{
          backgroundColor:
            typeof window !== "undefined" &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
              ? (actionBackgroundDark as any)
              : (actionBackground as any),
          borderColor: actionBorder as any,
          backdropFilter: "blur(12px)",
        }}
      >
        <motion.div
          className="absolute inset-x-0 top-0 h-[2px] origin-left bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500"
          style={{ scaleX: scrollYProgress }}
        />
        <div className="max-w-7xl mx-auto px-6 sm:px-12 flex items-center justify-between py-4">
          <Link
            href={`${basePath}/blog`}
            className="inline-flex items-center text-[10px] sm:text-xs font-bold tracking-widest uppercase text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
          >
            <ArrowLeft className="mr-3 h-4 w-4 group-hover:-translate-x-2 transition-transform duration-300" />
            <span className="hidden sm:inline">{t.returnBlog}</span>
            <span className="inline sm:hidden">{t.blogShort}</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            {session?.user &&
              post?.author?.id &&
              (session.user.id === post.author.id ||
                session.user.role === "admin") && (
                <Link href={`${basePath}/blog/edit/${post.slug}`}>
                  <button className="flex flex-row items-center justify-center gap-2 px-4 sm:px-6 py-2.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold tracking-widest uppercase hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
                    <Edit className="w-4 h-4" />
                    <span className="hidden sm:inline">{t.editPost}</span>
                  </button>
                </Link>
              )}

            {/* Minimalist Like */}
            <div className="bg-slate-100 dark:bg-slate-900/50 rounded-full scale-90 sm:scale-100 origin-right">
              <LikeButton postSlug={slug} />
            </div>

            {/* Dropdown Share Menu */}
            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="p-3 rounded-full bg-slate-100 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <AnimatePresence>
                {showShareMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-3 p-2 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-1 min-w-[200px]"
                  >
                    <button
                      onClick={copyToClipboard}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors text-left"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                      {copied ? t.linkCopied : t.copyUrl}
                    </button>
                    <a
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}&text=${encodeURIComponent(post.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-blue-500 transition-colors"
                    >
                      <Twitter className="w-4 h-4" /> {t.shareX}
                    </a>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-blue-700 transition-colors"
                    >
                      <Linkedin className="w-4 h-4" /> {t.shareLinkedIn}
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3. Ergonomic Content Engine */}
      <section className="py-16 sm:py-24 overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
            {/* The Reading Column (Max-width optimal for typography line-length) */}
            <article className="w-full lg:w-8/12 xl:w-9/12 max-w-4xl">
              {/* Mobile Meta Data Inject (Since it's hidden in hero on mobile) */}
              <div className="flex sm:hidden flex-wrap items-center gap-4 text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-12 pb-6 border-b border-slate-200 dark:border-slate-800">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> {post.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> {post.readTime} {t.min}
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" /> {post.views} {t.views}
                </span>
              </div>

              {/* The Actual Content Document */}
              <div className="prose prose-lg dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:text-blue-500 max-w-none mb-20">
                <BlogContent content={post.content} />
              </div>

              {/* Majestic Centered Author Bio Matrix */}
              <div className="py-16 border-t border-b border-slate-200 dark:border-slate-800/60 my-20">
                <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden mb-8 border-4 border-slate-50 dark:border-slate-900 shadow-xl">
                    <Image
                      src={author.image || "/images/posts/profile.jpeg"}
                      alt={author.name}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-blue-600 dark:text-blue-400 mb-3">
                    {t.writtenBy}
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-bold tracking-tighter text-slate-900 dark:text-white mb-6">
                    {author.name}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 font-light text-base sm:text-lg mb-8 leading-relaxed">
                    {author.bio || t.defaultBio}
                  </p>

                  <div className="flex items-center gap-4">
                    {author.social?.github && (
                      <a
                        href={author.social.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all hover:scale-110"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </a>
                    )}
                    {author.social?.twitter && (
                      <a
                        href={author.social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all hover:scale-110"
                      >
                        <Twitter className="w-5 h-5 text-blue-400" />
                      </a>
                    )}
                    {author.social?.linkedin && (
                      <a
                        href={author.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all hover:scale-110"
                      >
                        <Linkedin className="w-5 h-5 text-blue-600" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Seamless Comment Section */}
              <div className="mb-20">
                <h3 className="text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-slate-400 mb-10 flex items-center gap-3">
                  <span className="w-4 h-[2px] bg-slate-200 dark:bg-slate-800" />
                  {t.comments}
                </h3>
                <CommentSection postSlug={slug} />
              </div>
            </article>

            {/* Sticky Table of Contents Sidebar */}
            <aside className="hidden lg:block lg:w-4/12 xl:w-3/12 relative">
              <div className="lg:sticky lg:top-36 xl:top-40 lg:self-start lg:w-full lg:max-w-[340px] lg:ml-auto">
                <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400 mb-8 flex items-center gap-3">
                  <span className="w-4 h-[2px] bg-slate-200 dark:bg-slate-800" />
                  {t.tableOfContents}
                </h3>
                <div className="pl-6 border-l border-slate-200 dark:border-slate-800/60 overflow-y-auto pr-1 max-h-[calc(100vh-16rem)]">
                  <TableOfContents content={post.content} />
                </div>
              </div>
            </aside>
          </div>

          {/* Mastermind Architectural Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="pt-24 border-t border-slate-200 dark:border-slate-800/60">
              <h3 className="text-3xl font-bold tracking-tighter text-slate-900 dark:text-white mb-12 text-center sm:text-left">
                {t.relatedPosts}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5 }}
                    className="group relative flex flex-col overflow-hidden rounded-3xl bg-slate-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 transition-all duration-500 shadow-sm hover:shadow-xl border border-transparent hover:border-slate-200 dark:hover:border-slate-800"
                  >
                    <Link
                      href={`${basePath}/blog/${relatedPost.slug}`}
                      className="absolute inset-0 z-20"
                      aria-label={`Read ${relatedPost.title}`}
                    />

                    <div className="w-full aspect-[16/10] overflow-hidden relative bg-slate-100 dark:bg-slate-800">
                      <Image
                        src={
                          relatedPost.coverImage || "/images/posts/blog.avif"
                        }
                        alt={relatedPost.title}
                        fill
                        className="object-cover transition-transform duration-700 ease-[0.16,1,0.3,1] group-hover:scale-105"
                      />
                    </div>

                    <div className="p-6 sm:p-8 flex-1 flex flex-col relative z-10 pointer-events-none">
                      <div className="flex-1 mb-6">
                        <h4 className="text-xl font-bold mb-3 tracking-tight text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {relatedPost.title}
                        </h4>
                        <p className="text-slate-500 dark:text-slate-400 font-light text-sm line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                      </div>

                      <div className="flex justify-between items-center pt-5 border-t border-slate-200 dark:border-slate-800/50 mt-auto">
                        <div className="flex items-center gap-1.5 text-[9px] font-bold tracking-widest uppercase text-slate-400">
                          <Calendar className="h-3 w-3" />
                          <span>{relatedPost.date}</span>
                        </div>
                        <span className="flex items-center gap-1 text-[9px] font-bold tracking-widest uppercase text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                          {t.read} <ChevronRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
