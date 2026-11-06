import { describe, it, expect } from "vitest";
import { clampPage, surahForPage, JUZ_START_PAGES } from "@/lib/mushaf";

describe("mushaf", () => {
  it("clamps pages to 1..604", () => {
    expect(clampPage(0)).toBe(1);
    expect(clampPage(700)).toBe(604);
  });
  it("has 30 juz", () => expect(JUZ_START_PAGES).toHaveLength(30));
  it("finds surah for page", () => {
    const s = [{ id: 1, start_page: 1 }, { id: 2, start_page: 2 }, { id: 3, start_page: 50 }];
    expect(surahForPage(s, 49)?.id).toBe(2);
    expect(surahForPage(s, 50)?.id).toBe(3);
  });
});
