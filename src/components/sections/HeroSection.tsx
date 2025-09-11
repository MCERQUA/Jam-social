"use client";

import React from "react";
import { WavyBackground } from "../ui/wavy-background";
import { StackFeatureSection } from "../ui/stack-feature-section";
import { SparklesText } from "../ui/sparkles-text";
import { SparklesCore } from "../ui/sparkles";
import { SplashCursor } from "../ui/splash-cursor";

function HeroSection() {
  return (
    <section className="relative min-h-screen w-full">
      {/* Wavy Background - Absolute positioned */}
      <div className="absolute inset-0">
        <WavyBackground />
      </div>
      
      {/* Dark Overlay to Soften Background */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Splash Cursor Effect - Desktop Only */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none">
        <SplashCursor />
      </div>
      
      {/* Main Content Container */}
      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
        <div className="w-full max-w-7xl mx-auto space-y-12 lg:space-y-16">
          
          {/* Hero Text with Sparkles */}
          <div className="relative text-center">
            {/* Sparkles Effect Behind Text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <SparklesCore 
                className="w-full h-full opacity-30 lg:opacity-40"
                background="transparent"
                minSize={0.4}
                maxSize={1}
                particleDensity={40}
                particleColor="#ffffff"
              />
            </div>
            
            {/* Main Hero Text */}
            <div className="relative z-10">
              <SparklesText 
                text="Jam Social Media"
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-6"
                sparklesCount={12}
              />
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-100 max-w-2xl lg:max-w-3xl mx-auto mb-4 sm:mb-6 leading-relaxed">
                Amplify your brand's voice across all platforms. We create, schedule, and optimize your social media presence so you can focus on what matters most.
              </p>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 max-w-xl lg:max-w-2xl mx-auto">
                Transform your social media strategy with our comprehensive management solutions
              </p>
            </div>
          </div>
          
          {/* Stack Feature Section with Orbiting Icons */}
          <div className="w-full">
            <StackFeatureSection />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;