"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { useEditor, type BlockType } from "./editor-context"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  Heading3,
  ListIcon,
  ListOrdered,
  Code,
  Quote,
  ImageIcon,
  LinkIcon,
  Highlighter,
  Palette,
} from "lucide-react"
import { motion } from "framer-motion"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface ToolbarProps {
  onImageAdd: () => void
  onLinkAdd: () => void
}

// Color palette for text coloring
const colorPalette = [
  { name: "Default", value: "inherit" },
  { name: "Red", value: "#ef4444" },
  { name: "Orange", value: "#f97316" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Yellow", value: "#eab308" },
  { name: "Lime", value: "#84cc16" },
  { name: "Green", value: "#22c55e" },
  { name: "Emerald", value: "#10b981" },
  { name: "Teal", value: "#14b8a6" },
  { name: "Cyan", value: "#06b6d4" },
  { name: "Sky", value: "#0ea5e9" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Indigo", value: "#6366f1" },
  { name: "Violet", value: "#8b5cf6" },
  { name: "Purple", value: "#a855f7" },
  { name: "Fuchsia", value: "#d946ef" },
  { name: "Pink", value: "#ec4899" },
  { name: "Rose", value: "#f43f5e" },
]

// Highlight colors
const highlightColors = [
  { name: "Yellow", value: "#fef9c3" },
  { name: "Green", value: "#dcfce7" },
  { name: "Blue", value: "#dbeafe" },
  { name: "Purple", value: "#f3e8ff" },
  { name: "Pink", value: "#fce7f3" },
]

export const Toolbar: React.FC<ToolbarProps> = ({ onImageAdd, onLinkAdd }) => {
  const { blocks, activeBlockId, changeBlockType, formatText, getActiveFormats } = useEditor()
  const [activeBlock, setActiveBlock] = useState<BlockType>("p")
  const [formatState, setFormatState] = useState({
    bold: false,
    italic: false,
    underline: false,
    highlight: false,
    color: null as string | null,
  })

  // Track selection changes to update format state
  useEffect(() => {
    const handleSelectionChange = () => {
      const formats = getActiveFormats()
      setFormatState({
        bold: formats.bold,
        italic: formats.italic,
        underline: formats.underline,
        highlight: formats.highlight,
        color: formats.color,
      })
    }

    document.addEventListener("selectionchange", handleSelectionChange)
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange)
    }
  }, [getActiveFormats])

  // Update active block type when active block changes
  useEffect(() => {
    const currentBlock = blocks.find((block) => block.id === activeBlockId)
    if (currentBlock) {
      setActiveBlock(currentBlock.type)

      // Check for formatting in the content
      const content = currentBlock.content
      setFormatState((prev) => ({
        ...prev,
        bold: /<strong>.*?<\/strong>/i.test(content),
        italic: /<em>.*?<\/em>/i.test(content),
        underline: /<u>.*?<\/u>/i.test(content),
        highlight: /<mark>.*?<\/mark>/i.test(content),
      }))
    }
  }, [blocks, activeBlockId])

  // Memoize toolbar buttons to prevent unnecessary re-renders
  const blockTypeButtons = useMemo(
    () => (
      <>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={`h-8 w-8 rounded-md transition-colors ${
                  activeBlock === "h1"
                    ? "bg-violet-200 dark:bg-violet-800 text-violet-800 dark:text-violet-200"
                    : "hover:bg-violet-100 dark:hover:bg-violet-800/40 text-violet-600 dark:text-violet-400"
                }`}
                onClick={() => changeBlockType(activeBlockId, "h1")}
              >
                <Heading1 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Heading 1</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={`h-8 w-8 rounded-md transition-colors ${
                  activeBlock === "h2"
                    ? "bg-violet-200 dark:bg-violet-800 text-violet-800 dark:text-violet-200"
                    : "hover:bg-violet-100 dark:hover:bg-violet-800/40 text-violet-600 dark:text-violet-400"
                }`}
                onClick={() => changeBlockType(activeBlockId, "h2")}
              >
                <Heading2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Heading 2</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={`h-8 w-8 rounded-md transition-colors ${
                  activeBlock === "h3"
                    ? "bg-violet-200 dark:bg-violet-800 text-violet-800 dark:text-violet-200"
                    : "hover:bg-violet-100 dark:hover:bg-violet-800/40 text-violet-600 dark:text-violet-400"
                }`}
                onClick={() => changeBlockType(activeBlockId, "h3")}
              >
                <Heading3 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Heading 3</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </>
    ),
    [activeBlock, activeBlockId, changeBlockType],
  )

  const listButtons = useMemo(
    () => (
      <>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={`h-8 w-8 rounded-md transition-colors ${
                  activeBlock === "ul"
                    ? "bg-violet-200 dark:bg-violet-800 text-violet-800 dark:text-violet-200"
                    : "hover:bg-violet-100 dark:hover:bg-violet-800/40 text-violet-600 dark:text-violet-400"
                }`}
                onClick={() => changeBlockType(activeBlockId, "ul")}
              >
                <ListIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Bullet List</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={`h-8 w-8 rounded-md transition-colors ${
                  activeBlock === "ol"
                    ? "bg-violet-200 dark:bg-violet-800 text-violet-800 dark:text-violet-200"
                    : "hover:bg-violet-100 dark:hover:bg-violet-800/40 text-violet-600 dark:text-violet-400"
                }`}
                onClick={() => changeBlockType(activeBlockId, "ol")}
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Numbered List</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </>
    ),
    [activeBlock, activeBlockId, changeBlockType],
  )

  const blockStyleButtons = useMemo(
    () => (
      <>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={`h-8 w-8 rounded-md transition-colors ${
                  activeBlock === "code"
                    ? "bg-violet-200 dark:bg-violet-800 text-violet-800 dark:text-violet-200"
                    : "hover:bg-violet-100 dark:hover:bg-violet-800/40 text-violet-600 dark:text-violet-400"
                }`}
                onClick={() => changeBlockType(activeBlockId, "code")}
              >
                <Code className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Code Block</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={`h-8 w-8 rounded-md transition-colors ${
                  activeBlock === "quote"
                    ? "bg-violet-200 dark:bg-violet-800 text-violet-800 dark:text-violet-200"
                    : "hover:bg-violet-100 dark:hover:bg-violet-800/40 text-violet-600 dark:text-violet-400"
                }`}
                onClick={() => changeBlockType(activeBlockId, "quote")}
              >
                <Quote className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Quote</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </>
    ),
    [activeBlock, activeBlockId, changeBlockType],
  )

  const textFormatButtons = useMemo(
    () => (
      <>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={`h-8 w-8 rounded-md transition-colors ${
                  formatState.bold
                    ? "bg-violet-200 dark:bg-violet-800 text-violet-800 dark:text-violet-200"
                    : "hover:bg-violet-100 dark:hover:bg-violet-800/40 text-violet-600 dark:text-violet-400"
                }`}
                onClick={() => formatText("bold")}
              >
                <Bold className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Bold</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={`h-8 w-8 rounded-md transition-colors ${
                  formatState.italic
                    ? "bg-violet-200 dark:bg-violet-800 text-violet-800 dark:text-violet-200"
                    : "hover:bg-violet-100 dark:hover:bg-violet-800/40 text-violet-600 dark:text-violet-400"
                }`}
                onClick={() => formatText("italic")}
              >
                <Italic className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Italic</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={`h-8 w-8 rounded-md transition-colors ${
                  formatState.underline
                    ? "bg-violet-200 dark:bg-violet-800 text-violet-800 dark:text-violet-200"
                    : "hover:bg-violet-100 dark:hover:bg-violet-800/40 text-violet-600 dark:text-violet-400"
                }`}
                onClick={() => formatText("underline")}
              >
                <Underline className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Underline</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Highlight button */}
        <Popover>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 rounded-md transition-colors ${
                      formatState.highlight
                        ? "bg-violet-200 dark:bg-violet-800 text-violet-800 dark:text-violet-200"
                        : "hover:bg-violet-100 dark:hover:bg-violet-800/40 text-violet-600 dark:text-violet-400"
                    }`}
                  >
                    <Highlighter className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Highlight</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <PopoverContent className="w-64 p-2">
            <div className="grid grid-cols-5 gap-1">
              {highlightColors.map((color) => (
                <Button
                  key={color.value}
                  type="button"
                  variant="ghost"
                  className="h-8 w-8 rounded-md p-0"
                  style={{ backgroundColor: color.value }}
                  onClick={() => formatText("highlight")}
                  title={color.name}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Text color button */}
        <Popover>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 rounded-md transition-colors hover:bg-violet-100 dark:hover:bg-violet-800/40 text-violet-600 dark:text-violet-400`}
                    style={{ color: formatState.color || undefined }}
                  >
                    <Palette className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Text Color</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <PopoverContent className="w-64 p-2">
            <div className="grid grid-cols-6 gap-1">
              {colorPalette.map((color) => (
                <Button
                  key={color.value}
                  type="button"
                  variant="ghost"
                  className="h-8 w-8 rounded-md p-0"
                  style={{ backgroundColor: color.value === "inherit" ? "transparent" : color.value }}
                  onClick={() => formatText("color", color.value)}
                  title={color.name}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </>
    ),
    [formatState, formatText],
  )

  const mediaButtons = useMemo(
    () => (
      <>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-md hover:bg-violet-100 dark:hover:bg-violet-800/40 text-violet-600 dark:text-violet-400 transition-colors"
                onClick={onImageAdd}
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Add Image</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-md hover:bg-violet-100 dark:hover:bg-violet-800/40 text-violet-600 dark:text-violet-400 transition-colors"
                onClick={onLinkAdd}
              >
                <LinkIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Add Link</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </>
    ),
    [onImageAdd, onLinkAdd],
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-wrap items-center gap-1 bg-violet-50 dark:bg-violet-900/20 rounded-md p-1.5 shadow-sm border border-violet-100 dark:border-violet-800/50"
    >
      {/* Block type buttons */}
      {blockTypeButtons}

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Text formatting buttons */}
      {textFormatButtons}

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* List buttons */}
      {listButtons}

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Block style buttons */}
      {blockStyleButtons}

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Media buttons */}
      {mediaButtons}
    </motion.div>
  )
}