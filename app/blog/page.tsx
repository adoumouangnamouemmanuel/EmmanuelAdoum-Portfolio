"use client";

import Footer from "@/components/layout/Footer";
import { blogPosts } from "@/data/blog";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  Clock,
  Eye,
  Plus,
  Search,
  ArrowUpRight,
  Filter,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

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
  author: {
    name: string;
    avatar: string;
    bio?: string;
    social?: { github?: string; twitter?: string; linkedin?: string; };
  };
  views: number;
  _count?: { likes?: number; comments?: number; };
};

export default function BlogPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [searchQuery, setSearchQuery] = useState("");
  // Upgraded to Array tracking
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [blogPostsData, setBlogPostsData] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  
  const postsPerPage = { mobile: 4, desktop: 10 };
  const isMobile = useIsMobile();
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/posts?published=true');
        if (!response.ok) throw new Error('Failed to fetch posts');
        const data = await response.json();
        
        setBlogPostsData(
          data.posts.map((post: any) => ({
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            content: post.content,
            coverImage: post.coverImage,
            date: post.createdAt?.seconds 
              ? new Date(post.createdAt.seconds * 1000).toISOString()
              : post.createdAt,
            readTime: post.readTime || 5,
            categories: post.categories || [],
            views: post.views || 0,
            author: {
              name: post.author?.name || 'User',
              avatar: post.author?.image || '/images/posts/profile.jpeg',
              bio: post.author?.bio,
              social: post.author?.social,
            },
            _count: post._count,
          }))
        );

        const categories = Array.from(
          new Set(data.posts.flatMap((post: any) => post.categories || []))
        ).filter((cat): cat is string => typeof cat === 'string');
        setAllCategories(categories);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setBlogPostsData(
          blogPosts.map((post) => ({
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            content: post.content,
            coverImage: post.coverImage,
            date: post.createdAt,
            readTime: post.readTime,
            categories: post.categories,
            views: post.views,
            author: {
              name: post.author.name,
              avatar: post.author.image,
              bio: post.author.bio,
              social: post.author.social,
            },
            _count: post._count,
          }))
        );

        const categories = Array.from(
          new Set(blogPosts.flatMap((post) => post.categories))
        );
        setAllCategories(categories);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = blogPostsData.filter((post) => {
    const matchesSearch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategories.length === 0 || 
      selectedCategories.some(cat => post.categories.includes(cat));

    return matchesSearch && matchesCategory;
  });

  const toggleCategory = (category: string) => {
     if (selectedCategories.includes(category)) {
        setSelectedCategories(selectedCategories.filter(c => c !== category));
     } else {
        setSelectedCategories([...selectedCategories, category]);
     }
     setCurrentPage(1);
  };

  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * (isMobile ? postsPerPage.mobile : postsPerPage.desktop),
    currentPage * (isMobile ? postsPerPage.mobile : postsPerPage.desktop)
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: document.getElementById("mastermind-feed")?.offsetTop || 0,
        behavior: "smooth",
      });
    }
  };

  const totalPages = Math.ceil(
    filteredPosts.length / (isMobile ? postsPerPage.mobile : postsPerPage.desktop)
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  };

  const featuredPost = blogPostsData
    .slice()
    .sort((a, b) => {
      const likesA = a._count?.likes || 0;
      const likesB = b._count?.likes || 0;
      if (likesA !== likesB) return likesB - likesA;
      if ((b.views || 0) !== (a.views || 0)) return (b.views || 0) - (a.views || 0);
      return (a.author.name || '').localeCompare(b.author.name || '');
    })[0];

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 selection:bg-blue-200 dark:selection:bg-blue-900/50">
      
      {/* Massive Cinematic Headers */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/30 via-slate-50 to-slate-50 dark:from-blue-900/10 dark:via-slate-950 dark:to-slate-950"></div>
        
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-16"
          >
            <Link href="/" className="inline-flex items-center text-[10px] sm:text-xs font-bold tracking-widest uppercase text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group">
              <ArrowLeft className="mr-3 h-4 w-4 group-hover:-translate-x-2 transition-transform duration-300" />
              Return Home
            </Link>

            {/* Admin Authenticated Button */}
            {session && (
               <Link href="/blog/create" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-[10px] sm:text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-md">
                 <Plus className="w-4 h-4" />
                 Initialize Publication
               </Link>
            )}
          </motion.div>

          <div className="max-w-4xl">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-slate-900 dark:text-white mb-6 leading-[0.95] md:leading-[0.9]"
            >
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 pb-2">Journal.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg md:text-xl text-slate-500 font-light max-w-xl mb-12"
            >
              Deep technical dives, architectural patterns, and systemic insights from the frontier of web engineering.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative max-w-2xl group"
            >
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" />
              <input
                type="text"
                placeholder="Search the vault index..."
                className="w-full pl-16 pr-6 py-5 rounded-full border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl shadow-sm focus:shadow-md focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400 font-light tracking-wide text-sm md:text-base"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Asymmetric Vault Grid */}
      <section className="pb-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pt-8 border-t border-slate-200 dark:border-slate-800/60">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 relative">
             
            {/* Left: The Feed (Main Column) */}
            <div className="w-full lg:w-8/12" id="mastermind-feed">
               
               {/* Mobile Filter Dropdown */}
               <div className="block lg:hidden mb-12">
                  <button
                     onClick={() => setIsFilterOpen(!isFilterOpen)}
                     className="w-full flex items-center justify-between px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-slate-700 dark:text-slate-300 shadow-sm"
                  >
                     <div className="flex items-center gap-3">
                        <Filter className="w-4 h-4 text-blue-600" />
                        Directory Operations {selectedCategories.length > 0 && <span className="text-blue-600">({selectedCategories.length})</span>}
                     </div>
                     {isFilterOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  
                  <AnimatePresence>
                     {isFilterOpen && (
                        <motion.div
                           initial={{ opacity: 0, height: 0, y: -10 }}
                           animate={{ opacity: 1, height: "auto", y: 0 }}
                           exit={{ opacity: 0, height: 0, y: -10 }}
                           className="overflow-hidden mt-3"
                        >
                           <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col gap-1 shadow-sm">
                              <button
                                 onClick={() => { setSelectedCategories([]); setCurrentPage(1); }}
                                 className={`w-full text-left px-5 py-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                                    selectedCategories.length === 0 ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm translate-x-1" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                 }`}
                              >
                                 All Operations
                              </button>
                              {allCategories.map((category, index) => (
                                 <button
                                    key={index}
                                    onClick={() => toggleCategory(category)}
                                    className={`w-full text-left px-5 py-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                                       selectedCategories.includes(category) ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm translate-x-1" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                    }`}
                                 >
                                    {category}
                                 </button>
                              ))}
                           </div>
                        </motion.div>
                     )}
                  </AnimatePresence>
               </div>
               
               {/* 1. Global Master Feature block */}
               {currentPage === 1 && !searchQuery && selectedCategories.length === 0 && featuredPost && (
                  <motion.div
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                     className="mb-16"
                  >
                     <div className="flex items-center gap-3 mb-6">
                        <span className="w-8 h-[2px] bg-blue-600 dark:bg-blue-400" />
                        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-blue-600 dark:text-blue-400">Featured Protocol</span>
                     </div>
                     
                     <div className="group relative rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-900 aspect-[4/3] sm:aspect-video mb-8 transition-transform hover:-translate-y-2 hover:shadow-2xl duration-700">
                        <Link href={`/blog/${featuredPost.slug}`} className="absolute inset-0 z-20" aria-label={`Read ${featuredPost.title}`} />
                        <Image
                           src={featuredPost.coverImage || "/images/posts/blog.avif"}
                           alt={featuredPost.title}
                           fill
                           className="object-cover transition-transform duration-1000 ease-[0.16,1,0.3,1] group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/20 to-transparent z-10 transition-opacity duration-700 group-hover:via-slate-900/40" />
                        
                        <div className="absolute inset-0 z-10 p-8 sm:p-12 flex flex-col justify-end pointer-events-none">
                           <div className="flex flex-wrap gap-2 mb-4">
                              {(featuredPost.categories || []).map((cat: string, i: number) => (
                                 <span key={i} className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[9px] sm:text-[10px] font-bold tracking-widest uppercase text-white shadow-xl">
                                    {cat}
                                 </span>
                              ))}
                           </div>
                           <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tighter mb-4 leading-tight group-hover:text-blue-300 transition-colors">
                              {featuredPost.title}
                           </h2>
                           <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-slate-300">
                              <span className="flex items-center gap-2 relative z-20"><Calendar className="w-4 h-4 text-blue-400" /> {formatDate(featuredPost.date)}</span>
                              <span className="w-1 h-1 rounded-full bg-slate-600" />
                              <span className="flex items-center gap-2 relative z-20"><Clock className="w-4 h-4 text-purple-400" /> {featuredPost.readTime} MIN READ</span>
                              <span className="hidden sm:inline w-1 h-1 rounded-full bg-slate-600" />
                              <span className="hidden sm:flex items-center gap-2 relative z-20"><Eye className="w-4 h-4 text-emerald-400" /> {featuredPost.views} VIEWS</span>
                           </div>
                        </div>
                     </div>
                  </motion.div>
               )}

               <div className="flex items-center gap-4 mb-8">
                  <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                     {selectedCategories.length > 0 ? `Index Results` : searchQuery ? `Search Results` : `The Feed`}
                  </span>
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
               </div>

               {/* Standard Paginated Feed */}
               <motion.div
                 ref={ref}
                 initial="hidden"
                 animate={isInView ? "visible" : "hidden"}
                 variants={containerVariants}
               >
                 {loading ? (
                    <div className="w-full py-24 flex justify-center items-center">
                       <div className="w-8 h-8 rounded-full border-2 border-slate-300 dark:border-slate-700 border-t-blue-600 dark:border-t-blue-400 animate-spin" />
                    </div>
                 ) : paginatedPosts.length > 0 ? (
                   <div className="flex flex-col gap-10">
                     {paginatedPosts.map((post, index) => (
                       <motion.article
                         key={post.id || index}
                         variants={itemVariants}
                         className="group relative flex flex-col md:flex-row gap-6 md:gap-8 overflow-hidden rounded-3xl bg-transparent sm:bg-slate-50 sm:dark:bg-slate-900/50 sm:hover:bg-white sm:dark:hover:bg-slate-900 sm:p-6 sm:border sm:border-transparent sm:hover:border-slate-200 sm:dark:hover:border-slate-800 transition-all duration-500"
                       >
                         <Link href={`/blog/${post.slug}`} className="absolute inset-0 z-20" aria-label={`Read ${post.title}`} />
                         
                         <div className="w-full md:w-5/12 aspect-[16/10] md:aspect-square lg:aspect-[4/3] rounded-2xl overflow-hidden relative bg-slate-100 dark:bg-slate-800 shrink-0">
                           <Image
                             src={post.coverImage || "/images/posts/blog.avif"}
                             alt={post.title}
                             fill
                             className="object-cover transition-transform duration-700 ease-[0.16,1,0.3,1] group-hover:scale-105"
                           />
                           <div className="absolute inset-0 z-10 flex items-center justify-center bg-blue-900/0 group-hover:bg-blue-900/10 backdrop-blur-none transition-all duration-500">
                             <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-950 flex items-center justify-center scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-[0.4s] delay-75 ease-[0.16,1,0.3,1] shadow-2xl">
                               <ArrowUpRight className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                             </div>
                           </div>
                         </div>

                         <div className="w-full md:w-7/12 flex flex-col justify-center py-2 relative z-10 pointer-events-none">
                           <div className="flex flex-wrap gap-2 mb-4">
                             {(post.categories || []).slice(0, 3).map((category, catIndex) => (
                               <span key={catIndex} className="text-[9px] sm:text-[10px] font-bold tracking-widest uppercase text-blue-600 dark:text-blue-400">
                                 {category}
                                 {catIndex < post.categories.length - 1 && catIndex < 2 && <span className="ml-2 text-slate-300 dark:text-slate-700">·</span>}
                               </span>
                             ))}
                           </div>

                           <h3 className="text-2xl sm:text-3xl font-bold mb-3 tracking-tight text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                             {post.title}
                           </h3>

                           <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-light line-clamp-2 mb-6 sm:mb-8 leading-relaxed">
                             {post.excerpt}
                           </p>

                           <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800/50 pt-5 mt-auto">
                              <div className="flex flex-wrap items-center gap-4 text-[9px] sm:text-[10px] font-bold tracking-widest uppercase text-slate-500">
                                 <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-400" /> {formatDate(post.date)}</span>
                                 <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400" /> {post.readTime} MIN</span>
                              </div>
                              <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                 Explore
                                 <ChevronRight className="w-4 h-4" />
                              </span>
                           </div>
                         </div>
                       </motion.article>
                     ))}
                   </div>
                 ) : (
                   <div className="py-24 p-10 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                     <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Vault Empty.</h3>
                     <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">
                       No architectural logs match the provided parameters inside the index.
                     </p>
                     <button
                       onClick={() => {
                         setSearchQuery("");
                         setSelectedCategories([]);
                         setCurrentPage(1);
                       }}
                       className="relative z-30 px-6 py-3 rounded-full border border-slate-200 dark:border-slate-800 text-[10px] font-bold tracking-widest uppercase text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                     >
                       Reset Index Parameters
                     </button>
                   </div>
                 )}

                 {filteredPosts.length > 0 && totalPages > 1 && (
                   <motion.div variants={itemVariants} className="flex justify-center mt-16 sm:mt-24">
                     <div className="inline-flex items-center p-1 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                       <button
                         disabled={currentPage === 1}
                         onClick={() => handlePageChange(currentPage - 1)}
                         className="px-6 py-3 rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm"
                       >
                         Previous
                       </button>

                       <span className="px-6 py-3 text-[10px] sm:text-xs font-bold tracking-widest text-slate-400 border-l border-r border-slate-200 dark:border-slate-800/60">
                         {currentPage} <span className="opacity-50 mx-1">/</span> {totalPages}
                       </span>

                       <button
                         disabled={currentPage === totalPages}
                         onClick={() => handlePageChange(currentPage + 1)}
                         className="px-6 py-3 rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm"
                       >
                         Next Sequence
                       </button>
                     </div>
                   </motion.div>
                 )}
               </motion.div>
            </div>

            {/* Right: The Naked Typographic Sidebar */}
            <div className="w-full lg:w-4/12 mt-12 lg:mt-0 hidden lg:block">
               <div className="sticky top-28 xl:top-36 flex flex-col gap-12 sm:gap-16">
                  
                  <div>
                     <h3 className="text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-slate-400 mb-6 flex items-center gap-3">
                        <span className="w-4 h-[2px] bg-slate-200 dark:bg-slate-800" />
                        Directory
                     </h3>
                     <div className="flex flex-col gap-1">
                        <button
                           onClick={() => { setSelectedCategories([]); setCurrentPage(1); }}
                           className={`w-full text-left px-5 py-4 rounded-2xl text-sm sm:text-base font-medium transition-all duration-300 ${
                              selectedCategories.length === 0 ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md translate-x-2" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/50 hover:pl-6"
                           }`}
                        >
                           All Operations
                        </button>
                        {allCategories.map((category, index) => (
                           <button
                              key={index}
                              onClick={() => toggleCategory(category)}
                              className={`w-full text-left px-5 py-4 rounded-2xl text-sm sm:text-base font-medium transition-all duration-300 ${
                                 selectedCategories.includes(category) ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md translate-x-2" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/50 hover:pl-6"
                              }`}
                           >
                              {category}
                           </button>
                        ))}
                     </div>
                  </div>

                  <div>
                     <h3 className="text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-slate-400 mb-6 flex items-center gap-3">
                        <span className="w-4 h-[2px] bg-slate-200 dark:bg-slate-800" />
                        Abstract Filters
                     </h3>
                     <div className="flex flex-wrap gap-2">
                        {allCategories.map((tag, index) => (
                           <button
                              key={index}
                              onClick={() => toggleCategory(tag)}
                              className={`px-4 py-2 rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase transition-colors duration-300 ${
                                 selectedCategories.includes(tag) ? "bg-blue-600 text-white" : "border border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-400 dark:hover:border-slate-600"
                              }`}
                           >
                              {tag}
                           </button>
                        ))}
                     </div>
                  </div>

               </div>
            </div>

          </div>
        </div>
      </section>

      {/* Interstitial Action Closure */}
      <section className="py-24 sm:py-32 bg-slate-900 dark:bg-slate-950 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-6 sm:px-12 text-center">
            <h2 className="text-4xl sm:text-6xl font-bold tracking-tighter text-white mb-10">Access the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Archive.</span></h2>
            <Link href="/projects">
              <button className="px-10 py-5 sm:px-12 sm:py-6 rounded-full bg-white text-slate-900 font-bold tracking-widest text-[10px] sm:text-xs uppercase hover:scale-105 hover:shadow-2xl transition-all duration-300">
                View Project History
              </button>
            </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
