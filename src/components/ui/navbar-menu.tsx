"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export const MenuItem = ({
  setActive,
  active,
  item,
  children,
}: {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
}) => {
  return (
    <div onMouseEnter={() => setActive(item)} className="relative">
      <motion.p
        transition={{ duration: 0.3 }}
        className="cursor-pointer text-gray-800 hover:text-pink-600 dark:text-white dark:hover:text-pink-400 font-medium"
      >
        {item}
      </motion.p>
      {active !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
        >
          {active === item && (
            <div className="absolute top-[calc(100%_+_1.2rem)] left-1/2 transform -translate-x-1/2 pt-4">
              <motion.div
                transition={transition}
                layoutId="active"
                className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50 shadow-2xl"
              >
                <motion.div layout className="w-max h-full p-4">
                  {children}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export const Menu = ({
  setActive,
  children,
}: {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
}) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)}
      className="relative rounded-full border border-transparent dark:bg-gray-900/90 dark:border-gray-700/50 bg-white/90 backdrop-blur-md shadow-lg flex justify-center space-x-6 px-8 py-4"
    >
      {children}
    </nav>
  );
};

export const HoveredLink = ({ 
  children, 
  href,
  className = "",
  ...rest 
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
  [key: string]: any;
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    console.log('Link clicked:', href); // Debug log
    
    // For paths starting with /
    if (href.startsWith('/')) {
      e.preventDefault();
      e.stopPropagation();
      // Use replace for immediate navigation
      window.location.replace(href);
      return false;
    } 
    // For hash links on same page
    else if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      onMouseDown={(e) => e.preventDefault()} // Prevent default mouse down
      className={`text-neutral-700 dark:text-neutral-200 hover:text-pink-500 hover:bg-pink-100 dark:hover:bg-pink-900/20 p-1 rounded transition-all duration-200 cursor-pointer block ${className}`}
      {...rest}
    >
      {children}
    </a>
  );
};

export const ProductItem = ({
  title,
  description,
  href,
  src,
}: {
  title: string;
  description: string;
  href: string;
  src: string;
}) => {
  return (
    <a href={href} className="flex space-x-2">
      <img
        src={src}
        width={140}
        height={70}
        alt={title}
        className="flex-shrink-0 rounded-md shadow-2xl"
      />
      <div>
        <h4 className="text-xl font-bold mb-1 text-black dark:text-white">
          {title}
        </h4>
        <p className="text-neutral-700 text-sm max-w-[10rem] dark:text-neutral-300">
          {description}
        </p>
      </div>
    </a>
  );
};