"use client";

import React from "react";
import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    services: [
      { name: "Content Creation", href: "#services" },
      { name: "Social Media Management", href: "#services" },
      { name: "Analytics & Reporting", href: "#services" },
      { name: "Influencer Marketing", href: "#services" },
    ],
    platforms: [
      { name: "Instagram", href: "#platforms" },
      { name: "LinkedIn", href: "#platforms" },
      { name: "TikTok", href: "#platforms" },
      { name: "YouTube", href: "#platforms" },
    ],
    company: [
      { name: "About Us", href: "#team" },
      { name: "Portfolio", href: "#videos" },
      { name: "Contact", href: "#contact" },
      { name: "Privacy Policy", href: "/privacy" },
    ],
    social: [
      { name: "Instagram", href: "https://instagram.com" },
      { name: "LinkedIn", href: "https://linkedin.com" },
      { name: "X", href: "https://x.com" },
      { name: "Facebook", href: "https://facebook.com" },
    ],
  };

  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-4">
                Jam Social Media
              </h3>
              <p className="text-gray-400 text-sm mb-6 max-w-md">
                Elevating your brand across all social platforms with strategic content, 
                data-driven insights, and creative excellence.
              </p>
              <div className="flex space-x-4">
                {footerLinks.social.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-pink-500 transition-colors duration-300"
                    aria-label={link.name}
                  >
                    <span className="text-sm">{link.name}</span>
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Services Column */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h4 className="text-white font-semibold mb-4">Services</h4>
              <ul className="space-y-2">
                {footerLinks.services.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-pink-500 text-sm transition-colors duration-300"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Platforms Column */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h4 className="text-white font-semibold mb-4">Platforms</h4>
              <ul className="space-y-2">
                {footerLinks.platforms.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-pink-500 text-sm transition-colors duration-300"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Company Column */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-pink-500 text-sm transition-colors duration-300"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-gray-800"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500 text-sm">
              {currentYear} Jam Social Media. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a
                href="/terms"
                className="text-gray-500 hover:text-pink-500 text-sm transition-colors duration-300"
              >
                Terms of Service
              </a>
              <a
                href="/privacy"
                className="text-gray-500 hover:text-pink-500 text-sm transition-colors duration-300"
              >
                Privacy Policy
              </a>
              <a
                href="/cookies"
                className="text-gray-500 hover:text-pink-500 text-sm transition-colors duration-300"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;