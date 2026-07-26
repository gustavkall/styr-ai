# Memory Integrity Report
*2026-07-26T04:12:17.869Z*

## Sammanfattning
- HIGH: 11
- MEDIUM: 4

## Analys
# Minnesläcka-Analys: Prioriterade Åtgärder

## Kritisk Status
**11 HIGH-severity filer saknas** i två projekt (styr-ai, tradesys1337).

## Åtgärdsprioritet

### Fas 1 - OMEDELBAR (Sessionsöverföring)
1. `state/session_handoff.md` - båda projekten
2. `state/work_queue.md` - båda projekten

### Fas 2 - HÖGPRIO (Projektkontext)
3. `project_memory/project_context.md` - båda projekten
4. `project_memory/goals.md` - styr-ai
5. `project_memory/cross_project_learnings.md` - styr-ai

### Fas 3 - STYRNING (Governance)
6. `governance/system_rules.md` - styr-ai
7. `governance/approvals.md` - styr-ai
8. `governance/architecture_changelog.md` - styr-ai

## Rekommendation
Skapa **mallstruktur** för båda projekten samtidigt för effektivitet. Utan dessa filer förloras sessionskontext och projektminne mellan sessioner.

## ⚠️ styr-ai
- **[HIGH]** Saknad fil: state/session_handoff.md
  → *Skapa state/session_handoff.md*
- **[HIGH]** Saknad fil: state/work_queue.md
  → *Skapa state/work_queue.md*
- **[HIGH]** Saknad fil: project_memory/project_context.md
  → *Skapa project_memory/project_context.md*
- **[HIGH]** Saknad fil: project_memory/goals.md
  → *Skapa project_memory/goals.md*
- **[HIGH]** Saknad fil: governance/system_rules.md
  → *Skapa governance/system_rules.md*
- **[HIGH]** Saknad fil: governance/approvals.md
  → *Skapa governance/approvals.md*
- **[HIGH]** Saknad fil: governance/architecture_changelog.md
  → *Skapa governance/architecture_changelog.md*
- **[HIGH]** Saknad fil: project_memory/cross_project_learnings.md
  → *Skapa project_memory/cross_project_learnings.md*
- **[MEDIUM]** session_handoff.md ej uppdaterad på 111 dagar
  → *Kör session close*

## ⚠️ savage-roar-music
- **[MEDIUM]** session_handoff.md ej uppdaterad på 125 dagar
  → *Kör session close*

## ⚠️ tradesys1337
- **[HIGH]** Saknad fil: state/session_handoff.md
  → *Skapa state/session_handoff.md*
- **[HIGH]** Saknad fil: state/work_queue.md
  → *Skapa state/work_queue.md*
- **[HIGH]** Saknad fil: project_memory/project_context.md
  → *Skapa project_memory/project_context.md*
- **[MEDIUM]** session_handoff.md ej uppdaterad på 111 dagar
  → *Kör session close*

## ⚠️ adminassistent
- **[MEDIUM]** session_handoff.md ej uppdaterad på 116 dagar
  → *Kör session close*
