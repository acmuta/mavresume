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
    <aside className="relative overflow-hidden rounded-[1.5rem] bg-[radial-gradient(circle_at_left,_rgba(39,76,188,0.22),_transparent_48%),linear-gradient(180deg,_rgba(18,22,31,0.94),_rgba(12,13,18,0.98))] p-4 shadow-[0_16px_40px_rgba(39,76,188,0.12)] ring-1 ring-inset ring-[#274cbc]/28">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#161b25] text-[#8fa5ff]">
          <LucideIcon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#89a5ff]">
            Helpful note
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[#cfd3e1]">{note}</p>
        </div>
      </div>
    </aside>
  );
};
