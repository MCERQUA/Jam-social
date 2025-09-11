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
        
        <div className="flex flex-wrap justify-center items-center gap-8 mb-16">
          <AnimatedTooltip items={teamMembers} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {teamMembers.map((member) => (
            <div 
              key={member.id}
              className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:transform hover:scale-105"
            >
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {member.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h3 className="text-xl font-semibold text-white text-center mb-2">
                {member.name}
              </h3>
              <p className="text-blue-400 text-center mb-4 font-medium">
                {member.designation}
              </p>
              <p className="text-gray-400 text-sm leading-relaxed text-center">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
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