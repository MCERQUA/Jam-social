"use client";

import React from "react";

interface ClientConnectFrameProps {
  className?: string;
  height?: string;
}

export function ClientConnectFrame({ 
  className = "",
  height = "600px"
}: ClientConnectFrameProps) {
  return (
    <div className={`w-full ${className}`}>
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}> {/* 16:9 Aspect Ratio */}
        <iframe
          src="https://www.oneupapp.io/clientconnect?id=7745"
          className="absolute top-0 left-0 w-full h-full"
          style={{
            border: "none",
            minHeight: height
          }}
          title="Jam Social Client Connect"
          loading="lazy"
          allowFullScreen
        />
      </div>
    </div>
  );
}

export default ClientConnectFrame;