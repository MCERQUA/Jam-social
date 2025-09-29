import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Video, Brain, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import SocialSchedulingForm from '../forms/SocialSchedulingForm';

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
            <motion.section
              key={service.id}
              id={service.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="scroll-mt-24"
            >
              <div className={`grid lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}>
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`p-4 rounded-2xl bg-gradient-to-r ${service.gradient} shadow-lg`}>
                      {service.icon}
                    </div>
                    <h3 className="text-3xl font-bold text-white relative">
                      {service.title}
                      {service.id === 'social-scheduling' && (
                        <>
                          <Sparkles className="absolute -top-3 -left-3 w-5 h-5 text-violet-400 animate-pulse" />
                          <Sparkles className="absolute -top-3 -right-3 w-5 h-5 text-indigo-400 animate-pulse delay-150" />
                          <Sparkles className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-5 h-5 text-violet-400 animate-pulse delay-300" />
                        </>
                      )}
                    </h3>
                  </div>

                  <p className="text-lg text-gray-300 mb-8">
                    {service.description}
                  </p>

                  <ul className="space-y-3 mb-8">
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

                  {service.id !== 'social-scheduling' && (
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
                  )}
                </div>

                <div className={`relative ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  {service.id === 'social-scheduling' ? (
                    <SocialSchedulingForm />
                  ) : (
                    <>
                      <div className={`
                        aspect-square rounded-3xl bg-gradient-to-br ${service.gradient}
                        opacity-20 blur-3xl absolute inset-0
                      `} />
                      <div className={`
                        relative aspect-square rounded-3xl bg-gradient-to-br ${service.gradient}
                        p-[1px]
                      `}>
                        <div className="w-full h-full rounded-3xl bg-black/50 backdrop-blur-sm flex items-center justify-center">
                          <div className="text-white/20">
                            {React.cloneElement(service.icon as React.ReactElement, {
                              className: "w-48 h-48"
                            })}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewServicesGrid;