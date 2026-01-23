"use client";

import Link from "next/link";
import { useContext } from "react";
import { Button } from "@/components/ui/button";
import { PreviewContext } from "@/components/contexts/PreviewContext";

export function HomeCTAButtons() {
  const { openPreview } = useContext(PreviewContext) ?? {};

  return (
    <div className="flex flex-wrap gap-4">
      <Button
        asChild
        className="h-12 rounded-2xl bg-[#274cbc] px-6 text-base font-semibold text-white hover:bg-[#315be1] hover:scale-[1.01] transition duration-300"
      >
        <Link href="/login">Start Building Your Resume</Link>
      </Button>
      <Button
        variant="outline"
        onClick={() => openPreview?.()}
        className="h-12 rounded-2xl border-dashed border-[#2f323a] bg-transparent px-6 text-base text-white hover:text-white shadow-none hover:border-[#4b4f5c] hover:bg-[#161920] hover:scale-[1.01] transition duration-300"
      >
        Preview the flow
      </Button>
    </div>
  );
}
