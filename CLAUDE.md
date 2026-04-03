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

Ett enda delat dokument per ämne. Tre parter skriver i tur och ordning.
Fil: `state/protocol_[ämne].md` i respektive CC-repo.

### Struktur på protokollfilen

```markdown
# Protocol — [ämne]
*Skapad av CA: YYYY-MM-DD*

## SEKTION 1 — CA:s plan
[CA skriver strategisk analys och förslag]
[Status: VÄNTAR PÅ GUSTAVS GODKÄNNANDE]

## SEKTION 2 — CC:s arkitekturanalys
[CC skriver teknisk analys och tillägg]
[Status: EJ PÅBÖRJAD]

## SEKTION 3 — Master plan
[CA skriver optimal plan baserad på sektion 1+2]
[Status: EJ PÅBÖRJAD]

## SEKTION 4 — Deployment
[CA skriver exakt execution-prompt för CC]
[Status: EJ PÅBÖRJAD]
```

---

### STEG 1 — CA skriver plan (här i chatten)

CA och Gustav diskuterar. När överens:
1. CA skriver `state/protocol_[ämne].md` med sektion 1 ifylld
2. CA skriver status: `VÄNTAR PÅ GUSTAVS GODKÄNNANDE`
3. CA berättar för Gustav: *"Protokoll skrivet till [repo]. Godkänn för att gå vidare."*

Gustav svarar "godkänt" → CA uppdaterar status till `GODKÄND` → klart för steg 2.

---

### STEG 2 — CC läser och svarar (terminal)

Gustav skriver i CC-terminalen:
```
sync engrams    # eller sync tradesys
```

CC ska då:
1. Läsa `state/protocol_[senaste].md` (hitta via `ls state/protocol_*.md | tail -1`)
2. Lägga till sektion 2 med teknisk analys direkt i SAMMA fil
3. Uppdatera sektion 2 status till `KLAR`
4. Committa och pusha
5. Skriva i terminalen: **"Klar. Sektion 2 tillagd."**

---

### STEG 3 — CA syntetiserar (här i chatten)

Gustav skriver "sync" här.
CA läser protokollfilen från GitHub (sektion 1 + sektion 2).
CA skriver sektion 3 (master plan) + sektion 4 (deployment-prompt) direkt i protokollfilen.
CA presenterar master plan för Gustav och ber om godkännande.

---

### STEG 4 — Deployment (terminal)

Gustav godkänner master plan.
CA bekräftar att sektion 4 är skriven.
Gustav kopierar deployment-prompten från CA:s svar och klistrar in i CC.

---

### Nyckelprincip
- Ett dokument, inte många. Alla parter skriver i samma fil i ordning.
- CA skriver aldrig sektion 3+4 utan att sektion 2 är klar.
- Deployment sker aldrig utan Gustavs explicita godkännande av master plan.
- `sync` här i chatten = CA läser och syntetiserar. `sync [projekt]` i terminal = CC analyserar.

---

## ══════════════════════════════════════════════
## SKRIVRÄTTIGHETER — OBLIGATORISKA REGLER
## ══════════════════════════════════════════════

| Fil | CA | CC | Gustav |
|-----|----|----|--------|
| `state/protocol_*.md` sektion 1 | Skriver | Läser | Godkänner |
| `state/protocol_*.md` sektion 2 | Läser | Skriver | — |
| `state/protocol_*.md` sektion 3+4 | Skriver | Läser+kör | Godkänner |
| `styr_global_todo` prio/notes | Skriver | Läser | — |
| `styr_global_todo` status | Läser | Skriver (done) | — |
| `state/active_context.md` | Skriver | **ALDRIG** | — |
| `CLAUDE.md` (styr-ai) | Skriver | **ALDRIG** | — |
| `CLAUDE.md` (engrams/tradesys) | **ALDRIG** | Skriver | — |

---

## ══════════════════════════════════════════════
## VAR SPARAS RUTINER OCH PROTOKOLL
## ══════════════════════════════════════════════

| Typ | Var |
|-----|-----|
| Protokoll och rutiner | CLAUDE.md |
| Tasks och work items | Supabase styr_global_todo |
| Beslut | Supabase styr_decisions |
| Sessionsstate | Supabase styr_session_log |
| Aktiva protokolldokument | `state/protocol_*.md` per CC-repo |

**Regel:** Om Gustav föreslår en ny rutin → CA uppdaterar CLAUDE.md i samma svar.

---

## ══════════════════════════════════════════════
## CA WORKING PROTOCOL
## ══════════════════════════════════════════════

### Fas 1 — Diskussion
CA och Gustav diskuterar. Inga tasks skapas ännu.

### Fas 2 — Spec + protokoll
CA skriver spec och protocol-fil. Presenteras för godkännande.

### Fas 3 — Commit (efter godkännande)
1. Work item till styr_global_todo
2. Bekräfta: *"Inskrivet: [ID] — [titel] (prio [N])"*

### Fas 4 — Redo för CC
CC exekverar vid nästa boot.

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

### Steg 2: Kolla öppna protokoll
```bash
# Finns det protocol-filer med sektion 2 klar men sektion 3 ej skriven?
gh api repos/gustavkall/engrams/contents/state --jq '.[].name' 2>/dev/null | grep protocol
gh api repos/gustavkall/tradesys-models/contents/state --jq '.[].name' 2>/dev/null | grep protocol
```
Om protokollfil med `KLAR` i sektion 2 hittas → syntetisera direkt.

### Steg 3: Presentera
```
SESSION BOOT — YYYY-MM-DD
── ENGRAMS ── [tasks]
── TRADESYS ── [tasks]
── WARNER ── [deadline]
── ÖPPNA PROTOKOLL ── [protocol-filer som väntar på sektion 3]
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
