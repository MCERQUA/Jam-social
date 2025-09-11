"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AnimatedBorderProps {
  children: React.ReactNode;
  className?: string;
  borderRadius?: string;
  glowIntensity?: "low" | "medium" | "high";
}

export function AnimatedBorder({ 
  children, 
  className,
  borderRadius = "rounded-lg",
  glowIntensity = "medium"
}: AnimatedBorderProps) {
  const glowConfig = {
    low: "blur-sm opacity-60",
    medium: "blur-md opacity-80",
    high: "blur-xl opacity-100"
  };

  return (
    <div className={cn("relative group inline-block", borderRadius, "overflow-hidden", className)}>
      {/* Rotating gradient background */}
      <div className={cn("absolute -inset-[2px]", borderRadius, "overflow-hidden")}>
        <div 
          className="absolute inset-0 w-[200%] h-[200%] -left-1/2 -top-1/2"
          style={{
            background: `conic-gradient(from 0deg at 50% 50%, #ec4899 0deg, #3b82f6 60deg, #a855f7 120deg, #ec4899 180deg, #3b82f6 240deg, #a855f7 300deg, #ec4899 360deg)`,
            animation: 'spin 8s linear infinite'
          }}
        />
      </div>
      
      {/* Glow effect */}
      <div className={cn(
        "absolute -inset-[3px]",
        borderRadius,
        "bg-gradient-to-r from-pink-500 via-blue-500 to-purple-500",
        glowConfig[glowIntensity],
        "group-hover:blur-2xl transition-all duration-500"
      )} />
      
      {/* Content container */}
      <div className={cn(
        "relative bg-gray-900/95 backdrop-blur-xl",
        borderRadius
      )}>
        {children}
      </div>
      
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}