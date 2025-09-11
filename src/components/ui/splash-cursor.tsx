"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface SplashCursorProps {
  className?: string;
  splashColor?: string;
  splashSize?: number;
  fadeSpeed?: number;
  enabled?: boolean;
}

interface Splash {
  id: number;
  x: number;
  y: number;
  timestamp: number;
  color: string;
}

export const SplashCursor: React.FC<SplashCursorProps> = ({
  className,
  splashColor = "#3b82f6",
  splashSize = 100,
  fadeSpeed = 2000, // ms
  enabled = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [splashes, setSplashes] = useState<Splash[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseDown, setIsMouseDown] = useState(false);

  const createSplash = useCallback((x: number, y: number) => {
    const newSplash: Splash = {
      id: Date.now() + Math.random(),
      x,
      y,
      timestamp: Date.now(),
      color: splashColor,
    };
    
    setSplashes(prev => [...prev, newSplash]);
    
    // Remove splash after fade duration
    setTimeout(() => {
      setSplashes(prev => prev.filter(splash => splash.id !== newSplash.id));
    }, fadeSpeed);
  }, [splashColor, fadeSpeed]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!enabled) return;
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePosition({ x, y });
      
      // Create continuous splashes when mouse is down
      if (isMouseDown) {
        createSplash(x, y);
      }
    }
  }, [enabled, isMouseDown, createSplash]);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (!enabled) return;
    
    setIsMouseDown(true);
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      createSplash(x, y);
    }
  }, [enabled, createSplash]);

  const handleMouseUp = useCallback(() => {
    setIsMouseDown(false);
  }, []);

  const handleClick = useCallback((e: MouseEvent) => {
    if (!enabled) return;
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      createSplash(x, y);
    }
  }, [enabled, createSplash]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled) return;

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('click', handleClick);
    
    // Global mouse up to handle mouse up outside container
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('click', handleClick);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [enabled, handleMouseMove, handleMouseDown, handleMouseUp, handleClick]);

  return (
    <div
      ref={containerRef}
      className={cn("absolute inset-0 pointer-events-auto overflow-hidden", className)}
      style={{ 
        cursor: enabled ? 'none' : 'auto',
        background: 'transparent',
      }}
    >
      {/* Custom cursor */}
      {enabled && (
        <div
          className="absolute pointer-events-none z-50 mix-blend-difference"
          style={{
            left: mousePosition.x - 6,
            top: mousePosition.y - 6,
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: 'white',
            transition: 'transform 0.1s ease',
            transform: isMouseDown ? 'scale(1.5)' : 'scale(1)',
          }}
        />
      )}
      
      {/* Splash effects */}
      {splashes.map((splash) => {
        const age = Date.now() - splash.timestamp;
        const progress = age / fadeSpeed;
        const opacity = Math.max(0, 1 - progress);
        const scale = 0.1 + progress * 0.9;
        
        return (
          <div
            key={splash.id}
            className="absolute pointer-events-none"
            style={{
              left: splash.x - splashSize / 2,
              top: splash.y - splashSize / 2,
              width: splashSize,
              height: splashSize,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${splash.color}40 0%, ${splash.color}20 30%, transparent 70%)`,
              opacity,
              transform: `scale(${scale})`,
              transition: 'opacity 0.1s ease, transform 0.1s ease',
              filter: 'blur(1px)',
            }}
          />
        );
      })}
      
      {/* Trailing effect */}
      {enabled && (
        <div
          className="absolute pointer-events-none z-40"
          style={{
            left: mousePosition.x - 20,
            top: mousePosition.y - 20,
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${splashColor}10 0%, transparent 70%)`,
            transition: 'all 0.15s ease',
            filter: 'blur(2px)',
          }}
        />
      )}
      
      {/* Ripple effect on mouse down */}
      {isMouseDown && enabled && (
        <div
          className="absolute pointer-events-none z-30"
          style={{
            left: mousePosition.x - 50,
            top: mousePosition.y - 50,
            width: 100,
            height: 100,
            borderRadius: '50%',
            border: `2px solid ${splashColor}40`,
            animation: 'ripple 0.6s ease-out infinite',
          }}
        />
      )}
      
      <style jsx>{`
        @keyframes ripple {
          0% {
            transform: scale(0.1);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};