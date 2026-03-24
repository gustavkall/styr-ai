# styr-ai — WORK QUEUE
*Prioritized list. Updated by Claude at session end. Max one ACTIVE item.*

---

## ACTIVE
*(nothing active)*

---

## READY — PRIORITY ORDER

### VISION-002 — Proaktiv prioritering
**Priority:** HIGH
**Description:** System som föreslår work items som inte finns på listan men borde — baserat på goals layer och nuvarande state.
**Dependencies:** VISION-001 ✅

### VISION-003 — Blind spot-detektion
**Priority:** MEDIUM
**Description:** Externa signaler korrelerade mot nuvarande arbete. Systemet ser mönster användaren inte ser i stunden.
**Dependencies:** VISION-001 ✅, VISION-002

### VISION-005 — Autonom execution
**Priority:** MAX
**Description:** GitHub Actions + Claude API. Systemet jobbar inom definierade ramar, committar, rapporterar när du vaknar.
**Dependencies:** VISION-004 ✅
**Next step:** Designa GitHub Actions workflow + Claude API-anrop + rapporteringsformat

### SETUP-001 — Supabase tables
**Priority:** LOW (avvaktar tills faktiskt behov uppstår)
**Description:** Run scripts/setup-supabase.sql in Supabase SQL Editor. Add env vars to Vercel.
**Note:** GitHub persistent memory räcker. Supabase ger ingen extra nytta just nu.

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


<!-- Auto-added by agent 2026-03-24T09:59:50.524Z -->
### DEADLINE-001 — Deadline radar system
**Priority:** HIGH
**Project:** styr-ai
**Description:** Automatisk bevakning av juridiska deadlines, kontraktsfrister och kritiska datum. Eskalerar prioritet när deadlines närmar sig.

### INTEGRATION-001 — Cross-project API design
**Priority:** MEDIUM
**Project:** styr-ai
**Description:** Designa hur tradesys1337 och min-analytiker ska dela data. Centraliserad Supabase-arkitektur för alla projekt.

<!-- Auto-added by agent 2026-03-24T10:02:21.475Z -->

### DEADLINE-001 — Deadline radar system
**Priority:** HIGH
**Project:** styr-ai
**Description:** Automatisk bevakning av juridiska deadlines, kontraktsfrister och kritiska datum. Eskalerar prioritet när deadlines närmar sig.

### INTEGRATION-001 — Cross-project API design
**Priority:** MEDIUM
**Project:** styr-ai
**Description:** Designa hur tradesys1337 och min-analytiker ska dela data. Centraliserad Supabase-arkitektur för alla projekt.

<!-- Auto-added by agent 2026-03-24T10:20:01.527Z -->

### DEADLINE-002 — Warner-deadline tracking system
**Priority:** HIGH
**Project:** savage-roar-music
**Description:** Automatiskt system som bevakar 22 maj deadline, eskalerar 30/14/7 dagar före. GitHub Actions + Claude API notification.

### VALUE-001 — Project value audit
**Priority:** MEDIUM
**Project:** styr-ai
**Description:** Analysera om min-analytiker och adminassistent ska byggas färdigt eller avvecklas. Tre scaffold-projekt ger ingen ROI.

### MORNING-001 — TRADESYS morning verification
**Priority:** MEDIUM
**Project:** tradesys1337
**Description:** GitHub Actions workflow som verifierar scanners 15:25 CET, rapporterar status. Automatisera WQ-008.

<!-- Auto-added 2026-03-24T11:03:08.741Z -->

### DEADLINE-002 — Warner-deadline tracking system
**Priority:** HIGH
**Project:** savage-roar-music
**Description:** Automatiskt system som bevakar 22 maj deadline, eskalerar 30/14/7 dagar före. GitHub Actions + Claude API notification.

### VALUE-001 — Project value audit
**Priority:** MEDIUM
**Project:** styr-ai
**Description:** Analysera om min-analytiker och adminassistent ska byggas färdigt eller avvecklas. Tre scaffold-projekt ger ingen ROI.

### MORNING-001 — TRADESYS morning verification
**Priority:** MEDIUM
**Project:** tradesys1337
**Description:** GitHub Actions workflow som verifierar scanners 15:25 CET, rapporterar status. Automatisera WQ-008.