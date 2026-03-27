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
  mpieces: Moshaf[];
}

interface Surah {
  id: number;
  name: string;
  start_page: number;
  end_page: number;
  makkia: number;
  type: number;
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
  const [mpieces, setMpieces] = useState<Moshaf[]>([]);
  const [selectedMoshaf, setSelectedMoshaf] = useState<number | null>(null);
  const [availableSurahs, setAvailableSurahs] = useState<AvailableSurah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<AvailableSurah | null>(null);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch reciters and surah names on mount
  useEffect(() => {
    async function fetchInitialData() {
      try {
        const [recitersRes, surahRes] = await Promise.all([
          fetch(`${API_BASE}/reciters?language=ar`),
          fetch(`${API_BASE}/suwar?language=ar`),
        ]);
        const recitersData = await recitersRes.json();
        const surahData = await surahRes.json();
        setReciters(recitersData.reciters || []);
        setSurahNames(surahData.suwar || []);
      } catch (e) {
        console.error("Error fetching initial data:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchInitialData();
  }, []);

  // When reciter changes, update moshaf list
  const handleReciterChange = useCallback(
    (reciterId: number) => {
      setSelectedReciter(reciterId);
      setSelectedMoshaf(null);
      setAvailableSurahs([]);
      setSelectedSurah(null);
      const reciter = reciters.find((r) => r.id === reciterId);
      setMpieces(reciter?.mpieces || []);
    },
    [reciters]
  );

  // When moshaf changes, build available surahs
  const handleMoshafChange = useCallback(
    (moshafId: number) => {
      setSelectedMoshaf(moshafId);
      setSelectedSurah(null);
      const moshaf = mpieces.find((m) => m.id === moshafId);
      if (!moshaf) return;

      const surahIds = moshaf.surah_list.split(",").map(Number);
      const surahs: AvailableSurah[] = surahIds
        .map((id) => {
          const surahInfo = surahNames.find((s) => s.id === id);
          const paddedId = String(id).padStart(3, "0");
          return surahInfo
            ? {
                id,
                name: surahInfo.name,
                url: `${moshaf.server}${paddedId}.mp3`,
              }
            : null;
        })
        .filter(Boolean) as AvailableSurah[];

      setAvailableSurahs(surahs);
    },
    [mpieces, surahNames]
  );

  // Play surah
  const handleSurahChange = useCallback((surah: AvailableSurah) => {
    setSelectedSurah(surah);
    if (audioRef.current) {
      audioRef.current.src = surah.url;
      audioRef.current.play().catch(() => {});
    }
  }, []);

  return {
    reciters,
    mpieces,
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
