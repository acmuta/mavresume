import { Plus, X } from "lucide-react";

import { CustomTextField } from "../elements/form/CustomTextField";
import { useResumeStore } from "../../store/useResumeStore";
import { CustomSectionTitle } from "../elements/form/CustomSectionTitle";

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
    <div className="flex w-full items-center justify-center">
      <div className="flex w-full flex-col gap-6 px-2 py-2 sm:px-3 sm:py-3">
        <CustomSectionTitle
          title="Personal Information"
          description="Add the contact details and profile links employers need to reach you."
        />

        <section className="grid gap-5">
          <div className="grid gap-4 md:grid-cols-2">
            <CustomTextField
              id="name"
              label="Full Name"
              placeholder="John Doe"
              value={personalInfo.name}
              onChange={(e) => updatePersonalInfo({ name: e.target.value })}
              required
            />
            <CustomTextField
              id="email"
              label="Email"
              placeholder="name@gmail.com"
              value={personalInfo.email}
              onChange={(e) => updatePersonalInfo({ email: e.target.value })}
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <CustomTextField
              id="phone"
              label="Phone Number"
              placeholder="123-456-7890"
              value={personalInfo.phone || ""}
              onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
              required
            />
            <CustomTextField
              id="linkedin"
              label="LinkedIn"
              placeholder="linkedin.com/in/johndoe"
              value={personalInfo.linkedin || ""}
              onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })}
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <CustomTextField
              id="github"
              label="GitHub"
              placeholder="github.com/johndoe"
              value={personalInfo.github || ""}
              onChange={(e) => updatePersonalInfo({ github: e.target.value })}
              required
            />
          </div>
        </section>

        <section className="relative overflow-hidden rounded-[1.6rem] border border-[#24304c]/80 bg-[radial-gradient(circle_at_top_left,_rgba(39,76,188,0.12),_transparent_42%),linear-gradient(180deg,_rgba(16,18,25,0.84),_rgba(12,14,18,0.9))] p-4 shadow-[0_18px_45px_rgba(3,4,7,0.22)] sm:p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#89a5ff]">
                Optional links
              </p>
              <h3 className="mt-2 text-xl font-semibold text-white">
                Custom contact information
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#6d7895]">
                Add portfolio links or other profile URLs you want included.
              </p>
            </div>

            <button
              onClick={handleAddCustomContact}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-[#2b3242] bg-[#10121a]/80 px-4 text-sm font-medium text-[#cfd3e1] transition hover:border-[#4b5a82] hover:bg-[#161b25] hover:text-white"
              title="Add custom contact"
              type="button"
            >
              <Plus className="size-4" />
              Add Link
            </button>
          </div>

          <div className="mt-5 grid gap-3">
            {(personalInfo.customContacts || []).map((contact, index) => (
              <div
                key={index}
                className="grid gap-3 rounded-[1.35rem] bg-[#10121a]/72 p-3 ring-1 ring-inset ring-[#2b3242] sm:grid-cols-[minmax(0,1fr)_auto]"
              >
                <CustomTextField
                  id={`custom-contact-${index}`}
                  label={`Custom Link ${index + 1}`}
                  placeholder="e.g., portfolio.com/johndoe"
                  value={contact}
                  onChange={(e) =>
                    handleUpdateCustomContact(index, e.target.value)
                  }
                />
                <button
                  onClick={() => handleDeleteCustomContact(index)}
                  className="inline-flex h-12 items-center justify-center rounded-2xl border border-[#2b3242] bg-[#151923] px-3 text-[#6d7895] transition hover:border-[#4b5a82] hover:bg-[#161b25] hover:text-white"
                  title="Delete custom contact"
                  type="button"
                >
                  <X className="size-4" />
                </button>
              </div>
            ))}

            {(personalInfo.customContacts || []).length === 0 && (
              <div className="rounded-[1.35rem] bg-[#10121a]/45 px-4 py-6 text-sm text-[#6d7895] ring-1 ring-inset ring-[#2b3242]">
                No custom links yet.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
