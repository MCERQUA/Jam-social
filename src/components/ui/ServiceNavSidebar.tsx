import React, { useState, useEffect } from 'react';
import { Calendar, Users, Video, Brain } from 'lucide-react';
import { motion } from 'framer-motion';

interface ServiceNavItem {
  icon: React.ReactNode;
  targetId: string;
  label: string;
}

const ServiceNavSidebar: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('');

  const services: ServiceNavItem[] = [
    {
      icon: <Calendar className="w-6 h-6" />,
      targetId: 'social-scheduling',
      label: 'Social Media Scheduling'
    },
    {
      icon: <Users className="w-6 h-6" />,
      targetId: 'mascot-setup',
      label: 'Company Mascot Setup'
    },
    {
      icon: <Video className="w-6 h-6" />,
      targetId: 'video-creation',
      label: 'Video Creation'
    },
    {
      icon: <Brain className="w-6 h-6" />,
      targetId: 'ai-websites',
      label: 'AI-Powered Websites'
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = services.map(s => document.getElementById(s.targetId));
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      sections.forEach((section, index) => {
        if (section) {
          const { top, bottom } = section.getBoundingClientRect();
          const absoluteTop = window.scrollY + top;
          const absoluteBottom = window.scrollY + bottom;

          if (scrollPosition >= absoluteTop && scrollPosition <= absoluteBottom) {
            setActiveSection(services[index].targetId);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (targetId: string) => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
      className="fixed left-8 top-1/2 -translate-y-1/2 z-50 hidden lg:block"
    >
      <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-full p-3">
        <nav className="flex flex-col gap-4">
          {services.map((service) => (
            <motion.button
              key={service.targetId}
              onClick={() => scrollToSection(service.targetId)}
              className={`
                relative p-3 rounded-full transition-all duration-300
                ${activeSection === service.targetId
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/30'
                  : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white'}
                border border-white/10 hover:border-white/20
                group
              `}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title={service.label}
            >
              {service.icon}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                whileHover={{ opacity: 1, x: 0 }}
                className="absolute left-full ml-4 top-1/2 -translate-y-1/2 pointer-events-none"
              >
                <div className="bg-black/90 backdrop-blur-sm text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap border border-white/10">
                  {service.label}
                </div>
              </motion.div>
            </motion.button>
          ))}
        </nav>
      </div>
    </motion.div>
  );
};

export default ServiceNavSidebar;