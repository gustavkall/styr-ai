# Memory Integrity Report
*2026-07-05T04:24:35.397Z*

## Sammanfattning
- HIGH: 11
- MEDIUM: 4

## Analys
# Prioriterade Åtgärder

**KRITISK:** 11 saknade filer hotar projektminnet i båda projekten.

## Åtgärdsplan (prioritetsordning):

1. **State-filer (HÖGSTA)** - Skapa omedelbar:
   - `state/session_handoff.md` (båda projekt)
   - `state/work_queue.md` (båda projekt)
   *Möjliggör sessionsöverföringar och taskhantering*

2. **Projektminne (HÖG)** - Skapa parallellt:
   - `project_memory/project_context.md` (båda projekt)
   - `project_memory/goals.md` (styr-ai)
   - `project_memory/cross_project_learnings.md` (styr-ai)

3. **Styrning (HÖG)** - Skapa därefter:
   - `governance/system_rules.md`
   - `governance/approvals.md`
   - `governance/architecture_changelog.md`

**Rekommendation:** Skapa alla filer idag. Använd mallar för konsistens. Implementera versionskontroll för governance-ändringar.

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
- **[MEDIUM]** session_handoff.md ej uppdaterad på 90 dagar
  → *Kör session close*

## ⚠️ savage-roar-music
- **[MEDIUM]** session_handoff.md ej uppdaterad på 104 dagar
  → *Kör session close*

## ⚠️ tradesys1337
- **[HIGH]** Saknad fil: state/session_handoff.md
  → *Skapa state/session_handoff.md*
- **[HIGH]** Saknad fil: state/work_queue.md
  → *Skapa state/work_queue.md*
- **[HIGH]** Saknad fil: project_memory/project_context.md
  → *Skapa project_memory/project_context.md*
- **[MEDIUM]** session_handoff.md ej uppdaterad på 90 dagar
  → *Kör session close*

## ⚠️ adminassistent
- **[MEDIUM]** session_handoff.md ej uppdaterad på 95 dagar
  → *Kör session close*
