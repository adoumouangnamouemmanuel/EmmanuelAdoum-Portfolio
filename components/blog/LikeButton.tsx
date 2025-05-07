"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface LikeButtonProps {
  postSlug: string;
}

export default function LikeButton({ postSlug }: LikeButtonProps) {
  const { data: session } = useSession();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const response = await fetch(`/api/posts/${postSlug}/like`);
        if (response.ok) {
          const data = await response.json();
          setLikeCount(data.likeCount || 0);
        }
      } catch (error) {
        console.error("Error fetching like status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLikeStatus();
  }, [postSlug]);

  const handleLike = async () => {
    if (!session?.user) {
      // Handle unauthenticated user
      return;
    }

    try {
      const response = await fetch(`/api/posts/${postSlug}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: session.user.id }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.isLiked);
        setLikeCount(prev => data.isLiked ? prev + 1 : prev - 1);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  if (isLoading) {
    return (
      <motion.button
        disabled
        className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
      >
        <Heart className="h-4 w-4" />
      </motion.button>
    );
  }

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleLike}
      className={`p-2 rounded-full ${
        isLiked
          ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
          : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
      } hover:bg-red-200 dark:hover:bg-red-800/40 transition-colors`}
    >
      <div className="flex items-center gap-1">
        <Heart className="h-4 w-4" fill={isLiked ? "currentColor" : "none"} />
        {likeCount > 0 && (
          <span className="text-xs font-medium">{likeCount}</span>
        )}
      </div>
    </motion.button>
  );
}
