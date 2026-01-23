import * as Icons from "lucide-react";
import React from "react";

interface NoteBoxProps {
  icon?: string;
  note: string;
}

export const NoteBox: React.FC<NoteBoxProps> = ({ icon = "Info", note }) => {
  const LucideIcon = (Icons[icon as keyof typeof Icons] ??
    Icons.Info) as React.ComponentType<React.SVGProps<SVGSVGElement>>;

  return (
    <aside className="bg-[#274cbc]/10 w-full flex items-center gap-3 p-4 text-white rounded-2xl border-2 border-dashed border-[#274cbc]/60 shadow-[0_8px_20px_rgba(39,76,188,0.15)] backdrop-blur-sm">
      <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-[#274cbc]/20 text-[#8fa5ff]">
        <LucideIcon className="w-5 h-5" />
      </div>
      <p className="text-sm sm:text-base font-medium text-[#cfd3e1]">{note}</p>
    </aside>
  );
};
