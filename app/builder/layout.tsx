import { Fade } from "react-awesome-reveal";
import { ResumePreview } from "../../components/elements/ResumePreview";
import { ResumeDocPreview } from "../../components/elements/ResumeDocPreview";
import { ResumeDocDownloadButton } from "../../components/elements/ResumeDocDownloadButton";

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
    <div className="relative w-full min-h-screen bg-gradient-to-b from-[#11131a] via-[#0d0e12] to-[#09090b] text-white md:flex items-start">
      {/* Main content (form sections) */}
      <div className="relative p-8 min-h-screen md:w-[50vw] md:ml-[6vw] mt-8 md:mt-0">
        {children}
      </div>

      {/* Live resume preview (fixed overlay) */}
      <aside className="hidden fixed right-[5vw] md:flex md:w-4/10 h-full justify-center items-center p-6 overflow-y-auto z-40">
        <Fade triggerOnce direction="up" duration={800}>
          <div className="px-8 pt-5 pb-8 mt-10 border-2 bg-[#151618] border-[#1c1d21] rounded-2xl shadow-lg w-fit h-fit">
            <div className="flex h-10 pb-2 justify-between items-center">
              <h2 className="text-xl text-gray-500 font-bold">
                  Live Resume Preview
                </h2>
              <div className="flex gap-3 items-center">
                <ResumeDocPreview />
                <ResumeDocDownloadButton />
              </div>
            </div>
            <ResumePreview />
          </div>
        </Fade>
      </aside>
    </div>
  );
}
