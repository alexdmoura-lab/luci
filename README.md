# Luci

App pessoal de treino do Felipe pra meia maratona de **19/07/2026**.
Plano integrado: corrida + natação + musculação + nutrição. Tracking persistido em Supabase.

## Stack

- Next.js 16 (App Router, React Server Components) + TypeScript
- Tailwind v4
- Supabase: Auth (magic link), Postgres + RLS
- Recharts (gráficos), Framer Motion (microinterações)
- PWA básico (manifest)

## Setup local

### 1. Supabase

1. Cria projeto em [supabase.com](https://supabase.com) (free tier serve).
2. Em `Authentication → Providers`, deixa só **Email** ativo. Em `URL Configuration`, adiciona `http://localhost:3000/auth/callback` na lista de URLs permitidas.
3. Em `SQL Editor`, roda o conteúdo de `supabase/migrations/0001_init.sql`.
4. Em `Authentication → Users`, convida o e-mail do Felipe (ou deixa ele entrar pela primeira vez via magic link — vai criar conta automaticamente).

### 2. Variáveis

Copia o exemplo e preenche:

```bash
cp .env.local.example .env.local
```

`NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` ficam em `Settings → API` do projeto Supabase.

### 3. Rodar

```bash
npm install
npm run dev
```

Abre [localhost:3000](http://localhost:3000). Vai redirecionar pra `/login`. Põe o e-mail, recebe o link, clica, tá dentro.

## Deploy

Vercel é zero-config:

```bash
npx vercel
```

Adiciona as 3 vars do `.env.local` no projeto Vercel. Depois põe o domínio de produção no `URL Configuration` do Supabase (lista de redirect URLs).

## Como instalar como app no iPhone

1. Abre o domínio no Safari.
2. Botão de compartilhar → **Adicionar à Tela de Início**.
3. Pronto — abre em standalone, com ícone próprio, sem barra do browser.

## Estrutura

```
app/
├── (app)/             → rotas autenticadas
│   ├── hoje/          → ★ home: treino de hoje + check-in
│   ├── plano/         → 8 semanas, marcar treinos
│   ├── progresso/     → adesão + peso + pace
│   ├── corrida/       → zonas de pace + estrutura
│   ├── natacao/       → CSS + zonas E1-R1
│   ├── forca/         → sessões A + B em casa
│   ├── nutricao/      → cardápios + suplementos checklist
│   └── prova/         → pacing, véspera, dia da prova
├── login/             → magic link
└── auth/callback/     → callback Supabase

components/            → today, plan, tracking, progress, chrome, ui
actions/               → server actions (log-workout, daily-log, override)
lib/                   → supabase clients, plan-data, dates, workout-id, format
supabase/migrations/   → SQL inicial
```

## Próximos passos (fora do MVP)

- UI pra mover/trocar treino (server action `override-workout` já existe)
- Notificações push (PWA + service worker)
- Sync com Strava/Garmin pra preencher pace automaticamente
- Coach view (compartilhar progresso com você)
