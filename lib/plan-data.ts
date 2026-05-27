// Conteúdo do plano. Estático — calibrado pra Felipe.
// `workout_id` no DB usa o formato `w{week}-{day}-{index}`.

export type WorkoutType = 'rest' | 'swim' | 'run' | 'long' | 'strength' | 'race';

export type DayCode = 'SEG' | 'TER' | 'QUA' | 'QUI' | 'SEX' | 'SÁB' | 'DOM';

export const DAY_CODES: DayCode[] = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'];

export type PhaseColor = 'amber' | 'orange' | 'green' | 'red' | 'blue' | 'purple';

export type WorkoutItem = {
  type: WorkoutType;
  label: string;
  detail?: string;
  /** Frase curta de "bilhete do treinador" — voz, contexto, intenção. */
  hint?: string;
};

export type DayPlan = {
  d: DayCode;
  items: WorkoutItem[];
};

export type WeekPlan = {
  num: number;
  dates: string;
  phase: string;
  phaseColor: PhaseColor;
  title: string;
  runVol: number;
  swimVol: string;
  strength: string;
  /** Bilhete da semana inteira — aparece no topo do /plano e no /hoje em SEG. */
  note?: string;
  days: DayPlan[];
};

export const RACE_DATE = '2026-07-19';
export const RACE_LABEL = 'Meia maratona · Brasília';
export const PLAN_START = '2026-05-26'; // segunda da semana 1

export const RUN_ZONES = [
  { key: 'rec', label: 'Recovery', value: '5:40/km', fc: '<130', desc: 'Trote regenerativo' },
  { key: 'easy', label: 'Easy', value: '5:05–5:15/km', fc: '140–150', desc: 'Aeróbico fundamental — base do volume' },
  { key: 'mp', label: 'Maratona', value: '4:50/km', fc: '155–160', desc: 'Pace de maratona' },
  { key: 'hmp', label: 'HMP', value: '4:35–4:39/km', fc: '162–170', desc: 'Pace da prova — alvo principal', highlight: true },
  { key: 'lt', label: 'Limiar', value: '4:25–4:30/km', fc: '168–175', desc: 'Tempo run, threshold' },
  { key: '10k', label: '10K pace', value: '4:20–4:25/km', fc: '172–178', desc: 'Pace de 10K de prova' },
  { key: 'vo2', label: 'VO2max', value: '4:00–4:10/km', fc: '175–182', desc: 'Intervalos 400m–1km' },
] as const;

export const SWIM_ZONES = [
  { key: 'E1', label: 'Aeróbico leve · Recovery', pace: '2:12–2:17', desc: 'Aquec, desaq, drills, dia de cansaço' },
  { key: 'E2', label: 'Aeróbico base', pace: '2:04–2:10', desc: 'Volume — séries longas 400–800m, desc 20–30s' },
  { key: 'E3', label: 'Aeróbico forte', pace: '1:58–2:02', desc: 'Séries 300–500m c/ desc 25–30s — base de meia', highlight: true },
  { key: 'E4', label: 'Limiar · CSS Zone', pace: '1:50–1:56', desc: 'Séries 100–400m c/ desc 10–20s', highlight: true },
  { key: 'CSS', label: 'Critical Swim Speed', pace: '1:52', desc: 'Pace de prova contínua (1500m)', center: true },
  { key: 'R2', label: 'VO2max', pace: '1:45–1:48', desc: 'Séries 100m c/ desc longo (1:1)' },
  { key: 'R1', label: 'Lactato · Sprint', pace: '1:35–1:40', desc: 'Séries 25–75m all-out c/ desc completo' },
] as const;

export const WEEKS: WeekPlan[] = [
  {
    num: 1, dates: '26/mai – 01/jun', phase: 'Base', phaseColor: 'amber',
    title: 'Reentrada',
    runVol: 38, swimVol: '4.2 km', strength: 'A + B',
    note: 'Semana de reentrada. Sente o terreno. Se algo apertar, recua — temos 8 semanas.',
    days: [
      { d: 'SEG', items: [{ type: 'rest', label: 'Descanso' }] },
      { d: 'TER', items: [{ type: 'swim', label: 'Aeróbico 1.8k', detail: '400 aquec · 6×200m @ E4 (1:55) · desc 20s · 200 desaq' }] },
      { d: 'QUA', items: [{ type: 'run', label: 'Easy 8 km', detail: '5:05–5:15/km · FC ≤150', hint: 'Conversa fácil. Se não consegue, tá rápido demais.' }] },
      { d: 'QUI', items: [{ type: 'strength', label: 'Força A · Força & Potência' }] },
      { d: 'SEX', items: [{ type: 'run', label: 'Fartlek 8 km', detail: '2k aquec · 6×(1\' @ 4:25 + 2\' easy) · 2k desaq' }] },
      { d: 'SÁB', items: [
        { type: 'swim', label: 'Volume 2.0k', detail: '4×400m @ E2 (2:08) · desc 25s' },
        { type: 'strength', label: 'Força B · Endurance' },
      ] },
      { d: 'DOM', items: [{ type: 'long', label: 'Longão 16 km', detail: '13k @ 5:00–5:10 + 3k livre se sentir bem', hint: 'Primeiro longão. Não experimenta nada — gel, tênis, café tudo conhecido.' }] },
    ],
  },
  {
    num: 2, dates: '02 – 08/jun', phase: 'Base', phaseColor: 'amber',
    title: 'Introdução do limiar',
    runVol: 42, swimVol: '4.6 km', strength: 'A + B',
    days: [
      { d: 'SEG', items: [{ type: 'rest', label: 'Descanso' }] },
      { d: 'TER', items: [{ type: 'swim', label: 'CSS Threshold 2.4k', detail: '5×300m @ CSS (1:52) · desc 25s' }] },
      { d: 'QUA', items: [{ type: 'run', label: 'Tempo 9 km', detail: '2k aquec · 5k @ 4:28 · 2k desaq', hint: 'Primeiro tempo. Calibra pelo respirar — palavras curtas, não frases.' }] },
      { d: 'QUI', items: [{ type: 'strength', label: 'Força A' }] },
      { d: 'SEX', items: [{ type: 'run', label: 'Easy 8 km + 6 strides' }] },
      { d: 'SÁB', items: [
        { type: 'swim', label: 'Volume 2.2k', detail: '3×500m @ E2-E3 (2:00) · desc 30s' },
        { type: 'strength', label: 'Força B' },
      ] },
      { d: 'DOM', items: [{ type: 'long', label: 'Longão 17 km', detail: '13k @ 5:00 + 4k @ 4:45' }] },
    ],
  },
  {
    num: 3, dates: '09 – 15/jun', phase: 'Build', phaseColor: 'orange',
    title: 'Construção',
    runVol: 46, swimVol: '5.0 km', strength: 'A + B',
    days: [
      { d: 'SEG', items: [{ type: 'rest', label: 'Descanso' }] },
      { d: 'TER', items: [{ type: 'swim', label: 'CSS Descendente 2.6k', detail: '1×400 + 2×300 + 4×200 + 4×100, cada bloco mais rápido' }] },
      { d: 'QUA', items: [{ type: 'run', label: 'Tempo fracionado 10 km', detail: '2k aquec · 2×3k @ 4:28 · rec 2\' · 2k desaq' }] },
      { d: 'QUI', items: [{ type: 'strength', label: 'Força A' }] },
      { d: 'SEX', items: [{ type: 'run', label: 'Easy 10 km + 6 strides' }] },
      { d: 'SÁB', items: [
        { type: 'swim', label: 'Longão 2.4k', detail: '1000m @ E3 (2:00) + 800m @ E2 (2:07)' },
        { type: 'strength', label: 'Força B' },
      ] },
      { d: 'DOM', items: [{ type: 'long', label: 'Longão progressivo 18 km', detail: '12k @ 5:00 + 6k @ 4:40 (HMP)', hint: 'Os 6 últimos no pace de prova. Anda ensinando o corpo o ritmo.' }] },
    ],
  },
  {
    num: 4, dates: '16 – 22/jun', phase: 'Deload', phaseColor: 'green',
    title: 'Descarga',
    runVol: 36, swimVol: '3.6 km', strength: 'A + B leve',
    note: 'Deload. Volume cai 25%, intensidade segura. Não tente compensar.',
    days: [
      { d: 'SEG', items: [{ type: 'rest', label: 'Descanso' }] },
      { d: 'TER', items: [{ type: 'swim', label: 'CSS curto 2.0k', detail: '8×100m @ CSS (1:52) · desc 20s' }] },
      { d: 'QUA', items: [{ type: 'run', label: 'Fartlek 8 km', detail: '2k aquec · 5×(1\' @ 4:20 + 1\' easy) · 2k desaq' }] },
      { d: 'QUI', items: [{ type: 'strength', label: 'Força A (volume −30%)' }] },
      { d: 'SEX', items: [{ type: 'run', label: 'Easy 8 km' }] },
      { d: 'SÁB', items: [
        { type: 'swim', label: 'Técnica 1.6k', detail: '10×50m drills + 4×200m @ E2 (2:07)' },
        { type: 'strength', label: 'Força B leve' },
      ] },
      { d: 'DOM', items: [{ type: 'long', label: 'Longão conforto 14 km', detail: '14k @ 5:05–5:15 (sem block)' }] },
    ],
  },
  {
    num: 5, dates: '23 – 29/jun', phase: 'Pico', phaseColor: 'red',
    title: 'Pico 1',
    runVol: 50, swimVol: '4.8 km', strength: 'A + B',
    days: [
      { d: 'SEG', items: [{ type: 'rest', label: 'Descanso' }] },
      { d: 'TER', items: [{ type: 'swim', label: 'Broken 1500 · 2.6k', detail: '3×500m @ CSS−3 (1:49) · desc 30s + 6×50m @ R2 (1:48)' }] },
      { d: 'QUA', items: [{ type: 'run', label: 'Tempo 11 km', detail: '2k aquec · 6k @ 4:30 · 3k desaq' }] },
      { d: 'QUI', items: [{ type: 'strength', label: 'Força A' }] },
      { d: 'SEX', items: [{ type: 'run', label: 'Easy 10 km + 6 strides' }] },
      { d: 'SÁB', items: [
        { type: 'swim', label: 'Longão progressivo 2.2k', detail: '600m E2 (2:07) + 600m E3 (2:00) + 400m E3-T (1:55)' },
        { type: 'strength', label: 'Força B' },
      ] },
      { d: 'DOM', items: [{ type: 'long', label: 'Longão com HMP 19 km', detail: '12k @ 5:05 + 7k @ 4:38 (HMP) · treino-chave', hint: 'Ensaio geral parcial. Toma café/gel como na prova.' }] },
    ],
  },
  {
    num: 6, dates: '30/jun – 06/jul', phase: 'Pico', phaseColor: 'red',
    title: 'Pico 2 · maior carga',
    runVol: 52, swimVol: '5.0 km', strength: 'A + B última pesada',
    note: 'Semana mais pesada do ciclo. Dorme cedo, come bem. Força B no sábado é a ÚLTIMA pesada.',
    days: [
      { d: 'SEG', items: [{ type: 'rest', label: 'Descanso' }] },
      { d: 'TER', items: [{ type: 'swim', label: 'CSS longo 2.8k', detail: '6×300m @ CSS (1:52) · desc 25s + 4×50m @ R1 (1:38)' }] },
      { d: 'QUA', items: [{ type: 'run', label: 'Intervalos VO2 11 km', detail: '2k aquec · 5×1000m @ 4:08 · rec 2\'30 · 2k desaq' }] },
      { d: 'QUI', items: [
        { type: 'swim', label: 'Volume 2.2k (antecipado)', detail: '2×800m @ E3 (2:00) · desc 45s · mudou de SÁB pra QUI pra dar descanso pré-longão' },
        { type: 'strength', label: 'Força A' },
      ] },
      { d: 'SEX', items: [{ type: 'run', label: 'Easy 10 km' }] },
      { d: 'SÁB', items: [{ type: 'strength', label: 'Força B · última pesada' }] },
      { d: 'DOM', items: [{ type: 'long', label: 'Longão simulação 20 km', detail: '5k easy + 12k @ 4:40 (HMP) + 3k cool · TREINO MAIS IMPORTANTE DO CICLO', hint: 'É a prova. Roupa, tênis, gel, café, horário — tudo como dia 19/07.' }] },
    ],
  },
  {
    num: 7, dates: '07 – 13/jul', phase: 'Polimento', phaseColor: 'blue',
    title: 'Polimento',
    runVol: 40, swimVol: '2.4 km', strength: 'só ativação',
    note: 'Volume cai. Intensidade fica. Você vai sentir as pernas estranhas — é o taper.',
    days: [
      { d: 'SEG', items: [{ type: 'rest', label: 'Descanso' }] },
      { d: 'TER', items: [{ type: 'swim', label: 'CSS curto 1.4k', detail: '5×100m @ CSS (1:52) + 4×50m @ R2 (1:48)' }] },
      { d: 'QUA', items: [{ type: 'run', label: 'Tune-up 10 km', detail: '2k aquec · 5k @ 4:35 (HMP) · 3k desaq' }] },
      { d: 'QUI', items: [{ type: 'swim', label: 'Easy técnica 1.0k', detail: 'Crawl easy + drills' }] },
      { d: 'SEX', items: [{ type: 'run', label: 'Easy 8 km + 4 strides' }] },
      { d: 'SÁB', items: [{ type: 'strength', label: 'Mobilidade · ativação leve' }] },
      { d: 'DOM', items: [{ type: 'long', label: 'Longão curto 15 km', detail: '10k @ 5:00 + 5k @ 4:40 (HMP)' }] },
    ],
  },
  {
    num: 8, dates: '14 – 19/jul', phase: 'Taper · prova', phaseColor: 'purple',
    title: 'Taper + Meia Maratona',
    runVol: 24, swimVol: '0.8 km', strength: '—',
    note: 'Semana da prova. Trabalho já está feito. Foco: dormir, comer, hidratar, não inventar.',
    days: [
      { d: 'SEG', items: [{ type: 'rest', label: 'Descanso' }] },
      { d: 'TER', items: [{ type: 'run', label: 'Easy 7 km + 4 strides leves' }] },
      { d: 'QUA', items: [{ type: 'swim', label: 'Pré-prova 0.8k', detail: 'Crawl muito easy · sem esforço' }] },
      { d: 'QUI', items: [{ type: 'run', label: 'Ativação 6 km', detail: '5k easy + 3×400m @ 4:30 · rec 200m trote' }] },
      { d: 'SEX', items: [{ type: 'rest', label: 'Véspera · caminhada 20min + check kit', hint: 'Hoje é véspera. Separa kit, dorme cedo, NADA novo.' }] },
      { d: 'SÁB', items: [{ type: 'race', label: 'MEIA MARATONA 21,1 km', detail: 'Pace alvo 4:35–4:39/km · ver aba Prova' }] },
      { d: 'DOM', items: [{ type: 'rest', label: 'Recuperação · caminhada ou natação 1k easy' }] },
    ],
  },
];

export const STRENGTH_SESSIONS = {
  A: {
    title: 'Sessão A · Força & Potência',
    subtitle: 'Cargas pesadas · 8 reps · RIR 2 · 40-50min',
    when: 'Quintas (semanas 1-7)',
    exercises: [
      { name: 'Goblet squat', sets: '4×8', equip: 'Haltere/KB 12-20kg', why: 'Quadríceps, glúteo e core simultaneamente.' },
      { name: 'Terra romeno unilateral', sets: '3×8/perna', equip: '1 haltere pesado', why: 'Glúteo + isquiotibial + estabilidade — reproduz fase de propulsão da corrida.' },
      { name: 'Búlgaro split squat', sets: '3×8/perna', equip: '2 halteres + step', why: 'Padrão unilateral pesado — corrige assimetrias.' },
      { name: 'Panturrilha em pé', sets: '3×15', equip: '1 haltere + step', why: 'Gastrocnêmio — 60% da propulsão da passada.' },
      { name: 'Pallof press', sets: '3×10/lado', equip: 'Banda elástica', why: 'Core anti-rotação — protege economia no km 18+.' },
      { name: 'Prancha lateral com elevação', sets: '3×30s/lado', equip: 'Tapete', why: 'Glúteo médio + oblíquos.' },
    ],
  },
  B: {
    title: 'Sessão B · Resistência & Estabilidade',
    subtitle: 'Cargas leves · 12-20 reps · 35-45min',
    when: 'Sábados (semanas 1-5). Pula na semana 6 (longão de 20km).',
    exercises: [
      { name: 'Hip thrust', sets: '3×12', equip: 'Haltere ou banda', why: 'Foco isolado em glúteo máximo — #1 pra economia.' },
      { name: 'Step-up alto', sets: '3×10/perna', equip: '2 halteres + step 40cm', why: 'Reproduz mecânica de propulsão em padrão controlado.' },
      { name: 'Deadlift unilateral com banda', sets: '3×10/perna', equip: 'Banda elástica', why: 'Endurance da cadeia posterior.' },
      { name: 'Dead bug com banda', sets: '3×10/lado', equip: 'Banda', why: 'Core anti-extensão — protege lombar.' },
      { name: 'Panturrilha sentado (sóleo)', sets: '3×20', equip: 'Haltere nos joelhos', why: 'Sóleo é o motor da corrida longa.' },
      { name: 'Tibial anterior com banda', sets: '3×15', equip: 'Banda', why: 'Protege contra shin splints.' },
      { name: 'Prancha frontal', sets: '3×45s', equip: 'Tapete', why: 'Manutenção postural na prova.' },
    ],
  },
} as const;

export type NutriDayKey = 'chave' | 'moderado' | 'descanso';

export const NUTRI_DIAS: Record<NutriDayKey, {
  label: string;
  kcal: string;
  color: 'red' | 'amber' | 'emerald';
  desc: string;
  regra: string;
  meals: { time: string; name: string; items: string }[];
}> = {
  chave: {
    label: 'Treino-chave',
    kcal: '3000-3200',
    color: 'red',
    desc: 'Longão (dom), tempo (qua), VO2 (sem 6)',
    regra: 'Performar > emagrecer · come no manutenção',
    meals: [
      { time: '05h30', name: 'Pré-treino', items: 'Café 200ml + banana + 2 fatias pão GF com mel + aveia GF 30g se longão >90min' },
      { time: 'Durante', name: 'Em treino', items: 'Água 500ml/h + sal · se >75min: 1 gel sem lactose/glúten a cada 35-40min' },
      { time: '08h30', name: 'Pós-treino', items: 'Vitamina: banana + 30g whey isolado SL + 200ml água + pasta amendoim + canela' },
      { time: '12h30', name: 'Almoço', items: 'Carne magra 180g + arroz 6 col + feijão 4 col + salada + beterraba/batata-doce 100g + fruta' },
      { time: '15h30', name: 'Lanche', items: 'Iogurte SL 200g + granola GF 30g + frutas vermelhas' },
      { time: '20h00', name: 'Jantar', items: 'Peixe/frango 150g + mandioca/batata-doce 4 col + legumes assados + azeite' },
      { time: '21h30', name: 'Ceia (opc)', items: 'Whey isolado 25g + 1 col pasta amendoim · ou 1 ovo + pão GF' },
    ],
  },
  moderado: {
    label: 'Treino moderado',
    kcal: '2600-2800',
    color: 'amber',
    desc: 'Easy run, natação CSS, força',
    regra: 'Déficit pequeno (~300 kcal)',
    meals: [
      { time: '06h30', name: 'Café', items: 'Tapioca 3 col + 2 ovos mexidos + queijo SL + café + mamão/banana' },
      { time: '10h00', name: 'Lanche', items: 'Castanhas 20g + maçã/pera' },
      { time: '12h30', name: 'Almoço', items: 'Carne magra 180g + arroz 4 col + feijão 3 col + salada + legumes' },
      { time: '15h30', name: 'Lanche', items: 'Iogurte SL 170g + 1 col pasta amendoim' },
      { time: '20h00', name: 'Jantar', items: 'Peixe/frango 150g + carbo controlado 3 col + legumes assados 50% prato' },
    ],
  },
  descanso: {
    label: 'Descanso / leve',
    kcal: '2300-2500',
    color: 'emerald',
    desc: 'Segunda, sábado leve',
    regra: 'Déficit maior (500 kcal)',
    meals: [
      { time: '07h00', name: 'Café', items: '3 ovos mexidos + 1/2 abacate + café preto + frutas vermelhas' },
      { time: '10h00', name: 'Lanche (opc)', items: 'Café com canela · só se com fome real' },
      { time: '12h30', name: 'Almoço', items: 'Carne magra 200g + arroz 3 col OU mandioca 100g + feijão 2 col + salada e legumes 50%' },
      { time: '16h00', name: 'Lanche', items: 'Iogurte SL 170g + castanhas 15g' },
      { time: '20h00', name: 'Jantar', items: 'Salmão/frango/ovos 180g + legumes assados abundantes + salada com azeite + 1/2 batata-doce opc' },
    ],
  },
};

export const SUPLEMENTOS = [
  { id: 'whey', nome: 'Whey isolado SEM LACTOSE', dose: '30g pós-treino + 20g antes de dormir (opc)', priority: 'ESSENCIAL', why: 'Bater 165g proteína/dia em déficit é difícil só com comida. Lactose <0.1g em isolado.' },
  { id: 'creatina', nome: 'Creatina monohidratada', dose: '5g/dia · todo dia · qualquer horário', priority: 'ESSENCIAL', why: 'Mais estudado do mundo. +5% força, melhora recuperação. Pode reter 1-2kg água (intramuscular).' },
  { id: 'cafeina', nome: 'Cafeína', dose: '3-6mg/kg = 240-450mg · 30-60min antes treino-chave e prova', priority: 'ESSENCIAL', why: '+2-4% endurance. Nunca testa na prova algo não testado em treino.' },
  { id: 'beta', nome: 'Beta-alanina', dose: '3-5g/dia em 2 doses · começar agora', priority: 'RECOMENDADO', why: 'Efeito cumulativo (4-6 sem). Tampona acidose — melhora finais de prova.' },
  { id: 'vitd', nome: 'Vitamina D3 + K2', dose: '2000-4000 UI D3 + 100mcg K2 com gordura', priority: 'RECOMENDADO', why: 'D baixo é comum em brasileiros que usam filtro solar. Afeta performance e imunidade.' },
  { id: 'eletro', nome: 'Eletrólitos / Sal Lite', dose: '1 cápsula a cada 45min em treinos longos com calor', priority: 'TREINO LONGO', why: 'Brasília seca = perda alta de sódio. Câimbra km 17 é sódio, não água.' },
] as const;

export const PROVA_PACING = [
  { range: 'km 1–5', pace: '4:40–4:42/km', desc: 'Segura. Vai parecer fácil demais. Resista.', hr: '160–165' },
  { range: 'km 6–10', pace: '4:36–4:38/km', desc: 'Cruzeiro. Gel km 7. Hidrata em cada posto.', hr: '165–170' },
  { range: 'km 11–15', pace: '4:34–4:36/km', desc: 'Mantém. Foco cadência ≥175 e respiração 2:2.', hr: '168–173' },
  { range: 'km 16–19', pace: '4:32–4:35/km', desc: 'Aperta foco. Sustenta, não acelera. Gel km 14.', hr: '173–178' },
  { range: 'km 20–21,1', pace: '≤4:30/km', desc: 'Tudo. Sub-1h37 se autorizar.', hr: '178+' },
];

export const PROVA_DIA_ANTES = [
  { hora: 'Manhã', item: 'Café normal · banana · tapioca com ovo · iogurte SL' },
  { hora: 'Almoço', item: 'Arroz 6-7 col + frango 150g + legumes leves (evita brócolis/couve) + beterraba 100g opc' },
  { hora: '15h', item: 'Lanche: pão GF com mel + banana' },
  { hora: 'Jantar 19h', item: 'Macarrão GF ou arroz 6 col + frango 120g + abobrinha · 500ml suco beterraba (se testou)' },
  { hora: 'Dormir', item: '500ml água c/ pitada sal · NADA novo · sem álcool · sem condimento forte' },
];

export const PROVA_DIA = [
  { hora: '3h antes', item: 'Café 200ml + 2 fatias pão GF c/ mel + banana · água 500ml c/ sal' },
  { hora: '1h antes', item: 'Café + cafeína 200mg cápsula + 1 gel SE testou em treino' },
  { hora: '30min antes', item: 'Sips de água · banheiro último · sem comer mais nada' },
  { hora: 'km 7', item: 'Gel + água no posto' },
  { hora: 'km 12-14', item: 'Gel + água · sal lite cápsula se calor' },
  { hora: 'km 17', item: 'Gel opcional ou só água/Gatorade' },
  { hora: 'Pós-prova', item: 'Vitamina: banana + whey + água + mel em 30min · comemora' },
];
