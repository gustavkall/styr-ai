# Architecture Changelog
*Loggas när systemet förändras strukturellt. Signalerar att CLAUDE.md kan behöva uppdateras.*
*Append-only. Nyast överst.*

---

### 2026-04-01 — work_queue.md borttagen
**Vad:** `state/work_queue.md` raderad. `state/global_todo.md` är nu ensam SSOT för alla tasks. CLAUDE.md uppdaterad: referens till work_queue borttagen från boot-protokoll och repo-struktur. Ansvarsmodell CA/CC dokumenterad explicit i sync-tabellen.
**Bakgrund:** Drift uppstod när CA bootade mot work_queue.md istället för global_todo.md — två parallella filer med överlappande ansvar skapade inkonsekvens.
**Påverkar CLAUDE.md:** Boot protocol steg 1, GLOBAL TODO-sektion, repo-struktur
**Åtgärd:** Uppdaterad ✅

---

### 2026-03-24 — COO-agent byggd
**Vad:** `scripts/coo-agent.js` + `.github/workflows/coo-agent.yml`. Orchestrerar alla specialistagenter, skriver `state/daily_briefing.md` kl 06:00 CET vardagar. Eskalerar beslut till `governance/approvals.md`.
**Påverkar CLAUDE.md:** Agent-schema, repo-struktur, boot protocol (daily_briefing som primärkort)
**Åtgärd:** Uppdaterad ✅

### 2026-03-24 — Fem agenter live
**Vad:** autonomous-agent (cron 03:00), coo-agent (06:00), market-regime-agent (08:00), top-gainers-agent (22:30), memory-integrity-agent (sön 04:00)
**Påverkar CLAUDE.md:** Agent-schema-sektion tillagd
**Åtgärd:** Uppdaterad ✅

### 2026-03-24 — min-analytiker sammanslått med TRADESYS
**Vad:** min-analytiker är inte längre ett separat projekt.
**Påverkar CLAUDE.md:** Underprojektstabell
**Åtgärd:** Uppdaterad ✅

### 2026-03-24 — goals.md + system_rules.md + approvals.md
**Vad:** VISION-001 + VISION-004 + godkännandesystem via approvals.md
**Påverkar CLAUDE.md:** Boot protocol, autonomigränser
**Åtgärd:** Uppdaterad ✅
