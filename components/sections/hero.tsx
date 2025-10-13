import Image from "next/image";
import { Fade } from "react-awesome-reveal";

interface SectionProps {
  onContinue: () => void;
}

export function HeroSection({ onContinue }: SectionProps) {
  return (
    <div className="flex flex-col items-center h-full w-full">
      {/* Title and Description */}
      <Fade direction="up" duration={1000}>
        <section className="h-fit mt-20 flex flex-col text-center">
          <h1 className="text-4xl font-bold mb-2">
            MAV<span className="font-extralight">RESUME</span>
          </h1>
          <p className="text-lg">
            Helping undergraduates quickly build tailored, professional resumes
            - simple, guided, and stress-free.
          </p>
        </section>
      </Fade>
      {/* Action Buttons */}
      <Fade direction="up" delay={400} duration={1000}>
        <section className="flex gap-5 mt-3 ">
          <button
            onClick={onContinue}
            className="btn font-bold bg-[#274CBC] rounded-xl"
          >
            Get Started
          </button>
          {/* <button className="btn font-bold bg-[#2A2C31] rounded-xl">
            Find Preexisting Resume
        </button> */}
        </section>
      </Fade>

      {/* Placeholder image of resume mockup */}
      <Fade direction="up" delay={200} duration={1000}>
        <section className="mt-8">
          <Image
            src="/MavResumePlaceholder.png"
            alt="MavResume Group 10"
            width={300}
            height={300}
            className="w-auto h-auto"
          />
        </section>
      </Fade>
    </div>
  );
}
