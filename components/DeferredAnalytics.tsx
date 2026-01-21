"use client";

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export function DeferredAnalytics() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const cb = () => setMounted(true);
    if (typeof requestIdleCallback !== "undefined") {
      requestIdleCallback(cb, { timeout: 2000 });
    } else {
      setTimeout(cb, 500);
    }
  }, []);

  if (!mounted) return null;

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
