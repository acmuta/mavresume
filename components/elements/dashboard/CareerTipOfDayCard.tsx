"use client";

import { useEffect, useMemo, useState } from "react";
import { Sparkles, RefreshCcw, Lightbulb } from "lucide-react";

import { Button } from "@/components/ui/button";
import { careerTips } from "@/data/career-tips";
import {
  getChicagoDayKey,
  getDeterministicTipIndex,
  getRandomDifferentIndex,
} from "@/lib/careerTipRotation";

interface CareerTipOfDayCardProps {
  userKey?: string;
}

export function CareerTipOfDayCard({
  userKey = "guest",
}: CareerTipOfDayCardProps) {
  const [dayKey, setDayKey] = useState(() => getChicagoDayKey());
  const [isExpanded, setIsExpanded] = useState(false);

  const dailyTipIndex = useMemo(
    () => getDeterministicTipIndex(userKey, dayKey, careerTips.length),
    [userKey, dayKey],
  );

  const [tipIndex, setTipIndex] = useState(dailyTipIndex);

  useEffect(() => {
    setTipIndex(dailyTipIndex);
    setIsExpanded(false);
  }, [dailyTipIndex]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      const latestDayKey = getChicagoDayKey();
      setDayKey((previousDayKey) =>
        previousDayKey === latestDayKey ? previousDayKey : latestDayKey,
      );
    }, 60_000);

    return () => window.clearInterval(intervalId);
  }, []);

  const tip = careerTips[tipIndex] ?? careerTips[0];

  const handleViewNewTip = () => {
    setTipIndex((previousIndex) =>
      getRandomDifferentIndex(careerTips.length, previousIndex),
    );
    setIsExpanded(false);
  };

  return (
    <div className="rounded-2xl border border-[#2f3a5e] bg-[radial-gradient(circle_at_top_right,rgba(39,76,188,0.2),transparent_58%),linear-gradient(155deg,rgba(17,22,34,0.9),rgba(10,12,20,0.95))] px-4 py-4 shadow-[0_18px_40px_rgba(1,3,10,0.35)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#89a5ff]">
            <Sparkles className="h-3.5 w-3.5" />
            Career Tip of the Day
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleViewNewTip}
          className="h-8 rounded-full border-[#324067] bg-[#131a2a] px-3 text-xs text-[#d6def7] hover:border-[#4e6298] hover:bg-[#17233b] hover:text-white"
        >
          <RefreshCcw className="mr-1.5 h-3.5 w-3.5" />
          View New Tip
        </Button>
      </div>

      <div className="mt-2 rounded-xl border border-[#2b3242] bg-[#0f131d]/85 px-3 py-3">
        <div className="flex flex-col items-start gap-2.5">
          <div className="inline-flex items-center gap-1.5 justify-center">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-[#f6d66f]" />
            <div className="inline-flex items-center rounded-full text-[11px] font-medium uppercase tracking-[0.12em] text-[#9bb2f7]">
              {tip.category}
            </div>
          </div>
          <p className="text-sm leading-relaxed text-[#e3e8fb]">{tip.tip}</p>
        </div>

        <div className="mt-3 rounded-xl flex w-full flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setIsExpanded((previous) => !previous)}
            className="h-8 self-start rounded-full transition-all duration-200 border border-[#2b3242] bg-[#121724]/60 px-3 text-xs text-[#c7d0ef] hover:border-[#3a4768] hover:bg-[#182238] hover:text-white sm:self-auto"
            aria-expanded={isExpanded}
          >
            {isExpanded ? "Hide Details" : "Show Why This Matters"}
          </Button>
        </div>

        {isExpanded && (
          <div className="mt-3 rounded-lg border border-[#263250] bg-[#131c2e]/70 px-3 py-2.5">
            <p className="text-sm leading-relaxed text-[#cfd7f3]">
              {tip.explanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
