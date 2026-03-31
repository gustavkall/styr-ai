# Engrams Todo — Master
*Uppdaterad: 2026-03-31*

| # | Task | Status | Not |
|---|------|--------|-----|
| 1 | SQL-schema i Supabase | ✅ KLAR | |
| 2 | Onboarding-mail till Anna | ⬜ | Draft klar, skickas när recall funkar |
| 3 | STRIPE-001 — Betalning → konto skapas | ⬜ | |
| 4 | MCP-CONNECTOR-001 | ⬜ | Claude-native |
| 5 | OPENAPI-001 | ⬜ | ChatGPT Custom GPT action |
| 6 | PRICING-001 — Prissektion | ⬜ | Väntar på #3 |
| 7 | DASHBOARD-001 — Inloggning + projektsida | ⬜ | Se plan nedan |
| 8 | MEMORY-001 — API-endpoints | ✅ KLAR | |
| 9 | MEMORY-002 — Auto-remember | ⬜ | Väntar på recall-fix |
| 10 | MEMORY-003 — Auto-recall boot | ⬜ | Väntar på recall-fix |
| 11 | ENGRAMS-TEAM-001 (V2) | ⬜ | |
| 12 | CC-SUPABASE-MCP-001 | ⬜ | |
| 13 | AGENT-HAIKU-001 | ⬜ | |
| — | CONNECT-001 — Connect-flow per plattform | ⬜ | Se plan nedan |
| — | ENGRAMS-RECALL-FIX | ⬜ BLOCKER | recall() returnerar 0 minnen |
| — | ENGRAMS-SUPABASE-SPLIT | ⬜ | Migrera från TradeSys till eget projekt |
| — | PLATFORM-AGNOSTIC-001 | ⬜ | Se plan nedan |
| — | MEMORY-FORGETTING-001 | ⬜ V2 | Forgetting curve — nattlig decay |
| — | MEMORY-CONSOLIDATION-001 | ⬜ V2 | episode → learning automatiskt |

---

## Produktvision — Zero-technical UX

Kunden ska aldrig se: API-nyckel, system prompt, kod, eller tekniska detaljer.

**Kunden gör tre saker:**
1. Skapar konto på engrams.app (email + lösenord via Stripe checkout)
2. Väljer vilka AI-verktyg de använder
3. Klickar "Connect" — vi visar en 30-sekunders guide per verktyg

**Vi hanterar:** minnesslagring, embeddings, sökning, session-handoffs, allt.

---

## DASHBOARD-001 — Plan

Kräver: Next.js app, Supabase Auth, Stripe

**Sidor:**
- `/` — landningssida (klar)
- `/login` — email/lösenord via Supabase Auth
- `/dashboard` — projektöversikt, minnesstatus, usage
- `/dashboard/connect` — connect-flow per plattform
- `/dashboard/project/[id]` — projektdetaljer, minneslista

**Blockas av:** STRIPE-001 (betalning måste komma innan dashboard är meningsfullt)

---

## CONNECT-001 — Connect-flow per plattform

Kunden väljer plattform → vi visar en modal med exakt vad de ska göra → klart.

Ingen kund ser ord som "API-nyckel", "system prompt" eller "Bearer token" — vi kallar det "Activation code" och "Memory settings".

| Plattform | Vad vi visar | Tid |
|-----------|-------------|-----|
| Claude | "Copy this block → paste into Project Instructions" | 30 sek |
| ChatGPT | "Copy this block → paste into Custom Instructions" | 30 sek |
| Cursor | "Copy this file → save as .cursorrules in your project" | 30 sek |
| Gemini | "Copy this block → paste into System Instruction" | 30 sek |

Vi auto-genererar rätt block per plattform med kundens unika activation code inbakad.

**Blockas av:** DASHBOARD-001

---

## Minnessystemet — neurobiologisk grund

| Minnestyp | Neurologiskt system | Funktion |
|-----------|--------------------|----|
| `profile` | Cerebellum | Permanent identitet — förändras sällan |
| `context` | Amygdala | Projektspecifik kontext, prioritet |
| `learning` | Cerebral cortex | Långtidsminne — fakta, beslut, arkitektur |
| `episode` | Hippocampus | Sessionshandoff — konsolideras till learning |

---

## PLATFORM-AGNOSTIC-001 — Plan

### Fas 1 — Connect-flow i dashboard (CONNECT-001)
### Fas 2 — ChatGPT Custom GPT action (OPENAPI-001)
### Fas 3 — Cursor/Windsurf rules-fil
### Fas 4 — MCP-connector Claude-native (MCP-CONNECTOR-001)

**Ingen källkodsaccess till OpenAI/Google/Cursor behövs.**
