"use client";

import React from "react";
import { ClientConnectFrame } from "../ui/ClientConnectFrame";
import { SparklesText } from "../ui/sparkles-text";

function ClientConnectSection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <SparklesText 
            text="Connect With Us"
            className="text-4xl md:text-6xl font-bold text-white mb-6"
            sparklesCount={12}
          />
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Connect your social media accounts directly - no login required
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <ClientConnectFrame height="700px" />
        </div>
      </div>
    </section>
  );
}

export default ClientConnectSection;