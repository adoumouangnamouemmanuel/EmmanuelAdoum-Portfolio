"use client";

import type React from "react";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { Edit, MoreVertical, Reply, Send, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    image: string | null;
  };
  replies: Comment[];
};

export default function CommentSection({ postSlug }: { postSlug: string }) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [editingReply, setEditingReply] = useState<string | null>(null);
  const [editReplyContent, setEditReplyContent] = useState("");
  const [replyToDelete, setReplyToDelete] = useState<string | null>(null);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsLoadingComments(true);
        const response = await fetch(`/api/posts/${postSlug}/comments`);

        if (response.ok) {
          const data = await response.json();
          setComments(data);
        } else {
          console.error("Failed to fetch comments");
          // Set empty comments array as fallback
          setComments([]);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
        // Set empty comments array as fallback
        setComments([]);
      } finally {
        setIsLoadingComments(false);
      }
    };

    fetchComments();
  }, [postSlug]);

  // Submit a new comment
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to comment",
        variant: "destructive",
      });
      return;
    }

    if (!newComment.trim()) {
      toast({
        title: "Empty comment",
        description: "Please enter a comment",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/posts/${postSlug}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newComment }),
      });

      if (response.ok) {
        const comment = await response.json();
        setComments([comment, ...comments]);
        setNewComment("");
        toast({
          title: "Comment added",
          description: "Your comment has been added successfully",
        });
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to add comment");
      }
    } catch (error: any) {
      console.error("Error adding comment:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to add comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Submit a reply
  const handleSubmitReply = async (e: React.FormEvent, parentId: string) => {
    e.preventDefault();

    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to reply",
        variant: "destructive",
      });
      return;
    }

    if (!replyContent.trim()) {
      toast({
        title: "Empty reply",
        description: "Please enter a reply",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/posts/${postSlug}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: replyContent, parentId }),
      });

      if (response.ok) {
        const reply = await response.json();

        // Update the comments state with the new reply
        setComments(
          comments.map((comment) => {
            if (comment.id === parentId) {
              return {
                ...comment,
                replies: [...comment.replies, reply],
              };
            }
            return comment;
          })
        );

        setReplyContent("");
        setReplyTo(null);

        toast({
          title: "Reply added",
          description: "Your reply has been added successfully",
        });
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to add reply");
      }
    } catch (error: any) {
      console.error("Error adding reply:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add reply. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle edit comment
  const handleEditComment = async (e: React.FormEvent, commentId: string) => {
    e.preventDefault();

    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to edit comments",
        variant: "destructive",
      });
      return;
    }

    if (!editContent.trim()) {
      toast({
        title: "Empty comment",
        description: "Please enter some content",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/posts/${postSlug}/comments/${commentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: editContent }),
      });

      if (response.ok) {
        const updatedComment = await response.json();
        
        // Update the comments state with the edited comment while preserving author info
        setComments(comments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...updatedComment,
              author: comment.author, // Preserve the existing author information
              replies: comment.replies, // Preserve the existing replies
            };
          }
          return comment;
        }));

        setEditingComment(null);
        setEditContent("");

        toast({
          title: "Comment updated",
          description: "Your comment has been updated successfully",
        });
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to update comment");
      }
    } catch (error: any) {
      console.error("Error updating comment:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete comment
  const handleDeleteComment = async (commentId: string) => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to delete comments",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/posts/${postSlug}/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          "x-confirmation-token": commentId,
        },
      });

      if (response.ok) {
        // Remove the comment from the state
        setComments(comments.filter(comment => comment.id !== commentId));
        setCommentToDelete(null);

        toast({
          title: "Comment deleted",
          description: "Your comment has been deleted successfully",
        });
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete comment");
      }
    } catch (error: any) {
      console.error("Error deleting comment:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete comment. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle edit reply
  const handleEditReply = async (e: React.FormEvent, commentId: string, replyId: string) => {
    e.preventDefault();

    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to edit replies",
        variant: "destructive",
      });
      return;
    }

    if (!editReplyContent.trim()) {
      toast({
        title: "Empty reply",
        description: "Please enter some content",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/posts/${postSlug}/comments/${replyId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: editReplyContent }),
      });

      if (response.ok) {
        const updatedReply = await response.json();
        
        // Update the comments state with the edited reply
        setComments(comments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              replies: comment.replies.map(reply => 
                reply.id === replyId ? { ...updatedReply, author: reply.author } : reply
              ),
            };
          }
          return comment;
        }));

        setEditingReply(null);
        setEditReplyContent("");

        toast({
          title: "Reply updated",
          description: "Your reply has been updated successfully",
        });
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to update reply");
      }
    } catch (error: any) {
      console.error("Error updating reply:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update reply. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete reply
  const handleDeleteReply = async (commentId: string, replyId: string) => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to delete replies",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/posts/${postSlug}/comments/${replyId}`, {
        method: "DELETE",
        headers: {
          "x-confirmation-token": replyId,
        },
      });

      if (response.ok) {
        // Remove the reply from the state
        setComments(comments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              replies: comment.replies.filter(reply => reply.id !== replyId),
            };
          }
          return comment;
        }));
        setReplyToDelete(null);

        toast({
          title: "Reply deleted",
          description: "Your reply has been deleted successfully",
        });
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete reply");
      }
    } catch (error: any) {
      console.error("Error deleting reply:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete reply. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-12"
    >
      <h3 className="text-2xl font-bold mb-6">Comments</h3>

      {/* Comment form */}
      {session ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <div className="flex items-start gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={session.user.image || ""}
                alt={session.user.name || "User"}
              />
              <AvatarFallback>
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
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="mb-2 resize-none"
                rows={3}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Posting..." : "Post Comment"}
                <Send className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-muted/50 rounded-lg p-4 mb-8 text-center">
          <p className="mb-2">Sign in to leave a comment</p>
          <Button asChild>
            <Link href="/auth/login">Comment</Link>
          </Button>
        </div>
      )}

      {/* Comments list */}
      <div className="space-y-6">
        {isLoadingComments ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                  <div className="flex-1">
                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-3 w-24 bg-gray-100 dark:bg-gray-800 rounded mb-4"></div>
                    <div className="h-16 bg-gray-100 dark:bg-gray-800 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="space-y-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={comment.author?.image || ""}
                    alt={comment.author?.name || "User"}
                  />
                  <AvatarFallback>
                    {comment.author?.name
                      ? comment.author.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                      : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{comment.author?.name || "Anonymous"}</h4>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    {session?.user?.id === comment.author?.id && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingComment(comment.id);
                              setEditContent(comment.content);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setCommentToDelete(comment.id)}
                            className="text-red-600 dark:text-red-400"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                  {editingComment === comment.id ? (
                    <form onSubmit={(e) => handleEditComment(e, comment.id)} className="mt-2">
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="mb-2 resize-none"
                        rows={3}
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingComment(null);
                            setEditContent("");
                          }}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" size="sm" disabled={isLoading}>
                          {isLoading ? "Saving..." : "Save"}
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <p className="text-sm mb-2">{comment.content}</p>
                      {session ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                          onClick={() =>
                            setReplyTo(replyTo === comment.id ? null : comment.id)
                          }
                        >
                          <Reply className="h-3 w-3 mr-1" />
                          Reply
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
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
                <div className="ml-14 space-y-4">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex gap-4">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={reply.author?.image || ""}
                          alt={reply.author?.name || "Anonymous"}
                        />
                        <AvatarFallback>
                          {reply.author?.name
                            ? reply.author.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                            : "A"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium">
                              {reply.author?.name || "Anonymous"}
                            </span>
                            <span className="text-sm text-muted-foreground ml-2">
                              {formatDate(reply.createdAt)}
                            </span>
                          </div>
                          {session?.user?.id === reply.authorId && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setEditingReply(reply.id);
                                    setEditReplyContent(reply.content);
                                  }}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setReplyToDelete(reply.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>

                        {editingReply === reply.id ? (
                          <form onSubmit={(e) => handleEditReply(e, comment.id, reply.id)} className="mt-2">
                            <Textarea
                              value={editReplyContent}
                              onChange={(e) => setEditReplyContent(e.target.value)}
                              className="mb-2 resize-none text-sm"
                              rows={2}
                            />
                            <div className="flex justify-end gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setEditingReply(null);
                                  setEditReplyContent("");
                                }}
                              >
                                Cancel
                              </Button>
                              <Button type="submit" size="sm" disabled={isLoading}>
                                {isLoading ? "Saving..." : "Save"}
                              </Button>
                            </div>
                          </form>
                        ) : (
                          <p className="text-sm">{reply.content}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply form */}
              {replyTo === comment.id && session && (
                <form
                  onSubmit={(e) => handleSubmitReply(e, comment.id)}
                  className="ml-14"
                >
                  <Textarea
                    placeholder={`Reply to ${comment.author?.name || "Anonymous"}...`}
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="mb-2 resize-none text-sm"
                    rows={2}
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setReplyTo(null);
                        setReplyContent("");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" size="sm" disabled={isLoading}>
                      {isLoading ? "Posting..." : "Reply"}
                    </Button>
                  </div>
                </form>
              )}

              <Separator className="my-6" />
            </div>
          ))
        )}
      </div>

      {/* Delete Comment Dialog */}
      <AlertDialog open={!!commentToDelete} onOpenChange={() => setCommentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this comment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (commentToDelete) {
                  handleDeleteComment(commentToDelete);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Reply Dialog */}
      <AlertDialog open={!!replyToDelete} onOpenChange={() => setReplyToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Reply</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this reply? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (replyToDelete) {
                  const comment = comments.find(c => 
                    c.replies.some(r => r.id === replyToDelete)
                  );
                  if (comment) {
                    handleDeleteReply(comment.id, replyToDelete);
                  }
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
