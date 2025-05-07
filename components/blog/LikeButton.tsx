"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export default function LikeButton({ postSlug }: { postSlug: string }) {
  const { data: session } = useSession();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Check if user has liked the post
  useEffect(() => {
    const checkLikeStatus = async () => {
      if (!session) return;

      try {
        const response = await fetch(`/api/posts/${postSlug}/like`);

        if (response.ok) {
          const data = await response.json();
          setLiked(data.liked);
        }
      } catch (error) {
        console.error("Error checking like status:", error);
      }
    };

    // Get like count - for demo purposes, we'll use a random number
    const getLikeCount = () => {
      setLikeCount(Math.floor(Math.random() * 50) + 1);
    };

    checkLikeStatus();
    getLikeCount();
  }, [session, postSlug]);

  const handleLike = async () => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like posts",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/posts/${postSlug}/like`, {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        setLiked(data.liked);
        setLikeCount((prev) => (data.liked ? prev + 1 : prev - 1));
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to like post");
      }
    } catch (error: any) {
      console.error("Error liking post:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to like post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.95 }}
      className={`p-2 rounded-full ${
        liked
          ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
          : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
      } hover:bg-blue-200 dark:hover:bg-blue-800/40 transition-colors relative`}
      onClick={handleLike}
      disabled={isLoading}
    >
      <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
      {likeCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {likeCount}
        </span>
      )}
    </motion.button>
  );
}
