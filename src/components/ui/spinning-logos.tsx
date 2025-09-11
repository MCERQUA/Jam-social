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
  Instagram,
  Monitor,
  Wifi,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Logo {
  Icon: React.ComponentType<any>;
  className: string;
  name: string;
}

interface SpinningLogosProps {
  logos?: Logo[];
  radiusToCenterOfIcons?: number;
  iconWrapperWidth?: number;
  ringPadding?: number;
  className?: string;
  speed?: 'slow' | 'normal' | 'fast';
  direction?: 'clockwise' | 'counterclockwise';
  size?: 'sm' | 'md' | 'lg';
}

const defaultLogos: Logo[] = [
  { Icon: Code, className: 'bg-purple-600 text-white', name: 'Development' },
  { Icon: Palette, className: 'bg-red-600 text-white', name: 'Design' },
  { Icon: Camera, className: 'bg-blue-600 text-white', name: 'Photography' },
  { Icon: Gamepad2, className: 'bg-green-600 text-white', name: 'Gaming' },
  { Icon: Youtube, className: 'bg-red-500 text-white', name: 'YouTube' },
  { Icon: Facebook, className: 'bg-blue-500 text-white', name: 'Facebook' },
  { Icon: Zap, className: 'bg-yellow-500 text-white', name: 'Performance' },
  { Icon: Database, className: 'bg-indigo-600 text-white', name: 'Database' },
  { Icon: Cloud, className: 'bg-sky-500 text-white', name: 'Cloud' },
  { Icon: Smartphone, className: 'bg-gray-700 text-white', name: 'Mobile' },
  { Icon: Globe, className: 'bg-emerald-600 text-white', name: 'Web' },
  { Icon: Cpu, className: 'bg-orange-600 text-white', name: 'Backend' },
  { Icon: Github, className: 'bg-gray-800 text-white', name: 'GitHub' },
  { Icon: Twitter, className: 'bg-blue-400 text-white', name: 'Twitter' },
  { Icon: Linkedin, className: 'bg-blue-700 text-white', name: 'LinkedIn' },
  { Icon: Instagram, className: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white', name: 'Instagram' },
  { Icon: Monitor, className: 'bg-slate-600 text-white', name: 'Desktop' },
  { Icon: Wifi, className: 'bg-cyan-500 text-white', name: 'Network' },
  { Icon: Shield, className: 'bg-teal-600 text-white', name: 'Security' }
];

const sizeConfigs = {
  sm: { radius: 120, iconSize: 40, padding: 30 },
  md: { radius: 180, iconSize: 60, padding: 40 },
  lg: { radius: 240, iconSize: 80, padding: 50 }
};

const speedConfigs = {
  slow: '30s',
  normal: '20s',
  fast: '10s'
};

const toRadians = (degrees: number): number => (Math.PI / 180) * degrees;

const calculatePosition = (index: number, totalLogos: number, radius: number) => {
  const angle = (360 / totalLogos) * index;
  const radians = toRadians(angle);
  
  return {
    x: Math.cos(radians) * radius,
    y: Math.sin(radians) * radius
  };
};

export const SpinningLogos: React.FC<SpinningLogosProps> = ({
  logos = defaultLogos,
  radiusToCenterOfIcons,
  iconWrapperWidth,
  ringPadding,
  className,
  speed = 'normal',
  direction = 'clockwise',
  size = 'md'
}) => {
  const sizeConfig = sizeConfigs[size];
  const radius = radiusToCenterOfIcons || sizeConfig.radius;
  const iconSize = iconWrapperWidth || sizeConfig.iconSize;
  const padding = ringPadding || sizeConfig.padding;
  const animationDuration = speedConfigs[speed];
  const animationDirection = direction === 'clockwise' ? 'normal' : 'reverse';

  const containerSize = (radius + iconSize/2 + padding) * 2;

  return (
    <div 
      className={cn("relative flex items-center justify-center", className)}
      style={{ 
        width: containerSize, 
        height: containerSize,
        minWidth: containerSize,
        minHeight: containerSize
      }}
    >
      {/* Spinning container */}
      <div
        className="relative"
        style={{
          width: radius * 2,
          height: radius * 2,
          animation: `spin ${animationDuration} linear infinite ${animationDirection}`,
        }}
      >
        {logos.map((logo, index) => {
          const { x, y } = calculatePosition(index, logos.length, radius);
          
          return (
            <div
              key={`${logo.name}-${index}`}
              className="absolute flex items-center justify-center"
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              }}
            >
              <div
                className={cn(
                  "rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl border-2 border-white/20",
                  logo.className
                )}
                style={{
                  width: iconSize,
                  height: iconSize,
                  animation: `spin ${animationDuration} linear infinite reverse ${animationDirection}`, // Counter-rotation
                }}
                title={logo.name}
              >
                <logo.Icon 
                  className="w-1/2 h-1/2" 
                  style={{ minWidth: '16px', minHeight: '16px' }}
                />
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Center content area (optional) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm" />
      </div>
      
      {/* Decorative rings */}
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          width: containerSize,
          height: containerSize,
        }}
      >
        <div 
          className="rounded-full border border-white/5"
          style={{
            width: radius * 2 + 40,
            height: radius * 2 + 40,
          }}
        />
        <div 
          className="absolute rounded-full border border-white/3"
          style={{
            width: radius * 2 + 80,
            height: radius * 2 + 80,
          }}
        />
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
};