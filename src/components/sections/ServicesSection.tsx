"use client";

import React from "react";
import { DisplayCards } from "../ui/display-cards";
import { SparklesText } from "../ui/sparkles-text";

function ServicesSection() {
  const services = [
    {
      title: "Content Strategy",
      description: "Comprehensive content planning and strategy development tailored to your brand voice and audience.",
      features: ["Content Calendar Planning", "Brand Voice Development", "Audience Research", "Competitor Analysis"],
      highlight: false
    },
    {
      title: "Social Media Management",
      description: "Full-service social media management including content creation, posting, and community engagement.",
      features: ["Daily Content Creation", "Multi-Platform Posting", "Community Management", "Monthly Analytics Reports"],
      highlight: true
    },
    {
      title: "Influencer Partnerships",
      description: "Connect with the right influencers to amplify your brand reach and build authentic relationships.",
      features: ["Influencer Identification", "Campaign Management", "Contract Negotiation", "Performance Tracking"],
      highlight: false
    },
    {
      title: "Paid Advertising",
      description: "Strategic paid social campaigns across platforms to drive conversions and maximize ROI.",
      features: ["Campaign Strategy", "Ad Creative Development", "Audience Targeting", "Performance Optimization"],
      highlight: false
    }
  ];

  return (
    <section className="py-20 px-4 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <SparklesText 
            text="Our Services"
            className="text-4xl md:text-6xl font-bold text-white mb-6"
            sparklesCount={12}
          />
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Comprehensive capabilities to elevate your social media presence
          </p>
        </div>
        
        <DisplayCards 
          cards={services}
          className="grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8"
        />
        
        <div className="text-center mt-12">
          <p className="text-gray-400 text-lg mb-6">
            Need something specific? We create custom solutions tailored to your unique needs.
          </p>
          <a
            href="#contact"
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
            Get Custom Quote
          </a>
        </div>
      </div>
    </section>
  );
}

export default ServicesSection;