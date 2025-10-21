"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClerkProvider } from "../providers/ClerkProvider";

export const SignupRestrictedForm: React.FC = () => {
  const [showModal, setShowModal] = useState(true);

  return (
    <ClerkProvider>
      <div className="w-full max-w-md mx-auto">
        {/* Restricted Signup Card */}
        <motion.div
          className="bg-gray-800/50 backdrop-blur-xl border border-gray-500/20 shadow-2xl rounded-2xl p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Lock Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-pink-600/20 to-purple-600/20 flex items-center justify-center border border-purple-500/30">
              <svg
                className="w-10 h-10 text-purple-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-center text-white mb-3">
            Signups Restricted
          </h2>

          {/* Subtitle */}
          <p className="text-center text-gray-400 mb-6">
            New signups are currently available for paying customers only
          </p>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent mb-6" />

          {/* Info Box */}
          <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/20 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-purple-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Want to sign up?
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Purchase one of our setup packages to get an account and access to our
              AI-powered social media management platform.
            </p>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => setShowModal(true)}
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg shadow-purple-500/30 transition-all duration-300 transform hover:scale-[1.02] mb-4"
          >
            View Setup Packages
          </button>

          {/* Secondary Button - Back to Login */}
          <a
            href="/login"
            className="block w-full text-center bg-gray-700/50 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-xl border border-gray-500/50 transition-all duration-300"
          >
            Back to Login
          </a>

          {/* Footer Link */}
          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-violet-400 hover:text-violet-300 transition-colors text-sm inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Home
            </a>
          </div>
        </motion.div>

        {/* Modal Popup */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
            >
              <motion.div
                className="bg-gray-800 border border-purple-500/30 rounded-2xl p-8 max-w-lg w-full shadow-2xl"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                  aria-label="Close"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                {/* Modal Header */}
                <div className="text-center mb-6">
                  <div className="inline-block p-3 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full mb-4">
                    <svg
                      className="w-12 h-12 text-purple-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Get Started with Jam Social
                  </h3>
                  <p className="text-gray-400">
                    Choose a package that fits your needs
                  </p>
                </div>

                {/* Modal Content */}
                <div className="space-y-4 mb-6">
                  <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/20 rounded-xl p-4">
                    <h4 className="font-semibold text-white mb-2">Setup Packages Include:</h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Personal account with secure access</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>AI-powered social media management</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Media storage and processing</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Full platform access and support</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="space-y-3">
                  <a
                    href="/services"
                    className="block w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-purple-500/30 transition-all duration-300 transform hover:scale-[1.02] text-center"
                  >
                    Browse Setup Packages
                  </a>
                  <button
                    onClick={() => setShowModal(false)}
                    className="block w-full bg-gray-700/50 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-xl border border-gray-500/50 transition-all duration-300"
                  >
                    Maybe Later
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ClerkProvider>
  );
};
