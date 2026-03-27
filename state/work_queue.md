# styr-ai — WORK QUEUE
*Uppdaterad: 2026-03-27 session 2 close*

---

## ACTIVE
*(inget aktivt)*

---

## READY — PRIORITY ORDER

### STYRAI-ONBOARD-CONFIRM-001 — Bekräfta kund #1 live
**Priority:** MAX
**Project:** styrAI-product
**Description:** Gmail-draft skickad till anna.garmen@gmail.com. Bekräfta att hon öppnat setup-guiden och är live. Samla initial feedback. Kund-API-nyckel: e5a93009-8ad9-4b44-9f6f-840d9c8c32da.

### STYRAI-NAME-001 — Besluta produktnamn
**Priority:** HIGH
**Project:** styrAI-product
**Description:** Gustav bestämmer namn. Kandidater: Engram (`withengram.ai` $160), Exocortex (`useexocortex.ai` $160), Axon (`useaxon.ai` $160), Mnemo (`usemnemo.ai` $160). När namn är klart: köp domän → uppdatera Vercel → uppdatera alla URLer → ansök MCP-register.

### STYRAI-OPENAPI-001 — openapi.yaml — ChatGPT + Gemini
**Priority:** HIGH
**Project:** styrAI-product
**Description:** Skriv openapi.yaml för /api/mcp med alla 8 verktyg. Öppnar GPT Actions + Gemini Extensions simultant. En dags arbete. Görs efter kund #1 är stabil.

### STYRAI-MCP-REGISTER-001 — Ansök till Anthropics MCP-register
**Priority:** HIGH
**Project:** styrAI-product
**Description:** Kräver stabil domän (blockerare). Bearer auth klart, tools/list klart. Kunden hittar styr-ai direkt i Claude Desktop → Install.

### STYRAI-ROLLBACK-001 — restore_session
**Priority:** MEDIUM
**Project:** styrAI-product
**Description:** Nytt MCP-verktyg. Hämtar state från specifikt session_id. Append-only, inget raderas.

### MODEL-004 — BUY/WAIT-ekvationer i dashboard
**Priority:** HIGH
**Project:** tradesys1337
**Description:** calcBuyScore5d() + calcWaitScore5d() i index.html. Körs i CC.

### MODEL-005 — SELL/HOLD-modeller
**Priority:** HIGH
**Project:** tradesys-models

### STYRAI-003 — Fas 3: Stripe + självbetjäning
**Priority:** MEDIUM
**Project:** styrAI-product
**Description:** Aktiveras efter 3-5 kunder.

### SETUP-BATCH-001 — Setup-batch för stagnerade projekt
**Priority:** MEDIUM
**Project:** cross-project
**Description:** Supabase setup + deploy för savage-roar-music, adminassistent.

### TRADESYS-PROD-001 — sectorMomentum i produktion
**Priority:** HIGH
**Project:** tradesys1337

### ADMINASSISTENT-001 — Bygg EA-system
**Priority:** LOW
**Description:** På Gustavs initiativ.

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
| AGENT-PAUSE-001 | coo-agent + autonomous-agent pausade | 2026-03-27 | ✅ Schedule borttagen |
