// Luci · screen: /treinos (combined corrida/natacao/forca/nutricao)

const ScreenTreinos = () => {
  const [tab, setTab] = React.useState(0);
  const tabs = ['corrida', 'natação', 'força', 'nutrição'];

  return (
    <div className="canvas scroll" style={{ height: '100%', padding: '60px 18px 130px' }}>
      <div style={{ padding: '14px 0 12px' }}>
        <div className="label">referências</div>
        <h1 className="serif" style={{ fontSize: 32, fontWeight: 500, lineHeight: 1, margin: '6px 0 16px', letterSpacing: '-0.025em' }}>
          o teu manual.
        </h1>
        <PillTabs tabs={tabs} active={tab} onChange={setTab}/>
      </div>

      <div style={{ marginTop: 16 }}>
        {tab === 0 && <CorridaTab/>}
        {tab === 1 && <NatacaoTab/>}
        {tab === 2 && <ForcaTab/>}
        {tab === 3 && <NutricaoTab/>}
      </div>
    </div>
  );
};

/* ───────── Corrida ───────── */
const CorridaTab = () => {
  const zones = [
    { z: 'Z1', name: 'easy',      pace: '5:45+',  fc: '<140', note: 'conversável. base aeróbica.' },
    { z: 'Z2', name: 'aeróbico',  pace: '5:15',   fc: '140-155', note: 'longão. cada km econômico.' },
    { z: 'Z3', name: 'tempo',     pace: '4:40',   fc: '155-168', note: 'pace de prova. mora aqui.' },
    { z: 'Z4', name: 'limiar',    pace: '4:20',   fc: '168-178', note: 'difícil mas controlado.' },
    { z: 'Z5', name: 'vo₂',       pace: '4:00',   fc: '178+',    note: 'curtinho, doído, voa.' },
  ];

  return (
    <div>
      <div className="card" style={{ marginBottom: 14, padding: 22 }}>
        <div className="label">pace alvo · meia maratona</div>
        <div className="serif tab-num" style={{ fontSize: 56, fontWeight: 500, lineHeight: 1, letterSpacing: '-0.04em', margin: '10px 0' }}>
          4:38<span style={{ fontSize: 22, color: 'var(--muted)' }}>/km</span>
        </div>
        <div className="coach-hint" style={{ fontSize: 13 }}>
          alvo 1h36. stretch 1h34. base honesta. nada de querer correr 4:20 nos primeiros quilômetros.
        </div>
      </div>

      <div className="label" style={{ marginBottom: 10 }}>zonas de treino</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {zones.map((z, i) => (
          <div key={i} className="card" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 9999,
              background: ['#ECE5D5','#DDE8DA','#F4E9C7','#FFE5D6','#FFD0BA'][i],
              color: ['var(--muted)','var(--done)','#8A6A1B','var(--accent-deep)','var(--accent-deep)'][i],
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 14, flexShrink: 0,
            }}>{z.z}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <div className="serif" style={{ fontSize: 17, fontWeight: 500, letterSpacing: '-0.01em' }}>{z.name}</div>
                <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 600 }}>fc {z.fc}</div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink-soft)', fontStyle: 'italic', fontFamily: 'Fraunces, serif', marginTop: 2 }}>{z.note}</div>
            </div>
            <div className="serif tab-num" style={{ fontSize: 18, fontWeight: 500, color: 'var(--accent-deep)' }}>{z.pace}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ───────── Natação ───────── */
const NatacaoTab = () => (
  <div>
    {/* CSS hero — black card */}
    <div className="card-ink" style={{ padding: 24, marginBottom: 14, textAlign: 'center' }}>
      <div className="label" style={{ color: 'rgba(243,238,228,.55)' }}>critical swim speed</div>
      <div className="serif tab-num" style={{ fontSize: 72, fontWeight: 500, lineHeight: 1, margin: '6px 0', letterSpacing: '-0.05em' }}>
        1:52
      </div>
      <div style={{ fontSize: 12, color: 'rgba(243,238,228,.6)' }}>por 100 m · livre</div>
    </div>

    <div className="label" style={{ marginBottom: 10 }}>conjuntos por intenção</div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {[
        { name: 'técnico', pace: 'CSS+15', desc: '8×50 drills · catch-up · fisting' },
        { name: 'aeróbico', pace: 'CSS+10', desc: '4×400 livre c/ 30" descanso' },
        { name: 'limiar', pace: 'CSS', desc: '6×200 c/ 20" · sente ritmo' },
        { name: 'vo₂', pace: 'CSS-5', desc: '10×100 forte c/ 30"' },
      ].map((s, i) => (
        <div key={i} className="card-soft" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="wt-icon" style={{ background: '#D8E5F2', color: '#1F4FB8' }}>
            <Icon name="swim" size={20}/>
          </div>
          <div style={{ flex: 1 }}>
            <div className="serif" style={{ fontSize: 16, fontWeight: 500 }}>{s.name}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{s.desc}</div>
          </div>
          <span className="pill pill-paper" style={{ padding: '6px 12px', fontSize: 12 }}>{s.pace}</span>
        </div>
      ))}
    </div>

    <div className="coach-hint" style={{ marginTop: 18, padding: 14, background: 'var(--paper-soft)', border: '1px solid var(--line)', borderRadius: 14, borderLeft: '3px solid var(--accent)' }}>
      sente a água. não força. natação não é teste de força — é gestão de fluxo.
    </div>
  </div>
);

/* ───────── Força ───────── */
const ForcaTab = () => {
  const [sub, setSub] = React.useState(0);
  const sessoes = [
    {
      nome: 'sessão a',
      ex: [
        { nome: 'agachamento livre', sets: '4×6', rir: 'RIR 2', cue: 'joelho na direção do dedão.' },
        { nome: 'levantamento terra', sets: '3×5', rir: 'RIR 2', cue: 'barra colada na canela.' },
        { nome: 'remada curvada', sets: '3×8', rir: 'RIR 1', cue: 'puxa pra umbigo.' },
        { nome: 'prancha lateral', sets: '3×30s', rir: '—', cue: 'quadril alinhado.' },
      ],
    },
    {
      nome: 'sessão b',
      ex: [
        { nome: 'stiff', sets: '4×6', rir: 'RIR 2', cue: 'sente posterior, não lombar.' },
        { nome: 'desenvolvimento', sets: '3×6', rir: 'RIR 2', cue: 'core travado.' },
        { nome: 'avanço c/ haltere', sets: '3×8 cada', rir: 'RIR 1', cue: 'joelho de trás quase no chão.' },
        { nome: 'abdominal âncora', sets: '3×12', rir: '—', cue: 'lombar colada no solo.' },
      ],
    },
  ];

  return (
    <div>
      <PillTabs tabs={['sessão a', 'sessão b']} active={sub} onChange={setSub}/>
      <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {sessoes[sub].ex.map((e, i) => (
          <div key={i} className="card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ flex: 1 }}>
                <div className="label" style={{ marginBottom: 4 }}>exercício {String(i+1).padStart(2,'0')}</div>
                <div className="serif" style={{ fontSize: 18, fontWeight: 500, lineHeight: 1.1, letterSpacing: '-0.01em' }}>{e.nome}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                <span className="serif tab-num" style={{ fontSize: 18, fontWeight: 500, color: 'var(--accent-deep)' }}>{e.sets}</span>
                {e.rir !== '—' && <span className="pill pill-paper" style={{ padding: '3px 8px', fontSize: 10 }}>{e.rir}</span>}
              </div>
            </div>
            <div className="coach-hint" style={{ marginTop: 10, fontSize: 13 }}>{e.cue}</div>
          </div>
        ))}
      </div>

      <div className="card-soft" style={{ marginTop: 14, padding: 16, fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.5 }}>
        <span className="serif" style={{ fontStyle: 'italic', color: 'var(--accent-deep)', fontWeight: 500 }}>regra de ouro —</span> última rep deve sobrar uma. se chegar na falha, parou de servir pra corrida.
      </div>
    </div>
  );
};

/* ───────── Nutrição ───────── */
const NutricaoTab = () => {
  const [subTab, setSubTab] = React.useState(0);
  return (
    <div>
      <PillTabs tabs={['hoje', 'macros', 'dia de prova']} active={subTab} onChange={setSubTab}/>
      <div style={{ marginTop: 14 }}>
        {subTab === 0 && <NutricaoHoje/>}
        {subTab === 1 && <NutricaoMacros/>}
        {subTab === 2 && <NutricaoProva/>}
      </div>
    </div>
  );
};

const NutricaoHoje = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
    {[
      { hora: '05h00', nome: 'pré-treino', items: 'banana · pão · café preto', cor: 'var(--accent)' },
      { hora: '07h30', nome: 'pós-treino', items: 'whey · aveia · ovos · café', cor: 'var(--done)' },
      { hora: '12h30', nome: 'almoço',     items: 'arroz · feijão · frango · salada', cor: 'var(--phase-base)' },
      { hora: '16h00', nome: 'lanche',     items: 'iogurte · castanhas · fruta', cor: 'var(--phase-deload)' },
      { hora: '19h30', nome: 'jantar',     items: 'tubérculo · proteína · folhas', cor: 'var(--phase-polish)' },
    ].map((m, i) => (
      <div key={i} className="card" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 4, alignSelf: 'stretch', minHeight: 38,
          background: m.cor, borderRadius: 9999,
        }}/>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span className="serif tab-num" style={{ fontSize: 16, fontWeight: 500 }}>{m.hora}</span>
            <span className="label">{m.nome}</span>
          </div>
          <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 4 }}>{m.items}</div>
        </div>
      </div>
    ))}
  </div>
);

const NutricaoMacros = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
    {[
      { name: 'carboidratos', value: '320g', pct: 75, color: 'var(--accent)' },
      { name: 'proteína',     value: '150g', pct: 92, color: 'var(--phase-polish)' },
      { name: 'gordura',      value: '70g',  pct: 60, color: 'var(--phase-base)' },
    ].map((m, i) => (
      <div key={i} className="card" style={{ padding: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div className="serif" style={{ fontSize: 17, fontWeight: 500 }}>{m.name}</div>
          <div>
            <span className="serif tab-num" style={{ fontSize: 24, fontWeight: 500 }}>{m.value}</span>
            <span style={{ fontSize: 11, color: 'var(--muted)', marginLeft: 4 }}>· {m.pct}%</span>
          </div>
        </div>
        <div style={{ marginTop: 10, height: 6, background: 'var(--paper-soft)', borderRadius: 9999, overflow: 'hidden' }}>
          <div style={{ width: `${m.pct}%`, height: '100%', background: m.color, borderRadius: 9999, transition: 'width .8s ease' }}/>
        </div>
      </div>
    ))}
  </div>
);

const NutricaoProva = () => (
  <div className="card-ink" style={{ padding: 22 }}>
    <div className="label" style={{ color: 'rgba(243,238,228,.55)' }}>na manhã da prova</div>
    <h3 className="serif" style={{ fontSize: 22, fontWeight: 500, margin: '6px 0 14px', letterSpacing: '-0.02em' }}>nada de novo.</h3>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 13, color: 'rgba(243,238,228,.88)', lineHeight: 1.5 }}>
      <div><strong className="serif" style={{ color: 'var(--accent-soft)', fontStyle: 'italic', fontWeight: 500 }}>3h antes —</strong> café da manhã. pão, banana, café preto, 500ml água.</div>
      <div><strong className="serif" style={{ color: 'var(--accent-soft)', fontStyle: 'italic', fontWeight: 500 }}>1h antes —</strong> gel + 200ml. nada sólido.</div>
      <div><strong className="serif" style={{ color: 'var(--accent-soft)', fontStyle: 'italic', fontWeight: 500 }}>na corrida —</strong> gel km 7, gel km 14. água a cada posto.</div>
      <div><strong className="serif" style={{ color: 'var(--accent-soft)', fontStyle: 'italic', fontWeight: 500 }}>chegou —</strong> banana imediato. água com sal. comer de verdade em 1h.</div>
    </div>
  </div>
);

Object.assign(window, { ScreenTreinos, CorridaTab, NatacaoTab, ForcaTab, NutricaoTab });
