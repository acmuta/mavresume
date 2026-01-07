import { Fade } from "react-awesome-reveal";
import { ResumePreview } from "../../components/elements/ResumePreview";
import { ResumeDocPreview } from "../../components/elements/ResumeDocPreview";
import { ResumeDocDownloadButton } from "../../components/elements/ResumeDocDownloadButton";
import { BuilderHeaderBar } from "../../components/elements/BuilderHeaderBar";

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
  return (
    // <div className="relative w-full min-h-screen bg-gradient-to-b from-[#11131a] via-[#0d0e12] to-[#09090b] text-white md:flex items-start">
    <div className="relative w-full min-h-screen bg-gradient-to-b from-[#11131a] via-[#0d0e12] to-[#09090b] text-white md:flex items-start">
      {/* Main content (form sections) */}
      
      <div className="relative p-8 min-h-screen md:w-[50vw] md:ml-[6vw] mt-8 md:mt-0">
        {children}
      </div>
      
      {/* Live resume preview (fixed overlay) */}
      <aside className="hidden fixed right-[5vw] md:flex md:w-4/10 h-full justify-center items-center p-6 overflow-y-auto z-40">
        <Fade triggerOnce direction="up" duration={800}>
          <div className="px-6 pt-5 pb-6 mt-10 border-2 border-dashed border-[#2d313a] bg-[#15171c]/90 backdrop-blur-md rounded-3xl shadow-[0_25px_60px_rgba(3,4,7,0.55)] w-fit h-fit">
            {/* Header with landing-style typography */}
            <div className="flex h-12 pb-4 justify-between items-center border-b border-[#2d313a]/50">
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-bold text-white">
                  Live Resume Preview
                </h2>
                
              </div>
              <div className="flex gap-2 items-center">
                <ResumeDocPreview />
                <ResumeDocDownloadButton />
              </div>
            </div>
            <div className="pt-4">
              <ResumePreview />
            </div>
          </div>
        </Fade>
      </aside>
    </div>
  );
}
