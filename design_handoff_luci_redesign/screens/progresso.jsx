// Luci · screen: /progresso (charts + last workouts)

const ScreenProgresso = () => {
  const [tab, setTab] = React.useState(0);

  // Sparkline data
  const weightData = [74.1, 73.8, 73.6, 73.4, 73.0, 72.8, 72.6, 72.4];
  const paceData   = [288, 285, 284, 281, 278, 276, 274, 272]; // sec/km, for 5k pace
  const adherData  = [88, 92, 100, 95, 88, 75, 67]; // weekly

  return (
    <div className="canvas scroll" style={{ height: '100%', padding: '60px 18px 130px' }}>
      <div style={{ padding: '14px 0 6px' }}>
        <div className="label">progresso</div>
        <h1 className="serif" style={{ fontSize: 32, fontWeight: 500, lineHeight: 1, margin: '6px 0 16px', letterSpacing: '-0.025em' }}>
          os números<br/><span style={{ fontStyle: 'italic', color: 'var(--accent-deep)' }}>contam.</span>
        </h1>
      </div>

      <div style={{ marginBottom: 16 }}>
        <PillTabs tabs={['8 semanas', '4 semanas', 'ano']} active={tab} onChange={setTab}/>
      </div>

      {/* Hero metric 1 — Peso */}
      <div className="card" style={{ marginBottom: 12, padding: 22 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
          <div>
            <div className="label" style={{ marginBottom: 6 }}>peso</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span className="serif tab-num" style={{ fontSize: 44, fontWeight: 500, lineHeight: 1, letterSpacing: '-0.03em' }}>72,4</span>
              <span style={{ fontSize: 14, color: 'var(--muted)' }}>kg</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--done)', marginTop: 6, fontWeight: 600 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                ↓ 1,7 kg em 8 semanas
              </span>
            </div>
          </div>
          <Sparkline data={weightData} color="var(--accent)" width={130} height={56} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600 }}>
          <span>1 abr</span>
          <span>meta · 71,0</span>
          <span>hoje</span>
        </div>
      </div>

      {/* Hero metric 2 — Pace */}
      <div className="card" style={{ marginBottom: 12, padding: 22 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
          <div>
            <div className="label" style={{ marginBottom: 6 }}>melhor pace · 5km</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span className="serif tab-num" style={{ fontSize: 44, fontWeight: 500, lineHeight: 1, letterSpacing: '-0.03em' }}>4:32</span>
              <span style={{ fontSize: 14, color: 'var(--muted)' }}>/km</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--done)', marginTop: 6, fontWeight: 600 }}>
              ↓ 16s vs semana 1
            </div>
          </div>
          <Sparkline data={paceData.map(s => -s)} color="var(--ink)" width={130} height={56} />
        </div>
        <div className="coach-hint" style={{ fontSize: 12, marginTop: 4 }}>
          ritmo de meia-maratona projetado: <strong style={{ fontWeight: 700 }}>4:38/km</strong> — chega em 1h37.
        </div>
      </div>

      {/* Hero metric 3 — Adesão */}
      <div className="card-ink" style={{ marginBottom: 16, padding: 22 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="label" style={{ marginBottom: 6, color: 'rgba(243,238,228,0.55)' }}>adesão geral</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span className="serif tab-num" style={{ fontSize: 44, fontWeight: 500, lineHeight: 1, letterSpacing: '-0.03em' }}>87</span>
              <span style={{ fontSize: 20, color: 'rgba(243,238,228,0.55)' }}>%</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--accent-soft)', marginTop: 6, fontWeight: 600 }}>
              21 treinos · 3 perdidos
            </div>
          </div>
          <Sparkline data={adherData} color="var(--accent)" width={130} height={56} dark={true}/>
        </div>
        <div style={{ marginTop: 16, display: 'flex', gap: 4, alignItems: 'flex-end', height: 30 }}>
          {adherData.map((v, i) => (
            <div key={i} style={{
              flex: 1,
              height: `${(v / 100) * 100}%`,
              background: v >= 90 ? 'var(--accent)' : v >= 75 ? 'rgba(255,87,34,.65)' : 'rgba(243,238,228,.18)',
              borderRadius: 3,
              minHeight: 4,
            }}/>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
          {adherData.map((_, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: 9, color: 'rgba(243,238,228,0.5)', textTransform: 'uppercase', fontWeight: 600 }}>
              s{i+1}
            </div>
          ))}
        </div>
      </div>

      {/* Recent activities */}
      <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h2 className="serif" style={{ fontSize: 22, fontWeight: 500, margin: 0, letterSpacing: '-0.02em' }}>últimos treinos</h2>
        <a className="link" style={{ fontSize: 12 }}>ver tudo →</a>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { d: '26 mai · ter', type: 'strength', title: 'Força — A', metric: '45min', m2: 'RIR 2', m3: '' },
          { d: '25 mai · seg', type: 'easy',     title: 'Easy 8km',  metric: '5:32/km', m2: '44min', m3: 'FC 142' },
          { d: '24 mai · dom', type: 'long',     title: 'Longão 16km', metric: '5:18/km', m2: '1h25', m3: 'FC 150' },
          { d: '23 mai · sáb', type: 'rest',     title: 'Descanso', metric: '—', m2: '', m3: '' },
          { d: '22 mai · sex', type: 'swim',     title: '1800m técn.', metric: '1:54/100m', m2: '36min', m3: '' },
        ].map((w, i) => (
          <div key={i} className="card" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
            <WorkoutIcon type={w.type} size={40}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="label" style={{ marginBottom: 2 }}>{w.d}</div>
              <div className="serif" style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.1 }}>{w.title}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="tab-num" style={{ fontSize: 14, fontWeight: 700 }}>{w.metric}</div>
              <div style={{ fontSize: 10, color: 'var(--muted)' }}>{w.m2} {w.m3 && `· ${w.m3}`}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Sparkline = ({ data, color = 'var(--accent)', width = 120, height = 40, dark = false }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);

  const points = data.map((v, i) => {
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

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id={`sg-${color.replace(/[^a-z]/gi, '')}-${dark ? 'd' : 'l'}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={dark ? 0.35 : 0.22}/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#sg-${color.replace(/[^a-z]/gi, '')}-${dark ? 'd' : 'l'})`}/>
      <path d={path} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={points[points.length-1][0]} cy={points[points.length-1][1]} r="3.2" fill={color}/>
      <circle cx={points[points.length-1][0]} cy={points[points.length-1][1]} r="5.5" fill={color} opacity="0.25"/>
    </svg>
  );
};

Object.assign(window, { ScreenProgresso, Sparkline });
