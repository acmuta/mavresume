import type { Metadata } from "next";
import "./globals.css";
import { Montserrat } from "next/font/google";

import { DeferredAnalytics } from "@/components/DeferredAnalytics";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-montserrat",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "MavResume",
    template: "%s | MavResume",
  },
  description: "AI-powered Resume Builder for UTA students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans bg-[#101113] text-white`}>
        {children}
        <DeferredAnalytics />
      </body>
    </html>
  );
}
