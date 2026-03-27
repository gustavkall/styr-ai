# styr-ai — WORK QUEUE
*Uppdaterad: 2026-03-27 session 3 close*

---

## ACTIVE
*(inget aktivt)*

---

## READY — PRIORITY ORDER

### STYRAI-ONBOARD-CONFIRM-001 — Bekräfta kund #1 live
**Priority:** MAX
**Project:** styrAI-product
**Description:** Gmail-draft skickad till anna.garmen@gmail.com. Bekräfta att hon öppnat setup-guiden och är live. Samla initial feedback. Kund-API-nyckel: e5a93009-8ad9-4b44-9f6f-840d9c8c32da.

### STYRAI-STRIPE-001 — Stripe-integration + självbetjäning
**Priority:** HIGH
**Project:** styrAI-product
**Description:** Flöde: kund betalar via Stripe → webhook skapar projekt + genererar API-nyckel i Supabase → bekräftelsemail automatiskt. Komponenter: Stripe Checkout, /api/stripe-webhook, projekt-provisioning, mail via Resend. Aktiveras när kund #1 är bekräftad stabil.

### STYRAI-NAME-001 — Besluta produktnamn
**Priority:** HIGH
**Project:** styrAI-product
**Description:** Kandidater: Engram (`withengram.ai` $160), Exocortex (`useexocortex.ai` $160), Axon (`useaxon.ai` $160), Mnemo (`usemnemo.ai` $160). När namn klart: köp domän → uppdatera Vercel + alla URLer → ansök MCP-register.

### STYRAI-OPENAPI-001 — openapi.yaml — ChatGPT + Gemini
**Priority:** HIGH
**Project:** styrAI-product
**Description:** openapi.yaml för /api/mcp med alla 8 verktyg. Öppnar GPT Actions + Gemini Extensions. Görs efter kund #1 stabil.

### STYRAI-MCP-REGISTER-001 — Ansök till Anthropics MCP-register
**Priority:** HIGH
**Project:** styrAI-product
**Description:** Kräver stabil domän (blockerare). Bearer auth klart, tools/list klart.

### STYRAI-ROLLBACK-001 — restore_session
**Priority:** MEDIUM
**Project:** styrAI-product
**Description:** Nytt MCP-verktyg. Hämtar state från specifikt session_id.

### TRADESYS-CATALYST-001 — CATALYST_WATCH-lista i dashboard
**Priority:** HIGH
**Project:** tradesys1337
**Description:** Bygg screening: RSI<40 + RelVol<0.5x + drawdown>-15% + pris<$20. Baserat på catalyst-research: RSI<30 dag-1 → avg +84% gain. 84% av explosiva hade vol-spike >2x i 10-dag fönster.

### TRADESYS-AGENT-REPORT-001 — ShadowBot agent-rapport
**Priority:** HIGH
**Project:** tradesys-models
**Description:** Vänta tills 5-10 avslutade trades per agent. Kör rapport, jämför strategier, identifiera bästa agenten för Model v11-träning.

### MODEL-004 — BUY/WAIT-ekvationer i dashboard
**Priority:** HIGH
**Project:** tradesys1337

### MODEL-v11 — Nästa ML-iteration
**Priority:** MEDIUM
**Project:** tradesys-models
**Description:** Träna med agentdata när tillräckligt med trades samlats. Eventuellt orderbook-data som ny feature-kategori.

### SETUP-BATCH-001 — Setup-batch stagnerade projekt
**Priority:** MEDIUM
**Project:** cross-project

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
