import { ResumePreview } from "../../components/elements/resume/ResumePreview";
import { BuilderHeaderBar } from "../../components/elements/builder/BuilderHeaderBar";
import { BuilderSidebar } from "../../components/elements/builder/BuilderSidebar";
import { TooltipProvider } from "../../components/ui/tooltip";
import { ResumePreviewControls } from "../../components/elements/resume/ResumePreviewControls";
import { BuilderClientWrapper } from "../../components/elements/builder/BuilderClientWrapper";

export const metadata = {
  title: "Builder",
};

export default function BuildLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#101113] text-white">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,_#12141b_0%,_#0d0e12_45%,_#09090b_100%)]" />
      <div className="absolute left-1/2 top-0 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-[#274cbc]/10 blur-[180px]" />
      <div className="absolute right-0 top-56 h-80 w-80 rounded-full bg-[#19c8ff]/8 blur-[160px]" />
      <div className="absolute left-0 top-[30rem] h-72 w-72 rounded-full bg-[#274cbc]/7 blur-[160px]" />

      <BuilderHeaderBar />
      <BuilderSidebar />

      <div className="relative z-10 px-3 pb-8 pt-22 md:pl-[7.25rem] md:pr-5 md:pt-24 xl:px-6 xl:pl-[7.5rem]">
        <div className="mx-auto grid max-w-[1720px] gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(460px,1.1fr)] xl:gap-6">
          <div className="min-w-0">{children}</div>

          <aside className="hidden lg:block">
            <div className="sticky top-24 flex min-h-[calc(100vh-7.25rem)] flex-col overflow-hidden rounded-[2rem] border border-[#2b3242] bg-[radial-gradient(circle_at_top,_rgba(39,76,188,0.16),_transparent_40%),linear-gradient(180deg,_rgba(21,23,28,0.94),_rgba(11,12,16,0.96))] shadow-[0_30px_80px_rgba(3,4,7,0.42)] backdrop-blur-xl">
              <div className="absolute inset-0 opacity-70">
                <div className="absolute left-8 top-0 h-28 w-28 rounded-full bg-[#274cbc]/18 blur-[70px]" />
                <div className="absolute bottom-0 right-6 h-24 w-24 rounded-full bg-[#19c8ff]/12 blur-[60px]" />
              </div>

              <div className="relative flex items-center justify-between gap-4 px-4 pb-2 pt-4 xl:px-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#89a5ff]">
                      Live preview
                    </p>
                    <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#6d7895]">
                      PDF-sized output updates beside the builder.
                    </p>
                  </div>
                </div>

                <TooltipProvider>
                  <div className="flex items-center gap-1 rounded-full border border-[#2b3242] bg-[#0f1117]/80 p-1.5 shadow-[0_12px_30px_rgba(0,0,0,0.25)] backdrop-blur-md">
                    <ResumePreviewControls />
                  </div>
                </TooltipProvider>
              </div>

              <div className="relative flex flex-1 px-2 pb-2 pt-1 xl:px-3 xl:pb-3">
                <div className="flex min-h-0 flex-1 items-start justify-center rounded-[1.75rem] border border-[#222733] bg-[linear-gradient(180deg,rgba(13,15,20,0.84),rgba(9,11,15,0.92))] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                  <ResumePreview />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <BuilderClientWrapper />
    </div>
  );
}
