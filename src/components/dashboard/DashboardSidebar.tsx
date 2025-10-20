"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/clerk-react";
import { apiClient, type StorageInfo } from "../../lib/api/client";

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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [storage, setStorage] = useState<StorageInfo | null>(null);
  const [storageLoading, setStorageLoading] = useState(false);
  const { user, isLoaded } = useUser();

  // Fetch storage info
  useEffect(() => {
    if (isLoaded && user) {
      setStorageLoading(true);
      apiClient.getStorageUsage()
        .then(setStorage)
        .catch((error) => {
          console.error('Failed to fetch storage:', error);
          // Initialize storage if it doesn't exist
          return apiClient.initializeStorage().then(setStorage);
        })
        .finally(() => setStorageLoading(false));
    }
  }, [isLoaded, user]);

  // Auto-collapse on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      className={`h-screen bg-gradient-to-b from-gray-900/98 to-gray-900/95 backdrop-blur-xl border-r border-gray-500/20 flex flex-col relative transition-all duration-300 flex-shrink-0 ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
      initial={false}
      animate={{ width: isCollapsed ? '5rem' : '18rem' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      style={{ minWidth: isCollapsed ? '5rem' : '18rem' }}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 z-50 w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 hover:scale-110"
        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <svg
          className={`w-3 h-3 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Logo */}
      <div className={`border-b border-gray-500/20 transition-all duration-300 ${isCollapsed ? 'p-4' : 'p-6'}`}>
        {isCollapsed ? (
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent text-center">
            J
          </div>
        ) : (
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Jam Dashboard
          </h1>
        )}
      </div>

      {/* User Profile Section */}
      {isLoaded && user && (
        <div className={`border-b border-gray-500/20 transition-all duration-300 ${isCollapsed ? 'p-2' : 'px-6 py-4'}`}>
          {isCollapsed ? (
            <div className="flex justify-center">
              <img
                src={user.imageUrl}
                alt={user.fullName || user.username || 'User'}
                className="w-10 h-10 rounded-full border-2 border-purple-500/50"
                title={user.fullName || user.username || 'User'}
              />
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <img
                src={user.imageUrl}
                alt={user.fullName || user.username || 'User'}
                className="w-12 h-12 rounded-full border-2 border-purple-500/50"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {user.fullName || user.username || 'User'}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {user.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Storage Indicator */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-6 py-4 border-b border-gray-500/20"
          >
            {storageLoading ? (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Storage</span>
                  <span className="text-gray-500 font-semibold">Loading...</span>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full w-1/4 bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse" />
                </div>
              </div>
            ) : storage ? (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Storage</span>
                  <span className="text-white font-semibold">
                    {storage.totalFormatted} / {storage.maxFormatted}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${storage.percentage}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
                {storage.percentage > 80 && (
                  <p className="text-xs text-yellow-400">
                    ⚠️ {storage.availableFormatted} remaining
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Storage</span>
                  <span className="text-white font-semibold">0 Bytes / 10 GB</span>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full w-0 bg-gradient-to-r from-blue-500 to-purple-500" />
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className={`flex-1 overflow-y-auto py-4 space-y-6 ${isCollapsed ? 'px-2' : 'px-4'}`}>
        {navSections.map((section) => (
          <div key={section.title}>
            {!isCollapsed && (
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {section.title}
              </h3>
            )}
            {isCollapsed && (
              <div className="border-b border-gray-700 mb-2"></div>
            )}
            <div className="space-y-1">
              {section.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveItem(item.id)}
                  className={`w-full flex items-center rounded-lg transition-all duration-200 ${
                    isCollapsed ? 'justify-center p-3' : 'justify-between px-3 py-2.5'
                  } ${
                    activeItem === item.id
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30"
                      : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  {isCollapsed ? (
                    <span className="text-xl">{item.icon}</span>
                  ) : (
                    <>
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
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Upload Button */}
      <div className={`border-t border-gray-500/20 ${isCollapsed ? 'p-2' : 'p-4'}`}>
        <button
          className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/30 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center ${
            isCollapsed ? 'p-3' : 'py-3 px-4 gap-2'
          }`}
          title={isCollapsed ? "Upload Media" : undefined}
        >
          <span className="text-xl">⬆️</span>
          {!isCollapsed && <span>Upload Media</span>}
        </button>
      </div>
    </motion.aside>
  );
};
