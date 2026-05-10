import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuranAPI } from "@/hooks/useQuranAPI";
import { BookOpen, Mic, BookMarked, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const QuranPlayer = () => {
  const navigate = useNavigate();
  const {
    reciters,
    moshafList,
    availableSurahs,
    selectedReciter,
    selectedMoshaf,
    selectedSurah,
    loading,
    handleReciterChange,
    handleMoshafChange,
  } = useQuranAPI();

  const [reciterSearch, setReciterSearch] = useState("");
  const [reciterOpen, setReciterOpen] = useState(false);
  const [moshafOpen, setMoshafOpen] = useState(false);
  const [surahOpen, setSurahOpen] = useState(false);
  const [surahSearch, setSurahSearch] = useState("");

  const filteredReciters = useMemo(() => {
    if (!reciterSearch.trim()) return reciters;
    return reciters.filter((r) =>
      r.name.toLowerCase().includes(reciterSearch.toLowerCase())
    );
  }, [reciters, reciterSearch]);

  const filteredSurahs = useMemo(() => {
    if (!surahSearch.trim()) return availableSurahs;
    return availableSurahs.filter((s) =>
      s.name.includes(surahSearch)
    );
  }, [availableSurahs, surahSearch]);

  const selectedReciterName = reciters.find((r) => r.id === selectedReciter)?.name || "";
  const selectedMoshafName = moshafList.find((m) => m.id === selectedMoshaf)?.name || "";

  const goToPlayer = (surahIndex: number) => {
    navigate("/player", {
      state: {
        surahs: availableSurahs,
        index: surahIndex,
        reciterName: selectedReciterName,
      },
    });
  };

  return (
    <section className="relative px-4 pb-24 -mt-6 z-30">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Horizontal Container */}
        <div className="grid grid-cols-3 gap-2 md:gap-4">
          
          {/* Reciter Card */}
          <Card className="rounded-[20px] border-none shadow-sm bg-white">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-gray-900">القارئ</h3>
                <div className="w-10 h-10 rounded-full bg-[hsl(var(--gold)/0.2)] flex items-center justify-center text-black shrink-0">
                  <Mic className="w-5 h-5" />
                </div>
              </div>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => { setReciterOpen(!reciterOpen); setMoshafOpen(false); setSurahOpen(false); }}
                  className="flex w-full items-center justify-between rounded-xl bg-gray-50 px-4 py-3 text-sm font-medium text-gray-800 disabled:opacity-50"
                  disabled={loading}
                >
                  <span className="truncate ml-2 text-right">
                    {loading ? "جاري التحميل..." : selectedReciterName || "اختر القارئ"}
                  </span>
                  <svg className="h-4 w-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                {reciterOpen && (
                  <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-lg">
                    <div className="p-2 border-b border-border">
                      <div className="relative">
                        <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="ابحث عن القارئ..."
                          value={reciterSearch}
                          onChange={(e) => setReciterSearch(e.target.value)}
                          className="pr-8 h-9 text-sm"
                          autoFocus
                        />
                      </div>
                    </div>
                    <div className="max-h-56 overflow-y-auto p-1">
                      {filteredReciters.length === 0 ? (
                        <p className="py-4 text-center text-sm text-muted-foreground">لا توجد نتائج</p>
                      ) : (
                        filteredReciters.map((r) => (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => {
                              handleReciterChange(r.id);
                              setReciterOpen(false);
                              setReciterSearch("");
                            }}
                            className={`w-full text-right px-3 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors ${
                              selectedReciter === r.id ? "bg-accent text-accent-foreground font-semibold" : ""
                            }`}
                          >
                            {r.name}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Riwaya Label & Filter */}
          <Card className="rounded-[20px] border-none shadow-sm bg-white">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-gray-900">الرواية</h3>
                <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-800 shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
              </div>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => { if (selectedReciter && moshafList.length > 0) { setMoshafOpen(!moshafOpen); setReciterOpen(false); setSurahOpen(false); } }}
                  className="flex w-full items-center justify-between rounded-xl bg-gray-50 px-4 py-3 text-sm font-medium text-gray-800 disabled:opacity-50"
                  disabled={!selectedReciter || moshafList.length === 0}
                >
                  <span className="truncate ml-2 text-right">
                    {selectedMoshafName || "اختر الرواية"}
                  </span>
                  <svg className="h-4 w-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                {moshafOpen && (
                  <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-lg">
                    <div className="max-h-56 overflow-y-auto p-1">
                      {moshafList.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => {
                            handleMoshafChange(m.id);
                            setMoshafOpen(false);
                          }}
                          className={`w-full text-right px-3 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors ${
                            selectedMoshaf === m.id ? "bg-accent text-accent-foreground font-semibold" : ""
                          }`}
                        >
                          {m.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Surah List */}
          <Card className="rounded-[20px] border-none shadow-sm bg-white">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-gray-900">السورة</h3>
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-800 shrink-0">
                  <BookMarked className="w-5 h-5" />
                </div>
              </div>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => { if (selectedMoshaf && availableSurahs.length > 0) { setSurahOpen(!surahOpen); setReciterOpen(false); setMoshafOpen(false); } }}
                  className="flex w-full items-center justify-between rounded-xl bg-gray-50 px-4 py-3 text-sm font-medium text-gray-800 disabled:opacity-50"
                  disabled={!selectedMoshaf || availableSurahs.length === 0}
                >
                  <span className="truncate ml-2 text-right">
                    {selectedSurah?.name || "اختر السورة"}
                  </span>
                  <svg className="h-4 w-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                {surahOpen && (
                  <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-lg">
                    <div className="p-2 border-b border-border">
                      <div className="relative">
                        <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="ابحث عن سورة..."
                          value={surahSearch}
                          onChange={(e) => setSurahSearch(e.target.value)}
                          className="pr-8 h-9 text-sm"
                          autoFocus
                        />
                      </div>
                    </div>
                    <div className="max-h-56 overflow-y-auto p-1">
                      {filteredSurahs.length === 0 ? (
                        <p className="py-4 text-center text-sm text-muted-foreground">لا توجد نتائج</p>
                      ) : (
                        filteredSurahs.map((s) => {
                          const originalIdx = availableSurahs.findIndex(as => as.id === s.id);
                          return (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => {
                                setSurahOpen(false);
                                setSurahSearch("");
                                goToPlayer(originalIdx);
                              }}
                              className={`w-full text-right px-3 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors ${
                                selectedSurah?.id === s.id ? "bg-accent text-accent-foreground font-semibold" : ""
                              }`}
                            >
                              {s.name}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="max-w-md mx-auto space-y-4 pt-4">
          <button
            type="button"
            className="w-full bg-[hsl(var(--emerald))] text-white rounded-[20px] py-4 flex flex-col items-center justify-center gap-2 shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50"
            disabled={!selectedSurah}
            onClick={() => {
              if (selectedSurah) {
                const idx = availableSurahs.findIndex(s => s.id === selectedSurah.id);
                if (idx >= 0) goToPlayer(idx);
              }
            }}
          >
            <div className="w-10 h-10 rounded-full bg-[hsl(var(--gold))] flex items-center justify-center text-black">
              <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <span className="font-bold">بدء الاستماع</span>
          </button>

        </div>
      </div>
    </section>
  );
};

export default QuranPlayer;
