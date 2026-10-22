/** "2019-06-28" -> "2019". Empty when TMDB has no date. */
export function year(date: string | null | undefined): string {
  return date?.slice(0, 4) ?? '';
}

/** 129 -> "2h 9m", 45 -> "45m". Empty when unknown. */
export function runtime(minutes: number | null | undefined): string {
  if (!minutes) return '';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
}
