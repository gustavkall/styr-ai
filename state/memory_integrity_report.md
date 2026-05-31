# Memory Integrity Report
*2026-05-31T04:31:55.402Z*

## Sammanfattning
- HIGH: 11
- MEDIUM: 4

## Analys
# Minnesläcka-analys: Prioriterade åtgärder

## Kritiska brister (HIGH)
**11 saknade filer** över två projekt (styr-ai, tradesys1337).

## Prioriteringsordning:

1. **State-filer (högsta prioritet)**
   - `state/session_handoff.md` – möjliggör sessionskontinuitet
   - `state/work_queue.md` – kritikal för arbetsflöde

2. **Projektminne**
   - `project_memory/project_context.md` – grundläggande kontext
   - `project_memory/goals.md` – målöversikt

3. **Governance (styr-ai)**
   - `governance/system_rules.md`
   - `governance/approvals.md`
   - `governance/architecture_changelog.md`
   - `project_memory/cross_project_learnings.md`

## Rekommendation
Skapa alla filer omedelbar. Börja med state-mappen (återställer kontinuitet), följt av projektminne (kontext), sedan governance (säkerställer strukturell integritet). Implementera automatisk validering för att förhindra framtida brister.

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
- **[MEDIUM]** session_handoff.md ej uppdaterad på 55 dagar
  → *Kör session close*

## ⚠️ savage-roar-music
- **[MEDIUM]** session_handoff.md ej uppdaterad på 69 dagar
  → *Kör session close*

## ⚠️ tradesys1337
- **[HIGH]** Saknad fil: state/session_handoff.md
  → *Skapa state/session_handoff.md*
- **[HIGH]** Saknad fil: state/work_queue.md
  → *Skapa state/work_queue.md*
- **[HIGH]** Saknad fil: project_memory/project_context.md
  → *Skapa project_memory/project_context.md*
- **[MEDIUM]** session_handoff.md ej uppdaterad på 55 dagar
  → *Kör session close*

## ⚠️ adminassistent
- **[MEDIUM]** session_handoff.md ej uppdaterad på 60 dagar
  → *Kör session close*
