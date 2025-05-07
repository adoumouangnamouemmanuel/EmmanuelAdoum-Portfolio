"use client"

import { motion } from "framer-motion"
import { useEffect, useRef } from "react"

interface BlogContentProps {
  content: string
}

export default function BlogContent({ content }: BlogContentProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Process headings to add IDs if they don't have them
    if (contentRef.current) {
      const headings = contentRef.current.querySelectorAll("h1, h2, h3, h4, h5, h6")

      headings.forEach((heading) => {
        if (!heading.id) {
          const id =
            heading.textContent
              ?.toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              ?.replace(/(^-|-$)/g, "") || `heading-${Math.random().toString(36).substr(2, 9)}`

          heading.id = id
        }
        // Add scroll margin to account for fixed header
        heading.style.scrollMarginTop = "6rem"
      })
    }
  }, [content])

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 md:p-8 shadow-lg prose dark:prose-invert prose-blue max-w-none"
    >
      <div ref={contentRef} className="blog-content" dangerouslySetInnerHTML={{ __html: content }} />
    </motion.article>
  )
}
