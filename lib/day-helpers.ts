import type { DayCode } from './plan-data';

/** Lowercase three-letter labels (seg, ter, …) — design language uses these. */
export const DAY_LABELS: Record<DayCode, string> = {
  'SEG': 'seg',
  'TER': 'ter',
  'QUA': 'qua',
  'QUI': 'qui',
  'SEX': 'sex',
  'SÁB': 'sáb',
  'DOM': 'dom',
};

/** Single-letter labels for compact day dots when no date is shown. */
export const DAY_INITIALS: Record<DayCode, string> = {
  'SEG': 'S',
  'TER': 'T',
  'QUA': 'Q',
  'QUI': 'Q',
  'SEX': 'S',
  'SÁB': 'S',
  'DOM': 'D',
};
