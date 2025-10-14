import Image from "next/image";
import { Fade } from "react-awesome-reveal";
import { HeaderBar } from "../elements/headerbar";
import { CustomTextField } from "../elements/customtextfield";

interface SectionProps {
  onContinue: () => void;
}

export function PersonalInfoSection({ onContinue }: SectionProps) {
  return (
    <div className="flex flex-col items-center md:justify-center h-full w-full px-6">
      <div className="flex w-full h-full items-center justify-center gap-5">
        <div className="md:flex flex-col w-full md:w-4/10">
          {/* Title and Description */}

          <section className="h-fit flex flex-col text-start">
            <h1 className="text-4xl md:text-7xl font-bold mb-2">
              PERSONAL INFO
            </h1>
            <p className="text-sm md:text-xl  w-3/4">
              Start with the basics - your name, contact details, and links so
              employers can reach you.
            </p>
          </section>

          {/* Input Fields */}
          <section className="mt-6 flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <CustomTextField id="text" label="First Name" />
              <CustomTextField id="text" label="Last Name" />
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <CustomTextField id="text" label="Phone Number" />
              <CustomTextField id="text" label="Email" />
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <CustomTextField id="text" label="LinkedIn URL" />
              <CustomTextField id="text" label="Github URL" />
            </div>
          </section>
        </div>
        {/* Placeholder image of resume mockup */}

        <section className="hidden md:block mt-8 relative w-[30rem] h-[30rem] md:w-[30rem] md:h-[40rem]">
          <Image
            src="/MavResumePlaceholder.png"
            alt="MavResume Group 10"
            fill
            className="object-contain"
          />
        </section>
      </div>
    </div>
  );
}
