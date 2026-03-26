# styr-ai — WORK QUEUE
*Uppdaterad: 2026-03-26 session close*

---

## ACTIVE

*(inget aktivt)*

---

## READY — PRIORITY ORDER

### STYRAI-001 — Fas 2: Sajt och onboarding
**Priority:** MAX
**Project:** styrAI-product
**Description:** Landningssida med riktig copy, setup-guide (max 10 min onboarding), read-only dashboard för kund. Fas 1 är klar.

### STYRAI-002 — Onboarda kund #1
**Priority:** MAX
**Project:** styrAI-product
**Description:** Skicka API-nyckel (e5a93009-8ad9-4b44-9f6f-840d9c8c32da) + CLAUDE.md-template. Verifiera live. Samla feedback.

### STYRAI-003 — Domän
**Priority:** HIGH
**Project:** styrAI-product
**Description:** styr.ai är tagen. Kolla: usestyr.ai, trystyr.ai, styr-ai.com, styrapp.ai

### MODEL-004 — BUY/WAIT-ekvationer i dashboard
**Priority:** HIGH
**Project:** tradesys1337
**Description:** calcBuyScore5d() och calcWaitScore5d() i index.html. Confidence-filter bredvid calcSetupScore().

### MODEL-005 — SELL/HOLD-modeller
**Priority:** HIGH
**Project:** tradesys-models
**Description:** Position-simulation i generate-training-data.js.

### STYRAI-004 — Fas 3: Stripe + självbetjäning
**Priority:** MEDIUM
**Project:** styrAI-product
**Description:** Aktiveras efter 3-5 kunder. Stripe-integration, automatisk provisioning, admin-dashboard.

### STYRAI-005 — Fas 4: Distribution
**Priority:** MEDIUM
**Project:** styrAI-product
**Description:** Ansökan till Anthropics MCP-register, npm-paket (npx styr-ai init), integrationsguider.

### ADMINASSISTENT-001 — Bygg EA-system
**Priority:** LOW
**Project:** styr-ai
**Description:** Gmail MCP + Calendar MCP + Drive. Tas på Gustavs initiativ.

---

## COMPLETED

| ID | Task | Date | Outcome |
|----|------|------|--------|
| VISION-001 | Goals layer | 2026-03-24 | ✅ project_memory/goals.md |
| VISION-004 | Autonomigränser | 2026-03-24 | ✅ governance/system_rules.md |
| VISION-005 | Autonom execution | 2026-03-24 | ✅ 5 agenter live |
| COO-001 | COO-agent | 2026-03-24 | ✅ daily_briefing.md 06:00 CET |
| ARCH-001 | URL-first arkitektur | 2026-03-24 | ✅ Alla CLAUDE.md uppdaterade |
| ARCH-002 | Proaktiv förbättringsregel | 2026-03-24 | ✅ Alla CLAUDE.md uppdaterade |
| AGENT-001 | Agent deduplicering | 2026-03-24 | ✅ ID-check i autonomous-agent.js |
| AGENT-003 | Approvals-system | 2026-03-24 | ✅ governance/approvals.md |
| MODEL-001 | Training pipeline + regime-agent | 2026-03-25 | ✅ 48,976 samples, BUY/WAIT 5d |
| SECURITY-001 | Repos privata | 2026-03-25 | ✅ tradesys1337 + savage-roar-music |
| MODEL-002 | Scanner-labels (EMS/FPS/STS) | 2026-03-26 | ✅ Bekräftat byggt av Gustav |
| MODEL-003 | EPS surprise från Polygon | 2026-03-26 | ✅ Bekräftat byggt av Gustav |
| BUGFIX-001 | fetch-state.js MARKNADSREGIM crash | 2026-03-26 | ✅ Fixad i tradesys1337 |
| STYRAI-FAS1 | styrAI-product Fas 1 | 2026-03-26 | ✅ MCP-server live, 6 verktyg, embeddings, kund #1 provisionerad |
