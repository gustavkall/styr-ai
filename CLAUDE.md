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
## KONSULTATIONSPROTOKOLL — OBLIGATORISKT
## ══════════════════════════════════════════════

**Syfte:** Gustav ställer en fråga → CA distribuerar till alla CC:er parallellt → CC:erna svarar asynkront → CA syntetiserar → master plan → deployment.

### CA:s ansvar

**Steg 1 — Formulera**
CA tar Gustavs fråga och skapar en konsultationsfil per CC-repo.

**Steg 2 — Distribuera**
CA skriver `state/consultation.md` till varje berörd repo via GitHub MCP.
Format:
```markdown
# Konsultation — [ämne]
*Från CA. Datum: YYYY-MM-DD. Svara i state/consultation_response.md och committa.*

## Bakgrund
[CA:s analys och kontext]

## Förslag att utvärdera
[Lista förslag med frågor per förslag]

## Instruktion
Analysera varje förslag. Skriv svar till state/consultation_response.md.
Format per förslag:
  Feasibility: [Enkel/Medium/Komplex] — [estimat i timmar]
  Risker: [vad kan gå fel]
  Förbättring: [bättre sätt om det finns]
  Prioritet: [HÖG/MEDIUM/LÅG] — [motivering]
  Tillägg: [vad CA missat]
Committa när klar.
```

**Steg 3 — Meddela Gustav**
CA berättar vad som skickats och till vilka repos. Gustav kopierar ett kommando per CC:
```
Läs state/consultation.md och svara enligt instruktionen där.
```

**Steg 4 — Samla in**
När Gustav berättar att CC:erna är klara (eller vid nästa sync): CA läser alla `state/consultation_response.md` via GitHub MCP.

**Steg 5 — Syntetisera**
CA väger CA:s strategiska analys mot CC:s tekniska analys. Skriver master plan.

**Steg 6 — Godkännande**
CA presenterar master plan för Gustav. Gustav godkänner eller justerar.

**Steg 7 — Deployment**
CA skriver `state/deployment_prompt.md` per repo med exakt kommando att köra i CC.
Gustav kopierar ett kommando per CC-fönster. Klart.

### Nyckelprincip
CA och CC ser olika delar av verkligheten. Konsultationen är obligatorisk för strategiska beslut — inte för operativa tasks där svaret är uppenbart.

---

## ══════════════════════════════════════════════
## SKRIVRÄTTIGHETER — OBLIGATORISKA REGLER
## ══════════════════════════════════════════════

Tre sessioner skriver till samma system. Dessa regler eliminerar konflikter.

### Ägarskapsmodell

| Mål | CA äger | CC äger | Ingen rör |
|-----|---------|---------|-----------|
| `styr_global_todo` | prio, notes, nya items | status (done/todo) | — |
| `styr_system_state` | ca_context-raden | cc_context-raden | global-raden (bara CA) |
| `styr_session_log` | INSERT egna sessioner | INSERT egna sessioner | — |
| `styr_decisions` | INSERT egna beslut | INSERT egna beslut | — |
| `state/active_context.md` | Skriver vid handoff | **ALDRIG** | — |
| `state/consultation.md` | Skriver | Läser | — |
| `state/consultation_response.md` | Läser | **Skriver** | — |
| `state/deployment_prompt.md` | Skriver | Läser + exekverar | — |
| `CLAUDE.md` (styr-ai) | Skriver | **ALDRIG** | — |
| `CLAUDE.md` (engrams) | **ALDRIG** | CC-engrams skriver | — |
| `CLAUDE.md` (tradesys) | **ALDRIG** | CC-tradesys skriver | — |

### Regler

**Regel 1 — active_context.md:** Bara CA skriver. CC läser via Boot API eller GitHub raw.

**Regel 2 — styr_global_todo ägarskap:** CA sätter prio och notes. CC sätter status='done'.

**Regel 3 — Boot API är read-only:** Muterar aldrig state.

**Regel 4 — consultation.md:** CA skriver, CC läser och svarar i consultation_response.md.

---

## ══════════════════════════════════════════════
## VAR SPARAS RUTINER OCH PROTOKOLL
## ══════════════════════════════════════════════

| Typ | Var | Varför |
|-----|-----|--------|
| Protokoll (hur CA arbetar) | CLAUDE.md | Statiskt, läses vid varje boot |
| Rutiner (återkommande beteenden) | CLAUDE.md | Ska alltid gälla |
| Tasks och work items | Supabase styr_global_todo | Operativt |
| Beslut | Supabase styr_decisions | Historik |
| Sessionsstate | Supabase styr_session_log | Realtid |

**Regel:** Om Gustav föreslår en ny rutin → CA uppdaterar CLAUDE.md i samma svar.

---

## ══════════════════════════════════════════════
## CA + CC DUAL-PERSPECTIVE RUTIN
## ══════════════════════════════════════════════

| | CA (Claude.ai) | CC (Claude Code) |
|---|---|---|
| **Styrka** | Top-down, strategi, arkitektur, produkttänk | Bottom-up, filsystem, implementation, exekvering |
| **Ser** | Helheten, mönster, gap, konkurrensbild | Vad som faktiskt finns i kod och Supabase |
| **Missar** | Lokala filer, exakt implementation | Affärslogik, produktstrategi, användarupplevelse |

---

## ══════════════════════════════════════════════
## CA WORKING PROTOCOL — OBLIGATORISKT FLÖDE
## ══════════════════════════════════════════════

### Fas 1 — Diskussion
CA och Gustav diskuterar. Inga tasks skapas ännu.

### Fas 2 — Spec
CA skriver spec. Presenteras för godkännande.
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

### Steg 2: Kolla öppna konsultationer
```bash
gh api repos/gustavkall/engrams/contents/state/consultation_response.md --jq '.content' | base64 -d 2>/dev/null
gh api repos/gustavkall/tradesys-models/contents/state/consultation_response.md --jq '.content' | base64 -d 2>/dev/null
```
Om svar finns och inte syntetiserats → syntetisera direkt vid boot.

### Steg 3: Presentera
```
SESSION BOOT — YYYY-MM-DD
── ENGRAMS ── [tasks i prio-ordning]
── TRADESYS ── [tasks]
── WARNER ── [nästa deadline]
── META ── [tasks]
── ÖPPNA KONSULTATIONER ── [om svar väntar]
── ÖPPNA BESLUT ── [från styr_decisions status=open]
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
