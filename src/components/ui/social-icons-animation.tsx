"use client";

import React from "react";
import { motion } from "framer-motion";

const socialPlatforms = [
  { name: "Instagram", icon: "/social-icons/instagram.svg", color: "#E4405F" },
  { name: "LinkedIn", icon: "/social-icons/linkedin.svg", color: "#0A66C2" },
  { name: "TikTok", icon: "/social-icons/tiktok.svg", color: "#000000" },
  { name: "X", icon: "/social-icons/x.svg", color: "#000000" },
  { name: "Facebook", icon: "/social-icons/facebook.svg", color: "#1877F2" },
  { name: "YouTube", icon: "/social-icons/youtube.svg", color: "#FF0000" },
  { name: "Pinterest", icon: "/social-icons/pinterest.svg", color: "#BD081C" },
  { name: "Google Business", icon: "/social-icons/google.svg", color: "#4285F4" },
  { name: "Threads", icon: "/social-icons/threads.svg", color: "#000000" },
  { name: "Snapchat", icon: "/social-icons/snapchat.svg", color: "#FFFC00" },
  { name: "Bluesky", icon: "/social-icons/bluesky.svg", color: "#00A8E8" },
  { name: "Reddit", icon: "/social-icons/reddit.svg", color: "#FF4500" },
];

export function SocialIconsAnimation() {
  return (
    <div className="relative w-full h-[400px] overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full max-w-6xl h-full">
          {socialPlatforms.map((platform, index) => {
            const angle = (index * 360) / socialPlatforms.length;
            const radius = 200;
            const x = Math.cos((angle * Math.PI) / 180) * radius;
            const y = Math.sin((angle * Math.PI) / 180) * radius;
            
            return (
              <motion.div
                key={platform.name}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                initial={{
                  x: 0,
                  y: 0,
                  opacity: 0,
                  scale: 0,
                }}
                animate={{
                  x: [0, x * 0.5, x, x * 0.8, x],
                  y: [0, y * 0.5, y, y * 0.8, y],
                  opacity: [0, 1, 1, 1, 0.8],
                  scale: [0, 1.2, 1, 1, 1],
                  rotate: [0, 360, 720, 720, 720],
                }}
                transition={{
                  duration: 20,
                  delay: index * 0.2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
              >
                <motion.div
                  className="relative group cursor-pointer"
                  whileHover={{ scale: 1.3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div
                    className="absolute inset-0 rounded-full blur-xl opacity-50"
                    style={{ backgroundColor: platform.color }}
                  />
                  <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                    <img
                      src={platform.icon}
                      alt={platform.name}
                      className="w-12 h-12 object-contain"
                      style={{ filter: "brightness(0) invert(1)" }}
                    />
                  </div>
                  <motion.div
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-white text-xs font-medium opacity-0 group-hover:opacity-100 whitespace-nowrap"
                    transition={{ duration: 0.2 }}
                  >
                    {platform.name}
                  </motion.div>
                </motion.div>
              </motion.div>
            );
          })}
          
          {/* Center focal point */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-20 blur-2xl" />
          </motion.div>
          
          {/* Connecting lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {socialPlatforms.map((_, index) => {
              const angle1 = (index * 360) / socialPlatforms.length;
              const angle2 = ((index + 1) * 360) / socialPlatforms.length;
              const radius = 200;
              const x1 = Math.cos((angle1 * Math.PI) / 180) * radius + 300;
              const y1 = Math.sin((angle1 * Math.PI) / 180) * radius + 200;
              const x2 = Math.cos((angle2 * Math.PI) / 180) * radius + 300;
              const y2 = Math.sin((angle2 * Math.PI) / 180) * radius + 200;
              
              return (
                <motion.line
                  key={`line-${index}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="url(#gradient)"
                  strokeWidth="0.5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{
                    pathLength: [0, 1, 1, 0],
                    opacity: [0, 0.3, 0.3, 0],
                  }}
                  transition={{
                    duration: 10,
                    delay: index * 0.1,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              );
            })}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.5" />
                <stop offset="50%" stopColor="#EC4899" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.5" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      
      {/* Title */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
          All Platforms. One Strategy.
        </h2>
        <p className="text-gray-300 text-lg">
          Unified social media management across every major platform
        </p>
      </div>
    </div>
  );
}