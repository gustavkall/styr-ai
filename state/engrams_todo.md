# Engrams — Master Todo
*Detta är den ENDA källan till sanning för Engrams todo-status.*
*Uppdateras av: session handoff, sync, och direkt när status ändras.*
*Läses av: session boot (steg 1), active_context (sync), next_session_brief.*

---

## BLOCKERARE — måste göras i ordning

### #1 MULTI-PROJECT-001 — SQL-schema i Supabase
**Status:** ⬜ EJ KLAR
**Tid:** 30 min
**Blockerare för:** #2, #3, #6
**Vad:** Kör SQL-schema i styr-ai Supabase-projekt (hxikaojzwjtztyuwlxra)
```sql
-- accounts, projects, sessions, decisions tabeller
-- Se: project_memory/architecture/engrams_onboarding_plan.md
```

### #2 ONBOARD-001 — Skicka onboarding-mail till Anna Garmen
**Status:** ⬜ EJ KLAR (väntar på #1)
**Tid:** 5 min
**Vad:** Gmail draft ID: r5404878031968918972 — skicka när #1 är klar

### #3 STRIPE-001 — Betalning → API-nyckel automatiskt
**Status:** ⬜ EJ KLAR (väntar på #1)
**Tid:** ~2h
**Vad:** Stripe webhook + lib/api-key.js + lib/email.js (Resend)
**Miljövariabler saknas i Vercel:**
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- RESEND_API_KEY
**Design:** project_memory/architecture/engrams_onboarding_plan.md

---

## DISTRIBUTION

### #4 MCP-CONNECTOR-001 — Officiell Claude Connector
**Status:** ⬜ EJ KLAR
**Tid:** ~2h
**Vad:**
1. Flytta MCP-server från app.savageroar.se → engrams.app/api/mcp
2. Skriv openapi.yaml för alla MCP-endpoints
3. Ansök till Anthropics MCP-register
**Värde:** Engrams syns i Claude.ai connector-meny för alla användare

### #5 OPENAPI-001 — ChatGPT + Gemini-kompatibel spec
**Status:** ⬜ EJ KLAR (väntar på #4)
**Tid:** ~1h
**Vad:** Samma MCP-server exponerad som OpenAI plugin + Gemini extension
**Värde:** Tredubblar distribution utan ny infrastruktur

---

## SAJT

### #6 PRICING-001 — Prissektion + Stripe Checkout-knappar
**Status:** ⬜ EJ KLAR (väntar på #3)
**Tid:** 30 min
**Tiers:**
- Free — 1 projekt, 30 dagars minne, 0 kr
- Pro — 5 projekt, obegränsat minne, 190 kr/mån
- Team — 20 projekt, team-delning, 490 kr/mån

### #7 DASHBOARD-001 — Kund-dashboard
**Status:** ⬜ EJ KLAR
**Tid:** ~2-3h
**Vad:** Enkel inloggad vy där kunden ser sina projekt, API-nycklar, minneshistorik
**Blockerare för:** Skalning bortom manuell onboarding

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

---

## UPPDATERINGSINSTRUKTION

När en task slutförs:
1. Ändra ⬜ → ✅ och flytta till KLART-tabellen
2. Uppdatera active_context.md med ny status
3. Commit: `state: engrams_todo #{nummer} klar`
