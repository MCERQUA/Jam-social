"use client";

import React from "react";
import { WavyBackground } from "../ui/wavy-background";
import { StackFeatureSection } from "../ui/stack-feature-section";
import { SparklesText } from "../ui/sparkles-text";
import { SparklesCore } from "../ui/sparkles";
import { SplashCursor } from "../ui/splash-cursor";

function HeroSection() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Wavy Background */}
      <WavyBackground className="flex flex-col items-center justify-center min-h-screen" />
      
      {/* Splash Cursor Effect */}
      <div className="hidden lg:block">
        <SplashCursor />
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-7xl mx-auto space-y-8 sm:space-y-12 lg:space-y-16">
          
          {/* Hero Text Section */}
          <div className="relative text-center">
            <SparklesCore 
              className="absolute -inset-10 opacity-30 lg:opacity-50"
              background="transparent"
              minSize={0.4}
              maxSize={1}
              particleDensity={50}
              particleColor="#ffffff"
            />
            <div className="relative z-10">
              <SparklesText 
                text="Jam Social Media"
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-4 sm:mb-6"
                sparklesCount={15}
              />
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 max-w-2xl lg:max-w-3xl mx-auto mb-4 sm:mb-6 lg:mb-8 leading-relaxed px-4">
                Amplify your brand's voice across all platforms. We create, schedule, and optimize your social media presence so you can focus on what matters most.
              </p>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-xl lg:max-w-2xl mx-auto px-4">
                Transform your social media strategy with our comprehensive management solutions
              </p>
            </div>
          </div>
          
          {/* Stack Feature Section */}
          <div className="w-full">
            <StackFeatureSection className="px-4 sm:px-6 lg:px-8" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;