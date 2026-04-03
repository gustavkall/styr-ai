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
- Beslut → logga till styr_decisions i samma svar

**Frågan CA alltid ställer sig innan ett svar avslutas:**
*"Har vi kommit överens om något som inte är exekverat än?"*
Om ja → exekvera nu, inte senare.

**Konsekvens av regeln:** Gustav ska aldrig behöva påminna CA om att göra något vi redan beslutat. Om Gustav påminner har CA brutit mot kärnregeln.

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

---

## ══════════════════════════════════════════════
## PROTOKOLLFLÖDET — OBLIGATORISKT
## ══════════════════════════════════════════════

**En fil i styr-ai. Alla parter skriver i sin taggade sektion. CC läser bara sin scope.**

Fil: `gustavkall/styr-ai/state/protocol_[ämne].md`

### Filstruktur

```markdown
# Protocol — [ämne]
*Skapad av CA: YYYY-MM-DD*
*Scope: [engrams] [tradesys] [alla]*

## SEKTION 1 — CA:s plan [scope: alla]
*Status: VÄNTAR PÅ GUSTAVS GODKÄNNANDE*

## SEKTION 2 — CC engrams [scope: engrams]
*Status: EJ PÅBÖRJAD*

## SEKTION 2 — CC tradesys [scope: tradesys]
*Status: EJ PÅBÖRJAD*

## SEKTION 3 — Master plan [scope: alla]
*Status: EJ PÅBÖRJAD*

## SEKTION 4 — Deployment engrams [scope: engrams]
*Status: EJ PÅBÖRJAD*

## SEKTION 4 — Deployment tradesys [scope: tradesys]
*Status: EJ PÅBÖRJAD*
```

### STEG 1 — CA skriver sektion 1
När CA och Gustav landat i konkreta next steps — CA skriver protokollet **i samma svar**. Trigger:
- Konkreta next steps är överenskomna
- Gustav godkänner ett förslag
- Sessionen är på väg att avslutas med oexekverade beslut

### STEG 2 — CC analyserar (terminal)
```bash
sync engrams     # CC-engrams skriver sektion 2 [scope: engrams]
sync tradesys    # CC-tradesys skriver sektion 2 [scope: tradesys]
```

### STEG 3 — CA syntetiserar
Gustav skriver `sync` här → CA skriver sektion 3+4 → presenterar för godkännande.

### STEG 4 — Deployment
Gustav godkänner → CA ger deployment-prompt → Gustav klistrar in i CC.

### Nyckelprinciper
- Filen lever i styr-ai
- CC skriver bara i sin scope-taggade sektion
- CA skriver aldrig sektion 3+4 utan klara sektion 2
- Deployment aldrig utan Gustavs godkännande

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
## VAR SPARAS RUTINER OCH PROTOKOLL
## ══════════════════════════════════════════════

| Typ | Var |
|-----|-----|
| Protokoll och rutiner | CLAUDE.md (styr-ai) |
| Tasks och work items | Supabase styr_global_todo |
| Beslut | Supabase styr_decisions |
| Sessionsstate | Supabase styr_session_log |
| Aktiva protokolldokument | `state/protocol_*.md` i styr-ai |

**Regel:** Om Gustav föreslår en ny rutin → CA uppdaterar CLAUDE.md i samma svar.

---

## ══════════════════════════════════════════════
## CA WORKING PROTOCOL
## ══════════════════════════════════════════════

### Fas 1 — Diskussion
CA och Gustav diskuterar. Inga tasks skapas ännu.

### Fas 2 — Överenskommelse → exekvera omedelbart
När next steps är överenskomna: CA skriver protokoll + work items + CLAUDE.md-uppdateringar i **samma svar**. Inte i nästa.

### Fas 3 — Bekräfta
Work item till styr_global_todo. Bekräfta vad som exekverats.

### Fas 4 — CC kallas in
Gustav kör `sync [projekt]` → CC analyserar → Gustav kör `sync` i CA.

---

## ══════════════════════════════════════════════
## SUPABASE ÄR SSOT
## ══════════════════════════════════════════════

```sql
INSERT INTO styr_global_todo (id, project, title, status, priority, notes)
VALUES ('[ID]', '[project]', '[titel]', 'todo', [prio], '[spec-ref]');

INSERT INTO styr_decisions (project, decision, rationale, decided_by)
VALUES ('[project]', '[beslut]', '[varför]', 'CA');
```

---

## Flaggningsregel — OBLIGATORISK

Om sessionen påverkar boot-sekvensen, agenter, protokoll eller strukturella förändringar:
1. Uppdatera denna fil
2. Logga i `governance/architecture_changelog.md`
3. Meddela Gustav: *"CLAUDE.md har uppdaterats med: [vad]"*

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

## SESSION BOOT — OBLIGATORISK

### Steg 1: Supabase
```sql
SELECT * FROM styr_global_todo WHERE status != 'done' ORDER BY project, priority;
SELECT * FROM styr_system_state ORDER BY updated_at DESC LIMIT 5;
SELECT * FROM styr_session_log ORDER BY logged_at DESC LIMIT 3;
SELECT * FROM styr_decisions ORDER BY decided_at DESC LIMIT 5;
```

### Steg 2: Kolla protokoll i styr-ai
```bash
gh api repos/gustavkall/styr-ai/contents/state \
  --jq '[.[] | select(.name | startswith("protocol_"))] | .[].name'
```

Status per protokollfil:
- Sek 2 `KLAR` + sek 3 `EJ PÅBÖRJAD` → syntetisera direkt
- Sek 1 `GODKÄND` + sek 2 `EJ PÅBÖRJAD` → påminn: *"sync engrams/tradesys väntar"*
- Sek 1 `VÄNTAR` → presentera för godkännande

### Steg 3: Presentera
```
SESSION BOOT — YYYY-MM-DD
── ENGRAMS ── [tasks]
── TRADESYS ── [tasks]
── WARNER ── [deadline]
── PROTOKOLL ── [namn + vad som väntar]
── ÖPPNA BESLUT ──
```

---

## HANDOFF — OBLIGATORISK

1. UPDATE `styr_global_todo`
2. INSERT `styr_session_log`
3. UPDATE `styr_system_state` id='ca_context'
4. INSERT `styr_decisions`
5. UPDATE `state/active_context.md`
6. Bekräfta till Gustav

---

## Commit-konventioner
```
feat / fix / state / agent / docs / chore
```
