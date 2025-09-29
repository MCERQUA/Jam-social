import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Plus, Music, Palette, Video, Image, Calendar, Truck, Phone, ThumbsUp, Star, Film, Sparkles } from 'lucide-react';
import { SparklesText } from '../ui/sparkles-text';

const CharacterPackages: React.FC = () => {
  const [selectedPackage, setSelectedPackage] = useState<string>('advanced');

  const packages = [
    {
      id: 'base',
      name: 'Company Base Character Setup',
      price: '$500',
      gradient: 'from-blue-600 to-cyan-600',
      features: [
        {
          category: 'Character Creation',
          items: ['Company character creation image on Greenscreen background']
        },
        {
          category: 'Script/Line Suggestions (text)',
          items: [
            '15x 8-second 2-line/sentence script suggestions (2 required to be chosen)',
            '10x 8-second 2-line/sentence script suggestions for holidays (one for each holiday to be chosen)'
          ]
        },
        {
          category: 'Asset Creation (greenscreen video)',
          items: [
            'Both selected 2-liner scripts from above',
            'All selected holiday lines'
          ]
        },
        {
          category: 'Suggested Content Creation (6-8 Second Video Clips)',
          items: [
            '8 random logo animation gen attempts (usually 2-4 useable)',
            '3 Clips with 2-line script featuring character',
            '3 Holiday Video clips (Valentine\'s Day, 4th of July, Christmas)'
          ]
        }
      ]
    },
    {
      id: 'advanced',
      name: 'Advanced Setup',
      price: '$750',
      gradient: 'from-violet-600 to-purple-600',
      popular: true,
      features: [
        {
          category: 'Everything in Basic Setup Plus',
          items: []
        },
        {
          category: 'Asset Creation (GreenScreen Images)',
          items: [
            '4 images of Truck/vehicle wrapped with branding (all angles)',
            '4 background scene images (office, shop exterior, home, jobsite)'
          ]
        },
        {
          category: 'Asset Creation (GreenScreen Videos)',
          items: [
            'Character holding bottom of screen popping head up',
            '4 additional logo animation attempts'
          ]
        },
        {
          category: 'Content Creation (5-8 Second Video Clips)',
          items: [
            'Character answering phone at office/reception',
            'Outside shop/business street view pull out of truck',
            'Truck driving down street',
            'Outside streetview of home',
            'Cartoon version of jobsite',
            'Full Video of all clips combined'
          ]
        }
      ]
    },
    {
      id: 'full',
      name: 'Full Setup Package',
      price: '$1000',
      gradient: 'from-emerald-600 to-teal-600',
      features: [
        {
          category: 'Everything in Advanced Setup Plus',
          items: []
        },
        {
          category: 'Asset Creation (greenscreen)',
          items: [
            'Character peaking over ledge',
            'Character waving',
            'Character giving thumbs up',
            'Character answering cell phone',
            'Character pointing up & call me sign',
            'Character making surprised look',
            '3D version of logo',
            'Character leaning on 3D logo'
          ]
        },
        {
          category: 'Additional Content Creation',
          items: [
            '8 additional logo animation attempts',
            '4 additional 2-line script clips',
            '4 more Holiday Videos (St. Patrick\'s, Memorial, Veterans, Halloween)'
          ]
        }
      ]
    }
  ];


  return (
    <div className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <SparklesText
          text="Character Video Creation Setup Packages"
          className="text-4xl md:text-5xl font-bold text-white mb-4"
          sparklesCount={15}
        />
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Professional character creation and branding packages to bring your company mascot to life
        </p>
      </motion.div>

      {/* Package Cards */}
      <div className="grid lg:grid-cols-3 gap-8 mb-16">
        {packages.map((pkg, index) => (
          <motion.div
            key={pkg.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            onClick={() => setSelectedPackage(pkg.id)}
            className={`relative cursor-pointer ${
              selectedPackage === pkg.id ? 'scale-105' : ''
            } transition-transform duration-300`}
          >
            {pkg.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  Most Popular
                </div>
              </div>
            )}

            <div
              className={`
                relative h-full rounded-2xl p-[1px] bg-gradient-to-r ${pkg.gradient}
                ${selectedPackage === pkg.id ? 'shadow-2xl shadow-violet-500/30' : ''}
              `}
            >
              <div className="h-full bg-black/90 backdrop-blur-sm rounded-2xl p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                  <div className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                    {pkg.price}
                  </div>
                </div>

                <div className="space-y-6">
                  {pkg.features.map((section, idx) => (
                    <div key={idx}>
                      {section.category && (
                        <h4 className="text-sm font-semibold text-violet-400 mb-3">
                          {section.category}
                        </h4>
                      )}
                      {section.items.length > 0 && (
                        <ul className="space-y-2">
                          {section.items.map((item, itemIdx) => (
                            <li key={itemIdx} className="flex items-start gap-2">
                              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-300 text-sm">{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>

                <a
                  href="https://www.oneupapp.io/clientconnect?id=7745"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      w-full mt-8 py-3 rounded-full bg-gradient-to-r ${pkg.gradient}
                      text-white font-semibold hover:shadow-lg transition-shadow duration-300
                    `}
                  >
                    Select Package
                  </motion.button>
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Custom Videos Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mt-20"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              <Film className="w-10 h-10 text-violet-400" />
              Custom Video Production
              <Sparkles className="w-10 h-10 text-violet-400" />
            </h3>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Professional custom videos combining existing and newly created assets
            </p>
          </div>

          <div className="bg-gradient-to-r from-violet-600/10 to-purple-600/10 border-2 border-violet-500/30 rounded-2xl p-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Video className="w-8 h-8 text-violet-400" />
                <h4 className="text-2xl font-bold text-white">Custom Video Services</h4>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h5 className="text-lg font-semibold text-violet-400">What's Included:</h5>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">10-60 second professional videos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">Clipped and combined 8-second segments</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">Uses your existing character assets</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">Newly created assets for your specific request</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">Professional editing and post-production</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-6">
                  <div>
                    <h5 className="text-lg font-semibold text-violet-400 mb-3">Pricing</h5>
                    <div className="bg-black/30 rounded-xl p-4 border border-violet-500/20">
                      <div className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                        $750 - $1,200
                      </div>
                      <p className="text-gray-400 text-sm mt-2">per custom video project</p>
                    </div>
                  </div>

                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                    <p className="text-amber-400 font-semibold flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      Prerequisites Required
                    </p>
                    <p className="text-gray-300 text-sm mt-2">
                      Minimum Basic Company Setup package ($500) required before custom video services
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <a
                  href="https://www.oneupapp.io/clientconnect?id=7745"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold text-lg hover:shadow-lg hover:shadow-violet-500/30 transition-all duration-300 flex items-center gap-2"
                  >
                    Request Custom Video
                    <Video className="w-5 h-5" />
                  </motion.button>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 border border-blue-500/30 rounded-xl">
            <p className="text-gray-300 text-center">
              <strong className="text-blue-400">Pro Tip:</strong> Custom videos are perfect for special promotions,
              seasonal campaigns, product launches, or any unique content needs that go beyond your standard package assets.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CharacterPackages;