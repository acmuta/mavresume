"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Github, LogIn, HelpCircle, GraduationCap, FileText } from "lucide-react";
import { DiscordIcon } from "@/components/icons/DiscordIcon";
import { signOut } from "@/lib/auth";
import { useSessionStore } from "@/store/useSessionStore";
import { useSessionSync } from "@/lib/hooks/useSessionSync";

interface SidebarLink {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  ariaLabel: string;
  external?: boolean;
}

const sidebarLinks: SidebarLink[] = [
  {
    href: "/templates",
    label: "Templates",
    icon: FileText,
    ariaLabel: "Choose resume template",
    external: false,
  },
  {
    href: "https://github.com/acmuta/mavresume",
    label: "GitHub",
    icon: Github,
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
    label: "ACM Discord",
    icon: DiscordIcon,
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

function getInitials(user: { user_metadata?: { full_name?: string }; email?: string }): string {
  const name = user.user_metadata?.full_name?.trim();
  if (name) {
    const parts = name.split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return (parts[0].slice(0, 2) || "?").toUpperCase();
  }
  const local = user.email?.split("@")[0] ?? "";
  return (local.slice(0, 2) || "?").toUpperCase();
}

export const BuilderSidebar = () => {
  const router = useRouter();
  const { user } = useSessionStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useSessionSync();

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
            href={user ? "/dashboard" : "/"}
            className="flex items-center font-bold tracking-tight text-3xl
                       mask-[linear-gradient(to_bottom,black_40%,transparent)] 
                       mask-size-[100%_100%] mask-no-repeat
                       text-white hover:text-white transition-colors duration-300
                       relative w-full justify-center"
            aria-label={user ? "Go to dashboard" : "MavResume home"}
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

        {/* Profile Section */}
        <div className="px-3 py-4 border-t border-[#2d313a]/50 relative min-h-15">
          {/* Collapsed: Initials or LogIn icon */}
          <div
            className={`absolute inset-0 flex items-center justify-center
                       transition-all duration-300 ease-in-out
                       ${
                         isExpanded
                           ? "opacity-0 scale-90 pointer-events-none"
                           : "opacity-100 scale-100"
                       }`}
          >
            {user ? (
              <span
                className="flex w-8 h-8 items-center justify-center rounded-full
                           bg-[#1f2330] text-[#89a5ff] text-xs font-medium shrink-0"
              >
                {getInitials(user)}
              </span>
            ) : (
              <LogIn className="w-4 h-4 text-[#89a5ff] shrink-0" />
            )}
          </div>

          {/* Expanded: Profile card or Sign in CTA */}
          <div
            className={`flex flex-col gap-3
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
            {user ? (
              <div
                className="rounded-2xl border border-dashed border-[#2d313a]
                           bg-[#10121a] p-3 flex flex-col gap-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="flex w-10 h-10 items-center justify-center rounded-full
                               bg-[#1f2330] text-[#89a5ff] text-sm font-medium shrink-0"
                  >
                    {getInitials(user)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[#cfd3e1] truncate">
                      {user.user_metadata?.full_name || user.email?.split("@")[0] || "User"}
                    </p>
                    <p className="text-xs text-[#a4a7b5] truncate">{user.email}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    setIsSigningOut(true);
                    await signOut();
                    setIsSigningOut(false);
                    setIsRedirecting(true);
                    router.push("/");
                    router.refresh();
                  }}
                  disabled={isSigningOut || isRedirecting}
                  className="w-full rounded-xl border border-dashed border-[#2f323a]
                             bg-transparent py-2 text-xs font-medium text-white
                             hover:border-[#4b4f5c] hover:bg-[#161920]
                             disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSigningOut
                    ? "Signing out…"
                    : isRedirecting
                      ? "Redirecting to home…"
                      : "Sign out"}
                </button>
              </div>
            ) : (
              <div
                className="rounded-2xl border border-dashed border-[#2d313a]
                           bg-[#10121a] p-3 flex flex-col gap-3"
              >
                <p className="text-xs text-[#a4a7b5]">Sign in to save your progress.</p>
                <Link
                  href="/login"
                  className="w-full rounded-xl border border-dashed border-[#2f323a]
                             bg-transparent py-2 text-xs font-medium text-white text-center
                             hover:border-[#4b4f5c] hover:bg-[#161920] transition-colors"
                >
                  Sign in
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};
