# Memory Integrity Report
*2026-08-09T03:33:05.953Z*

## Sammanfattning
- HIGH: 11
- MEDIUM: 4

## Analys
# Minnesläckor - Prioriterad åtgärdsplan

## Kritisk situation
11 HIGH-severity filer saknas i två projekt. Detta bryter kontinuitet och dokumentation.

## Åtgärder (prioriterad ordning):

**Fas 1 - Omedelbar (Session-kritiska):**
1. `state/session_handoff.md` (båda projekten) - möjliggör sessionsöverföring
2. `state/work_queue.md` (båda projekten) - säkerställer arbetsflöde

**Fas 2 - Högt (Projekt-kritiska):**
3. `project_memory/project_context.md` (båda) - kontextbevarande
4. `project_memory/goals.md` (styr-ai) - målöversikt
5. `governance/system_rules.md` (styr-ai) - regelwerk

**Fas 3 - Viktigt:**
6. Resterande governance-filer (styr-ai)
7. `cross_project_learnings.md` - kunskapsöverföring

## Rekommendation
Skapa mall-struktur för båda projekten parallellt för effektivitet.

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
- **[MEDIUM]** session_handoff.md ej uppdaterad på 125 dagar
  → *Kör session close*

## ⚠️ savage-roar-music
- **[MEDIUM]** session_handoff.md ej uppdaterad på 139 dagar
  → *Kör session close*

## ⚠️ tradesys1337
- **[HIGH]** Saknad fil: state/session_handoff.md
  → *Skapa state/session_handoff.md*
- **[HIGH]** Saknad fil: state/work_queue.md
  → *Skapa state/work_queue.md*
- **[HIGH]** Saknad fil: project_memory/project_context.md
  → *Skapa project_memory/project_context.md*
- **[MEDIUM]** session_handoff.md ej uppdaterad på 125 dagar
  → *Kör session close*

## ⚠️ adminassistent
- **[MEDIUM]** session_handoff.md ej uppdaterad på 130 dagar
  → *Kör session close*
