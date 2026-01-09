import React from "react";

export const BuilderHeaderBar = () => {
  return (
    <div className="w-full fixed top-0 left-0 z-20 h-18 ml-25 border-b bg-[#15171c]/90 border-[#2d313a] backdrop-blur-md">
      <div className="flex h-full items-center gap-4 px-5">
        <div
          className="font-bold tracking-tight text-2xl 
                mask-[linear-gradient(to_bottom,black_40%,transparent)] 
                mask-size-[100%_100%] mask-no-repeat pointer-events-none"
        >
          RESUME<span className="font-extralight">BUILDER</span>
        </div>
      </div>
    </div>
  );
};
