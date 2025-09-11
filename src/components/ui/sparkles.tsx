"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SparklesCoreProps {
  id?: string;
  className?: string;
  background?: string;
  particleSize?: number;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleColor?: string;
  particleDensity?: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
}

export const SparklesCore: React.FC<SparklesCoreProps> = ({
  id,
  className,
  background = "transparent",
  particleSize = 1,
  minSize = 0.4,
  maxSize = 1,
  speed = 1,
  particleColor = "#FFFFFF",
  particleDensity = 1200,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const animationFrameRef = useRef<number>();

  const createParticle = useCallback((index: number): Particle => {
    const size = minSize + Math.random() * (maxSize - minSize);
    return {
      id: index,
      x: Math.random() * dimensions.width,
      y: Math.random() * dimensions.height,
      size: size,
      speedX: (Math.random() - 0.5) * speed,
      speedY: (Math.random() - 0.5) * speed,
      opacity: Math.random(),
      color: particleColor,
    };
  }, [dimensions, minSize, maxSize, speed, particleColor]);

  const initializeParticles = useCallback(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;
    
    const particleCount = Math.min(
      Math.floor((dimensions.width * dimensions.height) / particleDensity),
      200 // Max particles for performance
    );
    
    const newParticles = Array.from({ length: particleCount }, (_, i) => 
      createParticle(i)
    );
    
    setParticles(newParticles);
  }, [dimensions, particleDensity, createParticle]);

  const updateParticles = useCallback(() => {
    setParticles(prevParticles =>
      prevParticles.map(particle => {
        let newX = particle.x + particle.speedX;
        let newY = particle.y + particle.speedY;
        let newSpeedX = particle.speedX;
        let newSpeedY = particle.speedY;

        // Bounce off walls
        if (newX <= 0 || newX >= dimensions.width) {
          newSpeedX = -particle.speedX;
          newX = Math.max(0, Math.min(dimensions.width, newX));
        }
        if (newY <= 0 || newY >= dimensions.height) {
          newSpeedY = -particle.speedY;
          newY = Math.max(0, Math.min(dimensions.height, newY));
        }

        return {
          ...particle,
          x: newX,
          y: newY,
          speedX: newSpeedX,
          speedY: newSpeedY,
          opacity: 0.3 + Math.sin(Date.now() * 0.001 + particle.id) * 0.4,
        };
      })
    );
  }, [dimensions]);

  const animate = useCallback(() => {
    updateParticles();
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [updateParticles]);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: rect.width,
          height: rect.height,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  useEffect(() => {
    initializeParticles();
  }, [initializeParticles]);

  useEffect(() => {
    if (particles.length > 0) {
      animate();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [particles.length, animate]);

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
      style={{ background }}
      id={id}
    >
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size * particleSize,
              height: particle.size * particleSize,
              backgroundColor: particle.color,
              opacity: particle.opacity,
            }}
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      
      {/* Interactive sparkles on mouse hover */}
      <div 
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
        onMouseMove={(e) => {
          const rect = containerRef.current?.getBoundingClientRect();
          if (rect) {
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Add temporary sparkles around mouse
            const tempSparkles = Array.from({ length: 3 }, (_, i) => ({
              id: Date.now() + i,
              x: x + (Math.random() - 0.5) * 50,
              y: y + (Math.random() - 0.5) * 50,
              size: 0.5 + Math.random() * 0.5,
              speedX: (Math.random() - 0.5) * 2,
              speedY: (Math.random() - 0.5) * 2,
              opacity: 1,
              color: particleColor,
            }));
            
            setParticles(prev => [...prev, ...tempSparkles]);
            
            // Remove temp sparkles after a short delay
            setTimeout(() => {
              setParticles(prev => 
                prev.filter(p => !tempSparkles.some(ts => ts.id === p.id))
              );
            }, 1000);
          }
        }}
      >
        {/* Invisible overlay for mouse interaction */}
      </div>
    </div>
  );
};