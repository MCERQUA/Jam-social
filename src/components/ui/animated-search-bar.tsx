"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnimatedSearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  onFilterClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  theme?: 'dark' | 'light' | 'gradient';
  showFilter?: boolean;
  autoFocus?: boolean;
}

const sizeConfigs = {
  sm: { width: '250px', height: '40px', padding: '0 40px', fontSize: '14px' },
  md: { width: '301px', height: '56px', padding: '0 59px', fontSize: '16px' },
  lg: { width: '400px', height: '70px', padding: '0 70px', fontSize: '18px' }
};

const themeConfigs = {
  dark: {
    background: '#010201',
    text: 'white',
    placeholder: 'gray-400',
    border: 'transparent'
  },
  light: {
    background: 'white',
    text: 'black',
    placeholder: 'gray-500',
    border: 'gray-300'
  },
  gradient: {
    background: 'transparent',
    text: 'white',
    placeholder: 'gray-300',
    border: 'transparent'
  }
};

export const AnimatedSearchBar: React.FC<AnimatedSearchBarProps> = ({
  placeholder = "Search...",
  value,
  onChange,
  onSubmit,
  onFilterClick,
  className,
  size = 'md',
  theme = 'dark',
  showFilter = true,
  autoFocus = false,
}) => {
  const [internalValue, setInternalValue] = useState(value || '');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const sizeConfig = sizeConfigs[size];
  const themeConfig = themeConfigs[theme];

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(internalValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <div 
        ref={containerRef}
        className="relative group"
        style={{ width: sizeConfig.width, height: sizeConfig.height }}
      >
        {/* Animated gradient background layers */}
        <div className="absolute inset-0 rounded-lg opacity-75 blur-sm">
          <div 
            className="absolute inset-0 rounded-lg"
            style={{
              background: theme === 'gradient' 
                ? 'linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000)'
                : themeConfig.background,
              backgroundSize: theme === 'gradient' ? '400% 400%' : 'auto',
              animation: theme === 'gradient' ? 'gradient 20s ease infinite' : 'none',
            }}
          />
        </div>
        
        {/* Glow effect layer */}
        <div 
          className={cn(
            "absolute inset-0 rounded-lg transition-all duration-300",
            isFocused ? "opacity-100 scale-105" : "opacity-60 scale-100"
          )}
          style={{
            background: theme === 'gradient' 
              ? 'linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000)'
              : `${themeConfig.background}`,
            backgroundSize: theme === 'gradient' ? '400% 400%' : 'auto',
            animation: theme === 'gradient' ? 'gradient 20s ease infinite' : 'none',
            filter: 'blur(2px)',
          }}
        />
        
        {/* Main container */}
        <div 
          className="relative rounded-lg overflow-hidden"
          style={{ 
            backgroundColor: theme === 'gradient' ? 'rgba(0,0,0,0.8)' : themeConfig.background,
            border: themeConfig.border !== 'transparent' ? `1px solid ${themeConfig.border}` : 'none',
          }}
        >
          <form onSubmit={handleSubmit} className="relative h-full">
            {/* Search icon */}
            <Search 
              className={cn(
                "absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors",
                isFocused ? "text-gray-300" : "text-gray-400"
              )} 
            />
            
            {/* Input field */}
            <input
              ref={inputRef}
              type="text"
              value={internalValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              className={cn(
                "w-full h-full bg-transparent border-none outline-none transition-all duration-300",
                `text-${themeConfig.text}`,
                `placeholder-${themeConfig.placeholder}`
              )}
              style={{
                padding: sizeConfig.padding,
                fontSize: sizeConfig.fontSize,
                color: themeConfig.text,
              }}
            />
            
            {/* Filter icon */}
            {showFilter && (
              <button
                type="button"
                onClick={onFilterClick}
                className={cn(
                  "absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors hover:scale-110",
                  isFocused ? "text-gray-300" : "text-gray-400"
                )}
              >
                <Filter className="w-full h-full" />
              </button>
            )}
          </form>
        </div>
        
        {/* Hover glow enhancement */}
        <div 
          className={cn(
            "absolute inset-0 rounded-lg pointer-events-none transition-opacity duration-300",
            "group-hover:opacity-100 opacity-0"
          )}
          style={{
            background: theme === 'gradient' 
              ? 'linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000)'
              : 'rgba(255,255,255,0.1)',
            backgroundSize: theme === 'gradient' ? '400% 400%' : 'auto',
            animation: theme === 'gradient' ? 'gradient 20s ease infinite' : 'none',
            filter: 'blur(4px)',
          }}
        />
      </div>
      
      <style jsx>{`
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </div>
  );
};