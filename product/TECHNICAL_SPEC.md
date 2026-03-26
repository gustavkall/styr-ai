# styr-ai — Teknisk Produktspec
*Version 1.0 · 2026-03-26*

---

## Produkt i ett mening

En MCP-server som ger Claude persistent minne — strukturerat, semantiskt sökbart, multi-tenant — utan att kunden behöver förstå arkitekturen.

---

## Arkitektur

```
┌─────────────────────────────────────────────────────┐
│                    KUND                             │
│  Claude Desktop / Claude.ai                         │
│  ↕ MCP-protokoll                                    │
├─────────────────────────────────────────────────────┤
│                  MCP-SERVER                         │
│  Vercel (Node.js serverless)                        │
│  Verktyg: read_memory · write_session ·             │
│           log_decision · search_memory ·            │
│           log_learning · get_status                 │
├──────────────────┬──────────────────────────────────┤
│   PostgreSQL     │         pgvector                 │
│   (Supabase)     │         (Supabase)               │
│                  │                                  │
│   sessions       │   embeddings per session,        │
│   decisions      │   beslut och learning —          │
│   learnings      │   semantisk sökning              │
│   projects       │                                  │
│   api_keys       │                                  │
└──────────────────┴──────────────────────────────────┘
```

### Komponenter

| Komponent | Teknologi | Ansvar |
|-----------|-----------|--------|
| MCP-server | Vercel Node.js | Levererar verktyg till Claude |
| Strukturerat minne | Supabase PostgreSQL | Sessions, beslut, learnings |
| Semantiskt minne | Supabase pgvector | Konceptuell sökning |
| Auth | API-nyckel (Bearer) | En nyckel per projekt |
| Embeddings | OpenAI text-embedding-3-small | Vektorgenerering vid write |

---

## Datamodell

```sql
-- Ett projekt per kund (eller per kunds projekt)
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_email TEXT NOT NULL,
  api_key TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  plan TEXT DEFAULT 'starter',      -- starter | pro | enterprise
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sessionshandoffs — episodiskt minne
CREATE TABLE sessions (
  id BIGSERIAL PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  session_date DATE NOT NULL,
  summary TEXT,
  changes JSONB DEFAULT '[]',
  decisions JSONB DEFAULT '[]',
  next_steps JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  system_version TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Beslut med livscykel — episodiskt + procedurellt minne
CREATE TABLE decisions (
  id BIGSERIAL PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  decision_date DATE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,   -- architecture | strategy | design | bug | feature
  context TEXT,
  decision TEXT NOT NULL,
  reasoning TEXT,
  outcome TEXT,
  status TEXT DEFAULT 'ACTIVE',  -- ACTIVE | CLOSED | SUPERSEDED
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lärdomar och mönster — semantiskt minne
CREATE TABLE learnings (
  id BIGSERIAL PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  category TEXT NOT NULL,   -- pattern | mistake | insight | calibration
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  source TEXT,              -- session | experiment | user-feedback
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vektorembeddings för semantisk sökning
CREATE TABLE embeddings (
  id BIGSERIAL PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  source_type TEXT NOT NULL,   -- session | decision | learning
  source_id BIGINT NOT NULL,
  content TEXT NOT NULL,       -- texten som är embeddad
  embedding vector(1536),      -- OpenAI text-embedding-3-small
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX ON embeddings USING ivfflat (embedding vector_cosine_ops);
```

---

## MCP-verktyg (Claude-API)

### `read_memory`
Hämtar senaste session + aktiva beslut + senaste learnings. Kallas vid session boot.
```json
Input:  { "limit_decisions": 10, "limit_learnings": 20 }
Output: { lastSession, activeDecisions, recentLearnings, projectStatus }
```

### `write_session`
Skriv sessionens handoff vid avslut. Skapar embedding automatiskt.
```json
Input:  { "summary", "changes": [], "decisions": [], "next_steps": [], "metadata": {} }
Output: { session_id, ok }
```

### `log_decision`
Loggar ett beslut med kontext och motivering.
```json
Input:  { "title", "category", "context", "decision", "reasoning", "tags": [] }
Output: { decision_id, ok }
```

### `log_learning`
Loggar en insikt eller ett mönster.
```json
Input:  { "category", "title", "content", "tags": [], "source" }
Output: { learning_id, ok }
```

### `search_memory`
Semantisk sökning i all historisk kontext via pgvector.
```json
Input:  { "query": "riskhantering positionsstorlek", "limit": 5 }
Output: { results: [{ type, title, content, similarity, date }] }
```

### `get_status`
Översikt av projektets minnesstatus.
```json
Input:  {}
Output: { total_sessions, total_decisions, active_decisions, total_learnings, last_session_date }
```

---

## API-routes (Vercel)

```
POST /api/mcp          — MCP-protokoll endpoint (alla verktygsanrop)
GET  /api/status       — Publik hälsostatus
POST /api/projects     — Skapa nytt projekt (intern admin)
GET  /api/projects/:id — Projektöversikt (autentiserad)
```

Autentisering: `Authorization: Bearer <api_key>` på alla anrop utom `/api/status`.

---

## Fas 1 — Kärnprodukt (3–5 dagar kod)

**Mål:** Första kunden kan installera och använda.

### Uppgifter
- [ ] Supabase: kör `setup.sql` med ny datamodell (projects + api_keys)
- [ ] MCP-server: implementera 6 verktyg i `/api/mcp`
- [ ] Embedding-pipeline: OpenAI API vid varje write
- [ ] pgvector: aktivera extension i Supabase, skapa index
- [ ] CLAUDE.md-template: kunden kopierar denna, byter ut API-nyckel
- [ ] Deploy på Vercel: `styr-ai.vercel.app/api/mcp`
- [ ] Manuell provisioning: Gustav skapar projekt + API-nyckel för kund #1

### Krav på Gustav
- Aktivera pgvector-extension i Supabase (en klickning i dashboard)
- Lägga till `OPENAI_API_KEY` i Vercel env vars
- Skicka API-nyckel till kund #1 manuellt

### Leveranskriterie
Kund #1 kör `read_memory` i Claude → får tillbaka tom men fungerande state → skriver första session → nästa dag läser Claude tillbaka sessionen korrekt.

---

## Fas 2 — Sajt och självbetjäning (2–3 dagar)

**Mål:** Kund kan komma igång utan Gustav.

### Uppgifter
- [ ] Landningssida: vad det är, hur det fungerar, ett kodblock
- [ ] Waitlist/signup-formulär: email → Gustav provisionar manuellt
- [ ] Setup-guide: steg-för-steg, max 10 min från noll till fungerande
- [ ] Dashboard (read-only): senaste session, aktiva beslut, learnings
- [ ] Dokumentation: alla 6 MCP-verktyg med exempel

### Krav på Gustav
- Godkänna copy på landningssidan
- Domän: styr.ai eller styr-ai.com — registrera och peka på Vercel

---

## Fas 3 — Skalbarhet (1–2 veckor, efter 3–5 kunder)

**Mål:** Gustav behöver inte vara involverad i onboarding.

### Uppgifter
- [ ] Självbetjäning: signup → API-nyckel direkt, ingen manuell provisioning
- [ ] Stripe-integration: $X/mån per projekt, automatisk fakturering
- [ ] Användningsgränser per plan (antal sessioner/mån, antal projekt)
- [ ] E-post vid provisioning: skicka API-nyckel automatiskt
- [ ] Admin-dashboard: Gustav ser alla kunder, användning, revenue

### Krav på Gustav
- Stripe-konto skapat och kopplat
- Prissättningsbeslut (se nedan)

---

## Fas 4 — Distribution (parallellt med Fas 3)

**Mål:** Inkommande trafik utan aktiv försäljning.

### Uppgifter
- [ ] Ansökan till Anthropics MCP-register (officiell katalog)
- [ ] npm-paket: `npx styr-ai init` — en rad, API-nyckel in, CLAUDE.md genererad
- [ ] GitHub Action: auto-handoff vid push (valfritt för kund)
- [ ] Integrationsguider: Claude Code, Claude Desktop, Cursor

---

## Prissättning (förslag)

| Plan | Pris | Inkluderar |
|------|------|------------|
| Starter | $29/mån | 1 projekt, 100 sessioner/mån, semantisk sökning |
| Pro | $79/mån | 5 projekt, obegränsade sessioner, prioritetssupport |
| Enterprise | $299/mån | Obegränsat, SLA, dedikerad instans |

Kostnadsstruktur per kund Starter:
- Supabase: ~$0 (gratisnivå täcker långt)
- Vercel: ~$0 (serverless, låg volym)
- OpenAI embeddings: ~$0.02/mån (text-embedding-3-small är extremt billigt)
- **Total COGS: <$1/mån per Starter-kund**

---

## Värdeutvecklande tillägg — Fas 2+

### 1. Memory Analytics
Visualisera minneskvalitet över tid: precision, freshness, täckning per projekt. Gustav fick rätt i whitepapers analys — precision är lika viktigt som täckning. Sälja detta som insikt till kunden.

### 2. Team Memory
Flera Claude-instanser delar samma minneslager. Senior dev och junior dev på samma projekt = samma kontext. Kraftfullt för byråer och dev-team.

### 3. Memory Diff
Vid session boot: visa vad som förändrats sedan förra sessionen. Inte bara "vad minns jag" utan "vad är nytt". Minskar hallucination på inaktuell data.

### 4. Webhook-integration
POST till kundens endpoint när en ny session skrivs. Triggar t.ex. Slack-notis, Notion-update, Jira-ticket.

### 5. Konfliktdetektering
Om ett nytt beslut motsäger ett aktivt beslut — flagga det. Förhindrar att Claude agerar på inkonsistent state.

### 6. Auto-arkivering (TTL)
Beslut och learnings får en `expires_at`. Gammalt minne arkiveras automatiskt. Löser precisionsproblemen i whitepapers Sektion 4.1.

### 7. Memory Import
Konvertera befintliga CLAUDE.md-filer, markdown-noter, Notion-docs till strukturerat minne. Sänker friktion för kunder med existerande system.

---

## Externa API:er att integrera

| API | Värde | Fas |
|-----|-------|-----|
| OpenAI Embeddings (text-embedding-3-small) | Semantisk sökning — kärnan | Fas 1 |
| Anthropic API | Sammanfatta långa sessioner automatiskt vid write | Fas 2 |
| Stripe | Fakturering, plan-hantering | Fas 3 |
| Resend / Postmark | Transaktionsmejl (API-nyckel, välkommen, faktura) | Fas 2 |
| GitHub API | Läs commits automatiskt till beslutlogg (opt-in för kund) | Fas 3 |
| Slack API | Notis när session skrivs, daglig minnesstatus | Fas 3 |
| Linear / Jira | Synka decisions som issues automatiskt | Fas 4 |
| Notion API | Importera/exportera minne till/från Notion | Fas 4 |

---

## CLAUDE.md-template (kunden installerar denna)

```markdown
# CLAUDE.md

## Persistent Memory — styr-ai

Detta projekt använder styr-ai för persistent minne.
API: https://styr-ai.vercel.app/api/mcp
Nyckel: [DIN-API-NYCKEL]

## Session Boot (kör automatiskt)
1. Anropa `read_memory` — få tillbaka senaste session, aktiva beslut, learnings
2. Presentera status kort för användaren
3. Fortsätt från där förra sessionen slutade

## Session Handoff (vid sessionslut)
1. Anropa `write_session` med summary, changes, decisions, next_steps
2. Logga viktiga beslut med `log_decision`
3. Logga insikter med `log_learning`
```

---

## Risker

| Risk | Sannolikhet | Åtgärd |
|------|-------------|--------|
| Anthropic ändrar MCP-spec | Medel | Följ officiell spec, versionera API |
| OpenAI embedding-kostnad skenar | Låg | Cache embeddings, batch-generera |
| Kund lagrar känslig data | Medel | ToS, kryptering at rest (Supabase default) |
| Konkurrent bygger samma | Hög | Timing och distribution är moaten — inte tekniken |

---

## Nästa steg (denna session)

1. Gustav aktiverar pgvector i Supabase
2. Gustav lägger till `OPENAI_API_KEY` i Vercel
3. Kör `setup.sql` med ny datamodell
4. Bygg MCP-server (`/api/mcp`) med 6 verktyg
5. Testa med kund #1
