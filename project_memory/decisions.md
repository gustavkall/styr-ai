# styr-ai — Decision Log
*Cumulative log. Append-only.*

---

### 2026-03-24 — Goals layer definierad (VISION-001)
**Context:** styr-ai saknade ett explicit mål.
**Decision:** goals.md definierar systemets syfte som leverage-multiplikator.
**Why:** Utan tydligt mål optimeras systemet för fel saker.
**Impact:** Alla work items värderas mot goals.md.

### 2026-03-24 — Autonomigränser definierade (VISION-004)
**Context:** VISION-005 kräver tydliga ramar.
**Decision:** governance/system_rules.md — tre nivåer: autonomt, kräver godkännande, aldrig autonomt.
**Why:** Tydliga gränser är förutsättning för autonom exekvering.
**Impact:** VISION-005 kunde planeras och exekveras.

### 2026-03-26 — Warner-tvist hanteras personligen
**Context:** COO-agenten eskalerade Warner-deadline som systemuppgift.
**Decision:** Gustav hanterar personligen. Inte en systemuppgift.
**Why:** Juridiska förhandlingar kräver personlig bedömning.
**Impact:** COO ska inte eskalera WARNER-DEADLINE framöver.

### 2026-03-26 — styrAI-product arkitektur
**Context:** Behövde bestämma arkitektur för persistent memory-produkten.
**Decision:** MCP-server (Vercel) + Supabase PostgreSQL + pgvector + OpenAI embeddings.
**Why:** MCP är rätt leveransmekanism. Managed ger zero friktion. pgvector eliminerar separat vektordatabas.
**Impact:** Fas 1 byggd och live samma dag. COGS <$1/mån per kund.

### 2026-03-26 — Separata repos för meta-system och produkt
**Decision:** styrAI-product (nu: engrams) är separat repo från styr-ai.
**Impact:** Ren arkitektur. Vercel deployar engrams, inte styr-ai.

### 2026-03-28 — Produktnamn: Engrams
**Decision:** Engrams. Domän: engrams.app (180 kr/år).
**Why:** Engram = vetenskapligt begrepp för minnessspår i hjärnan. Exakt vad vi bygger digitalt.
**Impact:** Landningssida + waitlist + docs live samma dag.

### 2026-03-28 — Database-only arkitektur
**Decision:** Kunder behöver inget eget repo. Allt i Engrams Supabase, isolerat per API-nyckel.
**Why:** Noll onboarding-friktion. Kund betalar → nyckel → klistrar in → klar.
**Impact:** SQL-schema designat och kört. accounts/projects/memory_items live.

### 2026-03-28 — Fyra minnestyper (Engram-inspirerat)
**Decision:** profile (permanent/alltid), context (projekt/aktivt), learning (semantisk sökning), episode (session/alltid).
**Why:** Direkt parallell med hjärnans minnessystem — hippocampus, cortex, cerebellum, amygdala. Lazy loading per typ.
**Impact:** memory_items-tabell med pgvector 1536-dim live. Semantic search via ivfflat-index.

### 2026-03-28 — CC↔Claude.ai bidirektionellt sync
**Decision:** active_context.md (Claude.ai skriver) + cc_session_log.md (CC skriver). Alias `sync`.
**Impact:** Alla sessioner delar samma whiteboard. Ingen silos.

### 2026-03-28 — COMMANDS.md — central kommandoreferens
**Decision:** COMMANDS.md i styr-ai repo = enda källan för alla kommandon. Läses vid boot.
**Why:** Gustav ska aldrig behöva förklara ett kommando två gånger.
**Impact:** `session boot [projekt]`, `todo`, `sync` etc dokumenterade. Alla repos uppdaterade.

### 2026-03-28 — Supabase MCP kör SQL autonomt
**Decision:** Claude använder Supabase MCP direkt för migrations och queries — frågar inte Gustav.
**Why:** Eliminerar manuellt arbete. Gustav behöver inte öppna SQL Editor.
**Impact:** #1 SQL-schema kört autonomt. För CC: koppla via claude mcp add.

### 2026-03-28 — `session boot [projekt]` — projektspecifik boot
**Decision:** Boot kan ta ett projektnamn som argument för fokuserad session.
**Why:** Minskar brus vid projektspecifikt arbete. Gustav behöver inte filtrera all info.
**Impact:** COMMANDS.md uppdaterad med tabell över alla projekt + format.

### 2026-03-28 — Opt-out todo-modell
**Decision:** Claude föreslår tasks med `→ Todo-förslag: [beskr]. Lägger till om du inte invänder.`
**Why:** Ingen friktion. Gustav godkänner implicit. Listan kladdar inte till.
**Impact:** CLAUDE.md uppdaterad med triggrar för när tasks läggs till/uppdateras.

### 2026-03-28 — Engrams är Styr.AI:s produkt (tills vidare)
**Decision:** Engrams delar Styr.AI Supabase-projekt tills Gustav köper Supabase Pro.
**Why:** Free-tier tillåter inte fler projekt.
**Impact:** När Pro köps: skapa dedikerat projekt, kör migrations, uppdatera project_id i COMMANDS.md och engrams/CLAUDE.md.

### 2026-03-28 — V1 för Anna, V2 för team
**Decision:** Bygg och validera V1 (Anna, singel-user) först. V2 (team, enterprise) byggs när V1 funkar.
**Why:** Om det inte funkar för Anna funkar det inte för enterprise.
**Impact:** engrams_todo strukturerad i V1/V2-sektioner.
