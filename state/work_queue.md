# styr-ai — WORK QUEUE
*Uppdaterad: 2026-03-24 global session close*

---

## ACTIVE

### ENTRY-001 — Bygg ENTRY-v1
**Priority:** MAX
**Project:** tradesys1337
**Description:** Nästa CC-session. Läs next_session_brief.md. Analysera score_cases/, föreslå calcEntryScore() som ekvation före kod, kör mot baseline 47.1%.

---

## READY — PRIORITY ORDER

### EXIT-001 — Bygg EXIT-v1
**Priority:** HIGH
**Project:** tradesys1337
**Description:** Efter ENTRY-v1. Krävs för position tracker agent.

### HOLD-ADD-001 — Bygg HOLD-v1 + ADD-v1
**Priority:** HIGH
**Project:** tradesys1337
**Description:** Efter EXIT-v1.

### POSITION-001 — Position tracker agent
**Priority:** HIGH
**Project:** tradesys1337
**Description:** Läs project_memory/position_tracker_brief.md. Bygg efter EXIT/HOLD/ADD-v1. Komponent 2 (historical analysis) kan byggas parallellt.

### VALUE-001 — Scaffold audit
**Priority:** HIGH
**Project:** styr-ai
**Description:** Beslut: bygg färdigt min-analytiker + adminassistent ELLER avveckla. min-analytiker sammanslått — kan repo avvecklas?

### PREDICTIVE-001 — Top gainers fas 2
**Priority:** MEDIUM
**Project:** tradesys1337
**Description:** Watchlist pre-move scanner. Väntar på att case-filer byggs upp av top-gainers-agenten över tid (veckor).

### ADMINASSISTENT-001 — Bygg EA-system
**Priority:** MEDIUM
**Project:** adminassistent
**Description:** Gmail MCP + Calendar MCP + Drive. Läsa mail, föreslå svar, boka möten, skapa presentationer. Separat sprint.

### VIXY-001 — Kalibrera VIXY-trösklar
**Priority:** MEDIUM
**Project:** tradesys1337
**Description:** VIXY ~15 ≈ VIX ~20, VIXY ~25 ≈ VIX ~30. Korrigera i polygon-backtest.js efter ENTRY-v1.

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
| AGENT-002 | Cron trigger | 2026-03-24 | ✅ Byt i GitHub UI |
| AGENT-003 | Approvals-system | 2026-03-24 | ✅ governance/approvals.md |
| DEADLINE-004 | Warner countdown | 2026-03-24 | ✅ Nedprioriterad — Gustav hanterar |
