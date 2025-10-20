"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface NavItem {
  id: string;
  label: string;
  icon: string;
  count?: number;
  active?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const DashboardSidebar: React.FC = () => {
  const [activeItem, setActiveItem] = useState("home");

  const navSections: NavSection[] = [
    {
      title: "Main",
      items: [
        { id: "home", label: "All Media", icon: "🏠", count: 247 },
        { id: "recent", label: "Recent", icon: "⏱️", count: 24 },
        { id: "favorites", label: "Favorites", icon: "⭐", count: 18 },
      ],
    },
    {
      title: "Media Types",
      items: [
        { id: "videos", label: "Videos", icon: "🎥", count: 128 },
        { id: "images", label: "Images", icon: "🖼️", count: 89 },
        { id: "scenes", label: "Scenes", icon: "🎬", count: 15 },
        { id: "projects", label: "Projects", icon: "📁", count: 12 },
        { id: "audio", label: "Audio", icon: "🎵", count: 3 },
      ],
    },
    {
      title: "Organization",
      items: [
        { id: "packages", label: "Packages", icon: "📦", count: 4 },
        { id: "collections", label: "Collections", icon: "📚", count: 8 },
        { id: "shared", label: "Shared", icon: "👥", count: 5 },
        { id: "trash", label: "Trash", icon: "🗑️", count: 2 },
      ],
    },
  ];

  return (
    <motion.aside
      className="w-72 h-screen bg-gradient-to-b from-gray-900/98 to-gray-900/95 backdrop-blur-xl border-r border-gray-500/20 flex flex-col"
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Logo */}
      <div className="p-6 border-b border-gray-500/20">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          Jam Dashboard
        </h1>
      </div>

      {/* Storage Indicator */}
      <div className="px-6 py-4 border-b border-gray-500/20">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Storage</span>
            <span className="text-white font-semibold">2.4 GB / 10 GB</span>
          </div>
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-pink-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: "24%" }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-6">
        {navSections.map((section) => (
          <div key={section.title}>
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveItem(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    activeItem === item.id
                      ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-purple-500/30"
                      : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        activeItem === item.id
                          ? "bg-white/20"
                          : "bg-gray-700 text-gray-400"
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Upload Button */}
      <div className="p-4 border-t border-gray-500/20">
        <button className="w-full py-3 px-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg shadow-purple-500/30 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2">
          <span className="text-xl">⬆️</span>
          Upload Media
        </button>
      </div>
    </motion.aside>
  );
};
