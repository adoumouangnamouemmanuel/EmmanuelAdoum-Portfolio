"use client"

import type React from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { AnimatePresence, motion } from "framer-motion"
import { Edit, MoreVertical, Reply, Send, Trash2 } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useEffect, useState } from "react"

type Comment = {
  id: string
  content: string
  createdAt: string
  author: {
    id: string
    name: string
    image: string | null
  }
  replies: Comment[]
}

export default function CommentSection({ postSlug }: { postSlug: string }) {
  const { data: session } = useSession()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingComments, setIsLoadingComments] = useState(true)
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null)
  const [editingReply, setEditingReply] = useState<string | null>(null)
  const [editReplyContent, setEditReplyContent] = useState("")
  const [replyToDelete, setReplyToDelete] = useState<string | null>(null)

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsLoadingComments(true)
        const response = await fetch(`/api/posts/${postSlug}/comments`)

        if (response.ok) {
          const data = await response.json()
          setComments(data)
        } else {
          console.error("Failed to fetch comments")
          // Set empty comments array as fallback
          setComments([])
        }
      } catch (error) {
        console.error("Error fetching comments:", error)
        // Set empty comments array as fallback
        setComments([])
      } finally {
        setIsLoadingComments(false)
      }
    }

    fetchComments()
  }, [postSlug])

  // Submit a new comment
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to comment",
        variant: "destructive",
      })
      return
    }

    if (!newComment.trim()) {
      toast({
        title: "Empty comment",
        description: "Please enter a comment",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/posts/${postSlug}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newComment }),
      })

      if (response.ok) {
        const comment = await response.json()
        setComments([comment, ...comments])
        setNewComment("")
        toast({
          title: "Comment added",
          description: "Your comment has been added successfully",
        })
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to add comment")
      }
    } catch (error: any) {
      console.error("Error adding comment:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to add comment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Submit a reply
  const handleSubmitReply = async (e: React.FormEvent, parentId: string) => {
    e.preventDefault()

    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to reply",
        variant: "destructive",
      })
      return
    }

    if (!replyContent.trim()) {
      toast({
        title: "Empty reply",
        description: "Please enter a reply",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/posts/${postSlug}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: replyContent, parentId }),
      })

      if (response.ok) {
        const reply = await response.json()

        // Update the comments state with the new reply
        setComments(
          comments.map((comment) => {
            if (comment.id === parentId) {
              return {
                ...comment,
                replies: [...comment.replies, reply],
              }
            }
            return comment
          }),
        )

        setReplyContent("")
        setReplyTo(null)

        toast({
          title: "Reply added",
          description: "Your reply has been added successfully",
        })
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to add reply")
      }
    } catch (error: any) {
      console.error("Error adding reply:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to add reply. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle edit comment
  const handleEditComment = async (e: React.FormEvent, commentId: string) => {
    e.preventDefault()

    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to edit comments",
        variant: "destructive",
      })
      return
    }

    if (!editContent.trim()) {
      toast({
        title: "Empty comment",
        description: "Please enter some content",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/posts/${postSlug}/comments/${commentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: editContent }),
      })

      if (response.ok) {
        const updatedComment = await response.json()

        // Update the comments state with the edited comment while preserving author info
        setComments(
          comments.map((comment) => {
            if (comment.id === commentId) {
              return {
                ...updatedComment,
                author: comment.author, // Preserve the existing author information
                replies: comment.replies, // Preserve the existing replies
              }
            }
            return comment
          }),
        )

        setEditingComment(null)
        setEditContent("")

        toast({
          title: "Comment updated",
          description: "Your comment has been updated successfully",
        })
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to update comment")
      }
    } catch (error: any) {
      console.error("Error updating comment:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update comment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle delete comment
  const handleDeleteComment = async (commentId: string) => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to delete comments",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/posts/${postSlug}/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          "x-confirmation-token": commentId,
        },
      })

      if (response.ok) {
        // Remove the comment from the state
        setComments(comments.filter((comment) => comment.id !== commentId))
        setCommentToDelete(null)

        toast({
          title: "Comment deleted",
          description: "Your comment has been deleted successfully",
        })
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete comment")
      }
    } catch (error: any) {
      console.error("Error deleting comment:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete comment. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle edit reply
  const handleEditReply = async (e: React.FormEvent, commentId: string, replyId: string) => {
    e.preventDefault()

    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to edit replies",
        variant: "destructive",
      })
      return
    }

    if (!editReplyContent.trim()) {
      toast({
        title: "Empty reply",
        description: "Please enter some content",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/posts/${postSlug}/comments/${replyId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: editReplyContent }),
      })

      if (response.ok) {
        const updatedReply = await response.json()

        // Update the comments state with the edited reply
        setComments(
          comments.map((comment) => {
            if (comment.id === commentId) {
              return {
                ...comment,
                replies: comment.replies.map((reply) =>
                  reply.id === replyId ? { ...updatedReply, author: reply.author } : reply,
                ),
              }
            }
            return comment
          }),
        )

        setEditingReply(null)
        setEditReplyContent("")

        toast({
          title: "Reply updated",
          description: "Your reply has been updated successfully",
        })
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to update reply")
      }
    } catch (error: any) {
      console.error("Error updating reply:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update reply. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle delete reply
  const handleDeleteReply = async (commentId: string, replyId: string) => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to delete replies",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/posts/${postSlug}/comments/${replyId}`, {
        method: "DELETE",
        headers: {
          "x-confirmation-token": replyId,
        },
      })

      if (response.ok) {
        // Remove the reply from the state
        setComments(
          comments.map((comment) => {
            if (comment.id === commentId) {
              return {
                ...comment,
                replies: comment.replies.filter((reply) => reply.id !== replyId),
              }
            }
            return comment
          }),
        )
        setReplyToDelete(null)

        toast({
          title: "Reply deleted",
          description: "Your reply has been deleted successfully",
        })
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete reply")
      }
    } catch (error: any) {
      console.error("Error deleting reply:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete reply. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-12 rounded-xl bg-white/50 dark:bg-gray-900/80 backdrop-blur-sm p-4 sm:p-6 border border-gray-100 dark:border-gray-800 shadow-lg"
    >
      <motion.h3
        className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent inline-block"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Comments
      </motion.h3>

      {/* Comment form */}
      {session ? (
        <motion.form
          onSubmit={handleSubmitComment}
          className="mb-6 sm:mb-8 bg-gradient-to-r from-purple-50/80 to-blue-50/80 dark:from-gray-800/80 dark:to-gray-700/80 p-4 sm:p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
            <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-white dark:border-gray-800 shadow-md">
              <AvatarImage src={session.user.image || ""} alt={session.user.name || "User"} />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white">
                {session.user.name
                  ? session.user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                  : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Share your thoughts..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="mb-3 resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg"
                rows={3}
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Posting...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Send className="mr-2 h-4 w-4" />
                      <span className="hidden xs:inline">Post Comment</span>
                      <span className="xs:hidden">Post</span>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </motion.form>
      ) : (
        <motion.div
          className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800/50 dark:to-gray-700/50 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 text-center border border-gray-100 dark:border-gray-800 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="mb-4 text-sm sm:text-base text-gray-600 dark:text-gray-300">Sign in to join the conversation</p>
          <Button
            asChild
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <Link href="/auth/login">Comment</Link>
          </Button>
        </motion.div>
      )}

      {/* Comments list */}
      <motion.div className="space-y-4 sm:space-y-6" variants={containerVariants} initial="hidden" animate="visible">
        {isLoadingComments ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <motion.div key={i} className="animate-pulse" variants={itemVariants}>
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                  <div className="flex-1">
                    <div className="h-4 w-24 sm:w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-3 w-16 sm:w-24 bg-gray-100 dark:bg-gray-800 rounded mb-4"></div>
                    <div className="h-12 sm:h-16 bg-gray-100 dark:bg-gray-800 rounded"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <motion.div className="text-center py-8 sm:py-12 text-muted-foreground" variants={itemVariants}>
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 dark:text-purple-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <p className="text-base sm:text-lg">No comments yet. Be the first to comment!</p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {comments.map((comment) => (
              <motion.div
                key={comment.id}
                className="space-y-3 sm:space-y-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-4 sm:p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300"
                variants={itemVariants}
                layout
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <Avatar className="h-8 w-8 sm:h-12 sm:w-12 border-2 border-white dark:border-gray-800 shadow-md">
                    <AvatarImage src={comment.author?.image || ""} alt={comment.author?.name || "User"} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white text-xs sm:text-base">
                      {comment.author?.name
                        ? comment.author.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 text-gray-900 dark:text-gray-100 gap-1 sm:gap-0">
                      <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2 min-w-0">
                        <h4 className="font-medium text-sm sm:text-base text-purple-900 dark:text-purple-300 truncate">
                          {comment.author?.name || "Anonymous"}
                        </h4>
                        <span className="text-xs px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full inline-block w-fit">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      {session?.user?.id === comment.author?.id && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/30 self-start sm:self-auto mt-1 sm:mt-0"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40 border-purple-100 dark:border-purple-900">
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingComment(comment.id)
                                setEditContent(comment.content)
                              }}
                              className="flex items-center cursor-pointer"
                            >
                              <Edit className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setCommentToDelete(comment.id)}
                              className="flex items-center cursor-pointer text-red-600 dark:text-red-400"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                    {editingComment === comment.id ? (
                      <motion.form
                        onSubmit={(e) => handleEditComment(e, comment.id)}
                        className="mt-2"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="mb-2 resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
                          rows={3}
                        />
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingComment(null)
                              setEditContent("")
                            }}
                            className="border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/30 text-xs sm:text-sm"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            size="sm"
                            disabled={isLoading}
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-xs sm:text-sm"
                          >
                            {isLoading ? "Saving..." : "Save"}
                          </Button>
                        </div>
                      </motion.form>
                    ) : (
                      <>
                        <p className="text-sm leading-relaxed mb-2 sm:mb-3 break-words">{comment.content}</p>
                        {session ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 text-xs text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 hover:bg-transparent"
                            onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                          >
                            <Reply className="h-3 w-3 mr-1" />
                            Reply
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 text-xs text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 hover:bg-transparent"
                            asChild
                          >
                            <Link href="/auth/login">
                              <Reply className="h-3 w-3 mr-1" />
                              Sign in to reply
                            </Link>
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <motion.div
                    className="ml-8 sm:ml-14 space-y-3 sm:space-y-4 pl-3 sm:pl-4 border-l-2 border-purple-200 dark:border-purple-900"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <AnimatePresence>
                      {comment.replies.map((reply) => (
                        <motion.div
                          key={reply.id}
                          className="flex gap-2 sm:gap-4"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Avatar className="h-6 w-6 sm:h-8 sm:w-8 border-2 border-white dark:border-gray-800 shadow-sm">
                            <AvatarImage src={reply.author?.image || ""} alt={reply.author?.name || "Anonymous"} />
                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white text-xs">
                              {reply.author?.name
                                ? reply.author.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()
                                : "A"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-1 w-full">
                              <div className="flex flex-col xs:flex-row xs:items-center gap-1 min-w-0">
                                <span className="font-medium text-xs sm:text-sm text-purple-900 dark:text-purple-300 truncate">
                                  {reply.author?.name || "Anonymous"}
                                </span>
                                <div className="text-xs px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full inline-block w-fit">
                                  {formatDate(reply.createdAt)}
                                </div>
                              </div>
                              {session?.user?.id === reply.author.id && (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 sm:h-8 sm:w-8 p-0 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/30 self-start xs:self-auto"
                                    >
                                      <MoreVertical className="h-3 w-3 sm:h-4 sm:w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    align="end"
                                    className="w-40 border-purple-100 dark:border-purple-900"
                                  >
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setEditingReply(reply.id)
                                        setEditReplyContent(reply.content)
                                      }}
                                      className="flex items-center cursor-pointer"
                                    >
                                      <Edit className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => setReplyToDelete(reply.id)}
                                      className="flex items-center cursor-pointer text-red-600 dark:text-red-400"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
                            </div>

                            {editingReply === reply.id ? (
                              <motion.form
                                onSubmit={(e) => handleEditReply(e, comment.id, reply.id)}
                                className="mt-2"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                              >
                                <Textarea
                                  value={editReplyContent}
                                  onChange={(e) => setEditReplyContent(e.target.value)}
                                  className="mb-2 resize-none text-xs sm:text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                  rows={2}
                                />
                                <div className="flex justify-end gap-2">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setEditingReply(null)
                                      setEditReplyContent("")
                                    }}
                                    className="border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/30 text-xs"
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    type="submit"
                                    size="sm"
                                    disabled={isLoading}
                                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-xs"
                                  >
                                    {isLoading ? "Saving..." : "Save"}
                                  </Button>
                                </div>
                              </motion.form>
                            ) : (
                              <p className="text-xs sm:text-sm mt-1 text-gray-900 dark:text-gray-100 break-words">
                                {reply.content}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}

                {/* Reply form */}
                <AnimatePresence>
                  {replyTo === comment.id && session && (
                    <motion.form
                      onSubmit={(e) => handleSubmitReply(e, comment.id)}
                      className="ml-8 sm:ml-14 bg-gradient-to-r from-purple-50/80 to-blue-50/80 dark:from-gray-800/80 dark:to-gray-700/80 p-3 sm:p-4 rounded-lg border border-gray-100 dark:border-gray-800"
                      initial={{ opacity: 0, height: 0, y: -20 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Textarea
                        placeholder={`Reply to ${comment.author?.name || "Anonymous"}...`}
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        className="mb-2 resize-none text-xs sm:text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        rows={2}
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setReplyTo(null)
                            setReplyContent("")
                          }}
                          className="border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/30 text-xs"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          size="sm"
                          disabled={isLoading}
                          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-xs"
                        >
                          {isLoading ? (
                            <div className="flex items-center">
                              <svg
                                className="animate-spin -ml-1 mr-1 h-3 w-3 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Posting...
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <Reply className="mr-1 h-3 w-3" />
                              Reply
                            </div>
                          )}
                        </Button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>

                <Separator className="my-4 sm:my-6 bg-gradient-to-r from-transparent via-purple-200 dark:via-purple-900/50 to-transparent" />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </motion.div>

      {/* Delete Comment Dialog */}
      <AlertDialog open={!!commentToDelete} onOpenChange={() => setCommentToDelete(null)}>
        <AlertDialogContent className="border-2 border-red-100 dark:border-red-900/50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm max-w-[90vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600 dark:text-red-400">Delete Comment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this comment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <AlertDialogCancel className="border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20 mt-0">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (commentToDelete) {
                  handleDeleteComment(commentToDelete)
                }
              }}
              className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white transition-all duration-300"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Reply Dialog */}
      <AlertDialog open={!!replyToDelete} onOpenChange={() => setReplyToDelete(null)}>
        <AlertDialogContent className="border-2 border-red-100 dark:border-red-900/50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm max-w-[90vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600 dark:text-red-400">Delete Reply</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this reply? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <AlertDialogCancel className="border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20 mt-0">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (replyToDelete) {
                  const comment = comments.find((c) => c.replies.some((r) => r.id === replyToDelete))
                  if (comment) {
                    handleDeleteReply(comment.id, replyToDelete)
                  }
                }
              }}
              className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white transition-all duration-300"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  )
}
