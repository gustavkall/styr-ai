# Memory Integrity Report
*2026-06-28T04:31:49.939Z*

## Sammanfattning
- HIGH: 11
- MEDIUM: 4

## Analys
# Analysi av minnesläckor - Prioriterade åtgärder

## Kritisk situation
**11 HIGH-prioriterade filer saknas** i två projekt (styr-ai, tradesys1337).

## Prioriteringsordning

**Fas 1 (Omedelbar)**
1. `project_memory/project_context.md` - båda projekt
2. `state/session_handoff.md` - båda projekt
3. `governance/system_rules.md` - styr-ai

**Fas 2 (Urgent)**
4. `state/work_queue.md` - båda projekt
5. `project_memory/goals.md` - styr-ai
6. `governance/approvals.md` - styr-ai

**Fas 3**
7. Resterande governance-filer (styr-ai)
8. `cross_project_learnings.md` - styr-ai

## Rekommendation
Skapa mall-struktur för båda projekt samtidigt för att säkerställa konsistens. Fokusera på kontextfiler först för att återställa projektminnet.

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
- **[MEDIUM]** session_handoff.md ej uppdaterad på 83 dagar
  → *Kör session close*

## ⚠️ savage-roar-music
- **[MEDIUM]** session_handoff.md ej uppdaterad på 97 dagar
  → *Kör session close*

## ⚠️ tradesys1337
- **[HIGH]** Saknad fil: state/session_handoff.md
  → *Skapa state/session_handoff.md*
- **[HIGH]** Saknad fil: state/work_queue.md
  → *Skapa state/work_queue.md*
- **[HIGH]** Saknad fil: project_memory/project_context.md
  → *Skapa project_memory/project_context.md*
- **[MEDIUM]** session_handoff.md ej uppdaterad på 83 dagar
  → *Kör session close*

## ⚠️ adminassistent
- **[MEDIUM]** session_handoff.md ej uppdaterad på 88 dagar
  → *Kör session close*
