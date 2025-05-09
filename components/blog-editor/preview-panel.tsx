"use client"

import type React from "react"

import { useEditor } from "./editor-context"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface PreviewPanelProps {
  title: string
  excerpt: string
  coverImage: string
  categories: string[]
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ title, excerpt, coverImage, categories }) => {
  const { blocks, convertToHtml, calculateReadTime } = useEditor()
  const [htmlContent, setHtmlContent] = useState("")

  // Memoize HTML conversion to prevent unnecessary re-renders
  useEffect(() => {
    setHtmlContent(convertToHtml(blocks))
  }, [blocks, convertToHtml])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="prose dark:prose-invert max-w-none"
    >
      <div className="relative rounded-xl overflow-hidden shadow-xl mb-8 aspect-video">
        <img
          src={coverImage || "/images/posts/blog.avif"}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {categories.length > 0 ? (
          categories.map((cat, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="shadow-sm bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 border-0"
            >
              {cat}
            </Badge>
          ))
        ) : (
          <Badge
            variant="secondary"
            className="shadow-sm bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 border-0"
          >
            Uncategorized
          </Badge>
        )}
      </div>

      <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-violet-700 to-indigo-700 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
        {title || "Your Blog Post Title"}
      </h1>

      <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-8">
        <div className="flex items-center">
          <span>
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
        <div className="flex items-center">
          <span>{calculateReadTime(blocks)} min read</span>
        </div>
      </div>

      <div className="mb-8">
        <p className="text-lg text-muted-foreground italic">{excerpt || "Your blog post excerpt will appear here."}</p>
      </div>

      <div
        className="blog-content"
        dangerouslySetInnerHTML={{
          __html: htmlContent || "<p>Your blog post content will appear here.</p>",
        }}
      />
    </motion.div>
  )
}
