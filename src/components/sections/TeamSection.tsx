"use client";

import React from "react";
import { AnimatedTooltip } from "../ui/animated-tooltip";
import { SparklesText } from "../ui/sparkles-text";

function TeamSection() {
  const teamMembers = [
    {
      id: 1,
      name: "Sarah Chen",
      designation: "Creative Director",
      image: "/team/sarah-chen.jpg",
      bio: "10+ years in creative direction with expertise in visual storytelling and brand identity. Former creative lead at major advertising agencies."
    },
    {
      id: 2,
      name: "Marcus Rodriguez",
      designation: "Social Media Strategist",
      image: "/team/marcus-rodriguez.jpg",
      bio: "Data-driven strategist specializing in audience growth and engagement optimization. Expert in multi-platform content strategy."
    },
    {
      id: 3,
      name: "Emily Thompson",
      designation: "Content Creator",
      image: "/team/emily-thompson.jpg",
      bio: "Award-winning content creator with a focus on video production and trending content. TikTok and Instagram specialist with viral expertise."
    },
    {
      id: 4,
      name: "David Kim",
      designation: "Analytics Manager",
      image: "/team/david-kim.jpg",
      bio: "Data scientist turned social media analyst. Transforms complex metrics into actionable insights for campaign optimization."
    },
    {
      id: 5,
      name: "Aisha Patel",
      designation: "Community Manager",
      image: "/team/aisha-patel.jpg",
      bio: "Expert in building authentic online communities and managing brand reputation across all social platforms."
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