import type { AvailableSurah } from "@/hooks/useQuranAPI";

export interface FavoriteItem {
  surah: AvailableSurah;
  reciterName: string;
  addedAt: number;
}

const KEY = "quran-favorites";

export function getFavorites(): FavoriteItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveFavorites(items: FavoriteItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function isFavorite(surahId: number, url: string) {
  return getFavorites().some((f) => f.surah.id === surahId && f.surah.url === url);
}

export function addFavorite(item: FavoriteItem) {
  const list = getFavorites();
  if (list.some((f) => f.surah.id === item.surah.id && f.surah.url === item.surah.url)) return list;
  const next = [item, ...list];
  saveFavorites(next);
  return next;
}

export function removeFavorite(surahId: number, url: string) {
  const next = getFavorites().filter((f) => !(f.surah.id === surahId && f.surah.url === url));
  saveFavorites(next);
  return next;
}

export function clearFavorites() {
  saveFavorites([]);
}
