"use client";

import React from "react";
import { motion } from "framer-motion";

export const FloatingLoginButton: React.FC = () => {
  return (
    <motion.a
      href="/login"
      className="fixed bottom-6 left-6 z-50 group"
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
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 animate-ping opacity-75" />

      {/* Black background circle */}
      <div className="relative w-16 h-16 bg-black rounded-full flex items-center justify-center border-2 border-transparent m-[2px]">
        {/* Login/User icon */}
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
            d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
          />
        </svg>

        {/* Hover tooltip */}
        <motion.div
          className="absolute bottom-full mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          initial={{ y: 10 }}
          whileHover={{ y: 0 }}
        >
          Login
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
            <div className="border-4 border-transparent border-t-gray-900" />
          </div>
        </motion.div>
      </div>
    </motion.a>
  );
};
