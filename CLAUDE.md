# CLAUDE.md — styr-ai
*Meta-system för persistent memory och övervakning av alla Gustavs projekt.*

> **VIKTIGT:** Claude.ai Project Instructions innehåller bara en URL-referens hit.
> Alla faktiska instruktioner finns i denna fil. När systemet förändras uppdateras denna fil —
> Project Instructions i UI behöver aldrig ändras igen.

---

## ══════════════════════════════════════════════
## KÄRNREGEL — BESLUT EXEKVERAS I SAMMA SVAR
## ══════════════════════════════════════════════

**När CA och Gustav kommer överens om något ska CA exekvera det omedelbart — i samma svar. Aldrig i nästa.**

Detta gäller utan undantag för:
- Protokollfiler → skriv till GitHub i samma svar
- CLAUDE.md-uppdateringar → pusha i samma svar
- Work items → skriv till Supabase i samma svar
- Rutiner → uppdatera CLAUDE.md i samma svar
- Beslut → logga till Engrams (INTE styr_decisions) i samma svar

**Frågan CA alltid ställer sig innan ett svar avslutas:**
*"Har vi kommit överens om något som inte är exekverat än?"*
Om ja → exekvera nu, inte senare.

---

## ══════════════════════════════════════════════
## KÄRNREGEL — ROTORSAK ÅTGÄRDAS I SAMMA SVAR
## ══════════════════════════════════════════════

**När ett problem uppstår ska CA alltid:**

1. **Lösa problemet nu** — den omedelbara åtgärden
2. **Identifiera rotorsaken** — varför uppstod det?
3. **Förhindra att det uppstår igen** — uppdatera CLAUDE.md, protokoll eller annan config i samma svar

**Regel: Om CA gör en förändring som förutsätter att ett annat system beter sig på ett visst sätt, ska CA verifiera att det systemet faktiskt är konfigurerat för det beteendet — i samma svar.**

**CA ska aldrig lämna ett system i ett tillstånd där Gustav måste påminna om nästa steg för att förebygga återupprepning.**

Frågan CA alltid ställer sig innan ett svar avslutas:
*"Finns det något som kan gå fel nästa gång p.g.a. att vi inte uppdaterat konfiguration, CLAUDE.md eller protokoll?"*
Om ja → åtgärda nu.

---

## ══════════════════════════════════════════════
## ENGRAMS-KOMMANDOT
## ══════════════════════════════════════════════
*Beslutad: 2026-04-06. Spec: gustavkall/engrams/docs/cc-handoff-spec.md*

Ett enhetligt kommandospråk. Gustav skriver `engrams [subkommando] [projekt?]`.
`engrams` utan subkommando = `engrams boot`.

### CA-triggers

| Kommando | CA gör |
|----------|--------|
| `engrams boot` | loadProject("styr-ai"), presentera alla projekt + tasks + öppna beslut |
| `engrams boot [projekt]` | loadProject("styr-ai") + loadProject(projekt), merge och presentera |
| `engrams sync` | loadProject("styr-ai"), läs senaste episode med agent=CC, presentera vad CC gjort |
| `engrams handoff` | remember(episode + decisions till Engrams), uppdatera active_context |

**Projektscoping-regel:** Styr är alltid med som bas. `engrams boot tradesys` = styr-ai + tradesys, inte bara tradesys.

---

## ══════════════════════════════════════════════
## ENGRAMS V2 — LOGGNINGSPROTOKOLL (FAS 1)
## ══════════════════════════════════════════════
*Beslutad: 2026-04-06. Spec: gustavkall/engrams/docs/engrams-v2-spec.md*

**CA slutar dubbellogga. Engrams är den enda datakällan för minne.**

| Funktion | Nu |
|----------|----|
| Beslut | **Bara Engrams** (`decision`-typ) |
| Sessioner | **Bara Engrams** (`episode`-typ) |
| Projektkontext | **Bara Engrams** (`context`-typ) |
| Tasks | Supabase styr_global_todo (tills Fas 2) |
| Boot-instruktioner | CLAUDE.md (git) |

**Engrams API-nyckel för styr-ai:** `eng_9d3d7f0107d8a551d7f4cac9875c760585f3f677736dddb9a6d32237f1195bce`

---

## Proaktiv systemförbättring — OBLIGATORISK

Gustav ska aldrig behöva komma på systemförbättringar själv.

| Om Gustav beskriver... | CA ska direkt föreslå... |
|------------------------|---------------------------|
| Synkproblem | Supabase/Engrams som realtidskälla |
| Manuellt arbete | Automatisering via agent eller script |
| Långsam boot | Minska filläsningar, flytta till DB |
| Att han påminner CA | CA har brutit mot rotorsaksregeln — åtgärda + skriv in regel |

---

## ══════════════════════════════════════════════
## PROTOKOLLFLÖDET — OBLIGATORISKT
## ══════════════════════════════════════════════

Fil: `gustavkall/styr-ai/state/protocol_[ämne].md`

**När CA skapar en protokollfil:** CA verifierar att CC:s CLAUDE.md definierar vad `sync` gör — i samma svar.

| Steg | Vem | Vad |
|------|-----|-----|
| 1 | CA | Skriver sektion 1 — i samma svar som beslutet |
| 2 | CC | Kör `sync` i terminalen → skriver sektion 2 [scope: engrams] |
| 3 | CA | Gustav skriver `engrams sync` → CA läser CC:s episode, skriver sektion 3 |
| 4 | CC | Gustav godkänner → CA ger deployment-prompt → CC implementerar |

---

## ══════════════════════════════════════════════
## SKRIVRÄTTIGHETER
## ══════════════════════════════════════════════

| Fil/tabell | CA | CC-engrams | CC-tradesys |
|---|---|---|---|
| `state/protocol_*.md` sek 1, 3, 4 | Skriver | Läser | Läser |
| `state/protocol_*.md` sek 2 [engrams] | Läser | **Skriver** | **ALDRIG** |
| `state/protocol_*.md` sek 2 [tradesys] | Läser | **ALDRIG** | **Skriver** |
| `styr_global_todo` | Skriver | Läser | Läser |
| `CLAUDE.md` (styr-ai) | Skriver | **ALDRIG** | **ALDRIG** |

---

## ══════════════════════════════════════════════
## VAR SPARAS VAD
## ══════════════════════════════════════════════

| Typ | Var |
|-----|-----|
| Protokoll och rutiner | CLAUDE.md (styr-ai) |
| Tasks och work items | Supabase styr_global_todo |
| **Beslut** | **Engrams** (`decision`-typ) |
| **Sessionslogg** | **Engrams** (`episode`-typ) |
| **Projektkontext** | **Engrams** (`context`-typ) |
| Aktiva protokolldokument | `state/protocol_*.md` i styr-ai |

---

## ══════════════════════════════════════════════
## SESSION BOOT — OBLIGATORISK
## ══════════════════════════════════════════════

### Steg 1: Tasks från Supabase
```sql
SELECT * FROM styr_global_todo WHERE status != 'done' ORDER BY project, priority;
```

### Steg 2: Minne från Engrams
- `loadProject("styr-ai")` via Engrams MCP — returnerar context, tasks, decisions, episodes, learnings

<!-- FALLBACK om Engrams är nere: läs GitHub ghost-state-filer -->

### Steg 3: Kolla aktiva protokoll
```bash
gh api repos/gustavkall/styr-ai/contents/state \
  --jq '[.[] | select(.name | startswith("protocol_"))] | .[].name'
```

### Steg 4: Presentera
```
SESSION BOOT — YYYY-MM-DD
── ENGRAMS ── [tasks]
── TRADESYS ── [tasks]
── WARNER ── [deadline]
── PROTOKOLL ── [namn + vad som väntar]
── ÖPPNA BESLUT ──
```

---

## ══════════════════════════════════════════════
## HANDOFF — OBLIGATORISK
## ══════════════════════════════════════════════

1. UPDATE `styr_global_todo` (tasks)
2. `remember` till Engrams: episode med sessionssummering
3. `remember` till Engrams: beslut (`decision`-typ)
4. Bekräfta till Gustav

**Skriv INTE till styr_decisions eller styr_session_log.**

---

## Underprojekt

| Projekt-ID | Repo |
|------------|------|
| engrams | gustavkall/engrams |
| tradesys | gustavkall/tradesys1337 + gustavkall/tradesys-models |
| savage-roar | gustavkall/savage-roar-music |

---

## Agent-schema

| Tid CET | Agent | Status |
|---------|-------|--------|
| 08:00 vardagar | market-regime-agent | Aktiv |
| 22:30 vardagar | top-gainers-agent | Aktiv |
| 04:00 söndagar | memory-integrity-agent | Aktiv |

---

## Flaggningsregel — OBLIGATORISK

Om sessionen påverkar boot-sekvensen, agenter, protokoll eller strukturella förändringar:
1. Uppdatera denna fil
2. Logga i `governance/architecture_changelog.md`
3. Meddela Gustav: *"CLAUDE.md har uppdaterats med: [vad]"*

---

## Commit-konventioner
```
feat / fix / state / agent / docs / chore
```
