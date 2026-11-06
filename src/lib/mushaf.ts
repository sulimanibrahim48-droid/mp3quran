export const TOTAL_PAGES = 604;

// First page of each juz in the Madinah mushaf (604 pages)
export const JUZ_START_PAGES = [
  1, 22, 42, 62, 82, 102, 121, 142, 162, 182, 201, 222, 242, 262, 282,
  302, 322, 342, 362, 382, 402, 422, 442, 462, 482, 502, 522, 542, 562, 582,
];

export const clampPage = (p: number) => Math.min(TOTAL_PAGES, Math.max(1, Math.round(p) || 1));

export const mushafPageUrl = (p: number) => `https://www.mp3quran.net/mushaf2/${p + 1}.jpg`; // image 1 is the cover, so page N is image N+1

/** Surah shown at the top of a page: the last surah that starts on or before it. */
export function surahForPage<T extends { start_page: number }>(suwar: T[], page: number): T | undefined {
  let found: T | undefined;
  for (const s of suwar) if (s.start_page <= page) found = s;
  return found;
}
