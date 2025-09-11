"use client";

import React from "react";
import { SpotlightCard } from "../ui/spotlight-card";
import { SparklesText } from "../ui/sparkles-text";

function FeaturesSection() {
  const features = [
    {
      title: "Content Creation",
      description: "Create stunning, engaging content that resonates with your audience. Our team of designers and copywriters craft posts that drive engagement and build your brand identity.",
      content: (
        <div className="text-center">
          <div className="text-4xl mb-4">🎨</div>
          <h3 className="text-xl font-bold text-white mb-2">Professional Content</h3>
          <p className="text-gray-400 text-sm">High-quality visuals and copy that convert</p>
        </div>
      )
    },
    {
      title: "Smart Scheduling",
      description: "Never miss the perfect posting time again. Our AI-powered scheduling system analyzes your audience activity to determine optimal posting times across all platforms.",
      content: (
        <div className="text-center">
          <div className="text-4xl mb-4">⏰</div>
          <h3 className="text-xl font-bold text-white mb-2">AI-Powered Timing</h3>
          <p className="text-gray-400 text-sm">Post when your audience is most active</p>
        </div>
      )
    },
    {
      title: "Advanced Analytics",
      description: "Get deep insights into your social media performance with comprehensive analytics. Track engagement, reach, growth, and ROI across all your platforms in one dashboard.",
      content: (
        <div className="text-center">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-xl font-bold text-white mb-2">Data-Driven Insights</h3>
          <p className="text-gray-400 text-sm">Comprehensive performance tracking</p>
        </div>
      )
    },
    {
      title: "Multi-Platform Support",
      description: "Manage all your social media accounts from one central hub. We support Instagram, LinkedIn, TikTok, X, Facebook, YouTube, Pinterest, and more platforms.",
      content: (
        <div className="text-center">
          <div className="text-4xl mb-4">🌐</div>
          <h3 className="text-xl font-bold text-white mb-2">All Platforms</h3>
          <p className="text-gray-400 text-sm">Unified management across networks</p>
        </div>
      )
    },
    {
      title: "Community Management",
      description: "Build meaningful relationships with your audience through proactive community management. We respond to comments, messages, and engage with your followers authentically.",
      content: (
        <div className="text-center">
          <div className="text-4xl mb-4">💬</div>
          <h3 className="text-xl font-bold text-white mb-2">Engagement Focus</h3>
          <p className="text-gray-400 text-sm">Build authentic relationships</p>
        </div>
      )
    },
    {
      title: "Growth Strategy",
      description: "Accelerate your social media growth with proven strategies. We develop custom growth plans based on your industry, target audience, and business objectives.",
      content: (
        <div className="text-center">
          <div className="text-4xl mb-4">🚀</div>
          <h3 className="text-xl font-bold text-white mb-2">Strategic Growth</h3>
          <p className="text-gray-400 text-sm">Custom plans for your success</p>
        </div>
      )
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <SparklesText 
            text="Powerful Features"
            className="text-4xl md:text-6xl font-bold text-white mb-6"
            sparklesCount={15}
          />
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Everything you need to dominate social media and grow your brand
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <SpotlightCard
              key={index}
              className="p-6 bg-gray-800/50 border border-gray-700/50 rounded-xl backdrop-blur-sm"
              glowColor="pink"
              intensity="high"
            >
              <div className="space-y-4">
                {feature.content}
                <div className="pt-4 border-t border-gray-700/50">
                  <h4 className="text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;