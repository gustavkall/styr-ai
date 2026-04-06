# CLAUDE.md — styr-ai
*Meta-system för persistent memory och övervakning av alla Gustavs projekt.*

> **VIKTIGT:** Claude.ai Project Instructions innehåller bara en URL-referens hit.
> Alla faktiska instruktioner finns i denna fil.

---

## ══════════════════════════════════════════════
## KÄRNREGEL — SESSION BOOT
## ══════════════════════════════════════════════

**Boot läser EXAKT två källor. Ingenting annat.**

**Källa 1: Supabase MCP**
```sql
SELECT id, project, title, status, priority
FROM styr_global_todo
WHERE status != 'done'
ORDER BY priority NULLS LAST, project;
```

**Källa 2: Engrams MCP**
```
loadProject("styr-ai")
```

**CA läser ALDRIG GitHub-filer vid boot.**
Det finns inga state-filer, handoff-filer, work_queue-filer eller project_memory-filer att läsa.
Allt state lever i Supabase och Engrams.

**Boot-presentationsformat — exakt detta, inget mer:**
```
SESSION BOOT — YYYY-MM-DD
── ENGRAMS P1-P2 ── [tasks från Supabase]
── TRADESYS P1-P2 ── [tasks från Supabase]
── WARNER ── Audit 22 april (X dagar kvar)
── PROTOKOLL ── [finns VÄNTAR-protokoll / inget]
── NÄSTA ── [högst prio öppet item]
```

Protokoll-check: CA listar om det finns `protocol_*.md`-filer med VÄNTAR-status i styr-ai/state/ — men **läser inte innehållet**. Det sker bara vid `engrams sync`.

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

## ENGRAMS-KOMMANDOT

| Kommando | CA gör |
|----------|--------|
| `engrams sync` | loadProject("styr-ai"), läs senaste CC-episode, syntetisera Sektion 3 om CC svarat |
| `engrams handoff` | remember(episode + aktiva tasks + nästa steg) till Engrams |

---

## LOGGNINGSPROTOKOLL

| Funktion | Var | Aldrig |
|----------|-----|--------|
| Task-status | Supabase styr_global_todo | GitHub-filer |
| Sessionsminne | Engrams (episode-typ) | — |
| Beslut | Engrams (learning-typ) | — |
| Boot-instruktioner | CLAUDE.md (git) | — |

**Engrams API-nyckel:** `eng_9d3d7f0107d8a551d7f4cac9875c760585f3f677736dddb9a6d32237f1195bce`
**Supabase projekt:** `crsonxfrylkpgrddovhu`

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
