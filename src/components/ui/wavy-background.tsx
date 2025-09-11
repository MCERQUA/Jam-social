"use client";

import React, { useEffect, useRef } from 'react';
import { createNoise3D } from 'simplex-noise';
import { cn } from '@/lib/utils';

interface WavyBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
  [key: string]: any;
}

export const WavyBackground: React.FC<WavyBackgroundProps> = ({
  children,
  className,
  containerClassName,
  colors = ["#38bdf8", "#818cf8", "#c084fc", "#e879f9", "#22d3ee"],
  waveWidth = 50,
  backgroundFill = "black",
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const noise = createNoise3D();
  let animationId: number;
  let time = 0;

  const drawWave = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const w = canvas.width;
    const h = canvas.height;
    
    // Clear canvas
    ctx.fillStyle = backgroundFill;
    ctx.globalAlpha = 1;
    ctx.fillRect(0, 0, w, h);
    
    // Set blur
    ctx.filter = `blur(${blur}px)`;
    
    for (let i = 0; i < colors.length; i++) {
      ctx.globalAlpha = waveOpacity;
      ctx.fillStyle = colors[i];
      
      const yOffset = h * (0.3 + (i * 0.1));
      
      ctx.beginPath();
      ctx.moveTo(0, yOffset);
      
      for (let x = 0; x <= w; x += 2) {
        const y = yOffset + 
          Math.sin((x * 0.01) + time * (speed === "fast" ? 0.02 : 0.005)) * waveWidth +
          noise(x * 0.01, time * (speed === "fast" ? 0.01 : 0.005), i) * waveWidth * 0.5;
        ctx.lineTo(x, y);
      }
      
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();
    }
    
    ctx.filter = 'none';
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    time += 1;
    drawWave(ctx, canvas);
    animationId = requestAnimationFrame(animate);
  };

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }
    
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    resizeCanvas();
    animate();
    
    const handleResize = () => {
      resizeCanvas();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [colors, waveWidth, backgroundFill, blur, speed, waveOpacity]);

  return (
    <div
      className={cn(
        'fixed inset-0 w-full h-full overflow-hidden',
        containerClassName
      )}
      {...props}
    >
      <canvas
        className="absolute inset-0 w-full h-full"
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          ...(backgroundFill && { backgroundColor: backgroundFill }),
        }}
      />
      <div className={cn('relative z-10 w-full h-full flex flex-col items-center justify-center', className)}>
        {children}
      </div>
    </div>
  );
};