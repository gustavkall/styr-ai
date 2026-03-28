# Engrams — Master Todo
*Detta är den ENDA källan till sanning för Engrams todo-status.*
*Uppdateras av: session handoff, sync, och direkt när status ändras.*
*Läses av: session boot (steg 1), active_context (sync), next_session_brief.*

---

## VERSION 1 — ANNA (singel-user, persistent memory)
*Mål: Anna kan starta en ny chat och få full kontext från tidigare sessioner automatiskt.*
*När V1 funkar för Anna, bygger vi V2 (team/enterprise).*

---

## BLOCKERARE — måste göras i ordning

### #1 MULTI-PROJECT-001 — SQL-schema i Supabase
**Status:** ⬜ EJ KLAR
**Tid:** 30 min
**Blockerare för:** #2, #3, #6, #8
**Vad:** Kör SQL-schema i styr-ai Supabase-projekt (hxikaojzwjtztyuwlxra)
Se: `project_memory/architecture/engrams_onboarding_plan.md`

### #2 ONBOARD-001 — Skicka onboarding-mail till Anna Garmen
**Status:** ⬜ EJ KLAR (väntar på #1)
**Tid:** 5 min
**Vad:** Gmail draft ID: r5404878031968918972

### #3 STRIPE-001 — Betalning → API-nyckel automatiskt
**Status:** ⬜ EJ KLAR (väntar på #1)
**Tid:** ~2h
**Vad:** Stripe webhook + lib/api-key.js + lib/email.js (Resend)
**Saknas i Vercel:** STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, RESEND_API_KEY

---

## MINNES-ARKITEKTUR (kärnan i V1)

### #8 MEMORY-001 — Fyra minnestyper + pgvector semantisk sökning
**Status:** ⬜ EJ KLAR (väntar på #1)
**Tid:** ~3h
**Prioritet:** HÖG — detta är vad Engrams faktiskt är
**Vad:**
Bygg `memory_items`-tabell med fyra typer:
- `profile` — vem är användaren, hur vill de bli hjälpte (permanent, laddas alltid)
- `context` — projektspecifik bakgrund, avtal, dokument (laddas när relevant)
- `learning` — beslut, strategier, lärdomar (söks semantiskt)
- `episode` — senaste session-handoff (laddas alltid)

SQL:
```sql
CREATE TABLE memory_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('profile', 'context', 'learning', 'episode')),
  content TEXT NOT NULL,
  embedding VECTOR(1536),          -- OpenAI text-embedding-3-small
  tags TEXT[],                     -- valfria komplement
  relevance_score FLOAT DEFAULT 1.0, -- förstärks när minnet hämtas
  created_at TIMESTAMPTZ DEFAULT now(),
  last_accessed_at TIMESTAMPTZ
);
CREATE INDEX ON memory_items USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX ON memory_items (project_id, type);
```

API-endpoints att bygga:
- `remember` — spara minne + generera embedding
- `recall` — semantisk sökning, returnerar top-N relevanta minnen
- `forget` — ta bort minne
- `profile` — läs/skriv användarprofil

Lazy loading-logik:
1. Ladda alltid: profil + senaste episode
2. Sök semantiskt: learnings med similarity > 0.75
3. Ladda context: bara om projektet är aktivt

Design: `project_memory/architecture/memory_architecture.md`

### #9 MEMORY-002 — Auto-remember vid handoff
**Status:** ⬜ EJ KLAR (väntar på #8)
**Tid:** ~1h
**Vad:** Vid session handoff: kalla `remember` automatiskt på beslut och lärdomar.
Ingen manuell taggning. Claude bedömer själv vad som är värt att minnas.

### #10 MEMORY-003 — Auto-recall vid session boot
**Status:** ⬜ EJ KLAR (väntar på #8)
**Tid:** ~1h
**Vad:** Vid boot: kalla `recall` baserat på Gustavs/Annas första meddelande.
Laddar semantiskt relevanta minnen tyst — presenterar dem inte som en lista,
använder dem som kontext för svaret.

---

## DISTRIBUTION

### #4 MCP-CONNECTOR-001 — Officiell Claude Connector
**Status:** ⬜ EJ KLAR
**Tid:** ~2h
**Vad:** Flytta MCP till engrams.app/api/mcp → openapi.yaml → Anthropic MCP-register

### #5 OPENAPI-001 — ChatGPT + Gemini-kompatibel spec
**Status:** ⬜ EJ KLAR (väntar på #4)
**Tid:** ~1h

---

## SAJT

### #6 PRICING-001 — Prissektion + Stripe Checkout-knappar
**Status:** ⬜ EJ KLAR (väntar på #3)
**Tid:** 30 min
**Tiers:** Free (0kr) / Pro 190kr / Team 490kr

### #7 DASHBOARD-001 — Kund-dashboard
**Status:** ⬜ EJ KLAR
**Tid:** ~2-3h
**Vad:** Inloggad vy: projekt, API-nycklar, minneshistorik

---

## VERSION 2 (byggs när V1 valideras med Anna)

### #11 ENGRAMS-TEAM-001 — Team-plan arkitektur
**Status:** ⬜ PLANERAD (V2)
**Vad:** Delad todo, member-isolation, @assign, team_todo-tabell.
Byggs EFTER att V1 funkar för Anna.

---

## KLART ✅

| # | Task | Datum |
|---|------|-------|
| - | Landningssida live (engrams.app) | 2026-03-28 |
| - | Waitlist-formulär → Supabase | 2026-03-28 |
| - | Docs-sida med command reference | 2026-03-28 |
| - | Vercel + DNS konfigurerat | 2026-03-28 |
| - | MCP-server live (app.savageroar.se) | 2026-03-26 |
| - | Arkitekturplan (database-only) | 2026-03-28 |
| - | SQL-schema designat | 2026-03-28 |
| - | COMMANDS.md + opt-out todo-modell | 2026-03-28 |

---

## UPPDATERINGSINSTRUKTION

När en task slutförs: ändra ⬜ → ✅, flytta till KLART, commit `state: engrams_todo #{nr} klar`
