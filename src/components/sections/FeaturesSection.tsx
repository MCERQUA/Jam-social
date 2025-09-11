"use client";

import React from "react";
import { SpotlightCard } from "../ui/spotlight-card";
import { SparklesText } from "../ui/sparkles-text";
import { Calendar, Brain, Video, Image, Box, Globe, Search, Sparkles } from "lucide-react";

function FeaturesSection() {
  const coreFeatures = [
    {
      title: "Smart Scheduling",
      description: "Visual calendar interface with powerful repeat functionality. Schedule once, publish everywhere with daily, weekly, monthly, and yearly automation options.",
      content: (
        <div className="space-y-3">
          <Calendar className="w-10 h-10 text-pink-500 mx-auto" />
          <h3 className="text-xl font-bold text-white">Smart Scheduling</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            <span className="px-2 py-1 bg-purple-900/30 rounded text-xs text-purple-300">Daily</span>
            <span className="px-2 py-1 bg-blue-900/30 rounded text-xs text-blue-300">Weekly</span>
            <span className="px-2 py-1 bg-pink-900/30 rounded text-xs text-pink-300">Monthly</span>
            <span className="px-2 py-1 bg-indigo-900/30 rounded text-xs text-indigo-300">Yearly</span>
          </div>
          <p className="text-gray-400 text-sm">One post adapted across all platforms automatically</p>
        </div>
      )
    },
    {
      title: "AI-Powered Strategy",
      description: "Leverage AI to analyze and optimize your content for maximum SEO impact. Build digital brand awareness and ensure compatibility with AI search engines.",
      content: (
        <div className="space-y-3">
          <Brain className="w-10 h-10 text-blue-500 mx-auto" />
          <h3 className="text-xl font-bold text-white">AI Strategy</h3>
          <div className="space-y-2 text-left">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-300">SEO Optimization</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-gray-300">Brand Awareness</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-xs text-gray-300">AI Search Ready</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Content Creation Suite",
      description: "Professional content creation tools for every format. From video commercials to 3D immersive experiences, we've got you covered.",
      content: (
        <div className="space-y-3">
          <Sparkles className="w-10 h-10 text-purple-500 mx-auto" />
          <h3 className="text-xl font-bold text-white">Creation Suite</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-1 text-xs text-gray-300">
              <Video className="w-4 h-4 text-red-400" />
              <span>Videos</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-300">
              <Image className="w-4 h-4 text-green-400" />
              <span>Graphics</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-300">
              <Globe className="w-4 h-4 text-blue-400" />
              <span>Interactive</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-300">
              <Box className="w-4 h-4 text-purple-400" />
              <span>3D Content</span>
            </div>
          </div>
        </div>
      )
    }
  ];

  const jamDifference = [
    {
      title: "Cross-Platform Intelligence",
      description: "Our AI adapts your content for each platform's unique audience, ensuring maximum engagement everywhere.",
      icon: <Globe className="w-8 h-8 text-pink-500" />
    },
    {
      title: "SEO & AI Search Optimization",
      description: "Build recognition across traditional search engines and emerging AI systems for comprehensive digital presence.",
      icon: <Search className="w-8 h-8 text-blue-500" />
    },
    {
      title: "Ecosystem Integration",
      description: "Seamlessly integrate with EchoAIsystem.com for enhanced AI capabilities and extended functionality.",
      icon: <Brain className="w-8 h-8 text-purple-500" />
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto">
        {/* Core Features Section */}
        <div className="text-center mb-16">
          <SparklesText 
            text="Core Features"
            className="text-4xl md:text-6xl font-bold text-white mb-6"
            sparklesCount={15}
          />
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Advanced tools powered by AI to supercharge your social media strategy
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-20 max-w-6xl mx-auto">
          {coreFeatures.map((feature, index) => (
            <SpotlightCard
              key={index}
              className="w-full h-auto min-h-[280px] md:min-h-[320px] p-5 md:p-6 bg-gray-800/50 border border-gray-700/50 rounded-xl backdrop-blur-sm"
              glowColor="pink"
              intensity="high"
              customSize={true}
              width="100%"
              height="auto"
            >
              <div className="space-y-4 h-full flex flex-col">
                {feature.content}
                <div className="pt-4 pb-2 border-t border-gray-700/50 mt-auto">
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>

        {/* The Jam Difference Section */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              The Jam Difference
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              What sets us apart in the world of social media management
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {jamDifference.map((item, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 p-5 md:p-6 rounded-xl border border-gray-700/30 hover:border-purple-500/30 transition-all duration-300"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  {item.icon}
                  <h3 className="text-xl font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;