# CLAUDE.md — styr-ai
*Meta-system för persistent memory och övervakning av alla Gustavs projekt.*

> **VIKTIGT:** Claude.ai Project Instructions innehåller bara en URL-referens hit.
> Alla faktiska instruktioner finns i denna fil.

---

## ══════════════════════════════════════════════
## KÄRNREGEL — TASK-STATUS LÄSES ALLTID FRÅN SUPABASE
## ══════════════════════════════════════════════

**Supabase styr_global_todo är den enda källan till sanning för task-status.**

CA och CC läser ALDRIG task-status från:
- state/session_handoff.md (legacy, alltid inaktuell)
- state/work_queue.md (avvecklad)
- state/todo.md i något repo (sekundär, kan drifta)
- någon annan GitHub-fil

**CA hämtar tasks via Supabase MCP:**
```sql
SELECT id, project, title, status, priority
FROM styr_global_todo
WHERE status != 'done'
ORDER BY priority NULLS LAST, project;
```

**CA hämtar minne via Engrams MCP:**
```
loadProject("styr-ai")
```

---

## ══════════════════════════════════════════════
## KÄRNREGEL — TVÅ KOMMANDON, TVÅ SYFTEN
## ══════════════════════════════════════════════

| Kommando | Syfte | Vad CC gör |
|----------|-------|------------|
| `sync` | Feedback-runda | Läser protokoll, skriver Sektion 2, loggar episode |
| `deploy` | Implementation | Läser Sektion 4, implementerar, markerar done i Supabase |

**sync implementerar ALDRIG. deploy körs ALDRIG utan Gustavs godkännande.**

Flödet:
1. CA skriver spec (Sektion 1)
2. CC kör `sync` → skriver feedback (Sektion 2)
3. CA kör `engrams sync` → skriver Sektion 3 → presenterar för Gustav
4. Gustav godkänner → CC kör `deploy` → implementerar → markerar done i Supabase

---

## ══════════════════════════════════════════════
## KÄRNREGEL — BESLUT EXEKVERAS I SAMMA SVAR
## ══════════════════════════════════════════════

När CA och Gustav kommer överens om något → exekvera i samma svar.
Frågan CA alltid ställer sig: *"Har vi kommit överens om något som inte är exekverat än?"*

---

## ══════════════════════════════════════════════
## KÄRNREGEL — ROTORSAK ÅTGÄRDAS I SAMMA SVAR
## ══════════════════════════════════════════════

När problem uppstår: (1) lös nu, (2) identifiera rotorsak, (3) förhindra återupprepning i samma svar.

---

## ══════════════════════════════════════════════
## KÄRNREGEL — PLAN-GODKÄNNANDE
## ══════════════════════════════════════════════

Inget implementeras utan Gustavs godkännande. Trigger: "godkänt", "plan approved", "kör".
CA lyfter proaktivt idéer som saknar spec. CA presenterar alltid plan före implementation.

---

## SESSION BOOT — OBLIGATORISK ORDNING

**Steg 1: Tasks från Supabase (SSOT — aldrig GitHub-filer)**
```sql
SELECT id, project, title, status, priority
FROM styr_global_todo
WHERE status != 'done'
ORDER BY priority NULLS LAST, project;
```

**Steg 2: Minne från Engrams**
```
loadProject("styr-ai")
```

**Steg 3: Kolla öppna protokollfiler**
```
gh api repos/gustavkall/styr-ai/contents/state
→ lista protocol_*.md filer med VÄNTAR eller GODKÄND
```

**Steg 4: Presentera**
```
SESSION BOOT — YYYY-MM-DD
── ENGRAMS ── [tasks från Supabase, prio 1-2]
── TRADESYS ── [tasks från Supabase, prio 1-2]
── WARNER ── [deadline: audit 22 april]
── PROTOKOLL ── [protokollnamn + status, eller "inget"]
── NÄSTA ── [högst prioriterat öppet item]
```

---

## ENGRAMS-KOMMANDOT

| Kommando | CA gör |
|----------|--------|
| `engrams boot` | Supabase tasks + loadProject("styr-ai") + protokoll |
| `engrams sync` | loadProject("styr-ai"), läs senaste CC-episode, syntetisera Sektion 3 |
| `engrams handoff` | remember(episode + decisions) till Engrams |

---

## LOGGNINGSPROTOKOLL

| Funktion | Var | Aldrig |
|----------|-----|--------|
| Task-status | Supabase styr_global_todo | GitHub-filer |
| Sessionsminne | Engrams (episode-typ) | styr_session_log |
| Beslut | Engrams (learning-typ) | styr_decisions |
| Boot-instruktioner | CLAUDE.md (git) | — |

**Engrams API-nyckel:** `eng_9d3d7f0107d8a551d7f4cac9875c760585f3f677736dddb9a6d32237f1195bce`

---

## HANDOFF

1. `remember` till Engrams: episode med aktiva tasks + nästa steg
2. Bekräfta till Gustav

---

## Underprojekt

| Projekt | Repo |
|---------|------|
| engrams | gustavkall/engrams |
| tradesys | gustavkall/tradesys1337 + gustavkall/tradesys-models |
| savage-roar | gustavkall/savage-roar-music |

## Commit-konventioner
```
feat / fix / state / agent / docs / chore
```
