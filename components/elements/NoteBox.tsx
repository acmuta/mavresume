import { InfoIcon } from "lucide-react";
import React from "react";

interface NoteBoxProps {
  note: string;
}
export const NoteBox: React.FC<NoteBoxProps> = ({ note }) => {
  return (
    <aside className="bg-[#274CBC]/20 w-full flex items-center p-3 text-white font-semibold rounded-2xl border-[2px] border-[#274CBC] border-dashed">
      <div className="w-full flex items-center justify-center">
        <InfoIcon className="mr-2 w-20" />
        <p>{note}</p>
      </div>
    </aside>
  );
};
