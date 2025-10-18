import Image from "next/image";
import { CustomTextField } from "../elements/CustomTextField";
import { useResumeStore } from "../../store/useResumeStore";

interface SectionProps {
  onContinue: () => void;
}

export function PersonalInfoSection({ onContinue }: SectionProps) {
  const { personalInfo, updatePersonalInfo } = useResumeStore();

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
              <CustomTextField
                id="text"
                label="Full Name"
                value={personalInfo.name}
                onChange={(e) => updatePersonalInfo({ name: e.target.value })}
              />
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <CustomTextField
                id="text"
                label="Phone Number"
                value={personalInfo.phone}
                onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
              />
              <CustomTextField
                id="text"
                label="Email"
                value={personalInfo.email}
                onChange={(e) => updatePersonalInfo({ email: e.target.value })}
              />
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <CustomTextField
                id="text"
                label="LinkedIn URL"
                description="Optional, But Recommended"
                value={personalInfo.linkedin || ""}
                onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })}
              />
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
