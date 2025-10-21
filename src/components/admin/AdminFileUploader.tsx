"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient } from "../../lib/api/client";

interface AdminFileUploaderProps {
  targetUserId: string;
  onUploadComplete?: () => void;
  onClose?: () => void;
}

interface UploadFile {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  assetCategory?: string;
  usageTags?: string[];
}

const ASSET_CATEGORIES = [
  { value: 'character', label: 'Character', icon: '👤' },
  { value: 'object', label: 'Object', icon: '📦' },
  { value: 'scene', label: 'Scene', icon: '🏞️' },
  { value: 'greenscreen', label: 'Greenscreen', icon: '🟩' },
  { value: 'background', label: 'Background', icon: '🖼️' },
  { value: 'full_video', label: 'Full Video', icon: '🎬' },
  { value: 'clip', label: 'Clip', icon: '🎞️' },
  { value: 'template', label: 'Template', icon: '📋' },
  { value: 'audio', label: 'Audio', icon: '🎵' },
];

const USAGE_TAGS = [
  'talking', 'static', 'animated', 'with_background', 'greenscreen',
  'alpha_channel', 'ai_ready', 'web_optimized', '4k', 'hd',
];

export const AdminFileUploader: React.FC<AdminFileUploaderProps> = ({
  targetUserId,
  onUploadComplete,
  onClose,
}) => {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [assetCategory, setAssetCategory] = useState<string>('clip');
  const [usageTags, setUsageTags] = useState<string[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      addFiles(selectedFiles);
    }
  }, []);

  const addFiles = (newFiles: File[]) => {
    const uploadFiles: UploadFile[] = newFiles.map((file) => ({
      file,
      progress: 0,
      status: 'pending',
    }));

    setFiles((prev) => [...prev, ...uploadFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleUsageTag = (tag: string) => {
    setUsageTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  const uploadFiles = async () => {
    setIsUploading(true);

    try {
      // Update all files to uploading
      setFiles((prev) =>
        prev.map((f) => ({ ...f, status: 'uploading' as const, progress: 0 }))
      );

      // Upload each file with metadata
      for (let i = 0; i < files.length; i++) {
        const uploadFile = files[i];

        try {
          const fileMetadata = {
            assetCategory,
            usageTags,
          };

          // Use admin upload endpoint
          const result = await apiClient.adminUploadFiles(
            targetUserId,
            [uploadFile.file],
            fileMetadata
          );

          setFiles((prev) =>
            prev.map((f, index) =>
              index === i
                ? { ...f, status: 'success' as const, progress: 100 }
                : f
            )
          );
        } catch (error) {
          setFiles((prev) =>
            prev.map((f, index) =>
              index === i
                ? {
                    ...f,
                    status: 'error' as const,
                    error: error instanceof Error ? error.message : 'Upload failed',
                  }
                : f
            )
          );
        }
      }

      // Call onUploadComplete after a short delay
      setTimeout(() => {
        onUploadComplete?.();
      }, 1500);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-900 rounded-2xl border border-gray-500/20 max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-500/20">
          <div>
            <h2 className="text-2xl font-bold text-white">Admin Upload</h2>
            <p className="text-sm text-gray-400 mt-1">
              Upload files for customer: {targetUserId}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Metadata Section */}
          {files.length > 0 && !isUploading && (
            <div className="mb-6 space-y-4 bg-gray-800/50 rounded-lg p-4 border border-gray-500/20">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Asset Category (applies to all files)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {ASSET_CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setAssetCategory(cat.value)}
                      className={`p-2 rounded-lg border-2 transition-all text-center ${
                        assetCategory === cat.value
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-gray-500/20 hover:border-gray-500/40'
                      }`}
                    >
                      <div className="text-2xl mb-1">{cat.icon}</div>
                      <div className="text-xs font-medium text-white">{cat.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Usage Tags (applies to all files)
                </label>
                <div className="flex flex-wrap gap-2">
                  {USAGE_TAGS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleUsageTag(tag)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        usageTags.includes(tag)
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* File Upload Area */}
          {files.length === 0 ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                isDragging
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-500/30 hover:border-gray-500/50'
              }`}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="text-6xl">📤</div>
                <div>
                  <p className="text-lg font-semibold text-white mb-2">
                    Drop files here or click to browse
                  </p>
                  <p className="text-sm text-gray-400">
                    Supports videos, images, and audio files (max 100 files, 2GB each)
                  </p>
                </div>
                <label className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg cursor-pointer transition-all duration-300 hover:-translate-y-0.5">
                  Select Files
                  <input
                    type="file"
                    multiple
                    accept="video/*,image/*,audio/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {files.map((uploadFile, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="bg-gray-800/50 rounded-lg p-4 border border-gray-500/20"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">
                        {uploadFile.file.type.startsWith('video/') ? '🎥' :
                         uploadFile.file.type.startsWith('image/') ? '🖼️' :
                         uploadFile.file.type.startsWith('audio/') ? '🎵' : '📁'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">
                          {uploadFile.file.name}
                        </p>
                        <p className="text-sm text-gray-400">
                          {formatFileSize(uploadFile.file.size)}
                        </p>

                        {/* Progress bar */}
                        {uploadFile.status === 'uploading' && (
                          <div className="mt-2 w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${uploadFile.progress}%` }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                        )}

                        {/* Status messages */}
                        {uploadFile.status === 'success' && (
                          <p className="text-sm text-green-400 mt-2">✓ Uploaded successfully</p>
                        )}
                        {uploadFile.status === 'error' && (
                          <p className="text-sm text-red-400 mt-2">
                            ✗ {uploadFile.error || 'Upload failed'}
                          </p>
                        )}
                      </div>
                      {!isUploading && (
                        <button
                          onClick={() => removeFile(index)}
                          className="text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {!isUploading && (
                <label className="block border-2 border-dashed border-gray-500/30 hover:border-gray-500/50 rounded-lg p-4 text-center cursor-pointer transition-colors">
                  <span className="text-sm text-gray-400">+ Add more files</span>
                  <input
                    type="file"
                    multiple
                    accept="video/*,image/*,audio/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {files.length > 0 && (
          <div className="flex items-center justify-between p-6 border-t border-gray-500/20 bg-gray-900/50">
            <p className="text-sm text-gray-400">
              {files.length} file{files.length !== 1 ? 's' : ''} selected
            </p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={isUploading}
                className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={uploadFiles}
                disabled={isUploading || files.length === 0}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {isUploading ? 'Uploading...' : 'Upload All'}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
