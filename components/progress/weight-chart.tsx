'use client';

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export function WeightChart({ data }: { data: { date: string; weight: number }[] }) {
  return (
    <div style={{ width: '100%', height: 180 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 5, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: '#a8a29e' }}
            tickFormatter={(v) => v.split('-').reverse().slice(0, 2).join('/')}
          />
          <YAxis
            domain={['dataMin - 1', 'dataMax + 1']}
            tick={{ fontSize: 10, fill: '#a8a29e' }}
            width={32}
          />
          <Tooltip
            contentStyle={{ background: '#1c1917', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12 }}
            labelStyle={{ color: '#a8a29e', fontSize: 11 }}
            formatter={(v) => [`${Number(v)} kg`, 'Peso']}
            labelFormatter={(v) => String(v).split('-').reverse().join('/')}
          />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#1c1917"
            strokeWidth={2}
            dot={{ fill: '#1c1917', r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
