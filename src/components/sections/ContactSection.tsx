"use client";

import React, { useState } from "react";
import { SparklesText } from "../ui/sparkles-text";

function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    message: "",
    services: [] as string[]
  });

  const serviceOptions = [
    "Content Strategy",
    "Social Media Management", 
    "Influencer Partnerships",
    "Paid Advertising",
    "Analytics & Reporting",
    "Community Management"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission here
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <SparklesText 
            text="Let's Get Started"
            className="text-4xl md:text-6xl font-bold text-white mb-6"
            sparklesCount={15}
          />
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Ready to transform your social media presence? Get in touch with our team
          </p>
        </div>
        
        <div className="relative bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-pink-500/20 shadow-[0_0_50px_rgba(236,72,153,0.15)]">
          {/* Pink glow effect */}
          <div className="absolute -inset-[2px] bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur-xl" />
          <form onSubmit={handleSubmit} className="relative space-y-6 z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-pink-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                  placeholder="Your full name"
                />
              </div>
              
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-pink-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                  placeholder="Your company name"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-700/50 border border-pink-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                placeholder="your.email@example.com"
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="Your phone number"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">
                Services Interested In
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {serviceOptions.map((service) => (
                  <button
                    key={service}
                    type="button"
                    onClick={() => handleServiceToggle(service)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      formData.services.includes(service)
                        ? "bg-pink-600 text-white border border-pink-500"
                        : "bg-gray-700/50 text-gray-300 border border-pink-500/20 hover:border-pink-500/40"
                    }`}
                  >
                    {service}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                Tell us about your project *
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                value={formData.message}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-700/50 border border-pink-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 resize-vertical"
                placeholder="Describe your social media goals, target audience, and any specific requirements..."
              />
            </div>
            
            <div className="text-center">
              <button
                type="submit"
                className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-12 py-4 rounded-full font-semibold text-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <SparklesText 
                  text="Send Message"
                  className="text-lg font-semibold"
                  sparklesCount={8}
                />
              </button>
              <p className="text-gray-400 text-sm mt-4">
                We'll get back to you within 24 hours with a custom proposal
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;