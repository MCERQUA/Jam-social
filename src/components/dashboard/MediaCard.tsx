"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { VolumeX, Volume2, Maximize2, Play } from "lucide-react";
import { apiClient, type UserFile } from "../../lib/api/client";
import { MediaPreview } from "./MediaPreview";

interface MediaCardProps {
  item: UserFile;
  onPreview?: (item: UserFile) => void;
  onUpdate?: () => void;
}

export const MediaCard: React.FC<MediaCardProps> = ({ item, onPreview, onUpdate }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [mediaBlobUrl, setMediaBlobUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Video/Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [videoBlobUrl, setVideoBlobUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const typeIcons = {
    video: "🎥",
    image: "🖼️",
    scene: "🎬",
    project: "📁",
    audio: "🎵",
  };

  // Fetch thumbnail/image with authentication
  useEffect(() => {
    let mounted = true;
    let blobUrl: string | null = null;

    const fetchMedia = async () => {
      // Always use thumbnail blob URL for authenticated access
      if (item.thumbnailPath || item.fileType === 'image') {
        blobUrl = await apiClient.getThumbnailBlob(item.id);
        if (mounted && blobUrl) {
          setMediaBlobUrl(blobUrl);
        }
      }
    };

    fetchMedia();

    return () => {
      mounted = false;
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [item.id, item.thumbnailPath, item.fileType]);

  // Fetch video blob for hover preview
  useEffect(() => {
    if (item.fileType !== 'video') return;

    let mounted = true;
    let blobUrl: string | null = null;

    const fetchVideo = async () => {
      try {
        // Get auth token
        const token = await (window as any).Clerk?.session?.getToken();

        // Fetch video with authentication
        const response = await fetch(apiClient.getStreamUrl(item.id), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error('Failed to fetch video:', response.status);
          return;
        }

        const blob = await response.blob();
        blobUrl = URL.createObjectURL(blob);

        if (mounted) {
          setVideoBlobUrl(blobUrl);
        }
      } catch (error) {
        console.error('Error fetching video:', error);
      }
    };

    fetchVideo();

    return () => {
      mounted = false;
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [item.id, item.fileType]);

  // Video hover handlers
  const handleVideoHoverEnter = () => {
    if (item.fileType === 'video' && videoRef.current) {
      setIsHovered(true);
      videoRef.current.play().catch(err => {
        console.log('Autoplay prevented:', err);
      });
      setIsPlaying(true);
    }
  };

  const handleVideoHoverLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
      setIsHovered(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      // Get authenticated blob URL for download
      const response = await fetch(apiClient.getDownloadUrl(item.id), {
        headers: {
          Authorization: `Bearer ${await (window as any).Clerk?.session?.getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = item.originalName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download file');
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Delete "${item.originalName}"?`)) return;

    setIsDeleting(true);
    try {
      await apiClient.deleteFile(item.id);
      onUpdate?.();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete file');
      setIsDeleting(false);
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await apiClient.toggleFavorite(item.id);
      onUpdate?.();
    } catch (error) {
      console.error('Toggle favorite error:', error);
    }
  };

  // Get thumbnail URL - use blob URL if available, otherwise fallback to placeholder
  const thumbnailUrl = mediaBlobUrl || 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=225&fit=crop';

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return date.toLocaleDateString();
  };

  if (isDeleting) {
    return (
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0, scale: 0.9 }}
        className="bg-gray-800/60 backdrop-blur-sm border border-gray-500/20 rounded-xl overflow-hidden aspect-video flex items-center justify-center"
      >
        <p className="text-gray-400">Deleting...</p>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        className="group relative bg-gray-800/60 backdrop-blur-sm border border-gray-500/20 rounded-xl overflow-hidden transition-all duration-300 hover:bg-gray-700/80 hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-500/20"
        onMouseEnter={item.fileType === 'video' ? handleVideoHoverEnter : () => setIsHovered(true)}
        onMouseLeave={item.fileType === 'video' ? handleVideoHoverLeave : () => setIsHovered(false)}
        whileHover={{ y: -4 }}
        layout
      >
        {/* Thumbnail */}
        <div className="relative aspect-video bg-gray-900 overflow-hidden cursor-pointer" onClick={() => setShowPreview(true)}>
          {/* Thumbnail Image Layer */}
          <img
            src={thumbnailUrl}
            alt={item.originalName}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ${
              isPlaying ? 'opacity-0' : 'opacity-100 group-hover:scale-105'
            }`}
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=225&fit=crop';
            }}
          />

          {/* Video Layer (for video files) */}
          {item.fileType === 'video' && videoBlobUrl && (
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              muted={isMuted}
              loop
              playsInline
              preload="metadata"
              src={videoBlobUrl}
            />
          )}

          {/* Type Badge */}
          <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-md text-xs font-medium text-white z-10">
            <span>{typeIcons[item.fileType]}</span>
            <span className="capitalize">{item.fileType}</span>
          </div>

          {/* Duration Badge (for videos) */}
          {item.duration && (
            <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-md text-xs font-medium text-white z-10">
              {item.duration}
            </div>
          )}

          {/* Play Icon Overlay (for videos when not playing) */}
          {item.fileType === "video" && !isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg transition-opacity group-hover:opacity-0">
                <Play className="w-6 h-6 text-gray-900 ml-0.5" />
              </div>
            </div>
          )}

          {/* Audio/Video Controls (top-right) */}
          {item.fileType === 'video' && (
            <div className="absolute top-2 right-2 flex gap-2 opacity-100 md:opacity-0 transition-opacity duration-200 md:group-hover:opacity-100 z-20">
              <button
                className="p-2 bg-black/70 backdrop-blur-sm rounded-full hover:bg-black/80 border border-white/20 transition-all"
                onClick={toggleMute}
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
              </button>
              <button
                className="p-2 bg-black/70 backdrop-blur-sm rounded-full hover:bg-black/80 border border-white/20 transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPreview(true);
                }}
                title="Expand"
              >
                <Maximize2 className="w-4 h-4 text-white" />
              </button>
            </div>
          )}

          {/* Select Checkbox (hide when controls are visible) */}
          {item.fileType !== 'video' && (
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
          )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="text-white font-semibold line-clamp-1 group-hover:text-purple-300 transition-colors">
          {item.originalName}
        </h3>

        {/* Metadata */}
        <div className="flex items-center gap-3 text-xs text-gray-400">
          {item.resolution && (
            <>
              <span>{item.resolution}</span>
              <span>•</span>
            </>
          )}
          <span>{item.fileSizeFormatted}</span>
          <span>•</span>
          <span>{formatDate(item.uploadDate)}</span>
        </div>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {item.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
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
        {item.packageName && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500">📦</span>
            <span className="text-gray-400">{item.packageName}</span>
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
          onClick={handleDownload}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </button>
        <button
          className="p-2 bg-gray-900/80 hover:bg-red-600 text-white rounded-lg transition-colors"
          title="Delete"
          onClick={handleDelete}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
        <button
          className={`p-2 bg-gray-900/80 rounded-lg transition-colors ${
            item.isFavorite ? "text-yellow-500 hover:text-yellow-600" : "text-white hover:bg-purple-600"
          }`}
          title={item.isFavorite ? "Remove from favorites" : "Add to favorites"}
          onClick={handleToggleFavorite}
        >
          <svg className="w-4 h-4" fill={item.isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </button>
      </motion.div>
    </motion.div>

    {/* Media Preview Modal */}
    {showPreview && (
      <MediaPreview
        file={item}
        onClose={() => setShowPreview(false)}
      />
    )}
  </>
  );
};
