import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronRight, ChevronLeft, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const TOTAL_PAGES = 604;
const API_URL = "https://api.alquran.cloud/v1/page";

interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  surah: {
    number: number;
    name: string;
    englishName: string;
  };
}

interface PageData {
  ayahs: Ayah[];
}

const QuranBrowser = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [nextPageData, setNextPageData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(false);
  const [flipping, setFlipping] = useState<"next" | "prev" | null>(null);
  const [goToInput, setGoToInput] = useState("");
  const cache = useRef<Map<number, PageData>>(new Map());

  const fetchPage = useCallback(async (page: number): Promise<PageData | null> => {
    if (cache.current.has(page)) return cache.current.get(page)!;
    try {
      const res = await fetch(`${API_URL}/${page}/quran-uthmani`);
      const json = await res.json();
      if (json.code === 200 && json.data) {
        const data: PageData = { ayahs: json.data.ayahs };
        cache.current.set(page, data);
        return data;
      }
    } catch (e) {
      console.error("Error fetching page:", e);
    }
    return null;
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchPage(currentPage).then((data) => {
      if (!cancelled) {
        setPageData(data);
        setLoading(false);
      }
    });
    // Prefetch adjacent pages
    if (currentPage < TOTAL_PAGES) fetchPage(currentPage + 1);
    if (currentPage > 1) fetchPage(currentPage - 1);
    // Also prefetch the facing page
    const facing = getFacingPage(currentPage);
    if (facing) fetchPage(facing).then((d) => { if (!cancelled) setNextPageData(d); });
    return () => { cancelled = true; };
  }, [currentPage, fetchPage]);

  const getFacingPage = (page: number): number | null => {
    // In a mushaf, odd pages are on the right, even on the left
    if (page % 2 === 1 && page < TOTAL_PAGES) return page + 1;
    if (page % 2 === 0 && page > 1) return page - 1;
    return null;
  };

  // For display: right page is odd, left page is even
  const rightPage = currentPage % 2 === 1 ? currentPage : currentPage - 1;
  const leftPage = rightPage + 1 <= TOTAL_PAGES ? rightPage + 1 : null;

  useEffect(() => {
    let cancelled = false;
    fetchPage(rightPage).then((d) => { if (!cancelled) setPageData(d); });
    if (leftPage) fetchPage(leftPage).then((d) => { if (!cancelled) setNextPageData(d); });
    else setNextPageData(null);
    return () => { cancelled = true; };
  }, [rightPage, leftPage, fetchPage]);

  const goNext = () => {
    if (rightPage + 2 <= TOTAL_PAGES) {
      setFlipping("next");
      setTimeout(() => {
        setCurrentPage(rightPage + 2);
        setFlipping(null);
      }, 500);
    }
  };

  const goPrev = () => {
    if (rightPage - 2 >= 1) {
      setFlipping("prev");
      setTimeout(() => {
        setCurrentPage(rightPage - 2);
        setFlipping(null);
      }, 500);
    }
  };

  const goToPage = () => {
    const num = parseInt(goToInput);
    if (num >= 1 && num <= TOTAL_PAGES) {
      const target = num % 2 === 1 ? num : num - 1;
      setCurrentPage(target);
      setGoToInput("");
    }
  };

  const renderPage = (data: PageData | null, pageNum: number, side: "right" | "left") => {
    // Group ayahs by surah
    const surahGroups: { surahName: string; ayahs: Ayah[] }[] = [];
    if (data) {
      data.ayahs.forEach((ayah) => {
        const last = surahGroups[surahGroups.length - 1];
        if (last && last.surahName === ayah.surah.name) {
          last.ayahs.push(ayah);
        } else {
          surahGroups.push({ surahName: ayah.surah.name, ayahs: [ayah] });
        }
      });
    }

    return (
      <div
        className={`relative w-full md:w-1/2 aspect-[3/4] bg-gradient-to-b from-[hsl(45,40%,96%)] to-[hsl(45,30%,92%)] dark:from-[hsl(150,15%,12%)] dark:to-[hsl(150,15%,10%)] ${
          side === "right" ? "rounded-r-lg md:rounded-r-2xl" : "rounded-l-lg md:rounded-l-2xl"
        } overflow-hidden mushaf-page`}
      >
        {/* Decorative border */}
        <div className="absolute inset-2 md:inset-3 border-2 border-[hsl(var(--gold)/0.3)] rounded-lg pointer-events-none" />
        <div className="absolute inset-3 md:inset-4 border border-[hsl(var(--gold)/0.15)] rounded-md pointer-events-none" />

        {/* Corner ornaments */}
        <div className="absolute top-2 right-2 md:top-3 md:right-3 w-5 h-5 md:w-8 md:h-8 border-t-2 border-r-2 border-[hsl(var(--gold)/0.4)] rounded-tr-lg" />
        <div className="absolute top-2 left-2 md:top-3 md:left-3 w-5 h-5 md:w-8 md:h-8 border-t-2 border-l-2 border-[hsl(var(--gold)/0.4)] rounded-tl-lg" />
        <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 w-5 h-5 md:w-8 md:h-8 border-b-2 border-r-2 border-[hsl(var(--gold)/0.4)] rounded-br-lg" />
        <div className="absolute bottom-2 left-2 md:bottom-3 md:left-3 w-5 h-5 md:w-8 md:h-8 border-b-2 border-l-2 border-[hsl(var(--gold)/0.4)] rounded-bl-lg" />

        {/* Content */}
        <div className="relative h-full flex flex-col p-4 md:p-6 lg:p-8">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-[hsl(var(--gold)/0.4)] border-t-[hsl(var(--gold))] rounded-full animate-spin" />
            </div>
          ) : data ? (
            <div className="flex-1 overflow-y-auto scrollbar-thin pr-1">
              {surahGroups.map((group, gi) => (
                <div key={gi}>
                  {/* Surah header if first ayah is 1 */}
                  {group.ayahs[0]?.numberInSurah === 1 && (
                    <div className="text-center my-2 md:my-3">
                      <div className="inline-block px-4 md:px-8 py-1 md:py-2 bg-gradient-to-r from-transparent via-[hsl(var(--gold)/0.12)] to-transparent rounded-full">
                        <span className="text-sm md:text-lg font-bold text-[hsl(var(--gold))] dark:text-[hsl(var(--gold))]">
                          {group.surahName}
                        </span>
                      </div>
                      {/* Bismillah - except for Surah 9 (At-Tawbah) and Surah 1 (Al-Fatiha has it in ayah) */}
                      {group.ayahs[0]?.surah.number !== 9 && group.ayahs[0]?.surah.number !== 1 && (
                        <p className="text-xs md:text-base text-foreground/70 mt-1 font-semibold">
                          بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
                        </p>
                      )}
                    </div>
                  )}
                  {/* Ayahs as flowing text */}
                  <p className="text-sm md:text-lg lg:text-xl leading-[2] md:leading-[2.2] text-foreground text-justify font-cairo" style={{ fontFamily: "'Cairo', 'Amiri', sans-serif" }}>
                    {group.ayahs.map((ayah) => (
                      <span key={ayah.number}>
                        {ayah.text}{" "}
                        <span className="inline-flex items-center justify-center w-5 h-5 md:w-7 md:h-7 text-[9px] md:text-xs rounded-full bg-[hsl(var(--gold)/0.12)] text-[hsl(var(--gold))] font-bold mx-0.5 align-middle">
                          {ayah.numberInSurah}
                        </span>{" "}
                      </span>
                    ))}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
              لا توجد بيانات
            </div>
          )}

          {/* Page number */}
          <div className="text-center mt-2 pt-2 border-t border-[hsl(var(--gold)/0.15)]">
            <span className="text-xs md:text-sm text-[hsl(var(--gold))] font-semibold">{pageNum}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="py-10 md:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <BookOpen className="w-6 h-6 md:w-7 md:h-7 text-[hsl(var(--gold))]" />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">تصفح المصحف الشريف</h2>
          </div>
          <p className="text-muted-foreground text-sm md:text-base">تصفح صفحات القرآن الكريم بتقليب الصفحات</p>
        </div>

        {/* Go to page */}
        <div className="flex items-center justify-center gap-3 mb-6 max-w-xs mx-auto">
          <Input
            type="number"
            min={1}
            max={TOTAL_PAGES}
            placeholder="رقم الصفحة"
            value={goToInput}
            onChange={(e) => setGoToInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && goToPage()}
            className="text-center h-10 text-sm"
          />
          <button
            onClick={goToPage}
            className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            انتقل
          </button>
        </div>

        {/* Book */}
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 md:gap-4">
            {/* Next (right arrow in RTL = next pages) */}
            <button
              onClick={goNext}
              disabled={rightPage + 2 > TOTAL_PAGES || !!flipping}
              className="flex-shrink-0 w-9 h-9 md:w-11 md:h-11 rounded-full bg-primary/10 hover:bg-primary/20 disabled:opacity-30 flex items-center justify-center transition-colors"
              aria-label="الصفحة التالية"
            >
              <ChevronRight className="w-5 h-5 text-primary" />
            </button>

            {/* Pages */}
            <div className={`flex-1 flex shadow-2xl rounded-lg md:rounded-2xl overflow-hidden book-container ${flipping === "next" ? "flip-next" : flipping === "prev" ? "flip-prev" : ""}`}>
              {/* Left page (even) */}
              {leftPage ? renderPage(nextPageData, leftPage, "left") : (
                <div className="w-full md:w-1/2 aspect-[3/4] bg-gradient-to-b from-[hsl(45,40%,96%)] to-[hsl(45,30%,92%)] dark:from-[hsl(150,15%,12%)] dark:to-[hsl(150,15%,10%)] rounded-l-lg md:rounded-l-2xl" />
              )}
              {/* Spine */}
              <div className="w-1 md:w-1.5 bg-gradient-to-b from-[hsl(var(--gold)/0.3)] via-[hsl(var(--gold)/0.5)] to-[hsl(var(--gold)/0.3)] flex-shrink-0" />
              {/* Right page (odd) */}
              {renderPage(pageData, rightPage, "right")}
            </div>

            {/* Prev */}
            <button
              onClick={goPrev}
              disabled={rightPage - 2 < 1 || !!flipping}
              className="flex-shrink-0 w-9 h-9 md:w-11 md:h-11 rounded-full bg-primary/10 hover:bg-primary/20 disabled:opacity-30 flex items-center justify-center transition-colors"
              aria-label="الصفحة السابقة"
            >
              <ChevronLeft className="w-5 h-5 text-primary" />
            </button>
          </div>

          {/* Page indicator */}
          <div className="text-center mt-4 text-sm text-muted-foreground">
            صفحة {rightPage}{leftPage ? ` - ${leftPage}` : ""} من {TOTAL_PAGES}
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuranBrowser;
