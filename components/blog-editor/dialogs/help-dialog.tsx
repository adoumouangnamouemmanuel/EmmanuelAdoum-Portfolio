"use client"

import type React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
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
  Sparkles,
} from "lucide-react"

interface HelpDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const HelpDialog: React.FC<HelpDialogProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-violet-200 dark:border-violet-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-violet-700 to-indigo-700 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent flex items-center">
            <Sparkles className="mr-2 h-5 w-5 text-violet-600 dark:text-violet-400" />
            Content Editor Help
          </DialogTitle>
          <DialogDescription>Learn how to use the rich content editor to create beautiful blog posts</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h3 className="font-medium text-violet-700 dark:text-violet-400">Basic Controls</h3>
            <ul className="space-y-1 text-sm">
              <li className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">Enter</kbd>
                <span>Create a new line within the current block</span>
              </li>
              <li className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">Ctrl+Enter</kbd>
                <span>Create a new block below the current one</span>
              </li>
              <li className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">Backspace</kbd>
                <span>Delete an empty block</span>
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-violet-700 dark:text-violet-400">Block Types</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <Heading1 className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                <span>Heading 1 - Main titles</span>
              </div>
              <div className="flex items-center gap-2">
                <Heading2 className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                <span>Heading 2 - Section titles</span>
              </div>
              <div className="flex items-center gap-2">
                <Heading3 className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                <span>Heading 3 - Subsection titles</span>
              </div>
              <div className="flex items-center gap-2">
                <ListIcon className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                <span>Bullet List - Unordered items</span>
              </div>
              <div className="flex items-center gap-2">
                <ListOrdered className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                <span>Numbered List - Ordered items</span>
              </div>
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                <span>Code Block - For code snippets</span>
              </div>
              <div className="flex items-center gap-2">
                <Quote className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                <span>Quote - For quotations</span>
              </div>
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                <span>Image - Add images with captions</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-violet-700 dark:text-violet-400">Text Formatting</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <Bold className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                <span>Bold - Highlight important text</span>
              </div>
              <div className="flex items-center gap-2">
                <Italic className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                <span>Italic - Emphasize text</span>
              </div>
              <div className="flex items-center gap-2">
                <Underline className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                <span>Underline - Underline text</span>
              </div>
              <div className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                <span>Link - Add hyperlinks</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-violet-700 dark:text-violet-400">Tips</h3>
            <ul className="space-y-1 text-sm list-disc pl-5">
              <li>Use the + button on the left of each block to add a new block</li>
              <li>Hover over a block to see the delete button</li>
              <li>Use the Preview tab to see how your post will look when published</li>
              <li>HTML is automatically generated from your structured content</li>
              <li>Images can have optional captions</li>
              <li>The editor automatically updates the preview as you type</li>
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white border-0 shadow-md shadow-violet-500/20 hover:shadow-violet-500/30 transition-all duration-300"
          >
            Got it!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
