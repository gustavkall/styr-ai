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
**Status:** ⬜ EJ KLAR (väntar på #3)
**Vad:** Gmail draft ID: r5404878031968918972

### #3 STRIPE-001 — Betalning → API-nyckel automatiskt
**Status:** ⬜ EJ KLAR
**Tid:** ~2h
**Vad:** Stripe webhook + lib/api-key.js + lib/email.js (Resend)
**Saknas i Vercel (engrams-projekt):** STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, RESEND_API_KEY, OPENAI_API_KEY

### #12 CC-SUPABASE-MCP-001 — Koppla Supabase MCP till Claude Code
**Status:** ⬜ EJ KLAR
**Tid:** 2 min
**Vad:**
```bash
claude mcp add --scope project --transport http supabase "https://mcp.supabase.com/mcp?project_ref=crsonxfrylkpgrddovhu"
```

---

## MINNES-ARKITEKTUR (kärnan i V1)

### #8 MEMORY-001 — remember/recall/forget/profile API-endpoints
**Status:** ⬜ EJ KLAR (databas klar ✅, kod klar ✅, saknar env vars i Vercel)
**Saknas i Vercel:** OPENAI_API_KEY

### #9 MEMORY-002 — Auto-remember vid handoff
**Status:** ⬜ EJ KLAR (väntar på #8)

### #10 MEMORY-003 — Auto-recall vid session boot
**Status:** ⬜ EJ KLAR (väntar på #8)

---

## DISTRIBUTION

### #4 MCP-CONNECTOR-001 — Officiell Claude Connector
**Status:** ⬜ EJ KLAR
**Tid:** ~2h
**Vad:** Flytta MCP till engrams.app/api/mcp → openapi.yaml → Anthropic MCP-register

### #5 OPENAPI-001 — ChatGPT + Gemini-kompatibel spec
**Status:** ⬜ EJ KLAR (väntar på #4)

---

## SAJT

### #6 PRICING-001 — Prissektion + Stripe Checkout-knappar
**Status:** ⬜ EJ KLAR (väntar på #3)
**Tiers:** Free (0kr) / Pro 190kr / Team 490kr

### #7 DASHBOARD-001 — Kund-dashboard
**Status:** ⬜ EJ KLAR
**Tid:** ~2-3h

---

## INFRA & KOSTNADER

### #13 AGENT-HAIKU-001 — Byt styr-ai agenter från Sonnet till Haiku-4
**Status:** ⬜ EJ KLAR
**Tid:** 15 min
**Vad:** top-gainers-agent, market-regime-agent, memory-integrity-agent använder claude-sonnet-4.
Byt till claude-haiku-4-5-20251001 — samma kvalitet för rapport-sammanfattning, 20x billigare.
**Estimerad besparing:** ~80% av löpande API-kostnader (~$0.30-0.45/dag → ~$0.02-0.05/dag)
**Notering:** Max-plan täcker CC-sessioner (flat rate). GitHub Actions-agenterna faktureras separat per API-anrop.
**Vad CC gör:** Sök `claude-sonnet-4` i scripts/ i styr-ai, byt till `claude-haiku-4-5-20251001`

---

## VERSION 2 (byggs när V1 valideras med Anna)

### #11 ENGRAMS-TEAM-001 — Team-plan arkitektur
**Status:** ⬜ PLANERAD (V2)

---

## KLART ✅

| # | Task | Datum |
|---|------|-------|
| 1 | SQL-schema i Supabase | 2026-03-28 |
| - | Landningssida live (engrams.app) | 2026-03-28 |
| - | Waitlist-formulär → Supabase | 2026-03-28 |
| - | Docs-sida med command reference | 2026-03-28 |
| - | Vercel + DNS konfigurerat | 2026-03-28 |
| - | MCP-server live (app.savageroar.se) | 2026-03-26 |
| - | COMMANDS.md + opt-out todo-modell | 2026-03-28 |
| - | Memory API kod (lib/ + api/) | 2026-03-28 |
| - | GOVERNANCE.md + PROJECT.md alla repos | 2026-03-28 |

---

## UPPDATERINGSINSTRUKTION

När en task slutförs: ändra ⬜ → ✅, flytta till KLART, commit `state: engrams_todo #{nr} klar`
