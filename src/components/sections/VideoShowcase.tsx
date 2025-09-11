"use client";

import React from "react";
import { VideoCarousel } from "../ui/video-carousel";
import { SparklesText } from "../ui/sparkles-text";

// Mix of actual videos and placeholders
const sampleVideos = [
  {
    id: "1",
    title: "HairPHD Commercial",
    thumbnail: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800&h=450&fit=crop",
    url: "/videos/HairPHD-Full1-sm.mp4",
    duration: "1:30",
    description: "Professional commercial production for HairPHD beauty brand"
  },
  {
    id: "2",
    title: "AI-Powered Analytics",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop",
    duration: "4:08",
    description: "Leverage AI to understand and optimize your content performance"
  },
  {
    id: "3",
    title: "Noble Insulation Commercial",
    thumbnail: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=450&fit=crop",
    url: "/videos/noble-insulation-commerical-sm.mp4",
    duration: "0:30",
    description: "High-impact commercial showcasing Noble Insulation services"
  },
  {
    id: "4",
    title: "Strategic Brand Narratives",
    thumbnail: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&h=450&fit=crop",
    duration: "3:45",
    description: "Crafting powerful stories that resonate with your target audience"
  },
  {
    id: "5",
    title: "The Meg Final Cut",
    thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc81?w=800&h=450&fit=crop",
    url: "/videos/The Meg Final-SM.mp4",
    duration: "1:45",
    description: "Cinematic video production showcasing our creative capabilities"
  },
  {
    id: "6",
    title: "Influencer Marketing Mastery",
    thumbnail: "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=800&h=450&fit=crop",
    duration: "2:30",
    description: "Build authentic partnerships with influencers that drive real results"
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