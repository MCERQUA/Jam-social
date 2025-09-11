"use client";

import React from "react";
import { SparklesText } from "../ui/sparkles-text";
import { motion } from "framer-motion";

function ServicesHero() {
  return (
    <section className="relative min-h-[50vh] flex items-center justify-center py-20 px-4 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-pink-900/10 to-black" />
      
      {/* Animated background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      
      <div className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <SparklesText 
            text="Our Services"
            className="text-5xl md:text-7xl font-bold text-white mb-6"
            sparklesCount={20}
          />
        </motion.div>
        
        <motion.p 
          className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Comprehensive social media solutions tailored to elevate your brand's digital presence
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8"
        >
          <a 
            href="https://www.oneupapp.io/clientconnect?id=7745"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-[0_0_30px_rgba(236,72,153,0.4)]">
              Get Started Today
            </button>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default ServicesHero;