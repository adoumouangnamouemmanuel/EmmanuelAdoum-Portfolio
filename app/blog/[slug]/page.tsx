"use client";

import BlogContent from "@/components/blog/BlogContent";
import CommentSection from "@/components/blog/CommentSection";
import LikeButton from "@/components/blog/LikeButton";
import ResponsiveImage from "@/components/blog/ResponsiveImage";
import TableOfContents from "@/components/blog/TableOfContents";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  Copy,
  Edit,
  Eye,
  Facebook,
  Linkedin,
  Twitter,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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
  const router = useRouter();
  const { data: session } = useSession();
  const slug = params?.slug as string || "";
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch from API
        const response = await fetch(`/api/posts/${slug}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError("Post not found");
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
            id: data.author?.id || data.authorId || '',
            name: data.author?.name || data.author?.displayName || 'Unknown',
            image: data.author?.image || data.author?.photoURL || '/images/posts/profile.jpeg',
            bio: data.author?.bio || data.author?.description || '',
            social: {
              github: data.author?.social?.github || data.author?.github || '',
              twitter: data.author?.social?.twitter || data.author?.twitter || '',
              linkedin: data.author?.social?.linkedin || data.author?.linkedin || '',
            }
          }
        };
        
        setPost(postData);

        // Handle view counting: only increment if not visited before in this browser
        const viewKey = `post_${slug}_viewed`;
        if (typeof window !== "undefined" && !localStorage.getItem(viewKey)) {
          try {
            await fetch(`/api/posts/${slug}/views`, {
              method: 'POST'
            });
            localStorage.setItem(viewKey, "1");
          } catch (error) {
            console.error('Error incrementing view count:', error);
          }
        }

        // Fetch related posts
        const relatedResponse = await fetch(
          `/api/posts?category=${data.categories[0] || ""}&limit=3`
        );
        if (relatedResponse.ok) {
          const relatedData = await relatedResponse.json();
          // Filter out the current post and ensure author data
          const filteredPosts = relatedData.posts
            .filter((p: BlogPost) => p.slug !== slug)
            .map((p: BlogPost) => ({
              ...p,
              author: {
                id: p.author?.id || p.authorId || '',
                name: p.author?.name || p.author?.displayName || 'Unknown',
                image: p.author?.image || p.author?.photoURL || '/images/posts/profile.jpeg',
                bio: p.author?.bio || p.author?.description || '',
                social: {
                  github: p.author?.social?.github || p.author?.github || '',
                  twitter: p.author?.social?.twitter || p.author?.twitter || '',
                  linkedin: p.author?.social?.linkedin || p.author?.linkedin || '',
                }
              }
            }));
          setRelatedPosts(filteredPosts.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching blog post:", error);
        setError("Failed to load blog post");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const copyToClipboard = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white dark:bg-gray-900">
        <section className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 py-16 relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-6"></div>
              <div className="flex justify-center space-x-6 mb-8">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              </div>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl mb-8"></div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Error</h1>
          <p className="mb-8 text-muted-foreground">{error}</p>
          <Button asChild>
            <Link href="/blog">Back to Blog</Link>
          </Button>
        </div>
      </main>
    );
  }

  if (!post) return null;

  // Ensure author data exists
  const author = post.author || {
    id: post.authorId || '',
    name: 'Unknown Author',
    image: '/images/posts/profile.jpeg',
    bio: '',
    social: {}
  };

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 pb-45 mt-[-20px]">
      {/* Hero section */}
      <section className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 py-16 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                className="shadow-md group dark:text-white"
                asChild
              >
                <Link href="/blog" className="text-black hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <ArrowLeft className="w-4 h-4 mr-2 inline" />
                  Back to Blog
                </Link>
              </Button>
            </motion.div>

            {session?.user &&
              post?.author?.id &&
              (session.user.id === post.author.id ||
                session.user.role === "admin") && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="shadow-md group dark:text-white"
                    asChild
                  >
                    <Link href={`/admin/posts/${post.id}/edit`} className="text-black hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      <Edit className="w-4 h-4 mr-2 inline" />
                      Edit Post
                    </Link>
                  </Button>
                </motion.div>
              )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap gap-2 mb-4 justify-center"
          >
            {post.categories.map((category, index) => (
              <Badge key={index} variant="secondary" className="shadow-sm">
                {category}
              </Badge>
            ))}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent dark:text-white"
          >
            {post.title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center justify-center space-x-6 text-sm text-muted-foreground mb-8"
          >
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
              <span>{post.readTime} min read</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-8"
          >
            <ResponsiveImage
              src={ "/images/posts/blog.avif"} //post.coverImage ||
              alt={post.title}
              priority
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3 bg-gray-200 dark:bg-gray-700">
                <img
                  src={"/images/posts/profile.jpeg"} //author.image ||
                  alt={author.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="font-medium text-black dark:text-white">{author.name}</div>
                <div className="text-xs text-muted-foreground">
                  {author.bio
                    ? author.bio.split(" ").slice(0, 3).join(" ") + "..."
                    : "Author"}
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              <LikeButton postSlug={slug} />

              <motion.div
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
              >
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {post.views > 0 && (
                    <span className="text-xs font-medium">{post.views}</span>
                  )}
                </div>
              </motion.div>

              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800/40 transition-colors"
                onClick={copyToClipboard}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </motion.button>

              <motion.a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  typeof window !== "undefined" ? window.location.href : ""
                )}&text=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800/40 transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </motion.a>

              <motion.a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  typeof window !== "undefined" ? window.location.href : ""
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 hover:bg-blue-200 dark:hover:bg-blue-800/40 transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </motion.a>

              <motion.a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                  typeof window !== "undefined" ? window.location.href : ""
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 hover:bg-blue-200 dark:hover:bg-blue-800/40 transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main content */}
            <div className="lg:col-span-3 xl:col-span-3 xl:max-w-5xl">
              <BlogContent content={post.content} />

              {/* Comments section */}
              <CommentSection postSlug={slug} />

              {/* Author bio */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mt-8 flex flex-col md:flex-row items-center md:items-start gap-6"
              >
                <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 bg-gray-200 dark:bg-gray-700">
                  <img
                    src={"/images/posts/profile.jpeg"} //author.image ||
                    alt={author.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 dark:text-white sm-text-center">{author.name}</h3>
                  <p className="text-muted-foreground mb-4">
                    {author.bio ||
                      "Author's bio is not available."}
                  </p>
                  <div className="flex space-x-3">
                    {author.social?.github && (
                      <motion.a
                        href={author.social.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        whileHover={{ y: -3, scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </motion.a>
                    )}
                    {author.social?.twitter && (
                      <motion.a
                        href={author.social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        whileHover={{ y: -3, scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <svg
                          className="h-5 w-5 text-blue-400"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                      </motion.a>
                    )}
                    {author.social?.linkedin && (
                      <motion.a
                        href={author.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        whileHover={{ y: -3, scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <svg
                          className="h-5 w-5 text-blue-600"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </motion.a>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Related posts */}
              {relatedPosts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mt-12"
                >
                  <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {relatedPosts.map((relatedPost, index) => (
                      <motion.div
                        key={index}
                        whileHover={{
                          y: -5,
                          transition: {
                            type: "spring",
                            stiffness: 300,
                            damping: 10,
                          },
                        }}
                        className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col"
                      >
                        <Link
                          href={`/blog/${relatedPost.slug}`}
                          className="block h-36 relative"
                        >
                          <img
                            src={
                              relatedPost.coverImage ||
                              "/placeholder.svg?height=144&width=288"
                            }
                            alt={relatedPost.title}
                            className="w-full h-full object-cover"
                          />
                        </Link>
                        <div className="p-4 flex-1 flex flex-col">
                          <div className="flex-1">
                            <h4 className="font-bold mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm">
                              <Link href={`/blog/${relatedPost.slug}`}>
                                {relatedPost.title}
                              </Link>
                            </h4>
                            <p className="text-muted-foreground text-xs line-clamp-2 mb-3">
                              {relatedPost.excerpt}
                            </p>
                          </div>
                          <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>{relatedPost.date}</span>
                            </div>
                            <Link
                              href={`/blog/${relatedPost.slug}`}
                              className="text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center"
                            >
                              Read
                              <ChevronRight className="ml-1 h-3 w-3" />
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="hidden lg:block lg:col-span-1 xl:col-span-1 xl:max-w-sm">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Table of Contents</h2>
              <TableOfContents />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
