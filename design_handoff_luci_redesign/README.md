# Handoff: Luci · Redesign Visual (Metamorph-inspired)

## Visão geral

Redesign visual completo do app **Luci** — plano de treino integrado (corrida + natação + força + nutrição) para meia maratona de Brasília (19/07/2026). O objetivo é trocar a "roupa" do app por uma estética que faça o Felipe ter vontade de abrir antes do treino. Toda a lógica existente (Supabase, server actions, persistência) permanece intacta — **a missão é puramente visual + microcopy**.

## Sobre os arquivos deste pacote

Os arquivos `.html` / `.jsx` / `.css` neste bundle são **referências de design** criadas em HTML — protótipos mostrando aparência e comportamento, não código de produção pra copiar direto.

A tarefa do Claude Code é **recriar estes designs no codebase existente do Luci** (Next.js 16 + Tailwind v4 + Supabase + React Server Components), usando os padrões já estabelecidos:
- Tokens via `@theme` no `app/globals.css`
- Componentes em `components/ui/`
- Server actions intocados
- Schemas Supabase intocados
- Conteúdo de `lib/plan-data.ts` intocado (semanas, zonas, hints)

**Fidelidade: alta (hi-fi)** — mockups pixel-quase-perfect com cores finais, tipografia, spacing e interações. Recrie usando os componentes/libs do codebase, não plante HTML direto.

---

## Filosofia (não negociável)

1. **Não parecer feito por IA** — sem gradientes roxo/azul genéricos, sem glassmorphism, sem ícones genéricos do Heroicons. Cada tela parece desenhada por mão humana com opinião.
2. **Mobile-first** — Felipe usa no iPhone como PWA. Decisões começam em 375px. Touch targets ≥44px. Bottom nav é sagrada.
3. **Função vence enfeite** — fricção dói. Marcar treino feito tem que ser 1 toque + 1 confirmação.

---

## Design Tokens

Adicionar em `app/globals.css` dentro de `@theme`:

```css
@theme {
  /* Papel — bases quentes */
  --color-paper:        #F3EEE4;  /* background principal */
  --color-paper-soft:   #FAF6EE;  /* card secundário, hover */
  --color-card:         #FFFFFF;  /* card primário */
  --color-ink:          #1B1815;  /* texto principal, card-destaque */
  --color-ink-soft:     #3D3935;  /* texto secundário */
  --color-muted:        #8C857A;  /* texto terciário, labels */
  --color-line:         #E7DFD0;  /* divisores */

  /* Acento — laranja-assinatura */
  --color-accent:       #FF5722;
  --color-accent-deep:  #D8401A;  /* hover, texto sobre soft */
  --color-accent-soft:  #FFE5D6;  /* fundo de selo */
  --color-accent-tint:  #FFF1E8;  /* fundo de ícone neutro */

  /* Estados */
  --color-done:         #4F8F58;
  --color-done-soft:    #DDE8DA;
  --color-warn:         #C99B2A;
  --color-warn-soft:    #F4E9C7;

  /* Fases do plano */
  --color-phase-base:   #B98700;
  --color-phase-build:  #D8401A;
  --color-phase-deload: #4F8F58;
  --color-phase-peak:   #A8261C;
  --color-phase-polish: #1F4FB8;
  --color-phase-taper:  #5B3FA8;
}
```

### Radius

| Token         | Valor | Uso                              |
|---------------|-------|----------------------------------|
| `rounded-sm`  | 14px  | Pills pequenos                    |
| `rounded-md`  | 18px  | Cards pequenos                    |
| `rounded-lg`  | 24px  | Cards principais (hero)           |
| `rounded-xl`  | 32px  | Modais bottom-sheet               |
| `rounded-full`| 9999  | Pills, day dots, FAB, gauges      |

### Sombras

```css
/* Cards normais */
shadow-soft: 0 1px 2px rgba(27,24,21,.04), 0 8px 24px rgba(27,24,21,.05);

/* Cards elevados (gauge, CTA flutuante) */
shadow-up:   0 2px 4px rgba(27,24,21,.06), 0 16px 36px rgba(27,24,21,.08);

/* CTA primário laranja */
shadow-pop:  0 6px 14px rgba(216,64,26,.28), 0 18px 40px rgba(216,64,26,.22);
```

**Regra**: card usa **shadow + sem border** OU **border bem sutil**, nunca os dois.

### Textura de fundo (a "feel" cream)

No body:
```css
body {
  background-color: var(--color-paper);
  background-image: radial-gradient(
    circle at center, rgba(27,24,21,.07) 1px, transparent 1.2px
  );
  background-size: 14px 14px;
}
```

---

## Tipografia

**Fontes (Google Fonts)**:
- **Fraunces** com axes `opsz,wght,SOFT` — headlines, perguntas, números grandes
- **Inter** — body, nav, labels, métricas pequenas
- **JetBrains Mono** (opcional) — labels uppercase técnicos

```html
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT@0,9..144,400..700,0..100;1,9..144,400..700,0..100&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

### Escala

| Token           | Tailwind / CSS                                                                  | Uso                                          |
|-----------------|----------------------------------------------------------------------------------|----------------------------------------------|
| `headline-xl`   | `font-serif text-[32px] sm:text-5xl font-medium tracking-[-0.025em] leading-[1.02]` | Pergunta principal da home                  |
| `headline-lg`   | `font-serif text-2xl sm:text-3xl font-medium tracking-[-0.02em]`                | Título de seção                              |
| `number-xl`     | `font-serif text-6xl font-medium tabular-nums tracking-[-0.04em] leading-none`  | Countdown, hero metric                       |
| `number-md`     | `font-serif text-2xl font-medium tabular-nums`                                  | Métrica de card                              |
| `body`          | `text-sm sm:text-base text-ink-soft leading-relaxed`                            | Texto corrido                                |
| `label`         | `text-[10px] font-bold uppercase tracking-[0.18em] text-muted`                  | Label minúsculo                              |
| `coach-hint`    | `font-serif italic text-sm text-ink-soft border-l-2 border-accent pl-2.5`       | Hint do treinador                            |

**Lowercase intencional** em headlines (`quarta-feira.`, `o teu manual.`) — opção via Tweaks pra alternar entre lowercase e capitalized.

---

## Componentes-base (criar em `components/ui/`)

### `<Pill>` — botão / badge 100% rounded
**Props**: `variant` (`primary` | `ink` | `ghost` | `soft` | `paper` | `done` | `warn`), `size` (`sm` | `lg` | `xl`)

| Variant   | bg                  | color               |
|-----------|---------------------|---------------------|
| primary   | accent              | white               |
| ink       | ink                 | white               |
| ghost     | transparent         | muted               |
| soft      | accent-soft         | accent-deep         |
| paper     | paper-soft + border line | ink-soft       |
| done      | done-soft           | done                |
| warn      | warn-soft           | #8A6A1B             |

Tamanhos: sm `13px / 8x14`, lg `15px / 14x22`, xl `16px / 18x28`. `:active` scale .97.

### `<HalfGauge>` — semicírculo de progresso
SVG semicírculo, raio 80, gradiente de #FF8A50 → #D8401A. Track cinza claro (#ECE5D5). Animação de preenchimento ao montar (1.1s cubic-bezier(.2,.7,.2,1)). Bolinha de "cap" branca seguindo o fim do arco.

**Props**: `value`, `max`, `size`, `label` (centro grande), `topLabel`, `sublabel`.

### `<DayDots>` — 7 dias da semana em bolinhas
36×36px cada. Estados:
- `past-done`: bg accent-soft, text accent-deep, ícone check
- `past-skip`: bg #ECE6DA, text muted, ícone X
- `today`: bg accent, white, shadow accent-glow, **scale 1.08**
- `future`: bg transparent, border dashed muted, text muted
- `rest`: bg paper-soft, border line, text muted

Layout: `flex justify-between` com label abaixo (`seg`, `ter`, …).

### `<StatCard>` — métrica 2-up
Card branco, padding 16, gap 10. Top: ícone circular (32px, bg accent-soft + accent-deep, ou cor sólida). Label minúsculo. Valor grande em serif tabular-nums. Sub em muted 11px.

### `<PillTabs>` — segmented com bg animado
Container: bg #ECE5D5, padding 4, rounded-full, flex. Tabs: flex-1, padding 11x16, font 13/600. Active bg desliza com `cubic-bezier(.4,.6,.2,1.2)` em 350ms. Active text white.

Uso: `tabs={['corrida', 'natação', 'força', 'nutrição']}`, `active`, `onChange`.

### `<PhaseBadge>` — semana N + fase
Pill paper-soft com border line, padding 6x12. Bolinha 8×8 cor da fase + texto uppercase tracking 0.12em.

### `<HeroQuestion>` — saudação + headline
Greeting em 14px muted + h1 serif 32px medium leading-[1.02] tracking-[-0.025em]. **Cor de destaque** em frase usando span accent-deep + italic.

### `<CoachHint>` — hint do treinador
`font-serif italic text-sm text-ink-soft`, `border-l-2 border-accent`, `pl-2.5`, `leading-snug`.

### `<WorkoutIcon>` — ícone de tipo em círculo
Mapeamento (type → bg/fg):
- `long`: #FFE5D6 / #D8401A — corrida
- `easy`: #DDE8DA / #4F8F58 — corrida easy
- `quality`: #F4E9C7 / #8A6A1B — bolt
- `swim`: #D8E5F2 / #1F4FB8 — natação
- `strength`: #E3DAEF / #5B3FA8 — força
- `rest`: #ECE5D5 / #8C857A — lua
- `race`: #1B1815 / #FFE5D6 — alvo
- `nutrition`: #FFE5D6 / #D8401A — garfo

Diâmetro padrão 44px.

### `<BottomNav>` — pill flutuante com FAB central
Posição: absolute, left/right 14, bottom 22. bg `rgba(255,255,255,.92)` + backdrop-blur-md. Rounded-full. Sombra grande.

5 slots: home, calendar, **FAB (54×54, accent, +)**, chart, menu.

Itens normais: 44×44, ícone 20. Active: cor ink + bolinha 4×4 accent abaixo.

---

## Telas (9 no total)

### 1. `/login`
- Background paper + textura
- Top-left: logo "L" preto (28px círculo) + label "luci · meia 26"
- Headline serif gigante (56px): **"felipe."**
- Sub serif italic 18px: "falta pouco pra 19 . jul. entra com teu e-mail."
- Input pill (rounded-full) com botão accent inline (mandar link →)
- Rodapé central: countdown "53 dias até a prova."

### 2. `/hoje` (a tela mais importante)

**Estrutura vertical (com scroll):**

1. **Header (38px row)**: logo + texto "luci / plano do felipe" à esquerda, 2 ícones (sino + perfil) à direita
2. **HeroQuestion**: "bom dia, felipe 👋" + h1 serif "quarta-feira. **onde mora** a adaptação." (palavras em accent-deep) + PhaseBadge "semana 3 · build"
3. **Card hero do treino** (rounded-3xl, padding 22, shadow-soft):
   - Top row: label "treino de hoje" + pill ink "🔥 3 dias seguidos"
   - WorkoutIcon (48) + título serif 18 + meta (km · tempo)
   - CoachHint com a frase do treinador
   - Sub-row inline: **adesão da semana** (4/6) à esquerda + **HalfGauge 140px** à direita
   - DayDots (7 dias) com label
   - Botão CTA `width:100% bg accent rounded-full padding 18 font-700 15px shadow-pop`: **"marcar feito →"**
4. **Grid 2×2 de StatCards**: peso de hoje, sono, energia (dots), fc repouso
5. **Card suplementos** (paper-soft): label "do dia / suplementos" + contagem + 6 bolinhas tap-to-toggle (whey, creat, café, vit d, ômega, mag)
6. **Amanhã preview**: card paper-soft com ícone tipo + título + chevron, navega pra /plano
7. **Countdown rodapé**: label "meia maratona · 19 jul" + serif 48px "53 dias. *tá perto.*"

**Microcopy rotativa** (por tipo de treino):
- long: "hoje é o dia mais importante da semana."
- quality (run): "quarta. onde mora a adaptação."
- swim: "sente a água, não força."
- strength: "RIR 2. última rep deve sobrar uma."
- rest: "descanso é treino. sem culpa."
- race: "é hoje. confia no que treinou."

### 3. `/plano` — 8 semanas

1. Header: label "o plano" + h1 "oito semanas. *uma prova.*"
2. **Timeline de 8 bolinhas** (uma por semana), com linha fina conectando. Cores por fase. Estados: done (cheia), current (cheia + maior + glow), future (outline dashed). Tap pra trocar de semana.
3. **Card da semana selecionada**: PhaseBadge da fase + "semana 03" serif grande + range de datas + **adesão %** à direita em accent-deep serif
4. Mini-bar de dias da semana (7 colunas, altura = % feito) + labels SEG/TER/...
5. Bloco "nota da semana — ..." em paper-soft
6. **Lista de WorkoutCards** (um por dia):
   - WorkoutIcon + label "seg · 25" + título serif + pill "hoje" se aplicável
   - Ícone edit (top-right)
   - CoachHint (recuado, com aspas elegantes)
   - Rodapé: métrica em muted + pill de estado (`feito` verde, `marcar feito` accent, `planejado` paper, `descanso` paper)
   - **Today card**: border 2px accent + shadow-up

### 4. `/progresso`

1. Header: label "progresso" + h1 "os números *contam.*"
2. PillTabs: 8 semanas / 4 semanas / ano
3. **3 cards hero** — cada um:
   - Label uppercase
   - Número hero em serif 44px tabular-nums
   - Mini-sparkline (SVG, curva quadrática suave, área gradient)
   - Sub com diff (↓ X em Y)
4. Variações: peso (curva accent), pace (curva ink), **adesão (card ink, fundo gradiente radial sutil accent, barras verticais embaixo)**
5. Seção "últimos treinos" — lista de cards horizontais com WorkoutIcon + label data + título serif + métricas à direita

### 5. `/prova`

1. Header: label "a prova" + h1 "meia maratona *de brasília.*"
2. **Hero countdown card** — bg `#1a0d0a` com gradiente radial accent sutil, padding 26:
   - Top row: label "contagem" / data 19 jul 6h00 (italic muted) + pill accent "📍 brasília"
   - **53 dias.** — serif 96px + label "7 semanas e 4 dias"
   - Bottom row 3-col: distância 21,1km / alvo 1h36 / PB 1h38 (todos serif 22 + label uppercase)
3. Seção "estratégia de pace" + label "por trecho"
4. **4 cards de pace** — cada um:
   - Pill quadrado lateral 54×54 (tag + pace serif 16)
   - Título "km 1—5" serif 17 + CoachHint
   - **Último card (km 17—21) em accent sólido** (destaque "fecha")
5. **Card ink "regras inegociáveis"** — lista numerada 01-05 com texto branco
6. **Mantra final** centralizado: `"é hoje. confia no que treinou." — 19 . jul . 2026`

### 6. `/treinos` (combinando corrida/natação/força/nutrição)

PillTabs no topo entre as 4 áreas. Cada aba:

**Corrida**:
- Card hero "pace alvo · meia maratona" com **4:38/km** em serif 56
- CoachHint
- Lista de **zonas Z1-Z5**: pill cor da zona + nome serif + FC muted + pace accent-deep serif

**Natação**:
- **Card ink** centralizado "critical swim speed" com **1:52** em serif 72
- Lista de "conjuntos por intenção" (técnico, aeróbico, limiar, vo₂) — cards paper-soft com WorkoutIcon swim + descrição + pill pace
- CoachHint roxo no rodapé

**Força**:
- PillTabs sub: sessão a / sessão b
- Lista de exercícios — cada card:
  - Label "exercício 01" + nome serif 18
  - Sets em serif accent-deep + pill RIR
  - CoachHint
- Card "regra de ouro" no rodapé

**Nutrição**:
- PillTabs sub: hoje / macros / dia de prova
- **Hoje**: lista de refeições com barra lateral colorida (fase-color) + hora serif + nome label + items
- **Macros**: cards de macro com nome + valor serif + barra horizontal animada
- **Dia de prova**: card ink "nada de novo." com 4 momentos (3h antes, 1h antes, na corrida, chegou)

---

## Interações & Animações

Use **framer-motion** (já instalado).

| Ação                  | Animação                                                                              |
|-----------------------|---------------------------------------------------------------------------------------|
| HalfGauge mount        | Preenche stroke 1.1s `cubic-bezier(.2,.7,.2,1)`                                       |
| DayDot vira "feito"    | `scale: [1, 1.18, 1.08]` em 350ms                                                     |
| PillTabs troca         | Bg laranja desliza com `cubic-bezier(.4,.6,.2,1.2)` 350ms                             |
| Card hover (desktop)   | `translateY(-2px)` + sombra aumenta                                                   |
| Marcar feito           | Card pulsa `scale: [1, 1.015, 1]` 400ms                                                |
| Check drawing          | `stroke-dasharray: 24, stroke-dashoffset: 24 → 0` em 450ms                            |
| Bottom sheet open      | `translateY(100% → 0)` `cubic-bezier(.2,.7,.2,1.05)` 350ms + backdrop fade-in 250ms   |
| Macro bar fill         | width transition 800ms ease                                                            |

**NÃO usar**: parallax, glassmorphism agressivo, blur exagerado, gradientes radiais multicolor, partículas, animação de loading lenta.

---

## Bottom Sheet — Log Modal

Quando usuário tappa "marcar feito":

1. Backdrop `rgba(27,24,21,.42)` fade-in
2. Sheet sobe de baixo, bg paper + textura, rounded-top 28px, handle 40×4 #C7BFAE
3. Header: label "treino de hoje" + h2 serif "como foi?" + botão X
4. Seção status: 3 pills (feito / parcial / pulei), active = bg color + white
5. Card pace: 2 inputs serif gigantes (mm:ss) + pill zone à direita
6. Grid 2-col: FC bpm input serif + RPE (10 barras tap-to-set, label "X de 10 · fácil/firme/duro")
7. Textarea "nota — como tu se sentiu?"
8. CTA "salvar treino" accent rounded-full shadow-pop

**Estado de sucesso**: substitui conteúdo por círculo verde 84px com check drawing + h2 "feito." + sub italic "quarta consecutiva. tá voando." → auto-close em 1200ms

---

## Voz brasileira (Microcopy)

Voz quente, direta, brasileira. Substituir genéricos por personalidade:

| Genérico                  | Vira                                                |
|---------------------------|-----------------------------------------------------|
| "Treinos de hoje"         | "hoje é {tipo}."                                    |
| "Marcar como feito"       | "marcar feito"                                      |
| "Bem-vindo"               | "bom dia, felipe 👋"                                |
| "Registrar treino"        | "como foi?"                                         |
| "Sem treino"              | "descanso. sério, descansa."                        |
| "Faltam 41 dias"          | "41 dias. tá perto."                                |
| "Estado vazio progresso"  | "marca o primeiro e os gráficos aparecem."          |

**Tudo em lowercase** nas headlines (decisão estética). Use ortografia brasileira (você → tu pra Felipe; "treinar" → "treino"; etc).

**Mantém intacto** os hints e notes de `lib/plan-data.ts` — eles têm voz forte e são parte do charme.

---

## Estrutura de arquivos a editar (Next.js)

```
app/
├── globals.css                  ← Tokens @theme + textura body
├── login/
│   ├── page.tsx                 ← redesenhar
│   └── login-form.tsx           ← redesenhar
└── (app)/
    ├── layout.tsx               ← BottomNav pill flutuante
    ├── hoje/page.tsx            ← redesenhar (tela-chave)
    ├── plano/plan-client.tsx    ← redesenhar
    ├── progresso/page.tsx       ← redesenhar
    ├── corrida/page.tsx         ← redesenhar
    ├── natacao/page.tsx         ← redesenhar
    ├── forca/page.tsx           ← redesenhar
    ├── nutricao/nutri-client.tsx← redesenhar
    └── prova/page.tsx           ← redesenhar

components/
├── ui/                          ← CRIAR
│   ├── pill.tsx
│   ├── half-gauge.tsx
│   ├── day-dots.tsx
│   ├── stat-card.tsx
│   ├── pill-tabs.tsx
│   ├── phase-badge.tsx
│   ├── hero-question.tsx
│   ├── coach-hint.tsx
│   └── workout-icon.tsx
├── chrome/
│   ├── bottom-nav.tsx           ← redesenhar (pill flutuante + FAB)
│   ├── top-nav.tsx              ← redesenhar (mais discreta)
│   └── countdown.tsx            ← refinar
├── today/
│   ├── adherence-ring.tsx       ← MIGRAR pra HalfGauge
│   └── morning-checkin.tsx      ← redesenhar
├── plan/workout-card.tsx        ← redesenhar
└── tracking/log-modal.tsx       ← redesenhar (bottom sheet)
```

---

## O que NÃO mudar

- **Schemas Supabase** (`supabase/migrations/*`)
- **Server actions** (`actions/*`)
- **Queries** (`lib/queries.ts`)
- **Tipos** (`lib/types.ts`)
- **Lógica de auth** (`proxy.ts`, `lib/supabase/*`)
- **Helpers de data** (`lib/dates.ts`)
- **Conteúdo do plano** (`lib/plan-data.ts`) — hints, notes, regras, semanas, zonas, exercícios, refeições
- **Fluxo de marcar feito** (status + pace + FC + RPE + nota) — só o visual do modal muda

---

## Checklist final

- [ ] Tokens `@theme` aplicados em `globals.css`
- [ ] Textura de pontinhos no body
- [ ] Fraunces + Inter carregadas em `layout.tsx`
- [ ] 9 componentes em `components/ui/` criados
- [ ] Headlines serif lowercase em todas as telas-chave
- [ ] Laranja accent só em CTAs primários e seleções ativas
- [ ] Cards rounded-3xl com shadows suaves (não borders pesadas)
- [ ] BottomNav pill flutuante + FAB central
- [ ] Microinteração de marcar feito refinada (pulse + check draw)
- [ ] Voz brasileira aplicada em microcopy
- [ ] Mobile testado em 375px (DevTools)
- [ ] PWA standalone testado (manifest + safe-area)
- [ ] `npm run build` sem warnings
- [ ] `npm run lint` sem warnings

---

## Arquivos de referência

Veja os arquivos HTML / JSX neste bundle como **referência visual e comportamental**:

- `Luci.html` — entry point com iOS frame + Tweaks
- `styles.css` — todos os design tokens + utilitárias
- `design-system.jsx` — primitivos (Pill, HalfGauge, DayDots, StatCard, PillTabs, PhaseBadge, HeroQuestion, CoachHint, WorkoutIcon, Icon)
- `app.jsx` — wiring principal + tweaks
- `screens/hoje.jsx` — tela home (mais importante)
- `screens/plano.jsx` — 8 semanas + workout cards
- `screens/progresso.jsx` — sparklines + cards hero
- `screens/prova.jsx` — countdown + pacing
- `screens/treinos.jsx` — corrida/natação/força/nutrição (tabs)
- `screens/extras.jsx` — login + log modal + bottom nav

**Abra `Luci.html` num browser local** (precisa servir, não file://) pra navegar entre as telas e ver as interações.

---

## Branch sugerida

```
git checkout -b claude/redesign-metamorph
```

Commit em chunks lógicos:
1. Design system (tokens + textura + fontes)
2. Componentes primitivos (`components/ui/`)
3. Bottom nav + chrome
4. Tela `/hoje`
5. Tela `/plano` + WorkoutCard
6. Telas `/progresso`, `/prova`
7. Telas `/corrida`, `/natacao`, `/forca`, `/nutricao`
8. Log modal (bottom sheet)
9. Tela `/login`

Boa, dev. Confia.
