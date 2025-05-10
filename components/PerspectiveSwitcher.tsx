"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Code, Brain, Briefcase, Cpu } from 'lucide-react';
import { useRouter, useSearchParams } from "next/navigation";

export type Perspective = "developer" | "leader" | "ml-engineer" | "electrical-engineer";

const perspectives = [
  {
    id: "developer",
    label: "Software Developer",
    icon: <Code className="h-4 w-4 mr-2" />,
    color: "bg-blue-600",
  },
  {
    id: "leader",
    label: "Leader",
    icon: <Briefcase className="h-4 w-4 mr-2" />,
    color: "bg-purple-600",
  },
  {
    id: "ml-engineer",
    label: "ML Engineer",
    icon: <Brain className="h-4 w-4 mr-2" />,
    color: "bg-green-600",
  },
  {
    id: "electrical-engineer",
    label: "Electrical Engineer",
    icon: <Cpu className="h-4 w-4 mr-2" />,
    color: "bg-amber-600",
  },
];

export default function PerspectiveSwitcher() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activePerspective, setActivePerspective] = useState<Perspective>("developer");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Get perspective from URL or localStorage
    const perspectiveParam = searchParams.get("perspective") as Perspective;
    const storedPerspective = localStorage.getItem("portfolio-perspective") as Perspective;
    
    if (perspectiveParam && perspectives.some(p => p.id === perspectiveParam)) {
      setActivePerspective(perspectiveParam);
      localStorage.setItem("portfolio-perspective", perspectiveParam);
    } else if (storedPerspective && perspectives.some(p => p.id === storedPerspective)) {
      setActivePerspective(storedPerspective);
    }
  }, [searchParams]);

  const handlePerspectiveChange = (perspective: Perspective) => {
    setActivePerspective(perspective);
    localStorage.setItem("portfolio-perspective", perspective);
    
    // Update URL without refreshing the page
    const params = new URLSearchParams(searchParams.toString());
    params.set("perspective", perspective);
    router.push(`/?${params.toString()}`, { scroll: false });
    
    setIsOpen(false);
  };

  const activePerspectiveData = perspectives.find(p => p.id === activePerspective);

  return (
    <div className="relative z-50">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="flex items-center gap-2 px-3 py-2 rounded-full border-2 shadow-md hover:shadow-lg transition-all"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className={`w-2 h-2 rounded-full ${activePerspectiveData?.color}`}
            />
            <span className="text-sm font-medium">View as:</span>
            <span className="font-semibold">{activePerspectiveData?.label}</span>
            <ChevronDown className="h-4 w-4 ml-1 transition-transform duration-200" 
              style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl shadow-xl border-2">
          <AnimatePresence>
            {perspectives.map((perspective) => (
              <motion.div
                key={perspective.id}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.15 }}
              >
                <DropdownMenuItem 
                  className={`flex items-center gap-2 px-3 py-2 my-1 rounded-lg cursor-pointer transition-all ${
                    activePerspective === perspective.id 
                      ? 'bg-blue-50 dark:bg-blue-900/20 font-medium' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => handlePerspectiveChange(perspective.id as Perspective)}
                >
                  <div className={`w-2 h-2 rounded-full ${perspective.color}`} />
                  <span className="flex items-center">
                    {perspective.icon}
                    {perspective.label}
                  </span>
                </DropdownMenuItem>
              </motion.div>
            ))}
          </AnimatePresence>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}