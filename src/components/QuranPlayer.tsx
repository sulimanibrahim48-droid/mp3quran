import { useState, useMemo, useEffect } from "react";
import { useQuranAPI } from "@/hooks/useQuranAPI";
import { BookOpen, Mic, BookMarked, Music, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import playerBg from "@/assets/player-bg.png";
import { Input } from "@/components/ui/input";

const QuranPlayer = () => {
  const {
    reciters,
    moshafList,
    availableSurahs,
    selectedReciter,
    selectedMoshaf,
    selectedSurah,
    loading,
    audioRef,
    handleReciterChange,
    handleMoshafChange,
    handleSurahChange,
  } = useQuranAPI();

  const [reciterSearch, setReciterSearch] = useState("");
  const [reciterOpen, setReciterOpen] = useState(false);
  const [moshafOpen, setMoshafOpen] = useState(false);
  const [surahOpen, setSurahOpen] = useState(false);

  const filteredReciters = useMemo(() => {
    if (!reciterSearch.trim()) return reciters;
    return reciters.filter((r) =>
      r.name.toLowerCase().includes(reciterSearch.toLowerCase())
    );
  }, [reciters, reciterSearch]);

  const selectedReciterName = reciters.find((r) => r.id === selectedReciter)?.name || "";
  const selectedMoshafName = moshafList.find((m) => m.id === selectedMoshaf)?.name || "";

  return (
    <section className="flex-1 py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            مشغّل القرآن الكريم
          </h2>
          <p className="text-muted-foreground">
            اختر القارئ والرواية والسورة للاستماع
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto mb-8">
          {/* Reciter */}
          <Card className="border-border/60 shadow-md hover:shadow-lg transition-shadow bg-card">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Mic className="w-4 h-4 text-primary" />
                </div>
                <label className="text-sm font-semibold text-foreground">القارئ</label>
              </div>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => { setReciterOpen(!reciterOpen); setMoshafOpen(false); setSurahOpen(false); }}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50"
                  disabled={loading}
                >
                  <span className={selectedReciterName ? "text-foreground" : "text-muted-foreground"}>
                    {loading ? "جاري التحميل..." : selectedReciterName || "اختر القارئ"}
                  </span>
                  <svg className="h-4 w-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
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

          {/* Riwaya */}
          <Card className="border-border/60 shadow-md hover:shadow-lg transition-shadow bg-card">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookMarked className="w-4 h-4 text-primary" />
                </div>
                <label className="text-sm font-semibold text-foreground">الرواية</label>
              </div>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => { if (selectedReciter && moshafList.length > 0) { setMoshafOpen(!moshafOpen); setReciterOpen(false); setSurahOpen(false); } }}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50"
                  disabled={!selectedReciter || moshafList.length === 0}
                >
                  <span className={selectedMoshafName ? "text-foreground" : "text-muted-foreground"}>
                    {selectedMoshafName || "اختر الرواية"}
                  </span>
                  <svg className="h-4 w-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
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

          {/* Surah */}
          <Card className="border-border/60 shadow-md hover:shadow-lg transition-shadow bg-card">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-primary" />
                </div>
                <label className="text-sm font-semibold text-foreground">السورة</label>
              </div>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => { if (selectedMoshaf && availableSurahs.length > 0) { setSurahOpen(!surahOpen); setReciterOpen(false); setMoshafOpen(false); } }}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50"
                  disabled={!selectedMoshaf || availableSurahs.length === 0}
                >
                  <span className={selectedSurah ? "text-foreground" : "text-muted-foreground"}>
                    {selectedSurah?.name || "اختر السورة"}
                  </span>
                  <svg className="h-4 w-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                {surahOpen && (
                  <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-lg">
                    <div className="max-h-56 overflow-y-auto p-1">
                      {availableSurahs.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            handleSurahChange(s);
                            setSurahOpen(false);
                          }}
                          className={`w-full text-right px-3 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors ${
                            selectedSurah?.id === s.id ? "bg-accent text-accent-foreground font-semibold" : ""
                          }`}
                        >
                          {s.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Audio Player */}
        <Card className="max-w-4xl mx-auto border-border/60 shadow-lg bg-card">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                <Music className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">
                  {selectedSurah ? selectedSurah.name : "لم يتم اختيار سورة بعد"}
                </p>
                {selectedReciterName && (
                  <p className="text-xs text-muted-foreground">{selectedReciterName}</p>
                )}
              </div>
            </div>
            <audio ref={audioRef} controls className="w-full rounded-lg" style={{ direction: "ltr" }} />
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default QuranPlayer;
