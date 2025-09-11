"use client";

import React from "react";
import { motion } from "framer-motion";

export function JamJarDivider() {
  return (
    <div className="relative py-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-900/10 to-transparent" />
      
      <motion.div 
        className="relative flex flex-col justify-center items-center"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <div className="relative">
          {/* Glow effect behind image */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 blur-3xl" />
          
          {/* Jam jar image */}
          <motion.img 
            src="/images/jam-jar.webp" 
            alt="" 
            className="relative w-48 h-48 md:w-64 md:h-64 object-contain drop-shadow-2xl"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
        
        {/* Tagline text */}
        <motion.p 
          className="mt-6 text-gray-400 italic text-sm md:text-base text-center max-w-md px-4"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          Hand-crafted in small batches by our AI artisans for maximum reach and flavor
        </motion.p>
      </motion.div>
    </div>
  );
}

export default JamJarDivider;