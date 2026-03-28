import { Plus, X } from "lucide-react";

import { useResumeStore } from "../../store/useResumeStore";
import { CustomSectionTitle } from "../elements/form/CustomSectionTitle";

export function CertificationsSection() {
  const {
    certifications,
    addCertification,
    updateCertification,
    removeCertification,
  } = useResumeStore();

  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex w-full flex-col gap-6 px-2 py-2 sm:px-3 sm:py-3">
        <CustomSectionTitle
          title="Certifications"
          description="Add compact entries with title, issuer, date, and optional link."
        />

        <section className="grid gap-4">
          {certifications.map((entry, index) => (
            <div
              key={index}
              className="grid gap-3 rounded-[1.35rem] bg-[#10121a]/62 p-4 ring-1 ring-inset ring-[#2b3242]"
            >
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#89a5ff]">
                  Certification {index + 1}
                </p>
                {certifications.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCertification(index)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#2b3242] bg-[#151923] text-[#6d7895] hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <input
                className="h-11 rounded-2xl border border-[#2b3242] bg-[#10121a]/88 px-4 text-sm text-white placeholder:text-[#6d7895]"
                placeholder="Certification Title"
                value={entry.title}
                onChange={(e) =>
                  updateCertification(index, { title: e.target.value })
                }
              />
              <input
                className="h-11 rounded-2xl border border-[#2b3242] bg-[#10121a]/88 px-4 text-sm text-white placeholder:text-[#6d7895]"
                placeholder="Issuer"
                value={entry.issuer}
                onChange={(e) =>
                  updateCertification(index, { issuer: e.target.value })
                }
              />
              <input
                className="h-11 rounded-2xl border border-[#2b3242] bg-[#10121a]/88 px-4 text-sm text-white placeholder:text-[#6d7895]"
                placeholder="Date (e.g. Mar 2026)"
                value={entry.date}
                onChange={(e) =>
                  updateCertification(index, { date: e.target.value })
                }
              />
              <input
                className="h-11 rounded-2xl border border-[#2b3242] bg-[#10121a]/88 px-4 text-sm text-white placeholder:text-[#6d7895]"
                placeholder="Optional link"
                value={entry.link ?? ""}
                onChange={(e) =>
                  updateCertification(index, { link: e.target.value })
                }
              />
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              addCertification({ title: "", issuer: "", date: "", link: "" })
            }
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#2b3242] bg-[#10121a]/80 px-5 text-sm font-medium text-[#cfd3e1] transition hover:border-[#4b5a82] hover:bg-[#161b25] hover:text-white"
          >
            <Plus className="h-4 w-4" />
            Add Certification
          </button>
        </section>
      </div>
    </div>
  );
}
