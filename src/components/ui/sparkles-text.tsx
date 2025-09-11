"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SparklesTextProps {
  text: string;
  colors?: {
    first: string;
    second: string;
  };
  className?: string;
  sparklesCount?: number;
  as?: React.ElementType;
}

interface Sparkle {
  id: number;
  x: number;
  y: number;
  color: string;
  delay: number;
  scale: number;
  duration: number;
}

const defaultColors = {
  first: "#9E7AFF",
  second: "#FE8BBB"
};

export const SparklesText: React.FC<SparklesTextProps> = ({
  text,
  colors = defaultColors,
  className,
  sparklesCount = 10,
  as: Component = "div"
}) => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const textRef = useRef<HTMLElement>(null);

  const generateSparkles = () => {
    if (!textRef.current) return;
    
    const rect = textRef.current.getBoundingClientRect();
    const newSparkles: Sparkle[] = [];
    
    for (let i = 0; i < sparklesCount; i++) {
      newSparkles.push({
        id: Math.random(),
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        color: Math.random() > 0.5 ? colors.first : colors.second,
        delay: Math.random() * 2,
        scale: 0.7 + Math.random() * 0.8,
        duration: 1 + Math.random() * 2
      });
    }
    
    setSparkles(newSparkles);
  };

  useEffect(() => {
    generateSparkles();
    
    const interval = setInterval(generateSparkles, 3000);
    
    return () => clearInterval(interval);
  }, [sparklesCount, colors]);

  const sparkleVariants = {
    hidden: {
      opacity: 0,
      scale: 0,
      rotate: 0
    },
    visible: (i: number) => ({
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
      rotate: [0, 180, 360],
      transition: {
        duration: sparkles[i]?.duration || 2,
        delay: sparkles[i]?.delay || 0,
        ease: "easeInOut",
        repeat: Infinity,
        repeatDelay: 1
      }
    })
  };

  return (
    <Component 
      className={cn("relative inline-block", className)}
      ref={textRef}
      style={{
        "--sparkles-first-color": colors.first,
        "--sparkles-second-color": colors.second
      } as React.CSSProperties}
    >
      <span className="relative z-10">{text}</span>
      
      {sparkles.map((sparkle, index) => (
        <motion.div
          key={sparkle.id}
          className="absolute pointer-events-none z-20"
          style={{
            left: sparkle.x,
            top: sparkle.y,
            color: sparkle.color,
            transform: `scale(${sparkle.scale})`
          }}
          variants={sparkleVariants}
          initial="hidden"
          animate="visible"
          custom={index}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="animate-pulse"
          >
            <path d="M12 0l3.09 6.26L22 9.27l-5.45 5.32L18.18 21 12 17.77 5.82 21l1.64-6.41L2 9.27l6.91-3.01L12 0z" />
          </svg>
        </motion.div>
      ))}
      
      {/* Additional floating sparkles for ambiance */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: Math.floor(sparklesCount / 2) }).map((_, i) => (
          <motion.div
            key={`ambient-${i}`}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: `linear-gradient(45deg, ${colors.first}, ${colors.second})`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              y: [0, -20, 0]
            }}
            transition={{
              duration: 3,
              delay: i * 0.2,
              repeat: Infinity,
              repeatDelay: 2
            }}
          />
        ))}
      </div>
    </Component>
  );
};