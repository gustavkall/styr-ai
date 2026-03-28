# CLAUDE.md — styr-ai
*Meta-system för persistent memory och övervakning av alla Gustavs projekt.*

> **VIKTIGT:** Claude.ai Project Instructions innehåller bara en URL-referens hit.
> Alla faktiska instruktioner finns i denna fil. När systemet förändras uppdateras denna fil —
> Project Instructions i UI behöver aldrig ändras igen.

---

## Proaktiv systemförbättring — OBLIGATORISK

Gustav ska aldrig behöva komma på systemförbättringar själv. Det är Claudes ansvar att se dem först.

**Leta aktivt efter och föreslå:** Arkitekturproblem, automatiseringsmöjligheter, fläskhalsar, inkonsekvenser, saknade kopplingar.
**Aldrig:** Vänta på att Gustav identifierar förbättringar själv.

---

## Personlig utveckling — OBLIGATORISK

Läs `project_memory/personal_development.md` vid varje boot. Utmana direkt, uppdatera progress-loggen, fråga om progress när relevant.

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

*Alla projekt registrerade i `system_projects`-tabellen (Supabase hxikaojzwjtztyuwlxra).*

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
```
Hämta och läs: https://raw.githubusercontent.com/gustavkall/styr-ai/main/GOVERNANCE.md
Hämta och läs: PROJECT.md (detta repo)
```
GOVERNANCE.md gäller alltid. Kan inte overridas av något annat.

### Steg 1: Läs state-filer i ordning

1. `state/daily_briefing.md`
2. `state/session_handoff.md`
3. `state/work_queue.md`
4. `state/cc_session_log.md`
5. `state/engrams_todo.md` — **ENGRAMS MASTER TODO**
6. `COMMANDS.md` — **ALLA KOMMANDON**
7. `project_memory/goals.md`
8. `project_memory/personal_development.md`
9. `project_memory/decisions.md`
10. `project_memory/cross_project_learnings.md`
11. `governance/system_rules.md`
12. `project_memory/next_session_brief.md` — om den finns, följ instruktionerna

### Steg 2: Underprojektens state
För varje aktivt underprojekt: `PROJECT.md`, `state/session_handoff.md`, `state/work_queue.md`

### Steg 3: Presentera alltid detta format

```
SESSION BOOT — STYR-AI [eller projekt-namn om fokuserad boot]
Datum: YYYY-MM-DD

STATUS: [projekt] — [en mening]
...

ENGRAMS TODO:
| # | Task | Status |
[hela tabellen från engrams_todo.md]

NÄSTA: [första ⬜-task]
KRÄVER GUSTAVS UPPMÄRKSAMHET: [om något]
```

---

## ENGRAMS TODO — REGLER

**Lägg till direkt när:** Gustav godkänner ("ja", "kör"), uppföljningstask uppstår, blockerare identifieras.
**Opt-out när Claude identifierar möjlig task:** `→ Todo-förslag: [ID] — [beskr]. Lägger till om du inte invänder.`
**Aldrig:** Lösa idéer, implementation-detaljer, hypotetiska scenarion.

Statusflaggor: ⬜ ej klar | 🔄 pågår/blockerad | ✅ klar

---

## ════════════════════════════════════
## SYNC PROTOCOL — OBLIGATORISK
## ════════════════════════════════════

Uppdatera `state/active_context.md` direkt vid beslut, task-statusändring, prioritetsändring.
active_context.md innehåller alltid: engrams todo-tabell, senaste beslut, teknisk state, öppna frågor, sync-alias.

---

## ═══════════════════════════════════════════
## SESSION HANDOFF PROTOCOL — OBLIGATORISK
## ═══════════════════════════════════════════

**Alla sex. Alltid.**

1. `state/session_handoff.md`
2. `state/work_queue.md`
3. `state/engrams_todo.md` — ⬜→✅ för slutförda, lägg till nya
4. `project_memory/decisions.md` — APPEND beslut med motivering
5. `project_memory/cross_project_learnings.md` — APPEND insikter
6. `state/active_context.md` — inkl todo-tabell

Sedan: ta bort next_session_brief om följts, skriv global_status.md, flaggningsregel, commit:
```bash
git add state/ project_memory/ governance/ CLAUDE.md GOVERNANCE.md PROJECT.md && git commit -m "state: session handoff YYYY-MM-DD" && git push
```

---

## Autonomigränser

Se GOVERNANCE.md för grundregler. Projektspecifika gränser i PROJECT.md.

---

## Repo-struktur

```
GOVERNANCE.md                    <- GRUNDLAGAR — gäller alla projekt
PROJECT.md                       <- Detta projekts identitet och regler
COMMANDS.md                      <- ALLA KOMMANDON
state/engrams_todo.md            <- MASTER TODO
state/active_context.md          <- Claude.ai skriver, CC läser
state/cc_session_log.md          <- CC skriver, Claude.ai läser
state/session_handoff.md
state/work_queue.md
state/global_status.md
state/daily_briefing.md
project_memory/
governance/
scripts/
```

---

## Commit-konventioner
```
feat / fix / state / agent / coo / brief / docs / chore
```
