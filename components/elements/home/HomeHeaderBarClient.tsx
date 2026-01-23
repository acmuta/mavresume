"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSessionStore } from "@/store/useSessionStore";

export function HomeHeaderBarClient() {
  const { isAuthenticated } = useSessionStore();
  const [showHeader, setShowHeader] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = document.getElementById("hero");
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setShowHeader(!entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (showHeader) {
      setIsVisible(true);
      return;
    }
    const timeout = setTimeout(() => setIsVisible(false), 300);
    return () => clearTimeout(timeout);
  }, [showHeader]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-0 left-0 z-50 w-full transition-opacity duration-300 ${
        showHeader ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className="absolute inset-0 backdrop-blur-sm 
        [mask-image:linear-gradient(to_top,rgba(0,0,0,1)_0%,rgba(0,0,0,0.6)_40%,rgba(0,0,0,0)_100%)]
        pointer-events-none z-0"
      />
      <header className="relative z-10 w-full px-4 py-3 sm:px-6 lg:px-8">
        <div
          className="mx-auto flex max-w-6xl items-center justify-between gap-3 
          rounded-2xl border border-white/10 
          bg-[#05060a]/80 shadow-[0_18px_45px_rgba(0,0,0,0.65)] 
          px-4 py-2"
        >
          <div className="flex items-center gap-3">
            <Link
              href={isAuthenticated ? "/dashboard" : "/"}
              className="font-bold tracking-tight text-4xl 
              [mask-image:linear-gradient(to_bottom,black_40%,transparent)] 
              [mask-size:100%_100%] [mask-repeat:no-repeat]"
            >
              MAV<span className="font-extralight">RESUME</span>
            </Link>
            <span
              className="hidden rounded-full text-sm border border-[#2b3242] 
              bg-white/5 px-3 py-0.5 font-medium uppercase tracking-[0.2em] 
              text-[#89a5ff] sm:inline-flex"
            >
              Built for UTA Mavericks
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-[#cfd3e1] sm:inline">
              Turn class projects into recruiter-ready bullet points.
            </span>
            <Button
              asChild
              size="sm"
              className="rounded-xl bg-[#274cbc] px-4 text-xs font-semibold 
                         text-white hover:bg-[#315be1] sm:text-sm"
            >
              <Link href="/login">
                Start building
                <ChevronRight className="ml-1 size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>
    </div>
  );
}
