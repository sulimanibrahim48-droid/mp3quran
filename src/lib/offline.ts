const DB = "quran-offline";
const STORE = "audio";

const open = () =>
  new Promise<IDBDatabase>((res, rej) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(STORE);
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });

const tx = async <T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>) => {
  const db = await open();
  return new Promise<T>((res, rej) => {
    const req = fn(db.transaction(STORE, mode).objectStore(STORE));
    req.onsuccess = () => res(req.result);
    req.onerror = () => rej(req.error);
  });
};

export const getOffline = (url: string) => tx<Blob | undefined>("readonly", (s) => s.get(url));
export const removeOffline = (url: string) => tx("readwrite", (s) => s.delete(url));

export async function saveOffline(url: string, onProgress?: (p: number) => void) {
  const resp = await fetch(url);
  if (!resp.ok || !resp.body) throw new Error("fetch failed");
  const total = Number(resp.headers.get("content-length")) || 0;
  const reader = resp.body.getReader();
  const chunks: BlobPart[] = [];
  let got = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    got += value.length;
    if (total) onProgress?.(Math.round((got / total) * 100));
  }
  const blob = new Blob(chunks, { type: "audio/mpeg" });
  await tx("readwrite", (s) => s.put(blob, url));
}
