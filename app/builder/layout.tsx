"use client";

import { useState } from "react";
import { Fade } from "react-awesome-reveal";
import { ResumePreview } from "../../components/elements/ResumePreview";
import { ResumeDocPreview } from "../../components/elements/ResumeDocPreview";
import { ResumeDocDownloadButton } from "../../components/elements/ResumeDocDownloadButton";
import { SectionReorderButton } from "../../components/elements/SectionReorderButton";
import { ResumeBorderToggleButton } from "../../components/elements/ResumeBorderToggleButton";
import { BuilderHeaderBar } from "../../components/elements/BuilderHeaderBar";
import { BuilderSidebar } from "../../components/elements/BuilderSidebar";
import { TooltipProvider } from "../../components/ui/tooltip";

/**
 * Builder layout creates a split-screen experience:
 * - Left side (50vw): Form sections (children) - scrollable
 * - Right side (fixed): Live preview panel with PDF preview/download buttons
 *
 * The preview panel is fixed position and remains visible while scrolling through forms.
 * All preview components read from Zustand store and update reactively.
 */
export default function BuildLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showBorder, setShowBorder] = useState(false);

  return (
    <div className="relative w-full h-full bg-linear-to-b from-[#11131a] via-[#0d0e12] to-[#09090b] text-white md:flex items-start">
      {/* Builder sidebar (fixed overlay on left) */}
      <BuilderHeaderBar />
      <BuilderSidebar />

      {/* Main content (form sections) */}

      <div className="relative p-8 min-h-screen md:w-5/10 md:ml-[6vw] mt-8 md:mt-0">
        {children}
      </div>

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
              <SectionReorderButton />
              <ResumeBorderToggleButton
                showBorder={showBorder}
                onToggle={() => setShowBorder(!showBorder)}
              />
              <ResumeDocPreview />
              <ResumeDocDownloadButton />
            </div>
          </TooltipProvider>
          
        </div>
        
        
        <div className="w-full h-[92vh] overflow-y-auto">
          <ResumePreview showBorder={showBorder} />
        </div>
        
        
      </section>
    </div>
  );
}

// <aside className="hidden fixed right-[5vw] md:flex md:w-4/10 h-full justify-center items-center p-6 overflow-y-auto z-40">
//         <Fade triggerOnce direction="up" duration={800}>
//           <div className="px-6 pt-5 pb-6  border-2 border-dashed border-[#2d313a] bg-[#15171c]/90 backdrop-blur-md rounded-3xl shadow-[0_25px_60px_rgba(3,4,7,0.55)] w-fit h-fit">
//             {/* Header with landing-style typography */}
//             <div className="flex h-12 pb-4 justify-between items-center border-b border-[#2d313a]/50">
//               <div className="flex flex-col gap-1">
//                 <h2 className="text-lg font-bold ">
//                   Live Resume Preview
//                 </h2>

//               </div>
//               <div className="flex gap-2 items-center">
//                 <ResumeDocPreview />
//                 <ResumeDocDownloadButton />
//               </div>
//             </div>
//             <div className="">
//               <ResumePreview />
//             </div>
//           </div>
//         </Fade>
//       </aside>
