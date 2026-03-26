# styr-ai — WORK QUEUE
*Uppdaterad: 2026-03-25 session close*

---

## ACTIVE

*(inget aktivt)*

---

## READY — PRIORITY ORDER

### MODEL-002 — Scanner-labels som features
**Priority:** MAX
**Project:** tradesys-models
**Description:** Implementera EMS/FPS/STS-logik i generate-training-data.js. Binära features: ems_triggered, fps_triggered, sts_triggered. Gustavs starkaste edge saknas helt i träningsdatan.

### MODEL-003 — EPS surprise från Polygon
**Priority:** HIGH
**Project:** tradesys-models
**Description:** Hämta earnings data via Polygon API. Kolumn: eps_surprise_pct. Fundamentals är kritisk komponent i EMS/FPS.

### MODEL-004 — Implementera BUY/WAIT-ekvationer i dashboard
**Priority:** HIGH
**Project:** tradesys1337
**Description:** Lägg till calcBuyScore5d() och calcWaitScore5d() i index.html. Confidence-filter bredvid befintlig calcSetupScore(). Vänta tills MODEL-002+003 är klara.

### MODEL-005 — SELL/HOLD-modeller
**Priority:** HIGH
**Project:** tradesys-models
**Description:** Position-simulation i generate-training-data.js. BUY-signal → entry → daglig HOLD/SELL-bedömning. Label: sell_5d = dropp >5% inom 5d.

### MODEL-006 — ADD/SCALE-modeller
**Priority:** MEDIUM
**Project:** tradesys-models
**Description:** ADD: pullback i befintlig position. SCALE: Kelly-baserad positionsstorlek. Troligen handregler — för få case.

### POSITION-001 — Position tracker agent
**Priority:** HIGH
**Project:** tradesys1337
**Description:** Bygg efter SELL/HOLD-modeller klara.

### SCAFFOLD-AUDIT — Avveckla scaffold-projekt
**Priority:** MEDIUM
**Project:** styr-ai
**Description:** min-analytiker redan sammanslaget. adminassistent är tom scaffold. Beslut: avveckla båda repos.

### ADMINASSISTENT-001 — Bygg EA-system
**Priority:** MEDIUM
**Project:** styr-ai
**Description:** Gmail MCP + Calendar MCP + Drive. Separat sprint när modellarbete är klart.

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
| MODEL-001 | Training pipeline + regime-agent | 2026-03-25 | ✅ tradesys-models/, 17,907 samples, BUY/WAIT 5d, daglig regime |
| SECURITY-001 | Repos privata | 2026-03-25 | ✅ tradesys1337 + savage-roar-music privata |


<!-- Auto-added 2026-03-26T03:03:21.949Z -->

### TRADESYS-007 — Implementera min-analytiker som pre-market agent
**Priority:** HIGH
**Project:** tradesys1337
**Description:** Bygg pre-market briefing-agent i TRADESYS. Hämta overnight news, gappers, earnings calendar. Kör automatiskt 08:30 svensk tid.