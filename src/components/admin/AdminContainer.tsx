"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { DashboardSidebar } from "../dashboard/DashboardSidebar";
import { MediaCard } from "../dashboard/MediaCard";
import { AdminFileUploader } from "./AdminFileUploader";
import { apiClient, type UserFile } from "../../lib/api/client";
import { useUser, UserButton } from "@clerk/clerk-react";
import { ClerkProvider } from "../providers/ClerkProvider";

const AdminContent: React.FC = () => {
  const [targetUserId, setTargetUserId] = useState<string>("");
  const [files, setFiles] = useState<UserFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUploader, setShowUploader] = useState(false);
  const [clerkUsers, setClerkUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const { user, isLoaded } = useUser();

  // Check if current user is admin
  const adminEmails = ['mikecerqua@gmail.com', 'cerquadanielle@gmail.com'];
  const isAdmin = user?.primaryEmailAddress?.emailAddress &&
                  adminEmails.includes(user.primaryEmailAddress.emailAddress.toLowerCase());

  // Fetch Clerk users
  const fetchClerkUsers = async () => {
    setLoadingUsers(true);
    try {
      const users = await apiClient.getClerkUsers();
      setClerkUsers(users);
    } catch (err) {
      console.error("Error fetching Clerk users:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Load users on mount
  useEffect(() => {
    if (isLoaded && isAdmin) {
      fetchClerkUsers();
    }
  }, [isLoaded, isAdmin]);

  // Fetch files for target user
  const fetchFiles = async () => {
    if (!targetUserId) {
      setFiles([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Use admin endpoint to fetch files for the target user
      const fetchedFiles = await apiClient.getAdminUserFiles(targetUserId, {
        limit: 50,
        sortBy: "upload_date",
        sortOrder: "DESC",
      });

      setFiles(fetchedFiles);
    } catch (err) {
      console.error("Error fetching files:", err);
      setError(err instanceof Error ? err.message : "Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (targetUserId && isLoaded && user) {
      fetchFiles();
    }
  }, [targetUserId, isLoaded, user]);

  const handleUploadComplete = () => {
    setShowUploader(false);
    fetchFiles();
  };

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-3xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400">You don't have permission to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black overflow-hidden pt-20">
      {/* Sidebar */}
      <div className="flex-shrink-0">
        <DashboardSidebar onFilterChange={() => {}} activeItem="admin" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Admin Top Bar */}
        <div className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-gray-500/20">
          <div className="px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white mb-1">Admin Dashboard</h1>
                <p className="text-sm text-gray-400">Upload and manage files for customers</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right hidden md:block">
                  <p className="text-xs text-gray-500">Logged in as</p>
                  <p className="text-sm font-medium text-white">{user?.primaryEmailAddress?.emailAddress}</p>
                </div>
                <div className="flex items-center">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10",
                        userButtonPopoverCard: "bg-gray-800 border border-gray-500/20",
                        userButtonPopoverActionButton: "text-gray-300 hover:text-white hover:bg-gray-700/50",
                        userButtonPopoverActionButtonText: "text-gray-300",
                        userButtonPopoverActionButtonIcon: "text-gray-400",
                        userButtonPopoverFooter: "hidden",
                      },
                    }}
                    afterSignOutUrl="/"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 pt-8">
          <div className="max-w-[1800px] mx-auto">
            {/* Customer Selection */}
            <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Manual User ID Input */}
              <div className="bg-gray-800/50 border border-gray-500/20 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">Manual Input</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Customer Clerk User ID
                    </label>
                    <input
                      type="text"
                      value={targetUserId}
                      onChange={(e) => setTargetUserId(e.target.value)}
                      placeholder="user_2xxx..."
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Enter or paste a Clerk user ID
                    </p>
                  </div>
                  <button
                    onClick={() => setShowUploader(true)}
                    disabled={!targetUserId}
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-lg shadow-blue-500/30 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    Upload for Customer
                  </button>
                </div>
              </div>

              {/* User List */}
              <div className="bg-gray-800/50 border border-gray-500/20 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">Select from List</h2>
                  <button
                    onClick={fetchClerkUsers}
                    disabled={loadingUsers}
                    className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                    title="Refresh user list"
                  >
                    <svg className={`w-5 h-5 ${loadingUsers ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>

                {/* Search */}
                <input
                  type="text"
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  placeholder="Search users..."
                  className="w-full px-4 py-2 mb-4 bg-gray-900/50 border border-gray-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />

                {/* User List */}
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {loadingUsers ? (
                    <div className="text-center py-8 text-gray-400">
                      <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      Loading users...
                    </div>
                  ) : clerkUsers.filter(u =>
                    u.fullName.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                    u.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                    u.id.toLowerCase().includes(userSearchQuery.toLowerCase())
                  ).length > 0 ? (
                    clerkUsers
                      .filter(u =>
                        u.fullName.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                        u.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                        u.id.toLowerCase().includes(userSearchQuery.toLowerCase())
                      )
                      .map((clerkUser) => (
                        <button
                          key={clerkUser.id}
                          onClick={() => setTargetUserId(clerkUser.id)}
                          className={`w-full text-left p-3 rounded-lg border transition-all ${
                            targetUserId === clerkUser.id
                              ? 'border-purple-500 bg-purple-500/10'
                              : 'border-gray-500/20 hover:border-gray-500/40 bg-gray-900/30'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {clerkUser.imageUrl ? (
                              <img src={clerkUser.imageUrl} alt={clerkUser.fullName} className="w-8 h-8 rounded-full" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                                {clerkUser.fullName?.[0] || 'U'}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-medium truncate">{clerkUser.fullName}</p>
                              <p className="text-xs text-gray-400 truncate">{clerkUser.email}</p>
                            </div>
                          </div>
                        </button>
                      ))
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      {userSearchQuery ? 'No users found' : 'No users available'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Customer Files Display */}
            {targetUserId && (
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Customer Files</h2>
                    <p className="text-gray-400">
                      {loading ? "Loading..." : `${files.length} file${files.length !== 1 ? "s" : ""}`}
                    </p>
                  </div>
                </div>

                {/* Loading State */}
                {loading && (
                  <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-400">Loading customer files...</p>
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
                    <h3 className="text-2xl font-bold text-white mb-2">No files yet</h3>
                    <p className="text-gray-400 mb-6">
                      Upload files for this customer to get started
                    </p>
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
            )}

            {/* No Customer Selected */}
            {!targetUserId && (
              <div className="bg-gray-800/50 border border-gray-500/20 rounded-lg p-12 text-center">
                <div className="text-6xl mb-4">👤</div>
                <h3 className="text-2xl font-bold text-white mb-2">Select a Customer</h3>
                <p className="text-gray-400">
                  Enter a customer's Clerk user ID above to upload files for them
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* File Uploader Modal */}
      <AnimatePresence>
        {showUploader && (
          <AdminFileUploader
            targetUserId={targetUserId}
            onUploadComplete={handleUploadComplete}
            onClose={() => setShowUploader(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export const AdminContainer: React.FC = () => {
  return (
    <ClerkProvider>
      <AdminContent />
    </ClerkProvider>
  );
};
