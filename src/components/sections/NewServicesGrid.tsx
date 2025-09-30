import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Video, Brain, ArrowRight, CheckCircle } from 'lucide-react';
import SocialSchedulingForm from '../forms/SocialSchedulingForm';
import { SparklesText } from '../ui/sparkles-text';
import ConnectAccountSection from './ConnectAccountSection';
import CharacterPackages from './CharacterPackages';

const NewServicesGrid: React.FC = () => {
  const services = [
    {
      id: 'social-scheduling',
      icon: <Calendar className="w-12 h-12" />,
      title: 'Social Media Scheduling',
      description: 'Automate your social presence across all platforms with intelligent scheduling',
      features: [
        'Multi-platform posting',
        'Optimal timing analysis',
        'Content calendar management',
        'Performance tracking'
      ],
      gradient: 'from-violet-600 to-indigo-600'
    },
    {
      id: 'mascot-setup',
      icon: <Users className="w-12 h-12" />,
      title: 'Company Mascot Setup',
      description: 'Create a memorable brand personality with custom mascot development',
      features: [
        'Character design & development',
        'Brand voice creation',
        'Style guide documentation',
        'Cross-platform consistency'
      ],
      gradient: 'from-indigo-600 to-cyan-600'
    },
    {
      id: 'video-creation',
      icon: <Video className="w-12 h-12" />,
      title: 'Video Creation',
      description: 'Transform your company assets into engaging video content',
      features: [
        'Asset-based video production',
        'Motion graphics & animation',
        'Social media optimization',
        'Multi-format delivery'
      ],
      gradient: 'from-cyan-600 to-teal-600'
    },
    {
      id: 'ai-websites',
      icon: <Brain className="w-12 h-12" />,
      title: 'AI-Powered Websites',
      description: 'Intelligent websites that evolve and optimize themselves automatically',
      features: [
        'Self-improving content',
        'Automated A/B testing',
        'Personalized user experiences',
        'Performance optimization'
      ],
      gradient: 'from-teal-600 to-emerald-600'
    }
  ];

  return (
    <div className="relative py-12 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black" />

      <div className="relative z-10 container mx-auto px-4">
        <div className="space-y-32">
          {services.map((service, index) => (
            <>
              <motion.section
                key={service.id}
                id={service.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                className="scroll-mt-24"
              >
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <div className={`p-4 rounded-2xl bg-gradient-to-r ${service.gradient} shadow-lg`}>
                      {service.icon}
                    </div>
                  </div>

                  <SparklesText
                    text={service.title}
                    className="text-4xl md:text-5xl font-bold text-white mb-6"
                    sparklesCount={12}
                  />

                  <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                    {service.description}
                  </p>

                  <ul className="space-y-3 mb-8 max-w-2xl mx-auto text-left">
                    {service.features.map((feature, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * idx }}
                        viewport={{ once: true }}
                        className="flex items-center gap-3"
                      >
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>

                  {service.id !== 'social-scheduling' && service.id !== 'mascot-setup' && (
                    <a
                      href="https://www.oneupapp.io/clientconnect?id=7745"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block"
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`
                          px-8 py-4 rounded-full bg-gradient-to-r ${service.gradient}
                          text-white font-semibold flex items-center gap-2
                          hover:shadow-lg transition-shadow duration-300
                        `}
                      >
                        Get Started
                        <ArrowRight className="w-5 h-5" />
                      </motion.button>
                    </a>
                  )}
                </div>

                <div className="mt-12">
                  {service.id === 'social-scheduling' ? (
                    <SocialSchedulingForm />
                  ) : service.id === 'mascot-setup' ? (
                    <CharacterPackages />
                  ) : null}
                </div>
              </div>
            </motion.section>
            {service.id === 'social-scheduling' && (
              <div className="mt-16">
                <ConnectAccountSection />
              </div>
            )}
          </>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewServicesGrid;