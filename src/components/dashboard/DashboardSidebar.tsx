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

// Icon component for sidebar navigation
const NavIcon: React.FC<{ name: string; className?: string }> = ({ name, className = "w-5 h-5" }) => {
  const icons: Record<string, JSX.Element> = {
    home: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    recent: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    favorites: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    character: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    object: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    scene: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    greenscreen: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    background: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
    full_video: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
      </svg>
    ),
    clip: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    template: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    jingle: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    ),
    commercial_song: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    ),
    voiceover: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    ),
    sfx: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
      </svg>
    ),
    packages: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    ),
    tag: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
    upload: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    ),
  };

  return icons[name] || icons.home;
};

interface NavSection {
  title: string;
  items: NavItem[];
}

interface DashboardSidebarProps {
  onFilterChange?: (itemId: string) => void;
  activeItem?: string;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  onFilterChange,
  activeItem: externalActiveItem
}) => {
  const [localActiveItem, setLocalActiveItem] = useState("home");
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Use external activeItem if provided, otherwise use local state
  const activeItem = externalActiveItem || localActiveItem;
  const [storage, setStorage] = useState<StorageInfo | null>(null);
  const [storageLoading, setStorageLoading] = useState(false);
  const [fileCounts, setFileCounts] = useState({
    total: 0,
    // Visual assets
    character: 0,
    object: 0,
    scene: 0,
    greenscreen: 0,
    background: 0,
    full_video: 0,
    clip: 0,
    template: 0,
    // Audio assets
    audio: 0,
    jingle: 0,
    commercial_song: 0,
    radio_song: 0,
    voiceover: 0,
    sfx: 0,
    background_music: 0,
  });
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

  // Fetch file counts
  useEffect(() => {
    if (isLoaded && user) {
      const fetchCounts = async () => {
        try {
          const allFiles = await apiClient.getFiles({ limit: 1000 });
          const counts = {
            total: allFiles.length,
            // Visual assets - count by assetCategory
            character: allFiles.filter(f => f.assetCategory === 'character').length,
            object: allFiles.filter(f => f.assetCategory === 'object').length,
            scene: allFiles.filter(f => f.assetCategory === 'scene').length,
            greenscreen: allFiles.filter(f => f.assetCategory === 'greenscreen').length,
            background: allFiles.filter(f => f.assetCategory === 'background').length,
            full_video: allFiles.filter(f => f.assetCategory === 'full_video').length,
            clip: allFiles.filter(f => f.assetCategory === 'clip').length,
            template: allFiles.filter(f => f.assetCategory === 'template').length,
            // Audio assets - count by audioCategory
            audio: allFiles.filter(f => f.assetCategory === 'audio').length,
            jingle: allFiles.filter(f => f.audioCategory === 'jingle').length,
            commercial_song: allFiles.filter(f => f.audioCategory === 'commercial_song').length,
            radio_song: allFiles.filter(f => f.audioCategory === 'radio_song').length,
            voiceover: allFiles.filter(f => f.audioCategory === 'voiceover').length,
            sfx: allFiles.filter(f => f.audioCategory === 'sfx').length,
            background_music: allFiles.filter(f => f.audioCategory === 'background_music').length,
          };
          setFileCounts(counts);
        } catch (error) {
          console.error('Failed to fetch file counts:', error);
        }
      };
      fetchCounts();
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
      title: "Dashboard",
      items: [
        { id: "home", label: "All Assets", icon: "home", count: fileCounts.total },
        { id: "recent", label: "Recent", icon: "recent" },
        { id: "favorites", label: "Favorites", icon: "favorites" },
      ],
    },
    {
      title: "Visual Assets",
      items: [
        { id: "character", label: "Characters", icon: "character", count: fileCounts.character },
        { id: "object", label: "Objects", icon: "object", count: fileCounts.object },
        { id: "scene", label: "Scenes", icon: "scene", count: fileCounts.scene },
        { id: "greenscreen", label: "Greenscreen", icon: "greenscreen", count: fileCounts.greenscreen },
        { id: "background", label: "Backgrounds", icon: "background", count: fileCounts.background },
        { id: "full_video", label: "Full Videos", icon: "full_video", count: fileCounts.full_video },
        { id: "clip", label: "Clips", icon: "clip", count: fileCounts.clip },
        { id: "template", label: "Templates", icon: "template", count: fileCounts.template },
      ],
    },
    {
      title: "Audio Assets",
      items: [
        { id: "jingle", label: "Logo Jingles", icon: "jingle", count: fileCounts.jingle },
        { id: "commercial_song", label: "Commercial Songs", icon: "commercial_song", count: fileCounts.commercial_song },
        { id: "radio_song", label: "Radio Songs", icon: "commercial_song", count: fileCounts.radio_song },
        { id: "voiceover", label: "Voice Overs", icon: "voiceover", count: fileCounts.voiceover },
        { id: "sfx", label: "Sound Effects", icon: "sfx", count: fileCounts.sfx },
        { id: "background_music", label: "Background Music", icon: "commercial_song", count: fileCounts.background_music },
      ],
    },
    {
      title: "Packages",
      items: [
        { id: "packages", label: "All Packages", icon: "packages" },
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
            <div className="space-y-3">
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
              <button
                onClick={() => {
                  if (typeof window !== 'undefined' && (window as any).Clerk) {
                    (window as any).Clerk.signOut();
                  }
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
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
                  <p className="text-xs text-yellow-400 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    {storage.availableFormatted} remaining
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
                  onClick={() => {
                    setLocalActiveItem(item.id);
                    onFilterChange?.(item.id);
                  }}
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
                    <NavIcon name={item.icon} />
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <NavIcon name={item.icon} />
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
          <NavIcon name="upload" />
          {!isCollapsed && <span>Upload Media</span>}
        </button>
      </div>
    </motion.aside>
  );
};
