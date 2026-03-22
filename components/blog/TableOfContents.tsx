"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface TOCItem {
  id: string;
  text: string;
  level: number;
  element: HTMLElement;
}

interface TableOfContentsProps {
  content: string;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

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
    // Find all heading elements in the blog content
    const articleElement = document.querySelector(".blog-content");
    if (!articleElement) return;

    const elements = Array.from(
      articleElement.querySelectorAll("h1, h2, h3, h4, h5, h6"),
    ) as HTMLElement[];

    const usedIds = new Map<string, number>();

    const items: TOCItem[] = elements
      .filter((element) => Boolean(element.textContent?.trim()))
      .map((element, index) => {
        const existingId = (element.id || "").trim();
        const baseId =
          existingId || slugifyHeading(element.textContent || "", index);
        const occurrence = usedIds.get(baseId) || 0;
        usedIds.set(baseId, occurrence + 1);

        const finalId = occurrence > 0 ? `${baseId}-${occurrence + 1}` : baseId;
        element.id = finalId;
        element.style.scrollMarginTop = "8rem";

        return {
          id: finalId,
          text: element.textContent || "",
          level: Number.parseInt(element.tagName.substring(1), 10),
          element,
        };
      });

    setHeadings(items);
    if (items.length > 0) {
      setActiveId(items[0].id);
    }

    // Set up intersection observer for active heading detection
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-120px 0px -65% 0px",
        threshold: 0.2,
      },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [content]);

  const handleClick = (heading: TOCItem) => {
    const targetElement =
      document.getElementById(heading.id) ||
      heading.element ||
      (document.querySelector(`[id="${heading.id}"]`) as HTMLElement | null);

    if (!targetElement) return;

    const fixedHeaderOffset = 112;
    const targetTop =
      targetElement.getBoundingClientRect().top +
      window.scrollY -
      fixedHeaderOffset;

    window.scrollTo({
      top: Math.max(targetTop, 0),
      behavior: "smooth",
    });
    setActiveId(heading.id);
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/70 backdrop-blur-md p-5 shadow-[0_12px_35px_-20px_rgba(30,41,59,0.45)] dark:text-white sticky top-24 w-full max-w-[350px] overflow-hidden">
      <nav>
        <ul className="space-y-2 text-sm">
          {headings.map((heading) => (
            <li
              key={heading.id}
              style={{ paddingLeft: `${(heading.level - 1) * 0.75}rem` }}
            >
              <button
                type="button"
                onClick={() => handleClick(heading)}
                className={cn(
                  "block w-full text-left py-1 transition-colors break-words",
                  activeId === heading.id
                    ? "text-blue-600 dark:text-blue-400 font-medium"
                    : "text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400",
                )}
              >
                {heading.text}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
