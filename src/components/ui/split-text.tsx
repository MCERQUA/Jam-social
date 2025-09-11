"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  animationFrom?: "top" | "bottom" | "left" | "right" | "random";
  gradientWords?: string[];
}

export const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = "",
  delay = 0,
  animationFrom = "bottom",
  gradientWords = []
}) => {
  const words = text.split(" ");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: delay,
      },
    },
  };

  const getChildVariants = (from: string) => {
    const variants: { [key: string]: any } = {
      top: {
        hidden: { y: -50, opacity: 0, rotateX: -90 },
        visible: {
          y: 0,
          opacity: 1,
          rotateX: 0,
          transition: {
            type: "spring",
            damping: 12,
            stiffness: 100,
            duration: 0.5,
          },
        },
      },
      bottom: {
        hidden: { y: 50, opacity: 0, rotateX: 90 },
        visible: {
          y: 0,
          opacity: 1,
          rotateX: 0,
          transition: {
            type: "spring",
            damping: 12,
            stiffness: 100,
            duration: 0.5,
          },
        },
      },
      left: {
        hidden: { x: -50, opacity: 0, rotateY: 90 },
        visible: {
          x: 0,
          opacity: 1,
          rotateY: 0,
          transition: {
            type: "spring",
            damping: 12,
            stiffness: 100,
            duration: 0.5,
          },
        },
      },
      right: {
        hidden: { x: 50, opacity: 0, rotateY: -90 },
        visible: {
          x: 0,
          opacity: 1,
          rotateY: 0,
          transition: {
            type: "spring",
            damping: 12,
            stiffness: 100,
            duration: 0.5,
          },
        },
      },
      random: {
        hidden: { 
          x: Math.random() * 100 - 50, 
          y: Math.random() * 100 - 50, 
          opacity: 0,
          scale: 0,
          rotate: Math.random() * 90 - 45,
        },
        visible: {
          x: 0,
          y: 0,
          opacity: 1,
          scale: 1,
          rotate: 0,
          transition: {
            type: "spring",
            damping: 12,
            stiffness: 100,
            duration: 0.5,
          },
        },
      },
    };
    return variants[from] || variants.bottom;
  };

  const childVariants = getChildVariants(animationFrom);

  return (
    <motion.span
      className={cn("inline-flex flex-wrap", className)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ perspective: "1000px" }}
    >
      {words.map((word, index) => {
        const isGradientWord = gradientWords.includes(word);
        
        return (
          <motion.span
            key={index}
            className="inline-block mr-[0.25em] origin-center"
            variants={childVariants}
            style={{ transformStyle: "preserve-3d" }}
          >
            {isGradientWord ? (
              <span className="inline-block bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                {word}
              </span>
            ) : (
              word
            )}
          </motion.span>
        );
      })}
    </motion.span>
  );
};