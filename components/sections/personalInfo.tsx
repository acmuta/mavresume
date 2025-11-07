import { CustomTextField } from "../elements/CustomTextField";
import { useResumeStore } from "../../store/useResumeStore";
import { CustomSectionTitle } from "../elements/CustomSectionTitle";

interface SectionProps {
  onContinue: () => void;
}

export function PersonalInfoSection({ onContinue }: SectionProps) {
  const { personalInfo, updatePersonalInfo } = useResumeStore();

  const clearInputs = () => {
    updatePersonalInfo({
      name: "",
      phone: "",
      email: "",
      linkedin: "",
      github: "",
    });
  };

  return (
    <div className="flex w-full h-full items-center justify-center">
      <div className="md:flex flex-col border-2 p-7 bg-[#151618] border-[#1c1d21] rounded-2xl w-full">
        {/* Title and Description */}
        <CustomSectionTitle
          title="Personal Information"
          description="Start with the basics - your name, contact details, and links so employers can reach you."
        />

        {/* Input Fields */}
        <section className="mt-4 flex flex-col gap-3 rounded-2xl border-[2px] border-[#313339] border-dashed shadow-lg p-4">
          <div className="flex flex-col md:flex-row gap-2 w-full">
            <CustomTextField
              id="text"
              label="Full Name"
              placeholder="John Doe"
              value={personalInfo.name}
              onChange={(e) => updatePersonalInfo({ name: e.target.value })}
            />
          </div>
          <div className="flex flex-col md:flex-row gap-5 w-full">
            <CustomTextField
              id="text"
              label="Phone Number"
              placeholder="123-456-7890"
              value={personalInfo.phone}
              onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
            />
            <CustomTextField
              id="text"
              label="Email"
              placeholder="name@gmail.com"
              value={personalInfo.email}
              onChange={(e) => updatePersonalInfo({ email: e.target.value })}
            />
          </div>
          <div className="flex flex-col md:flex-row gap-5 w-full">
            <CustomTextField
              id="text"
              label="LinkedIn URL"
              placeholder="https://www.linkedin.com/in/name/"
              description="Optional, But Recommended"
              value={personalInfo.linkedin}
              onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })}
            />
            <CustomTextField
              id="text"
              label="Github URL"
              placeholder="https://github.com/name"
              description="Optional, But Recommended"
              value={personalInfo.github}
              onChange={(e) => updatePersonalInfo({ github: e.target.value })}
            />
          </div>
        </section>

        <section className="mt-4 flex justify-center gap-2 rounded-2xl border-[2px] border-[#313339] border-dashed shadow-lg p-4">
          <button
            className="btn w-[49%] font-bold bg-[#2A2C31] rounded-xl border border-[#2c2e34]"
            onClick={clearInputs}
          >
            Clear Inputs
          </button>
          <button
            className="btn w-[49%] font-bold bg-[#274CBC] rounded-xl border border-[#2a4fbe]"
            onClick={onContinue}
          >
            Next<span className="hidden md:block">: Education</span>
          </button>
        </section>
      </div>
    </div>
  );
}
