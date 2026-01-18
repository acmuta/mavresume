import { CustomTextField } from "../elements/CustomTextField";
import { useResumeStore } from "../../store/useResumeStore";
import { CustomSectionTitle } from "../elements/CustomSectionTitle";
import { Plus, X } from "lucide-react";

export function PersonalInfoSection() {
  const { personalInfo, updatePersonalInfo } = useResumeStore();

  const handleAddCustomContact = () => {
    const currentCustom = personalInfo.customContacts || [];
    updatePersonalInfo({
      customContacts: [...currentCustom, ""],
    });
  };

  const handleDeleteCustomContact = (index: number) => {
    const currentCustom = personalInfo.customContacts || [];
    const newCustomContacts = currentCustom.filter((_, i) => i !== index);
    updatePersonalInfo({
      customContacts: newCustomContacts,
    });
  };

  const handleUpdateCustomContact = (index: number, value: string) => {
    const currentCustom = personalInfo.customContacts || [];
    const newCustomContacts = [...currentCustom];
    newCustomContacts[index] = value;
    updatePersonalInfo({
      customContacts: newCustomContacts,
    });
  };

  return (
    <div className="flex w-full h-full items-center justify-center">
      <div className="md:flex flex-col md:p-7 w-full">
        {/* Title and Description */}
        <CustomSectionTitle
          title="Personal Information"
          description="Start with the basics - your name, contact details, and links so employers can reach you."
        />

        {/* Input Fields */}
        <section className="mt-4 flex flex-col gap-3  p-4">
          <div className="flex flex-col md:flex-row gap-2 w-full">
            <CustomTextField
              id="name"
              label="Full Name"
              placeholder="John Doe"
              value={personalInfo.name}
              onChange={(e) => updatePersonalInfo({ name: e.target.value })}
              required
            />
          </div>
          <div className="flex flex-col md:flex-row gap-5 w-full">
            <CustomTextField
              id="email"
              label="Email"
              placeholder="name@gmail.com"
              value={personalInfo.email}
              onChange={(e) => updatePersonalInfo({ email: e.target.value })}
              required
            />
            <CustomTextField
              id="phone"
              label="Phone Number"
              placeholder="123-456-7890"
              description="Optional"
              value={personalInfo.phone || ""}
              onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
            />
          </div>
          <div className="flex flex-col md:flex-row gap-5 w-full">
            <CustomTextField
              id="linkedin"
              label="LinkedIn Name"
              placeholder="JohnDoe"
              description="Optional"
              value={personalInfo.linkedin || ""}
              onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })}
            />
            <CustomTextField
              id="github"
              label="Github Username"
              placeholder="JohnDoe"
              description="Optional"
              value={personalInfo.github || ""}
              onChange={(e) => updatePersonalInfo({ github: e.target.value })}
            />
          </div>
          
          {/* Custom Contacts Section */}
          <div className="flex flex-col gap-2 mt-2">
            <label className="font-semibold">Custom Contact Information</label>
            {(personalInfo.customContacts || []).map((contact, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="flex-1">
                  <CustomTextField
                    id={`custom-contact-${index}`}
                    placeholder="e.g., portfolio.com/johndoe"
                    value={contact}
                    onChange={(e) =>
                      handleUpdateCustomContact(index, e.target.value)
                    }
                  />
                </div>
                <button
                  onClick={() => handleDeleteCustomContact(index)}
                  className="inline-flex items-center justify-center rounded-xl border border-[#2b3242] bg-[#1a1d24]/80 px-2 py-1.5 text-[#6d7895] transition hover:border-[#3f4a67] hover:bg-[#1f2330] hover:text-white"
                  title="Delete custom contact"
                >
                  <X className="size-4" />
                </button>
              </div>
            ))}
            <button
              onClick={handleAddCustomContact}
              className="inline-flex items-center gap-2 rounded-xl border border-[#2b3242] bg-[#1a1d24]/80 px-3 py-1.5 text-sm text-[#6d7895] transition hover:border-[#3f4a67] hover:bg-[#1f2330] hover:text-white w-fit"
              title="Add custom contact"
            >
              <Plus className="size-4" />
              <span>Add Custom Contact</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
