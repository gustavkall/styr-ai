# Memory Integrity Report
*2026-07-12T04:12:14.405Z*

## Sammanfattning
- HIGH: 11
- MEDIUM: 4

## Analys
# Analyis: Minneslächor - Prioriterade Åtgärder

**Kritisk Situation:** 11 HIGH-nivå filer saknas i två projekt (styr-ai, tradesys1337).

## Prioritering:

**Fas 1 (Omedelbar):**
1. **State-filer** (session_handoff.md, work_queue.md) - båda projekten
   - Krävs för sessionskontinuitet och taskhantering

**Fas 2 (Samma dag):**
2. **project_memory-filer** (project_context.md, goals.md)
   - Essentiellt för projektkunskap och riktning

**Fas 3 (Inom 24h):**
3. **Governance-filer** (system_rules.md, approvals.md, architecture_changelog.md)
   - Styr långsiktig arkitektur och beslut

**Fas 4:**
4. **cross_project_learnings.md** - styr-ai projekt

**Rekommendation:** Använd template-struktur för båda projekten samtidigt för effektivitet. Prioritera styr-ai först (flest filer).

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
- **[MEDIUM]** session_handoff.md ej uppdaterad på 97 dagar
  → *Kör session close*

## ⚠️ savage-roar-music
- **[MEDIUM]** session_handoff.md ej uppdaterad på 111 dagar
  → *Kör session close*

## ⚠️ tradesys1337
- **[HIGH]** Saknad fil: state/session_handoff.md
  → *Skapa state/session_handoff.md*
- **[HIGH]** Saknad fil: state/work_queue.md
  → *Skapa state/work_queue.md*
- **[HIGH]** Saknad fil: project_memory/project_context.md
  → *Skapa project_memory/project_context.md*
- **[MEDIUM]** session_handoff.md ej uppdaterad på 97 dagar
  → *Kör session close*

## ⚠️ adminassistent
- **[MEDIUM]** session_handoff.md ej uppdaterad på 102 dagar
  → *Kör session close*
