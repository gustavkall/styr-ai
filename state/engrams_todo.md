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
**Status:** ✅ KLAR (2026-03-28 — kört via Supabase MCP av Claude)

### #2 ONBOARD-001 — Skicka onboarding-mail till Anna Garmen
**Status:** ⬜ EJ KLAR (väntar på #3 — API-nyckel måste kunna genereras först)
**Vad:** Gmail draft ID: r5404878031968918972

### #3 STRIPE-001 — Betalning → API-nyckel automatiskt
**Status:** ⬜ EJ KLAR
**Tid:** ~2h
**Vad:** Stripe webhook + lib/api-key.js + lib/email.js (Resend)
**Saknas i Vercel (engrams-projekt):** STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, RESEND_API_KEY, OPENAI_API_KEY
**Design:** `project_memory/architecture/engrams_onboarding_plan.md`

### #12 CC-SUPABASE-MCP-001 — Koppla Supabase MCP till Claude Code
**Status:** ⬜ EJ KLAR
**Tid:** 2 min
**Vad:** Kör detta en gång i terminal (kopplar CC till samma Supabase som Claude.ai):
```bash
claude mcp add --scope project --transport http supabase "https://mcp.supabase.com/mcp?project_ref=crsonxfrylkpgrddovhu"
# Sedan: claude /mcp → välj supabase → Authenticate
```
**Värde:** CC kan köra SQL-migrations och läsa/skriva databas utan att Gustav behöver göra det manuellt

---

## MINNES-ARKITEKTUR (kärnan i V1)

### #8 MEMORY-001 — remember/recall/forget/profile API-endpoints
**Status:** ⬜ EJ KLAR (databas klar ✅, kod saknas)
**Tid:** ~3h
**Vad:**
- `lib/embeddings.js` — wrapper runt OpenAI text-embedding-3-small
- `api/mcp` endpoints: remember, recall, forget, profile
- Lazy loading: profil + episode alltid, learnings via semantisk sökning (>0.75)
**Saknas i Vercel:** OPENAI_API_KEY
**Design:** `project_memory/architecture/memory_architecture.md`

### #9 MEMORY-002 — Auto-remember vid handoff
**Status:** ⬜ EJ KLAR (väntar på #8)
**Tid:** ~1h
**Vad:** Claude kallar remember() automatiskt vid handoff. Ingen manuell taggning.

### #10 MEMORY-003 — Auto-recall vid session boot
**Status:** ⬜ EJ KLAR (väntar på #8)
**Tid:** ~1h
**Vad:** Claude kallar recall() vid boot baserat på första meddelandet. Tyst laddning.

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

---

## KLART ✅

| # | Task | Datum |
|---|------|-------|
| 1 | SQL-schema i Supabase (accounts, projects, memory_items, pgvector) | 2026-03-28 |
| - | Landningssida live (engrams.app) | 2026-03-28 |
| - | Waitlist-formulär → Supabase | 2026-03-28 |
| - | Docs-sida med command reference | 2026-03-28 |
| - | Vercel + DNS konfigurerat | 2026-03-28 |
| - | MCP-server live (app.savageroar.se) | 2026-03-26 |
| - | Arkitekturplan (database-only) | 2026-03-28 |
| - | COMMANDS.md + opt-out todo-modell | 2026-03-28 |

---

## UPPDATERINGSINSTRUKTION

När en task slutförs: ändra ⬜ → ✅, flytta till KLART, commit `state: engrams_todo #{nr} klar`
