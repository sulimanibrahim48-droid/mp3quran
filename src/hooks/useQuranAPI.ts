import { useState, useEffect, useCallback, useRef } from "react";

const API_BASE = "https://mp3quran.net/api/v3";

interface Moshaf {
  id: number;
  name: string;
  server: string;
  surah_total: number;
  moshaf_type: number;
  surah_list: string;
}

interface Reciter {
  id: number;
  name: string;
  letter: string;
  moshaf: Moshaf[];
}

interface Surah {
  id: number;
  name: string;
}

export interface AvailableSurah {
  id: number;
  name: string;
  url: string;
}

export function useQuranAPI() {
  const [reciters, setReciters] = useState<Reciter[]>([]);
  const [surahNames, setSurahNames] = useState<Surah[]>([]);
  const [selectedReciter, setSelectedReciter] = useState<number | null>(null);
  const [moshafList, setMoshafList] = useState<Moshaf[]>([]);
  const [selectedMoshaf, setSelectedMoshaf] = useState<number | null>(null);
  const [availableSurahs, setAvailableSurahs] = useState<AvailableSurah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<AvailableSurah | null>(null);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchInitialData() {
      try {
        const [recitersRes, surahRes] = await Promise.all([
          fetch(`${API_BASE}/reciters?language=ar`),
          fetch(`${API_BASE}/suwar?language=ar`),
        ]);
        const recitersData = await recitersRes.json();
        const surahData = await surahRes.json();
        if (!cancelled) {
          setReciters(recitersData.reciters || []);
          setSurahNames(surahData.suwar || []);
        }
      } catch (e) {
        console.error("Error fetching data:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchInitialData();
    return () => { cancelled = true; };
  }, []);

  const handleReciterChange = useCallback(
    (reciterId: number) => {
      setSelectedReciter(reciterId);
      setSelectedMoshaf(null);
      setAvailableSurahs([]);
      setSelectedSurah(null);
      const reciter = reciters.find((r) => r.id === reciterId);
      setMoshafList(reciter?.moshaf || []);
    },
    [reciters]
  );

  const handleMoshafChange = useCallback(
    (moshafId: number) => {
      setSelectedMoshaf(moshafId);
      setSelectedSurah(null);
      const moshaf = moshafList.find((m) => m.id === moshafId);
      if (!moshaf) return;

      const surahIds = moshaf.surah_list.split(",").map(Number);
      const surahs: AvailableSurah[] = surahIds
        .map((id) => {
          const info = surahNames.find((s) => s.id === id);
          const padded = String(id).padStart(3, "0");
          return info ? { id, name: info.name, url: `${moshaf.server}${padded}.mp3` } : null;
        })
        .filter(Boolean) as AvailableSurah[];

      setAvailableSurahs(surahs);
    },
    [moshafList, surahNames]
  );

  const handleSurahChange = useCallback((surah: AvailableSurah) => {
    setSelectedSurah(surah);
    if (audioRef.current) {
      audioRef.current.src = surah.url;
      audioRef.current.play().catch(() => {});
    }
  }, []);

  return {
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
  };
}
