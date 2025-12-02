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
    <aside className="bg-[#274CBC]/20 w-full flex items-center p-3 text-white font-semibold rounded-2xl border-[2px] border-[#274CBC] border-dashed">
      <div className="w-full flex items-center">
        <LucideIcon className="mr-2 w-20" />
        <p>{note}</p>
      </div>
    </aside>
  );
};
