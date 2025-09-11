"use client";

import React from "react";
import { SparklesText } from "../ui/sparkles-text";
import { motion } from "framer-motion";

function DashboardShowcase() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <SparklesText 
            text="Powerful Dashboard"
            className="text-4xl md:text-6xl font-bold text-white mb-6"
            sparklesCount={15}
          />
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Manage all your social media accounts from one intuitive dashboard. 
            Track performance, schedule posts, and engage with your audience seamlessly.
          </p>
        </div>
        
        <motion.div 
          className="relative max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          {/* Glow effect behind image */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 blur-3xl -z-10" />
          
          {/* Dashboard image with border */}
          <div className="relative rounded-2xl overflow-hidden border border-gray-700/50 shadow-2xl">
            <img 
              src="/images/dashboard-preview.png" 
              alt="Jam Social Dashboard Preview" 
              className="w-full h-auto"
            />
            
            {/* Gradient overlay at bottom for fade effect */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
          </div>
          
          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="text-3xl mb-2">📊</div>
              <h3 className="text-lg font-semibold text-white mb-2">Real-time Analytics</h3>
              <p className="text-gray-400 text-sm">Track engagement and growth metrics instantly</p>
            </motion.div>
            
            <motion.div 
              className="text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="text-3xl mb-2">🔄</div>
              <h3 className="text-lg font-semibold text-white mb-2">Unified Management</h3>
              <p className="text-gray-400 text-sm">Control all platforms from one interface</p>
            </motion.div>
            
            <motion.div 
              className="text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="text-lg font-semibold text-white mb-2">Quick Actions</h3>
              <p className="text-gray-400 text-sm">Post, reply, and engage with one click</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default DashboardShowcase;