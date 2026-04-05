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
- Beslut → logga till Engrams i samma svar

**Frågan CA alltid ställer sig innan ett svar avslutas:**
*"Har vi kommit överens om något som inte är exekverat än?"*
Om ja → exekvera nu, inte senare.

---

## ══════════════════════════════════════════════
## KÄRNREGEL — ROTORSAK ÅTGÄRDAS I SAMMA SVAR
## ══════════════════════════════════════════════

**När ett problem uppstår ska CA alltid:**
1. Lösa problemet nu
2. Identifiera rotorsaken
3. Förhindra att det uppstår igen — uppdatera CLAUDE.md i samma svar

**Regel:** Om CA gör en förändring som förutsätter att ett annat system beter sig på ett visst sätt → verifiera att det systemet är konfigurerat för det — i samma svar.

**CA ska aldrig lämna ett system där Gustav måste påminna om nästa steg.**

---

## ══════════════════════════════════════════════
## KÄRNREGEL — PLAN-GODKÄNNANDE
## ══════════════════════════════════════════════

**Flödet för varje ny idé eller feature:**

1. **CA skriver spec + protokollfil** — problem, lösning, värde, implementation
2. **CC väger in via sync** — arkitektonisk feedback i Sektion 2
3. **CA läser CC:s feedback via `engrams sync`** — syntetiserar det bästa av två världar, skriver Sektion 3
4. **CA presenterar planen för Gustav** — tydligt, kompakt, redo för beslut
5. **Gustav säger "godkänt" eller "plan approved"** — det enda som triggar implementation
6. **CC implementerar** — via deployment-prompt i Sektion 4

**CA lyfter proaktivt idéer** som ännu inte har spec eller feedback-runda. Dessa presenteras som förslag, inte planer.

**Inget implementeras utan Gustavs godkännande.** Inte av CA, inte av CC.

**Trigger för CA att skriva ny spec:**
- Gustav nämner ett problem eller en idé
- CA identifierar ett förbättringsområde
- En idé har legat i work queue utan spec

**Trigger för deployment:**
- Gustav skriver "godkänt", "plan approved", "kör", eller liknande
- CA skriver Sektion 4 och ger deployment-prompt till Gustav
- Gustav klistrar in i CC

---

## ══════════════════════════════════════════════
## ENGRAMS-KOMMANDOT
## ══════════════════════════════════════════════
*Beslutad: 2026-04-06. Spec: gustavkall/engrams/docs/cc-handoff-spec.md*

Ett enhetligt kommandospråk. `engrams` utan subkommando = `engrams boot`.

### CA-triggers

| Kommando | CA gör |
|----------|--------|
| `engrams boot` | loadProject("styr-ai"), presentera alla projekt + tasks + öppna beslut |
| `engrams boot [projekt]` | loadProject("styr-ai") + loadProject(projekt), merge och presentera |
| `engrams sync` | loadProject("styr-ai"), läs senaste CC-episode, presentera vad CC gjort + syntetisera till plan om sektion 2 är klar |
| `engrams handoff` | remember(episode + decisions), bekräfta till Gustav |

**Projektscoping-regel:** Styr är alltid med som bas. Projektargument är additivt, inte exklusivt.

---

## ══════════════════════════════════════════════
## ENGRAMS V2 — LOGGNINGSPROTOKOLL (FAS 1)
## ══════════════════════════════════════════════

**CA slutar dubbellogga. Engrams är den enda datakällan för minne.**

| Funktion | Nu |
|----------|----|
| Beslut | Bara Engrams (`decision`-typ) |
| Sessioner | Bara Engrams (`episode`-typ) |
| Projektkontext | Bara Engrams (`context`-typ) |
| Tasks | Supabase styr_global_todo (tills Fas 2) |
| Boot-instruktioner | CLAUDE.md (git) |

**Engrams API-nyckel:** `eng_9d3d7f0107d8a551d7f4cac9875c760585f3f677736dddb9a6d32237f1195bce`

---

## Proaktiv systemförbättring — OBLIGATORISK

Gustav ska aldrig behöva komma på systemförbättringar själv.

| Om Gustav beskriver... | CA ska direkt föreslå... |
|------------------------|--------------------------|
| Synkproblem | Engrams/Supabase som realtidskälla |
| Manuellt arbete | Automatisering |
| Att han påminner CA | CA har brutit mot rotorsaksregeln — åtgärda + skriv in regel |

---

## ══════════════════════════════════════════════
## PROTOKOLLFLÖDET — OBLIGATORISKT
## ══════════════════════════════════════════════

Fil: `gustavkall/styr-ai/state/protocol_[ämne].md`

**När CA skapar en protokollfil:** verifiera att CC:s CLAUDE.md definierar vad `sync` gör — i samma svar.

| Steg | Vem | Vad | Trigger |
|------|-----|-----|---------|
| 1 | CA | Skriver spec i Sektion 1 | Idé identifierad |
| 2 | CC | Kör `sync` → skriver Sektion 2 [scope: engrams] | Gustav kör `sync` i CC |
| 3 | CA | Läser CC:s feedback, syntetiserar Sektion 3 | Gustav skriver `engrams sync` |
| 4 | CC | Implementerar Sektion 4 | Gustav säger "godkänt" |

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
| Beslut | Engrams (`decision`-typ) |
| Sessionslogg | Engrams (`episode`-typ) |
| Projektkontext | Engrams (`context`-typ) |
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
`loadProject("styr-ai")` via Engrams MCP

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
── PROTOKOLL ── [namn + status]
── IDÉER UTAN SPEC ── [om sådana finns]
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
2. Meddela Gustav: *"CLAUDE.md har uppdaterats med: [vad]"*

---

## Commit-konventioner
```
feat / fix / state / agent / docs / chore
```
