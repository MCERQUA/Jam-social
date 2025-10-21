"use client";

import React from "react";
import { ClerkProvider as BaseClerkProvider } from "@clerk/clerk-react";

interface ClerkProviderProps {
  children: React.ReactNode;
}

export function ClerkProvider({ children }: ClerkProviderProps) {
  // Get the publishable key at runtime (client-side only)
  const publishableKey = import.meta.env.PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    console.error("Missing Clerk Publishable Key");
    return <div>Error: Missing Clerk configuration</div>;
  }

  return (
    <BaseClerkProvider publishableKey={publishableKey}>
      {children}
    </BaseClerkProvider>
  );
}
