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

interface ImageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (imageUrl: string, imageAlt: string, blockId: string) => void
  blockId: string
  initialUrl: string
  initialAlt: string
}

export const ImageDialog: React.FC<ImageDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  blockId,
  initialUrl,
  initialAlt,
}) => {
  const [imageUrl, setImageUrl] = useState(initialUrl)
  const [imageAlt, setImageAlt] = useState(initialAlt)
  const [previewError, setPreviewError] = useState(false)

  // Reset state when dialog opens with new values
  useEffect(() => {
    if (open) {
      setImageUrl(initialUrl)
      setImageAlt(initialAlt)
      setPreviewError(false)
    }
  }, [open, initialUrl, initialAlt])

  const handleSave = () => {
    onSave(imageUrl, imageAlt, blockId)
    onOpenChange(false)
  }

  const handleImageError = () => {
    setPreviewError(true)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-violet-200 dark:border-violet-800 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-violet-700 to-indigo-700 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
            {blockId ? "Edit Image" : "Add Image"}
          </DialogTitle>
          <DialogDescription>Enter the URL and alt text for your image</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="imageUrl" className="text-sm font-medium">
              Image URL
            </Label>
            <Input
              id="imageUrl"
              placeholder="/images/posts/blog.avif"
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value)
                setPreviewError(false)
              }}
              className="border-violet-200 dark:border-violet-800 focus:ring-2 focus:ring-violet-500/50 dark:focus:ring-violet-500/30"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="imageAlt" className="text-sm font-medium">
              Alt Text
            </Label>
            <Input
              id="imageAlt"
              placeholder="Descriptive text for the image"
              value={imageAlt}
              onChange={(e) => setImageAlt(e.target.value)}
              className="border-violet-200 dark:border-violet-800 focus:ring-2 focus:ring-violet-500/50 dark:focus:ring-violet-500/30"
            />
            <p className="text-xs text-muted-foreground">Alt text helps with accessibility and SEO</p>
          </div>
          {imageUrl && (
            <div className="mt-2 relative rounded-md overflow-hidden h-40 bg-gray-100 dark:bg-gray-700">
              {previewError ? (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                  Unable to load image preview
                </div>
              ) : (
                <img
                  src={imageUrl || "/placeholder.svg"}
                  alt={imageAlt || "Preview"}
                  className="w-full h-full object-contain"
                  onError={handleImageError}
                />
              )}
            </div>
          )}
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
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white border-0 shadow-md shadow-violet-500/20 hover:shadow-violet-500/30 transition-all duration-300"
          >
            {blockId ? "Update" : "Add"} Image
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
