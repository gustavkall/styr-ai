# styr-ai — WORK QUEUE
*Prioritized list. Updated by Claude at session end. Max one ACTIVE item.*

---

## ACTIVE
*(nothing active)*

---

## READY — PRIORITY ORDER

### SETUP-001 — Supabase tables
**Priority:** HIGH
**Description:** Run scripts/setup-supabase.sql in Supabase SQL Editor. Add env vars to Vercel.

### SETUP-002 — First deploy
**Priority:** HIGH
**Description:** Push to main, verify Vercel deploy, test /api/state endpoint.

### SETUP-003 — Seed initial data
**Priority:** MEDIUM
**Description:** Run scripts/seed.js to populate initial session + learnings.

### VISION-001 — Goals layer
**Priority:** HIGH
**Description:** Bygg ett goals.md i project_memory som definierar projektets syfte och riktning. Systemet ska kunna jämföra work items mot målet och flagga när viktigare saker saknas på listan.

### VISION-002 — Proaktiv prioritering
**Priority:** HIGH
**Description:** System som föreslår work items som inte finns på listan men borde — baserat på goals layer och nuvarande state.
**Dependencies:** VISION-001

### VISION-003 — Blind spot-detektion
**Priority:** MEDIUM
**Description:** Externa signaler korrelerade mot nuvarande arbete. Systemet ser mönster användaren inte ser i stunden.
**Dependencies:** VISION-001, VISION-002

### VISION-004 — Definierade autonomigränser
**Priority:** HIGH
**Description:** Skriv in i governance/system_rules.md exakt vad systemet får göra autonomt och vad som kräver godkännande. Prerequisite för VISION-005.

### VISION-005 — Autonom execution
**Priority:** MAX
**Description:** GitHub Actions + Claude API. Systemet jobbar inom definierade ramar, committar, rapporterar när du vaknar.
**Dependencies:** VISION-004

---

## COMPLETED

| ID | Task | Date | Outcome |
|----|------|------|---------|
