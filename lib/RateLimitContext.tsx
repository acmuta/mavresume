"use client";

import React, { createContext, useContext } from "react";
import { RateLimitInfo } from "./bulletRefinement";

interface RateLimitContextType {
  updateFromHeaders: (rateLimit?: RateLimitInfo) => void;
}

const RateLimitContext = createContext<RateLimitContextType | undefined>(
  undefined
);

/**
 * Provider component for rate limit context.
 * Allows child components to update rate limit status from API response headers.
 */
export function RateLimitProvider({
  children,
  updateFromHeaders,
}: {
  children: React.ReactNode;
  updateFromHeaders: (rateLimit?: RateLimitInfo) => void;
}) {
  return (
    <RateLimitContext.Provider value={{ updateFromHeaders }}>
      {children}
    </RateLimitContext.Provider>
  );
}

/**
 * Hook to access rate limit context.
 * Returns null if context is not available (e.g., outside provider).
 * 
 * @returns Rate limit context with updateFromHeaders function, or null if not available
 */
export function useRateLimitContext() {
  const context = useContext(RateLimitContext);
  return context || null;
}
