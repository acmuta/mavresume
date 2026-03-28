import { InfoGuideData } from "./InfoGuideConfig";

/**
 * InfoGuide Component
 *
 * Renders a full comprehensive guide with sections, bullet points,
 * and subsections. Used in the help widget's "Full Guide" tab
 * and the section title modal (legacy).
 */

export const InfoGuide = ({ guide }: { guide: InfoGuideData }) => {
  if (!guide) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-white">
          {guide.title}
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#a4a7b5]">
          {guide.description}
        </p>
      </div>

      <div className="space-y-4">
        {guide.sections.map((section, index) => (
          <section
            key={index}
            className="rounded-[1.35rem] border border-[#2b3242] bg-[#0f1117]/55 p-4"
          >
            <h2 className="border-b border-[#2b3242] pb-2 text-base font-semibold text-[#cfd3e1]">
              {section.heading}
            </h2>

            {section.points && (
              <ul className="mt-4 space-y-2 pl-1">
                {section.points.map((p, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm leading-relaxed text-[#a4a7b5]"
                  >
                    <span className="mt-1 shrink-0 text-blue-400">•</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            )}

            {section.subsections && (
              <div className="mt-4 space-y-3">
                {section.subsections.map((sub, j) => (
                  <div
                    key={j}
                    className={`rounded-[1.1rem] border p-4 ${
                      sub.title.toLowerCase() === "do"
                        ? "border-green-500/20 bg-green-500/5"
                        : sub.title.toLowerCase() === "don't"
                          ? "border-red-500/20 bg-red-500/5"
                          : "border-[#2b3242] bg-[#1a1d24]/50"
                    }`}
                  >
                    <h3
                      className={`mb-2 text-sm font-medium ${
                        sub.title.toLowerCase() === "do"
                          ? "text-green-400"
                        : sub.title.toLowerCase() === "don't"
                            ? "text-red-400"
                            : "text-[#cfd3e1]"
                      }`}
                    >
                      {sub.title}
                    </h3>
                    <ul className="space-y-1.5">
                      {sub.points.map((p, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm leading-relaxed text-[#a4a7b5]"
                        >
                          <span
                            className={`mt-1 shrink-0 ${
                              sub.title.toLowerCase() === "do"
                                ? "text-green-400"
                              : sub.title.toLowerCase() === "don't"
                                  ? "text-red-400"
                                  : "text-blue-400"
                            }`}
                          >
                            •
                          </span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
};
