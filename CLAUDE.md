# CLAUDE.md — styr-ai
*Meta-system för persistent memory och övervakning av alla Gustavs projekt.*

> **VIKTIGT:** Claude.ai Project Instructions innehåller bara en URL-referens hit.
> Alla faktiska instruktioner finns i denna fil.

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
3. CA skriver plan (Sektion 3) → Gustav godkänner
4. CC kör `deploy` → implementerar (Sektion 4) → markerar done i Supabase

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

När problem uppstår: (1) lös nu, (2) identifiera rotorsak, (3) förhindra återupprepning.
Om CA gör en förändring som förutsätter att ett annat system beter sig på visst sätt → verifiera att systemet är konfigurerat — i samma svar.

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
| `engrams boot` | loadProject("styr-ai"), presentera alla projekt |
| `engrams boot [projekt]` | loadProject("styr-ai") + loadProject(projekt), merge |
| `engrams sync` | loadProject("styr-ai"), läs senaste CC-episode |
| `engrams handoff` | remember(episode + decisions) |

---

## ENGRAMS V2 — LOGGNINGSPROTOKOLL

| Funktion | Var |
|----------|-----|
| Beslut | Engrams (`decision`-typ) |
| Sessioner | Engrams (`episode`-typ) |
| Tasks | Supabase styr_global_todo |
| Boot-instruktioner | CLAUDE.md (git) |

**Engrams API-nyckel:** `eng_9d3d7f0107d8a551d7f4cac9875c760585f3f677736dddb9a6d32237f1195bce`

---

## PROTOKOLLFLÖDET

| Steg | Vem | Kommando | Output |
|------|-----|----------|--------|
| 1 | CA | — | Skriver Sektion 1 (spec) |
| 2 | CC | `sync` | Skriver Sektion 2 (feedback) |
| 3 | CA | `engrams sync` | Skriver Sektion 3 (syntes), presenterar för Gustav |
| 4 | CC | `deploy` | Implementerar Sektion 4, markerar done i Supabase |

---

## SESSION BOOT

1. Tasks: `SELECT * FROM styr_global_todo WHERE status != 'done' ORDER BY priority, project;`
2. Minne: `loadProject("styr-ai")` via Engrams MCP
3. Protokoll: kolla aktiva filer i `state/protocol_*.md`

Presentera:
```
SESSION BOOT — YYYY-MM-DD
── ENGRAMS ── [tasks]
── TRADESYS ── [tasks]
── WARNER ── [deadline]
── PROTOKOLL ── [sync väntar / deploy väntar / inget]
```

---

## HANDOFF

1. UPDATE `styr_global_todo` (tasks)
2. `remember` till Engrams: episode + decisions
3. Bekräfta till Gustav

---

## Underprojekt

| Projekt | Repo |
|---------|------|
| engrams | gustavkall/engrams |
| tradesys | gustavkall/tradesys1337 + gustavkall/tradesys-models |
| savage-roar | gustavkall/savage-roar-music |

## Agent-schema

| Tid CET | Agent |
|---------|-------|
| 08:00 vardagar | market-regime-agent |
| 22:30 vardagar | top-gainers-agent |
| 04:00 söndagar | memory-integrity-agent |

## Commit-konventioner
```
feat / fix / state / agent / docs / chore
```
