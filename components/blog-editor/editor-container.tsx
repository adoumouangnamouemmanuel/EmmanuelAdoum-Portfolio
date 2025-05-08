"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { useEditor } from "./editor-context"
import { Toolbar } from "./toolbar"
import { EditorBlock } from "./editor-block"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface EditorContainerProps {
  onImageAdd: () => void
  onLinkAdd: () => void
  onEditImage: (blockId: string, src: string, alt: string) => void
}

export const EditorContainer: React.FC<EditorContainerProps> = ({ onImageAdd, onLinkAdd, onEditImage }) => {
  const { blocks, addBlock, setPreview } = useEditor()
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollPosition, setScrollPosition] = useState(0)

  // Track scroll position for animations
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        setScrollPosition(containerRef.current.scrollTop)
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll)
      return () => container.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Auto-update preview when blocks change - with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setPreview(true)
      // Switch back to editor after a brief moment
      setTimeout(() => setPreview(false), 100)
    }, 1000)

    return () => clearTimeout(timer)
  }, [blocks, setPreview])

  // Memoize the add block handler
  const handleAddBlock = useCallback(() => {
    if (blocks.length > 0) {
      addBlock(blocks[blocks.length - 1].id)
    }
  }, [blocks, addBlock])

  return (
    <div className="space-y-4">
      <Toolbar onImageAdd={onImageAdd} onLinkAdd={onLinkAdd} />

      <div
        ref={containerRef}
        className="min-h-[300px] max-h-[600px] overflow-y-auto border rounded-lg p-4 bg-white dark:bg-gray-900 border-violet-200 dark:border-violet-800 focus-within:ring-2 focus-within:ring-violet-500/50 dark:focus-within:ring-violet-500/30 transition-all duration-300 relative"
      >
        <AnimatePresence initial={false}>
          {blocks.map((block) => (
            <EditorBlock key={block.id} block={block} onEditImage={onEditImage} />
          ))}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <Button
            type="button"
            variant="ghost"
            className="w-full mt-4 border border-dashed border-gray-300 dark:border-gray-600 hover:border-violet-400 dark:hover:border-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 text-muted-foreground hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
            onClick={handleAddBlock}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add block
          </Button>
        </motion.div>
      </div>

      <div className="text-sm text-muted-foreground flex items-center justify-between">
        <span>
          Press <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">Ctrl+Enter</kbd> to add a new
          block, <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">Backspace</kbd> to delete empty
          blocks
        </span>
      </div>
    </div>
  )
}
