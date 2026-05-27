// Luci · primitive UI components
// (load before screens)

/* ────────────────────────────────────────────────────────── */
/* Icons — simple, line, hand-feeling                         */
/* ────────────────────────────────────────────────────────── */
const Icon = ({ name, size = 20, stroke = 'currentColor', fill = 'none', sw = 1.8 }) => {
  const paths = {
    home: <><path d="M3 11.2L12 4l9 7.2" /><path d="M5 10v9h14v-9" /></>,
    calendar: <><rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M8 3v4M16 3v4M3.5 10h17"/><circle cx="12" cy="14.5" r="1.4" fill={stroke} stroke="none"/></>,
    chart: <><path d="M4 19V5"/><path d="M4 19h16"/><path d="M7 15l3-4 3 3 5-7"/></>,
    target: <><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1.2" fill={stroke} stroke="none"/></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h10"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    check: <><path d="M5 12.5l4.5 4.5L19 7.5"/></>,
    x: <><path d="M6 6l12 12M18 6L6 18"/></>,
    run: <><circle cx="14" cy="4.5" r="1.5" fill={stroke} stroke="none"/><path d="M7 21l3-5 2-3 3 2 1 5"/><path d="M16 11l3 2-1 3"/><path d="M10 13l-3-1-2 3"/></>,
    swim: <><path d="M3 14c2-1.5 3.5-1.5 5.5 0s3.5 1.5 5.5 0 3.5-1.5 5.5 0"/><path d="M3 19c2-1.5 3.5-1.5 5.5 0s3.5 1.5 5.5 0 3.5-1.5 5.5 0"/><circle cx="17" cy="5" r="1.7" fill={stroke} stroke="none"/><path d="M7 11l3-2 4 2"/></>,
    strength: <><path d="M2 12h2"/><path d="M20 12h2"/><rect x="4" y="9" width="3" height="6" rx="1"/><rect x="17" y="9" width="3" height="6" rx="1"/><rect x="7" y="10.5" width="10" height="3" rx="1"/></>,
    fork: <><path d="M8 3v8a3 3 0 003 3v7"/><path d="M5 3v6"/><path d="M16 3c-2 0-3 1.8-3 4v4h3v8"/></>,
    bell: <><path d="M6 8a6 6 0 0112 0v5l2 3H4l2-3V8z"/><path d="M10 19a2 2 0 004 0"/></>,
    flame: <><path d="M12 3c1 4 5 5 5 9a5 5 0 11-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3 0-6 1-8z"/></>,
    moon: <><path d="M20 13.5A8 8 0 1110.5 4a6.5 6.5 0 009.5 9.5z"/></>,
    bolt: <><path d="M13 3L5 14h6l-1 7 8-11h-6l1-7z"/></>,
    scale: <><path d="M4 7h16l-1.5 11H5.5L4 7z"/><circle cx="12" cy="4.5" r="1.5"/><path d="M12 6v1"/></>,
    chevron: <><path d="M9 6l6 6-6 6"/></>,
    chevronDown: <><path d="M6 9l6 6 6-6"/></>,
    pin: <><path d="M12 22s7-7 7-12a7 7 0 10-14 0c0 5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></>,
    user: <><circle cx="12" cy="8" r="3.5"/><path d="M5 20c0-4 3-6 7-6s7 2 7 6"/></>,
    timer: <><circle cx="12" cy="13" r="7.5"/><path d="M12 13V9M9 3h6"/></>,
    heart: <><path d="M12 20s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 10c0 5.5-7 10-7 10z"/></>,
    sparkle: <><path d="M12 4l1.5 4.5L18 10l-4.5 1.5L12 16l-1.5-4.5L6 10l4.5-1.5L12 4z"/></>,
    droplet: <><path d="M12 3.5C8 9 5.5 11.5 5.5 14.5a6.5 6.5 0 0013 0c0-3-2.5-5.5-6.5-11z"/></>,
    pause: <><rect x="6" y="5" width="4" height="14" rx="1.2"/><rect x="14" y="5" width="4" height="14" rx="1.2"/></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    edit: <><path d="M4 20l4-1 11-11-3-3L5 16l-1 4z"/></>,
    quote: <><path d="M7 8h3v6c0 1.5-1 3-3 3" fill={stroke}/><path d="M14 8h3v6c0 1.5-1 3-3 3" fill={stroke}/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {paths[name] || null}
    </svg>
  );
};

/* ────────────────────────────────────────────────────────── */
/* Pill                                                       */
/* ────────────────────────────────────────────────────────── */
const Pill = ({ variant = 'primary', size = 'sm', children, onClick, style = {}, ...rest }) => {
  const cls = `pill pill-${variant} ${size === 'lg' ? 'pill-lg' : size === 'xl' ? 'pill-xl' : ''}`;
  return <button className={cls} onClick={onClick} style={style} {...rest}>{children}</button>;
};

/* ────────────────────────────────────────────────────────── */
/* HalfGauge — semicircle progress                            */
/* ────────────────────────────────────────────────────────── */
const HalfGauge = ({ value = 68, max = 100, size = 200, label, sublabel, topLabel }) => {
  const pct = Math.max(0, Math.min(1, value / max));
  const r = 80;
  const cx = 100, cy = 95;
  const circumference = Math.PI * r; // half circle
  const dash = circumference;
  const offset = circumference * (1 - pct);

  // Animate on mount
  const [animPct, setAnimPct] = React.useState(0);
  React.useEffect(() => {
    const t = setTimeout(() => setAnimPct(pct), 80);
    return () => clearTimeout(t);
  }, [pct]);
  const animOffset = circumference * (1 - animPct);

  return (
    <div className="gauge-wrap" style={{ width: size }}>
      <svg viewBox="0 0 200 110" width={size} height={size * 0.55}>
        <defs>
          <linearGradient id="gauge-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FF8A50" />
            <stop offset="100%" stopColor="#D8401A" />
          </linearGradient>
        </defs>
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          stroke="#ECE5D5" strokeWidth="16" fill="none" strokeLinecap="round"
        />
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          stroke="url(#gauge-grad)" strokeWidth="16" fill="none" strokeLinecap="round"
          strokeDasharray={dash}
          strokeDashoffset={animOffset}
          style={{ transition: 'stroke-dashoffset 1.1s cubic-bezier(.2,.7,.2,1)' }}
        />
        {/* end cap dot */}
        <circle
          cx={cx + Math.cos(Math.PI - Math.PI * animPct) * r}
          cy={cy - Math.sin(Math.PI - Math.PI * animPct) * r}
          r="6" fill="#fff" stroke="#D8401A" strokeWidth="2"
          style={{ transition: 'cx 1.1s cubic-bezier(.2,.7,.2,1), cy 1.1s cubic-bezier(.2,.7,.2,1)' }}
        />
      </svg>
      <div style={{ marginTop: -10, textAlign: 'center' }}>
        {topLabel && <div className="label" style={{ marginBottom: 4 }}>{topLabel}</div>}
        <div className="serif tab-num" style={{ fontSize: 32, fontWeight: 500, lineHeight: 1, letterSpacing: '-0.02em' }}>{label}</div>
        {sublabel && <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>{sublabel}</div>}
      </div>
    </div>
  );
};

/* ────────────────────────────────────────────────────────── */
/* DayDots — week as circles                                  */
/* ────────────────────────────────────────────────────────── */
const DAY_CODES = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];
const DAY_LABEL = ['seg', 'ter', 'qua', 'qui', 'sex', 'sáb', 'dom'];

const DayDots = ({ days, showLabel = false, justify = 'space-between' }) => (
  <div style={{ display: 'flex', justifyContent: justify, gap: 4, width: '100%' }}>
    {days.map((d, i) => (
      <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <div className={`day-dot day-dot--${d.state} ${d.pop ? 'day-dot-pop' : ''}`}>
          {d.state === 'past-done' && <Icon name="check" size={14} sw={2.6}/>}
          {d.state === 'past-skip' && <Icon name="x" size={12} sw={2.6}/>}
          {d.state === 'today' && (d.num || (i+1))}
          {d.state === 'future' && (d.num || (i+1))}
          {d.state === 'rest' && <span style={{ fontSize: 10 }}>·</span>}
        </div>
        {showLabel && <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '.05em' }}>{d.label}</div>}
      </div>
    ))}
  </div>
);

/* ────────────────────────────────────────────────────────── */
/* StatCard                                                   */
/* ────────────────────────────────────────────────────────── */
const StatCard = ({ icon, label, value, sub, accent, onClick }) => (
  <button
    onClick={onClick}
    className="tap"
    style={{
      background: 'var(--card)', border: 0, textAlign: 'left',
      borderRadius: 'var(--r-md)', padding: 16, boxShadow: 'var(--shadow-soft)',
      display: 'flex', flexDirection: 'column', gap: 10, cursor: 'pointer',
    }}
  >
    <div style={{
      width: 32, height: 32, borderRadius: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: accent || 'var(--accent-soft)',
      color: accent ? '#fff' : 'var(--accent-deep)',
    }}>
      {icon}
    </div>
    <div>
      <div className="label" style={{ marginBottom: 6 }}>{label}</div>
      <div className="serif tab-num" style={{ fontSize: 26, fontWeight: 500, lineHeight: 1, color: 'var(--ink)' }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>{sub}</div>}
    </div>
  </button>
);

/* ────────────────────────────────────────────────────────── */
/* PillTabs — segmented with animated bg                       */
/* ────────────────────────────────────────────────────────── */
const PillTabs = ({ tabs, active, onChange }) => {
  const ref = React.useRef(null);
  const [bg, setBg] = React.useState({ left: 4, width: 0 });

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const buttons = el.querySelectorAll('.pill-tab');
    const activeBtn = buttons[active];
    if (activeBtn) {
      setBg({
        left: activeBtn.offsetLeft,
        width: activeBtn.offsetWidth,
      });
    }
  }, [active, tabs.length]);

  return (
    <div ref={ref} className="pill-tabs">
      <div className="pill-tab-bg" style={{ left: bg.left, width: bg.width }} />
      {tabs.map((t, i) => (
        <button
          key={i}
          className={`pill-tab ${i === active ? 'active' : ''}`}
          onClick={() => onChange(i)}
        >
          {t}
        </button>
      ))}
    </div>
  );
};

/* ────────────────────────────────────────────────────────── */
/* PhaseBadge                                                 */
/* ────────────────────────────────────────────────────────── */
const PHASES = {
  base:    { color: 'var(--phase-base)',   label: 'Base' },
  build:   { color: 'var(--phase-build)',  label: 'Build' },
  deload:  { color: 'var(--phase-deload)', label: 'Deload' },
  peak:    { color: 'var(--phase-peak)',   label: 'Peak' },
  polish:  { color: 'var(--phase-polish)', label: 'Polish' },
  taper:   { color: 'var(--phase-taper)',  label: 'Taper' },
};
const PhaseBadge = ({ week, phase }) => {
  const p = PHASES[phase] || PHASES.build;
  return (
    <span className="phase-pill">
      <span className="dot" style={{ background: p.color }} />
      Semana {week} · {p.label}
    </span>
  );
};

/* ────────────────────────────────────────────────────────── */
/* HeroQuestion                                               */
/* ────────────────────────────────────────────────────────── */
const HeroQuestion = ({ greeting, headline }) => (
  <div>
    <div style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
      {greeting}
    </div>
    <h1 className="serif" style={{ fontSize: 32, fontWeight: 500, lineHeight: 1.02, margin: 0, color: 'var(--ink)', textWrap: 'pretty', letterSpacing: '-0.025em' }}>
      {headline}
    </h1>
  </div>
);

/* ────────────────────────────────────────────────────────── */
/* CoachHint                                                  */
/* ────────────────────────────────────────────────────────── */
const CoachHint = ({ children }) => (
  <div className="coach-hint">
    {children}
  </div>
);

/* ────────────────────────────────────────────────────────── */
/* Workout type icon (in circle)                              */
/* ────────────────────────────────────────────────────────── */
const WorkoutIcon = ({ type, size = 44 }) => {
  const map = {
    long:   { icon: 'run',     bg: '#FFE5D6', fg: '#D8401A' },
    easy:   { icon: 'run',     bg: '#DDE8DA', fg: '#4F8F58' },
    quality:{ icon: 'bolt',    bg: '#F4E9C7', fg: '#8A6A1B' },
    swim:   { icon: 'swim',    bg: '#D8E5F2', fg: '#1F4FB8' },
    strength:{ icon: 'strength', bg: '#E3DAEF', fg: '#5B3FA8' },
    rest:   { icon: 'moon',    bg: '#ECE5D5', fg: '#8C857A' },
    race:   { icon: 'target',  bg: '#1B1815', fg: '#FFE5D6' },
    nutrition:{ icon: 'fork', bg: '#FFE5D6', fg: '#D8401A' },
  };
  const m = map[type] || map.easy;
  return (
    <div className="wt-icon" style={{ width: size, height: size, background: m.bg, color: m.fg }}>
      <Icon name={m.icon} size={size * 0.5} sw={1.8}/>
    </div>
  );
};

/* expose */
Object.assign(window, {
  Icon, Pill, HalfGauge, DayDots, StatCard, PillTabs, PhaseBadge,
  HeroQuestion, CoachHint, WorkoutIcon, DAY_CODES, DAY_LABEL, PHASES,
});
