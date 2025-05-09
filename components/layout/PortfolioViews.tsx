"use client";

import { Eye } from "lucide-react";
import { useEffect, useState } from "react";

export default function PortfolioViews() {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    const countView = async () => {
      try {
        // Check if we've counted this session
        const viewKey = 'portfolio_viewed';
        const hasViewed = localStorage.getItem(viewKey);
        
        if (!hasViewed) {
          // Increment view count
          await fetch('/api/portfolio/views', { method: 'POST' });
          // Mark as viewed for this session
          localStorage.setItem(viewKey, '1');
        }
        
        // Always fetch the current count
        const response = await fetch('/api/portfolio/views');
        const data = await response.json();
        setViews(data.totalViews);
      } catch (error) {
        console.error('Error updating portfolio views:', error);
      }
    };

    countView();
  }, []);

  if (views === null) return null;

  return (
    <div className="flex items-center gap-1 text-xs text-muted-foreground">
      <Eye className="h-3 w-3" />
      <span>{views.toLocaleString()} views</span>
    </div>
  );
} 