# styr-ai — WORK QUEUE
*Prioritized list. Updated by Claude at session end. Max one ACTIVE item.*
*Agent lägger bara till items som inte redan finns (ID-check).*

---

## ACTIVE

### DEADLINE-004 — Warner deadline countdown
**Priority:** MAX
**Project:** savage-roar-music
**Description:** Cure period löper ut 22 maj 2026 — 59 dagar kvar. GitHub Actions som beräknar dagar kvar, eskalerar automatiskt vid 30/14/7 dagar, uppdaterar savage-roar work_queue prioritet. Inget annat är viktigare just nu.

---

## READY — PRIORITY ORDER

### VALUE-001 — Scaffold audit — bygg eller kill
**Priority:** HIGH
**Project:** styr-ai
**Description:** Formellt beslut: bygg färdigt min-analytiker + adminassistent ELLER avveckla. Tre scaffold-projekt drar fokus och kontext utan att generera värde. Gustav beslutar, systemet exekverar.

### AGENT-001 — Fixa agent-deduplicering
**Priority:** HIGH
**Project:** styr-ai
**Description:** Agent appendar samma work items upprepade gånger. Lägg till ID-check i autonomous-agent.js: läs befintlig work_queue, skippa items med ID som redan finns.

### AGENT-002 — Ändra agent-trigger från push till cron
**Priority:** HIGH
**Project:** styr-ai
**Description:** Agenten triggar på varje push — inklusive sina egna commits — vilket skapar en loop. Ändra till cron (natt 03:00 CET) + manuell dispatch. Push-trigger behålls bara för hotfix-brancharna.

### AGENT-003 — Approvals-system
**Priority:** HIGH
**Project:** styr-ai
**Description:** Gustav ska kunna godkänna/avvisa agent-förslag utan att öppna en chat. Lösning: governance/approvals.md där Gustav skriver APPROVE: ID eller REJECT: ID. Agenten läser filen och agerar.

### MODEL-001 — VIXY calibration fix
**Priority:** HIGH
**Project:** tradesys1337
**Description:** VIXY≠VIX i polygon-backtest.js. VIXY ~15 ≈ VIX ~20, VIXY ~25 ≈ VIX ~30. Kalibrera om trösklarna eller ersätt med manuell regime-input (se model_architecture_brief.md).

### VISION-002 — Proaktiv prioritering
**Priority:** MEDIUM
**Description:** System som föreslår work items som inte finns på listan men borde — baserat på goals layer och nuvarande state.
**Dependencies:** VISION-001 ✅

### VISION-003 — Blind spot-detektion
**Priority:** MEDIUM
**Description:** Externa signaler korrelerade mot nuvarande arbete. Systemet ser mönster användaren inte ser i stunden.
**Dependencies:** VISION-001 ✅, VISION-002

### MORNING-001 — TRADESYS morning verification
**Priority:** MEDIUM
**Project:** tradesys1337
**Description:** GitHub Actions workflow som verifierar scanners 15:25 CET, rapporterar status. Automatiserar WQ-008.

### SETUP-001 — Supabase tables
**Priority:** LOW
**Description:** Run scripts/setup-supabase.sql in Supabase SQL Editor. Add env vars to Vercel.
**Note:** GitHub persistent memory räcker. Avvaktar tills faktiskt behov uppstår.

### SETUP-002 — First deploy
**Priority:** LOW
**Description:** Push to main, verify Vercel deploy, test /api/state endpoint.

### SETUP-003 — Seed initial data
**Priority:** LOW
**Description:** Run scripts/seed.js to populate initial session + learnings.

---

## COMPLETED

| ID | Task | Date | Outcome |
|----|------|------|--------|
| VISION-001 | Goals layer | 2026-03-24 | ✅ project_memory/goals.md skriven |
| VISION-004 | Autonomigränser | 2026-03-24 | ✅ governance/system_rules.md skriven |
| VISION-005 | Autonom execution | 2026-03-24 | ✅ autonomous-agent.js + workflow live |
| VISION-002 | Gap-analys i agent | 2026-03-24 | ✅ Inbyggt i autonomous-agent.js |


<!-- Auto-added 2026-03-24T13:16:32.588Z -->

### DEADLINE-004 — Warner deadline countdown
**Priority:** MAX
**Project:** savage-roar-music
**Description:** Cure period löper ut 22 maj 2026 — 59 dagar kvar. GitHub Actions som beräknar dagar kvar, eskalerar automatiskt vid 30/14/7 dagar, uppdaterar savage-roar work_queue prioritet. Inget annat är viktigare just nu.

### VALUE-001 — Scaffold audit — bygg eller kill
**Priority:** HIGH
**Project:** styr-ai
**Description:** Formellt beslut: bygg färdigt min-analytiker + adminassistent ELLER avveckla. Tre scaffold-projekt drar fokus och kontext utan att generera värde. Gustav beslutar, systemet exekverar.

### MODEL-001 — VIXY calibration fix
**Priority:** HIGH
**Project:** tradesys1337
**Description:** VIXY≠VIX i polygon-backtest.js. VIXY ~15 ≈ VIX ~20, VIXY ~25 ≈ VIX ~30. Kalibrera om trösklarna eller ersätt med manuell regime-input (se model_architecture_brief.md).