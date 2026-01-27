import { BuilderSidebar } from "@/components/elements/builder/BuilderSidebar";

/**
 * Dashboard layout with sidebar navigation.
 *
 * Provides a consistent layout for all dashboard pages:
 * - BuilderSidebar on the left (fixed, collapsible)
 * - Main content area with proper margin to account for sidebar
 * - Dark gradient background matching site theme
 */

export const metadata = {
  title: "Dashboard",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-[#101113] text-white">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#11131a] via-[#0d0e12] to-[#09090b]" />

      {/* Sidebar */}
      <BuilderSidebar />

      {/* Main content area - offset for sidebar */}
      <main className="relative z-10 md:ml-[6vw] min-h-screen">{children}</main>
    </div>
  );
}
