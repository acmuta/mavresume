"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaGithub, FaDiscord, FaGraduationCap } from "react-icons/fa";
import {
  BookOpenText,
  ClipboardCheck,
  FileText,
  LayoutGrid,
} from "lucide-react";
import { IoMdHelpCircle } from "react-icons/io";
import { IoLogIn } from "react-icons/io5";

import { signOut } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";
import { useSessionStore } from "@/store/useSessionStore";
import { useSessionSync } from "@/lib/hooks/useSessionSync";

interface SidebarLink {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  ariaLabel: string;
  external?: boolean;
}

const appRouteLinks: SidebarLink[] = [
  {
    href: "/templates",
    label: "Templates",
    icon: FileText,
    ariaLabel: "Choose resume template",
    external: false,
  },
  {
    href: "/features",
    label: "Features",
    icon: LayoutGrid,
    ariaLabel: "View product features",
    external: false,
  },
  {
    href: "/faqs",
    label: "FAQs",
    icon: BookOpenText,
    ariaLabel: "Open frequently asked questions",
    external: false,
  },
];

const externalLinks: SidebarLink[] = [
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
    icon: FaGraduationCap,
    ariaLabel: "ACM at UTA website",
    external: true,
  },
  {
    href: "https://discord.gg/WjrDwNn5es",
    label: "ACM Discord",
    icon: FaDiscord,
    ariaLabel: "Discord server",
    external: true,
  },
  {
    href: "https://github.com/acmuta/mavresume#readme",
    label: "Help",
    icon: IoMdHelpCircle,
    ariaLabel: "Documentation",
    external: true,
  },
] as const;

function getInitials(user: {
  user_metadata?: { full_name?: string };
  email?: string;
}): string {
  const name = user.user_metadata?.full_name?.trim();
  if (name) {
    const parts = name.split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return (parts[0].slice(0, 2) || "?").toUpperCase();
  }
  const local = user.email?.split("@")[0] ?? "";
  return (local.slice(0, 2) || "?").toUpperCase();
}

function canAccessReviewerDashboard(user: User | null): boolean {
  const role = user?.app_metadata?.["user_role"];
  return role === "reviewer" || role === "admin";
}

function getRoleFromAccessToken(
  accessToken: string | undefined,
): string | null {
  if (!accessToken) return null;

  try {
    const payload = JSON.parse(atob(accessToken.split(".")[1]));
    const role = payload?.user_role;
    return typeof role === "string" ? role : null;
  } catch {
    return null;
  }
}

export const BuilderSidebar = () => {
  const router = useRouter();
  const { user } = useSessionStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [hasReviewerAccess, setHasReviewerAccess] = useState(false);

  useSessionSync();

  useEffect(() => {
    const supabase = createClient();

    const syncRole = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const tokenRole = getRoleFromAccessToken(session?.access_token);
      setHasReviewerAccess(
        tokenRole === "reviewer" ||
          tokenRole === "admin" ||
          canAccessReviewerDashboard(user),
      );
    };

    syncRole();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const tokenRole = getRoleFromAccessToken(session?.access_token);
      setHasReviewerAccess(
        tokenRole === "reviewer" ||
          tokenRole === "admin" ||
          canAccessReviewerDashboard(session?.user ?? user),
      );
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const visibleAppRoutes = hasReviewerAccess
    ? [
        ...appRouteLinks,
        {
          href: "/reviewer/dashboard",
          label: "Reviewer Queue",
          icon: ClipboardCheck,
          ariaLabel: "Open reviewer dashboard",
          external: false,
        },
      ]
    : appRouteLinks;

  return (
    <aside
      className={`group fixed bottom-5 left-4 top-22 z-20 hidden overflow-hidden rounded-[2rem] border border-[#2b3242] bg-[#0f1117]/82 shadow-[0_25px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-[width,box-shadow,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:flex ${
        isExpanded ? "w-64" : "w-20"
      }`}
      role="navigation"
      aria-label="Builder navigation sidebar"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="absolute inset-0 opacity-70">
        <div className="absolute left-2 top-0 h-24 w-24 rounded-full bg-[#274cbc]/12 blur-[55px]" />
        <div className="absolute bottom-6 right-0 h-20 w-20 rounded-full bg-[#19c8ff]/8 blur-[45px]" />
      </div>

      <div className="relative flex h-full w-full flex-col">
        <div className="flex h-18 items-center border-b border-[#242a37] px-4">
          <Link
            href={user ? "/dashboard" : "/"}
            className="relative flex w-full items-center justify-center font-bold tracking-tight text-white"
            aria-label={user ? "Go to dashboard" : "MavResume home"}
          >
            <span
              className={`absolute left-1/2 -translate-x-1/2 text-2xl transition-all duration-300 [mask-image:linear-gradient(to_bottom,black_40%,transparent)] [mask-repeat:no-repeat] [mask-size:100%_100%] ${
                isExpanded ? "opacity-0" : "opacity-100"
              }`}
            >
              M
            </span>
            <span
              className={`whitespace-nowrap text-2xl [mask-image:linear-gradient(to_bottom,black_40%,transparent)] [mask-repeat:no-repeat] [mask-size:100%_100%] transition-all duration-300 ${
                isExpanded ? "opacity-100" : "opacity-0"
              }`}
            >
              MAV<span className="font-extralight">RESUME</span>
            </span>
          </Link>
        </div>

        <div
          className={`flex flex-1 flex-col gap-3 overflow-y-auto px-3 py-4 transition-all duration-300 ${
            isExpanded ? "items-stretch" : "items-center"
          }`}
        >
          <div
            className={`overflow-hidden transition-[max-height,opacity,transform,margin] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isExpanded
                ? "max-h-8 translate-y-0 opacity-100"
                : "max-h-0 -translate-y-1 opacity-0"
            }`}
          >
            <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6d7895] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5">
              Navigation
            </p>
          </div>

          <div
            className={`flex flex-col gap-3 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isExpanded ? "translate-y-1.5" : "translate-y-0"
            }`}
          >
            {visibleAppRoutes.map((link, index) => {
              const IconComponent = link.icon;
              const labelDelay = isExpanded ? 100 + index * 25 : 0;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noreferrer" : undefined}
                  className={`group relative flex h-12 items-center overflow-hidden rounded-2xl border border-[#2b3242] bg-[#10121a]/82 text-[#cfd3e1] transition-[transform,border-color,color,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-[#3f4a67] hover:text-white ${
                    isExpanded ? "w-full gap-3 px-3" : "w-12 justify-center"
                  }`}
                  aria-label={link.ariaLabel}
                >
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_left,_rgba(39,76,188,0.22),_transparent_50%)]" />
                  <IconComponent className="relative z-10 h-5 w-5 shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  <span
                    className={`relative z-10 whitespace-nowrap text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 ${
                      isExpanded
                        ? "max-w-full translate-x-0 opacity-100"
                        : "w-0 -translate-x-1 overflow-hidden opacity-0"
                    }`}
                    style={{ transitionDelay: `${labelDelay}ms` }}
                  >
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </div>

          <div
            className={`overflow-hidden transition-[max-height,opacity,transform,margin] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isExpanded
                ? "mt-2 max-h-8 translate-y-0 opacity-100"
                : "mt-0 max-h-0 -translate-y-1 opacity-0"
            }`}
          >
            <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6d7895] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5">
              Resources
            </p>
          </div>

          <div
            className={`flex flex-col gap-3 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isExpanded ? "translate-y-1.5" : "translate-y-0"
            }`}
          >
            {externalLinks.map((link, index) => {
              const IconComponent = link.icon;
              const labelDelay = isExpanded
                ? 100 + (visibleAppRoutes.length + index) * 25
                : 0;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noreferrer" : undefined}
                  className={`group relative flex h-12 items-center overflow-hidden rounded-2xl border border-[#2b3242] bg-[#10121a]/82 text-[#cfd3e1] transition-[transform,border-color,color,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-[#3f4a67] hover:text-white ${
                    isExpanded ? "w-full gap-3 px-3" : "w-12 justify-center"
                  }`}
                  aria-label={link.ariaLabel}
                >
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_left,_rgba(39,76,188,0.22),_transparent_50%)]" />
                  <IconComponent className="relative z-10 h-5 w-5 shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  <span
                    className={`relative z-10 whitespace-nowrap text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 ${
                      isExpanded
                        ? "max-w-full translate-x-0 opacity-100"
                        : "w-0 -translate-x-1 overflow-hidden opacity-0"
                    }`}
                    style={{ transitionDelay: `${labelDelay}ms` }}
                  >
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="border-t border-[#242a37] px-3 py-4">
          <div
            className={`rounded-[1.5rem] border border-[#2b3242] bg-[#10121a]/78 p-3 transition-all duration-300 ${
              isExpanded ? "opacity-100" : "opacity-0"
            }`}
          >
            {isExpanded && user ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1f2330] text-sm font-medium text-[#89a5ff]">
                    {getInitials(user)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[#cfd3e1]">
                      {user.user_metadata?.full_name ||
                        user.email?.split("@")[0] ||
                        "User"}
                    </p>
                    <p className="truncate text-xs text-[#6d7895]">
                      {user.email}
                    </p>
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
                  className="inline-flex h-10 items-center justify-center rounded-full border border-[#2b3242] bg-transparent px-4 text-sm font-medium text-white transition hover:border-[#4b5a82] hover:bg-[#161b25] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSigningOut
                    ? "Signing out…"
                    : isRedirecting
                      ? "Redirecting…"
                      : "Sign out"}
                </button>
              </div>
            ) : isExpanded ? (
              <div className="flex flex-col gap-3">
                <p className="text-sm leading-relaxed text-[#6d7895]">
                  Sign in to save progress and manage your resumes.
                </p>
                <Link
                  href="/login"
                  className="inline-flex h-10 items-center justify-center rounded-full border border-[#2b3242] bg-transparent px-4 text-sm font-medium text-white transition hover:border-[#4b5a82] hover:bg-[#161b25]"
                >
                  Sign in
                </Link>
              </div>
            ) : user ? (
              <div className="flex items-center justify-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1f2330] text-sm font-medium text-[#89a5ff]">
                  {getInitials(user)}
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <IoLogIn className="h-5 w-5 text-[#89a5ff]" />
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};
