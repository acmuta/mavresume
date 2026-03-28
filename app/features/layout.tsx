import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Features",
  description: "Explore MavResume's resume builder and review workflow.",
};

export default function FeaturesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
