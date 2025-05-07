"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ResponsiveImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}

export default function ResponsiveImage({
  src,
  alt,
  priority = false,
  className,
}: ResponsiveImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative overflow-hidden rounded-xl shadow-lg aspect-video">
      <Image
        src={src || "/placeholder.svg?height=600&width=1200"}
        alt={alt}
        fill={true}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={priority}
        className={cn(
          "object-cover transition-all duration-300",
          isLoading ? "scale-110 blur-sm" : "scale-100 blur-0",
          className
        )}
        onLoadingComplete={() => setIsLoading(false)}
      />
    </div>
  );
}
