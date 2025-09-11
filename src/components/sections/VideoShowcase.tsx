"use client";

import React from "react";
import { VideoCarousel } from "../ui/video-carousel";
import { SparklesText } from "../ui/sparkles-text";

// Mix of actual videos and placeholders
const sampleVideos = [
  {
    id: "1",
    title: "HairPHD Salon Commercial",
    thumbnail: "/videos/Hair-PHD-Salon-commerical-thumb.webp",
    url: "/videos/HairPHD-Full1-sm.mp4",
    duration: "1:30",
    description: "Professional commercial production for HairPHD beauty brand"
  },
  {
    id: "2",
    title: "Cortez Industries - Rex Game",
    thumbnail: "/videos/cortez-industries-Rex-game-thumb.webp",
    url: "/videos/rex-game-sm.mp4",
    duration: "1:15",
    description: "Dynamic gaming content for Cortez Industries Rex game"
  },
  {
    id: "3",
    title: "Noble Insulation Commercial",
    thumbnail: "/videos/noble-insulation-video-thumbnail.webp",
    url: "/videos/noble-insulation-commerical-sm.mp4",
    duration: "0:30",
    description: "High-impact commercial showcasing Noble Insulation services"
  },
  {
    id: "4",
    title: "AI-Powered Analytics",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop",
    duration: "4:08",
    description: "Leverage AI to understand and optimize your content performance"
  },
  {
    id: "5",
    title: "Contractors Choice Agency",
    thumbnail: "/videos/Contractors-Choice-Agency-Commerical-Thub.webp",
    url: "/videos/The Meg Final-SM.mp4",
    duration: "1:45",
    description: "Professional agency commercial for Contractors Choice"
  },
  {
    id: "6",
    title: "Strategic Brand Narratives",
    thumbnail: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&h=450&fit=crop",
    duration: "3:45",
    description: "Crafting powerful stories that resonate with your target audience"
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