"use client";

import React from "react";
import { motion } from "framer-motion";

export function JamJarDivider() {
  return (
    <div className="relative py-16 md:py-24 overflow-visible">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-900/20 to-transparent" />
      
      <motion.div 
        className="relative flex flex-col justify-center items-center"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <div className="relative">
          {/* Very subtle, tight glow effect - minimal spread */}
          <div className="absolute -inset-2 md:-inset-3 bg-gradient-to-r from-pink-500/10 via-purple-500/12 to-blue-500/10 blur-[20px] md:blur-[25px]" />
          <div className="absolute -inset-1 md:-inset-1.5 bg-gradient-to-r from-purple-600/8 via-pink-600/10 to-purple-600/8 blur-[15px]" />
          
          {/* Jam jar image - significantly larger */}
          <motion.img 
            src="/images/jam-jar.webp" 
            alt="Jam Social Media jar with label" 
            className="relative w-72 h-72 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem] object-contain drop-shadow-2xl"
            animate={{
              y: [0, -15, 0],
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
          className="mt-8 text-gray-400 italic text-base md:text-lg text-center max-w-md px-4"
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