import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, BookOpen, Headphones, Bookmark, Play, Pause, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { JUZ_START_PAGES, TOTAL_PAGES, clampPage, mushafPageUrl, surahForPage } from "@/lib/mushaf";

const API = "https://mp3quran.net/api/v3";
const BOOKMARK_KEY = "mushaf-bookmark";

interface Sura { id: number; name: string; start_page: number; end_page: number }
interface Moshaf { id: number; name: string; server: string; surah_list: string }
interface Reciter { id: number; name: string; moshaf: Moshaf[] }

const selectCls = "h-11 w-full rounded-xl border border-border bg-card text-foreground px-3 text-sm";

const Mushaf = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const initial = Number(params.get("page")) || Number(localStorage.getItem(BOOKMARK_KEY)) || 1;
  const [page, setPage] = useState(clampPage(initial));
  const [suwar, setSuwar] = useState<Sura[]>([]);
  const [reciters, setReciters] = useState<Reciter[]>([]);
  const [listen, setListen] = useState(false);
  const [reciterKey, setReciterKey] = useState("");
  const [playing, setPlaying] = useState(false);
  const [bookmark, setBookmark] = useState<number>(Number(localStorage.getItem(BOOKMARK_KEY)) || 0);
  const [loaded, setLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const touchX = useRef(0);
  const viewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`${API}/suwar?language=ar`).then((r) => r.json()).then((d) => setSuwar(d.suwar || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (listen && reciters.length === 0) {
      fetch(`${API}/reciters?language=ar`).then((r) => r.json()).then((d) => setReciters(d.reciters || [])).catch(() => {});
    }
  }, [listen, reciters.length]);

  useEffect(() => { setLoaded(false); }, [page]);

  const currentSura = useMemo(() => surahForPage(suwar, page), [suwar, page]);
  const currentJuz = useMemo(() => {
    let j = 1;
    JUZ_START_PAGES.forEach((p, i) => { if (page >= p) j = i + 1; });
    return j;
  }, [page]);

  const options = useMemo(() => {
    if (!currentSura) return [];
    return reciters.flatMap((r) =>
      r.moshaf
        .filter((m) => m.surah_list.split(",").map(Number).includes(currentSura.id))
        .map((m) => ({ key: `${r.id}-${m.id}`, label: r.moshaf.length > 1 ? `${r.name} - ${m.name}` : r.name, server: m.server }))
    );
  }, [reciters, currentSura]);

  const audioUrl = useMemo(() => {
    const opt = options.find((o) => o.key === reciterKey);
    return opt && currentSura ? `${opt.server}${String(currentSura.id).padStart(3, "0")}.mp3` : "";
  }, [options, reciterKey, currentSura]);

  // keep audio source in sync with the surah of the current page
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (!audioUrl) { a.pause(); a.removeAttribute("src"); setPlaying(false); return; }
    if (a.src !== audioUrl) {
      const wasPlaying = playing;
      a.src = audioUrl;
      if (wasPlaying) a.play().catch(() => setPlaying(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioUrl]);

  useEffect(() => {
    if (!listen) { audioRef.current?.pause(); setPlaying(false); }
  }, [listen]);

  const go = (p: number) => setPage(clampPage(p));
  // RTL book: "next" moves forward in page numbers
  const next = () => go(page + 1);
  const prev = () => go(page - 1);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === "INPUT" || (e.target as HTMLElement).tagName === "SELECT") return;
      if (e.key === "ArrowLeft") next();
      if (e.key === "ArrowRight") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const togglePlay = () => {
    const a = audioRef.current;
    if (!a || !audioUrl) return;
    if (a.paused) a.play().then(() => setPlaying(true)).catch(() => {});
    else { a.pause(); setPlaying(false); }
  };

  const saveBookmark = () => {
    localStorage.setItem(BOOKMARK_KEY, String(page));
    setBookmark(page);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-[hsl(var(--emerald))] text-white px-6 py-5 rounded-b-[40px] flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="text-white hover:bg-white/10 rounded-full" aria-label="رجوع">
          <ArrowRight className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold">المصحف الشريف</h1>
        <Button variant="ghost" size="icon" onClick={() => viewRef.current?.requestFullscreen?.()} className="text-white hover:bg-white/10 rounded-full" aria-label="ملء الشاشة">
          <Maximize className="w-5 h-5" />
        </Button>
      </header>

      <main className="flex-1 px-4 py-5 max-w-3xl w-full mx-auto space-y-4">
        {/* Mode */}
        <div className="grid grid-cols-2 gap-2 bg-muted p-1 rounded-2xl">
          <button onClick={() => setListen(false)} className={`flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-bold transition ${!listen ? "bg-card text-foreground shadow" : "text-muted-foreground"}`}>
            <BookOpen className="w-4 h-4" /> قراءة فقط
          </button>
          <button onClick={() => setListen(true)} className={`flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-bold transition ${listen ? "bg-card text-foreground shadow" : "text-muted-foreground"}`}>
            <Headphones className="w-4 h-4" /> قراءة مع الاستماع
          </button>
        </div>

        {/* Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <select aria-label="السورة" className={selectCls} value={currentSura?.id ?? ""} onChange={(e) => { const s = suwar.find((x) => x.id === Number(e.target.value)); if (s) go(s.start_page); }}>
            {suwar.map((s) => <option key={s.id} value={s.id}>{s.id}. سورة {s.name}</option>)}
          </select>
          <select aria-label="الجزء" className={selectCls} value={currentJuz} onChange={(e) => go(JUZ_START_PAGES[Number(e.target.value) - 1])}>
            {JUZ_START_PAGES.map((_, i) => <option key={i} value={i + 1}>الجزء {i + 1}</option>)}
          </select>
          <input aria-label="رقم الصفحة" type="number" min={1} max={TOTAL_PAGES} className={selectCls} value={page} onChange={(e) => go(Number(e.target.value) || 1)} />
        </div>

        {listen && (
          <div className="bg-card border border-border rounded-2xl p-3 flex items-center gap-3">
            <Button size="icon" onClick={togglePlay} disabled={!audioUrl} className="rounded-full shrink-0 bg-[hsl(var(--emerald))] hover:bg-[hsl(var(--emerald))]/90 text-white" aria-label={playing ? "إيقاف" : "تشغيل"}>
              {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>
            <select aria-label="القارئ" className={selectCls} value={reciterKey} onChange={(e) => setReciterKey(e.target.value)}>
              <option value="">{options.length ? "اختر القارئ" : "جاري تحميل القراء..."}</option>
              {options.map((o) => <option key={o.key} value={o.key}>{o.label}</option>)}
            </select>
            <audio ref={audioRef} onEnded={() => setPlaying(false)} onPause={() => setPlaying(false)} onPlay={() => setPlaying(true)} />
          </div>
        )}

        {/* Page */}
        <div
          ref={viewRef}
          className="relative bg-card border border-border rounded-2xl overflow-hidden flex items-center justify-center min-h-[60vh]"
          onTouchStart={(e) => (touchX.current = e.changedTouches[0].screenX)}
          onTouchEnd={(e) => {
            const dx = e.changedTouches[0].screenX - touchX.current;
            if (Math.abs(dx) > 50) (dx > 0 ? next() : prev());
          }}
        >
          {!loaded && <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">جاري تحميل الصفحة...</div>}
          <img
            key={page}
            src={mushafPageUrl(page)}
            alt={`صفحة ${page} من المصحف الشريف`}
            onLoad={() => setLoaded(true)}
            className={`w-full h-auto max-h-[85vh] object-contain transition-opacity ${loaded ? "opacity-100" : "opacity-0"}`}
          />
          {/* preload neighbours */}
          {page < TOTAL_PAGES && <link rel="prefetch" href={mushafPageUrl(page + 1)} />}
        </div>

        <div className="flex items-center justify-between gap-2">
          <Button variant="outline" onClick={prev} disabled={page <= 1} className="rounded-xl h-11 gap-1">
            <ChevronRight className="w-5 h-5" /> السابقة
          </Button>
          <div className="text-center text-sm">
            <div className="font-bold text-foreground">صفحة {page}</div>
            <div className="text-muted-foreground text-xs">{currentSura ? `سورة ${currentSura.name}` : ""} · الجزء {currentJuz}</div>
          </div>
          <Button variant="outline" onClick={next} disabled={page >= TOTAL_PAGES} className="rounded-xl h-11 gap-1">
            التالية <ChevronLeft className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex gap-2 justify-center">
          <Button variant="outline" onClick={saveBookmark} className="rounded-xl gap-2">
            <Bookmark className={`w-4 h-4 ${bookmark === page ? "fill-current text-[hsl(var(--emerald))]" : ""}`} />
            {bookmark === page ? "تم حفظ موضع القراءة" : "حفظ موضع القراءة"}
          </Button>
          {bookmark > 0 && bookmark !== page && (
            <Button variant="ghost" onClick={() => go(bookmark)} className="rounded-xl">العودة لصفحة {bookmark}</Button>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Mushaf;
