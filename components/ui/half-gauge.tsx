'use client';

import { useEffect, useState, useId } from 'react';

type Props = {
  value: number;
  max?: number;
  /** Used as max width (or fixed width when responsive=false). */
  size?: number;
  /** When true, the gauge scales to fill its container (up to `size`). */
  responsive?: boolean;
  label?: React.ReactNode;
  topLabel?: React.ReactNode;
  sublabel?: React.ReactNode;
};

/**
 * Semicírculo de progresso com gradiente accent e bolinha cap na ponta.
 * Animação de preenchimento ao montar (1.1s).
 */
export function HalfGauge({
  value,
  max = 100,
  size = 200,
  responsive = false,
  label,
  topLabel,
  sublabel,
}: Props) {
  const gradId = useId();
  const pct = Math.max(0, Math.min(1, value / max));
  const r = 80;
  const cx = 100;
  const cy = 95;
  const circumference = Math.PI * r;

  const [animPct, setAnimPct] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setAnimPct(pct), 80);
    return () => clearTimeout(t);
  }, [pct]);

  const offset = circumference * (1 - animPct);
  const capX = cx + Math.cos(Math.PI - Math.PI * animPct) * r;
  const capY = cy - Math.sin(Math.PI - Math.PI * animPct) * r;

  return (
    <div
      className="relative flex flex-col items-center"
      style={responsive ? { width: '100%', maxWidth: size } : { width: size }}
    >
      <svg
        viewBox="0 0 200 110"
        width={responsive ? '100%' : size}
        height={responsive ? undefined : size * 0.55}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FF8A50" />
            <stop offset="100%" stopColor="#D8401A" />
          </linearGradient>
        </defs>
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          stroke="#ECE5D5"
          strokeWidth={16}
          fill="none"
          strokeLinecap="round"
        />
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          stroke={`url(#${gradId})`}
          strokeWidth={16}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.1s cubic-bezier(.2,.7,.2,1)' }}
        />
        <circle
          cx={capX}
          cy={capY}
          r={6}
          fill="#fff"
          stroke="#D8401A"
          strokeWidth={2}
          style={{ transition: 'cx 1.1s cubic-bezier(.2,.7,.2,1), cy 1.1s cubic-bezier(.2,.7,.2,1)' }}
        />
      </svg>
      <div className="-mt-2.5 text-center">
        {topLabel && (
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-muted)] mb-1">
            {topLabel}
          </div>
        )}
        {label && (
          <div className="font-serif tab-num text-3xl font-medium leading-none">
            {label}
          </div>
        )}
        {sublabel && (
          <div className="text-[11px] text-[var(--color-muted)] mt-1">{sublabel}</div>
        )}
      </div>
    </div>
  );
}
