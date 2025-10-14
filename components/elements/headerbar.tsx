import { ChevronRight } from "lucide-react";
import React from "react";
import { Fade } from "react-awesome-reveal";

export const HeaderBar = () => {
  return (
    <Fade
      direction="down"
      delay={200}
      duration={500}
      className="relative w-full overflow-hidden"
    >
      {/* Background blur layer */}
      <div className="absolute inset-0 backdrop-blur-md [mask-image:linear-gradient(to top,rgba(0,0,0,0.9)_0%,rgba(0,0,0,0.4)_40%,rgba(0,0,0,0)_100%)] pointer-events-none z-0" />

      {/* Header content */}
      <section className="relative flex items-center justify-between w-full p-6 z-10">
        <h1 className="text-xl w-1/4 text-center md:text-4xl font-bold mb-2">
          MAV<span className="font-extralight">RESUME</span>
        </h1>

        <nav className="hidden md:flex w-fit font-semibold justify-center items-center gap-2">
          <h2>Personal Info</h2>
          <ChevronRight />
          <h2 className="text-gray-500">Education</h2>
          <ChevronRight />
          <h2 className="text-gray-500">Experience</h2>
          <ChevronRight />
          <h2 className="text-gray-500">Skills</h2>
          <ChevronRight />
          <h2 className="text-gray-500">Projects</h2>
          <ChevronRight />
          <h2 className="text-gray-500">Finish</h2>
        </nav>

        <div className="w-1/4 ">Placeholder of Hints, Github, etc</div>
      </section>
    </Fade>
  );
};
