"use client";

import React from "react";
import { SparklesText } from "../ui/sparkles-text";
import { SparklesCore } from "../ui/sparkles";
import { SplashCursor } from "../ui/splash-cursor";
import { SocialIconsAnimation } from "../ui/social-icons-animation";

function HeroSection() {
  return (
    <section className="relative min-h-screen w-full bg-black overflow-visible">
      
      {/* Splash Cursor - Desktop Only */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none">
        <SplashCursor />
      </div>
      
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 via-black to-black" />
      
      {/* Content */}
      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
        <div className="w-full max-w-7xl mx-auto">
          
          {/* Social Icons Animation */}
          <div className="relative w-full mb-12">
            <SocialIconsAnimation />
          </div>
          
          {/* Hero Text */}
          <div className="text-center">
            <SparklesText 
              text="Jam Social Media"
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6"
              sparklesCount={20}
            />
            <p className="text-xl sm:text-2xl md:text-3xl text-gray-300 max-w-3xl mx-auto mb-4">
              All Platforms. One Strategy.
            </p>
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-8">
              Unified social media management across every major platform
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="px-8 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                Start Managing
              </button>
              <button className="px-8 py-3 border-2 border-gray-500 text-gray-200 font-semibold rounded-lg hover:bg-gray-800/50 backdrop-blur-sm transition-all duration-300">
                See Features
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;