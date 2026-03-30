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
  Menu,
  X,
} from "lucide-react";
import { IoMdHelpCircle } from "react-icons/io";
import { IoLogIn } from "react-icons/io5";

import { signOut } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";
import { useSessionStore } from "@/store/useSessionStore";
import { useSessionSync } from "@/lib/hooks/useSessionSync";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";

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
];

function getInitials(user: {
  user_metadata?: { full_name?: string };
  email?: string;
}): string {
  const name = user.user_metadata?.full_name?.trim();
  if (name) {
    const parts = name.split(/\s+/);
    if (parts.length >= 2)
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
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

/**
 * Mobile sidebar component with slide-in drawer from the left.
 * Triggered by a hamburger menu icon in the header.
 */
export const MobileSidebar = () => {
  const router = useRouter();
  const { user } = useSessionStore();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
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
    <Drawer direction="left" open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-[#6d7895] hover:text-white hover:bg-white/10"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-[#15171c] border-r border-[#2d313a] h-full">
        {/* Header with logo and close button */}
        <DrawerHeader className="px-4 py-4 border-b border-[#2d313a] flex flex-row items-center justify-between">
          <Link
            href={user ? "/dashboard" : "/"}
            className="font-bold tracking-tight text-2xl text-white"
            aria-label={user ? "Go to dashboard" : "MavResume home"}
            onClick={() => setIsOpen(false)}
          >
            MAV<span className="font-extralight">RESUME</span>
          </Link>
          <DrawerClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-[#6d7895] hover:text-white hover:bg-white/10"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        {/* Navigation Links */}
        <div className="flex-1 flex flex-col gap-2 px-4 py-4 overflow-y-auto">
          <p className="px-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6d7895] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]">
            Navigation
          </p>

          {visibleAppRoutes.map((link) => {
            const IconComponent = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noreferrer" : undefined}
                onClick={() => !link.external && setIsOpen(false)}
                className="group flex items-center gap-3 px-4 py-3
                           rounded-xl border border-[#2b3242] bg-[#10121a]
                           text-[#cfd3e1] hover:border-[#3f4a67] hover:text-white hover:-translate-y-0.5
                           transition-[transform,border-color,color,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
                aria-label={link.ariaLabel}
              >
                <IconComponent className="w-5 h-5 shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                <span className="text-sm font-medium transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5">
                  {link.label}
                </span>
              </Link>
            );
          })}

          <p className="mt-3 px-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6d7895] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]">
            Resources
          </p>

          {externalLinks.map((link) => {
            const IconComponent = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noreferrer" : undefined}
                onClick={() => !link.external && setIsOpen(false)}
                className="group flex items-center gap-3 px-4 py-3
                           rounded-xl border border-[#2b3242] bg-[#10121a]
                           text-[#cfd3e1] hover:border-[#3f4a67] hover:text-white hover:-translate-y-0.5
                           transition-[transform,border-color,color,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
                aria-label={link.ariaLabel}
              >
                <IconComponent className="w-5 h-5 shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                <span className="text-sm font-medium transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5">
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Profile Section */}
        <div className="px-4 py-4 border-t border-[#2d313a]/50">
          {user ? (
            <div className="rounded-2xl border border-dashed border-[#2d313a] bg-[#10121a] p-4 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="flex w-10 h-10 items-center justify-center rounded-full bg-[#1f2330] text-[#89a5ff] text-sm font-medium shrink-0">
                  {getInitials(user)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[#cfd3e1] truncate">
                    {user.user_metadata?.full_name ||
                      user.email?.split("@")[0] ||
                      "User"}
                  </p>
                  <p className="text-xs text-[#a4a7b5] truncate">
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
                  setIsOpen(false);
                  router.push("/");
                  router.refresh();
                }}
                disabled={isSigningOut || isRedirecting}
                className="w-full rounded-xl border border-dashed border-[#2f323a]
                           bg-transparent py-2.5 text-sm font-medium text-white
                           hover:border-[#4b4f5c] hover:bg-[#161920]
                           disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSigningOut
                  ? "Signing out…"
                  : isRedirecting
                    ? "Redirecting…"
                    : "Sign out"}
              </button>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#2d313a] bg-[#10121a] p-4 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <IoLogIn className="w-5 h-5 text-[#89a5ff] shrink-0" />
                <p className="text-sm text-[#a4a7b5]">
                  Sign in to save your progress.
                </p>
              </div>
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="w-full rounded-xl border border-dashed border-[#2f323a]
                           bg-transparent py-2.5 text-sm font-medium text-white text-center
                           hover:border-[#4b4f5c] hover:bg-[#161920] transition-colors"
              >
                Sign in
              </Link>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
