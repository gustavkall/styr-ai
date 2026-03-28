# styr-ai — Decision Log
*Cumulative log. Append-only.*

---

### 2026-03-24 — Goals layer definierad
**Decision:** goals.md definierar systemets syfte som leverage-multiplikator.

### 2026-03-24 — Autonomigränser definierade
**Decision:** governance/system_rules.md — tre nivåer: autonomt, kräver godkännande, aldrig autonomt.

### 2026-03-26 — Warner-tvist hanteras personligen
**Decision:** Gustav hanterar personligen. COO eskalerar inte.

### 2026-03-26 — styrAI-product arkitektur
**Decision:** MCP + Supabase + pgvector + OpenAI embeddings. COGS <$1/mån per kund.

### 2026-03-26 — Separata repos
**Decision:** engrams = separat repo från styr-ai.

### 2026-03-28 — Produktnamn: Engrams
**Decision:** engrams.app. Engram = vetenskapligt begrepp för minnessspår.

### 2026-03-28 — Database-only arkitektur
**Decision:** Kunder behöver inget repo. Allt i Engrams Supabase.

### 2026-03-28 — Fyra minnestyper
**Decision:** profile/context/learning/episode. Parallell med hjärnans minnessystem.

### 2026-03-28 — CC↔Claude.ai sync
**Decision:** active_context.md + cc_session_log.md + `sync`-alias.

### 2026-03-28 — COMMANDS.md
**Decision:** Central kommandoreferens. Boot läser den. Gustav förklarar aldrig kommandon två gånger.

### 2026-03-28 — Supabase MCP autonomt
**Decision:** Claude kör SQL direkt. Frågar inte Gustav.

### 2026-03-28 — `session boot [projekt]`
**Decision:** Projektspecifik boot. Minskar brus.

### 2026-03-28 — Opt-out todo-modell
**Decision:** Claude föreslår → tyst godkännande.

### 2026-03-28 — GOVERNANCE.md + PROJECT.md (tvånivå-styrning)
**Decision:** GOVERNANCE.md i styr-ai = grundlagar för alla projekt. PROJECT.md per repo = projektidentitet.
**Why:** En ändring i GOVERNANCE.md gäller alla projekt direkt. Ingen manuell synk av 5 filer.
**Context:** Gustav föreslog detta själv — Claude borde ha sett det proaktivt från de synliga problemen (inkonsistens, ingen isolation).
**Impact:** Boot Steg 0 hämtar GOVERNANCE.md + PROJECT.md. system_projects-tabell i Supabase. Alla 6 repos har PROJECT.md.

### 2026-03-28 — V1 för Anna, V2 för team
**Decision:** Bygg och validera V1 först. V2 byggs när V1 funkar.

### 2026-03-28 — Engrams delar Styr.AI Supabase tills Pro
**Decision:** När Supabase Pro köps: dedikerat Engrams-projekt. Uppdatera SUPABASE_REF i COMMANDS.md och engrams/PROJECT.md.
