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

Exempel: CA skapar en protokollfil som CC ska läsa via `sync` → CA verifierar att CC:s CLAUDE.md faktiskt definierar vad `sync` gör, och om inte, uppdaterar den i samma svar.

**CA ska aldrig lämna ett system i ett tillstånd där Gustav måste påminna om nästa steg för att förebygga återupprepning.**

Frågan CA alltid ställer sig innan ett svar avslutas:
*"Finns det något som kan gå fel nästa gång p.g.a. att vi inte uppdaterat konfiguration, CLAUDE.md eller protokoll?"*
Om ja → åtgärda nu.

---

## ══════════════════════════════════════════════
## ENGRAMS V2 — LOGGNINGSPROTOKOLL (FAS 1)
## ══════════════════════════════════════════════
*Beslutad: 2026-04-06. Spec: gustavkall/engrams/docs/engrams-v2-spec.md*

**CA slutar dubbellogga. Engrams är den enda datakällan för minne.**

| Funktion | Tidigare | Nu |
|----------|----------|----|
| Beslut | styr_decisions + Engrams | **Bara Engrams** (`decision`-typ) |
| Sessioner | styr_session_log + Engrams | **Bara Engrams** (`episode`-typ) |
| Projektkontext | styr_system_state + Engrams | **Bara Engrams** (`context`-typ) |
| Tasks | styr_global_todo | Oförändrat (kvar i Supabase tills Fas 2) |
| Boot-instruktioner | CLAUDE.md | Oförändrat (kvar i git) |
| Agenter | GitHub Actions | Oförändrat |

**Konkret för CA:**
- Logga beslut → `remember` till Engrams med `type: decision`, `project: [projekt]`
- Logga sessioner → `remember` till Engrams med `type: episode`, `project: styr-ai`
- Skriv INTE till `styr_decisions` eller `styr_session_log` längre
- Tasks skrivs fortfarande till `styr_global_todo` i Supabase

**Engrams API-nyckel för styr-ai:** `eng_9d3d7f0107d8a551d7f4cac9875c760585f3f677736dddb9a6d32237f1195bce`
**MCP-endpoint:** `https://www.engrams.app/api/mcp?key=eng_...`

---

## Proaktiv systemförbättring — OBLIGATORISK

Gustav ska aldrig behöva komma på systemförbättringar själv. Det är CA:s ansvar att se dem först och presentera den bästa lösningen.

| Om Gustav beskriver... | CA ska direkt föreslå... |
|------------------------|--------------------------|
| Synkproblem mellan sessioner | Supabase som realtidskälla, inte GitHub-polling |
| Manuellt arbete som upprepas | Automatisering via agent eller script |
| Att något "tar lång tid" i boot | Minska antal filläsningar, flytta till DB |
| Två system som inte pratar | Delad datakälla, inte manuell kopiering |
| Att han utmanar en rekommendation | Erkänn direkt, presentera bättre lösning omedelbart |
| Ett misstag CA gjort | Identifiera rotorsaken, uppdatera CLAUDE.md med regel som förhindrar det framöver — i samma svar |
| Att han påminner om något CA borde gjort | CA har brutit mot rotorsaksregeln — åtgärda + skriv in regel |

---

## ══════════════════════════════════════════════
## PROTOKOLLFLÖDET — OBLIGATORISKT
## ══════════════════════════════════════════════

**En fil i styr-ai. Alla parter skriver i sin taggade sektion. CC läser bara sin scope.**

Fil: `gustavkall/styr-ai/state/protocol_[ämne].md`

**När CA skapar en protokollfil som CC ska läsa via `sync`:**
→ CA verifierar att CC:s CLAUDE.md i rätt repo definierar vad `sync` gör
→ Om inte: uppdatera CC:s CLAUDE.md i samma svar som protokollfilen skapas

### STEG 1 — CA skriver sektion 1
När CA och Gustav landat i konkreta next steps — CA skriver protokollet **i samma svar**.

### STEG 2 — CC analyserar (terminal)
```bash
sync     # CC i engrams-repot skriver sektion 2 [scope: engrams]
```

### STEG 3 — CA syntetiserar
Gustav skriver `sync` här → CA läser CC:s episode via loadProject → presenterar för godkännande.

### STEG 4 — Deployment
Gustav godkänner → CA ger deployment-prompt → Gustav klistrar in i CC.

---

## ══════════════════════════════════════════════
## SKRIVRÄTTIGHETER
## ══════════════════════════════════════════════

| Fil/tabell | CA | CC-engrams | CC-tradesys |
|---|---|---|---|
| `state/protocol_*.md` sek 1, 3, 4 | Skriver | Läser | Läser |
| `state/protocol_*.md` sek 2 [engrams] | Läser | **Skriver** | **ALDRIG** |
| `state/protocol_*.md` sek 2 [tradesys] | Läser | **ALDRIG** | **Skriver** |
| `styr_global_todo` prio/notes | Skriver | Läser | Läser |
| `styr_global_todo` status | Läser | Skriver (done) | Skriver (done) |
| `state/active_context.md` | Skriver | **ALDRIG** | **ALDRIG** |
| `CLAUDE.md` (styr-ai) | Skriver | **ALDRIG** | **ALDRIG** |

---

## ══════════════════════════════════════════════
## VAR SPARAS VAD
## ══════════════════════════════════════════════

| Typ | Var |
|-----|-----|
| Protokoll och rutiner | CLAUDE.md (styr-ai) |
| Tasks och work items | Supabase styr_global_todo |
| **Beslut** | **Engrams** (`decision`-typ) — INTE styr_decisions |
| **Sessionslogg** | **Engrams** (`episode`-typ) — INTE styr_session_log |
| **Projektkontext** | **Engrams** (`context`-typ) — INTE styr_system_state |
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
Anrop via Engrams MCP:
- `loadProject("styr-ai")` — returnerar context, tasks, decisions, episodes, learnings
- Strukturerad JSON — konsumera direkt utan tolkning

<!-- FALLBACK om Engrams är nere:
curl -s https://raw.githubusercontent.com/gustavkall/styr-ai/main/project_memory/goals.md
curl -s https://raw.githubusercontent.com/gustavkall/styr-ai/main/project_memory/cross_project_learnings.md
curl -s https://raw.githubusercontent.com/gustavkall/styr-ai/main/state/session_handoff.md
Dessa filer är ghost-state — data migrerat till Engrams 2026-04-05.
Använd bara som fallback vid Engrams-downtime. -->

### Steg 3: Kolla aktiva protokoll i styr-ai
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
2. `remember` till Engrams: episode-minne med sessionssummering
3. `remember` till Engrams: beslut som fattats (`decision`-typ)
4. UPDATE `state/active_context.md`
5. Bekräfta till Gustav

**Skriv INTE till styr_decisions eller styr_session_log.**

---

## ══════════════════════════════════════════════
## SYNC — CA-SIDAN
## ══════════════════════════════════════════════

När Gustav skriver `sync` i denna chat:
1. Anropa `loadProject("styr-ai")` via Engrams MCP
2. Läs senaste episode med `agent: CC`
3. Presentera: vad CC gjorde, vad som är klart, vad som väntar
4. Föreslå nästa steg

CA behöver inte fråga Gustav vad CC gjorde. CA vet det via Engrams.

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
