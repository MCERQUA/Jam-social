"use client";

import React from "react";
import { motion } from "framer-motion";

export const FloatingChatButton: React.FC = () => {
  return (
    <motion.a
      href="https://chat.jamsocial.app"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.5 
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Animated gradient border */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 animate-spin-slow" />
      
      {/* Pulse animation ring */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-ping opacity-75" />
      
      {/* Black background circle */}
      <div className="relative w-16 h-16 bg-black rounded-full flex items-center justify-center border-2 border-transparent m-[2px]">
        {/* Chat icon */}
        <svg
          className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        
        {/* Hover tooltip */}
        <motion.div
          className="absolute bottom-full mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          initial={{ y: 10 }}
          whileHover={{ y: 0 }}
        >
          Chat with AI
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
            <div className="border-4 border-transparent border-t-gray-900" />
          </div>
        </motion.div>
      </div>
    </motion.a>
  );
};