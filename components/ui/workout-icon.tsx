import { Activity, Waves, Dumbbell, Moon, Trophy, Zap, Utensils, Footprints } from 'lucide-react';
import type { WorkoutType } from '@/lib/plan-data';

type IconKey = WorkoutType | 'nutrition';

type Style = {
  bg: string;
  fg: string;
  Icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
};

const MAP: Record<IconKey, Style> = {
  long: { bg: '#FFE5D6', fg: '#D8401A', Icon: Activity },
  run: { bg: '#DDE8DA', fg: '#4F8F58', Icon: Footprints },
  swim: { bg: '#D8E5F2', fg: '#1F4FB8', Icon: Waves },
  strength: { bg: '#E3DAEF', fg: '#5B3FA8', Icon: Dumbbell },
  rest: { bg: '#ECE5D5', fg: '#8C857A', Icon: Moon },
  race: { bg: '#1B1815', fg: '#FFE5D6', Icon: Trophy },
  nutrition: { bg: '#FFE5D6', fg: '#D8401A', Icon: Utensils },
};

/** Quality run icon (bolt) — used for run workouts marked as "quality" detail */
const QUALITY_STYLE: Style = { bg: '#F4E9C7', fg: '#8A6A1B', Icon: Zap };

type Variant = 'default' | 'quality';

type Props = {
  type: IconKey;
  size?: number;
  variant?: Variant;
  className?: string;
};

export function WorkoutIcon({ type, size = 44, variant = 'default', className = '' }: Props) {
  const style = variant === 'quality' ? QUALITY_STYLE : MAP[type] ?? MAP.run;
  const { Icon } = style;
  return (
    <div
      className={`rounded-full flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size, background: style.bg, color: style.fg }}
    >
      <Icon size={Math.round(size * 0.5)} strokeWidth={1.8} />
    </div>
  );
}

export const WORKOUT_TYPE_LABELS: Record<IconKey, string> = {
  long: 'Longão',
  run: 'Corrida',
  swim: 'Natação',
  strength: 'Força',
  rest: 'Descanso',
  race: 'Prova',
  nutrition: 'Nutrição',
};
