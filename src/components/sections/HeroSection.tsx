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
      {/* Wavy Background Container */}
      <div className="absolute inset-0">
        <WavyBackground />
      </div>
      
      {/* Dark Overlay to Soften Background */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
      
      {/* Splash Cursor Effect - Desktop Only */}
      <div className="hidden lg:block">
        <SplashCursor />
      </div>
      
      {/* All Content Goes Here - On Top of Background */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
        <div className="w-full max-w-7xl mx-auto space-y-8 sm:space-y-12 lg:space-y-16">
          
          {/* Hero Text with Sparkles */}
          <div className="relative text-center">
            {/* Sparkles Effect */}
            <SparklesCore 
              className="absolute -inset-20 opacity-30 lg:opacity-50"
              background="transparent"
              minSize={0.4}
              maxSize={1}
              particleDensity={50}
              particleColor="#ffffff"
            />
            
            {/* Text Content */}
            <div className="relative z-10">
              <SparklesText 
                text="Jam Social Media"
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-6"
                sparklesCount={15}
              />
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 max-w-2xl lg:max-w-3xl mx-auto mb-4 sm:mb-6 leading-relaxed">
                Amplify your brand's voice across all platforms. We create, schedule, and optimize your social media presence so you can focus on what matters most.
              </p>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-xl lg:max-w-2xl mx-auto">
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