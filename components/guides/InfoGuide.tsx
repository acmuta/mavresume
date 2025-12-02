import { InfoGuides, InfoGuideData } from "./InfoGuideConfig";

export const InfoGuide = ({ guide }: { guide: InfoGuideData }) => {
  if (!guide) return null;

  return (
    <div>
      <h1 className="text-3xl font-bold">{guide.title}</h1>
      <p className="mt-1 text-gray-300">{guide.description}</p>

      <div className="mt-6 space-y-6">
        {guide.sections.map((section, index) => (
          <div key={index}>
            <h2 className="text-xl font-semibold">{section.heading}</h2>

            {/* If section has bullet points */}
            {section.points && (
              <ul className="list-disc ml-6 mt-2 space-y-1">
                {section.points.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            )}

            {/* If section has subsections */}
            {section.subsections && (
              <div className="mt-3 space-y-4">
                {section.subsections.map((sub, j) => (
                  <div key={j}>
                    <h3 className="font-medium text-lg">{sub.title}</h3>
                    <ul className="list-disc ml-6 mt-1 space-y-1">
                      {sub.points.map((p, i) => (
                        <li key={i}>{p}</li>
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
