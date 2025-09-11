"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
  title?: string;
}

export function VideoModal({ isOpen, onClose, videoUrl, title }: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.play();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!videoUrl) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50"
          />
          
          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, type: "spring", damping: 25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
            onClick={onClose}
          >
            <div 
              className="relative w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute -top-12 right-0 md:-top-14 md:-right-14 bg-white/10 backdrop-blur-md rounded-full p-3 hover:bg-white/20 transition-all duration-300 group"
              >
                <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300" />
              </button>
              
              {/* Video Title */}
              {title && (
                <h3 className="text-white text-xl md:text-2xl font-bold mb-4">
                  {title}
                </h3>
              )}
              
              {/* Video Player */}
              <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
                <video
                  ref={videoRef}
                  src={videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default VideoModal;