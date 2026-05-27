import { DAY_CODES, DayCode, PLAN_START, RACE_DATE, WEEKS } from './plan-data';

// Tudo em America/Sao_Paulo (UTC-3, sem DST desde 2019).
const TZ = 'America/Sao_Paulo';

function tzParts(date: Date): { y: number; m: number; d: number } {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const parts = fmt.formatToParts(date);
  const get = (t: string) => Number(parts.find((p) => p.type === t)!.value);
  return { y: get('year'), m: get('month'), d: get('day') };
}

/** YYYY-MM-DD no fuso de Brasília. */
export function todayISO(now = new Date()): string {
  const { y, m, d } = tzParts(now);
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

/** Cria Date a partir de YYYY-MM-DD (meio-dia UTC pra evitar bugs de fuso). */
export function fromISO(iso: string): Date {
  return new Date(`${iso}T12:00:00Z`);
}

export function daysBetween(aISO: string, bISO: string): number {
  const a = fromISO(aISO).getTime();
  const b = fromISO(bISO).getTime();
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

export function daysUntilRace(now = new Date()): number {
  return Math.max(0, daysBetween(todayISO(now), RACE_DATE));
}

/** Semana atual do plano (1..8). Antes do início retorna 1, depois retorna 8. */
export function currentWeekNum(now = new Date()): number {
  const diff = daysBetween(PLAN_START, todayISO(now));
  if (diff < 0) return 1;
  const wk = Math.floor(diff / 7) + 1;
  if (wk > WEEKS.length) return WEEKS.length;
  return wk;
}

/** Código do dia de hoje no formato do plano (SEG, TER...). */
export function todayDayCode(now = new Date()): DayCode {
  // getDay no fuso local pode mentir; usamos a string YYYY-MM-DD pra deduzir.
  const iso = todayISO(now);
  // 0=domingo no Date local construído a partir de noon UTC
  const wd = fromISO(iso).getUTCDay(); // 0=Sun..6=Sat
  // mapeia pra ordem SEG..DOM
  const map: DayCode[] = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
  return map[wd];
}

/** Próximo dia da semana após `from`. */
export function nextDayCode(from: DayCode): DayCode {
  const idx = DAY_CODES.indexOf(from);
  return DAY_CODES[(idx + 1) % DAY_CODES.length];
}

export function formatBR(iso: string): string {
  const d = fromISO(iso);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}
