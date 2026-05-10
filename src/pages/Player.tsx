import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Play, Pause, SkipBack, SkipForward, Rewind, FastForward, ArrowRight, Download, Heart } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import playerBg from "@/assets/player-bg.png";
import type { AvailableSurah } from "@/hooks/useQuranAPI";
import { addFavorite, isFavorite, removeFavorite } from "@/lib/favorites";

interface PlayerState {
  surahs: AvailableSurah[];
  index: number;
  reciterName: string;
}

const SPEEDS = [0.75, 1.0, 1.25, 1.5, 2.0];
const STORAGE_KEY = "quran-player-state";

const formatTime = (s: number) => {
  if (!isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

const Player = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const initial: PlayerState | null =
    (location.state as PlayerState) ||
    (() => {
      try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    })();

  const [state, setState] = useState<PlayerState | null>(initial);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speedIdx, setSpeedIdx] = useState(1);
  const [fav, setFav] = useState(false);

  useEffect(() => {
    if (state) {
      const cur = state.surahs[state.index];
      setFav(isFavorite(cur.id, cur.url));
    }
  }, [state]);

  const toggleFavorite = () => {
    if (!state) return;
    const cur = state.surahs[state.index];
    if (fav) {
      removeFavorite(cur.id, cur.url);
      setFav(false);
      toast.success("تم الحذف من المفضلة");
    } else {
      addFavorite({ surah: cur, reciterName: state.reciterName, addedAt: Date.now() });
      setFav(true);
      toast.success("تم الإضافة للمفضلة");
    }
  };

  const downloadCurrent = () => {
    if (!state) return;
    const cur = state.surahs[state.index];
    const a = document.createElement("a");
    a.href = cur.url;
    a.download = `${cur.name}.mp3`;
    a.target = "_blank";
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success("بدأ تحميل السورة");
  };

  useEffect(() => {
    if (!state) {
      navigate("/", { replace: true });
      return;
    }
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, navigate]);

  const currentSurah = state?.surahs[state.index];

  // Load source on surah change
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSurah) return;
    audio.src = currentSurah.url;
    audio.playbackRate = SPEEDS[speedIdx];
    audio.play().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSurah?.url]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => setDuration(audio.duration);
    const onEnded = () => handleNext();
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  };

  const seek = (delta: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min((audio.duration || 0), audio.currentTime + delta));
  };

  const handleNext = useCallback(() => {
    setState((prev) => {
      if (!prev) return prev;
      const next = Math.min(prev.surahs.length - 1, prev.index + 1);
      if (next === prev.index) return prev;
      return { ...prev, index: next };
    });
  }, []);

  const handlePrev = () => {
    setState((prev) => {
      if (!prev) return prev;
      const next = Math.max(0, prev.index - 1);
      if (next === prev.index) return prev;
      return { ...prev, index: next };
    });
  };

  const onSeekSlider = (val: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = val[0];
    setCurrentTime(val[0]);
  };

  const cycleSpeed = () => {
    const next = (speedIdx + 1) % SPEEDS.length;
    setSpeedIdx(next);
    if (audioRef.current) audioRef.current.playbackRate = SPEEDS[next];
  };

  if (!state || !currentSurah) return null;

  const isFirst = state.index === 0;
  const isLast = state.index === state.surahs.length - 1;

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${playerBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/20 to-background/70" />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen p-6 md:p-10">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="rounded-full"
            aria-label="رجوع"
          >
            <ArrowRight className="w-5 h-5" />
          </Button>
          <span className="text-xs text-muted-foreground">مشغّل القرآن الكريم</span>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={toggleFavorite} className="rounded-full" aria-label="المفضلة">
              <Heart className={`w-5 h-5 ${fav ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
            <Button variant="ghost" size="icon" onClick={downloadCurrent} className="rounded-full" aria-label="تحميل">
              <Download className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Center - Surah & Reciter */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-3">
            {currentSurah.name}
          </h1>
          <p className="text-base md:text-lg text-muted-foreground">{state.reciterName}</p>
        </div>

        {/* Controls */}
        <div className="w-full max-w-2xl mx-auto space-y-6 pb-4">
          {/* Progress */}
          <div className="space-y-2">
            <Slider
              value={[currentTime]}
              max={duration || 0}
              step={1}
              onValueChange={onSeekSlider}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground font-mono" style={{ direction: "ltr" }}>
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-center gap-3 md:gap-5">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrev}
              disabled={isFirst}
              className="rounded-full h-12 w-12"
              aria-label="السورة السابقة"
            >
              <SkipForward className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => seek(-10)}
              className="rounded-full h-12 w-12"
              aria-label="تأخير 10 ثواني"
            >
              <Rewind className="w-5 h-5" />
            </Button>
            <Button
              size="icon"
              onClick={togglePlay}
              className="rounded-full h-16 w-16 shadow-xl"
              aria-label={isPlaying ? "إيقاف" : "تشغيل"}
            >
              {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ms-1" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => seek(10)}
              className="rounded-full h-12 w-12"
              aria-label="تقديم 10 ثواني"
            >
              <FastForward className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              disabled={isLast}
              className="rounded-full h-12 w-12"
              aria-label="السورة التالية"
            >
              <SkipBack className="w-5 h-5" />
            </Button>
          </div>

          {/* Speed */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={cycleSpeed}
              className="rounded-full font-mono text-xs px-4"
            >
              {SPEEDS[speedIdx].toFixed(2)}x
            </Button>
          </div>
        </div>
      </div>

      <audio ref={audioRef} preload="metadata" />
    </div>
  );
};

export default Player;
