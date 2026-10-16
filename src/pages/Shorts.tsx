import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Download, Play, Square, Loader2 } from "lucide-react";
import bgSrc from "@/assets/makkah-bg.jpg";

const W = 1080;
const H = 1920;
const RECITER = { name: "منصور السالمي", server: "https://cdn.mp3quran.net/audio/mansour-salimi/r1/" };

type Ayah = { text: string; n: number };

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number) {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const t = line ? line + " " + w : w;
    if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t;
  }
  if (line) lines.push(line);
  return lines;
}

const Shorts = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const rafRef = useRef(0);
  const [surah, setSurah] = useState(112);
  const [surahName, setSurahName] = useState("");
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState("");

  const audioUrl = `${RECITER.server}${String(surah).padStart(3, "0")}.mp3`;

  useEffect(() => {
    const img = new Image();
    img.src = bgSrc;
    img.onload = () => { imgRef.current = img; draw(0); };
  }, []);

  useEffect(() => {
    setLoading(true); setError("");
    fetch(`https://api.alquran.cloud/v1/surah/${surah}/quran-uthmani`)
      .then((r) => r.json())
      .then((d) => {
        setSurahName(d.data.name);
        const list: Ayah[] = d.data.ayahs.map((a: { text: string; numberInSurah: number }) => ({
          text: surah !== 1 && a.numberInSurah === 1 ? a.text.replace(/^بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ\s*/, "") : a.text,
          n: a.numberInSurah,
        }));
        setAyahs(list);
      })
      .catch(() => setError("تعذر جلب نص السورة"))
      .finally(() => setLoading(false));
  }, [surah]);

  useEffect(() => { draw(0); }, [ayahs, surahName]);

  // Approximate timing: split duration by text length (no official timings available)
  const currentAyah = (t: number, dur: number) => {
    if (!ayahs.length || !dur) return ayahs[0];
    const total = ayahs.reduce((s, a) => s + a.text.length, 0);
    let acc = 0;
    for (const a of ayahs) { acc += (a.text.length / total) * dur; if (t < acc) return a; }
    return ayahs[ayahs.length - 1];
  };

  function draw(t: number) {
    const c = canvasRef.current; const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W, H);
    const img = imgRef.current;
    if (img) {
      const s = Math.max(W / img.width, H / img.height) * (1 + t * 0.002);
      const iw = img.width * s, ih = img.height * s;
      ctx.drawImage(img, (W - iw) / 2, (H - ih) / 2, iw, ih);
    }
    ctx.fillStyle = "rgba(0,0,0,0.55)"; ctx.fillRect(0, 0, W, H);
    ctx.direction = "rtl"; ctx.textAlign = "center"; ctx.fillStyle = "#fff";
    ctx.font = "600 52px Cairo, Tajawal, sans-serif";
    ctx.fillText(surahName, W / 2, 260);
    const dur = audioRef.current?.duration || 0;
    const a = currentAyah(t, dur);
    if (a) {
      ctx.font = "700 76px 'Amiri Quran', Amiri, 'Scheherazade New', serif";
      const lines = wrap(ctx, a.text, W - 160);
      const lh = 140; const y0 = H / 2 - ((lines.length - 1) * lh) / 2;
      lines.forEach((l, i) => ctx.fillText(l, W / 2, y0 + i * lh));
      ctx.font = "500 44px Cairo, sans-serif"; ctx.fillStyle = "rgba(255,255,255,0.8)";
      ctx.fillText(`﴿${a.n.toLocaleString("ar-EG")}﴾`, W / 2, y0 + lines.length * lh + 30);
    }
    ctx.fillStyle = "rgba(255,255,255,0.9)"; ctx.font = "600 46px Cairo, sans-serif";
    ctx.fillText(`القارئ ${RECITER.name}`, W / 2, H - 260);
    if (dur) { ctx.fillStyle = "rgba(255,255,255,0.25)"; ctx.fillRect(140, H - 180, W - 280, 8);
      ctx.fillStyle = "#fff"; ctx.fillRect(W - 140 - (W - 280) * (t / dur), H - 180, (W - 280) * (t / dur), 8); }
  }

  const loop = () => { draw(audioRef.current?.currentTime || 0); rafRef.current = requestAnimationFrame(loop); };
  const stop = () => { cancelAnimationFrame(rafRef.current); audioRef.current?.pause(); setPlaying(false); };

  const preview = async () => {
    if (playing) return stop();
    const au = audioRef.current!; au.currentTime = 0;
    try { await au.play(); setPlaying(true); loop(); } catch { setError("تعذر تشغيل الصوت"); }
  };

  const ctxRef = useRef<{ ac: AudioContext; dest: MediaStreamAudioDestinationNode } | null>(null);
  const exportVideo = async () => {
    setError("");
    const au = audioRef.current!; const c = canvasRef.current!;
    if (!ctxRef.current) {
      const ac = new AudioContext(); const src = ac.createMediaElementSource(au);
      const dest = ac.createMediaStreamDestination(); src.connect(dest); src.connect(ac.destination);
      ctxRef.current = { ac, dest };
    }
    await ctxRef.current.ac.resume();
    const stream = new MediaStream([...c.captureStream(30).getVideoTracks(), ...ctxRef.current.dest.stream.getAudioTracks()]);
    const mime = ["video/mp4;codecs=avc1,mp4a.40.2", "video/webm;codecs=vp9,opus", "video/webm"].find((m) => MediaRecorder.isTypeSupported(m)) || "";
    const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 6_000_000 });
    const chunks: Blob[] = [];
    rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
    rec.onstop = () => {
      const blob = new Blob(chunks, { type: mime || "video/webm" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
      a.download = `short-${surah}.${mime.startsWith("video/mp4") ? "mp4" : "webm"}`; a.click();
      setRecording(false);
    };
    au.currentTime = 0; au.onended = () => { stop(); rec.state !== "inactive" && rec.stop(); };
    rec.start(); setRecording(true);
    try { await au.play(); setPlaying(true); loop(); } catch { rec.stop(); setError("تعذر تشغيل الصوت"); }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground font-[Cairo] pb-24">
      <header className="flex items-center gap-3 p-4">
        <Link to="/" aria-label="رجوع" className="p-2 rounded-full bg-card"><ArrowRight className="w-5 h-5" /></Link>
        <h1 className="text-xl font-bold">صانع فيديو شورت</h1>
      </header>
      <div className="max-w-md mx-auto px-4 space-y-4">
        <div className="bg-card rounded-2xl p-4 space-y-3 border border-border">
          <p className="text-sm">القارئ: <b>{RECITER.name}</b></p>
          <label className="block text-sm">
            رقم السورة (يفضّل السور القصيرة)
            <input type="number" min={1} max={114} value={surah} disabled={playing}
              onChange={(e) => { const v = Math.min(114, Math.max(1, +e.target.value || 1)); setSurah(v); }}
              className="mt-1 w-full rounded-xl bg-muted p-3 text-base" />
          </label>
        </div>
        <canvas ref={canvasRef} width={W} height={H} className="w-full max-w-[320px] mx-auto block rounded-2xl shadow-lg aspect-[9/16]" />
        <audio ref={audioRef} src={audioUrl} crossOrigin="anonymous" preload="auto" onEnded={stop} />
        {error && <p className="text-destructive text-center text-sm">{error}</p>}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={preview} disabled={loading || recording} aria-label="معاينة"
            className="flex items-center justify-center gap-2 rounded-xl bg-card border border-border p-3 font-semibold disabled:opacity-50">
            {playing && !recording ? <Square className="w-5 h-5" /> : <Play className="w-5 h-5" />} معاينة
          </button>
          <button onClick={exportVideo} disabled={loading || playing} aria-label="تصدير الفيديو"
            className="flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground p-3 font-semibold disabled:opacity-50">
            {recording ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
            {recording ? "جارٍ التسجيل…" : "تصدير الفيديو"}
          </button>
        </div>
        <p className="text-xs text-muted-foreground text-center">التصدير يستغرق مدة التلاوة نفسها، اترك الصفحة مفتوحة حتى يبدأ التحميل.</p>
      </div>
    </div>
  );
};

export default Shorts;
