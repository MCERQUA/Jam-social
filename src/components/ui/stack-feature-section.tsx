"use client";

import React from 'react';
import {
  Code,
  Palette,
  Camera,
  Gamepad2,
  Youtube,
  Facebook,
  Zap,
  Database,
  Cloud,
  Smartphone,
  Globe,
  Cpu,
  Github,
  Twitter,
  Linkedin,
  Instagram
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Simple button component - replace with your actual button component
const Button = ({ variant = "default", children, className, ...props }: {
  variant?: "default" | "outline";
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) => {
  const baseStyles = "px-6 py-3 rounded-lg font-medium transition-all duration-300";
  const variants = {
    default: "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl",
    outline: "border-2 border-gray-500 text-gray-200 hover:bg-gray-800/50 backdrop-blur-sm"
  };
  
  return (
    <button 
      className={cn(baseStyles, variants[variant], className)} 
      {...props}
    >
      {children}
    </button>
  );
};

interface FeatureSectionProps {
  title?: string;
  description?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  className?: string;
}

const iconConfigs = [
  { Icon: Code, color: "text-purple-600", name: "Development" },
  { Icon: Palette, color: "text-red-600", name: "Design" },
  { Icon: Camera, color: "text-blue-600", name: "Photography" },
  { Icon: Gamepad2, color: "text-green-600", name: "Gaming" },
  { Icon: Youtube, color: "text-red-500", name: "YouTube" },
  { Icon: Facebook, color: "text-blue-500", name: "Facebook" },
  { Icon: Zap, color: "text-yellow-500", name: "Performance" },
  { Icon: Database, color: "text-indigo-600", name: "Database" },
  { Icon: Cloud, color: "text-sky-500", name: "Cloud" },
  { Icon: Smartphone, color: "text-gray-700", name: "Mobile" },
  { Icon: Globe, color: "text-emerald-600", name: "Web" },
  { Icon: Cpu, color: "text-orange-600", name: "Backend" },
  { Icon: Github, color: "text-gray-800", name: "GitHub" },
  { Icon: Twitter, color: "text-blue-400", name: "Twitter" },
  { Icon: Linkedin, color: "text-blue-700", name: "LinkedIn" }
];

export const StackFeatureSection: React.FC<FeatureSectionProps> = ({
  title = "Schedule your success with Jam Social",
  description = "Automate your social media posting across all platforms. Create, schedule, and optimize your content strategy effortlessly.",
  primaryButtonText = "Start Managing",
  secondaryButtonText = "See Features",
  onPrimaryClick,
  onSecondaryClick,
  className
}) => {
  const orbitCount = 3;
  const baseRadius = 80;
  const orbitGap = 40;
  const iconsPerOrbit = Math.ceil(iconConfigs.length / orbitCount);

  const getOrbitIcons = (orbitIndex: number) => {
    const startIndex = orbitIndex * iconsPerOrbit;
    const endIndex = Math.min(startIndex + iconsPerOrbit, iconConfigs.length);
    return iconConfigs.slice(startIndex, endIndex);
  };

  const getIconPosition = (iconIndex: number, totalIcons: number, radius: number) => {
    const angle = (iconIndex * 360) / totalIcons;
    const radians = (angle * Math.PI) / 180;
    return {
      x: Math.cos(radians) * radius,
      y: Math.sin(radians) * radius,
    };
  };

  return (
    <section className={cn(
      "relative max-w-6xl mx-auto my-16 px-10 flex items-center justify-between h-[30rem] overflow-visible",
      className
    )}>
      {/* Left side: Content */}
      <div className="w-1/2 z-10 pr-8">
        <h1 className="text-4xl sm:text-6xl font-bold mb-4 text-white drop-shadow-lg">
          {title}
        </h1>
        <p className="text-gray-200 mb-6 max-w-lg text-lg">
          {description}
        </p>
        <div className="flex items-center gap-3">
          <Button variant="default" onClick={onPrimaryClick}>
            {primaryButtonText}
          </Button>
          <Button variant="outline" onClick={onSecondaryClick}>
            {secondaryButtonText}
          </Button>
        </div>
      </div>
      
      {/* Right side: Orbiting Icons */}
      <div className="w-1/2 relative flex items-center justify-center h-full">
        <div className="relative">
          {/* Create orbits */}
          {Array.from({ length: orbitCount }).map((_, orbitIndex) => {
            const radius = baseRadius + (orbitIndex * orbitGap);
            const orbitIcons = getOrbitIcons(orbitIndex);
            const animationDuration = 20 + (orbitIndex * 5); // Different speeds for each orbit
            
            return (
              <div
                key={orbitIndex}
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  animation: `spin ${animationDuration}s linear infinite`,
                }}
              >
                {orbitIcons.map((config, iconIndex) => {
                  const { x, y } = getIconPosition(iconIndex, orbitIcons.length, radius);
                  return (
                    <div
                      key={`${orbitIndex}-${iconIndex}`}
                      className="absolute flex items-center justify-center"
                      style={{
                        transform: `translate(${x}px, ${y}px)`,
                      }}
                    >
                      <div 
                        className="w-10 h-10 rounded-full bg-gray-900/80 backdrop-blur-sm shadow-lg flex items-center justify-center border border-gray-700/50"
                        style={{
                          animation: `spin ${animationDuration}s linear infinite reverse`, // Counter-rotation to keep icons upright
                        }}
                      >
                        <config.Icon className={cn("w-5 h-5", config.color)} />
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* CSS for animations */}
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
    </section>
  );
};

export default StackFeatureSection;