"use client";

import React, { useState } from 'react';
import { motion, useTransform, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Person {
  id: number;
  name: string;
  designation: string;
  image: string;
}

interface AnimatedTooltipProps {
  items: Person[];
  className?: string;
  avatarSize?: 'sm' | 'md' | 'lg';
  tooltipTheme?: 'dark' | 'light' | 'blue' | 'gradient';
  animation?: 'gentle' | 'bouncy' | 'smooth';
}

const avatarSizeConfigs = {
  sm: "w-8 h-8",
  md: "w-14 h-14",
  lg: "w-20 h-20"
};

const tooltipThemeConfigs = {
  dark: "bg-black text-white",
  light: "bg-white text-black border border-gray-200 shadow-lg",
  blue: "bg-blue-600 text-white",
  gradient: "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
};

const animationConfigs = {
  gentle: { stiffness: 100, damping: 10 },
  bouncy: { stiffness: 400, damping: 10 },
  smooth: { stiffness: 200, damping: 20 }
};

export const AnimatedTooltip: React.FC<AnimatedTooltipProps> = ({
  items,
  className,
  avatarSize = 'md',
  tooltipTheme = 'dark',
  animation = 'gentle'
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const springConfig = animationConfigs[animation];
  const x = useMotionValue(0);
  
  // Transform the x motion value to create rotation
  const rotate = useTransform(x, [-100, 100], [-45, 45]);
  const translateX = useSpring(x, springConfig);

  const handleMouseMove = (event: React.MouseEvent<HTMLImageElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - rect.left - rect.width / 2;
    x.set(offsetX);
  };

  const tooltipVariants = {
    initial: { 
      opacity: 0, 
      y: 20, 
      scale: 0.6 
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: springConfig.stiffness,
        damping: springConfig.damping
      }
    },
    exit: { 
      opacity: 0, 
      y: 20, 
      scale: 0.6,
      transition: {
        duration: 0.15
      }
    }
  };

  return (
    <div className={cn("flex flex-row items-center justify-center", className)}>
      {items.map((item, idx) => (
        <div
          className="relative group"
          key={item.name}
          onMouseEnter={() => setHoveredIndex(item.id)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence mode="popLayout">
            {hoveredIndex === item.id && (
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={tooltipVariants}
                style={{
                  translateX: translateX,
                  rotate: rotate,
                  whiteSpace: "nowrap",
                }}
                className={cn(
                  "absolute -top-16 -left-1/2 translate-x-1/2 flex text-xs flex-col items-center justify-center rounded-md z-50 px-4 py-2",
                  tooltipThemeConfigs[tooltipTheme]
                )}
              >
                <div className="absolute inset-x-10 z-30 w-[20%] -bottom-px h-px" />
                <div className="absolute left-10 w-[40%] z-30 -bottom-px h-px" />
                <div className="font-bold text-white relative z-30 text-base">
                  {item.name}
                </div>
                <div className="text-white text-xs">
                  {item.designation}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.img
            onMouseMove={handleMouseMove}
            height={100}
            width={100}
            src={item.image}
            alt={item.name}
            className={cn(
              "object-cover !m-0 !p-0 object-top rounded-full border-2 border-white group-hover:scale-105 group-hover:z-30 relative transition duration-500",
              avatarSizeConfigs[avatarSize],
              idx !== 0 && "-ml-4"
            )}
            style={{
              zIndex: hoveredIndex === item.id ? 30 : 10,
            }}
          />
        </div>
      ))}
    </div>
  );
};

// Fallback image component for when images fail to load
const AvatarFallback: React.FC<{ 
  name: string; 
  className?: string; 
  size: 'sm' | 'md' | 'lg' 
}> = ({ name, className, size }) => {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const sizeMap = {
    sm: 'text-xs',
    md: 'text-sm', 
    lg: 'text-lg'
  };

  return (
    <div className={cn(
      "flex items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-blue-600 text-white font-semibold",
      avatarSizeConfigs[size],
      sizeMap[size],
      className
    )}>
      {initials}
    </div>
  );
};

// Enhanced version with fallback support
export const AnimatedTooltipWithFallback: React.FC<AnimatedTooltipProps> = ({
  items,
  className,
  avatarSize = 'md',
  tooltipTheme = 'dark',
  animation = 'gentle'
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const springConfig = animationConfigs[animation];
  const x = useMotionValue(0);
  
  const rotate = useTransform(x, [-100, 100], [-45, 45]);
  const translateX = useSpring(x, springConfig);

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - rect.left - rect.width / 2;
    x.set(offsetX);
  };

  const handleImageError = (id: number) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  const tooltipVariants = {
    initial: { opacity: 0, y: 20, scale: 0.6 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: springConfig.stiffness,
        damping: springConfig.damping
      }
    },
    exit: { opacity: 0, y: 20, scale: 0.6 }
  };

  return (
    <div className={cn("flex flex-row items-center justify-center", className)}>
      {items.map((item, idx) => (
        <div
          className="relative group"
          key={item.name}
          onMouseEnter={() => setHoveredIndex(item.id)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence mode="popLayout">
            {hoveredIndex === item.id && (
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={tooltipVariants}
                style={{
                  translateX: translateX,
                  rotate: rotate,
                  whiteSpace: "nowrap",
                }}
                className={cn(
                  "absolute -top-16 -left-1/2 translate-x-1/2 flex text-xs flex-col items-center justify-center rounded-md z-50 px-4 py-2",
                  tooltipThemeConfigs[tooltipTheme]
                )}
              >
                <div className="font-bold relative z-30 text-base">
                  {item.name}
                </div>
                <div className="text-xs opacity-80">
                  {item.designation}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div
            onMouseMove={handleMouseMove}
            className={cn(
              "relative transition duration-500 cursor-pointer",
              avatarSizeConfigs[avatarSize],
              idx !== 0 && "-ml-4",
              "group-hover:scale-105 group-hover:z-30"
            )}
            style={{
              zIndex: hoveredIndex === item.id ? 30 : 10,
            }}
          >
            {imageErrors[item.id] ? (
              <AvatarFallback 
                name={item.name} 
                size={avatarSize}
                className="border-2 border-white"
              />
            ) : (
              <img
                src={item.image}
                alt={item.name}
                onError={() => handleImageError(item.id)}
                className={cn(
                  "w-full h-full object-cover rounded-full border-2 border-white",
                  avatarSizeConfigs[avatarSize]
                )}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnimatedTooltip;