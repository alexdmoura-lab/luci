'use client';

import { useId } from 'react';

type Props = {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
  dark?: boolean;
};

export function Sparkline({
  data,
  color = 'var(--color-accent)',
  width = 130,
  height = 56,
  dark = false,
}: Props) {
  const gradId = useId();

  if (data.length === 0) {
    return <svg width={width} height={height} />;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = data.length > 1 ? width / (data.length - 1) : 0;

  const points: Array<[number, number]> = data.map((v, i) => {
    const x = i * stepX;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return [x, y];
  });

  const path = points.reduce((acc, [x, y], i) => {
    if (i === 0) return `M ${x} ${y}`;
    const [px, py] = points[i - 1];
    const cx = (px + x) / 2;
    return `${acc} Q ${px} ${py} ${cx} ${(py + y) / 2} T ${x} ${y}`;
  }, '');

  const areaPath = `${path} L ${width} ${height} L 0 ${height} Z`;

  const last = points[points.length - 1];

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={dark ? 0.35 : 0.22} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradId})`} />
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={last[0]} cy={last[1]} r={3.2} fill={color} />
      <circle cx={last[0]} cy={last[1]} r={5.5} fill={color} opacity={0.25} />
    </svg>
  );
}
