// Luci · screen: /plano (8-week timeline + week detail)

const PLAN_WEEKS = [
  { n: 1, phase: 'base',   label: 'base',     adher: 100, state: 'done' },
  { n: 2, phase: 'base',   label: 'base',     adher: 92,  state: 'done' },
  { n: 3, phase: 'build',  label: 'build',    adher: 67,  state: 'current' },
  { n: 4, phase: 'build',  label: 'build',    adher: 0,   state: 'future' },
  { n: 5, phase: 'deload', label: 'deload',   adher: 0,   state: 'future' },
  { n: 6, phase: 'peak',   label: 'peak',     adher: 0,   state: 'future' },
  { n: 7, phase: 'polish', label: 'polish',   adher: 0,   state: 'future' },
  { n: 8, phase: 'taper',  label: 'taper',    adher: 0,   state: 'future' },
];

const ScreenPlano = ({ onOpenLog }) => {
  const [selected, setSelected] = React.useState(2); // week 3 (idx 2)
  const week = PLAN_WEEKS[selected];
  const p = PHASES[week.phase];

  // Days of selected week
  const days = [
    { day: 'seg', date: 25, type: 'easy',     title: 'Easy 8km',           done: true,  metrics: '5:32/km · 44min',   hint: 'Conversável, sem olhar relógio.' },
    { day: 'ter', date: 26, type: 'strength', title: 'Força — Sessão A',   done: true,  metrics: '45min · RIR 2',      hint: 'Última rep deve sobrar uma.' },
    { day: 'qua', date: 27, type: 'quality',  title: '5×1km @ pace',       done: false, today: true, metrics: '11km',  hint: 'Onde mora a adaptação.', detail: '4:30-4:35/km c/ 90"tr' },
    { day: 'qui', date: 28, type: 'strength', title: 'Força — Sessão B',   done: false, metrics: '45min · RIR 2',      hint: 'Posterior + core. Sem pressa.' },
    { day: 'sex', date: 29, type: 'swim',     title: '2000m técnico',      done: false, metrics: 'CSS+10',             hint: 'Sente a água. Não força.' },
    { day: 'sáb', date: 30, type: 'long',     title: 'Longão 18km',        done: false, metrics: '5:10/km estimado',    hint: 'Dia mais importante da semana.', detail: 'progredindo 5:25 → 5:00' },
    { day: 'dom', date: 31, type: 'rest',     title: 'Descanso',           done: false, metrics: '—',                   hint: 'Sério, descansa.' },
  ];

  return (
    <div className="canvas scroll" style={{ height: '100%', padding: '60px 18px 130px' }}>
      {/* header */}
      <div style={{ padding: '14px 0 6px' }}>
        <div className="label">o plano</div>
        <h1 className="serif" style={{ fontSize: 32, fontWeight: 500, lineHeight: 1, margin: '6px 0 12px', letterSpacing: '-0.025em' }}>
          oito semanas.<br/><span style={{ color: 'var(--accent-deep)', fontStyle: 'italic' }}>uma prova.</span>
        </h1>
      </div>

      {/* 8 phase dots */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, padding: '8px 0' }}>
        {PLAN_WEEKS.map((w, i) => {
          const pp = PHASES[w.phase];
          const active = i === selected;
          return (
            <React.Fragment key={i}>
              <button
                onClick={() => setSelected(i)}
                className="tap"
                style={{
                  width: active ? 36 : 22, height: active ? 36 : 22,
                  borderRadius: 9999,
                  background: w.state === 'done' ? pp.color : w.state === 'current' ? pp.color : 'transparent',
                  border: w.state === 'future' ? `2px dashed ${pp.color}` : 'none',
                  color: '#fff', cursor: 'pointer', flexShrink: 0,
                  fontWeight: 700, fontSize: active ? 13 : 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: active ? `0 4px 12px ${pp.color}55` : 'none',
                  transition: 'all .25s ease',
                  opacity: w.state === 'future' && !active ? 0.55 : 1,
                }}
              >
                {w.n}
              </button>
              {i < PLAN_WEEKS.length - 1 && (
                <div style={{
                  flex: 1, height: 2,
                  background: i < selected ? PHASES[PLAN_WEEKS[i].phase].color : '#D9D0BD',
                  borderRadius: 9999, minWidth: 4,
                }}/>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* current week card */}
      <div className="card" style={{ marginBottom: 16, marginTop: 8, padding: 22 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span className="phase-pill" style={{ background: 'transparent', borderColor: p.color, color: p.color }}>
              <span className="dot" style={{ background: p.color }}/>
              {p.label}
            </span>
            <div className="serif" style={{ fontSize: 28, fontWeight: 500, marginTop: 10, lineHeight: 1, letterSpacing: '-0.02em' }}>
              semana <span className="tab-num">{String(week.n).padStart(2, '0')}</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>25–31 mai · build week</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="label" style={{ marginBottom: 4 }}>adesão</div>
            <div className="serif tab-num" style={{ fontSize: 32, fontWeight: 500, lineHeight: 1, color: 'var(--accent-deep)' }}>{week.adher}<span style={{ fontSize: 16, color: 'var(--muted)' }}>%</span></div>
          </div>
        </div>

        {/* mini bar of days */}
        <div style={{ marginTop: 18, display: 'flex', gap: 4, alignItems: 'flex-end', height: 36 }}>
          {days.map((d, i) => (
            <div key={i} style={{
              flex: 1,
              height: d.done ? '100%' : d.today ? '70%' : '30%',
              background: d.done ? 'var(--accent)' : d.today ? 'var(--accent-soft)' : 'var(--paper-soft)',
              border: d.today ? `2px solid var(--accent)` : `1px solid var(--line)`,
              borderRadius: 6,
              transition: 'all .3s ease',
            }}/>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
          {days.map((d, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: 10, color: 'var(--muted)', fontWeight: d.today ? 700 : 500, textTransform: 'uppercase', letterSpacing: '.05em' }}>{d.day}</div>
          ))}
        </div>

        <div style={{ marginTop: 14, padding: 12, background: 'var(--paper-soft)', borderRadius: 14, fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.5 }}>
          <span className="serif" style={{ fontStyle: 'italic', color: 'var(--accent-deep)' }}>nota da semana —</span> volume sobe 10%. quinta é dia técnico na água, sábado é o longão mais longo até aqui. dorme bem.
        </div>
      </div>

      {/* days list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {days.map((d, i) => <WorkoutCard key={i} day={d} onLog={onOpenLog} />)}
      </div>
    </div>
  );
};

const WorkoutCard = ({ day, onLog }) => {
  const isToday = day.today;
  const isDone = day.done;
  const isRest = day.type === 'rest';

  return (
    <div className="card" style={{
      padding: 16,
      background: isToday ? 'var(--card)' : isRest ? 'var(--paper-soft)' : 'var(--card)',
      boxShadow: isToday ? 'var(--shadow-up)' : 'var(--shadow-soft)',
      border: isToday ? '2px solid var(--accent)' : 'none',
      opacity: isRest ? 0.85 : 1,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <WorkoutIcon type={day.type} size={44}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
            <div className="label" style={{ color: isToday ? 'var(--accent-deep)' : 'var(--muted)' }}>{day.day} · {String(day.date).padStart(2, '0')}</div>
            {isToday && <span className="pill pill-soft" style={{ padding: '3px 8px', fontSize: 10 }}>hoje</span>}
          </div>
          <div className="serif" style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.15, letterSpacing: '-0.01em' }}>{day.title}</div>
          {day.detail && <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>{day.detail}</div>}
        </div>
        <button className="tap" style={{ width: 28, height: 28, border: 0, background: 'transparent', cursor: 'pointer', color: 'var(--muted)' }}>
          <Icon name="edit" size={16} sw={1.8}/>
        </button>
      </div>

      {day.hint && (
        <div style={{ marginTop: 10, fontSize: 12, color: 'var(--ink-soft)', fontFamily: 'Fraunces, serif', fontStyle: 'italic', paddingLeft: 56, lineHeight: 1.4 }}>
          <span className="q-mark" style={{ fontSize: 18 }}>"</span>
          {day.hint}
        </div>
      )}

      <div style={{ marginTop: 12, paddingLeft: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'Inter', fontWeight: 600 }}>{day.metrics}</div>
        {isRest ? (
          <span className="pill pill-paper" style={{ padding: '6px 12px', fontSize: 11 }}>
            <Icon name="moon" size={11}/> descanso
          </span>
        ) : isDone ? (
          <span className="pill pill-done" style={{ padding: '6px 12px', fontSize: 11 }}>
            <Icon name="check" size={12} sw={2.6}/> feito
          </span>
        ) : isToday ? (
          <button onClick={onLog} className="pill pill-primary" style={{ padding: '8px 16px' }}>
            marcar feito
          </button>
        ) : (
          <span className="pill pill-paper" style={{ padding: '6px 12px', fontSize: 11 }}>planejado</span>
        )}
      </div>
    </div>
  );
};

Object.assign(window, { ScreenPlano, WorkoutCard, PLAN_WEEKS });
