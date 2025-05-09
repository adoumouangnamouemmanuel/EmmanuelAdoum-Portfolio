"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface TOCItem {
  id: string
  text: string
  level: number
  element: HTMLElement
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    // Find all heading elements in the blog content
    const articleElement = document.querySelector(".blog-content")
    if (!articleElement) return

    const elements = Array.from(articleElement.querySelectorAll("h1, h2, h3, h4, h5, h6"))

    // Process the headings
    const items: TOCItem[] = elements.map((element) => {
      // Add IDs to headings if they don't have one
      if (!element.id) {
        element.id =
          element.textContent
            ?.toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            ?.replace(/(^-|-$)/g, "") || `heading-${Math.random().toString(36).substr(2, 9)}`
      }

      return {
        id: element.id,
        text: element.textContent || "",
        level: Number.parseInt(element.tagName.substring(1), 10),
        element: element as HTMLElement,
      }
    })

    setHeadings(items)

    // Set up intersection observer for active heading detection
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: "0px 0px -80% 0px",
        threshold: 1.0,
      },
    )

    elements.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [])

  const handleClick = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      // Smooth scroll to the heading
      element.scrollIntoView({ behavior: "smooth" })
      setActiveId(id)
    }
  }

  if (headings.length === 0) {
    return null
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg dark:text-white sticky top-24 w-[350px]">
      <nav>
        <ul className="space-y-2 text-sm">
          {headings.map((heading) => (
            <li key={heading.id} style={{ paddingLeft: `${(heading.level - 1) * 0.75}rem` }}>
              <a
                href={`#${heading.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  handleClick(heading.id)
                }}
                className={cn(
                  "block py-1 transition-colors",
                  activeId === heading.id
                    ? "text-blue-600 dark:text-blue-400 font-medium"
                    : "text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400",
                )}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
