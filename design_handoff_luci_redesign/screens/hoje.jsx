// Luci · screen: /hoje (home)

const ScreenHoje = ({ onOpenLog, onNavigate, supplementsState, setSupplementsState }) => {
  // Data for Felipe — today is Wed May 27, race July 19 → 53 days
  const daysToRace = 53;
  const week = 3;
  const phase = 'build';

  // Today's workout: Quality run
  const todayWorkout = {
    type: 'quality',
    title: '5 × 1km @ ritmo de prova',
    detail: '10\' aq · 5×1km (4:30-4:35/km) c/ 90" tr · 10\' desaq',
    distance: '11 km',
    duration: '~58 min',
    hint: 'Quarta. Onde mora a adaptação. Não corre rápido demais nos primeiros — começa controlado, fecha forte.',
  };

  const tomorrow = {
    type: 'strength',
    title: 'Força — Sessão A',
    detail: 'Agachamento · TPS · Lev. terra',
    day: 'qui',
  };

  // Adesão da semana
  const weekDone = 4;
  const weekPlan = 6;
  const pct = Math.round((weekDone / weekPlan) * 100);

  // Day dots — today is Wed (index 2)
  const days = [
    { state: 'past-done', label: 'seg' },
    { state: 'past-done', label: 'ter' },
    { state: 'today', label: 'qua', num: 'Q' },
    { state: 'future', label: 'qui', num: 'Q' },
    { state: 'future', label: 'sex', num: 'S' },
    { state: 'future', label: 'sáb', num: 'S' },
    { state: 'rest',    label: 'dom' },
  ];

  const [pulseHero, setPulseHero] = React.useState(false);
  const handleLog = () => {
    setPulseHero(true);
    setTimeout(() => setPulseHero(false), 450);
    onOpenLog();
  };

  return (
    <div className="canvas scroll" style={{ height: '100%', padding: '60px 18px 130px' }}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 9999,
            background: 'var(--ink)', color: 'var(--paper)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 18,
            fontStyle: 'italic',
          }}>L</div>
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--muted)' }}>luci</div>
            <div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>plano do felipe</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="tap" style={btnIcon}><Icon name="bell" size={18} /></button>
          <button className="tap" style={btnIcon}><Icon name="user" size={18} /></button>
        </div>
      </div>

      {/* greeting + hero question */}
      <div style={{ marginBottom: 16 }}>
        <HeroQuestion
          greeting={<>bom dia, felipe <span style={{ fontFamily: 'inherit' }}>👋</span></>}
          headline={<>quarta-feira.<br/><span style={{ color: 'var(--accent-deep)' }}>onde mora</span> a adaptação.</>}
        />
        <div style={{ marginTop: 14 }}>
          <PhaseBadge week={week} phase={phase} />
        </div>
      </div>

      {/* hero training card */}
      <div className={`card ${pulseHero ? 'card-pulse' : ''}`} style={{ padding: 22, marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
          <div className="label">treino de hoje</div>
          <span className="pill pill-ink" style={{ padding: '5px 10px', fontSize: 11 }}>
            <Icon name="flame" size={11} sw={2.4}/> 3 dias seguidos
          </span>
        </div>

        <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginTop: 4 }}>
          <WorkoutIcon type="quality" size={48} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="serif" style={{ fontSize: 18, fontWeight: 500, lineHeight: 1.15, letterSpacing: '-0.02em' }}>{todayWorkout.title}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{todayWorkout.distance} · {todayWorkout.duration}</div>
          </div>
        </div>

        <CoachHint>{todayWorkout.hint}</CoachHint>

        {/* gauge inline */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '18px 0 6px', gap: 8 }}>
          <div style={{ flex: '0 0 auto' }}>
            <div className="label" style={{ marginBottom: 8 }}>adesão · semana</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span className="serif tab-num" style={{ fontSize: 40, fontWeight: 500, lineHeight: 1 }}>{weekDone}</span>
              <span style={{ fontSize: 14, color: 'var(--muted)' }}>/ {weekPlan}</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6, fontStyle: 'italic', fontFamily: 'Fraunces, serif' }}>treinos da semana</div>
          </div>
          <div style={{ width: 140, flexShrink: 0 }}>
            <HalfGauge value={weekDone} max={weekPlan} size={140} label={`${pct}%`} />
          </div>
        </div>

        <DayDots days={days} showLabel={true} />

        <button
          onClick={handleLog}
          className="tap"
          style={{
            marginTop: 18,
            width: '100%',
            background: 'var(--accent)',
            color: '#fff',
            border: 0,
            borderRadius: 9999,
            padding: '18px 24px',
            fontWeight: 700,
            fontSize: 15,
            cursor: 'pointer',
            boxShadow: 'var(--shadow-pop)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            letterSpacing: '.01em',
          }}
        >
          marcar feito <Icon name="arrow" size={16} sw={2.2}/>
        </button>
      </div>

      {/* stats 2x2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
        <StatCard icon={<Icon name="scale" size={16} sw={2}/>} label="peso de hoje" value="72,4 kg" sub="-0,3 vs ontem" />
        <StatCard icon={<Icon name="moon" size={16} sw={2}/>} label="sono" value="7h 12" sub="84 score" />
        <StatCard icon={<Icon name="bolt" size={16} sw={2}/>} label="energia" value={<EnergyDots value={4}/>} sub="4 de 5" />
        <StatCard icon={<Icon name="heart" size={16} sw={2}/>} label="fc repouso" value="48 bpm" sub="-2 vs base" />
      </div>

      {/* supplements row */}
      <div className="card-soft" style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
          <div>
            <div className="label">do dia</div>
            <div className="serif" style={{ fontSize: 17, fontWeight: 500, marginTop: 2 }}>suplementos</div>
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>{supplementsState.filter(Boolean).length} de {supplementsState.length}</div>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', flexWrap: 'wrap' }}>
          {['whey','creat','cafe','vit d','ômega','mag'].map((s, i) => (
            <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <button
                className={`supp-bubble ${supplementsState[i] ? 'filled' : ''}`}
                onClick={() => {
                  const next = [...supplementsState];
                  next[i] = !next[i];
                  setSupplementsState(next);
                }}
              >
                {supplementsState[i] ? <Icon name="check" size={16} sw={2.6}/> : s.slice(0,3)}
              </button>
              <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 600 }}>{s}</div>
            </div>
          ))}
        </div>
      </div>

      {/* amanhã */}
      <button
        className="tap"
        onClick={() => onNavigate('plano')}
        style={{
          width: '100%', background: 'transparent', border: 0,
          padding: 0, textAlign: 'left', cursor: 'pointer', marginBottom: 16,
        }}
      >
        <div className="card-soft" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <WorkoutIcon type="strength" size={42} />
          <div style={{ flex: 1 }}>
            <div className="label" style={{ marginBottom: 4 }}>amanhã · qui</div>
            <div className="serif" style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.2 }}>{tomorrow.title}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>{tomorrow.detail}</div>
          </div>
          <Icon name="chevron" size={18} stroke="var(--muted)"/>
        </div>
      </button>

      {/* countdown */}
      <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
        <div className="label" style={{ marginBottom: 6 }}>meia maratona · 19 jul</div>
        <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 8 }}>
          <span className="serif tab-num" style={{ fontSize: 48, fontWeight: 500, lineHeight: 1, letterSpacing: '-0.04em' }}>{daysToRace}</span>
          <span style={{ fontSize: 14, color: 'var(--muted)' }}>dias.</span>
          <span className="serif" style={{ fontStyle: 'italic', fontSize: 18, color: 'var(--accent-deep)' }}>tá perto.</span>
        </div>
      </div>
    </div>
  );
};

const EnergyDots = ({ value }) => (
  <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginTop: 2 }}>
    {[1,2,3,4,5].map(i => (
      <div key={i} style={{
        width: 10, height: 10, borderRadius: 9999,
        background: i <= value ? 'var(--accent)' : '#ECE5D5',
      }}/>
    ))}
  </div>
);

const btnIcon = {
  width: 38, height: 38, borderRadius: 9999,
  background: 'var(--card)', border: 0,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  boxShadow: 'var(--shadow-soft)', cursor: 'pointer',
  color: 'var(--ink-soft)',
};

Object.assign(window, { ScreenHoje, EnergyDots, btnIcon });
