"use client";

import React from "react";
import { SparklesText } from "../ui/sparkles-text";
import { motion } from "framer-motion";
import { 
  Zap, TrendingUp, Users, BarChart3, Calendar, MessageSquare, 
  Camera, Megaphone, Shield, Sparkles, Target, Palette
} from "lucide-react";

const services = [
  {
    name: "Content Strategy",
    icon: Calendar,
    color: "#ec4899",
    description: "Strategic content planning that aligns with your brand voice and business goals. We create compelling narratives that resonate with your audience.",
    features: ["Content calendars", "Brand voice development", "Topic research", "Content pillars"]
  },
  {
    name: "Social Media Management",
    icon: Users,
    color: "#3b82f6",
    description: "Full-service management across all platforms. From daily posting to community engagement, we handle everything.",
    features: ["Daily posting", "Community management", "Engagement monitoring", "Platform optimization"]
  },
  {
    name: "Content Creation",
    icon: Camera,
    color: "#10b981",
    description: "Professional content creation including graphics, videos, and copy that captures attention and drives engagement.",
    features: ["Custom graphics", "Video production", "Copywriting", "Photo editing"]
  },
  {
    name: "Analytics & Reporting",
    icon: BarChart3,
    color: "#f59e0b",
    description: "Data-driven insights to measure success and optimize strategy. Monthly reports with actionable recommendations.",
    features: ["Monthly reports", "Performance tracking", "ROI analysis", "Competitor analysis"]
  },
  {
    name: "Paid Advertising",
    icon: Megaphone,
    color: "#ef4444",
    description: "Strategic paid campaigns across all platforms to maximize reach and conversions while optimizing ad spend.",
    features: ["Campaign strategy", "Ad creation", "A/B testing", "Budget optimization"]
  },
  {
    name: "Influencer Marketing",
    icon: Sparkles,
    color: "#a855f7",
    description: "Connect with the right influencers to amplify your brand message and reach new audiences authentically.",
    features: ["Influencer research", "Campaign coordination", "Contract negotiation", "Performance tracking"]
  },
  {
    name: "Community Management",
    icon: MessageSquare,
    color: "#06b6d4",
    description: "Build and nurture an engaged community around your brand with proactive engagement and support.",
    features: ["24/7 monitoring", "Response management", "Community building", "Crisis management"]
  },
  {
    name: "Brand Development",
    icon: Palette,
    color: "#8b5cf6",
    description: "Develop a cohesive brand identity that stands out in the digital landscape and resonates with your target audience.",
    features: ["Brand guidelines", "Visual identity", "Voice & tone", "Brand positioning"]
  },
  {
    name: "SEO & Growth",
    icon: TrendingUp,
    color: "#14b8a6",
    description: "Optimize your social presence for discovery and growth with SEO-focused strategies and growth hacking techniques.",
    features: ["Profile optimization", "Hashtag research", "Growth strategies", "SEO optimization"]
  },
  {
    name: "Crisis Management",
    icon: Shield,
    color: "#dc2626",
    description: "Protect your brand reputation with proactive monitoring and rapid response strategies for any situation.",
    features: ["24/7 monitoring", "Response protocols", "Reputation repair", "PR coordination"]
  },
  {
    name: "Conversion Optimization",
    icon: Target,
    color: "#059669",
    description: "Turn followers into customers with strategic funnel optimization and conversion-focused content strategies.",
    features: ["Funnel design", "CTA optimization", "Landing pages", "Lead generation"]
  },
  {
    name: "Automation & Tools",
    icon: Zap,
    color: "#ea580c",
    description: "Streamline your social media operations with automation tools and custom workflows for maximum efficiency.",
    features: ["Tool setup", "Workflow automation", "Chatbot integration", "Scheduling systems"]
  }
];

function ServicesGrid() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <SparklesText 
            text="Service Packages"
            className="text-4xl md:text-6xl font-bold text-white mb-6"
            sparklesCount={15}
          />
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Choose from our comprehensive service offerings or create a custom package tailored to your needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="relative group"
              >
                <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl border-2 border-pink-500/60 p-6 h-full transition-all duration-300 hover:border-purple-500/80 hover:shadow-[0_0_50px_rgba(236,72,153,0.5)] shadow-[0_0_20px_rgba(236,72,153,0.2)] flex flex-col">
                  {/* Service Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <div 
                      className="relative p-3 rounded-lg border border-pink-500/50"
                      style={{ 
                        backgroundColor: `${service.color}40`,
                        boxShadow: `0 0 30px ${service.color}80, 0 0 15px rgba(236,72,153,0.4)`
                      }}
                    >
                      <Icon
                        className="w-8 h-8 relative z-10"
                        style={{ 
                          color: service.color,
                          filter: `drop-shadow(0 0 10px ${service.color})`
                        }}
                      />
                      <div 
                        className="absolute inset-0 rounded-lg blur-xl opacity-60"
                        style={{ backgroundColor: service.color }}
                      />
                    </div>
                    <h3 className="text-xl font-bold text-white">{service.name}</h3>
                  </div>
                  
                  {/* Description */}
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                    {service.description}
                  </p>
                  
                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div 
                          className="w-1.5 h-1.5 rounded-full shadow-[0_0_6px_currentColor]"
                          style={{ 
                            backgroundColor: service.color,
                            boxShadow: `0 0 6px ${service.color}`
                          }}
                        />
                        <span className="text-xs text-gray-500">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Connect Now CTA */}
                  <div className="mt-auto">
                    <a 
                      href="https://www.oneupapp.io/clientconnect?id=7745"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full"
                    >
                      <button 
                        className="w-full py-2 px-4 rounded-lg font-medium text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                        style={{
                          backgroundColor: `${service.color}20`,
                          border: `1px solid ${service.color}60`,
                          color: '#ffffff',
                          boxShadow: `0 0 20px ${service.color}30`
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = `${service.color}40`;
                          e.currentTarget.style.boxShadow = `0 0 30px ${service.color}60`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = `${service.color}20`;
                          e.currentTarget.style.boxShadow = `0 0 20px ${service.color}30`;
                        }}
                      >
                        Get Started
                      </button>
                    </a>
                  </div>
                  
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div 
                      className="absolute inset-0 rounded-xl blur-3xl"
                      style={{ 
                        background: `radial-gradient(circle at center, ${service.color}40 0%, ${service.color}20 50%, transparent 70%)`
                      }}
                    />
                  </div>
                  {/* Always visible subtle glow */}
                  <div className="absolute inset-0 rounded-xl pointer-events-none">
                    <div 
                      className="absolute inset-0 rounded-xl blur-xl opacity-20"
                      style={{ 
                        background: `radial-gradient(circle at center, ${service.color} 0%, transparent 60%)`
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* CTA Section */}
        <div className="text-center mt-16">
          <p className="text-gray-400 text-lg mb-6">
            Need a custom solution? Let's create a package that fits your unique needs.
          </p>
          <a 
            href="https://www.oneupapp.io/clientconnect?id=7745"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <button className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:from-pink-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
              Create Custom Package
            </button>
          </a>
        </div>
      </div>
    </section>
  );
}

export default ServicesGrid;