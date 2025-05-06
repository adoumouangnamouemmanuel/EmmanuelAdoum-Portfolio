"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { blogPosts } from "@/data/blog";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  ChevronRight,
  Clock,
  Eye,
  Tag,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

export default function BlogSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -30]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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

  return (
    <section id="blog" className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"
          style={{ y: y1 }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 8,
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"
          style={{ y: y2 }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 10,
            delay: 1,
          }}
        />
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
            My Blog
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Latest <span className="gradient-text">Articles</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Thoughts, tutorials, and insights about web development, design, and
            technology.
          </motion.p>
        </div>

        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {blogPosts.slice(0, 3).map((post, index) => (
            <motion.article
              key={index}
              variants={itemVariants}
              whileHover={{
                y: -10,
                transition: { type: "spring", stiffness: 300, damping: 10 },
              }}
              onHoverStart={() => setHoveredCard(index)}
              onHoverEnd={() => setHoveredCard(null)}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-gray-100 dark:border-gray-700 group"
            >
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={
                      post.coverImage || "/placeholder.svg?height=400&width=600"
                    }
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h4 className="text-white font-medium">Read Article</h4>
                    </div>
                  </div>
                </div>
              </Link>

              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.categories.map((category, catIndex) => (
                    <motion.div
                      key={catIndex}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + catIndex * 0.05 }}
                      whileHover={{ y: -2, scale: 1.05 }}
                    >
                      <Badge
                        variant="secondary"
                        className="shadow-sm flex items-center gap-1"
                      >
                        <Tag className="h-3 w-3" />
                        {category}
                      </Badge>
                    </motion.div>
                  ))}
                </div>

                <Link href={`/blog/${post.slug}`} className="block group">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {post.title}
                  </h3>
                </Link>

                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <div className="flex items-center mr-4">
                      <Calendar className="h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
                      <span>{post.readTime} min read</span>
                    </div>
                  </div>

                  <motion.div
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center"
                    >
                      Read more
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </motion.div>
                </div>

                {/* Author and views */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full overflow-hidden mr-2 bg-gray-200 dark:bg-gray-700">
                      <Image
                        src="/placeholder.svg?height=32&width=32"
                        alt="Author"
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Emmanuel Adoum
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Eye className="h-4 w-4 mr-1" />
                    <span>305 views</span> {/* Replace with a static value */}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        <div className="text-center mt-12">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all group"
              asChild
            >
              <Link href="/blog">
                View All Articles{" "}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
