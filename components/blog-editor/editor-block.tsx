"use client"

import type React from "react"

import { useRef, useEffect, useState, useCallback } from "react"
import { useEditor, type BlockType } from "./editor-context"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, X, Edit } from "lucide-react"
import { motion } from "framer-motion"

interface EditorBlockProps {
  block: {
    id: string
    type: BlockType
    content: string
    meta?: {
      src?: string
      alt?: string
      href?: string
      language?: string
    }
  }
  onEditImage: (blockId: string, src: string, alt: string) => void
}

export const EditorBlock: React.FC<EditorBlockProps> = ({ block, onEditImage }) => {
  const { activeBlockId, setActiveBlockId, updateBlockContent, addBlock, removeBlock } = useEditor()
  const contentRef = useRef<HTMLDivElement>(null)
  const [isActive, setIsActive] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [lastContent, setLastContent] = useState(block.content)

  // Sync content with contentEditable div
  useEffect(() => {
    if (contentRef.current && block.type !== "img" && block.content !== lastContent) {
      contentRef.current.innerHTML = block.content
      setLastContent(block.content)
    }
  }, [block.type, block.content, lastContent])

  // Set active state based on activeBlockId
  useEffect(() => {
    setIsActive(activeBlockId === block.id)
  }, [activeBlockId, block.id])

  // Handle key down in editor blocks with improved list handling
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl+Enter creates a new block
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault()
      addBlock(block.id)
    }
    // Enter in lists creates a new list item
    else if (e.key === "Enter" && !e.shiftKey && (block.type === "ul" || block.type === "ol")) {
      e.preventDefault()

      if (contentRef.current) {
        const selection = window.getSelection()
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0)
          const currentContent = contentRef.current.innerHTML

          // Get cursor position
          const cursorPosition = range.startOffset

          // Insert a new line at cursor position
          const newContent = currentContent + "\n• "
          updateBlockContent(block.id, newContent)

          // Set cursor after the new bullet point
          setTimeout(() => {
            if (contentRef.current) {
              const textNode = contentRef.current.lastChild
              if (textNode) {
                const newRange = document.createRange()
                newRange.setStart(textNode, textNode.textContent?.length || 0)
                newRange.collapse(true)

                selection.removeAllRanges()
                selection.addRange(newRange)
              }
            }
          }, 0)
        }
      }
    }
    // Backspace on empty block deletes it
    else if (e.key === "Backspace" && !block.content && block.type !== "img") {
      e.preventDefault()
      removeBlock(block.id)
    }
    // Tab navigation
    else if (e.key === "Tab") {
      e.preventDefault()
      // Handle tab navigation logic here
    }
  }

  // Handle content changes with debounce
  const handleContentChange = useCallback(() => {
    if (contentRef.current && contentRef.current.innerHTML !== block.content) {
      updateBlockContent(block.id, contentRef.current.innerHTML)
    }
  }, [block.id, block.content, updateBlockContent])

  // Auto-format lists as you type
  const handleInput = useCallback(() => {
    if (!contentRef.current) return

    const content = contentRef.current.innerHTML

    // Auto-format bullet lists
    if (block.type === "ul" && !content.includes("<li>")) {
      // If content starts with "- " or "• ", format as list item
      if (content.match(/^[-•*]\s/)) {
        const formattedContent = content.replace(/^[-•*]\s/, "")
        contentRef.current.innerHTML = formattedContent
        updateBlockContent(block.id, formattedContent)
      }
    }

    // Auto-format numbered lists
    if (block.type === "ol" && !content.includes("<li>")) {
      // If content starts with "1. " or similar, format as list item
      if (content.match(/^\d+\.\s/)) {
        const formattedContent = content.replace(/^\d+\.\s/, "")
        contentRef.current.innerHTML = formattedContent
        updateBlockContent(block.id, formattedContent)
      }
    }

    handleContentChange()
  }, [block.id, block.type, handleContentChange, updateBlockContent])

  // Get placeholder text based on block type
  const getPlaceholder = () => {
    switch (block.type) {
      case "h1":
        return "Heading 1"
      case "h2":
        return "Heading 2"
      case "h3":
        return "Heading 3"
      case "quote":
        return "Quote"
      case "code":
        return "Code block"
      case "ul":
        return "Bullet list (use Ctrl+Enter for new block)"
      case "ol":
        return "Numbered list (use Ctrl+Enter for new block)"
      default:
        return "Type '/' for commands or Ctrl+Enter for new block..."
    }
  }

  // Get class names based on block type
  const getBlockClassName = () => {
    switch (block.type) {
      case "h1":
        return "text-2xl font-bold"
      case "h2":
        return "text-xl font-bold"
      case "h3":
        return "text-lg font-bold"
      case "quote":
        return "pl-4 border-l-4 border-violet-300 dark:border-violet-600 italic text-gray-700 dark:text-gray-300"
      case "code":
        return "font-mono text-sm bg-gray-100 dark:bg-gray-800 p-3 rounded"
      case "ul":
        return "pl-6 list-disc"
      case "ol":
        return "pl-6 list-decimal"
      default:
        return ""
    }
  }

  // Render image block
  if (block.type === "img") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`group relative rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800 mb-4 ${
          isActive ? "ring-2 ring-violet-500/50 dark:ring-violet-500/30" : ""
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setActiveBlockId(block.id)}
      >
        <img
          src={block.meta?.src || "/placeholder.svg"}
          alt={block.meta?.alt || ""}
          className="w-full h-auto max-h-96 object-contain"
        />
        <input
          type="text"
          placeholder="Add caption (optional)"
          value={block.content}
          onChange={(e) => updateBlockContent(block.id, e.target.value)}
          className="w-full p-2 bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500/50 dark:focus:ring-violet-500/30"
          onClick={() => setActiveBlockId(block.id)}
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered || isActive ? 1 : 0 }}
          className="absolute top-2 right-2 flex space-x-1"
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full bg-black/20 hover:bg-black/30 text-white"
            onClick={() => {
              onEditImage(block.id, block.meta?.src || "", block.meta?.alt || "")
            }}
          >
            <Edit className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full bg-black/20 hover:bg-red-500/80 text-white"
            onClick={() => removeBlock(block.id)}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </motion.div>
      </motion.div>
    )
  }

  // Render regular block
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`group relative mb-3 ${isActive ? "z-10" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: isHovered || isActive ? 1 : 0,
          scale: isHovered || isActive ? 1 : 0.8,
          x: isHovered || isActive ? 0 : -5,
        }}
        className="absolute -left-10 top-1/2 -translate-y-1/2 transition-opacity"
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full hover:bg-violet-100 dark:hover:bg-violet-900/30"
            >
              <Plus className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem onClick={() => addBlock(block.id, "p")}>
              <span className="mr-2">📝</span> Paragraph
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => addBlock(block.id, "h1")}>
              <span className="mr-2">🔖</span> Heading 1
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => addBlock(block.id, "h2")}>
              <span className="mr-2">🔖</span> Heading 2
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => addBlock(block.id, "h3")}>
              <span className="mr-2">🔖</span> Heading 3
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => addBlock(block.id, "ul")}>
              <span className="mr-2">•</span> Bullet List
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => addBlock(block.id, "ol")}>
              <span className="mr-2">1.</span> Numbered List
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => addBlock(block.id, "code")}>
              <span className="mr-2">{"</>"}</span> Code Block
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => addBlock(block.id, "quote")}>
              <span className="mr-2">❝</span> Quote
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>

      <div
        className={`relative ${
          isActive
            ? "ring-2 ring-violet-500/20 dark:ring-violet-500/10 rounded"
            : "hover:ring-1 hover:ring-violet-500/10 dark:hover:ring-violet-500/5 rounded"
        }`}
      >
        <div
          ref={contentRef}
          id={`block-${block.id}`}
          contentEditable
          className={`outline-none w-full p-2 min-h-[2rem] ${getBlockClassName()}`}
          onInput={handleInput}
          onFocus={() => setActiveBlockId(block.id)}
          onKeyDown={handleKeyDown}
          data-placeholder={getPlaceholder()}
          spellCheck={true}
          dangerouslySetInnerHTML={{ __html: block.content }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: isHovered || isActive ? 1 : 0,
            scale: isHovered || isActive ? 1 : 0.8,
          }}
          className="absolute top-1/2 right-2 -translate-y-1/2 transition-opacity"
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400"
            onClick={() => removeBlock(block.id)}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}
