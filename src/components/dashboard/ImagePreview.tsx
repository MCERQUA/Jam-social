"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient, type UserFile } from "../../lib/api/client";

interface ImagePreviewProps {
  file: UserFile | null;
  onClose: () => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ file, onClose }) => {
  const [imageBlobUrl, setImageBlobUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch full-size image with authentication
  useEffect(() => {
    if (!file) return;

    let mounted = true;
    let blobUrl: string | null = null;

    const fetchImage = async () => {
      setIsLoading(true);
      try {
        // Use thumbnail endpoint which serves original image for images without thumbnails
        blobUrl = await apiClient.getThumbnailBlob(file.id);
        if (mounted && blobUrl) {
          setImageBlobUrl(blobUrl);
        }
      } catch (error) {
        console.error('Error fetching image:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchImage();

    return () => {
      mounted = false;
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [file?.id]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!file) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Close button */}
        <button
          className="absolute top-4 right-4 z-10 p-3 bg-gray-800/80 hover:bg-gray-700 text-white rounded-full transition-colors"
          onClick={onClose}
          title="Close (Esc)"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image info bar */}
        <div className="absolute top-4 left-4 z-10 bg-gray-800/80 backdrop-blur-md rounded-lg p-4 max-w-md">
          <h2 className="text-white font-semibold text-lg mb-1">{file.originalName}</h2>
          <div className="flex items-center gap-3 text-sm text-gray-300">
            {file.resolution && (
              <>
                <span>{file.resolution}</span>
                <span>•</span>
              </>
            )}
            <span>{file.fileSizeFormatted}</span>
            {file.assetCategory && (
              <>
                <span>•</span>
                <span className="capitalize">{file.assetCategory}</span>
              </>
            )}
          </div>
          {file.usageTags && file.usageTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {file.usageTags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 bg-purple-600/50 text-purple-200 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Image container */}
        <motion.div
          className="relative max-w-[95vw] max-h-[95vh] flex items-center justify-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {isLoading ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-400">Loading image...</p>
            </div>
          ) : imageBlobUrl ? (
            <img
              src={imageBlobUrl}
              alt={file.originalName}
              className="max-w-full max-h-[95vh] object-contain rounded-lg shadow-2xl"
              draggable={false}
            />
          ) : (
            <div className="text-center">
              <p className="text-red-400 mb-2">Failed to load image</p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </motion.div>

        {/* Download button */}
        {imageBlobUrl && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(apiClient.getDownloadUrl(file.id), '_blank');
              }}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg shadow-purple-500/30 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </button>
          </div>
        )}

        {/* Navigation hint */}
        <div className="absolute bottom-4 right-4 z-10 text-gray-400 text-sm bg-gray-800/60 backdrop-blur-md rounded-lg px-4 py-2">
          Press <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">ESC</kbd> to close
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
