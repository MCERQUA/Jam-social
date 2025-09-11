"use client";

import React from "react";
import { motion } from "framer-motion";
import { SparklesText } from "../ui/sparkles-text";

function ConnectAccountSection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <SparklesText 
            text="Connect Your Social Accounts Here"
            className="text-4xl md:text-6xl font-bold text-white mb-6"
            sparklesCount={10}
          />
          
          <p className="text-xl text-gray-300 mb-4">
            Start your social media management journey now!
          </p>
          
          <p className="text-lg text-gray-400 mb-4 max-w-2xl mx-auto">
            Click the button below to securely connect your social media accounts. Get instant access to our professional management tools and start growing your online presence today.
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border-2 border-yellow-500 rounded-2xl p-6 mb-8 max-w-3xl mx-auto"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
              </svg>
              <span className="text-2xl font-bold text-yellow-500">LIMITED TIME OFFER</span>
              <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-white mb-3">
              Get 1 FREE Post for Every Account You Connect!
            </h3>
            <p className="text-lg text-gray-300 mb-4">
              Connect up to <span className="text-yellow-500 font-bold">12 social media accounts</span> and receive <span className="text-yellow-500 font-bold">1 FREE post credit</span> for each account connected!
            </p>
            <div className="bg-black/30 rounded-lg p-4">
              <p className="text-md text-gray-300 mb-2">
                <span className="text-green-400 font-semibold">✓</span> Each free post can be scheduled across ALL your connected platforms
              </p>
              <p className="text-md text-gray-300 mb-2">
                <span className="text-green-400 font-semibold">✓</span> Connect 12 accounts = Get 12 FREE posts
              </p>
              <p className="text-md text-gray-300">
                <span className="text-green-400 font-semibold">✓</span> No credit card required to start
              </p>
            </div>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <div className="flex items-center gap-2 text-gray-300">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Quick Setup</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Secure Connection</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>All Platforms Supported</span>
            </div>
          </div>

          <motion.a
            href="https://www.oneupapp.io/clientconnect?id=7745"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Connect Your Accounts Now
          </motion.a>

          <p className="text-sm text-gray-500 mt-6">
            Trusted by thousands of businesses worldwide
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-500 mb-2">12</div>
            <div className="text-sm text-gray-400">Social Platforms</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-500 mb-2">24/7</div>
            <div className="text-sm text-gray-400">Support Available</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-pink-500 mb-2">100%</div>
            <div className="text-sm text-gray-400">Secure & Private</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-500 mb-2">5 Min</div>
            <div className="text-sm text-gray-400">Setup Time</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default ConnectAccountSection;