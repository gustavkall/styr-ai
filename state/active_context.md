# active_context.md
*Uppdaterad: 2026-04-01 17:00 — SUPABASE MIGRATION KLAR*
*Skriven av CC. CA/CC: referens vid sync, boot-data hämtas från Supabase.*

---

## MIGRERINGSSTATUS: KLAR ✓

Supabase-migrationen (projekt `crsonxfrylkpgrddovhu`) är genomförd.

**Vad som gjordes:**
- 4 tabeller skapade: `styr_system_state`, `styr_global_todo`, `styr_decisions`, `styr_session_log`
- 20 tasks migrerade från `state/global_todo.md` till `styr_global_todo`
- Första `styr_system_state` (id='global') skriven
- Session loggad i `styr_session_log`

**Supabase är nu SSOT** för:
- Tasks → `styr_global_todo`
- System state → `styr_system_state`
- Beslut → `styr_decisions`
- Sessioner → `styr_session_log`

GitHub state-filer (`state/`) finns kvar som backup-referens men är **inte längre auktoritativa**. All läsning och skrivning sker mot Supabase.

---

## BOOT-PROTOKOLL

Se `CLAUDE.md` — boot-sekvensen hämtar nu state från Supabase (Steg 1), inte från GitHub state-filer. Grundlagar (`GOVERNANCE.md`, `PROJECT.md`, `CLAUDE.md`) ligger kvar i git.

---

## NUVARANDE PRIORITETSORDNING

### ENGRAMS
1. **E7 — OPENAPI-001** ChatGPT Action (blockerare för Anna) ← **NÄSTA AKTIV TASK FÖR CC**
2. E8 — Anna onboarding (väntar på E7)
3. E9 — SUPABASE-SPLIT (lägre prio, ej blockerare)

### TRADESYS
1. T1 — ADD-NEW-AGENT3-001
2. T2 — DATA-EXTEND-001 (kräver Gustav)
3. T3 — MODEL-SCOREBOARD-001

### WARNER
NEDPRIORITERAT. Bevakas passivt.

### META
1. S4 — PAT_TOKEN tradesys1337

---

## TEKNISK STATE

**Engrams:** live, 5/5 e2e, API + MCP fungerar
**Styr.AI Supabase:** `crsonxfrylkpgrddovhu` — SSOT för all state
**TradeSys Supabase:** `hxikaojzwjtztyuwlxra` — oförändrat, egna operativa tabeller
**Engrams nyckel Anna:** eng_d98ad48a4fe579e04b8abc61aa3ea6ba562e4fa5331c1aef1d1847087c966cd8
