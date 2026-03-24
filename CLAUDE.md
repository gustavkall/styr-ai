# CLAUDE.md — styr-ai
*Meta-system för persistent memory och övervakning av alla Gustavs projekt.*

---

## Vad är styr-ai

styr-ai är ett autonomt meta-system som sitter ovanför alla underprojekt.
Det övervakar, analyserar, prioriterar och exekverar inom definierade autonomigränser.

**Syfte:** Ge Gustav maximal leverage — han godkänner riktning och scope, systemet exekverar och rapporterar.

**Läs alltid vid boot:**
- `project_memory/goals.md` — systemets syfte och mål
- `governance/system_rules.md` — vad som får göras autonomt
- `project_memory/next_session_brief.md` — om den finns: specifika instruktioner för denna session

---

## Underprojekt

| Projekt | Repo | Syfte |
|---------|------|-------|
| Savage Roar Music | gustavkall/savage-roar-music | Musiklabel, Warner-tvist, Vali Miron, G3ox_em |
| TRADESYS | gustavkall/tradesys1337 | Trading dashboard v37, model-kalibrering |
| Min Analytiker | gustavkall/min-analytiker | Intradagsanalytiker kopplad till TRADESYS |
| Adminassistent | gustavkall/adminassistent | Executive assistant, Savage Roar AB, Execute Media, Alliance |

Varje underprojekt har `project_memory/project_context.md` — läs den för att förstå projektets egna mål.

---

## Session Boot Protocol (OBLIGATORISK — kör automatiskt)

### Steg 1: styr-ai state
Läs dessa filer från repot:
1. `state/session_handoff.md`
2. `state/work_queue.md`
3. `project_memory/goals.md`
4. `governance/system_rules.md`
5. `project_memory/cross_project_learnings.md`
6. `project_memory/next_session_brief.md` — om den finns, följ instruktionerna där

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

## Autonomous Agent

Agenten (`scripts/autonomous-agent.js`) körs automatiskt vid varje push till main via GitHub Actions.
Den läser alla projekt, analyserar gaps mot `goals.md`, skriver rapport till `state/autonomous_report.md`.

**Hämta senaste rapport:** `state/autonomous_report.md`
**Secret som krävs:** `ANTHROPIC_API_KEY` i GitHub repo secrets

---

## Session Handoff Protocol (OBLIGATORISK — kör automatiskt vid sessionslut)

1. Uppdatera `state/session_handoff.md` — vad gjordes, beslut, nästa steg
2. Uppdatera `state/work_queue.md` — markera klart, omprioritera
3. Uppdatera `project_memory/decisions.md` — beslut med motivering
4. Uppdatera `project_memory/cross_project_learnings.md` — nya insikter
5. Uppdatera `project_memory/projects_registry.md` — om status ändrats
6. Ta bort `project_memory/next_session_brief.md` om den följts — den är förbrukad
7. Skriv `state/global_status.md` — samlad projektstatus
8. Commit och push:
   ```bash
   git add state/ project_memory/ && git commit -m "state: session handoff YYYY-MM-DD" && git push
   ```

---

## Vad styr-ai FÅR göra autonomt
Se `governance/system_rules.md` för fullständig lista. Kortversion:
- Läsa alla repos
- Skriva state-filer och work_queue
- Lägga till work items baserat på gap-analys
- Commita till feature-branch (ej main direkt)

## Vad styr-ai INTE FÅR göra utan godkännande
- Merga till main
- Skicka mail eller meddelanden
- Köpa, betala, transagera
- Starta nya projekt
- Ändra `goals.md` eller `system_rules.md`

---

## Repo-struktur

```
governance/system_rules.md               — Autonomigränser
state/session_handoff.md                 — Senaste session
state/work_queue.md                      — Prioriterad tasklista
state/global_status.md                   — Samlad projektstatus
state/autonomous_report.md               — Senaste agent-rapport
project_memory/goals.md                  — Systemets syfte och mål (VISION-001)
project_memory/projects_registry.md     — Alla registrerade projekt
project_memory/cross_project_learnings.md — Aggregerade insikter
project_memory/decisions.md             — Beslutlogg
project_memory/next_session_brief.md    — Specifika instruktioner för nästa session
scripts/autonomous-agent.js              — Autonom agent (VISION-005)
.github/workflows/autonomous-agent.yml  — GitHub Actions trigger
```

---

## Commit-konventioner

```
feat:   ny funktionalitet
fix:    buggfix
state:  session handoff / state-uppdatering
infra:  deploy, CI/CD
docs:   dokumentation
agent:  automatisk agent-körning
brief:  ny/uppdaterad session-brief
```
