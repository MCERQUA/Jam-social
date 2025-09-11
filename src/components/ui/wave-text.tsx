"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface WaveTextProps {
  text: string;
  className?: string;
  delay?: number;
  gradientWords?: string[];
  repeatDelay?: number;
}

export const WaveText: React.FC<WaveTextProps> = ({
  text,
  className = "",
  delay = 0,
  gradientWords = [],
  repeatDelay = 1
}) => {
  const letters = text.split("");
  
  const container = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: delay,
      },
    },
  };

  const child = {
    hidden: {
      y: 0,
      scale: 1,
    },
    visible: {
      y: [0, -15, 0],
      scale: [1, 1.2, 1],
      transition: {
        duration: 0.6,
        ease: "easeInOut",
        repeat: Infinity,
        repeatDelay: repeatDelay,
      },
    },
  };

  // Check if a letter is part of a gradient word
  const getLetterStyle = (letter: string, index: number) => {
    let currentPos = 0;
    for (const word of text.split(" ")) {
      if (gradientWords.includes(word)) {
        const wordEnd = currentPos + word.length;
        if (index >= currentPos && index < wordEnd) {
          return true;
        }
      }
      currentPos += word.length + 1; // +1 for space
    }
    return false;
  };

  return (
    <motion.div
      className={cn("inline-flex flex-wrap", className)}
      variants={container}
      initial="hidden"
      animate="visible"
      style={{ perspective: "1000px" }}
    >
      {letters.map((letter, index) => {
        const isGradient = getLetterStyle(letter, index);
        
        return (
          <motion.span
            key={`${letter}-${index}`}
            className="inline-block origin-bottom"
            variants={child}
            style={{
              display: "inline-block",
              transformStyle: "preserve-3d",
            }}
          >
            {letter === " " ? (
              <span>&nbsp;</span>
            ) : isGradient ? (
              <span className="inline-block bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                {letter}
              </span>
            ) : (
              letter
            )}
          </motion.span>
        );
      })}
    </motion.div>
  );
};