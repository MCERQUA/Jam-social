"use client";

import React, { useState } from 'react';
import { Sparkles, DollarSign, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ServiceCardProps {
  className?: string;
  title?: string;
  description?: string;
  features?: string[];
  price?: string;
  highlight?: boolean;
}

interface DisplayCardsProps {
  cards?: ServiceCardProps[];
  className?: string;
}

const ServiceCard: React.FC<ServiceCardProps & { isActive?: boolean; onClick?: () => void; index?: number }> = ({
  className,
  title,
  description,
  features,
  price,
  highlight,
  isActive,
  onClick,
  index = 0,
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: isActive ? 1.05 : 1,
        zIndex: isActive ? 10 : 1
      }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -5 }}
      onClick={onClick}
      className={cn(
        "relative cursor-pointer rounded-xl border bg-gray-900/80 backdrop-blur-sm p-6 transition-all duration-300",
        highlight ? "border-pink-500/50 shadow-[0_0_30px_rgba(236,72,153,0.2)]" : "border-gray-700/50",
        isActive && "border-purple-500 shadow-[0_0_50px_rgba(168,85,247,0.3)]",
        className
      )}
    >
      {highlight && (
        <div className="absolute -top-3 right-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
          POPULAR
        </div>
      )}
      
      <div className="mb-4">
        <h3 className="text-xl font-bold text-white mb-2">
          {title}
        </h3>
        <p className="text-gray-400 text-sm">
          {description}
        </p>
      </div>
      
      {features && features.length > 0 && (
        <ul className="space-y-2 mb-6">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start text-sm text-gray-300">
              <Zap className="w-4 h-4 text-pink-500 mr-2 mt-0.5 flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
      )}
      
      {price && (
        <div className="pt-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
              {price}
            </span>
            <button className="px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-sm font-semibold rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-300">
              Get Started
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export const DisplayCards: React.FC<DisplayCardsProps> = ({
  cards = [],
  className
}) => {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  
  return (
    <div className={cn("relative", className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((cardProps, index) => (
          <ServiceCard
            key={index}
            {...cardProps}
            index={index}
            isActive={activeCard === index}
            onClick={() => setActiveCard(activeCard === index ? null : index)}
          />
        ))}
      </div>
    </div>
  );
};

export default DisplayCards;