"use client";

import React from "react";
import { SignIn } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { ClerkProvider } from "../providers/ClerkProvider";

export const LoginForm: React.FC = () => {
  return (
    <ClerkProvider>
      <motion.div
        className="w-full max-w-md mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <SignIn
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-gray-800/50 backdrop-blur-xl border border-gray-500/20 shadow-2xl",
              headerTitle: "text-white",
              headerSubtitle: "text-gray-400",
              socialButtonsBlockButton: "bg-gray-700/50 border-gray-500/50 hover:bg-gray-700 text-white",
              socialButtonsBlockButtonText: "text-white",
              formButtonPrimary: "bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 shadow-lg shadow-purple-500/30",
              formFieldInput: "bg-gray-900/60 border-gray-500/30 text-gray-200 focus:border-purple-500",
              formFieldLabel: "text-gray-400",
              footerActionLink: "text-violet-400 hover:text-violet-300",
              identityPreviewText: "text-gray-300",
              identityPreviewEditButtonIcon: "text-gray-400",
              formResendCodeLink: "text-violet-400 hover:text-violet-300",
              otpCodeFieldInput: "bg-gray-900/60 border-gray-500/30 text-gray-200",
              formFieldInputShowPasswordButton: "text-gray-400 hover:text-white",
              dividerLine: "bg-gray-600",
              dividerText: "text-gray-400",
              formFieldSuccessText: "text-green-400",
              formFieldErrorText: "text-red-400",
              formFieldHintText: "text-gray-500",
              footer: "hidden",
            },
          }}
          routing="virtual"
          signUpUrl="/signup"
          afterSignInUrl="/dashboard"
        />
      </motion.div>
    </ClerkProvider>
  );
};
