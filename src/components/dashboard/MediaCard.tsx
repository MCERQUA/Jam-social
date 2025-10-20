"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export interface MediaItem {
  id: string;
  type: "video" | "image" | "scene" | "project";
  title: string;
  thumbnail: string;
  duration?: string;
  resolution?: string;
  size: string;
  date: string;
  package?: string;
  tags: string[];
  favorite: boolean;
}

interface MediaCardProps {
  item: MediaItem;
  onPreview?: (item: MediaItem) => void;
}

export const MediaCard: React.FC<MediaCardProps> = ({ item, onPreview }) => {
  const [isHovered, setIsHovered] = useState(false);

  const typeIcons = {
    video: "🎥",
    image: "🖼️",
    scene: "🎬",
    project: "📁",
  };

  return (
    <motion.div
      className="group relative bg-gray-800/60 backdrop-blur-sm border border-gray-500/20 rounded-xl overflow-hidden transition-all duration-300 hover:bg-gray-700/80 hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-500/20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      layout
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gray-900 overflow-hidden cursor-pointer" onClick={() => onPreview?.(item)}>
        <img
          src={item.thumbnail}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Type Badge */}
        <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-md text-xs font-medium text-white">
          <span>{typeIcons[item.type]}</span>
          <span className="capitalize">{item.type}</span>
        </div>

        {/* Duration Badge (for videos) */}
        {item.duration && (
          <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-md text-xs font-medium text-white">
            {item.duration}
          </div>
        )}

        {/* Play Overlay (for videos) */}
        {item.type === "video" && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </motion.div>
        )}

        {/* Select Checkbox */}
        <motion.div
          className="absolute top-2 right-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <input
            type="checkbox"
            className="w-5 h-5 accent-purple-500 rounded cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          />
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="text-white font-semibold line-clamp-1 group-hover:text-purple-300 transition-colors">
          {item.title}
        </h3>

        {/* Metadata */}
        <div className="flex items-center gap-3 text-xs text-gray-400">
          {item.resolution && (
            <>
              <span>{item.resolution}</span>
              <span>•</span>
            </>
          )}
          <span>{item.size}</span>
          <span>•</span>
          <span>{item.date}</span>
        </div>

        {/* Tags */}
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {item.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-gray-700/50 text-gray-300 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            {item.tags.length > 3 && (
              <span className="px-2 py-0.5 bg-gray-700/50 text-gray-400 text-xs rounded-full">
                +{item.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Package Badge */}
        {item.package && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500">📦</span>
            <span className="text-gray-400">{item.package}</span>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <motion.div
        className="absolute bottom-4 right-4 flex items-center gap-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
        transition={{ duration: 0.2 }}
      >
        <button
          className="p-2 bg-gray-900/80 hover:bg-purple-600 text-white rounded-lg transition-colors"
          title="Download"
          onClick={(e) => e.stopPropagation()}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </button>
        <button
          className="p-2 bg-gray-900/80 hover:bg-purple-600 text-white rounded-lg transition-colors"
          title="Share"
          onClick={(e) => e.stopPropagation()}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </button>
        <button
          className={`p-2 bg-gray-900/80 rounded-lg transition-colors ${
            item.favorite ? "text-yellow-500 hover:text-yellow-600" : "text-white hover:bg-purple-600"
          }`}
          title={item.favorite ? "Remove from favorites" : "Add to favorites"}
          onClick={(e) => e.stopPropagation()}
        >
          <svg className="w-4 h-4" fill={item.favorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </button>
      </motion.div>
    </motion.div>
  );
};
