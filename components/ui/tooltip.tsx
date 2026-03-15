"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
}

export function Tooltip({ children, content, side = "top", className }: TooltipProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="inline-block"
      >
        {children}
      </div>
      
      {isOpen && (
        <div
          className={cn(
            "absolute z-50 px-2 py-1 text-xs text-white bg-gray-900 rounded shadow-lg whitespace-nowrap animate-fade-up",
            {
              "bottom-full left-1/2 transform -translate-x-1/2 mb-2": side === "top",
              "top-full left-1/2 transform -translate-x-1/2 mt-2": side === "bottom",
              "left-full top-1/2 transform -translate-y-1/2 ml-2": side === "right",
              "right-full top-1/2 transform -translate-y-1/2 mr-2": side === "left",
            },
            className
          )}
        >
          {content}
          <div
            className={cn(
              "absolute w-2 h-2 bg-gray-900 transform rotate-45",
              {
                "bottom-full left-1/2 transform -translate-x-1/2 translate-y-1": side === "top",
                "top-full left-1/2 transform -translate-x-1/2 -translate-y-1": side === "bottom",
                "left-full top-1/2 transform -translate-y-1/2 -translate-x-1": side === "right",
                "right-full top-1/2 transform -translate-y-1/2 translate-x-1": side === "left",
              }
            )}
          />
        </div>
      )}
    </div>
  );
}
