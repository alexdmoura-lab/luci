// Luci · screens: login + log modal + bottom nav

/* ────────── LogModal — bottom sheet ────────── */
const LogModal = ({ onClose, onComplete }) => {
  const [status, setStatus] = React.useState('done'); // done | partial | skip
  const [pace, setPace] = React.useState({ min: 4, sec: 32 });
  const [fc, setFc] = React.useState(152);
  const [rpe, setRpe] = React.useState(7);
  const [note, setNote] = React.useState('');
  const [saved, setSaved] = React.useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(() => {
      onComplete();
    }, 1200);
  };

  if (saved) {
    return (
      <>
        <div className="sheet-backdrop"/>
        <div className="sheet" style={{ paddingTop: 32, paddingBottom: 40 }}>
          <div className="sheet-handle"/>
          <div style={{ textAlign: 'center', padding: '36px 20px' }}>
            <div style={{
              width: 84, height: 84, borderRadius: 9999,
              background: 'var(--done-soft)', color: 'var(--done)',
              margin: '0 auto 18px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12.5l4.5 4.5L19 7.5" style={{ strokeDasharray: 24, strokeDashoffset: 24, animation: 'checkdraw 0.45s ease-out 0.05s forwards' }}/>
              </svg>
            </div>
            <h2 className="serif" style={{ fontSize: 28, fontWeight: 500, margin: 0, letterSpacing: '-0.02em' }}>
              feito.
            </h2>
            <div style={{ marginTop: 8, fontSize: 14, color: 'var(--ink-soft)', fontStyle: 'italic', fontFamily: 'Fraunces, serif' }}>
              quarta consecutiva. tá voando.
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="sheet-backdrop" onClick={onClose}/>
      <div className="sheet">
        <div className="sheet-handle"/>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
          <div>
            <div className="label">treino de hoje</div>
            <h2 className="serif" style={{ fontSize: 24, fontWeight: 500, margin: '4px 0 0', letterSpacing: '-0.02em' }}>como foi?</h2>
          </div>
          <button onClick={onClose} className="tap" style={{ ...btnIcon, width: 32, height: 32 }}>
            <Icon name="x" size={14} sw={2.4}/>
          </button>
        </div>

        <div className="scroll" style={{ flex: 1, minHeight: 0, paddingBottom: 8 }}>
          {/* status */}
          <div style={{ marginBottom: 18 }}>
            <div className="label" style={{ marginBottom: 8 }}>status</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { id: 'done', label: 'feito', color: 'var(--accent)' },
                { id: 'partial', label: 'parcial', color: 'var(--warn)' },
                { id: 'skip', label: 'pulei', color: 'var(--muted)' },
              ].map(s => (
                <button key={s.id} onClick={() => setStatus(s.id)} className="tap" style={{
                  flex: 1,
                  background: status === s.id ? s.color : 'var(--card)',
                  color: status === s.id ? '#fff' : 'var(--ink-soft)',
                  border: status === s.id ? 'none' : '1px solid var(--line)',
                  borderRadius: 9999,
                  padding: '12px 16px',
                  fontWeight: 600, fontSize: 13,
                  cursor: 'pointer',
                  boxShadow: status === s.id ? '0 4px 10px rgba(0,0,0,.08)' : 'none',
                  transition: 'all .15s ease',
                }}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {status !== 'skip' && (
            <>
              {/* pace */}
              <div className="card-soft" style={{ marginBottom: 12 }}>
                <div className="label" style={{ marginBottom: 8 }}>pace médio</div>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <div>
                    <input
                      type="number"
                      value={pace.min}
                      onChange={e => setPace({...pace, min: +e.target.value})}
                      className="serif tab-num"
                      style={inputBig}
                    />
                    <span className="serif" style={{ fontSize: 32, color: 'var(--muted)' }}>:</span>
                    <input
                      type="number"
                      value={String(pace.sec).padStart(2, '0')}
                      onChange={e => setPace({...pace, sec: +e.target.value})}
                      className="serif tab-num"
                      style={inputBig}
                    />
                    <span style={{ fontSize: 14, color: 'var(--muted)', marginLeft: 6 }}>/km</span>
                  </div>
                  <span className="pill pill-soft" style={{ fontSize: 11 }}>z3 · tempo</span>
                </div>
              </div>

              {/* FC + RPE */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                <div className="card-soft">
                  <div className="label" style={{ marginBottom: 8 }}>fc média</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <input
                      type="number" value={fc} onChange={e => setFc(+e.target.value)}
                      className="serif tab-num"
                      style={{ ...inputBig, width: 70 }}
                    />
                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>bpm</span>
                  </div>
                </div>
                <div className="card-soft">
                  <div className="label" style={{ marginBottom: 8 }}>rpe</div>
                  <div style={{ display: 'flex', gap: 3 }}>
                    {[1,2,3,4,5,6,7,8,9,10].map(n => (
                      <button key={n} onClick={() => setRpe(n)} className="tap" style={{
                        flex: 1, height: 22, border: 0, borderRadius: 4,
                        background: n <= rpe ? 'var(--accent)' : 'var(--paper)',
                        cursor: 'pointer',
                        transition: 'background .1s ease',
                      }}/>
                    ))}
                  </div>
                  <div style={{ marginTop: 6, fontSize: 11, color: 'var(--muted)' }}>{rpe} de 10 · {rpe <= 4 ? 'fácil' : rpe <= 7 ? 'firme' : 'duro'}</div>
                </div>
              </div>

              {/* Note */}
              <div className="card-soft" style={{ marginBottom: 14 }}>
                <div className="label" style={{ marginBottom: 8 }}>nota</div>
                <textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="como tu se sentiu? pé, perna, cabeça…"
                  rows={2}
                  style={{
                    width: '100%', border: 0, background: 'transparent',
                    fontFamily: 'inherit', fontSize: 13, color: 'var(--ink)',
                    resize: 'none', outline: 'none',
                  }}
                />
              </div>
            </>
          )}

          {status === 'skip' && (
            <div className="card-soft" style={{ marginBottom: 14 }}>
              <div className="coach-hint" style={{ fontSize: 13 }}>
                tudo bem. amanhã tem mais. anota o porquê pra ver padrões depois.
              </div>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="motivo?"
                rows={2}
                style={{
                  marginTop: 10,
                  width: '100%', border: 0, background: 'var(--paper)', borderRadius: 12,
                  fontFamily: 'inherit', fontSize: 13, color: 'var(--ink)',
                  resize: 'none', outline: 'none', padding: 12,
                }}
              />
            </div>
          )}
        </div>

        <button onClick={save} className="tap" style={{
          width: '100%', background: 'var(--accent)', color: '#fff', border: 0,
          borderRadius: 9999, padding: '16px 24px', fontWeight: 700, fontSize: 15,
          cursor: 'pointer', boxShadow: 'var(--shadow-pop)', marginTop: 6,
        }}>
          salvar treino
        </button>
      </div>
    </>
  );
};

const inputBig = {
  border: 0, background: 'transparent', outline: 'none',
  fontFamily: 'Fraunces, serif', fontSize: 32, fontWeight: 500,
  width: 50, color: 'var(--ink)',
  textAlign: 'center', letterSpacing: '-0.02em',
};

/* ────────── Login ────────── */
const ScreenLogin = ({ onLogin }) => {
  const [email, setEmail] = React.useState('');
  return (
    <div className="canvas" style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      padding: '60px 28px 36px', justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 9999,
            background: 'var(--ink)', color: 'var(--paper)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 14,
            fontStyle: 'italic',
          }}>L</div>
          <div className="label">luci · meia 26</div>
        </div>
        <div className="label">v · 1.0</div>
      </div>

      <div>
        <div style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 12 }}>bom dia,</div>
        <h1 className="serif" style={{ fontSize: 56, fontWeight: 500, lineHeight: .94, margin: 0, letterSpacing: '-0.035em' }}>
          felipe.
        </h1>
        <p className="serif" style={{ fontSize: 18, fontStyle: 'italic', color: 'var(--ink-soft)', marginTop: 18, lineHeight: 1.35 }}>
          falta pouco pra <span style={{ color: 'var(--accent-deep)' }}>19 . jul</span>.<br/>entra com teu e-mail.
        </p>

        <div style={{ marginTop: 28 }}>
          <div className="label" style={{ marginBottom: 8 }}>e-mail</div>
          <div style={{
            background: 'var(--card)', borderRadius: 9999,
            padding: '6px 6px 6px 20px',
            display: 'flex', alignItems: 'center', gap: 8,
            boxShadow: 'var(--shadow-soft)',
          }}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="felipe@email.com"
              style={{
                flex: 1, border: 0, outline: 'none', background: 'transparent',
                fontFamily: 'inherit', fontSize: 15, padding: '12px 0',
                color: 'var(--ink)',
              }}
            />
            <button onClick={onLogin} className="tap" style={{
              background: 'var(--accent)', color: '#fff', border: 0,
              padding: '12px 22px', borderRadius: 9999,
              fontWeight: 700, fontSize: 14, cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(255,87,34,.32)',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              mandar link <Icon name="arrow" size={14} sw={2.4}/>
            </button>
          </div>
          <div style={{ marginTop: 12, fontSize: 11, color: 'var(--muted)', textAlign: 'center' }}>
            sem senha. magic link no e-mail.
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <div className="label" style={{ marginBottom: 8 }}>contagem</div>
        <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 6 }}>
          <span className="serif tab-num" style={{ fontSize: 38, fontWeight: 500, lineHeight: 1, letterSpacing: '-0.03em' }}>53</span>
          <span className="serif" style={{ fontSize: 16, fontStyle: 'italic', color: 'var(--accent-deep)' }}>dias até a prova.</span>
        </div>
      </div>
    </div>
  );
};

/* ────────── Bottom Nav ────────── */
const BottomNav = ({ active, onChange, onFab }) => {
  const items = [
    { id: 'hoje', icon: 'home' },
    { id: 'plano', icon: 'calendar' },
    { id: 'fab', icon: 'plus' },
    { id: 'progresso', icon: 'chart' },
    { id: 'treinos', icon: 'menu' },
  ];
  return (
    <div className="bnav">
      {items.map(it => {
        if (it.id === 'fab') {
          return <button key={it.id} className="bnav-fab tap" onClick={onFab}>
            <Icon name="plus" size={22} sw={2.4}/>
          </button>;
        }
        return (
          <button key={it.id} className={`bnav-btn tap ${active === it.id ? 'active' : ''}`} onClick={() => onChange(it.id)}>
            <Icon name={it.icon} size={20} sw={active === it.id ? 2.1 : 1.8}/>
          </button>
        );
      })}
    </div>
  );
};

Object.assign(window, { LogModal, ScreenLogin, BottomNav });
