"use client";
import React from "react";

interface PlaceholderPreviewProps {
  height?: string;
  description?: string;
}

export const PlaceholderPreview: React.FC<PlaceholderPreviewProps> = ({
  height,
  description,
}) => {
  return (
    <div
      className={`${height} flex justify-center items-center w-full text-[#313339] font-bold text-lg rounded-2xl border-[3px] border-[#313339] border-dashed`}
    >
      {description || "No Data to Display!"}
    </div>
  );
};
