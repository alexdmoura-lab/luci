'use client';

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export function PaceChart({ data }: { data: { date: string; pace: number; label: string }[] }) {
  // Invert so faster (smaller) shows higher
  return (
    <div style={{ width: '100%', height: 180 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 5, right: 8, left: -8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: '#a8a29e' }}
            tickFormatter={(v) => v.split('-').reverse().slice(0, 2).join('/')}
          />
          <YAxis
            reversed
            domain={['dataMin - 10', 'dataMax + 10']}
            tick={{ fontSize: 10, fill: '#a8a29e' }}
            width={48}
            tickFormatter={(v: number) => `${Math.floor(v / 60)}:${String(v % 60).padStart(2, '0')}`}
          />
          <Tooltip
            contentStyle={{ background: '#1c1917', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12 }}
            labelStyle={{ color: '#a8a29e', fontSize: 11 }}
            formatter={(value, _name, item) => {
              const v = Number(value);
              const label = (item as { payload?: { label?: string } })?.payload?.label ?? 'Pace';
              return [`${Math.floor(v / 60)}:${String(v % 60).padStart(2, '0')}/km`, label];
            }}
            labelFormatter={(v) => String(v).split('-').reverse().join('/')}
          />
          <Line
            type="monotone"
            dataKey="pace"
            stroke="#ea580c"
            strokeWidth={2}
            dot={{ fill: '#ea580c', r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
