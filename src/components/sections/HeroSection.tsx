"use client";

import React from "react";
import { StackFeatureSection } from "../ui/stack-feature-section";
import { SparklesText } from "../ui/sparkles-text";
import { SparklesCore } from "../ui/sparkles";
import { SplashCursor } from "../ui/splash-cursor";

function HeroSection() {
  return (
    <section className="relative min-h-screen w-full">
      
      {/* Splash Cursor - Desktop Only */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none">
        <SplashCursor />
      </div>
      
      {/* Content */}
      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
        <div className="w-full max-w-7xl mx-auto space-y-12 lg:space-y-16">
          
          {/* Hero Text with Sparkles */}
          <div className="relative text-center">
            {/* Sparkles Behind Text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <SparklesCore 
                className="w-full h-full opacity-30"
                background="transparent"
                minSize={0.4}
                maxSize={1}
                particleDensity={40}
                particleColor="#ffffff"
              />
            </div>
            
            {/* Main Text */}
            <div className="relative z-10">
              {/* Content removed */}
            </div>
          </div>
          
          {/* Stack Feature Section */}
          <div className="w-full">
            <StackFeatureSection />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;