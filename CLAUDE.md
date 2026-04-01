# CLAUDE.md — styr-ai
*Meta-system för persistent memory och övervakning av alla Gustavs projekt.*

> **VIKTIGT:** Claude.ai Project Instructions innehåller bara en URL-referens hit.
> Alla faktiska instruktioner finns i denna fil. När systemet förändras uppdateras denna fil —
> Project Instructions i UI behöver aldrig ändras igen.

---

## Proaktiv systemförbättring — OBLIGATORISK

Gustav ska aldrig behöva komma på systemförbättringar själv.
**Leta aktivt efter och föreslå:** Arkitekturproblem, automatiseringsmöjligheter, fläskhalsar, inkonsekvenser, saknade kopplingar.
**Aldrig:** Vänta på att Gustav identifierar förbättringar själv.

---

## Personlig utveckling — OBLIGATORISK

Läs `project_memory/personal_development.md` vid varje boot. Utmana direkt, uppdatera progress-loggen.

---

## Session-längd — OBLIGATORISK VARNING

> "Vi har jobbat länge — dags för session handoff innan vi tappar kontext. Ska jag köra det nu?"

---

## Flaggningsregel — OBLIGATORISK

Om sessionen påverkar boot-sekvensen, agenter, protokoll eller strukturella förändringar:
1. Uppdatera denna fil
2. Logga i `governance/architecture_changelog.md`
3. Meddela Gustav: *"CLAUDE.md har uppdaterats med: [vad]"*

---

## Loggningsprotokoll

Logga vid ny funktion/endpoint, arkitekturbeslut, långsiktigt beslut, brutet något, slutfört work item.
**API:** https://app.savageroar.se/api/mcp | Bearer: se governance/secrets.md

---

## Vad är styr-ai

Autonomt meta-system ovanför alla underprojekt. Syfte: ge Gustav maximal leverage.

---

## Underprojekt

| Projekt-ID | Display Name | Layer | Repo |
|------------|-------------|-------|------|
| styr-ai | Styr.AI | meta | gustavkall/styr-ai |
| engrams | Engrams | product | gustavkall/engrams |
| tradesys | TRADESYS | product | gustavkall/tradesys1337 |
| tradesys-models | TRADESYS Models | subproject | gustavkall/tradesys-models |
| savage-roar | Savage Roar Music | subproject | gustavkall/savage-roar-music |
| adminassistent | Adminassistent | subproject | gustavkall/adminassistent |

---

## Agent-schema

| Tid CET | Agent | Output | Status |
|---------|-------|--------|--------|
| 03:00 | autonomous-agent | `state/autonomous_report.md` | PAUSAD |
| 06:00 vardagar | coo-agent | `state/daily_briefing.md` | PAUSAD |
| 08:00 vardagar | market-regime-agent | `tradesys1337/state/market_regime.md` | Aktiv |
| 22:30 vardagar | top-gainers-agent | `tradesys1337/state/top_gainers_report.md` | Aktiv |
| 04:00 söndagar | memory-integrity-agent | `state/memory_integrity_report.md` | Aktiv |

---

## ═══════════════════════════════════════
## SESSION BOOT PROTOCOL — OBLIGATORISK
## ═══════════════════════════════════════

### Steg 0: Grundlagar (ALLTID FÖRST)
Hämta och läs via GitHub MCP:
- `GOVERNANCE.md` — grundlagar, gäller alltid
- `PROJECT.md` — detta projekts identitet

### Steg 1: Läs state-filer i ordning

1. `state/global_todo.md` — **SSOT FÖR ALLA TASKS. LÄS ALLTID FÖRST. work_queue.md existerar inte längre.**
2. `state/daily_briefing.md`
3. `state/session_handoff.md`
4. `state/cc_session_log.md` — vad CC gjort senast (absorbera innan du presenterar status)
5. `COMMANDS.md`
6. `project_memory/goals.md`
7. `project_memory/personal_development.md`
8. `project_memory/decisions.md`
9. `project_memory/cross_project_learnings.md`
10. `governance/system_rules.md`
11. `project_memory/next_session_brief.md` — om den finns, följ den

### Steg 2: Underprojektens state
För varje aktivt underprojekt: `PROJECT.md`, `state/session_handoff.md`

### Steg 3: Presentera
```
SESSION BOOT — [PROJEKT] — YYYY-MM-DD

GLOBAL TODO (aktiva ⬜):
[lista från global_todo.md per projekt]

NÄSTA: [första ⬜-task med högst prio]
KRÄVER GUSTAVS UPPMÄRKSAMHET: [om något]
```

---

## GLOBAL TODO — REGLER

**`state/global_todo.md` är single source of truth för alla tasks.**
**`state/work_queue.md` är borttagen — används inte längre.**

- Läses av Claude.ai vid boot
- Läses av CC vid `session boot`
- Uppdateras av båda vid session close/sync
- Statusflaggor: ⬜ ej klar | 🔄 pågår/blockerad | ✅ klar
- Opt-out: `→ Todo-förslag: [ID] — [beskr]. Lägger till om du inte invänder.`

---

## ════════════════════════════════════
## SYNC PROTOCOL — OBLIGATORISK
## ════════════════════════════════════

**CA skriver, CC läser. CC skriver, CA läser. Du (Gustav) gör ingenting.**

| Fil | Ägare | Syfte |
|-----|-------|-------|
| `state/global_todo.md` | Båda uppdaterar | SSOT för alla tasks |
| `state/active_context.md` | CA skriver → CC läser | CA:s beslut och kontext till CC |
| `state/cc_session_log.md` | CC skriver → CA läser vid boot | CC:s rapport till CA |
| `state/session_handoff.md` | CA skriver | Sessionsöverlämning |

Uppdatera `state/active_context.md` och `state/global_todo.md` **direkt** vid beslut eller statusändring.

---

## ═══════════════════════════════════════════
## SESSION HANDOFF PROTOCOL — OBLIGATORISK
## ═══════════════════════════════════════════

**Alla steg. Alltid. I denna ordning.**

### Steg 1 — Uppdatera styr-ai state-filer
- `state/global_todo.md` — ⬜→✅ för slutförda, lägg till nya **(ALLTID FÖRST)**
- `state/session_handoff.md` — vad gjordes, teknisk state
- `project_memory/decisions.md` — APPEND beslut med motivering
- `project_memory/cross_project_learnings.md` — APPEND insikter

### Steg 2 — Skriv active_context.md
```
## SENASTE BESLUT FRÅN CLAUDE.AI — YYYY-MM-DD
- [beslut med kort motivering]

## GLOBAL TODO (aktiva ⬜)
[lista från global_todo.md]

## TEKNISK STATE
[per projekt]

## ÖPPNA FRÅGOR FÖR CC
- [frågor CC behöver svara på]
```

### Steg 3 — Commit och push
### Steg 4 — Bekräfta till Gustav

---

## Autonomigränser

Se GOVERNANCE.md för grundregler. Projektspecifika gränser i PROJECT.md.

---

## Repo-struktur

```
GOVERNANCE.md                    <- GRUNDLAGAR
PROJECT.md                       <- Projektidentitet
COMMANDS.md                      <- Alla kommandon
state/global_todo.md             <- MASTER TODO ALLA PROJEKT (SSOT)
state/active_context.md          <- CA skriver → CC läser
state/cc_session_log.md          <- CC skriver → CA läser vid boot
state/session_handoff.md         <- CA:s sessionsöverlämning
state/daily_briefing.md          <- COO-agentens dagliga briefing
project_memory/
governance/
scripts/
```

---

## Commit-konventioner
```
feat / fix / state / agent / coo / brief / docs / chore
```
