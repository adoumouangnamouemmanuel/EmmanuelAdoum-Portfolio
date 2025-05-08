"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface LinkDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (linkUrl: string, linkText: string) => void
}

export const LinkDialog: React.FC<LinkDialogProps> = ({ open, onOpenChange, onSave }) => {
  const [linkUrl, setLinkUrl] = useState("")
  const [linkText, setLinkText] = useState("")

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      // Get selected text if any
      const selection = window.getSelection()
      if (selection && selection.toString()) {
        setLinkText(selection.toString())
      } else {
        setLinkText("")
      }
      setLinkUrl("")
    }
  }, [open])

  const handleSave = () => {
    onSave(linkUrl, linkText)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-violet-200 dark:border-violet-800 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-violet-700 to-indigo-700 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
            Add Link
          </DialogTitle>
          <DialogDescription>Enter the URL and text for your link</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="linkUrl" className="text-sm font-medium">
              Link URL
            </Label>
            <Input
              id="linkUrl"
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="border-violet-200 dark:border-violet-800 focus:ring-2 focus:ring-violet-500/50 dark:focus:ring-violet-500/30"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkText" className="text-sm font-medium">
              Link Text
            </Label>
            <Input
              id="linkText"
              placeholder="Click here"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              className="border-violet-200 dark:border-violet-800 focus:ring-2 focus:ring-violet-500/50 dark:focus:ring-violet-500/30"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-violet-200 dark:border-violet-800 hover:bg-violet-50 dark:hover:bg-violet-900/30"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!linkUrl || !linkText}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white border-0 shadow-md shadow-violet-500/20 hover:shadow-violet-500/30 transition-all duration-300"
          >
            Add Link
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
