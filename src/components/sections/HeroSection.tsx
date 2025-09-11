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
      <SplashCursor />
      <WavyBackground className="flex flex-col items-center justify-center">
        <div className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center px-4 py-20">
          {/* Sparkles effect around the text */}
          <div className="relative">
            <SparklesCore 
              className="absolute -inset-10 opacity-50"
              background="transparent"
              minSize={0.4}
              maxSize={1}
              particleDensity={100}
              particleColor="#ffffff"
            />
            <div className="relative z-10 text-center">
              <SparklesText 
                text="Jam Social Media"
                className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6"
                sparklesCount={20}
              />
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
                Amplify your brand's voice across all platforms. We create, schedule, and optimize your social media presence so you can focus on what matters most.
              </p>
              <div className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
                Transform your social media strategy with our comprehensive management solutions
              </div>
            </div>
          </div>
          
          {/* Stack Feature Section overlaid */}
          <div className="w-full mt-20">
            <StackFeatureSection />
          </div>
        </div>
      </WavyBackground>
    </section>
  );
}

export default HeroSection;