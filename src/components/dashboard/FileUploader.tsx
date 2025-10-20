"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient } from "../../lib/api/client";

interface FileUploaderProps {
  onUploadComplete?: () => void;
  onClose?: () => void;
}

interface UploadFile {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onUploadComplete,
  onClose,
}) => {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

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

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setIsUploading(true);

    try {
      // Update all files to uploading
      setFiles((prev) =>
        prev.map((f) => ({ ...f, status: 'uploading' as const, progress: 0 }))
      );

      const filesToUpload = files.map((f) => f.file);

      // Upload files
      const result = await apiClient.uploadFiles(filesToUpload);

      // Update success status
      setFiles((prev) =>
        prev.map((f, index) => {
          const hasError = result.errors?.find(
            (e) => e.filename === f.file.name
          );

          return {
            ...f,
            status: hasError ? 'error' : 'success',
            progress: 100,
            error: hasError?.error,
          };
        })
      );

      // Call onUploadComplete after a short delay
      setTimeout(() => {
        onUploadComplete?.();
      }, 1500);
    } catch (error) {
      console.error('Upload error:', error);
      setFiles((prev) =>
        prev.map((f) => ({
          ...f,
          status: 'error',
          error: error instanceof Error ? error.message : 'Upload failed',
        }))
      );
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (file: File): string => {
    if (file.type.startsWith('video/')) return '🎥';
    if (file.type.startsWith('image/')) return '🖼️';
    if (file.type.startsWith('audio/')) return '🎵';
    return '📁';
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
        className="bg-gray-900 rounded-2xl border border-gray-500/20 max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-500/20">
          <h2 className="text-2xl font-bold text-white">Upload Media</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Upload Area */}
        <div className="flex-1 overflow-y-auto p-6">
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
                    Supports videos, images, and audio files (max 2GB each)
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
                      <div className="text-3xl">{getFileIcon(uploadFile.file)}</div>
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
                          <p className="text-sm text-green-400 mt-2">✓ Uploaded</p>
                        )}
                        {uploadFile.status === 'error' && (
                          <p className="text-sm text-red-400 mt-2">
                            ✗ {uploadFile.error || 'Upload failed'}
                          </p>
                        )}
                      </div>

                      {uploadFile.status === 'pending' && (
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

              {/* Add more files button */}
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
                disabled={isUploading || files.every((f) => f.status !== 'pending')}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {isUploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
