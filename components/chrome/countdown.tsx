import { daysUntilRace } from '@/lib/dates';
import { plural } from '@/lib/format';

export function Countdown({ small = false }: { small?: boolean }) {
  const days = daysUntilRace();
  if (small) {
    return (
      <span className="text-xs text-stone-500">
        <span className="font-medium text-stone-800">{days}</span> {plural(days, 'dia', 'dias')} até 19/07
      </span>
    );
  }
  return (
    <div className="flex items-baseline gap-2">
      <span className="font-serif text-5xl font-medium text-stone-900 tabular-nums leading-none">
        {days}
      </span>
      <span className="text-sm text-stone-600">
        {plural(days, 'dia até', 'dias até')} <span className="font-medium text-stone-800">19/07</span>
      </span>
    </div>
  );
}
