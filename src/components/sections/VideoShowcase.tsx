"use client";

import React from "react";
import { VideoCarousel } from "../ui/video-carousel";
import { SparklesText } from "../ui/sparkles-text";

const sampleVideos = [
  {
    id: "1",
    title: "Viral Content Creation",
    thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=450&fit=crop",
    duration: "2:45",
    description: "Learn how we create viral content that resonates with your audience"
  },
  {
    id: "2",
    title: "Cross-Platform Strategy",
    thumbnail: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&h=450&fit=crop",
    duration: "3:12",
    description: "Maximize your reach across all social media platforms"
  },
  {
    id: "3",
    title: "AI-Powered Analytics",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop",
    duration: "4:08",
    description: "Leverage AI to understand and optimize your content performance"
  },
  {
    id: "4",
    title: "Influencer Partnerships",
    thumbnail: "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=800&h=450&fit=crop",
    duration: "2:30",
    description: "Build meaningful connections with influencers in your niche"
  },
  {
    id: "5",
    title: "Brand Storytelling",
    thumbnail: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&h=450&fit=crop",
    duration: "3:45",
    description: "Craft compelling narratives that connect with your audience"
  },
  {
    id: "6",
    title: "Social Commerce",
    thumbnail: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&h=450&fit=crop",
    duration: "5:20",
    description: "Turn your social media presence into a revenue engine"
  }
];

function VideoShowcase() {
  return (
    <section className="pt-0 pb-20 px-4 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <SparklesText 
            text="Success Stories"
            className="text-4xl md:text-6xl font-bold text-white mb-6"
            sparklesCount={15}
          />
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            See how we've helped brands transform their social media presence
          </p>
        </div>
        
        <VideoCarousel videos={sampleVideos} />
      </div>
    </section>
  );
}

export default VideoShowcase;