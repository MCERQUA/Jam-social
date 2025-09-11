"use client";

import React, { useEffect, useRef, ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'blue' | 'purple' | 'green' | 'red' | 'orange' | 'pink' | 'indigo';
  size?: 'sm' | 'md' | 'lg';
  width?: string;
  height?: string;
  customSize?: boolean;
  intensity?: 'low' | 'medium' | 'high';
  speed?: 'slow' | 'normal' | 'fast';
}

const sizeConfigs = {
  sm: { width: '250px', height: '200px' },
  md: { width: '350px', height: '280px' },
  lg: { width: '450px', height: '360px' }
};

const colorConfigs = {
  blue: {
    primary: 'rgba(59, 130, 246, 0.15)',
    border: 'rgba(59, 130, 246, 0.3)',
    glow: '59, 130, 246'
  },
  purple: {
    primary: 'rgba(147, 51, 234, 0.15)',
    border: 'rgba(147, 51, 234, 0.3)',
    glow: '147, 51, 234'
  },
  green: {
    primary: 'rgba(34, 197, 94, 0.15)',
    border: 'rgba(34, 197, 94, 0.3)',
    glow: '34, 197, 94'
  },
  red: {
    primary: 'rgba(239, 68, 68, 0.15)',
    border: 'rgba(239, 68, 68, 0.3)',
    glow: '239, 68, 68'
  },
  orange: {
    primary: 'rgba(249, 115, 22, 0.15)',
    border: 'rgba(249, 115, 22, 0.3)',
    glow: '249, 115, 22'
  },
  pink: {
    primary: 'rgba(236, 72, 153, 0.15)',
    border: 'rgba(236, 72, 153, 0.3)',
    glow: '236, 72, 153'
  },
  indigo: {
    primary: 'rgba(99, 102, 241, 0.15)',
    border: 'rgba(99, 102, 241, 0.3)',
    glow: '99, 102, 241'
  }
};

const intensityConfigs = {
  low: { opacity: 0.6, blur: 20, scale: 0.8 },
  medium: { opacity: 0.8, blur: 15, scale: 1 },
  high: { opacity: 1, blur: 10, scale: 1.2 }
};

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className,
  glowColor = 'blue',
  size = 'md',
  width,
  height,
  customSize = false,
  intensity = 'medium',
  speed = 'normal'
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const colorConfig = colorConfigs[glowColor];
  const intensityConfig = intensityConfigs[intensity];
  const sizeConfig = sizeConfigs[size];

  const transitionSpeed = {
    slow: '0.5s',
    normal: '0.3s',
    fast: '0.15s'
  }[speed];

  const updateMousePosition = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 50, y: 50 }); // Reset to center
  };

  const cardStyle: React.CSSProperties = {
    width: customSize ? width : sizeConfig.width,
    height: customSize ? height : sizeConfig.height,
    background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, ${colorConfig.primary} 0%, transparent 50%)`,
    border: `1px solid ${colorConfig.border}`,
    transition: `all ${transitionSpeed} ease`,
    position: 'relative',
    borderRadius: '12px',
    overflow: 'hidden',
    transform: isHovered ? `scale(${intensityConfig.scale})` : 'scale(1)',
    boxShadow: isHovered 
      ? `0 0 ${intensityConfig.blur}px rgba(${colorConfig.glow}, ${intensityConfig.opacity})`
      : 'none',
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        'relative group cursor-pointer backdrop-blur-sm',
        className
      )}
      style={cardStyle}
      onMouseMove={updateMousePosition}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glow overlay */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle 150px at ${mousePosition.x}% ${mousePosition.y}%, rgba(${colorConfig.glow}, 0.1) 0%, transparent 100%)`,
        }}
      />
      
      {/* Border glow */}
      <div 
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `conic-gradient(from 0deg at ${mousePosition.x}% ${mousePosition.y}%, transparent 0deg, rgba(${colorConfig.glow}, 0.2) 60deg, transparent 120deg, rgba(${colorConfig.glow}, 0.4) 180deg, transparent 240deg, rgba(${colorConfig.glow}, 0.2) 300deg, transparent 360deg)`,
          padding: '1px',
          borderRadius: '12px',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'subtract',
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 h-full">
        {children}
      </div>
      
      {/* Subtle animated background pattern */}
      <div 
        className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, rgba(${colorConfig.glow}, 0.1) 0px, transparent 1px, transparent 10px, rgba(${colorConfig.glow}, 0.1) 11px)`,
          animation: 'shimmer 3s ease-in-out infinite',
        }}
      />
      
      <style jsx>{`
        @keyframes shimmer {
          0%, 100% { opacity: 0.05; }
          50% { opacity: 0.15; }
        }
      `}</style>
    </div>
  );
};