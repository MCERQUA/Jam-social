import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Video, Music, Palette, Package, Star, ArrowRight } from 'lucide-react';

interface Addon {
  id: string;
  name: string;
  price: string;
  description: string[];
  icon: React.ElementType;
  category: 'video' | 'audio' | '3d';
}

const addons: Addon[] = [
  {
    id: 'custom-8',
    name: 'Custom Video Request',
    price: '$25',
    description: ['8 Generation Pack', 'Professional quality outputs'],
    icon: Video,
    category: 'video'
  },
  {
    id: 'custom-16',
    name: 'Custom Video Request Plus',
    price: '$35',
    description: ['16 Generation Pack', 'More options for the perfect result'],
    icon: Video,
    category: 'video'
  },
  {
    id: 'additional-spins',
    name: 'Additional Spins',
    price: '$5',
    description: ['4 additional spins on custom request', 'Fine-tune your perfect video'],
    icon: Package,
    category: 'video'
  },
  {
    id: '3d-avatar',
    name: 'Custom 3D Avatar',
    price: '$25',
    description: ['Can be printed or setup for games', 'High-quality 3D model'],
    icon: Palette,
    category: '3d'
  },
  {
    id: '3d-tool',
    name: '3D Character Tool & Pose',
    price: '$75+',
    description: ['Add tool to character hand', 'Custom pose creation', 'Perfect for specialized animations'],
    icon: Palette,
    category: '3d'
  },
  {
    id: 'jam-session',
    name: 'Custom Songs "Jam Session"',
    price: '$50/hour',
    description: [
      'Client present for live generation',
      'All songs high quality',
      'Find your perfect "JAM"',
      'Typically 1-3 hours for ideal result'
    ],
    icon: Music,
    category: 'audio'
  }
];

const AddonsMenu: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'video' | 'audio' | '3d'>('all');
  const [hoveredAddon, setHoveredAddon] = useState<string | null>(null);

  const filteredAddons = selectedCategory === 'all'
    ? addons
    : addons.filter(addon => addon.category === selectedCategory);

  const categories = [
    { id: 'all', label: 'All Add-ons', icon: Star },
    { id: 'video', label: 'Video', icon: Video },
    { id: '3d', label: '3D Assets', icon: Palette },
    { id: 'audio', label: 'Audio', icon: Music }
  ];

  return (
    <section className="relative py-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#2D1B69]/20 to-[#0A0A0A]" />

      <div className="absolute inset-0">
        <div className="absolute top-40 right-20 w-72 h-72 bg-blue-600/20 blur-[120px]" />
        <div className="absolute bottom-40 left-20 w-72 h-72 bg-purple-600/20 blur-[120px]" />
      </div>

      <div className="relative z-10 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Plus className="w-8 h-8 text-purple-500" />
            <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Enhance Your Package
            </h2>
            <Plus className="w-8 h-8 text-pink-500" />
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Customize your video content package with professional add-ons
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category.id as any)}
                  className={`
                    px-6 py-3 rounded-full font-semibold
                    flex items-center gap-2
                    transition-all duration-300
                    ${selectedCategory === category.id
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {category.label}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {filteredAddons.map((addon, index) => {
            const Icon = addon.icon;
            return (
              <motion.div
                key={addon.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                onMouseEnter={() => setHoveredAddon(addon.id)}
                onMouseLeave={() => setHoveredAddon(null)}
                className="relative group"
              >
                <div className={`
                  relative rounded-2xl p-6
                  bg-gradient-to-br from-[#1A0E2E]/50 to-[#2D1B69]/30
                  backdrop-blur-xl border border-white/10
                  transition-all duration-300
                  ${hoveredAddon === addon.id ? 'scale-105 border-purple-500/50 shadow-[0_0_30px_rgba(147,51,234,0.2)]' : ''}
                `}>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl">
                        <Icon className="w-6 h-6 text-purple-400" />
                      </div>
                      <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        {addon.price}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3">{addon.name}</h3>

                    <ul className="space-y-2 mb-6">
                      {addon.description.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <ArrowRight className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-300">{item}</span>
                        </li>
                      ))}
                    </ul>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full py-3 rounded-xl font-semibold text-white
                        bg-gradient-to-r from-purple-600/80 to-pink-600/80
                        hover:from-purple-600 hover:to-pink-600
                        transition-all duration-300 shadow-lg hover:shadow-xl
                        flex items-center justify-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Add to Package
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-purple-600/10 to-pink-600/10 backdrop-blur-xl border border-purple-500/20"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Note on Custom Songs
              </h3>
              <p className="text-gray-300 max-w-2xl">
                All songs produced (<a
                  href="https://sprayfoamradio.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 underline transition-colors"
                >SprayFoam Radio</a>) typically require 2+ hours and potentially
                a hundred generations to find the perfect match. With our enhanced systems,
                we're confident we'll find your "jam" in one session!
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
            >
              <Music className="w-5 h-5" />
              Book a Jam Session
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AddonsMenu;