import Image from "next/image";
import { Fade } from "react-awesome-reveal";
import { FeatureDisplay } from "../elements/FeatureDisplay";
import Link from "next/link";
import { ResumeDoc } from "../elements/ResumeDoc";

export function HeroSection() {
  return (
    <div className="flex flex-col md:flex-row items-center md:justify-center h-full w-full">
      <div className="md:flex flex-col md:w-5/10">
        {/* Title and Description */}
        <Fade direction="up" duration={800}>
          <section className="h-fit mt-20 flex flex-col text-center md:text-start">
            <h1 className="text-4xl md:text-8xl font-bold mb-2  [mask-image:linear-gradient(to_bottom,black_40%,transparent)] [mask-size:100%_100%] [mask-repeat:no-repeat]">
              MAV<span className="font-extralight">RESUME</span>
            </h1>
            <p className="text-lg md:text-xl font-">
              Helping undergraduates quickly build tailored, professional
              resumes - simple, guided, and stress-free.
            </p>
          </section>
        </Fade>
        {/* Icons */}
        <Fade direction="up" duration={800}>
          {/* <FeatureDisplay /> */}
        </Fade>
        {/* Action Buttons */}
        <Fade direction="up" delay={600} duration={800}>
          <section className="flex gap-5 mt-3 justify-center md:justify-start">
            <Link
              href="/builder"
              className="btn font-bold bg-[#274CBC] rounded-xl "
            >
              Get Started
            </Link>
            <button className="hidden md:block btn font-bold bg-[#2A2C31] rounded-xl">
              Find Preexisting Resume
            </button>
          </section>
        </Fade>
      </div>

      {/* Placeholder image of resume mockup */}
      <Fade direction="up" duration={1000}>
        <section className="mt-8 relative w-[30rem] h-[30rem] md:w-[30rem] md:h-[40rem]">
          <Image
            src="/MavResumePlaceholder.png"
            alt="MavResume Group 10"
            fill
            className="object-contain"
          />
        </section>
      </Fade>
    </div>
  );
}
