"use client"

import type React from "react"
import { createContext, useCallback, useContext, useMemo, useState } from "react"

// Define editor block types
export type BlockType = "h1" | "h2" | "h3" | "p" | "ul" | "ol" | "code" | "quote" | "img"

// Update the EditorBlock interface to include formatting metadata
export interface EditorBlock {
  id: string
  type: BlockType
  content: string
  meta?: {
    src?: string
    alt?: string
    href?: string
    language?: string
    formats?: {
      bold?: boolean
      italic?: boolean
      underline?: boolean
      highlight?: boolean
      color?: string
    }
  }
}

// Update the EditorContextType to include new formatting options
interface EditorContextType {
  blocks: EditorBlock[]
  setBlocks: React.Dispatch<React.SetStateAction<EditorBlock[]>>
  activeBlockId: string
  setActiveBlockId: React.Dispatch<React.SetStateAction<string>>
  addBlock: (currentBlockId: string, type?: BlockType) => void
  removeBlock: (blockId: string) => void
  updateBlockContent: (blockId: string, content: string) => void
  changeBlockType: (blockId: string, newType: BlockType) => void
  convertToHtml: (blocks: EditorBlock[]) => string
  calculateReadTime: (blocks: EditorBlock[]) => number
  preview: boolean
  setPreview: React.Dispatch<React.SetStateAction<boolean>>
  formatText: (format: "bold" | "italic" | "underline" | "highlight" | "color", color?: string) => void
  getActiveFormats: () => {
    bold: boolean
    italic: boolean
    underline: boolean
    highlight: boolean
    color: string | null
  }
}

const EditorContext = createContext<EditorContextType | undefined>(undefined)

export const useEditor = () => {
  const context = useContext(EditorContext)
  if (context === undefined) {
    throw new Error("useEditor must be used within an EditorProvider")
  }
  return context
}

// Modify the EditorProvider to include the new formatting functions
export const EditorProvider = ({
  children,
}: { children: React.ReactNode | ((context: EditorContextType) => React.ReactNode) }) => {
  const [blocks, setBlocks] = useState<EditorBlock[]>([{ id: "1", type: "p", content: "" }])
  const [activeBlockId, setActiveBlockId] = useState("1")
  const [preview, setPreview] = useState(false)

  // Memoize functions to prevent unnecessary re-renders
  const addBlock = useCallback(
    (currentBlockId: string, type: BlockType = "p") => {
      const currentIndex = blocks.findIndex((block) => block.id === currentBlockId)
      if (currentIndex === -1) return

      const newBlock: EditorBlock = {
        id: Date.now().toString(),
        type,
        content: "",
      }

      setBlocks((prevBlocks) => {
        const newBlocks = [...prevBlocks]
        newBlocks.splice(currentIndex + 1, 0, newBlock)
        return newBlocks
      })

      setActiveBlockId(newBlock.id)

      // Focus the new block after render
      setTimeout(() => {
        const newBlockElement = document.getElementById(`block-${newBlock.id}`)
        if (newBlockElement) {
          newBlockElement.focus()
        }
      }, 0)
    },
    [blocks],
  )

  // Remove a block
  const removeBlock = useCallback(
    (blockId: string) => {
      if (blocks.length <= 1) return // Don't remove the last block

      const currentIndex = blocks.findIndex((block) => block.id === blockId)
      if (currentIndex === -1) return

      setBlocks((prevBlocks) => {
        const newBlocks = prevBlocks.filter((block) => block.id !== blockId)

        // Set active block to the previous one or the next one if it was the first
        const newActiveIndex = Math.max(0, currentIndex - 1)
        setTimeout(() => {
          setActiveBlockId(newBlocks[newActiveIndex].id)

          // Focus the new active block
          const newActiveElement = document.getElementById(`block-${newBlocks[newActiveIndex].id}`)
          if (newActiveElement) {
            newActiveElement.focus()
          }
        }, 0)

        return newBlocks
      })
    },
    [blocks],
  )

  // Update block content with optimized implementation
  const updateBlockContent = useCallback((blockId: string, content: string) => {
    setBlocks((prevBlocks) => prevBlocks.map((block) => (block.id === blockId ? { ...block, content } : block)))
  }, [])

  // Change block type with optimized implementation
  const changeBlockType = useCallback((blockId: string, newType: BlockType) => {
    setBlocks((prevBlocks) => prevBlocks.map((block) => (block.id === blockId ? { ...block, type: newType } : block)))
  }, [])

  // Format text with enhanced options
  const formatText = useCallback(
    (format: "bold" | "italic" | "underline" | "highlight" | "color", color?: string) => {
      const activeBlock = blocks.find((block) => block.id === activeBlockId)
      if (!activeBlock) return

      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        const selectedText = range.toString()

        if (selectedText) {
          let formattedText = ""

          switch (format) {
            case "bold":
              formattedText = `<strong>${selectedText}</strong>`
              break
            case "italic":
              formattedText = `<em>${selectedText}</em>`
              break
            case "underline":
              formattedText = `<u>${selectedText}</u>`
              break
            case "highlight":
              formattedText = `<mark>${selectedText}</mark>`
              break
            case "color":
              formattedText = `<span style="color:${color || "#000"}">${selectedText}</span>`
              break
          }

          const blockElement = document.getElementById(`block-${activeBlockId}`)
          if (blockElement && blockElement.contains(range.startContainer)) {
            document.execCommand("insertHTML", false, formattedText)

            // Update the block content after formatting
            if (blockElement.innerHTML !== activeBlock.content) {
              updateBlockContent(activeBlockId, blockElement.innerHTML)
            }
          }
        }
      }
    },
    [activeBlockId, blocks, updateBlockContent],
  )

  // Get active formatting for the current selection
  const getActiveFormats = useCallback(() => {
    const formats = {
      bold: false,
      italic: false,
      underline: false,
      highlight: false,
      color: null as string | null,
    }

    if (document.queryCommandState) {
      formats.bold = document.queryCommandState("bold")
      formats.italic = document.queryCommandState("italic")
      formats.underline = document.queryCommandState("underline")
    }

    // Check for highlight and color
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      if (range.commonAncestorContainer.nodeType === Node.TEXT_NODE) {
        const parentElement = range.commonAncestorContainer.parentElement
        if (parentElement) {
          if (parentElement.tagName === "MARK") {
            formats.highlight = true
          }
          if (parentElement.style && parentElement.style.color) {
            formats.color = parentElement.style.color
          }
        }
      }
    }

    return formats
  }, [])

  // Improved HTML conversion with proper list handling
  const convertToHtml = useCallback((blocks: EditorBlock[]): string => {
    return blocks
      .map((block) => {
        switch (block.type) {
          case "h1":
            return `<h1>${block.content}</h1>`
          case "h2":
            return `<h2>${block.content}</h2>`
          case "h3":
            return `<h3>${block.content}</h3>`
          case "p":
            return `<p>${block.content}</p>`
          case "ul": {
            // Improved list handling
            const items = block.content.split("\n").filter((item) => item.trim())
            if (items.length === 0) return "<ul><li></li></ul>"

            const listItems = items.map((item) => `<li>${item.trim().replace(/^[-*•]\s*/, "")}</li>`).join("")
            return `<ul>${listItems}</ul>`
          }
          case "ol": {
            // Improved ordered list handling
            const items = block.content.split("\n").filter((item) => item.trim())
            if (items.length === 0) return "<ol><li></li></ol>"

            const listItems = items
              .map((item, index) => {
                // Remove leading numbers and dots if they exist
                return `<li>${item.trim().replace(/^\d+\.\s*/, "")}</li>`
              })
              .join("")

            return `<ol>${listItems}</ol>`
          }
          case "code":
            return `<pre><code class="language-${block.meta?.language || "javascript"}">${block.content}</code></pre>`
          case "quote":
            return `<blockquote>${block.content}</blockquote>`
          case "img":
            return `<figure><img src="${block.meta?.src}" alt="${
              block.meta?.alt || ""
            }" />${block.content ? `<figcaption>${block.content}</figcaption>` : ""}</figure>`
          default:
            return `<p>${block.content}</p>`
        }
      })
      .join("\n\n")
  }, [])

  // Calculate read time based on content length
  const calculateReadTime = useCallback((blocks: EditorBlock[]): number => {
    const wordsPerMinute = 200
    const text = blocks.map((block) => block.content).join(" ")
    const wordCount = text.split(/\s+/).length
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
  }, [])

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      blocks,
      setBlocks,
      activeBlockId,
      setActiveBlockId,
      addBlock,
      removeBlock,
      updateBlockContent,
      changeBlockType,
      convertToHtml,
      calculateReadTime,
      preview,
      setPreview,
      formatText,
      getActiveFormats,
    }),
    [
      blocks,
      activeBlockId,
      addBlock,
      removeBlock,
      updateBlockContent,
      changeBlockType,
      preview,
      formatText,
      getActiveFormats,
    ],
  )

  return (
    <EditorContext.Provider value={contextValue}>
      {typeof children === "function" ? children(contextValue) : children}
    </EditorContext.Provider>
  )
}