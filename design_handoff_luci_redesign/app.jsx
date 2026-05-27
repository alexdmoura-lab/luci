// Luci · main app — mounts whole tree including iOS device frame + Tweaks

const TWEAK_DEFAULS = /*EDITMODE-BEGIN*/{
  "accent": ["#FF5722", "#D8401A", "#FFE5D6"],
  "paper": ["#F3EEE4", "#FAF6EE", "#E7DFD0"],
  "texture": true,
  "headlineFont": "Fraunces",
  "casing": "lowercase"
}/*EDITMODE-END*/;

const ACCENT_PALETTES = [
  { id: 'orange',   colors: ['#FF5722', '#D8401A', '#FFE5D6'], name: 'fogo'   },
  { id: 'brick',    colors: ['#C53C28', '#8E2615', '#F5DAD2'], name: 'tijolo' },
  { id: 'forest',   colors: ['#3F8B5A', '#266340', '#D6E6DA'], name: 'mata'   },
  { id: 'cobalto',  colors: ['#2A5FCC', '#1A3F8E', '#D3DEEF'], name: 'cobalto'},
];

const PAPER_PALETTES = [
  { id: 'cream', colors: ['#F3EEE4', '#FAF6EE', '#E7DFD0'], name: 'creme'   },
  { id: 'sand',  colors: ['#EDE4D2', '#F6EFDC', '#D9CEB7'], name: 'areia'   },
  { id: 'mist',  colors: ['#ECEAE3', '#F5F3EC', '#D6D2C7'], name: 'névoa'   },
];

const Stage = () => {
  const [scale, setScale] = React.useState(1);
  React.useEffect(() => {
    const compute = () => {
      const vw = window.innerWidth - 24;
      const vh = window.innerHeight - 24;
      const sx = vw / 402;
      const sy = vh / 874;
      setScale(Math.min(1.05, Math.min(sx, sy)));
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);

  const [t, setTweak] = useTweaks(TWEAK_DEFAULS);

  // Apply tweaks to :root CSS variables
  React.useEffect(() => {
    const r = document.documentElement;
    if (t.accent && t.accent.length >= 3) {
      r.style.setProperty('--accent', t.accent[0]);
      r.style.setProperty('--accent-deep', t.accent[1]);
      r.style.setProperty('--accent-soft', t.accent[2]);
      r.style.setProperty('--accent-tint', t.accent[2] + 'aa');
    }
    if (t.paper && t.paper.length >= 3) {
      r.style.setProperty('--paper', t.paper[0]);
      r.style.setProperty('--paper-soft', t.paper[1]);
      r.style.setProperty('--line', t.paper[2]);
    }
    // Texture toggle
    document.body.dataset.texture = t.texture ? 'on' : 'off';
  }, [t.accent, t.paper, t.texture]);

  return (
    <>
      <style>{`
        body[data-texture="off"] .canvas { background-image: none !important; }
        body[data-texture="off"] .sheet  { background-image: none !important; }
        .serif { font-family: '${t.headlineFont}', 'Fraunces', Georgia, serif !important; }
        body[data-casing="cap"] .serif { text-transform: none; }
      `}</style>

      <div style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}>
        <IOSDevice>
          <div style={{ position: 'absolute', inset: 0, background: 'var(--paper)' }}>
            <App casing={t.casing}/>
          </div>
        </IOSDevice>
      </div>

      <TweaksPanel title="tweaks · luci">
        <TweakSection label="paleta">
          <TweakColor
            label="acento"
            value={t.accent}
            options={ACCENT_PALETTES.map(p => p.colors)}
            onChange={v => setTweak('accent', v)}
          />
          <TweakColor
            label="papel"
            value={t.paper}
            options={PAPER_PALETTES.map(p => p.colors)}
            onChange={v => setTweak('paper', v)}
          />
          <TweakToggle
            label="textura"
            value={t.texture}
            onChange={v => setTweak('texture', v)}
          />
        </TweakSection>
        <TweakSection label="tipografia">
          <TweakSelect
            label="serif headline"
            value={t.headlineFont}
            options={['Fraunces', 'Instrument Serif', 'Playfair Display', 'Cormorant Garamond', 'EB Garamond']}
            onChange={v => setTweak('headlineFont', v)}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
};

const App = ({ casing }) => {
  const [active, setActive] = React.useState(() => {
    try { return localStorage.getItem('luci_active') || 'hoje'; } catch { return 'hoje'; }
  });
  const [logged, setLogged] = React.useState(() => {
    try { return localStorage.getItem('luci_logged') === '1'; } catch { return false; }
  });
  const [showLog, setShowLog] = React.useState(false);

  const [supplements, setSupplements] = React.useState(() => {
    try {
      const s = localStorage.getItem('luci_supps');
      return s ? JSON.parse(s) : [true, true, false, false, false, false];
    } catch { return [true, true, false, false, false, false]; }
  });
  React.useEffect(() => {
    try { localStorage.setItem('luci_supps', JSON.stringify(supplements)); } catch {}
  }, [supplements]);

  React.useEffect(() => {
    try { localStorage.setItem('luci_active', active); } catch {}
  }, [active]);

  const openLog = () => setShowLog(true);
  const closeLog = () => setShowLog(false);
  const completeLog = () => { setShowLog(false); };

  const handleLogin = () => {
    setLogged(true);
    try { localStorage.setItem('luci_logged', '1'); } catch {}
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: 'var(--paper)' }}>
      {!logged ? (
        <ScreenLogin onLogin={handleLogin}/>
      ) : (
        <>
          {active === 'hoje' && (
            <ScreenHoje
              onOpenLog={openLog}
              onNavigate={setActive}
              supplementsState={supplements}
              setSupplementsState={setSupplements}
            />
          )}
          {active === 'plano' && <ScreenPlano onOpenLog={openLog}/>}
          {active === 'progresso' && <ScreenProgresso/>}
          {active === 'treinos' && <ScreenTreinos/>}
          {active === 'prova' && <ScreenProva/>}

          <BottomNav active={active} onChange={setActive} onFab={openLog}/>

          {showLog && <LogModal onClose={closeLog} onComplete={completeLog}/>}
        </>
      )}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('device-host')).render(<Stage/>);
