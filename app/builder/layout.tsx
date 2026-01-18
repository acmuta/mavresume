import { Fade } from "react-awesome-reveal";
import { ResumePreview } from "../../components/elements/ResumePreview";
import { BuilderHeaderBar } from "../../components/elements/BuilderHeaderBar";
import { BuilderSidebar } from "../../components/elements/BuilderSidebar";
import { TooltipProvider } from "../../components/ui/tooltip";
import { ResumePreviewControls } from "../../components/elements/ResumePreviewControls";

/**
 * Builder layout creates a split-screen experience:
 * - Left side (50vw): Form sections (children) - scrollable
 * - Right side (fixed): Live preview panel with PDF preview/download buttons
 *
 * The preview panel is fixed position and remains visible while scrolling through forms.
 * All preview components read from Zustand store and update reactively.
 */

export const metadata = {
  title: "Builder",
}

export default function BuildLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <div className="relative w-full h-full bg-linear-to-b from-[#11131a] via-[#0d0e12] to-[#09090b] text-white md:flex items-start">
      {/* Builder sidebar (fixed overlay on left side) */}
      <BuilderHeaderBar />
      <BuilderSidebar />

      {/* Main content (form sections) */}
      <div className="relative p-8 min-h-screen md:w-5/10 md:ml-[6vw] mt-8 md:mt-0">
        {children}
      </div>
      {/* Resume Preview */}
      <section className="hidden z-25 fixed right-0 md:flex md:flex-col md:w-[44vw] h-full bg-[#15171c]/90 backdrop-blur-sm border-l border-[#2d313a]">
        <div className="h-[8vh] w-full px-5 flex items-center justify-between border-b border-[#2d313a]">
          <div
            className="font-bold tracking-tight text-2xl 
                mask-[linear-gradient(to_bottom,black_40%,transparent)] 
                mask-size-[100%_100%] mask-no-repeat pointer-events-none"
          >
            RESUME<span className="font-extralight">PREVIEW</span>
          </div>
          {/* Resume Preview Controls */}
          <TooltipProvider>
            <div className="flex justify-center items-center border rounded-3xl px-1 py-1 gap-1 bg-[#1a1c22]/50 border-[#2d313a]">
              <ResumePreviewControls />
            </div>
          </TooltipProvider>
        </div>

        <Fade triggerOnce className="w-full h-[92vh] overflow-y-auto">
          <ResumePreview />
        </Fade>
      </section>
    </div>
  );
}
