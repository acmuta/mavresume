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
    <div className="space-y-4">
      {/* Title & Description */}
      <div>
        <h1 className="text-xl font-bold text-white">{guide.title}</h1>
        <p className="mt-1 text-sm text-[#a4a7b5]">{guide.description}</p>
      </div>

      {/* Sections */}
      <div className="space-y-5">
        {guide.sections.map((section, index) => (
          <div key={index} className="space-y-2">
            <h2 className="text-base font-semibold text-[#cfd3e1] border-b border-[#2d313a] pb-1">
              {section.heading}
            </h2>

            {/* If section has bullet points */}
            {section.points && (
              <ul className="space-y-1.5 pl-1">
                {section.points.map((p, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-[#a4a7b5]"
                  >
                    <span className="text-blue-400 shrink-0 mt-1">•</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* If section has subsections (e.g., Do/Don't) */}
            {section.subsections && (
              <div className="space-y-3 mt-2">
                {section.subsections.map((sub, j) => (
                  <div
                    key={j}
                    className={`rounded-lg p-3 ${
                      sub.title.toLowerCase() === "do"
                        ? "bg-green-500/5 border border-green-500/20"
                        : sub.title.toLowerCase() === "don't"
                          ? "bg-red-500/5 border border-red-500/20"
                          : "bg-[#1a1d24]/50 border border-[#2d313a]"
                    }`}
                  >
                    <h3
                      className={`font-medium text-sm mb-1.5 ${
                        sub.title.toLowerCase() === "do"
                          ? "text-green-400"
                          : sub.title.toLowerCase() === "don't"
                            ? "text-red-400"
                            : "text-[#cfd3e1]"
                      }`}
                    >
                      {sub.title}
                    </h3>
                    <ul className="space-y-1">
                      {sub.points.map((p, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-[#a4a7b5]"
                        >
                          <span
                            className={`shrink-0 ${
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
          </div>
        ))}
      </div>
    </div>
  );
};
