"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  X,
  ChevronRight,
  Lightbulb,
  BookOpen,
  Check,
  AlertCircle,
} from "lucide-react";
import { useGuideStore } from "@/store/useGuideStore";
import {
  getSectionTip,
  getGuideByName,
  sectionIdToGuideName,
  InfoGuideData,
  SectionTip,
} from "@/components/guides/InfoGuideConfig";
import { InfoGuide } from "@/components/guides/InfoGuide";

/**
 * Floating Help Widget
 *
 * A collapsible help panel that provides contextual assistance:
 * - Shows tips for the current section being edited
 * - Quick access to full comprehensive guides
 * - Persists expanded/collapsed state
 */

export function HelpWidget() {
  const {
    isWidgetExpanded,
    toggleWidget,
    setWidgetExpanded,
    activeWidgetTab,
    setActiveWidgetTab,
    currentSection,
  } = useGuideStore();

  // Get contextual content based on current section
  const sectionTip = getSectionTip(currentSection);
  const guideName = sectionIdToGuideName[currentSection];
  const fullGuide = guideName ? getGuideByName(guideName) : undefined;

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={toggleWidget}
        className={`fixed bottom-6 right-6 z-50 flex items-center justify-center
                   w-14 h-14 rounded-full
                   bg-gradient-to-br from-[#2a3a5c] to-[#1a2744]
                   border-2 border-[#3d4f6f] shadow-lg
                   text-white hover:from-[#324666] hover:to-[#1f2f52]
                   transition-all duration-300 ease-out
                   hover:scale-105 hover:shadow-xl
                   ${isWidgetExpanded ? "opacity-0 pointer-events-none scale-90" : "opacity-100"}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle help widget"
        aria-expanded={isWidgetExpanded}
      >
        <HelpCircle className="w-7 h-7" />
      </motion.button>

      {/* Expanded Panel */}
      <AnimatePresence>
        {isWidgetExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-6 right-6 z-50 w-[340px] max-h-[70vh]
                       bg-[#15171c]/95 backdrop-blur-md
                       border-2 border-[#2d313a] rounded-2xl
                       shadow-[0_25px_60px_rgba(0,0,0,0.4)]
                       flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#2d313a]">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-400" />
                <h3 className="font-semibold text-white">Help & Tips</h3>
              </div>
              <button
                onClick={() => setWidgetExpanded(false)}
                className="p-1.5 rounded-lg text-[#6d7895] hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close help widget"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[#2d313a]">
              <button
                onClick={() => setActiveWidgetTab("tips")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors
                           ${
                             activeWidgetTab === "tips"
                               ? "text-white border-b-2 border-blue-500 bg-blue-500/5"
                               : "text-[#6d7895] hover:text-white"
                           }`}
              >
                <Lightbulb className="w-4 h-4" />
                Quick Tips
              </button>
              <button
                onClick={() => setActiveWidgetTab("guide")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors
                           ${
                             activeWidgetTab === "guide"
                               ? "text-white border-b-2 border-blue-500 bg-blue-500/5"
                               : "text-[#6d7895] hover:text-white"
                           }`}
              >
                <BookOpen className="w-4 h-4" />
                Full Guide
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {activeWidgetTab === "tips" ? (
                <TipsContent sectionTip={sectionTip} />
              ) : (
                <GuideContent guide={fullGuide} />
              )}
            </div>

            {/* Footer - Current Section Indicator */}
            <div className="px-4 py-2 border-t border-[#2d313a] bg-[#10121a]/50">
              <p className="text-xs text-[#6d7895]">
                Currently editing:{" "}
                <span className="text-[#cfd3e1] font-medium capitalize">
                  {currentSection.replace(/-/g, " ")}
                </span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Tips Content Component
function TipsContent({ sectionTip }: { sectionTip: SectionTip | undefined }) {
  if (!sectionTip) {
    return (
      <div className="p-4 text-center text-[#6d7895]">
        <p>No tips available for this section.</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Quick Tips */}
      <div>
        <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-yellow-400" />
          {sectionTip.title}
        </h4>
        <ul className="space-y-2">
          {sectionTip.tips.map((tip, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-sm text-[#cfd3e1]"
            >
              <ChevronRight className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Do's */}
      <div className="rounded-xl bg-green-500/5 border border-green-500/20 p-3">
        <h4 className="text-sm font-semibold text-green-400 mb-2 flex items-center gap-2">
          <Check className="w-4 h-4" />
          Do
        </h4>
        <ul className="space-y-1.5">
          {sectionTip.doList.map((item, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-sm text-[#cfd3e1]"
            >
              <span className="text-green-400 shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Don'ts */}
      <div className="rounded-xl bg-red-500/5 border border-red-500/20 p-3">
        <h4 className="text-sm font-semibold text-red-400 mb-2 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          Don&apos;t
        </h4>
        <ul className="space-y-1.5">
          {sectionTip.dontList.map((item, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-sm text-[#cfd3e1]"
            >
              <span className="text-red-400 shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Full Guide Content Component
function GuideContent({ guide }: { guide: InfoGuideData | undefined }) {
  if (!guide) {
    return (
      <div className="p-4 text-center text-[#6d7895]">
        <p>No guide available for this section.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <InfoGuide guide={guide} />
    </div>
  );
}
