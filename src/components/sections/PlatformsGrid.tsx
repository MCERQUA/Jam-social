"use client";

import React from "react";
import { SparklesText } from "../ui/sparkles-text";
import { motion } from "framer-motion";

const platforms = [
  {
    name: "Instagram",
    icon: "/social-icons/instagram.svg",
    color: "#E4405F",
    description: "Visual storytelling at its finest. Perfect for showcasing products, behind-the-scenes content, and building a loyal community through Stories, Reels, and Posts.",
    benefits: ["High engagement rates", "Shopping features", "Story highlights", "IGTV for long-form content"]
  },
  {
    name: "LinkedIn",
    icon: "/social-icons/linkedin.svg",
    color: "#0A66C2",
    description: "The professional networking powerhouse. Essential for B2B marketing, thought leadership, and establishing industry authority.",
    benefits: ["Professional audience", "B2B lead generation", "Industry networking", "Content syndication"]
  },
  {
    name: "TikTok",
    icon: "/social-icons/tiktok.svg",
    color: "#000000",
    description: "The viral content engine. Reach younger demographics with creative, authentic content that can explode overnight.",
    benefits: ["Viral potential", "Gen Z audience", "Creative tools", "Trending challenges"]
  },
  {
    name: "X (Twitter)",
    icon: "/social-icons/x.svg",
    color: "#000000",
    description: "Real-time conversation and news. Perfect for customer service, trending topics, and building thought leadership through quick, impactful messages.",
    benefits: ["Real-time engagement", "News jacking", "Customer support", "Trending topics"]
  },
  {
    name: "Facebook",
    icon: "/social-icons/facebook.svg",
    color: "#1877F2",
    description: "The social media giant with unmatched reach. Ideal for community building, targeted advertising, and diverse content formats.",
    benefits: ["Largest user base", "Advanced targeting", "Groups & communities", "Facebook Shops"]
  },
  {
    name: "YouTube",
    icon: "/social-icons/youtube.svg",
    color: "#FF0000",
    description: "The video content king. Build a searchable library of content that educates, entertains, and converts viewers into loyal subscribers.",
    benefits: ["SEO benefits", "Long-form content", "Monetization options", "YouTube Shorts"]
  },
  {
    name: "Pinterest",
    icon: "/social-icons/pinterest.svg",
    color: "#BD081C",
    description: "The visual discovery engine. Drive traffic and sales with inspirational content that users save and share for future reference.",
    benefits: ["High purchase intent", "Long content lifespan", "Visual search", "Shopping features"]
  },
  {
    name: "Google Business",
    icon: "/social-icons/google.svg",
    color: "#4285F4",
    description: "Your local SEO powerhouse. Critical for local visibility, customer reviews, and appearing in Google Maps and local search results. Boost your SEO ranking and local presence.",
    benefits: ["Local SEO boost", "Google Maps presence", "Customer reviews", "Direct search visibility"]
  },
  {
    name: "Threads",
    icon: "/social-icons/threads.svg",
    color: "#000000",
    description: "Meta's text-based conversation app. Leverage your Instagram community in a new format focused on public conversations.",
    benefits: ["Instagram integration", "Text-focused content", "Community discussions", "Cross-platform synergy"]
  },
  {
    name: "Snapchat",
    icon: "/social-icons/snapchat.svg",
    color: "#FFFC00",
    description: "Ephemeral content for authentic connections. Reach younger audiences with disappearing content, AR filters, and exclusive behind-the-scenes moments.",
    benefits: ["Young demographic", "AR experiences", "Exclusive content", "Snap Ads"]
  },
  {
    name: "Bluesky",
    icon: "/social-icons/bluesky.svg",
    color: "#00A8E8",
    description: "The decentralized social frontier. Early adopter advantage in the next generation of social networking with open protocols.",
    benefits: ["Early adopter advantage", "Decentralized network", "Tech-savvy audience", "Open protocols"]
  },
  {
    name: "Reddit",
    icon: "/social-icons/reddit.svg",
    color: "#FF4500",
    description: "The front page of the internet. Essential for community engagement, authentic discussions, and powerful SEO through high-authority backlinks. Great for AI search answers and organic reach.",
    benefits: ["SEO value", "AI search optimization", "Community authority", "Organic discussions"]
  }
];

function PlatformsGrid() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <SparklesText 
            text="Platform Expertise"
            className="text-4xl md:text-6xl font-bold text-white mb-6"
            sparklesCount={15}
          />
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Strategic management across every platform to maximize your brand's digital presence
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {platforms.map((platform, index) => (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="relative group"
            >
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl border-2 border-pink-500/60 p-6 h-full transition-all duration-300 hover:border-purple-500/80 hover:shadow-[0_0_50px_rgba(236,72,153,0.5)] shadow-[0_0_20px_rgba(236,72,153,0.2)] flex flex-col">
                {/* Platform Header */}
                <div className="flex items-center gap-4 mb-4">
                  <div 
                    className="relative p-3 rounded-lg"
                    style={{ 
                      backgroundColor: `${platform.color}40`,
                      boxShadow: `0 0 30px ${platform.color}80`
                    }}
                  >
                    <img
                      src={platform.icon}
                      alt={platform.name}
                      className="w-8 h-8 object-contain relative z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                      style={{ 
                        filter: platform.color === "#000000" 
                          ? "brightness(0) invert(1) drop-shadow(0 0 10px rgba(255,255,255,0.8))" 
                          : `brightness(1.3) saturate(1.5) drop-shadow(0 0 10px ${platform.color})`
                      }}
                    />
                    <div 
                      className="absolute inset-0 rounded-lg blur-xl opacity-60"
                      style={{ backgroundColor: platform.color }}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white">{platform.name}</h3>
                </div>
                
                {/* Description */}
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                  {platform.description}
                </p>
                
                {/* Benefits */}
                <div className="space-y-2 mb-6">
                  {platform.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div 
                        className="w-1.5 h-1.5 rounded-full shadow-[0_0_6px_currentColor]"
                        style={{ 
                          backgroundColor: platform.color === "#000000" ? "#a855f7" : platform.color,
                          boxShadow: `0 0 6px ${platform.color === "#000000" ? "#a855f7" : platform.color}`
                        }}
                      />
                      <span className="text-xs text-gray-500">{benefit}</span>
                    </div>
                  ))}
                </div>
                
                {/* Connect Now CTA */}
                <a 
                  href="https://www.oneupapp.io/clientconnect?id=7745"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full mt-auto"
                >
                  <button 
                    className="w-full py-2 px-4 rounded-lg font-medium text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                    style={{
                      backgroundColor: `${platform.color}20`,
                      border: `1px solid ${platform.color}60`,
                      color: '#ffffff',
                      boxShadow: `0 0 20px ${platform.color}30`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = `${platform.color}40`;
                      e.currentTarget.style.boxShadow = `0 0 30px ${platform.color}60`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = `${platform.color}20`;
                      e.currentTarget.style.boxShadow = `0 0 20px ${platform.color}30`;
                    }}
                  >
                    Connect Now
                  </button>
                </a>
                
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div 
                    className="absolute inset-0 rounded-xl blur-3xl"
                    style={{ 
                      background: `radial-gradient(circle at center, ${platform.color}40 0%, ${platform.color}20 50%, transparent 70%)`
                    }}
                  />
                </div>
                {/* Always visible subtle glow */}
                <div className="absolute inset-0 rounded-xl pointer-events-none">
                  <div 
                    className="absolute inset-0 rounded-xl blur-xl opacity-20"
                    style={{ 
                      background: `radial-gradient(circle at center, ${platform.color} 0%, transparent 60%)`
                    }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* CTA Section */}
        <div className="text-center mt-16">
          <p className="text-gray-400 text-lg mb-6">
            Ready to amplify your presence across all platforms?
          </p>
          <button className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:from-pink-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
            Start Your Multi-Platform Strategy
          </button>
        </div>
      </div>
    </section>
  );
}

export default PlatformsGrid;