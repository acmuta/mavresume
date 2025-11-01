import React from "react";

interface CustomSectionTitleProps {
  title: string;
  description: string;
}

export const CustomSectionTitle: React.FC<CustomSectionTitleProps> = ({
  title,
  description,
}) => {
  return (
    <section
      className="h-fit rounded-2xl border-[2px] border-[#313339] border-dashed 
                 shadow-lg p-4 flex flex-col text-start"
    >
      <h1 className="text-4xl md:text-[4rem] font-bold mb-2">{title}</h1>
      <p className="text-sm md:text-xl w-full 2xl:w-3/4">{description}</p>
    </section>
  );
};
