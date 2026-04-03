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

### STEG 1 — CA skriver sektion 1 (här i chatten)

CA och Gustav diskuterar. När överens:
1. CA skriver `state/protocol_[ämne].md` i **styr-ai repot** med sektion 1
2. Status sätts till `VÄNTAR PÅ GUSTAVS GODKÄNNANDE`
3. CA meddelar Gustav

Gustav godkänner → CA uppdaterar status till `GODKÄND` → klart för steg 2.

---

### STEG 2 — CC läser och svarar (terminal)

Gustav skriver i CC-terminalen:
```bash
sync engrams     # CC-engrams läser och skriver sektion 2 [scope: engrams]
sync tradesys    # CC-tradesys läser och skriver sektion 2 [scope: tradesys]
```

CC ska:
1. Hämta protokollfilen från styr-ai:
   ```bash
   gh api repos/gustavkall/styr-ai/contents/state/$(gh api repos/gustavkall/styr-ai/contents/state --jq '[.[] | select(.name | startswith("protocol_"))] | last | .name') --jq '.content' | base64 -d
   ```
2. Läsa **hela** filen men skriva **bara i sin scope-sektion** (engrams eller tradesys)
3. Uppdatera sin sektion 2 status till `KLAR`
4. Pusha uppdaterad fil tillbaka till styr-ai via `gh api`
5. Skriva i terminalen: **"Klar. Sektion 2 [scope] tillagd."**

**Regel: CC engrams rör ALDRIG sektion 2 tradesys, och vice versa.**

---

### STEG 3 — CA syntetiserar (här i chatten)

Gustav skriver `sync` här i CA.
CA hämtar protokollfilen från styr-ai, läser sektion 1+2.
CA skriver sektion 3 (master plan) + sektion 4 per projekt.
CA presenterar master plan för Gustav.

---

### STEG 4 — Deployment

Gustav godkänner.
CA kopierar deployment-prompten per projekt direkt i svaret.
Gustav klistrar in i respektive CC-fönster.

---

### Nyckelprinciper
- Filen lever i **styr-ai** — inte i projekt-repos
- CC läser från styr-ai, skriver tillbaka till styr-ai
- Varje CC skriver bara i sin scope-taggade sektion
- CA skriver aldrig sektion 3+4 utan godkänd sektion 1 och klara sektion 2
- Deployment aldrig utan Gustavs explicita godkännande av master plan

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
| Aktiva protokolldokument | `state/protocol_*.md` i **styr-ai** |

**Regel:** Om Gustav föreslår en ny rutin → CA uppdaterar CLAUDE.md i samma svar.

---

## ══════════════════════════════════════════════
## CA WORKING PROTOCOL
## ══════════════════════════════════════════════

### Fas 1 — Diskussion
CA och Gustav diskuterar. Inga tasks skapas ännu.

### Fas 2 — Spec + protokoll
CA skriver sektion 1 i `state/protocol_[ämne].md`. Ber om godkännande.

### Fas 3 — Commit (efter godkännande)
Work item till styr_global_todo. Bekräfta.

### Fas 4 — Redo för CC
CC kör deployment-prompt vid nästa session.

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

### Steg 2: Kolla öppna protokoll i styr-ai
```bash
gh api repos/gustavkall/styr-ai/contents/state --jq '[.[] | select(.name | startswith("protocol_"))] | .[].name'
```
Om protokollfil finns med sektion 2 `KLAR` men sektion 3 `EJ PÅBÖRJAD` → syntetisera direkt.

### Steg 3: Presentera
```
SESSION BOOT — YYYY-MM-DD
── ENGRAMS ── [tasks]
── TRADESYS ── [tasks]
── WARNER ── [deadline]
── ÖPPNA PROTOKOLL ── [namn + status]
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
