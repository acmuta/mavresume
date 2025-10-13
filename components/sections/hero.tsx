import Image from "next/image";
import { Fade } from "react-awesome-reveal";

interface SectionProps {
  onContinue: () => void;
}

export function HeroSection({ onContinue }: SectionProps) {
  return (
    <div className="flex flex-col md:flex-row items-center md:justify-center h-full w-full">
      <div className="md:flex flex-col md:w-4/10">
        {/* Title and Description */}
        <Fade direction="up" duration={1000}>
          <section className="h-fit mt-20 flex flex-col text-center md:text-start">
            <h1 className="text-4xl md:text-7xl font-bold mb-2">
              MAV<span className="font-extralight">RESUME</span>
            </h1>
            <p className="text-lg md:text-xl font-">
              Helping undergraduates quickly build tailored, professional
              resumes - simple, guided, and stress-free.
            </p>
          </section>
        </Fade>
        {/* Action Buttons */}
        <Fade direction="up" delay={400} duration={1000}>
          <section className="flex gap-5 mt-3 justify-center md:justify-start">
            <button
              onClick={onContinue}
              className="btn font-bold bg-[#274CBC] rounded-xl "
            >
              Get Started
            </button>
            <button className="hidden md:block btn font-bold bg-[#2A2C31] rounded-xl">
              Find Preexisting Resume
            </button>
          </section>
        </Fade>
      </div>

      {/* Placeholder image of resume mockup */}
      <Fade direction="up" delay={200} duration={1000}>
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
