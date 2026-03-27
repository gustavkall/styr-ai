# styr-ai — WORK QUEUE
*Uppdaterad: 2026-03-27 EOD — MULTI-PROJECT + CC-SYNC blockerare tillagda*

---

## ACTIVE
*(inget aktivt)*

---

## READY — PRIORITY ORDER

### STYRAI-MULTI-PROJECT-001 — Multi-projekt arkitektur (BLOCKERARE FÖR ANNA)
**Priority:** MAX — GÖR DETTA FÖRST IMORGON
**Project:** styrAI-product
**Blockerare för:** STYRAI-ONBOARD-CONFIRM-001, STYRAI-STRIPE-001
**Problem:** Nuvarande arkitektur = 1 nyckel → 1 projekt. Om Anna har 2+ projekt blandas minnena ihop. Måste lösas INNAN Anna är live.
**Lösning (detaljerad i project_memory/architecture/multi_project_design.md):**
- Steg 1 (30 min): Lägg till `project_name` i Supabase projects-tabell + i CLAUDE.md-template. Kunden skapar 1 nyckel per projekt. Löser Anna direkt.
- Steg 2 (2h — parallellt med Stripe): Bygg accounts-tabell ovanför projects. 1 konto → N nycklar → N projekt. Skalbart för all framtid.
**Supabase migration:** Se `project_memory/architecture/multi_project_design.md`

### TRADESYS-CC-SYNC-001 — CC skriver till styr-ai MCP vid handoff
**Priority:** MAX — ANDRA SAKEN IMORGON
**Project:** tradesys1337 / styr-ai
**Problem:** CC jobbar i tradesys utan att styr-ai vet vad som gjorts. Idag: squeeze-features, 6 agenter, catalyst-research — inget av det syns i styr-ai förrän manuell synk.
**Lösning:** Klistra in detta i CC nästa session:
```
Viktigt: Vi har ett persistent memory-problem.
Vid varje session handoff, efter att du committat session_handoff.md,
gör också ett extra steg:

curl -X POST https://app.savageroar.se/api/mcp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer e5a93009-8ad9-4b44-9f6f-840d9c8c32da" \
  -d '{"tool": "write_session", "input": {
    "summary": "[vad vi gjorde]",
    "changes": ["..."],
    "next_steps": ["..."],
    "project_phase": "build",
    "energy": "momentum",
    "agent_id": "cc-tradesys"
  }}'

Gör detta ALLTID. Det tar 10 sekunder och säkerställer att
styr-ai alltid vet exakt vad CC har gjort.
```

### STYRAI-ONBOARD-CONFIRM-001 — Bekräfta kund #1 live
**Priority:** HIGH (efter MULTI-PROJECT-001)
**Project:** styrAI-product
**Description:** Gmail-draft skickad till anna.garmen@gmail.com. Bekräfta live EFTER multi-projekt-fix är deployad.

### STYRAI-STRIPE-001 — Stripe-integration + självbetjäning
**Priority:** HIGH (efter MULTI-PROJECT-001)
**Project:** styrAI-product
**Description:** Flöde: kund betalar via Stripe → webhook skapar projekt + genererar API-nyckel i Supabase → bekräftelsemail automatiskt. Bygg accounts-arkitekturen (steg 2 i MULTI-PROJECT-001) parallellt med Stripe.

### TRADESYS-FMP-UPGRADE — FMP Starter $29/mån
**Priority:** HIGH
**Project:** tradesys-models
**Description:** Låser upp short interest + earnings surprise i squeeze-probability.js. Görs imorgon. URL: https://financialmodelingprep.com/pricing

### TRADESYS-MARKETDATA-001 — Testa MarketData.app options flow
**Priority:** HIGH
**Project:** tradesys-models
**Description:** Gratis 100 req/dag. GET /v1/options/chain/AGX/?token=KEY. Verifiera IV + volym/OI. Om OK → put/call ratio som squeeze-feature.

### STYRAI-NAME-001 — Besluta produktnamn
**Priority:** HIGH
**Project:** styrAI-product
**Description:** Kandidater: Engram (`withengram.ai` $160), Exocortex (`useexocortex.ai` $160), Axon (`useaxon.ai` $160), Mnemo (`usemnemo.ai` $160).

### STYRAI-OPENAPI-001 — openapi.yaml — ChatGPT + Gemini
**Priority:** HIGH
**Project:** styrAI-product

### STYRAI-MCP-REGISTER-001 — Ansök till Anthropics MCP-register
**Priority:** HIGH
**Project:** styrAI-product
**Description:** Kräver stabil domän (blockerare).

### STYRAI-ROLLBACK-001 — restore_session
**Priority:** MEDIUM
**Project:** styrAI-product

### TRADESYS-CATALYST-001 — CATALYST_WATCH-lista i dashboard
**Priority:** HIGH
**Project:** tradesys1337
**Description:** RSI<40 + RelVol<0.5x + drawdown>-15% + pris<$20.

### TRADESYS-AGENT-REPORT-001 — ShadowBot agent-rapport
**Priority:** HIGH
**Project:** tradesys-models
**Description:** Vänta tills 5-10 avslutade trades per agent.

### MODEL-v11 — Nästa ML-iteration
**Priority:** MEDIUM
**Project:** tradesys-models

### ADMINASSISTENT-001 — Bygg EA-system
**Priority:** LOW

---

## COMPLETED

| ID | Task | Date | Outcome |
|----|------|------|--------|
| VISION-001 | Goals layer | 2026-03-24 | ✅ |
| VISION-004 | Autonomigränser | 2026-03-24 | ✅ |
| VISION-005 | Autonom execution | 2026-03-24 | ✅ 5 agenter live |
| COO-001 | COO-agent | 2026-03-24 | ✅ |
| ARCH-001/002 | URL-first + proaktiv regel | 2026-03-24 | ✅ |
| MODEL-001 | Training pipeline | 2026-03-25 | ✅ 48k samples |
| SECURITY-001 | Repos privata | 2026-03-25 | ✅ |
| MODEL-002 | Scanner-labels EMS/FPS/STS | 2026-03-26 | ✅ |
| MODEL-003 | EPS surprise Polygon | 2026-03-26 | ✅ |
| BUGFIX-001 | fetch-state.js crash | 2026-03-26 | ✅ |
| STYRAI-FAS1 | Fas 1 — kärnprodukt | 2026-03-26 | ✅ MCP-server live, 8 verktyg |
| STYRAI-FAS2 | Fas 2 — sajt, setup, dashboard, remote MCP, episodiskt minne, agent_id | 2026-03-26 | ✅ |
| STYRAI-LASTTEST | Lasttest 8/8 | 2026-03-26 | ✅ |
| STYRAI-VERIFY-001 | Boot/handoff-verifiering | 2026-03-27 | ✅ health + verified + next_boot_preview live |
| STYRAI-PROTOCOL-001 | Loggningsprotokoll i alla CLAUDE.md | 2026-03-27 | ✅ 4 repos uppdaterade |
| DOMAIN-001 | app.savageroar.se live på styrAI-product | 2026-03-27 | ✅ Vercel + DNS klart |
| STYRAI-ONBOARD-001 | Draft till kund #1 anna.garmen@gmail.com | 2026-03-27 | ✅ Redo att skickas |
| AGENT-PAUSE-001 | coo-agent + autonomous-agent pausade | 2026-03-27 | ✅ |
| TRADESYS-SHADOWBOT-6 | 6 ShadowBot-agenter live + Supabase-sync | 2026-03-27 | ✅ Alla 6 aktiva |
| TRADESYS-AGENTS-TAB | AGENTS-tab i dashboard med live P&L | 2026-03-27 | ✅ Live |
| TRADESYS-CATALYST | catalyst-researcher.js + 74 cases | 2026-03-27 | ✅ RSI<30 → avg +84% |
| TRADESYS-SQUEEZE | squeeze-probability.js + 🔥 i dashboard | 2026-03-27 | ✅ Polygon float+earnings live, short interest väntar FMP |
