"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaGithub, FaDiscord } from "react-icons/fa";
import { Lightbulb, HelpCircle, GraduationCap } from "lucide-react";

interface SidebarLink {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  ariaLabel: string;
  external?: boolean;
}

const sidebarLinks: SidebarLink[] = [
  {
    href: "https://github.com/acmuta/mavresume",
    label: "GitHub",
    icon: FaGithub,
    ariaLabel: "GitHub repository",
    external: true,
  },
  {
    href: "https://www.acmuta.com",
    label: "ACM @ UTA",
    icon: GraduationCap,
    ariaLabel: "ACM at UTA website",
    external: true,
  },
  {
    href: "https://discord.gg/WjrDwNn5es",
    label: "Discord",
    icon: FaDiscord,
    ariaLabel: "Discord server",
    external: true,
  },
  {
    href: "https://github.com/acmuta/mavresume#readme",
    label: "Help",
    icon: HelpCircle,
    ariaLabel: "Documentation",
    external: true,
  },
];

const resumeTips = [
  "Use action verbs (Led, Built, Improved) to start bullet points",
  "Quantify your impact with numbers (e.g., 'Reduced load time by 30%')",
  "Focus on achievements, not just responsibilities",
  "Keep bullet points concise - aim for 1-2 lines each",
  "Tailor your resume to match job descriptions",
  "Use consistent formatting and professional fonts",
];

export const BuilderSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  // Rotate tips every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % resumeTips.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <aside
      className={`hidden md:flex fixed left-0 top-0 h-full z-30
                 ${isExpanded ? "w-55" : "w-25"}
                 bg-[#15171c]/90 backdrop-blur-md
                 border-r border-[#2d313a]
                 transition-all duration-300 ease-in-out
                 overflow-hidden
                 flex-col`}
      role="navigation"
      aria-label="Builder navigation sidebar"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="flex flex-col h-full w-full">
        {/* Logo Section */}
        <div className="px-4 py-4 border-b border-[#2d313a] relative h-[8vh] flex items-center">
          <Link
            href="/"
            className="flex items-center font-bold tracking-tight text-3xl
                       mask-[linear-gradient(to_bottom,black_40%,transparent)] 
                       mask-size-[100%_100%] mask-no-repeat
                       text-white hover:text-white transition-colors duration-300
                       relative w-full justify-center"
            aria-label="MavResume home"
          >
            {/* Collapsed logo */}
            <span
              className={`absolute left-1/2 -translate-x-1/2 
                         transition-all duration-300 ease-in-out whitespace-nowrap
                         ${
                           isExpanded
                             ? "opacity-0  pointer-events-none"
                             : "opacity-100 "
                         }`}
            >
              M
            </span>
            {/* Expanded logo */}
            <span
              className={`transition-all duration-300 ease-in-out whitespace-nowrap
                         ${
                           isExpanded
                             ? "opacity-100 "
                             : "opacity-0  pointer-events-none"
                         }`}
              style={{
                transitionDelay: isExpanded ? "50ms" : "0ms",
              }}
            >
              MAV<span className="font-extralight">RESUME</span>
            </span>
          </Link>
        </div>

        {/* Links Section */}
        <div
          className={`flex-1 flex flex-col gap-3 px-3 py-4 overflow-y-auto
                     transition-all duration-300 ease-in-out
                     ${isExpanded ? "items-start" : "items-center"}`}
        >
          {sidebarLinks.map((link, index) => {
            const IconComponent = link.icon;
            const labelDelay = isExpanded ? 100 + index * 30 : 0;
            return (
              <Link
                key={link.href}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noreferrer" : undefined}
                className={`flex items-center relative w-11 h-11
                           rounded-full border border-[#2b3242] bg-[#10121a]
                           text-[#cfd3e1] hover:border-[#3f4a67] hover:text-white
                           transition-all duration-300 ease-in-out
                           ${
                             isExpanded
                               ? "gap-3 px-3 py-2 w-full"
                               : "justify-center p-0"
                           }`}
                aria-label={link.ariaLabel}
              >
                <IconComponent className="w-6 h-6 shrink-0" />
                <span
                  className={`text-xs font-medium whitespace-nowrap
                             transition-all duration-300 ease-in-out
                             ${
                               isExpanded
                                 ? "opacity-100 translate-x-0 max-w-full"
                                 : "opacity-0 -translate-x-1 w-0 overflow-hidden"
                             }`}
                  style={{
                    transitionDelay: `${labelDelay}ms`,
                  }}
                >
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Tips Section */}
        <div className="px-3 py-4 border-t border-[#2d313a]/50 relative min-h-15">
          {/* Collapsed: Icon only */}
          <div
            className={`absolute inset-0 flex items-center justify-center
                       transition-all duration-300 ease-in-out
                       ${
                         isExpanded
                           ? "opacity-0 scale-90 pointer-events-none"
                           : "opacity-100 scale-100"
                       }`}
          >
            <Lightbulb className="w-4 h-4 text-[#89a5ff] shrink-0" />
          </div>

          {/* Expanded: Icon + Text */}
          <div
            className={`flex items-start gap-3
                       transition-all duration-300 ease-in-out
                       ${
                         isExpanded
                           ? "opacity-100 translate-y-0"
                           : "opacity-0 translate-y-1 pointer-events-none"
                       }`}
            style={{
              transitionDelay: isExpanded ? "150ms" : "0ms",
            }}
          >
            <Lightbulb className="w-4 h-4 text-[#89a5ff] shrink-0 mt-0.5" />
            <p className="text-xs text-[#cfd3e1] leading-relaxed">
              {resumeTips[currentTipIndex]}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
