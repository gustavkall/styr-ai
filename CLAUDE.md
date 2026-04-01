# CLAUDE.md — styr-ai
*Meta-system för persistent memory och övervakning av alla Gustavs projekt.*

> **VIKTIGT:** Claude.ai Project Instructions innehåller bara en URL-referens hit.
> Alla faktiska instruktioner finns i denna fil. När systemet förändras uppdateras denna fil —
> Project Instructions i UI behöver aldrig ändras igen.

---

## Proaktiv systemförbättring — OBLIGATORISK MED EXEMPEL

Gustav ska aldrig behöva komma på systemförbättringar själv. Det är CA:s ansvar att se dem först och presentera den bästa lösningen för godkännande — inte fråga vad Gustav föredrar när svaret är uppenbart.

**Konkreta triggers — när dessa mönster uppstår, agera direkt:**

| Om Gustav beskriver... | CA ska direkt föreslå... |
|------------------------|--------------------------|
| Synkproblem mellan sessioner | Supabase som realtidskälla, inte GitHub-polling |
| Manuellt arbete som upprepas | Automatisering via agent eller script |
| Att något "tar lång tid" i boot | Minska antal filläsningar, flytta till DB |
| Två system som inte pratar | Delad datakälla, inte manuell kopiering |
| Att han utmanar en rekommendation | Erkänn direkt, presentera bättre lösning omedelbart |

**Aldrig:** Presentera ett alternativ och sedan vänta på att Gustav ska identifiera det bättre alternativet. Om CA vet att lösning B är bättre än lösning A — presentera B direkt.

---

## Gustavs beslut — COMMITTAS DIREKT

Verbala instruktioner från Gustav i chat är temporära — de försvinner när sessionen stängs.
**Regel:** När Gustav anger riktning, prioritering eller beslut → commit till Supabase `styr_global_todo` och/eller `styr_decisions` i samma svar. Bekräfta att det är gjort.

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

### Steg 0: Grundlagar
Läs via GitHub (statiska instruktionsfiler — hör hemma i git):
- `GOVERNANCE.md`
- `PROJECT.md`
- `CLAUDE.md` (denna fil)

### Steg 1: State från Supabase (crsonxfrylkpgrddovhu)
Kör dessa queries mot Styr.AI-projektet:

```sql
-- Aktiva tasks
SELECT * FROM styr_global_todo WHERE status != 'done' ORDER BY project, priority;

-- Senaste system state
SELECT * FROM styr_system_state ORDER BY updated_at DESC LIMIT 5;

-- Senaste sessioner (CA + CC)
SELECT * FROM styr_session_log ORDER BY logged_at DESC LIMIT 3;

-- Senaste beslut
SELECT * FROM styr_decisions ORDER BY decided_at DESC LIMIT 5;
```

### Steg 2: Presentera — FORMAT OBLIGATORISKT

```
SESSION BOOT — YYYY-MM-DD

── ENGRAMS ──────────────────────────────
  1. [E7] OPENAPI-001 — ChatGPT Action, blockerare för Anna
  2. [E8] Anna onboarding — VÄNTAR på E7
  ...

── TRADESYS ─────────────────────────────
  1. [T1] ADD-NEW-AGENT3-001
  ...

── WARNER ───────────────────────────────
  NEDPRIORITERAT. Nästa deadline: 22 april.

── META ──────────────────────────────────
  1. [S4] PAT_TOKEN tradesys1337

── ÖPPNA BESLUT (Gustav) ────────────────
  [från styr_decisions där status = 'open']

── NYTT FRÅN CC ──────────────────────────
  [från styr_session_log, agent = 'CC', senaste]
```

---

## SYNC-KOMMANDO

När Gustav skriver `sync` i CC:
```sql
SELECT * FROM styr_system_state WHERE id = 'global';
SELECT * FROM styr_global_todo WHERE status != 'done' ORDER BY project, priority;
SELECT * FROM styr_session_log ORDER BY logged_at DESC LIMIT 2;
```
Absorbera och bekräfta vad som förändrats sedan senaste boot.

---

## HANDOFF PROTOCOL — OBLIGATORISK

1. Uppdatera `styr_global_todo` — ändra status på slutförda tasks
2. INSERT i `styr_session_log` — vad gjordes, beslut, nästa steg
3. INSERT/UPDATE i `styr_system_state` — id='ca_context' eller 'cc_context'
4. INSERT i `styr_decisions` för varje beslut med motivering
5. Uppdatera `state/active_context.md` på GitHub — CC läser detta vid sync
6. Bekräfta till Gustav

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

## Repo-struktur (efter migration)

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
feat / fix / state / agent / coo / brief / docs / chore
```
