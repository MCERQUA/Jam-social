"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { VideoModal } from "./video-modal";

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  url?: string; // Added URL for actual video file
  duration?: string;
  description?: string;
}

interface VideoCarouselProps {
  videos: Video[];
  className?: string;
}

export function VideoCarousel({ videos, className }: VideoCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoPlay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % videos.length);
    }, 5000);
  };

  const stopAutoPlay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    if (!isPlaying) {
      startAutoPlay();
    }
    return () => stopAutoPlay();
  }, [isPlaying, videos.length]);

  const handlePrevious = () => {
    stopAutoPlay();
    setActiveIndex((prev) => (prev - 1 + videos.length) % videos.length);
    if (!isPlaying) startAutoPlay();
  };

  const handleNext = () => {
    stopAutoPlay();
    setActiveIndex((prev) => (prev + 1) % videos.length);
    if (!isPlaying) startAutoPlay();
  };

  const handleVideoClick = (index: number) => {
    setActiveIndex(index);
    stopAutoPlay();
    
    // If video has a URL, open it in the modal
    if (videos[index].url) {
      setSelectedVideo(videos[index]);
      setIsPlaying(true);
    }
  };

  const handleCloseModal = () => {
    setSelectedVideo(null);
    setIsPlaying(false);
    startAutoPlay();
  };

  return (
    <div className={cn("relative w-full max-w-6xl mx-auto", className)}>
      {/* Main Video Display */}
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-900">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            {/* Video Thumbnail */}
            <div className="relative w-full h-full">
              <img
                src={videos[activeIndex].thumbnail}
                alt={videos[activeIndex].title}
                className="w-full h-full object-cover"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Video Info - pointer-events-none so clicks go through to button */}
              <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-none z-[5]">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {videos[activeIndex].title}
                </h3>
                {videos[activeIndex].description && (
                  <p className="text-gray-200 text-sm max-w-2xl">
                    {videos[activeIndex].description}
                  </p>
                )}
                {videos[activeIndex].duration && (
                  <span className="inline-block mt-2 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-xs text-white">
                    {videos[activeIndex].duration}
                  </span>
                )}
              </div>
              
              {/* Play Button - Higher z-index to be above text */}
              <button
                onClick={() => handleVideoClick(activeIndex)}
                className="absolute inset-0 flex items-center justify-center group z-10"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-white/20 rounded-full blur-xl group-hover:bg-white/30 transition-all duration-300" />
                  <div className="relative bg-white/90 backdrop-blur-sm rounded-full p-6 group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-12 h-12 text-gray-900 fill-gray-900 ml-1" />
                  </div>
                </div>
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation Arrows */}
        <button
          onClick={handlePrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md rounded-full p-3 hover:bg-white/20 transition-all duration-300"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md rounded-full p-3 hover:bg-white/20 transition-all duration-300"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>
      
      {/* Thumbnail Strip */}
      <div className="mt-6 relative">
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {videos.map((video, index) => (
            <button
              key={video.id}
              onClick={() => handleVideoClick(index)}
              className={cn(
                "relative flex-shrink-0 w-48 aspect-video rounded-lg overflow-hidden group transition-all duration-300",
                activeIndex === index 
                  ? "ring-2 ring-pink-500 scale-105" 
                  : "opacity-60 hover:opacity-100"
              )}
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              
              {/* Small Play Icon */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors duration-300">
                <div className="bg-white/80 rounded-full p-2 group-hover:scale-110 transition-transform duration-300">
                  <Play className="w-4 h-4 text-gray-900 fill-gray-900 ml-0.5" />
                </div>
              </div>
              
              {/* Progress Bar for Active Video */}
              {activeIndex === index && (
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-pink-500"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 5, ease: "linear" }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* Progress Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {videos.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              activeIndex === index 
                ? "w-8 bg-pink-500" 
                : "w-2 bg-gray-600 hover:bg-gray-500"
            )}
          />
        ))}
      </div>
      
      {/* Video Modal */}
      <VideoModal
        isOpen={!!selectedVideo}
        onClose={handleCloseModal}
        videoUrl={selectedVideo?.url}
        title={selectedVideo?.title}
      />
    </div>
  );
}

export default VideoCarousel;