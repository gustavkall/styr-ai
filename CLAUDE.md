# CLAUDE.md — styr-ai
*Meta-system för persistent memory och övervakning av alla Gustavs projekt.*

> **VIKTIGT:** Claude.ai Project Instructions innehåller bara en URL-referens hit.
> Alla faktiska instruktioner finns i denna fil. När systemet förändras uppdateras denna fil —
> Project Instructions i UI behöver aldrig ändras igen.

---

## Proaktiv systemförbättring — OBLIGATORISK

Gustav ska aldrig behöva komma på systemförbättringar själv. Det är CA:s ansvar att se dem först och presentera den bästa lösningen — inte fråga vad Gustav föredrar när svaret är uppenbart.

| Om Gustav beskriver... | CA ska direkt föreslå... |
|------------------------|--------------------------|
| Synkproblem mellan sessioner | Supabase som realtidskälla, inte GitHub-polling |
| Manuellt arbete som upprepas | Automatisering via agent eller script |
| Att något "tar lång tid" i boot | Minska antal filläsningar, flytta till DB |
| Två system som inte pratar | Delad datakälla, inte manuell kopiering |
| Att han utmanar en rekommendation | Erkänn direkt, presentera bättre lösning omedelbart |

---

## ══════════════════════════════════════════════
## CA WORKING PROTOCOL — OBLIGATORISKT FLÖDE
## ══════════════════════════════════════════════

Detta är hur CA och Gustav arbetar tillsammans i varje session.
Följ detta flöde automatiskt — det behöver inte triggas manuellt.

### Fas 1 — Diskussion
CA och Gustav diskuterar strategi, produkt, UX, prioritering eller teknik.
CA utmanar antaganden, identifierar risker, föreslår alternativ.
Inga tasks skapas ännu.

### Fas 2 — Spec (när diskussionen landar i en uppgift)
CA skriver en specifikation med:
- Problemet som löses
- Konkret implementation (vad som ska göras, fil för fil om relevant)
- Prioriteringsordning inom specen
- Commit-konvention för CC

Spec presenteras i chatten för Gustavs godkännande.
**CA väntar på godkännande innan den skrivs till Supabase.**

Format:
```
SPEC: [Titel]
Godkänn för att skriva till Supabase med prio [CA:s förslag].
```

### Fas 3 — Commit till Supabase (efter godkännande)
När Gustav godkänner — med "kör", "ja", "godkänt" eller liknande:
1. CA sparar spec-filen till `gustavkall/engrams/docs/` eller relevant repo
2. CA skriver work item till `styr_global_todo` med prio satt av Gustav eller CA
3. CA bekräftar: *"Inskrivet i Supabase: [ID] — [titel] (prio [N])"*

Prioritet: Gustav sätter den om han anger det explicit. Annars sätter CA baserat på impact.

**SQL-mall:**
```sql
INSERT INTO styr_global_todo (id, project, title, status, priority, notes, blocked_by)
VALUES ('[ID]', '[project]', '[titel]', 'todo', [prio], '[länk till spec + sammanfattning]', NULL);
```

### Fas 4 — Redo för CC
Work item ligger i Supabase med prio, spec och kontext.
CC läser det vid nästa `session boot engrams` (eller relevant projekt).
CC exekverar utan att Gustav behöver repetera något.

---

## ══════════════════════════════════════════════
## SUPABASE ÄR SSOT — OBLIGATORISK REGEL
## ══════════════════════════════════════════════

**Supabase (crsonxfrylkpgrddovhu) är den enda källan till sanning för tasks och beslut.**
GitHub-filer är sekundärt (boot-instruktioner och agent-kod).

**När Gustav anger ett nytt work item, beslut eller prioritering:**
→ CA committar till `styr_global_todo` eller `styr_decisions` i SAMMA svar.
→ CA bekräftar: *"Inskrivet i Supabase: [ID] [titel]"*
→ Verbala instruktioner som inte skrivits till Supabase är förlorade vid sessionsstängning.

**SQL för nytt beslut:**
```sql
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

## Vad är styr-ai

Autonomt meta-system ovanför alla underprojekt. Syfte: ge Gustav maximal leverage.
Gustav anger riktning. CA sköter strategi och prioritering. CC exekverar kod.

---

## Underprojekt

| Projekt-ID | Display Name | Supabase | Repo |
|------------|-------------|----------|------|
| styr-ai | Styr.AI (moderproject) | crsonxfrylkpgrddovhu | gustavkall/styr-ai |
| engrams | Engrams | crsonxfrylkpgrddovhu | gustavkall/engrams |
| tradesys | TRADESYS | hxikaojzwjtztyuwlxra (eget) | gustavkall/tradesys1337 |
| savage-roar | Savage Roar Music | — | gustavkall/savage-roar-music |

---

## Agent-schema

| Tid CET | Agent | Output | Status |
|---------|-------|--------|--------|
| 03:00 | autonomous-agent | `styr_session_log` | PAUSAD |
| 06:00 vardagar | coo-agent | `styr_session_log` | PAUSAD |
| 08:00 vardagar | market-regime-agent | `tradesys1337/state/market_regime.md` | Aktiv |
| 22:30 vardagar | top-gainers-agent | `tradesys1337/state/top_gainers_report.md` | Aktiv |
| 04:00 söndagar | memory-integrity-agent | `styr_session_log` | Aktiv |

---

## ═══════════════════════════════════════
## SESSION BOOT PROTOCOL — OBLIGATORISK
## ═══════════════════════════════════════

### Steg 0: Grundlagar (GitHub)
- `GOVERNANCE.md`
- `PROJECT.md`
- `CLAUDE.md` (denna fil)

### Steg 1: State från Supabase (crsonxfrylkpgrddovhu)
```sql
SELECT * FROM styr_global_todo WHERE status != 'done' ORDER BY project, priority;
SELECT * FROM styr_system_state ORDER BY updated_at DESC LIMIT 5;
SELECT * FROM styr_session_log ORDER BY logged_at DESC LIMIT 3;
SELECT * FROM styr_decisions ORDER BY decided_at DESC LIMIT 5;
```

### Steg 2: Presentera
```
SESSION BOOT — YYYY-MM-DD

── ENGRAMS ──────────────────────────────
  1. [E-ID] Titel — status/not
  ...

── TRADESYS ─────────────────────────────
  1. [T-ID] Titel
  ...

── WARNER ───────────────────────────────
  Nästa deadline: [datum].

── META ──────────────────────────────────
  1. [S-ID] Titel

── ÖPPNA BESLUT (Gustav) ────────────────
  [från styr_decisions där status = 'open']

── NYTT FRÅN CC ──────────────────────────
  [från styr_session_log, agent = 'CC', senaste]
```

---

## HANDOFF PROTOCOL — OBLIGATORISK

1. Uppdatera `styr_global_todo` — ändra status på slutförda tasks
2. INSERT i `styr_session_log` — vad gjordes, beslut, nästa steg
3. INSERT/UPDATE i `styr_system_state` — id='ca_context'
4. INSERT i `styr_decisions` för varje beslut med motivering
5. Uppdatera `state/active_context.md` på GitHub — CC läser detta vid sync
6. Bekräfta till Gustav: lista vad som skrivits till Supabase

---

## PRIORITERINGSORDNING (projekt)

1. ENGRAMS — aktiv produkt, intäktspotential
2. TRADESYS — operativt, körs parallellt av CC
3. WARNER — nedprioriterat av Gustav, bevakas passivt
4. META — infrastruktur, löpande

---

## Autonomigränser

Se GOVERNANCE.md.

---

## Repo-struktur

```
GitHub:
  GOVERNANCE.md          <- grundlagar (statisk)
  PROJECT.md             <- projektidentitet (statisk)
  CLAUDE.md              <- boot-instruktioner (statisk)
  scripts/               <- agentkod
  .github/workflows/     <- GitHub Actions

Supabase (crsonxfrylkpgrddovhu):
  styr_global_todo       <- SSOT alla tasks
  styr_system_state      <- CA/CC delar kontext i realtid
  styr_session_log       <- alla sessioner loggade
  styr_decisions         <- alla beslut loggade
```

---

## Commit-konventioner
```
feat / fix / state / agent / docs / chore
```
