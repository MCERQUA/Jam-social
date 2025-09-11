"use client";

import React from "react";
import { WaveText } from "../ui/wave-text";
import { SparklesCore } from "../ui/sparkles";
import { SplashCursor } from "../ui/splash-cursor";
import { SocialIconsAnimation } from "../ui/social-icons-animation";
import Aurora from "../ui/Aurora";

function HeroSection() {
  return (
    <section className="relative min-h-screen w-full bg-black overflow-visible">
      
      {/* Aurora Background - Enhanced intensity and size */}
      <div className="absolute -top-40 left-0 right-0 h-[140%] opacity-80">
        <Aurora
          colorStops={["#a855f7", "#ec4899", "#3b82f6"]}
          blend={0.9}
          amplitude={1.5}
          speed={0.35}
        />
      </div>
      
      {/* Splash Cursor - Large Desktop Only (1536px+) */}
      <div className="hidden 2xl:block absolute inset-0 pointer-events-none z-10">
        <SplashCursor />
      </div>
      
      {/* Background gradient overlay - Even lighter to show more Aurora */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/70 z-[5]" />
      
      {/* Content */}
      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-7xl mx-auto">
          
          {/* Social Icons Animation */}
          <div className="relative w-full mb-8">
            <SocialIconsAnimation />
          </div>
          
          {/* Hero Text */}
          <div className="text-center">
            <WaveText 
              text="Jam Social Media"
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 justify-center"
              delay={0.2}
              gradientWords={["Jam"]}
              repeatDelay={4}
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