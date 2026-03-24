# Architecture Changelog
*Loggas när systemet förändras strukturellt. Signalerar att CLAUDE.md kan behöva uppdateras.*
*Append-only. Nyast överst.*

---

### 2026-03-24 — COO-agent byggd
**Vad:** `scripts/coo-agent.js` + `.github/workflows/coo-agent.yml`. Orchestrerar alla specialistagenter, skriver `state/daily_briefing.md` kl 06:00 CET vardagar. Eskalerar beslut till `governance/approvals.md`.
**Påverkar CLAUDE.md:** Agent-schema, repo-struktur, boot protocol (daily_briefing som primärkort)
**Åtgärd:** Uppdaterad ✅

### 2026-03-24 — Fem agenter live
**Vad:** autonomous-agent (cron 03:00), coo-agent (06:00), market-regime-agent (08:00), top-gainers-agent (22:30), memory-integrity-agent (sön 04:00)
**Påverkar CLAUDE.md:** Agent-schema-sektion tillagd
**Åtgärd:** Uppdaterad ✅

### 2026-03-24 — top-gainers-agent v2
**Vad:** Full pre-move analys: 25d OHLCV, alla tekniska indikatorer, macro (SPY/VIXY/HYG), nyheter via Polygon, fundamentals via Alpha Vantage, ENTRY-score 1/3/5 dagar före move, Claude post-mortem, auto-genererade case-filer för modell-träning.
**Påverkar CLAUDE.md:** Agent-beskrivning
**Åtgärd:** Uppdaterad ✅

### 2026-03-24 — min-analytiker sammanslått med TRADESYS
**Vad:** min-analytiker är inte längre ett separat projekt. Agenternas output går direkt till tradesys1337/state/. TRADESYS project_context uppdaterad.
**Påverkar CLAUDE.md:** Underprojektstabell
**Åtgärd:** Uppdaterad ✅

### 2026-03-24 — CLAUDE.md uppdaterad till fullständigt tillstånd
**Vad:** CLAUDE.md reskriven med goals.md, project_context.md, autonomous agent, 6-modells-arkitektur, next_session_brief-protokoll, architecture_changelog
**Påverkar CLAUDE.md:** Hela dokumentet
**Åtgärd:** Uppdaterad ✅

### 2026-03-24 — Architecture changelog skapad
**Vad:** `governance/architecture_changelog.md` skapad.
**Påverkar CLAUDE.md:** Boot protocol, Handoff protocol, Repo-struktur
**Åtgärd:** Uppdaterad ✅

### 2026-03-24 — goals.md + system_rules.md + approvals.md
**Vad:** VISION-001 + VISION-004 + godkännandesystem via approvals.md
**Påverkar CLAUDE.md:** Boot protocol, autonomigränser
**Åtgärd:** Uppdaterad ✅
