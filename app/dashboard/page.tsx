"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowRight, FileText, LayoutDashboard } from "lucide-react";
import { Fade } from "react-awesome-reveal";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signOut } from "@/lib/auth";
import { useSessionStore } from "@/store/useSessionStore";
import { useSessionSync } from "@/lib/hooks/useSessionSync";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useSessionStore();
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Sync session store with Supabase on mount and listen to auth changes
  // Note: Middleware handles route protection, this is just for reactive UI updates
  useSessionSync();

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="relative min-h-screen bg-[#101113] text-white">
      <div className="absolute inset-0 bg-gradient-to-b from-[#11131a] via-[#0d0e12] to-[#09090b]" />

      <main className="relative z-10 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-8">
          <Fade direction="down" duration={600} triggerOnce>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold sm:text-5xl">
                  Welcome back
                  {user?.email && (
                    <span className="block text-2xl font-normal text-[#a4a7b5] mt-2">
                      {user.email}
                    </span>
                  )}
                </h1>
                <p className="mt-4 text-lg text-[#cfd3e1]">
                  Ready to build your resume? Let&apos;s get started.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="rounded-xl border-dashed border-[#2f323a] bg-transparent text-white hover:border-[#4b4f5c] hover:bg-[#161920]"
              >
                {isSigningOut ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Signing out...
                  </>
                ) : (
                  "Sign Out"
                )}
              </Button>
            </div>
          </Fade>

          <div className="grid gap-6 md:grid-cols-2">
            <Fade direction="up" duration={600} delay={200} triggerOnce>
              <Card className="border-2 border-dashed border-[#2d313a] bg-[#15171c]/80 hover:scale-[1.02] transition-transform duration-300 cursor-pointer">
                <Link href="/builder">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="flex size-12 items-center justify-center rounded-2xl bg-[#1f2330]/80 text-[#8fa5ff]">
                        <LayoutDashboard className="size-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">Resume Builder</CardTitle>
                        <CardDescription>
                          Continue building or start a new resume
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      className="w-full rounded-xl border-dashed border-[#2f323a] bg-transparent text-white hover:border-[#4b4f5c] hover:bg-[#161920]"
                    >
                      Open Builder
                      <ArrowRight className="ml-2 size-4" />
                    </Button>
                  </CardContent>
                </Link>
              </Card>
            </Fade>

            <Fade direction="up" duration={600} delay={400} triggerOnce>
              <Card className="border-2 border-dashed border-[#2d313a] bg-[#15171c]/80 hover:scale-[1.02] transition-transform duration-300 cursor-pointer">
                <Link href="/templates">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="flex size-12 items-center justify-center rounded-2xl bg-[#1f2330]/80 text-[#8fa5ff]">
                        <FileText className="size-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">Templates</CardTitle>
                        <CardDescription>
                          Browse resume templates and layouts
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      className="w-full rounded-xl border-dashed border-[#2f323a] bg-transparent text-white hover:border-[#4b4f5c] hover:bg-[#161920]"
                    >
                      View Templates
                      <ArrowRight className="ml-2 size-4" />
                    </Button>
                  </CardContent>
                </Link>
              </Card>
            </Fade>
          </div>
        </div>
      </main>
    </div>
  );
}
