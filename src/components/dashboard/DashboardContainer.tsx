"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardTopBar } from "./DashboardTopBar";
import { MediaCard } from "./MediaCard";
import { FileUploader } from "./FileUploaderEnhanced";
import { apiClient, type UserFile } from "../../lib/api/client";
import { useUser } from "@clerk/clerk-react";
import { ClerkProvider } from "../providers/ClerkProvider";

const DashboardContent: React.FC = () => {
  const [files, setFiles] = useState<UserFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUploader, setShowUploader] = useState(false);
  const [activeView, setActiveView] = useState("home");
  const [filters, setFilters] = useState({
    type: undefined as string | undefined,
    favorite: undefined as boolean | undefined,
    search: "",
    assetCategory: undefined as string | undefined,
    audioCategory: undefined as string | undefined,
    usageTags: undefined as string[] | undefined,
  });
  const { user, isLoaded } = useUser();

  // Handle sidebar filter selection
  const handleSidebarFilter = (itemId: string) => {
    setActiveView(itemId);

    // Map sidebar item IDs to filter configurations
    const filterMap: Record<string, Partial<typeof filters>> = {
      home: { assetCategory: undefined, audioCategory: undefined, favorite: undefined },
      recent: { assetCategory: undefined, audioCategory: undefined },
      favorites: { favorite: true, assetCategory: undefined, audioCategory: undefined },
      // Visual asset categories
      character: { assetCategory: 'character', audioCategory: undefined },
      object: { assetCategory: 'object', audioCategory: undefined },
      scene: { assetCategory: 'scene', audioCategory: undefined },
      greenscreen: { assetCategory: 'greenscreen', audioCategory: undefined },
      background: { assetCategory: 'background', audioCategory: undefined },
      full_video: { assetCategory: 'full_video', audioCategory: undefined },
      clip: { assetCategory: 'clip', audioCategory: undefined },
      template: { assetCategory: 'template', audioCategory: undefined },
      // Audio categories
      jingle: { assetCategory: 'audio', audioCategory: 'jingle' },
      commercial_song: { assetCategory: 'audio', audioCategory: 'commercial_song' },
      radio_song: { assetCategory: 'audio', audioCategory: 'radio_song' },
      voiceover: { assetCategory: 'audio', audioCategory: 'voiceover' },
      sfx: { assetCategory: 'audio', audioCategory: 'sfx' },
      background_music: { assetCategory: 'audio', audioCategory: 'background_music' },
    };

    const newFilters = filterMap[itemId];
    if (newFilters) {
      setFilters((prev) => ({ ...prev, ...newFilters }));
    }
  };

  // Fetch files
  const fetchFiles = async () => {
    if (!isLoaded || !user) return;

    setLoading(true);
    setError(null);

    try {
      const fetchedFiles = await apiClient.getFiles({
        type: filters.type,
        favorite: filters.favorite,
        assetCategory: filters.assetCategory,
        audioCategory: filters.audioCategory,
        usageTags: filters.usageTags,
        limit: 50,
        sortBy: "upload_date",
        sortOrder: "DESC",
      });

      // Filter by search query locally
      let filteredFiles = fetchedFiles;
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredFiles = fetchedFiles.filter((file) =>
          file.originalName.toLowerCase().includes(searchLower) ||
          file.tags?.some((tag) => tag.toLowerCase().includes(searchLower)) ||
          file.usageTags?.some((tag) => tag.toLowerCase().includes(searchLower))
        );
      }

      setFiles(filteredFiles);
    } catch (err) {
      console.error("Error fetching files:", err);
      setError(err instanceof Error ? err.message : "Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  // Fetch files on mount and when filters change
  useEffect(() => {
    fetchFiles();
  }, [isLoaded, user, filters.type, filters.favorite, filters.assetCategory, filters.audioCategory, filters.usageTags]);

  // Debounced search
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoaded && user) {
        fetchFiles();
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [filters.search]);

  const handleSearch = (query: string) => {
    setFilters((prev) => ({ ...prev, search: query }));
  };

  const handleUploadComplete = () => {
    setShowUploader(false);
    fetchFiles();
  };

  // Get view title
  const getViewTitle = () => {
    const titleMap: Record<string, string> = {
      home: "All Assets",
      recent: "Recent Uploads",
      favorites: "Favorites",
      character: "Characters",
      object: "Objects",
      scene: "Scenes",
      greenscreen: "Greenscreen",
      background: "Backgrounds",
      full_video: "Full Videos",
      clip: "Clips",
      template: "Templates",
      jingle: "Logo Jingles",
      commercial_song: "Commercial Songs",
      radio_song: "Radio Songs",
      voiceover: "Voice Overs",
      sfx: "Sound Effects",
      background_music: "Background Music",
      packages: "Packages",
    };
    return titleMap[activeView] || "All Assets";
  };

  return (
    <div className="flex h-screen bg-black overflow-hidden pt-20">
      {/* Sidebar - Always visible */}
      <div className="flex-shrink-0">
        <DashboardSidebar onFilterChange={handleSidebarFilter} activeItem={activeView} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top Bar */}
        <DashboardTopBar onSearch={handleSearch} />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 pt-8">
          <div className="max-w-[1800px] mx-auto">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{getViewTitle()}</h1>
                <p className="text-gray-400">
                  {loading ? "Loading..." : `${files.length} file${files.length !== 1 ? "s" : ""}`}
                </p>
              </div>
              <button
                onClick={() => setShowUploader(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/30 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                Upload Media
              </button>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading your media...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-6 text-center">
                <p className="text-red-400 mb-4">⚠️ {error}</p>
                <button
                  onClick={fetchFiles}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && files.length === 0 && (
              <div className="bg-gray-800/50 border border-gray-500/20 rounded-lg p-12 text-center">
                <div className="text-6xl mb-4">📦</div>
                <h2 className="text-2xl font-bold text-white mb-2">No files yet</h2>
                <p className="text-gray-400 mb-6">
                  {filters.search || filters.type || filters.favorite
                    ? "No files match your filters"
                    : "Upload your first file to get started"}
                </p>
                <button
                  onClick={() => setShowUploader(true)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 hover:-translate-y-0.5"
                >
                  Upload Media
                </button>
              </div>
            )}

            {/* Media Grid */}
            {!loading && !error && files.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {files.map((item) => (
                  <MediaCard key={item.id} item={item} onUpdate={fetchFiles} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* File Uploader Modal */}
      <AnimatePresence>
        {showUploader && (
          <FileUploader
            onUploadComplete={handleUploadComplete}
            onClose={() => setShowUploader(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export const DashboardContainer: React.FC = () => {
  return (
    <ClerkProvider>
      <DashboardContent />
    </ClerkProvider>
  );
};
