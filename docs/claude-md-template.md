# CLAUDE.md — [PROJEKTNAMN]
*[Kort beskrivning av projektet]*

> Instruktioner hämtas från detta repo + global state via Boot API.
> Uppdatera denna fil när protokollet förändras.

---

## SESSION BOOT — OBLIGATORISK

### Steg 1: Global state
```bash
curl -s "https://www.engrams.app/api/boot?project=[PROJEKT-ID]&token=$BOOT_TOKEN"
```
Absorbera tasks, beslut och kontext. Presentera:
```
BOOT — [PROJEKT] — YYYY-MM-DD

AKTIVA TASKS:
  [lista från tasks[]]

SENASTE BESLUT:
  [lista från decisions[]]

CC SENAST:
  [från cc_last_session]
```

### Steg 2: Projektspecifikt
[Projektets egna instruktioner här — state-filer, Supabase-queries, etc]

---

## SESSION HANDOFF — OBLIGATORISK

### Steg 1: Uppdatera global state
Kör mot Supabase (crsonxfrylkpgrddovhu):
```sql
-- Uppdatera slutförda tasks
UPDATE styr_global_todo SET status = 'done', notes = '[vad]' WHERE id = '[ID]';

-- Logga session
INSERT INTO styr_session_log (project, agent, summary, decisions, next_steps)
VALUES ('[PROJEKT-ID]', 'CC', '[sammanfattning]', '["beslut"]', '["nästa steg"]');

-- Logga beslut (om nya)
INSERT INTO styr_decisions (project, decision, rationale, decided_by)
VALUES ('[PROJEKT-ID]', '[beslut]', '[varför]', 'CC');
```

### Steg 2: Projektspecifikt
[Commit state-filer, push, etc]

---

## Projektidentitet

| Nyckel | Värde |
|--------|-------|
| Projekt-ID | [används i Boot API + Supabase] |
| Repo | gustavkall/[repo-namn] |
| Supabase | [projekt-ref eller "inget"] |
| Prioritet | [1-4] |

---

## Autonomigränser
Se gustavkall/styr-ai GOVERNANCE.md.
