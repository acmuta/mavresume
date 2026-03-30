const CHICAGO_TIMEZONE = "America/Chicago";

function getChicagoDateParts(date: Date): { year: string; month: string; day: string } {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: CHICAGO_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value ?? "1970";
  const month = parts.find((part) => part.type === "month")?.value ?? "01";
  const day = parts.find((part) => part.type === "day")?.value ?? "01";

  return { year, month, day };
}

export function getChicagoDayKey(date: Date = new Date()): string {
  const { year, month, day } = getChicagoDateParts(date);
  return `${year}-${month}-${day}`;
}

function stableHash(input: string): number {
  let hash = 5381;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }
  return Math.abs(hash >>> 0);
}

export function getDeterministicTipIndex(
  userKey: string,
  dayKey: string,
  tipCount: number
): number {
  if (tipCount <= 0) return 0;
  const seed = `${userKey}|${dayKey}`;
  return stableHash(seed) % tipCount;
}

export function getDailyTipIndexForUser(
  userKey: string,
  tipCount: number,
  date: Date = new Date()
): number {
  const dayKey = getChicagoDayKey(date);
  return getDeterministicTipIndex(userKey, dayKey, tipCount);
}

export function getRandomDifferentIndex(tipCount: number, excludeIndex: number): number {
  if (tipCount <= 1) return 0;
  let nextIndex = excludeIndex;
  while (nextIndex === excludeIndex) {
    nextIndex = Math.floor(Math.random() * tipCount);
  }
  return nextIndex;
}
