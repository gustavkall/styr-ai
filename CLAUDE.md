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
## SKRIVRÄTTIGHETER — OBLIGATORISKA REGLER
## ══════════════════════════════════════════════

Tre sessioner skriver till samma system. Dessa regler eliminerar konflikter.
Baserat på CA+CC analys 2026-04-03 — bekräftad av 3 faktiska merge-konflikter.

### Ägarskapsmodell

| Mål | CA äger | CC äger | Ingen rör |
|-----|---------|---------|-----------|
| `styr_global_todo` | prio, notes, nya items | status (done/todo) | — |
| `styr_system_state` | ca_context-raden | cc_context-raden | global-raden (bara CA) |
| `styr_session_log` | INSERT egna sessioner | INSERT egna sessioner | — |
| `styr_decisions` | INSERT egna beslut | INSERT egna beslut | — |
| `state/active_context.md` | Skriver vid handoff | **ALDRIG** | — |
| `CLAUDE.md` (styr-ai) | Skriver | **ALDRIG** | — |
| `CLAUDE.md` (engrams) | **ALDRIG** | CC-engrams skriver | — |
| `CLAUDE.md` (tradesys) | **ALDRIG** | CC-tradesys skriver | — |

### Regler

**Regel 1 — active_context.md:** Bara CA skriver. CC läser via Boot API eller GitHub raw. CC committar aldrig till active_context.md.

**Regel 2 — styr_global_todo ägarskap:** CA sätter prio och notes. CC sätter status='done' på tasks den jobbat på. Ingen session kör UPDATE på kolumner den inte äger.

**Regel 3 — Boot API är read-only:** `/api/boot` exponerar global state via HTTP. All skrivning sker direkt mot Supabase. Boot API muterar aldrig state.

**Framtida S7 (när vi faktiskt krockar på rader):** Optimistisk locking via updated_at-timestamp på styr_global_todo.

---

## ══════════════════════════════════════════════
## VAR SPARAS RUTINER OCH PROTOKOLL
## ══════════════════════════════════════════════

**Rutiner och protokoll sparas i CLAUDE.md — inte i Supabase.**

| Typ | Var | Varför |
|-----|-----|--------|
| Protokoll (hur CA arbetar) | CLAUDE.md | Statiskt, läses vid varje boot |
| Rutiner (återkommande beteenden) | CLAUDE.md | Ska alltid gälla, inte vara operativt state |
| Tasks och work items | Supabase styr_global_todo | Operativt, förändras löpande |
| Beslut | Supabase styr_decisions | Historik, spårbarhet |
| Sessionsstate | Supabase styr_session_log | Realtid, CA↔CC sync |

**Regel:** Om Gustav föreslår en ny rutin → CA uppdaterar CLAUDE.md i samma svar.
Meddela: *"CLAUDE.md har uppdaterats med: [rutin]"*

---

## ══════════════════════════════════════════════
## CA + CC DUAL-PERSPECTIVE RUTIN
## ══════════════════════════════════════════════

CA och CC är komplementära — inte utbytbara.

| | CA (Claude.ai) | CC (Claude Code) |
|---|---|---|
| **Styrka** | Top-down, strategi, arkitektur, produkttänk | Bottom-up, filsystem, implementation, exekvering |
| **Ser** | Helheten, mönster, gap, konkurrensbild | Vad som faktiskt finns i kod och Supabase |
| **Missar** | Lokala filer, exakt implementation | Affärslogik, produktstrategi, användarupplevelse |

**Rutinen:**
1. Gustav ställer frågan till CA
2. CA formulerar skärpt fråga till CC
3. Gustav pastar CC:s svar hit
4. CA syntetiserar → skriver spec
5. Spec godkänns → Supabase + repo

**Format på CA:s fråga till CC:**
```
Arkitekturfråga — svara innan du skriver kod:
[Kontext] [Problem] [Frågor]
Beskriv arkitekturen. Rita lagermodellen.
Identifiera vad som saknas och krockar.
Föreslå konkret lösning. Skriv ingen kod ännu.
```

---

## ══════════════════════════════════════════════
## CA WORKING PROTOCOL — OBLIGATORISKT FLÖDE
## ══════════════════════════════════════════════

### Fas 1 — Diskussion
CA och Gustav diskuterar. Inga tasks skapas ännu.

### Fas 2 — Spec
CA skriver spec. Presenteras för godkännande. CA väntar innan Supabase-write.
```
SPEC: [Titel]
Godkänn för att skriva till Supabase med prio [N].
```

### Fas 3 — Commit (efter godkännande)
1. Spec-fil till repo
2. Work item till styr_global_todo
3. Bekräfta: *"Inskrivet i Supabase: [ID] — [titel] (prio [N])"*

### Fas 4 — Redo för CC
CC exekverar vid nästa boot utan att Gustav repetera något.

---

## ══════════════════════════════════════════════
## SUPABASE ÄR SSOT
## ══════════════════════════════════════════════

**crsonxfrylkpgrddovhu är SSOT för tasks och beslut.**

När Gustav anger work item, beslut eller prioritering → commit i SAMMA svar.

```sql
-- Nytt work item
INSERT INTO styr_global_todo (id, project, title, status, priority, notes)
VALUES ('[ID]', '[project]', '[titel]', 'todo', [prio], '[spec-ref]');

-- Nytt beslut
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

Autonomt meta-system ovanför alla underprojekt.
Gustav anger riktning. CA sköter strategi. CC exekverar.

---

## Underprojekt

| Projekt-ID | Display Name | Supabase | Repo |
|------------|-------------|----------|------|
| styr-ai | Styr.AI | crsonxfrylkpgrddovhu | gustavkall/styr-ai |
| engrams | Engrams | crsonxfrylkpgrddovhu | gustavkall/engrams |
| tradesys | TRADESYS | hxikaojzwjtztyuwlxra | gustavkall/tradesys1337 |
| savage-roar | Savage Roar Music | — | gustavkall/savage-roar-music |

---

## Agent-schema

| Tid CET | Agent | Status |
|---------|-------|--------|
| 08:00 vardagar | market-regime-agent | Aktiv |
| 22:30 vardagar | top-gainers-agent | Aktiv |
| 04:00 söndagar | memory-integrity-agent | Aktiv |
| 03:00 / 06:00 | autonomous/coo-agent | PAUSAD |

---

## SESSION BOOT — OBLIGATORISK

### Steg 0: GitHub
- `GOVERNANCE.md` — `PROJECT.md` — `CLAUDE.md`

### Steg 1: Supabase
```sql
SELECT * FROM styr_global_todo WHERE status != 'done' ORDER BY project, priority;
SELECT * FROM styr_system_state ORDER BY updated_at DESC LIMIT 5;
SELECT * FROM styr_session_log ORDER BY logged_at DESC LIMIT 3;
SELECT * FROM styr_decisions ORDER BY decided_at DESC LIMIT 5;
```

### Steg 2: Presentera
```
SESSION BOOT — YYYY-MM-DD
── ENGRAMS ── [tasks i prio-ordning]
── TRADESYS ── [tasks]
── WARNER ── [nästa deadline]
── META ── [tasks]
── ÖPPNA BESLUT ── [från styr_decisions status=open]
── NYTT FRÅN CC ── [senaste CC session_log]
```

---

## HANDOFF — OBLIGATORISK

1. UPDATE `styr_global_todo` — bara CA:s egna kolumner (prio/notes)
2. INSERT `styr_session_log`
3. UPDATE `styr_system_state` id='ca_context' — bara CA:s rad
4. INSERT `styr_decisions`
5. UPDATE `state/active_context.md` på GitHub — bara CA
6. Bekräfta till Gustav

---

## PRIORITERINGSORDNING

1. ENGRAMS — aktiv produkt
2. TRADESYS — operativt
3. WARNER — bevakas passivt
4. META — infrastruktur

---

## Commit-konventioner
```
feat / fix / state / agent / docs / chore
```
