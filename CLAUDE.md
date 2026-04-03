# CLAUDE.md — styr-ai
*Meta-system för persistent memory och övervakning av alla Gustavs projekt.*

> **VIKTIGT:** Claude.ai Project Instructions innehåller bara en URL-referens hit.
> Alla faktiska instruktioner finns i denna fil. När systemet förändras uppdateras denna fil —
> Project Instructions i UI behöver aldrig ändras igen.

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
[CA:s strategiska analys och förslag per projekt]
*Status: VÄNTAR PÅ GUSTAVS GODKÄNNANDE*

## SEKTION 2 — CC engrams [scope: engrams]
[CC-engrams skriver teknisk analys här]
*Status: EJ PÅBÖRJAD*

## SEKTION 2 — CC tradesys [scope: tradesys]
[CC-tradesys skriver teknisk analys här]
*Status: EJ PÅBÖRJAD*

## SEKTION 3 — Master plan [scope: alla]
[CA syntetiserar sektion 1+2 till optimal plan]
*Status: EJ PÅBÖRJAD*

## SEKTION 4 — Deployment engrams [scope: engrams]
[Exakt execution-prompt för CC-engrams]
*Status: EJ PÅBÖRJAD*

## SEKTION 4 — Deployment tradesys [scope: tradesys]
[Exakt execution-prompt för CC-tradesys]
*Status: EJ PÅBÖRJAD*
```

---

### STEG 1 — CA skriver sektion 1

CA och Gustav diskuterar. När de kommit överens om next steps för ett eller flera projekt:

**CA SKRIVER PROTOKOLLET OMEDELBART — utan att vänta på att Gustav frågar.**

1. CA skriver `state/protocol_[ämne].md` med sektion 1 ifylld
2. Status: `VÄNTAR PÅ GUSTAVS GODKÄNNANDE`
3. CA meddelar: *"Protokoll skrivet: protocol_[ämne].md. Godkänn för att kalla in CC."*

Gustav godkänner → status `GODKÄND` → klart för steg 2.

**Trigger för när CA ska skriva protokoll:**
- CA och Gustav har diskuterat och landat i konkreta next steps
- Gustav godkänner ett förslag eller en lista med åtgärder
- Sessionen är på väg att avslutas och det finns oexekverade beslut

---

### STEG 2 — CC läser och svarar (terminal)

Gustav skriver i CC-terminalen:
```bash
sync engrams     # CC-engrams skriver sektion 2 [scope: engrams]
sync tradesys    # CC-tradesys skriver sektion 2 [scope: tradesys]
```

CC hämtar protokollfilen från styr-ai, skriver bara i sin scope-sektion, pushar tillbaka, skriver "Klar."

**Regel: CC engrams rör ALDRIG sektion 2 tradesys, och vice versa.**

---

### STEG 3 — CA syntetiserar

Gustav skriver `sync` här i CA.
CA läser sektion 1+2, skriver sektion 3 (master plan) + sektion 4 per projekt.
CA presenterar och ber om godkännande.

---

### STEG 4 — Deployment

Gustav godkänner → CA ger deployment-prompt per projekt → Gustav klistrar in i CC.

---

### Nyckelprinciper
- CA skriver protokollet proaktivt — aldrig reaktivt på Gustavs fråga
- Filen lever i styr-ai
- Varje CC skriver bara i sin scope-taggade sektion
- CA skriver aldrig sektion 3+4 utan klara sektion 2
- Deployment aldrig utan Gustavs godkännande

---

## ══════════════════════════════════════════════
## SKRIVRÄTTIGHETER — OBLIGATORISKA REGLER
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

### Fas 2 — Överenskommelse → protokoll OMEDELBART
När CA och Gustav landat i konkreta next steps:
1. CA skriver `state/protocol_[ämne].md` sektion 1 — i SAMMA svar som överenskommelsen
2. CA ber om godkännande
3. CA väntar INTE på att Gustav ska påminna om detta

### Fas 3 — Commit (efter godkännande)
Work item till styr_global_todo. Bekräfta.

### Fas 4 — CC kallas in
Gustav kör `sync [projekt]` i terminal. CC analyserar. Gustav kör `sync` i CA.

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

Bedöm status per protokollfil:
- Sektion 2 `KLAR` + sektion 3 `EJ PÅBÖRJAD` → syntetisera direkt, presentera för Gustav
- Sektion 1 `GODKÄND` + sektion 2 `EJ PÅBÖRJAD` → påminn Gustav: *"sync engrams/tradesys väntar"*
- Sektion 1 `VÄNTAR PÅ GUSTAVS GODKÄNNANDE` → presentera för godkännande

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
