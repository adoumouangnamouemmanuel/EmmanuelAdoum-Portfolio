"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { blogPosts } from "@/data/blog";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Bookmark,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  Copy,
  Facebook,
  Linkedin,
  MessageSquare,
  Tag,
  ThumbsUp,
  Twitter,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [post, setPost] = useState(
    blogPosts.find((post) => post.slug === slug)
  );
  const [relatedPosts, setRelatedPosts] = useState<typeof blogPosts>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // If post doesn't exist, redirect to blog page
    if (!post) {
      router.push("/blog");
      return;
    }

    // Find related posts with similar categories
    const related = blogPosts
      .filter(
        (p) =>
          p.slug !== slug &&
          p.categories.some((cat) => post.categories.includes(cat))
      )
      .slice(0, 3);

    setRelatedPosts(related);
  }, [post, router, slug]);

  if (!post) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen">
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
                className="shadow-md group"
                asChild
              >
                <Link href="/blog">
                  <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                  Back to Blog
                </Link>
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap gap-2 mb-4 justify-center"
          >
            {post.categories.map((category, index) => (
              <Badge key={index} variant="secondary" className="shadow-sm">
                <Tag className="h-3 w-3 mr-1" />
                {category}
              </Badge>
            ))}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold mb-6 text-center"
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
            className="relative rounded-xl overflow-hidden shadow-xl mb-8 aspect-video"
          >
            <Image
              src={post.coverImage || "/placeholder.svg?height=600&width=1200"}
              alt={post.title}
              fill
              className="object-cover"
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
                <Image
                  src="/placeholder.svg?height=40&width=40"
                  alt="Author"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <div>
                <div className="font-medium">Emmanuel Adoum</div>
                <div className="text-xs text-muted-foreground">
                  Web Developer
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800/40 transition-colors"
                onClick={() => copyToClipboard()}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </motion.button>
              <motion.a
                href={`https://x.com/AdoumOuangnamou/intent/tweet?url=${encodeURIComponent(
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

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main content */}
            <div className="lg:col-span-3">
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 md:p-8 shadow-lg prose dark:prose-invert prose-blue max-w-none"
              >
                <p className="lead">{post.excerpt}</p>

                <h2>Introduction</h2>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl,
                  eu aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel
                  ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl
                  nisl sit amet nisl.
                </p>

                <p>
                  Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam
                  nisl, eu aliquam nisl nisl sit amet nisl. Sed euismod, nisl
                  vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl
                  nisl sit amet nisl.
                </p>

                <h2>Main Content</h2>
                <p>
                  Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam
                  nisl, eu aliquam nisl nisl sit amet nisl. Sed euismod, nisl
                  vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl
                  nisl sit amet nisl.
                </p>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg my-6 border-l-4 border-blue-500">
                  <p className="m-0 text-sm">
                    <strong>Pro tip:</strong> Sed euismod, nisl vel ultricies
                    lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit
                    amet nisl.
                  </p>
                </div>

                <h3>Subsection</h3>
                <p>
                  Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam
                  nisl, eu aliquam nisl nisl sit amet nisl. Sed euismod, nisl
                  vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl
                  nisl sit amet nisl.
                </p>

                <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto">
                  <code>
                    {`function example() {
  console.log("Hello, world!");
  return true;
}`}
                  </code>
                </pre>

                <h2>Conclusion</h2>
                <p>
                  Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam
                  nisl, eu aliquam nisl nisl sit amet nisl. Sed euismod, nisl
                  vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl
                  nisl sit amet nisl.
                </p>

                <div className="flex items-center justify-between mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="flex items-center space-x-1 text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <ThumbsUp className="h-5 w-5" />
                      <span>42 Likes</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="flex items-center space-x-1 text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <MessageSquare className="h-5 w-5" />
                      <span>12 Comments</span>
                    </motion.button>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex items-center space-x-1 text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <Bookmark className="h-5 w-5" />
                    <span>Save</span>
                  </motion.button>
                </div>
              </motion.article>

              {/* Author bio */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mt-8 flex flex-col md:flex-row items-center md:items-start gap-6"
              >
                <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 bg-gray-200 dark:bg-gray-700">
                  <Image
                    src="/placeholder.svg?height=80&width=80"
                    alt="Author"
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Emmanuel Adoum</h3>
                  <p className="text-muted-foreground mb-4">
                    Web developer with over 5 years of experience specializing
                    in frontend technologies. Passionate about creating
                    beautiful and functional user experiences.
                  </p>
                  <div className="flex space-x-3">
                    <motion.a
                      href="https://github.com"
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
                    <motion.a
                      href="https://x.com/AdoumOuangnamou"
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
                    <motion.a
                      href="https://www.linkedin.com/in/ouang-namou-emmanuel-adoum"
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
                          <Image
                            src={
                              relatedPost.coverImage ||
                              "/placeholder.svg?height=144&width=288"
                            }
                            alt={relatedPost.title}
                            fill
                            className="object-cover"
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
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg sticky top-24"
              >
                <h3 className="text-lg font-semibold mb-4">
                  Table of Contents
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a
                      href="#introduction"
                      className="text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      Introduction
                    </a>
                  </li>
                  <li>
                    <a
                      href="#main-content"
                      className="text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      Main Content
                    </a>
                    <ul className="pl-4 mt-2 space-y-2">
                      <li>
                        <a
                          href="#subsection"
                          className="text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          Subsection
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <a
                      href="#conclusion"
                      className="text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      Conclusion
                    </a>
                  </li>
                </ul>

                <div className="border-t border-gray-200 dark:border-gray-700 my-6 pt-6">
                  <h3 className="text-lg font-semibold mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.categories.map((category, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="shadow-sm"
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 my-6 pt-6">
                  <h3 className="text-lg font-semibold mb-4">Share</h3>
                  <div className="flex space-x-2">
                    <motion.a
                      href={`https://x.com/AdoumOuangnamou/intent/tweet?url=${encodeURIComponent(
                        typeof window !== "undefined"
                          ? window.location.href
                          : ""
                      )}&text=${encodeURIComponent(post.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ y: -3, scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800/40 transition-colors"
                    >
                      <Twitter className="h-5 w-5" />
                    </motion.a>
                    <motion.a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                        typeof window !== "undefined"
                          ? window.location.href
                          : ""
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ y: -3, scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 hover:bg-blue-200 dark:hover:bg-blue-800/40 transition-colors"
                    >
                      <Facebook className="h-5 w-5" />
                    </motion.a>
                    <motion.a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                        typeof window !== "undefined"
                          ? window.location.href
                          : ""
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ y: -3, scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 hover:bg-blue-200 dark:hover:bg-blue-800/40 transition-colors"
                    >
                      <Linkedin className="h-5 w-5" />
                    </motion.a>
                    <motion.button
                      whileHover={{ y: -3, scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800/40 transition-colors"
                      onClick={() => copyToClipboard()}
                    >
                      {copied ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <Copy className="h-5 w-5" />
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
