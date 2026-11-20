export interface TimingRead {
  id: number;
  name: string;
  rewaya: string;
  folder_url: string;
}

export interface AyahTiming {
  ayah: number;
  start_time: number;
  end_time: number;
  page: string | null;
}

export const normalizeAudioFolder = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/+$/, "").toLowerCase();

export function timingPage(timing: AyahTiming): number | undefined {
  const match = timing.page?.match(/\/(\d+)\.svg(?:\?.*)?$/);
  const page = match ? Number(match[1]) : 0;
  return page >= 1 && page <= 604 ? page : undefined;
}

export function timingAt(timings: AyahTiming[], seconds: number): AyahTiming | undefined {
  const ms = seconds * 1000;
  return timings.find((t) => t.start_time <= ms && ms < t.end_time);
}

export function firstTimingOnPage(timings: AyahTiming[], page: number): AyahTiming | undefined {
  return timings.find((t) => t.ayah > 0 && timingPage(t) === page);
}