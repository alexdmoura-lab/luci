// Luci · screen: /prova (race day)

const ScreenProva = () => {
  const days = 53;

  return (
    <div className="canvas scroll" style={{ height: '100%', padding: '60px 18px 130px' }}>
      <div style={{ padding: '14px 0 12px' }}>
        <div className="label">a prova</div>
        <h1 className="serif" style={{ fontSize: 30, fontWeight: 500, lineHeight: 1.02, margin: '6px 0 0', letterSpacing: '-0.025em' }}>
          meia maratona<br/><span style={{ fontStyle: 'italic', color: 'var(--accent-deep)' }}>de brasília.</span>
        </h1>
      </div>

      {/* hero countdown — deep red ink card */}
      <div className="card-ink" style={{
        background: '#1a0d0a',
        backgroundImage: 'radial-gradient(circle at 20% 0%, rgba(255,87,34,.18), transparent 60%), radial-gradient(circle at 80% 100%, rgba(216,64,26,.12), transparent 60%)',
        padding: 26, marginBottom: 16, color: '#F3EEE4',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
          <div>
            <div className="label" style={{ color: 'rgba(243,238,228,.6)' }}>contagem</div>
            <div className="serif" style={{ fontSize: 12, color: 'rgba(243,238,228,.7)', marginTop: 4, fontStyle: 'italic' }}>dom · 19 jul · 6h00</div>
          </div>
          <span className="pill" style={{ background: 'var(--accent)', color: '#fff', padding: '6px 12px', fontSize: 11 }}>
            <Icon name="pin" size={11}/> brasília
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
          <span className="serif tab-num" style={{ fontSize: 96, fontWeight: 500, lineHeight: .85, letterSpacing: '-0.06em' }}>{days}</span>
          <div>
            <div className="serif" style={{ fontSize: 22, fontStyle: 'italic', color: 'var(--accent-soft)' }}>dias.</div>
            <div style={{ fontSize: 11, color: 'rgba(243,238,228,.55)' }}>7 semanas e 4 dias</div>
          </div>
        </div>

        <div style={{
          marginTop: 18, paddingTop: 18,
          borderTop: '1px solid rgba(243,238,228,.12)',
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12,
        }}>
          <div>
            <div className="label" style={{ color: 'rgba(243,238,228,.5)', marginBottom: 4 }}>distância</div>
            <div className="serif tab-num" style={{ fontSize: 22, fontWeight: 500 }}>21,1<span style={{ fontSize: 12, color: 'rgba(243,238,228,.6)' }}>km</span></div>
          </div>
          <div>
            <div className="label" style={{ color: 'rgba(243,238,228,.5)', marginBottom: 4 }}>alvo</div>
            <div className="serif tab-num" style={{ fontSize: 22, fontWeight: 500 }}>1h36</div>
          </div>
          <div>
            <div className="label" style={{ color: 'rgba(243,238,228,.5)', marginBottom: 4 }}>pb</div>
            <div className="serif tab-num" style={{ fontSize: 22, fontWeight: 500 }}>1h38</div>
          </div>
        </div>
      </div>

      {/* Pacing strategy */}
      <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
        <h2 className="serif" style={{ fontSize: 20, fontWeight: 500, margin: 0, letterSpacing: '-0.02em', lineHeight: 1.1 }}>estratégia de pace</h2>
        <span className="label" style={{ flexShrink: 0 }}>por trecho</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
        {[
          { trecho: 'km 1—5',  pace: '4:42', tag: 'segura',   note: 'aquece. respira. ainda não é a hora.' },
          { trecho: 'km 6—10', pace: '4:38', tag: 'ritmo',    note: 'cadência fixa, pé leve.' },
          { trecho: 'km 11—16',pace: '4:36', tag: 'mantém',   note: 'aqui a cabeça começa a mentir. ignora.' },
          { trecho: 'km 17—21',pace: '4:30', tag: 'fecha',     note: 'tudo que sobrou. e o que não sobrou também.' },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 54, height: 54, borderRadius: 14,
              background: i === 3 ? 'var(--accent)' : 'var(--accent-soft)',
              color: i === 3 ? '#fff' : 'var(--accent-deep)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', flexShrink: 0,
            }}>
              <div className="label" style={{ color: 'inherit', opacity: .75 }}>{s.tag}</div>
              <div className="serif tab-num" style={{ fontSize: 16, fontWeight: 600, lineHeight: 1, marginTop: 2 }}>{s.pace}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div className="serif" style={{ fontSize: 17, fontWeight: 500, letterSpacing: '-0.01em' }}>{s.trecho}</div>
              <div className="coach-hint" style={{ marginTop: 6, fontSize: 12, paddingLeft: 8 }}>{s.note}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Regras inegociáveis */}
      <div className="card-ink" style={{ padding: 22, marginBottom: 18 }}>
        <div className="label" style={{ color: 'rgba(243,238,228,.5)', marginBottom: 8 }}>regras inegociáveis</div>
        <h3 className="serif" style={{ fontSize: 20, fontWeight: 500, margin: '0 0 14px', color: '#fff', letterSpacing: '-0.01em' }}>na manhã da prova</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { num: '01', txt: 'Acorda 3h antes. Sem alarme atrasado.' },
            { num: '02', txt: 'Café + pão + banana. Nada novo.' },
            { num: '03', txt: 'Hidrata em goles. Não chega seco, não chega encharcado.' },
            { num: '04', txt: 'Tênis usado. Meia testada. Roupa secada ao sol.' },
            { num: '05', txt: 'Os primeiros 3 km são pra acalmar a cabeça. Confia.' },
          ].map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <span className="serif tab-num" style={{ fontSize: 18, color: 'var(--accent)', fontWeight: 500, opacity: .8, minWidth: 26 }}>{r.num}</span>
              <span style={{ fontSize: 14, color: 'rgba(243,238,228,.92)', lineHeight: 1.45, flex: 1 }}>{r.txt}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Final mantra */}
      <div style={{ padding: '20px 8px', textAlign: 'center' }}>
        <div className="q-mark">"</div>
        <div className="serif" style={{ fontSize: 22, fontStyle: 'italic', lineHeight: 1.25, color: 'var(--ink-soft)', letterSpacing: '-0.01em' }}>
          é hoje. confia no que treinou.
        </div>
        <div className="label" style={{ marginTop: 12 }}>— 19 . jul . 2026</div>
      </div>
    </div>
  );
};

Object.assign(window, { ScreenProva });
