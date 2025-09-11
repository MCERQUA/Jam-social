"use client";

import React from "react";
import { SpinningLogos } from "../ui/spinning-logos";
import { SparklesText } from "../ui/sparkles-text";

function PlatformsSection() {
  const platforms = [
    {
      name: "Instagram",
      logo: "/logos/instagram.svg",
      alt: "Instagram"
    },
    {
      name: "LinkedIn",
      logo: "/logos/linkedin.svg",
      alt: "LinkedIn"
    },
    {
      name: "TikTok",
      logo: "/logos/tiktok.svg",
      alt: "TikTok"
    },
    {
      name: "X",
      logo: "/logos/x.svg",
      alt: "X (formerly Twitter)"
    },
    {
      name: "Facebook",
      logo: "/logos/facebook.svg",
      alt: "Facebook"
    },
    {
      name: "YouTube",
      logo: "/logos/youtube.svg",
      alt: "YouTube"
    },
    {
      name: "Pinterest",
      logo: "/logos/pinterest.svg",
      alt: "Pinterest"
    },
    {
      name: "Google Business",
      logo: "/logos/google-business.svg",
      alt: "Google Business"
    },
    {
      name: "Threads",
      logo: "/logos/threads.svg",
      alt: "Threads"
    },
    {
      name: "Snapchat",
      logo: "/logos/snapchat.svg",
      alt: "Snapchat"
    },
    {
      name: "Bluesky",
      logo: "/logos/bluesky.svg",
      alt: "Bluesky"
    },
    {
      name: "Reddit",
      logo: "/logos/reddit.svg",
      alt: "Reddit"
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <SparklesText 
            text="Supported Platforms"
            className="text-4xl md:text-6xl font-bold text-white mb-6"
            sparklesCount={15}
          />
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            We manage your presence across all major social media platforms
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            From traditional networks to emerging platforms, we ensure your brand voice is consistent everywhere your audience engages
          </p>
        </div>
        
        <div className="mb-16">
          <SpinningLogos 
            logos={platforms}
            className="w-full"
            radius={200}
            duration={20}
          />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 max-w-4xl mx-auto">
          {platforms.map((platform, index) => (
            <div 
              key={index}
              className="flex flex-col items-center p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:transform hover:scale-105"
            >
              <div className="w-12 h-12 mb-3 bg-white/10 rounded-full flex items-center justify-center">
                <span className="text-2xl">{platform.name.charAt(0)}</span>
              </div>
              <span className="text-sm text-gray-300 font-medium text-center">
                {platform.name}
              </span>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-400 text-lg">
            New platform? We adapt quickly to ensure you're always ahead of the curve.
          </p>
        </div>
      </div>
    </section>
  );
}

export default PlatformsSection;