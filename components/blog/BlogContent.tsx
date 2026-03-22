"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

interface BlogContentProps {
  content: string;
}

export default function BlogContent({ content }: BlogContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  const slugifyHeading = (text: string, fallbackIndex: number) => {
    const slug = text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/(^-|-$)/g, "");

    return slug || `section-${fallbackIndex + 1}`;
  };

  useEffect(() => {
    // Process headings to add IDs if they don't have them
    if (contentRef.current) {
      const headings = contentRef.current.querySelectorAll(
        "h1, h2, h3, h4, h5, h6",
      );
      const usedIds = new Map<string, number>();

      headings.forEach((heading, index) => {
        const baseId = slugifyHeading(heading.textContent || "", index);
        const occurrence = usedIds.get(baseId) || 0;
        usedIds.set(baseId, occurrence + 1);

        heading.id = occurrence > 0 ? `${baseId}-${occurrence + 1}` : baseId;
        // Add scroll margin to account for fixed header
        (heading as HTMLElement).style.scrollMarginTop = "8rem";
      });
    }
  }, [content]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-3xl border border-slate-200/70 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/70 p-6 md:p-8 shadow-[0_12px_40px_-18px_rgba(30,41,59,0.35)] dark:shadow-[0_18px_45px_-22px_rgba(2,6,23,0.85)] prose dark:prose-invert prose-blue max-w-none overflow-hidden [&_pre]:overflow-x-auto [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto [&_img]:max-w-full [&_img]:h-auto"
    >
      <div
        ref={contentRef}
        className="blog-content scroll-smooth break-words"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </motion.article>
  );
}
