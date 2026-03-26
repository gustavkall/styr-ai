# styr-ai — WORK QUEUE
*Uppdaterad: 2026-03-26 session 2 close*

---

## ACTIVE
*(inget aktivt)*

---

## READY — PRIORITY ORDER

### STYRAI-ONBOARD-001 — Onboarda kund #1
**Priority:** MAX
**Project:** styrAI-product
**Description:** Skicka API-nyckel (e5a93009-8ad9-4b44-9f6f-840d9c8c32da) + CLAUDE.md-template + setup-guide URL. Instruera om agent_id. Bekräfta live. Samla feedback.

### STYRAI-DOMAIN-001 — Domän
**Priority:** HIGH
**Project:** styrAI-product
**Description:** styr.ai tagen. Kolla: usestyr.ai, trystyr.ai, styrapp.ai, styr.dev, styr-ai.com. Köp och peka på Vercel.

### MODEL-004 — BUY/WAIT-ekvationer i dashboard
**Priority:** HIGH
**Project:** tradesys1337
**Description:** calcBuyScore5d() + calcWaitScore5d() i index.html. Körs parallellt i CC.

### STYRAI-ROLLBACK-001 — restore_session
**Priority:** MEDIUM
**Project:** styrAI-product
**Description:** Nytt MCP-verktyg. Hämtar state från specifikt session_id. Returnerar som nuvarande state. Append-only, inget raderas.

### MODEL-005 — SELL/HOLD-modeller
**Priority:** HIGH
**Project:** tradesys-models
**Description:** Position-simulation i generate-training-data.js.

### STYRAI-003 — Fas 3: Stripe + självbetjäning
**Priority:** MEDIUM
**Project:** styrAI-product
**Description:** Aktiveras efter 3-5 kunder. Stripe, automatisk provisioning, admin-dashboard.

### STYRAI-004 — Fas 4: Distribution
**Priority:** MEDIUM
**Project:** styrAI-product
**Description:** Ansökan Anthropics MCP-register, npm-paket (npx styr-ai init).

### ADMINASSISTENT-001 — Bygg EA-system
**Priority:** LOW
**Project:** styr-ai
**Description:** Gmail + Calendar + Drive. På Gustavs initiativ.

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
| MODEL-002 | Scanner-labels EMS/FPS/STS | 2026-03-26 | ✅ Bekräftat av Gustav |
| MODEL-003 | EPS surprise Polygon | 2026-03-26 | ✅ Bekräftat av Gustav |
| BUGFIX-001 | fetch-state.js crash | 2026-03-26 | ✅ |
| STYRAI-FAS1 | Fas 1 — kärnprodukt | 2026-03-26 | ✅ MCP-server live, 8 verktyg |
| STYRAI-FAS2 | Fas 2 — sajt, setup, dashboard, remote MCP, episodiskt minne, agent_id | 2026-03-26 | ✅ |
| STYRAI-LASTTEST | Lasttest 8/8 | 2026-03-26 | ✅ Inga race conditions, 502ms avg |
