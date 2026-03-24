# CLAUDE.md — styr-ai
*Meta-system för persistent memory och övervakning av alla Gustavs projekt.*

> **VIKTIGT:** Claude.ai Project Instructions för detta projekt innehåller bara en URL-referens hit.
> Alla faktiska instruktioner finns i denna fil. När systemet förändras uppdateras denna fil —
> Project Instructions i UI behöver aldrig ändras igen.

---

## Flaggningsregel — OBLIGATORISK

**Om denna session skapar något som påverkar:**
- Boot-sekvensen (nya filer som ska läsas)
- Nya agenter eller workflows
- Nya protokoll eller autonomigränser
- Strukturella förändringar i repot

**Gör då alltid:**
1. Uppdatera denna fil (CLAUDE.md)
2. Logga i `governance/architecture_changelog.md`
3. Meddela Gustav explicit i slutet av sessionen: *"CLAUDE.md har uppdaterats med: [vad]"*

Detta ersätter behovet av att manuellt uppdatera Project Instructions i Claude.ai UI.

---

## Vad är styr-ai

styr-ai är ett autonomt meta-system som sitter ovanför alla underprojekt.
Det övervakar, analyserar, prioriterar och exekverar inom definierade autonomigränser.

**Syfte:** Ge Gustav maximal leverage — han godkänner riktning och scope, systemet exekverar och rapporterar.

**Läs alltid vid boot:**
- `project_memory/goals.md` — systemets syfte och mål
- `governance/system_rules.md` — vad som får göras autonomt
- `state/daily_briefing.md` — COO-agentens dagliga briefing (om den finns)
- `project_memory/next_session_brief.md` — om den finns: specifika instruktioner
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

**Secrets:** `ANTHROPIC_API_KEY`, `POLYGON_KEY`, `ALPHA_VANTAGE_KEY`

---

## Session Boot Protocol (OBLIGATORISK — kör automatiskt)

### Steg 1: styr-ai state
1. `state/daily_briefing.md` — COO-briefing (PRIMÄR — läs först)
2. `state/session_handoff.md`
3. `state/work_queue.md`
4. `project_memory/goals.md`
5. `governance/system_rules.md`
6. `project_memory/cross_project_learnings.md`
7. `project_memory/next_session_brief.md` — om den finns, följ instruktionerna
8. `governance/architecture_changelog.md` — kontrollera om CLAUDE.md är aktuell

### Steg 2: Underprojektens state
För varje underprojekt:
- `project_memory/project_context.md` — projektets egna mål (PRIMÄR)
- `state/session_handoff.md`
- `state/work_queue.md`

### Steg 3: Aggregera och presentera
1. Status per projekt mot PROJEKTETS EGNA MÅL
2. Cross-project patterns, synergier, konflikter
3. Prioritering baserat på `goals.md`
4. Flagga vad som kräver Gustavs uppmärksamhet

---

## Godkänna agent-förslag

COO-agenten eskalerar beslut till `governance/approvals.md`.
```
APPROVE: ITEM-ID
REJECT: ITEM-ID
```

---

## Session Handoff Protocol (OBLIGATORISK — kör automatiskt vid sessionslut)

1. Uppdatera `state/session_handoff.md`
2. Uppdatera `state/work_queue.md`
3. Uppdatera `project_memory/decisions.md`
4. Uppdatera `project_memory/cross_project_learnings.md`
5. Ta bort `project_memory/next_session_brief.md` om den följts
6. Skriv `state/global_status.md`
7. **Kontrollera flaggningsregeln** — uppdatera CLAUDE.md om strukturellt nytt tillkommit
8. Commit och push:
   ```bash
   git add state/ project_memory/ governance/ CLAUDE.md && git commit -m "state: session handoff YYYY-MM-DD" && git push
   ```

---

## Autonomigränser

Får autonomt: läsa allt, skriva state-filer, lägga till work items, commita till feature-branch.
Kräver godkännande: merga till main, skicka mail, transagera, starta projekt, ändra goals.md/system_rules.md.

---

## Repo-struktur

```
governance/system_rules.md
governance/architecture_changelog.md
governance/approvals.md
state/daily_briefing.md           — läs varje morgon
state/session_handoff.md
state/work_queue.md
state/global_status.md
state/autonomous_report.md
state/market_regime_latest.md
state/top_gainers_latest.md
state/memory_integrity_report.md
project_memory/goals.md
project_memory/cross_project_learnings.md
project_memory/decisions.md
project_memory/next_session_brief.md
scripts/autonomous-agent.js
scripts/coo-agent.js
scripts/market-regime-agent.js
scripts/top-gainers-agent.js
scripts/memory-integrity-agent.js
```

---

## Commit-konventioner
```
feat / fix / state / agent / coo / brief / docs / chore
```
