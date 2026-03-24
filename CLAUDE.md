# CLAUDE.md — styr-ai
*Meta-system för persistent memory och övervakning av alla Gustavs projekt.*
*Uppdateras vid session handoff om systemet förändrats strukturellt.*

---

## Vad är styr-ai

styr-ai är ett autonomt meta-system som sitter ovanför alla underprojekt.
Det övervakar, analyserar, prioriterar och exekverar inom definierade autonomigränser.

**Syfte:** Ge Gustav maximal leverage — han godkänner riktning och scope, systemet exekverar och rapporterar.

**Läs alltid vid boot:**
- `project_memory/goals.md` — systemets syfte och mål
- `governance/system_rules.md` — vad som får göras autonomt
- `state/daily_briefing.md` — dagens briefing från COO-agenten (om den finns)
- `project_memory/next_session_brief.md` — om den finns: specifika instruktioner för denna session
- `governance/architecture_changelog.md` — om CLAUDE.md kan vara inaktuell

---

## Underprojekt

| Projekt | Repo | Syfte |
|---------|------|-------|
| Savage Roar Music | gustavkall/savage-roar-music | Musiklabel, Warner-tvist, Vali Miron, G3ox_em |
| TRADESYS | gustavkall/tradesys1337 | Trading dashboard v37, 6-modells-arkitektur |
| Adminassistent | gustavkall/adminassistent | Executive assistant — mail, kalender, presentationer |

*min-analytiker är sammanslått med TRADESYS — agenter körs från styr-ai, output till tradesys1337.*

Varje underprojekt har `project_memory/project_context.md` — läs den för projektets egna mål.

---

## Agent-schema

| Tid CET | Agent | Output |
|---------|-------|--------|
| 03:00 natt | autonomous-agent | `state/autonomous_report.md` |
| 06:00 vardagar | **coo-agent** | `state/daily_briefing.md` (läs denna på morgonen) |
| 08:00 vardagar | market-regime-agent | `tradesys1337/state/market_regime.md` |
| 22:30 vardagar | top-gainers-agent | `tradesys1337/state/top_gainers_report.md` + case-filer |
| 04:00 söndagar | memory-integrity-agent | `state/memory_integrity_report.md` |

**Secrets som krävs:** `ANTHROPIC_API_KEY`, `POLYGON_KEY`, `ALPHA_VANTAGE_KEY`

---

## Session Boot Protocol (OBLIGATORISK — kör automatiskt)

### Steg 1: styr-ai state
Läs dessa filer från repot:
1. `state/daily_briefing.md` — COO-agentens dagliga briefing (PRIMÄR — läs först)
2. `state/session_handoff.md`
3. `state/work_queue.md`
4. `project_memory/goals.md`
5. `governance/system_rules.md`
6. `project_memory/cross_project_learnings.md`
7. `project_memory/next_session_brief.md` — om den finns, följ instruktionerna där
8. `governance/architecture_changelog.md` — kontrollera om CLAUDE.md behöver uppdateras

### Steg 2: Underprojektens state
För varje underprojekt, läs:
- `project_memory/project_context.md` — projektets syfte och mål (PRIMÄR)
- `state/session_handoff.md` — senaste session
- `state/work_queue.md` — aktiva tasks

### Steg 3: Aggregera
1. Sammanfatta status per projekt mot PROJEKTETS EGNA MÅL
2. Identifiera cross-project patterns, synergier, konflikter
3. Föreslå prioritering baserat på `goals.md`
4. Flagga om något kräver Gustavs uppmärksamhet

---

## Godklänna agent-förslag

COO-agenten eskalerar beslut till `governance/approvals.md`.
Skriv där för att godkänna eller avvisa:
```
APPROVE: ITEM-ID
REJECT: ITEM-ID
```

---

## Session Handoff Protocol (OBLIGATORISK — kör automatiskt vid sessionslut)

1. Uppdatera `state/session_handoff.md` — vad gjordes, beslut, nästa steg
2. Uppdatera `state/work_queue.md` — markera klart, omprioritera
3. Uppdatera `project_memory/decisions.md` — beslut med motivering
4. Uppdatera `project_memory/cross_project_learnings.md` — nya insikter
5. Ta bort `project_memory/next_session_brief.md` om den följts
6. Skriv `state/global_status.md` — samlad projektstatus
7. Kontrollera om CLAUDE.md behöver uppdateras — logga i `governance/architecture_changelog.md`
8. Commit och push:
   ```bash
   git add state/ project_memory/ governance/ CLAUDE.md && git commit -m "state: session handoff YYYY-MM-DD" && git push
   ```

---

## Autonomigränser (kortversion)

Får autonomt: läsa allt, skriva state-filer, lägga till work items, commita till feature-branch.
Kräver godkännande: merga till main, skicka mail, transagera, starta projekt, ändra goals.md/system_rules.md.

---

## Repo-struktur

```
governance/system_rules.md               — Autonomigränser
governance/architecture_changelog.md    — Log när systemet förändrats strukturellt
governance/approvals.md                 — Gustav godkänner/avvisar här
state/daily_briefing.md                  — COO-agentens dagliga briefing (läs varje morgon)
state/session_handoff.md                 — Senaste session
state/work_queue.md                      — Prioriterad tasklista
state/global_status.md                   — Samlad projektstatus
state/autonomous_report.md               — Senaste autonomous-agent rapport
state/market_regime_latest.md            — Senaste regimbedömning
state/top_gainers_latest.md             — Senaste top gainers summary
state/memory_integrity_report.md        — Minneshälsa (söndagar)
project_memory/goals.md                  — Systemets syfte och mål
project_memory/cross_project_learnings.md — Aggregerade insikter
project_memory/decisions.md             — Beslutlogg
project_memory/next_session_brief.md    — Specifika instruktioner för nästa session
scripts/autonomous-agent.js              — Gap-analys, rapport
scripts/coo-agent.js                     — Orchestrerar allt, daily briefing
scripts/market-regime-agent.js           — SPY/VIXY/HYG regime
scripts/top-gainers-agent.js             — Post-mortem + case-filer
scripts/memory-integrity-agent.js        — Minneshälsa
```

---

## Commit-konventioner

```
feat:   ny funktionalitet
fix:    buggfix
state:  session handoff / state-uppdatering
agent:  automatisk agent-körning
coo:    COO-agent körning
brief:  ny/uppdaterad session-brief
docs:   dokumentation
chore:  CLAUDE.md eller architecture_changelog uppdatering
```
