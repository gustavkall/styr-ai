# styr-ai — SESSION HANDOFF
*Global session close: 2026-03-24*

---

## DENNA SESSION

### Byggt
- 5 agenter live: autonomous, coo, market-regime, top-gainers v2, memory-integrity
- COO-agent: orchestrerar allt, skriver daily_briefing.md 06:00 CET
- Top gainers v2: full pre-move analys (25d OHLCV, alla indikatorer, macro, nyheter, fundamentals, case-filer)
- Memory integrity agent: söndagar 04:00, kontrollerar minneshälsa
- Approvals-system: governance/approvals.md
- Architecture changelog: governance/architecture_changelog.md
- Position tracker brief: tradesys1337/project_memory/position_tracker_brief.md
- Proaktiv förbättringsregel: alla CLAUDE.md uppdaterade
- URL-first arkitektur: Project Instructions pekar på CLAUDE.md i repo
- work_queue rengjord och deduplicerad

### Beslut
- 6 separata modeller: ENTRY/PASS/SIZE/HOLD/ADD/EXIT-v1
- VIX är manuellt filter — Gustav sätter regim
- min-analytiker sammanslått med TRADESYS
- Warner-deadline nedprioriterad — Gustav hanterar personligen
- Top gainers fas 2 (predictive) — väntar på case-filer från agenten
- Position tracker — byggs efter EXIT-v1
- push_files blockeras på .github/workflows/ — måste göras via GitHub UI

---

## NÄSTA SESSION

### Claude.ai styr-ai:
```
session boot
```
Läser daily_briefing.md (om COO kört), sedan full state.

### CC i ~/tradesys1337:
```bash
cd ~/tradesys1337 && claude
session boot
```
Läser next_session_brief.md automatiskt. Följ instruktionerna.

Startprompt för ENTRY-v1:
```
Läs project_memory/next_session_brief.md och project_memory/model_architecture_brief.md

Vi bygger ENTRY-v1. Analysera case-filer i project_memory/score_cases/
och identifiera vilka komponenter som bäst predicerar CORRECT_BUY vs FALSE_BUY.
Visa förslag på calcEntryScore() som ekvation/tabell INNAN du kodar något.
```

---

## AGENT-SCHEMA

| Tid | Agent | Output |
|-----|-------|--------|
| 03:00 CET natt | autonomous-agent | state/autonomous_report.md |
| 06:00 CET vardagar | coo-agent | state/daily_briefing.md |
| 08:00 CET vardagar | market-regime-agent | tradesys1337/state/market_regime.md |
| 22:30 CET vardagar | top-gainers-agent v2 | tradesys1337/state/top_gainers_report.md |
| 04:00 CET söndagar | memory-integrity-agent | state/memory_integrity_report.md |

**Secrets på plats:** ANTHROPIC_API_KEY, POLYGON_KEY, ALPHA_VANTAGE_KEY

---

## KRITISKA DATUM
- **22 maj 2026:** Warner cure period (59 dagar) — Gustav hanterar
