"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface DashboardTopBarProps {
  onSearch?: (query: string) => void;
  onViewChange?: (view: "grid" | "list") => void;
  onSortChange?: (sort: string) => void;
}

export const DashboardTopBar: React.FC<DashboardTopBarProps> = ({
  onSearch,
  onViewChange,
  onSortChange,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentView, setCurrentView] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  const handleViewChange = (view: "grid" | "list") => {
    setCurrentView(view);
    onViewChange?.(view);
  };

  return (
    <div className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-gray-500/20">
      <div className="px-6 py-4 flex items-center justify-between gap-4">
        {/* Left: Search */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                onSearch?.(e.target.value);
              }}
              placeholder="Search your media..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  onSearch?.("");
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Center: View & Sort Controls */}
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-gray-800/50 rounded-lg p-1">
            <button
              onClick={() => handleViewChange("grid")}
              className={`p-2 rounded transition-all ${
                currentView === "grid"
                  ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
              title="Grid view"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => handleViewChange("list")}
              className={`p-2 rounded transition-all ${
                currentView === "list"
                  ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
              title="List view"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Sort Dropdown */}
          <select
            onChange={(e) => onSortChange?.(e.target.value)}
            className="px-3 py-2 bg-gray-800/50 border border-gray-500/30 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="size-desc">Size (Largest)</option>
            <option value="size-asc">Size (Smallest)</option>
          </select>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              showFilters
                ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white"
                : "bg-gray-800/50 text-gray-300 hover:text-white border border-gray-500/30"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
          </button>
        </div>

        {/* Right: Upload & User */}
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg shadow-purple-500/30 transition-all hover:-translate-y-0.5 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload
          </button>

          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full"></span>
          </button>

          {/* User Avatar */}
          <button className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold hover:scale-105 transition-transform">
            JD
          </button>
        </div>
      </div>

      {/* Filters Panel (Expandable) */}
      {showFilters && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-gray-500/20 px-6 py-4 bg-gray-900/50"
        >
          <div className="grid grid-cols-4 gap-4">
            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Type</label>
              <select className="w-full px-3 py-2 bg-gray-800/50 border border-gray-500/30 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option>All Types</option>
                <option>Videos</option>
                <option>Images</option>
                <option>Scenes</option>
                <option>Projects</option>
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Date</label>
              <select className="w-full px-3 py-2 bg-gray-800/50 border border-gray-500/30 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option>All Time</option>
                <option>Today</option>
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>

            {/* Package Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Package</label>
              <select className="w-full px-3 py-2 bg-gray-800/50 border border-gray-500/30 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option>All Packages</option>
                <option>Bronze Package</option>
                <option>Silver Package</option>
                <option>Gold Package</option>
                <option>Platinum Package</option>
              </select>
            </div>

            {/* Tags Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Tags</label>
              <input
                type="text"
                placeholder="Enter tag..."
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-500/30 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
