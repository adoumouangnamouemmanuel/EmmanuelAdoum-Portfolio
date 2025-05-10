"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { Perspective } from "@/components/PerspectiveSwitcher";

type PerspectiveContextType = {
  perspective: Perspective;
  setPerspective: (perspective: Perspective) => void;
  isLoading: boolean;
};

const PerspectiveContext = createContext<PerspectiveContextType>({
  perspective: "developer",
  setPerspective: () => {},
  isLoading: true,
});

export const usePerspective = () => useContext(PerspectiveContext);

export function PerspectiveProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const [perspective, setPerspective] = useState<Perspective>("developer");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get perspective from URL or localStorage
    const perspectiveParam = searchParams.get("perspective") as Perspective;
    const storedPerspective = localStorage.getItem("portfolio-perspective") as Perspective;
    
    const validPerspectives = ["developer", "leader", "ml-engineer", "electrical-engineer"];
    
    if (perspectiveParam && validPerspectives.includes(perspectiveParam)) {
      setPerspective(perspectiveParam);
      localStorage.setItem("portfolio-perspective", perspectiveParam);
    } else if (storedPerspective && validPerspectives.includes(storedPerspective)) {
      setPerspective(storedPerspective);
    }
    
    setIsLoading(false);
  }, [searchParams]);

  return (
    <PerspectiveContext.Provider value={{ perspective, setPerspective, isLoading }}>
      {children}
    </PerspectiveContext.Provider>
  );
}