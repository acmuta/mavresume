import { Plus, X } from "lucide-react";

import { useResumeStore } from "../../store/useResumeStore";
import { CustomSectionTitle } from "../elements/form/CustomSectionTitle";

export function CourseworkSection() {
  const {
    coursework,
    addCourseworkCategory,
    updateCourseworkCategory,
    removeCourseworkCategory,
  } = useResumeStore();

  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex w-full flex-col gap-6 px-2 py-2 sm:px-3 sm:py-3">
        <CustomSectionTitle
          title="Coursework"
          description="Organize coursework into grouped categories with concise course lists."
        />

        <section className="grid gap-4">
          {coursework.map((entry, index) => (
            <div
              key={index}
              className="grid gap-3 rounded-[1.35rem] bg-[#10121a]/62 p-4 ring-1 ring-inset ring-[#2b3242]"
            >
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#89a5ff]">
                  Category {index + 1}
                </p>
                {coursework.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCourseworkCategory(index)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#2b3242] bg-[#151923] text-[#6d7895] hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <input
                className="h-11 rounded-2xl border border-[#2b3242] bg-[#10121a]/88 px-4 text-sm text-white placeholder:text-[#6d7895]"
                placeholder="Category name (e.g. Data Science)"
                value={entry.category}
                onChange={(e) =>
                  updateCourseworkCategory(index, { category: e.target.value })
                }
              />
              <textarea
                className="min-h-24 rounded-2xl border border-[#2b3242] bg-[#10121a]/88 px-4 py-3 text-sm text-white placeholder:text-[#6d7895]"
                placeholder="Comma-separated course list"
                value={entry.courses.join(", ")}
                onChange={(e) =>
                  updateCourseworkCategory(index, {
                    courses: e.target.value
                      .split(",")
                      .map((item) => item.trim())
                      .filter(Boolean),
                  })
                }
              />
            </div>
          ))}

          <button
            type="button"
            onClick={() => addCourseworkCategory({ category: "", courses: [] })}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#2b3242] bg-[#10121a]/80 px-5 text-sm font-medium text-[#cfd3e1] transition hover:border-[#4b5a82] hover:bg-[#161b25] hover:text-white"
          >
            <Plus className="h-4 w-4" />
            Add Coursework Category
          </button>
        </section>
      </div>
    </div>
  );
}
