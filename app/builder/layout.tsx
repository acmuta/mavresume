import { Fade } from "react-awesome-reveal";
import { ResumePreview } from "../../components/elements/ResumePreview";

export default function BuildLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#101113] w-full h-screen  text-white md:flex  items-center">
      {/* Main content (form sections) */}
      <div className="relative p-8 h-screen md:w-[50vw] md:ml-[6vw] mt-8 md:mt-0">
        {children}
      </div>

      {/* Live resume preview (fixed overlay) */}
      <aside className="hidden fixed right-[5vw] md:flex md:w-4/10 h-full justify-center items-center p-6 overflow-y-auto z-40">
        <Fade triggerOnce direction="up" duration={800}>
          <div className="px-8 pt-5 pb-8 mt-10 border-2 bg-[#151618] border-[#1c1d21] rounded-2xl shadow-lg w-fit h-fit">
            <div className="flex h-10 pb-2 justify-between items-center">
              <h2 className="text-xl text-gray-500 font-bold">Live Resume Preview</h2>
              <span className="text-sm text-gray-500 self-center font-bold">Placeholder for controls</span>
            </div>
            <ResumePreview />
          </div>
        </Fade>
      </aside>
    </div>
  );
}
