"use client";

import React from "react";
import { AnimatedTooltip } from "../ui/animated-tooltip";
import { SparklesText } from "../ui/sparkles-text";

function TeamSection() {
  const teamMembers = [
    {
      id: 1,
      name: "Josh",
      designation: "Creative Director",
      image: "/team/josh.jpg",
      bio: "Visionary creative leader with expertise in brand storytelling and innovative campaign development. Drives the creative vision across all client projects."
    },
    {
      id: 2,
      name: "Mike",
      designation: "Social Media Strategist",
      image: "/team/mike.jpg",
      bio: "Strategic mastermind specializing in data-driven growth tactics and multi-platform optimization. Expert in scaling brand presence across social channels."
    },
    {
      id: 3,
      name: "Danielle",
      designation: "Content Creator",
      image: "/team/danielle.jpg",
      bio: "Creative content specialist with a keen eye for trending formats and viral potential. Crafts compelling narratives that resonate with target audiences."
    },
    {
      id: 4,
      name: "Nick",
      designation: "Analytics Manager",
      image: "/team/nick.jpg",
      bio: "Performance optimization expert who transforms social metrics into actionable insights. Ensures every campaign delivers measurable ROI."
    },
    {
      id: 5,
      name: "EchoAI",
      designation: "AI Integration Specialist",
      image: "/team/echoai.jpg",
      bio: "Advanced AI system powering intelligent automation and content optimization. Enhances creativity with cutting-edge machine learning capabilities."
    }
  ];

  return (
    <section className="py-20 px-4 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <SparklesText 
            text="Meet Our Team"
            className="text-4xl md:text-6xl font-bold text-white mb-6"
            sparklesCount={12}
          />
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            The creative minds behind your social media success
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Our diverse team brings together expertise in strategy, creativity, analytics, and community building
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-8">
          <AnimatedTooltip items={teamMembers} />
        </div>
        
        <div className="text-center mt-16">
          <p className="text-gray-400 text-lg mb-6">
            Ready to work with industry experts who understand your vision?
          </p>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
            Schedule a Consultation
          </button>
        </div>
      </div>
    </section>
  );
}

export default TeamSection;