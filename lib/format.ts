export function paceSecToString(sec: number | null | undefined): string {
  if (!sec || sec <= 0) return '—';
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}/km`;
}

/** "4:35" ou "4:35/km" → segundos. Aceita também "4m35s". */
export function parsePace(input: string): number | null {
  const cleaned = input.trim().replace('/km', '').replace('s', '').replace('m', ':');
  const m = cleaned.match(/^(\d{1,2}):(\d{1,2})$/);
  if (!m) return null;
  const min = Number(m[1]);
  const sec = Number(m[2]);
  if (sec >= 60) return null;
  return min * 60 + sec;
}

export function plural(n: number, one: string, many: string): string {
  return n === 1 ? one : many;
}
