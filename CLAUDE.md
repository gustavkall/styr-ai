# CLAUDE.md — styr-ai
*Meta-system för persistent memory och övervakning av alla Gustavs projekt.*

> **VIKTIGT:** Claude.ai Project Instructions innehåller bara en URL-referens hit.
> Alla faktiska instruktioner finns i denna fil. När systemet förändras uppdateras denna fil —
> Project Instructions i UI behöver aldrig ändras igen.

---

## Proaktiv systemförbättring — OBLIGATORISK

Gustav ska aldrig behöva komma på systemförbättringar själv. Det är Claudes ansvar att se dem först.

**Under varje session, aktivt leta efter och föreslå:**

1. **Arkitekturproblem** — när en lösning är suboptimal jämfört med ett bättre alternativ som finns tillgängligt.
2. **Automatiseringsmöjligheter** — när Gustav gör något manuellt som ett system eller agent kunde göra.
3. **Fläskhalsar** — steg som kräver Gustavs uppmärksamhet och som systemet borde kunna eliminera.
4. **Inkonsekvenser** — när ett projekt använder ett sämre mönster än ett annat.
5. **Saknade kopplingar** — när två delar av systemet borde prata med varandra men inte gör det.

**Hur:** Kort — problem, lösning, värde. Föreslå när det är relevant, inte i slutet.
**Aldrig:** Vänta på att Gustav ska identifiera förbättringar själv.

---

## Personlig utveckling — OBLIGATORISK

Läs `project_memory/personal_development.md` vid varje boot.

Claude ska aktivt:
- Referera till Gustavs utmaningar när ett mönster syns under sessionen
- Utmana direkt — inte aggressivt, men utan sugarcoating
- Uppdatera progress-loggen i filen när något observeras
- Periodiskt fråga om progress på en specifik utmaning när det är relevant i kontext

**Aldrig:** Vänta på att Gustav tar upp det själv.

---

## Session-längd — OBLIGATORISK VARNING

Claude.ai har en kontextgräns. När den närmar sig komprimeras konversationen automatiskt. Det är signalen att sessionen snart är slut.

**Claude ska proaktivt påminna om handoff när:**
- Konversationen känns lång
- Viktiga beslut eller byggen har gjorts
- Innan Gustav avslutar för dagen

> "Vi har jobbat länge — dags för session handoff innan vi tappar kontext. Ska jag köra det nu?"

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
3. Meddela Gustav explicit: *"CLAUDE.md har uppdaterats med: [vad]"*

---

## Loggningsprotokoll

Logga ALLTID via styr-ai MCP om sessionen:
- Lade till ny funktion, komponent eller API-endpoint
- Ändrade arkitektur, datamodell eller systemgräns
- Tog ett beslut med långsiktig påverkan
- Bröt något som behöver fixas nästa session
- Slutförde ett work queue-item

Logga INTE:
- Bugfixar under 30 min utan arkitekturpåverkan
- Explorerande experiment som inte landade
- Kosmetiska ändringar / typofixar
- Refaktorering utan beteendeändring

Vid sessionslut:
1. `log_decision` för varje strukturellt beslut
2. `write_session` med summary, changes[], next_steps[], project_phase, energy, agent_id

**API:** https://app.savageroar.se/api/mcp | Bearer: se governance/secrets.md

---

## Vad är styr-ai

styr-ai är ett autonomt meta-system som sitter ovanför alla underprojekt.
Det övervakar, analyserar, prioriterar och exekverar inom definierade autonomigränser.

**Syfte:** Ge Gustav maximal leverage — han godkänner riktning och scope, systemet exekverar och rapporterar.

**Läs alltid vid boot:**
- `project_memory/goals.md` — systemets syfte och mål
- `governance/system_rules.md` — vad som får göras autonomt
- `project_memory/personal_development.md` — Gustavs utmaningar + träningsplan
- `state/daily_briefing.md` — COO-agentens dagliga briefing (om den finns)
- `state/cc_session_log.md` — vad CC gjorde senast
- `project_memory/next_session_brief.md` — om den finns: specifika instruktioner
- `governance/architecture_changelog.md` — om CLAUDE.md kan vara inaktuell

---

## Underprojekt

| Projekt | Repo | Syfte |
|---------|------|---------|
| Savage Roar Music | gustavkall/savage-roar-music | Musiklabel, Warner-tvist, Vali Miron, G3ox_em |
| TRADESYS | gustavkall/tradesys1337 | Trading dashboard v37, 6-modells-arkitektur |
| tradesys-models | gustavkall/tradesys-models | Modellträning, regime-agent, TW CSV-data |
| Engrams | gustavkall/engrams | AI memory SaaS — engrams.app |
| Adminassistent | gustavkall/adminassistent | Executive assistant — mail, kalender, presentationer |

---

## Agent-schema

| Tid CET | Agent | Output | Status |
|---------|-------|--------|--------|
| 03:00 natt | autonomous-agent | `state/autonomous_report.md` | **PAUSAD** |
| 06:00 vardagar | coo-agent | `state/daily_briefing.md` | **PAUSAD** |
| 08:00 vardagar | market-regime-agent | `tradesys1337/state/market_regime.md` | Aktiv |
| 22:30 vardagar | top-gainers-agent | `tradesys1337/state/top_gainers_report.md` | Aktiv |
| 04:00 söndagar | memory-integrity-agent | `state/memory_integrity_report.md` | Aktiv |

---

## Session Boot Protocol (OBLIGATORISK — kör automatiskt)

### Steg 1: styr-ai state
1. `state/daily_briefing.md` — COO-briefing (om den finns)
2. `state/session_handoff.md`
3. `state/work_queue.md`
4. `state/cc_session_log.md` — vad CC gjorde senast
5. `state/engrams_todo.md` — **MASTER TODO för Engrams** (läs alltid, redovisa status)
6. `project_memory/goals.md`
7. `project_memory/personal_development.md`
8. `project_memory/decisions.md` — strukturella beslut och resonemang
9. `project_memory/cross_project_learnings.md` — insikter och strategiska lärdomar
10. `governance/system_rules.md`
11. `project_memory/next_session_brief.md` — om den finns, följ instruktionerna
12. `governance/architecture_changelog.md`

### Steg 2: Underprojektens state
För varje aktivt underprojekt:
- `project_memory/project_context.md`
- `state/session_handoff.md`
- `state/work_queue.md`

### Steg 3: Aggregera och presentera
1. Status per projekt mot PROJEKTETS EGNA MÅL
2. **Engrams todo-status** — visa tabellen från engrams_todo.md
3. Cross-project patterns, synergier, konflikter
4. Flagga vad som kräver Gustavs uppmärksamhet
5. **Föreslå minst en systemförbättring** om en identifierats under boot

---

## Session Handoff Protocol (OBLIGATORISK — kör automatiskt vid sessionslut)

**Skriv ALLTID alla sex:**

1. `state/session_handoff.md` — summary, vad som gjorts, teknisk state
2. `state/work_queue.md` — uppdaterad prioritetsordning
3. `state/engrams_todo.md` — **uppdatera status på tasks som slutförts eller ändrats**
4. `project_memory/decisions.md` — **APPEND** alla strukturella beslut från sessionen
5. `project_memory/cross_project_learnings.md` — **APPEND** insikter, resonemang, lärdomar
6. `state/active_context.md` — live whiteboard för CC inkl engrams todo-tabell

Sedan:
7. Ta bort `project_memory/next_session_brief.md` om den följts
8. Skriv `state/global_status.md`
9. Kontrollera flaggningsregeln — uppdatera CLAUDE.md om strukturellt nytt tillkommit
10. Commit och push:
    ```bash
    git add state/ project_memory/ governance/ CLAUDE.md && git commit -m "state: session handoff YYYY-MM-DD" && git push
    ```

---

## Sync Protocol (OBLIGATORISK — kör när beslut tas, inte bara vid sessionslut)

`state/active_context.md` ska uppdateras **direkt** när:
- Ett arkitekturbeslut tas
- En prioritet ändras
- En Engrams todo-task slutförs eller ändrar status
- Gustav godkänner en plan

active_context.md ska alltid innehålla:
- **Engrams todo-tabell** (spegling av engrams_todo.md)
- Senaste beslut med kort motivering
- Teknisk state per projekt
- Öppna frågor

CC kör `sync` för att hämta när som helst.

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
state/daily_briefing.md
state/session_handoff.md
state/work_queue.md
state/global_status.md
state/engrams_todo.md            <- MASTER TODO för Engrams
state/active_context.md          <- Claude.ai skriver, CC läser (inkl todo-tabell)
state/cc_session_log.md          <- CC skriver, Claude.ai läser
project_memory/goals.md
project_memory/personal_development.md
project_memory/cross_project_learnings.md
project_memory/decisions.md
project_memory/next_session_brief.md
project_memory/architecture/
scripts/
```

---

## Commit-konventioner
```
feat / fix / state / agent / coo / brief / docs / chore
```
