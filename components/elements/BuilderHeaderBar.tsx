import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Fade } from "react-awesome-reveal";

export const BuilderHeaderBar = () => {
  return (
    <Fade
      direction="down"
      duration={500}
      className="relative w-full overflow-hidden"
    >

      {/* Header content */}
      <section className="relative flex items-center justify-between w-full p-6 z-10 bg-gradient-to-b from-[#101113] from-1% to-transparent">

        <Link
          href={"/"}
          className="text-xl w-1/2 md:w-1/4 text-center md:text-4xl font-bold mb-2 [mask-image:linear-gradient(to_bottom,black_40%,transparent)] [mask-size:100%_100%] [mask-repeat:no-repeat]"
        >
          MAV<span className="font-extralight">RESUME</span>
        </Link>

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
