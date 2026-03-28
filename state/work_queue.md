# styr-ai — WORK QUEUE
*Uppdaterad: 2026-03-28 — Engrams live, CC↔Claude.ai sync live*

---

## ACTIVE
*(inget aktivt)*

---

## READY — PRIORITETSORDNING

---

### ENGRAMS-MULTI-PROJECT-001 — Multi-projekt arkitektur (BLOCKERARE FÖR ANNA + STRIPE)
**Prioritet:** MAX
**Project:** engrams / styr-ai Supabase
**Blockerare för:** ENGRAMS-ONBOARD-001, ENGRAMS-STRIPE-001
**Problem:** Nuvarande arkitektur = 1 nyckel → 1 projekt. Om Anna har 2+ projekt blandas minnena ihop.
**Lösning:**
- Steg 1 (30 min): Lägg till `project_name` i Supabase projects-tabell. Kunden skapar 1 nyckel per projekt.
- Steg 2 (2h): Bygg accounts-tabell ovanför projects. 1 konto → N nycklar → N projekt.
**Design:** Se `project_memory/architecture/multi_project_design.md` i styr-ai

---

### ENGRAMS-ONBOARD-001 — Skicka onboarding-mail till Anna
**Prioritet:** HIGH (efter MULTI-PROJECT-001)
**Project:** engrams
**Description:** Gmail-draft klar (ID: r5404878031968918972). Skicka EFTER multi-projekt-fix deployad.

---

### ENGRAMS-STRIPE-001 — Stripe-integration + självbetjäning
**Prioritet:** HIGH (efter MULTI-PROJECT-001)
**Project:** engrams
**Description:** Flöde: kund betalar via Stripe → webhook skapar projekt + genererar API-nyckel i Supabase → bekräftelsemail automatiskt.

---

### ENGRAMS-MCP-CONNECTOR-001 — Bygg officiell Claude Connector
**Prioritet:** HIGH
**Project:** engrams
**Description:** Anthropic har ett officiellt MCP-register. Engrams ska listas som connector — syns i Claude.ai "Add Connector"-menyn för alla användare.
**Krav:**
- openapi.yaml som beskriver MCP-endpoints (tool schema)
- Ansökan till Anthropic MCP-register
- Verifierad domän ✅ (engrams.app)
- Stabil MCP-server ✅ (app.savageroar.se/api/mcp-server)
**Steg:**
1. Skriv openapi.yaml för Engrams MCP-server
2. Flytta MCP-server till engrams.app/api/mcp-server (egen domän)
3. Ansök: https://docs.anthropic.com/mcp-registry
**Värde:** Organisk distribution — varje Claude-användare ser Engrams i connector-listan

---

### ENGRAMS-OPENAPI-001 — openapi.yaml för ChatGPT + Gemini
**Prioritet:** HIGH (efter MCP-connector)
**Project:** engrams
**Description:** Samma MCP-server, men exponerad som OpenAI-kompatibelt plugin och Gemini extension. Tredubblar distribution utan ny infrastruktur.

---

### ENGRAMS-PRICING-001 — Besluta prismodell + Stripe-tiers
**Prioritet:** MEDIUM (före Stripe-implementation)
**Project:** engrams
**Description:** Förslag att diskutera:
- Free: 1 projekt, 30 dagars minne
- Pro $19/mån: 5 projekt, obegränsat minne, agent-support
- Team $49/mån: 20 projekt, team-delning, prioritetssupport

---

### TRADESYS-SECTOR-HOT-001 — Expandera Defense/Financials watchlist
**Prioritet:** HÖG
**Project:** tradesys-models
**Description:** Lägg till 8-10 tickers per sektor. Defense: ITA, LMT, RTX, NOC, GD, BA, LDOS, CACI, SAIC, L3T. Financials: JPM, GS, MS, BAC, WFC, BLK, SPGI, MCO, ICE, CME.
**Värde:** 27 trades/år → 60-80/år vid 71.8% WR = direkt mer P&L

---

### TRADESYS-FMP-001 — FMP Starter $29/mån
**Prioritet:** HÖG
**Project:** tradesys-models
**Description:** Låser upp short interest live. URL: https://financialmodelingprep.com/pricing
**Trigger:** Gustav subscribar manuellt

---

### TRADESYS-VIX-FILTER-001 — vixElevated=0 filter till SECTOR_HOT
**Prioritet:** MEDIUM
**Project:** tradesys-models
**Description:** Win-factor: WR 76% när vixElevated=0 vs 32% elevated (corr=-0.326). Implementera + backtest.

---

### TRADESYS-MARKETDATA-001 — Testa MarketData.app options flow
**Prioritet:** MEDIUM
**Project:** tradesys-models
**Description:** 100 req/dag gratis. GET /v1/options/chain/AGX/?token=KEY

---

### TRADESYS-AGENT-REPORT-001 — ShadowBot agent-rapport
**Prioritet:** MEDIUM
**Project:** tradesys-models
**Description:** Vänta tills 5-10 avslutade trades per agent (SECTOR_HOT + SC_TREND).

---

### ADMINASSISTENT-001 — Bygg EA-system
**Prioritet:** LOW
**Project:** adminassistent

---

## COMPLETED

| ID | Task | Date | Outcome |
|----|------|------|---------|
| VISION-001 | Goals layer | 2026-03-24 | ✅ |
| VISION-004/005 | Autonomigränser + execution | 2026-03-24 | ✅ |
| COO-001 | COO-agent | 2026-03-24 | ✅ |
| ARCH-001/002 | URL-first + proaktiv regel | 2026-03-24 | ✅ |
| MODEL-001/002/003 | Training pipeline + labels + EPS | 2026-03-25/26 | ✅ |
| SECURITY-001 | Repos privata | 2026-03-25 | ✅ |
| STYRAI-FAS1/FAS2 | MCP-server + sajt + dashboard | 2026-03-26 | ✅ |
| STYRAI-VERIFY-001 | Boot/handoff-verifiering | 2026-03-27 | ✅ |
| STYRAI-PROTOCOL-001 | Loggningsprotokoll i alla CLAUDE.md | 2026-03-27 | ✅ |
| DOMAIN-001 | app.savageroar.se live | 2026-03-27 | ✅ |
| STYRAI-ONBOARD-001 | Draft till anna.garmen@gmail.com | 2026-03-27 | ✅ |
| AGENT-PAUSE-001 | coo-agent + autonomous-agent pausade | 2026-03-27 | ✅ |
| TRADESYS-SHADOWBOT-6 | 6 agenter live + Supabase-sync | 2026-03-27 | ✅ |
| TRADESYS-AGENTS-TAB | AGENTS-tab live P&L | 2026-03-27 | ✅ |
| TRADESYS-CATALYST | catalyst-researcher.js 74 cases | 2026-03-27 | ✅ |
| TRADESYS-SQUEEZE | squeeze-probability.js + 🔥 watchlist | 2026-03-27 | ✅ |
| CC-SYNC-001 | CC↔Claude.ai bidirektionellt sync | 2026-03-28 | ✅ active_context + cc_session_log |
| STYRAI-NAME-001 | Produktnamn beslutat: Engrams | 2026-03-28 | ✅ |
| ENGRAMS-DOMAIN-001 | engrams.app köpt + DNS live | 2026-03-28 | ✅ |
| ENGRAMS-LANDING-001 | Landningssida + waitlist live | 2026-03-28 | ✅ Vercel + Supabase |
| TRADESYS-SECTOR-HOT | Agent 4+6 redesign, 71.8%/62.6% WR | 2026-03-28 | ✅ |
| TRADESYS-TRAINER-BUG | agent-trainer.js leaf node bugfix +11.4pp | 2026-03-28 | ✅ |
