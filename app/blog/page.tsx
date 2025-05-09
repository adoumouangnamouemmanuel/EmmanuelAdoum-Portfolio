"use client";

import Footer from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { blogPosts } from "@/data/blog";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion, useInView } from "framer-motion";
import {
  ArrowLeft,
  BookmarkPlus,
  Calendar,
  ChevronRight,
  Clock,
  Eye,
  Plus,
  Search,
  Share2,
  Tag,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// Add date formatting function
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\//g, '-');
};

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
  author: {
    name: string;
    avatar: string;
    bio?: string;
    social?: {
      github?: string;
      twitter?: string;
      linkedin?: string;
    };
  };
  views: number;
  _count?: {
    likes?: number;
    comments?: number;
  };
};

export default function BlogPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [blogPostsData, setBlogPostsData] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  // Add a new state for pagination on mobile
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = { mobile: 4, desktop: 10 }; // 4 posts per page on mobile, 10 on desktop
  const isMobile = useIsMobile();
  const router = useRouter();

  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/posts?published=true');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
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
            readTime: post.readTime || 5, // Default read time if not set
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

        // Extract all unique categories
        const categories = Array.from(
          new Set(data.posts.flatMap((post: any) => post.categories || []))
        ).filter((cat): cat is string => typeof cat === 'string');
        setAllCategories(categories);
      } catch (error) {
        console.error('Error fetching posts:', error);
        // Fallback to local data if fetch fails
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

        // Extract all unique categories from fallback data
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

  // Filter posts based on search and category
  const filteredPosts = blogPostsData.filter((post) => {
    const matchesSearch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === null || post.categories.includes(selectedCategory);

    return matchesSearch && matchesCategory;
  });

  // Modify the filtered posts logic to handle pagination
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * (isMobile ? postsPerPage.mobile : postsPerPage.desktop),
    currentPage * (isMobile ? postsPerPage.mobile : postsPerPage.desktop)
  );

  // Add a function to handle page changes
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // Scroll to top of posts section
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: document.getElementById("blog-posts")?.offsetTop || 0,
        behavior: "smooth",
      });
    }
  };

  // Calculate total pages
  const totalPages = Math.ceil(
    filteredPosts.length /
      (isMobile ? postsPerPage.mobile : postsPerPage.desktop)
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

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
  };

  // Featured post logic using Firestore data
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
    <main className="min-h-screen">
      {/* Hero section */}
      <section className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 py-16 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                size="sm"
                className="shadow-md group"
                asChild
              >
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                  Go to My Portfolio
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button variant="default" size="sm" className="shadow-md" asChild>
                <Link href="/blog/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Post
                </Link>
              </Button>
            </motion.div>
          </div>

          <div className="text-center max-w-3xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              The <span className="gradient-text">Blog</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-muted-foreground mb-8"
            >
              Thoughts, tutorials, and insights about web development, design,
              and technology.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative max-w-xl mx-auto mb-8 lg:mb-16"
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search articles..."
                className="pl-10 shadow-md focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Categories as Tags */}
          <div className="lg:hidden mb-4">
            <h3 className="text-lg font-semibold mb-2">Categories</h3>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={selectedCategory === null ? "default" : "secondary"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(null)}
              >
                All Categories
              </Badge>
              {allCategories.map((category, index) => (
                <Badge
                  key={index}
                  variant={
                    selectedCategory === category ? "default" : "secondary"
                  }
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Only visible on desktop */}
            <div className="hidden lg:block lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg sticky top-24"
              >
                <h3 className="text-lg font-semibold mb-4">Categories</h3>
                <div className="space-y-2">
                  <motion.button
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === null
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => setSelectedCategory(null)}
                  >
                    All Categories
                  </motion.button>

                  {allCategories.map((category, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ x: 5 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === category
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </motion.button>
                  ))}
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 my-6 pt-6">
                  <h3 className="text-lg font-semibold mb-4">Popular Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {allCategories.map((tag, index) => (
                      <Badge
                        key={index}
                        variant={
                          selectedCategory === tag ? "default" : "secondary"
                        }
                        className="cursor-pointer"
                        onClick={() => setSelectedCategory(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 my-6 pt-6">
                  <h3 className="text-lg font-semibold mb-4">Featured Post</h3>
                  <div className="space-y-3">
                    {featuredPost ? (
                      <>
                        <div className="relative h-40 rounded-lg overflow-hidden">
                          <Image
                            src={"/images/posts/blog.avif"} //featuredPost.coverImage
                            alt={featuredPost.title || "Featured Post"}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <h4 className="font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          <Link href={`/blog/${featuredPost.slug}`}>
                            {featuredPost.title}
                          </Link>
                        </h4>
                        <div className="flex items-center text-xs text-muted-foreground gap-2">
                          <Eye className="h-3 w-3" />
                          <span>{featuredPost.views} views</span>
                          <span className="mx-1">·</span>
                          <span>👍 {featuredPost._count?.likes || 0} likes</span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{featuredPost.excerpt}</p>
                      </>
                    ) : (
                      <div className="text-xs text-muted-foreground">No featured post available.</div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Main content */}
            <div className="lg:col-span-3">
              <motion.div
                ref={ref}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={containerVariants}
              >
                {filteredPosts.length > 0 ? (
                  <div
                    id="blog-posts"
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6"
                  >
                    {paginatedPosts.map((post, index) => (
                      <motion.article
                        key={index}
                        variants={itemVariants}
                        whileHover={{
                          y: -10,
                          transition: {
                            type: "spring",
                            stiffness: 300,
                            damping: 10,
                          },
                        }}
                        className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700 group"
                      >
                        <Link href={`/blog/${post.slug}`} className="block">
                          <div className="relative h-36 lg:h-44 overflow-hidden">
                            <Image
                              src={
                                // post.coverImage ||
                                "/images/posts/blog.avif"
                              }
                              alt={post.title}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="absolute bottom-0 left-0 right-0 p-4">
                                <h4 className="text-white font-medium">
                                  Read Article
                                </h4>
                              </div>
                            </div>
                          </div>
                        </Link>

                        <div className="p-4 lg:p-5">
                          <div className="flex flex-wrap gap-2 mb-2 lg:mb-3">
                            {post.categories
                              .slice(0, 2)
                              .map((category, catIndex) => (
                                <motion.div
                                  key={catIndex}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 0.3 + catIndex * 0.05 }}
                                  whileHover={{ y: -2, scale: 1.05 }}
                                >
                                  <Badge
                                    variant="secondary"
                                    className="shadow-sm flex items-center gap-1 cursor-pointer text-xs"
                                    onClick={() =>
                                      setSelectedCategory(category)
                                    }
                                  >
                                    <Tag className="h-3 w-3" />
                                    {category}
                                  </Badge>
                                </motion.div>
                              ))}
                            {post.categories.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{post.categories.length - 2}
                              </Badge>
                            )}
                          </div>

                          <Link
                            href={`/blog/${post.slug}`}
                            className="block group"
                          >
                            <h3 className="text-base lg:text-lg font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                              {post.title}
                            </h3>
                          </Link>

                          <p className="text-muted-foreground mb-3 lg:mb-4 line-clamp-2 text-xs lg:text-sm">
                            {post.excerpt}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-xs text-muted-foreground">
                              <div className="flex items-center mr-3">
                                <Calendar className="h-3 w-3 mr-1 text-blue-600 dark:text-blue-400" />
                                <span>{formatDate(post.date)}</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1 text-blue-600 dark:text-blue-400" />
                                <span>{post.readTime} min read</span>
                              </div>
                            </div>

                            <motion.div
                              whileHover={{ x: 5 }}
                              transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 10,
                              }}
                            >
                              <Link
                                href={`/blog/${post.slug}`}
                                className="text-blue-600 dark:text-blue-400 text-xs lg:text-sm font-medium hover:underline flex items-center"
                              >
                                Read more
                                <ChevronRight className="ml-1 h-3 w-3" />
                              </Link>
                            </motion.div>
                          </div>

                          {/* Author and actions */}
                          <div className="flex items-center justify-between mt-3 lg:mt-4 pt-3 lg:pt-4 border-t border-gray-100 dark:border-gray-700">
                            <div className="flex items-center">
                              <div className="w-6 h-6 lg:w-7 lg:h-7 rounded-full overflow-hidden mr-2 bg-gray-200 dark:bg-gray-700">
                                <Image
                                  src={
                                    post.author.avatar ||
                                    "/images/posts/profile.jpeg" ||
                                    "/placeholder.svg"
                                  }
                                  alt={post.author.name}
                                  width={28}
                                  height={28}
                                  className="object-cover"
                                />
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {post.author.name}
                              </span>
                            </div>
                            <div className="flex space-x-2">
                              <motion.button
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                              >
                                <BookmarkPlus className="h-3 w-3 text-muted-foreground" />
                              </motion.button>
                              <motion.button
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                              >
                                <Share2 className="h-3 w-3 text-muted-foreground" />
                              </motion.button>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Eye className="h-3 w-3 mr-1" />
                                <span>
                                  {post.views}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.article>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    variants={itemVariants}
                    className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-lg"
                  >
                    <h3 className="text-xl font-semibold mb-2">
                      No posts found
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      No posts match your current search criteria. Try adjusting
                      your search or category filter.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory(null);
                      }}
                    >
                      Reset Filters
                    </Button>
                  </motion.div>
                )}

                {/* Pagination */}
                {filteredPosts.length > 0 && (
                  <motion.div
                    variants={itemVariants}
                    className="flex justify-center mt-8 lg:mt-12"
                  >
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                      >
                        Previous
                      </Button>

                      {/* Current page indicator */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      >
                        {currentPage} of {totalPages}
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                      >
                        Next
                      </Button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>
            
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
