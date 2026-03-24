# styr-ai — SESSION HANDOFF
*Updated automatically at end of every session. Read at next session start.*

---

## LAST SESSION
- **Date:** 2026-03-24
- **Summary:** Stor session. VISION-001/004/005/002 klara. Fyra agenter byggda och live. 6-modells-arkitektur designad. Top gainers agent v2 med full pre-move analys. CLAUDE.md + governance uppdaterat.

---

## VAD SOM BYGGDES

| Vad | Fil | Status |
|-----|-----|--------|
| goals.md | project_memory/goals.md | ✅ |
| system_rules.md | governance/system_rules.md | ✅ |
| autonomous-agent.js | scripts/autonomous-agent.js | ✅ Live, cron 03:00 CET |
| market-regime-agent.js | scripts/market-regime-agent.js | ✅ Live, 08:00 CET vardagar |
| top-gainers-agent.js v2 | scripts/top-gainers-agent.js | ✅ Live, 22:30 CET vardagar |
| memory-integrity-agent.js | scripts/memory-integrity-agent.js | ✅ Live, 04:00 CET söndagar |
| approvals.md | governance/approvals.md | ✅ |
| architecture_changelog.md | governance/architecture_changelog.md | ✅ |
| CLAUDE.md | CLAUDE.md | ✅ Uppdaterad |
| project_context.md ×4 | alla underprojekt | ✅ Berikat med full kontext |
| model_architecture_brief.md | tradesys1337/project_memory/ | ✅ 6-modells-arkitektur |
| next_session_brief.md | tradesys1337/project_memory/ | ✅ CC-instruktioner |

---

## AGENTS LIVE

| Agent | Trigger | Output |
|-------|---------|--------|
| autonomous-agent | 03:00 CET natt | state/autonomous_report.md |
| market-regime-agent | 08:00 CET vardagar | tradesys1337/state/market_regime.md |
| top-gainers-agent v2 | 22:30 CET vardagar | tradesys1337/state/top_gainers_report.md + case-filer |
| memory-integrity-agent | 04:00 CET söndagar | state/memory_integrity_report.md |

## SECRETS PÅ PLATS (styr-ai repo)
- ANTHROPIC_API_KEY ✅
- POLYGON_KEY ✅
- ALPHA_VANTAGE_KEY ✅

---

## BESLUT

- **6 separata modeller** istället för en enda score: ENTRY/PASS/SIZE/HOLD/ADD/EXIT
- **VIX är manuellt filter** — Gustav sätter regim, modellerna beräknar inte autonomt
- **min-analytiker sammanslått med TRADESYS** — agenter körs från styr-ai, output till tradesys1337
- **adminassistent** — ska byggas som interaktivt EA-system (mail, kalender, presentationer)
- **Warner-deadline** nedprioriterad — Gustav hanterar dialogen personligen
- **Top gainers fas 2** (predictive) — väntar på att case-filer byggs upp över tid
- **push_files blockeras** av GitHub MCP på .github/workflows/ — använd GitHub UI
- **Rapport hämtas** via Claude.ai: skriv "visa senaste rapport"

---

## NÄSTA SESSION STARTAR MED

### Claude.ai styr-ai:
1. `session boot` — läser alla state-filer
2. Verifiera att agenter kört korrekt (kolla Actions-fliken)

### CC i ~/tradesys1337:
1. `session boot` — läser next_session_brief.md automatiskt
2. Följ instruktionerna i next_session_brief.md
3. Startprompt för ENTRY-v1:

```
Läs project_memory/next_session_brief.md och project_memory/model_architecture_brief.md

Bygger ENTRY-v1. Analysera case-filer i project_memory/score_cases/
och identifiera vilka komponenter som bäst predicerar CORRECT_BUY vs FALSE_BUY.
Visa förslag på calcEntryScore() som ekvation/tabell INNAN du kodar något.
```
