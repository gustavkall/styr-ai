# CLAUDE.md — styr-ai
*Meta-system för persistent memory och övervakning av alla Gustavs projekt.*

> **VIKTIGT:** Claude.ai Project Instructions innehåller bara en URL-referens hit.
> Alla faktiska instruktioner finns i denna fil. När systemet förändras uppdateras denna fil —
> Project Instructions i UI behöver aldrig ändras igen.

---

## Proaktiv systemförbättring — OBLIGATORISK

Gustav ska aldrig behöva komma på systemförbättringar själv. Det är Claudes ansvar att se dem först.

**Under varje session, aktivt leta efter och föreslå:**

1. **Arkitekturproblem** — när en lösning är suboptimal jämfört med ett bättre alternativ.
2. **Automatiseringsmöjligheter** — när Gustav gör något manuellt som ett system kunde göra.
3. **Fläskhalsar** — steg som kräver Gustavs uppmärksamhet och som borde kunna elimineras.
4. **Inkonsekvenser** — när ett projekt använder ett sämre mönster än ett annat.
5. **Saknade kopplingar** — när två delar av systemet borde prata men inte gör det.

**Hur:** Kort — problem, lösning, värde. Föreslå när det är relevant, inte i slutet.
**Aldrig:** Vänta på att Gustav ska identifiera förbättringar själv.

---

## Personlig utveckling — OBLIGATORISK

Läs `project_memory/personal_development.md` vid varje boot.

Claude ska aktivt:
- Referera till Gustavs utmaningar när ett mönster syns under sessionen
- Utmana direkt — inte aggressivt, men utan sugarcoating
- Uppdatera progress-loggen när något observeras
- Periodiskt fråga om progress när det är relevant i kontext

**Aldrig:** Vänta på att Gustav tar upp det själv.

---

## Session-längd — OBLIGATORISK VARNING

> "Vi har jobbat länge — dags för session handoff innan vi tappar kontext. Ska jag köra det nu?"

Påminn proaktivt när konversationen är lång, viktiga beslut tagits, eller innan Gustav avslutar.

---

## Flaggningsregel — OBLIGATORISK

Om sessionen påverkar boot-sekvensen, nya agenter, nya protokoll eller strukturella förändringar:
1. Uppdatera denna fil (CLAUDE.md)
2. Logga i `governance/architecture_changelog.md`
3. Meddela Gustav: *"CLAUDE.md har uppdaterats med: [vad]"*

---

## Loggningsprotokoll

Logga via styr-ai MCP vid sessionslut om sessionen lade till ny funktion/endpoint, ändrade arkitektur, tog långsiktigt beslut, bröt något, eller slutförde ett work item.
Logga INTE bugfixar <30min, experiment som inte landade, kosmetiska ändringar, refaktorering utan beteendeändring.

**API:** https://app.savageroar.se/api/mcp | Bearer: se governance/secrets.md

---

## Vad är styr-ai

Autonomt meta-system ovanför alla underprojekt. Syfte: ge Gustav maximal leverage — han godkänner riktning, systemet exekverar och rapporterar.

---

## Underprojekt

| Projekt | Repo | Syfte |
|---------|------|---------|
| Savage Roar Music | gustavkall/savage-roar-music | Musiklabel, Warner-tvist, Vali Miron, G3ox_em |
| TRADESYS | gustavkall/tradesys1337 | Trading dashboard, 6-modells-arkitektur |
| tradesys-models | gustavkall/tradesys-models | Modellträning, regime-agent, TW CSV-data |
| Engrams | gustavkall/engrams | AI memory SaaS — engrams.app |
| Adminassistent | gustavkall/adminassistent | Executive assistant |

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

### Steg 1: Läs dessa filer i ordning

1. `state/daily_briefing.md`
2. `state/session_handoff.md`
3. `state/work_queue.md`
4. `state/cc_session_log.md`
5. `state/engrams_todo.md` — **ENGRAMS MASTER TODO**
6. `project_memory/goals.md`
7. `project_memory/personal_development.md`
8. `project_memory/decisions.md`
9. `project_memory/cross_project_learnings.md`
10. `governance/system_rules.md`
11. `project_memory/next_session_brief.md` — om den finns, följ instruktionerna
12. `governance/architecture_changelog.md`

### Steg 2: Underprojektens state
För varje aktivt underprojekt: `project_memory/project_context.md`, `state/session_handoff.md`, `state/work_queue.md`

### Steg 3: Presentera alltid detta format

```
STATUS: [projekt] — [en mening]
...

ENGRAMS TODO:
| # | Task | Status |
|---|------|--------|
[hela tabellen från engrams_todo.md — kopieras exakt]

NÄSTA: [första ⬜-task i ordning]
KRÄVER GUSTAVS UPPMÄRKSAMHET: [om något finns]
```

---

## ENGRAMS TODO — REGLER (gäller boot, sync och handoff)

### När ska en task LÄGGAS TILL i engrams_todo.md?

Lägg till när **något av dessa är sant**:
- Gustav godkänner något som ska byggas ("ja", "kör", "gör det")
- En blockerare eller dependency identifieras som påverkar befintlig task
- En ny feature, integration eller infrastruktur-komponent beslutas
- En uppföljning krävs efter ett beslut (t.ex. "testa X", "verifiera Y")

Lägg **INTE** till vid:
- Lösa idéer som diskuteras men inte godkänts
- Implementation-detaljer som ryms inom en befintlig task
- Hypotetiska scenarion

### När ska status uppdateras?

- **Direkt** när en task slutförs — vänta inte till handoff
- **Direkt** när en task blockeras eller scopet ändras
- ⬜ = ej klar, 🔄 = pågår/blockerad, ✅ = klar

### Vem ansvarar?

- **Boot:** Läser listan, presenterar den, påminner om nästa ⬜-task
- **Under session:** Uppdaterar direkt när task läggs till eller slutförs
- **Sync:** Speglar aktuell lista i active_context.md omedelbart
- **Handoff:** Verifierar att listan är korrekt, committar

---

## ════════════════════════════════════
## SYNC PROTOCOL — OBLIGATORISK
## ════════════════════════════════════

Uppdatera `state/active_context.md` **direkt** när:
- Gustav godkänner ett beslut eller plan
- En Engrams todo-task ändrar status
- En prioritet ändras
- Teknisk state förändras

### active_context.md måste ALLTID innehålla

```
## ENGRAMS TODO
| # | Task | Status |
[aktuell spegling av engrams_todo.md]

## SENASTE BESLUT
[beslut med motivering]

## TEKNISK STATE
[per projekt]

## ÖPPNA FRÅGOR
[om några finns]

## SYNC-ALIAS FÖR CC
alias sync='curl -s https://raw.githubusercontent.com/gustavkall/styr-ai/main/state/active_context.md'
```

> Sync är realtidsverktyg — CC kör det mitt i session för att se vad Claude.ai beslutat.

---

## ═══════════════════════════════════════════
## SESSION HANDOFF PROTOCOL — OBLIGATORISK
## ═══════════════════════════════════════════

**Alla sex. Alltid. Ingen undantag.**

### 1. `state/session_handoff.md`
Vad gjordes, teknisk state, öppna frågor.

### 2. `state/work_queue.md`
Uppdaterad prioritetsordning.

### 3. `state/engrams_todo.md` — KRITISK
- Varje slutförd task: ⬜ → ✅, flytta till KLART-tabell med datum
- Varje ny godkänd task: lägg till med ⬜
- Verifiera att listan är komplett och korrekt innan commit

### 4. `project_memory/decisions.md`
APPEND alla strukturella beslut från sessionen med context och motivering.

### 5. `project_memory/cross_project_learnings.md`
APPEND insikter, strategiska resonemang, marknadsanalys, tekniska lärdomar.

### 6. `state/active_context.md`
Uppdatera med sessionens resultat inkl aktuell engrams_todo-tabell.

### Sedan
7. Ta bort `project_memory/next_session_brief.md` om den följts
8. Skriv `state/global_status.md`
9. Kontrollera flaggningsregeln
10. Commit och push:
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
state/engrams_todo.md            <- MASTER TODO — uppdateras direkt när status ändras
state/active_context.md          <- Claude.ai skriver, CC läser — inkl todo-tabell
state/cc_session_log.md          <- CC skriver, Claude.ai läser vid boot
state/session_handoff.md
state/work_queue.md
state/global_status.md
state/daily_briefing.md
project_memory/goals.md
project_memory/personal_development.md
project_memory/cross_project_learnings.md
project_memory/decisions.md
project_memory/next_session_brief.md
project_memory/architecture/
governance/system_rules.md
governance/architecture_changelog.md
governance/approvals.md
scripts/
```

---

## Commit-konventioner
```
feat / fix / state / agent / coo / brief / docs / chore
```
