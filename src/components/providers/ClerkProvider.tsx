"use client";

import React from "react";
import { ClerkProvider as BaseClerkProvider } from "@clerk/clerk-react";

interface ClerkProviderProps {
  children: React.ReactNode;
}

const publishableKey = import.meta.env.PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error("Missing Clerk Publishable Key");
}

export function ClerkProvider({ children }: ClerkProviderProps) {
  return (
    <BaseClerkProvider publishableKey={publishableKey}>
      {children}
    </BaseClerkProvider>
  );
}
