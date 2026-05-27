export function AdherenceRing({
  total,
  done,
  size = 64,
  stroke = 6,
}: {
  total: number;
  done: number;
  size?: number;
  stroke?: number;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = total > 0 ? done / total : 0;
  const offset = c * (1 - pct);
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="#e7e5e4" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="#059669" strokeWidth={stroke}
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 600ms ease-out' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="font-serif text-lg leading-none tabular-nums">{done}<span className="text-stone-400">/{total}</span></div>
      </div>
    </div>
  );
}
