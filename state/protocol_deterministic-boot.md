# Protocol — deterministic boot
*Skapad av CA: 2026-04-07*
*Scope: [engrams]*
*Status: VÄNTAR PÅ CC:s FEEDBACK*

---

## SEKTION 1 — CA:s spec

### Problem

CA:s session boot är inte deterministisk. CA läser GitHub-repos vid boot trots instruktioner att inte göra det. Rotorsäk identifierade:

1. **README.md** i underprojekt innehöll explicita boot-instruktioner (tradesys1337/README.md sa åt CA att läsa state-filer). Fixat.
2. **Legacy state-filer** i styr-ai/state/ med gammal data. Raderade.
3. **`loadProject()`** returnerar inte tillräcklig data — CA kompenserar med GitHub-läsning.

Den permanenta lösningen: `loadProject("styr-ai")` måste returnera allt CA behöver vid boot, så att GitHub-läsning är onödig.

### Vad loadProject behöver returnera

Idag returnerar `loadProject("styr-ai")`:
- context, learnings, episodes, profile

Det saknas:
- **Aktiva tasks** (ligger i Supabase styr_global_todo, inte i Engrams)
- **Öppna protokoll** (namn + status på protocol-filer med VÄNTAR)
- **Warner-deadline** (22 april — behövs alltid i boot)

### Föreslagen lösning

**Option A: Migrera tasks till Engrams**
Flytta styr_global_todo till Engrams task-typ. `loadProject()` returnerar tasks direkt.
- Fördel: ett system, ett anrop
- Nackdel: migration, Supabase som SSOT för tasks är bevisad och fungerar

**Option B: Boot API endpoint**
Ny endpoint `GET /api/boot?project=styr-ai` som hämtar Engrams + Supabase och returnerar ett strukturerat JSON-svar:
```json
{
  "tasks": [{"id": "E-BRAIN-ARCH-001", "title": "...", "priority": 1}],
  "memories": {"context": [], "episodes": [], "learnings": []},
  "protocols": [{"name": "protocol_brain-architecture.md", "status": "VÄNTAR"}],
  "deadlines": [{"name": "Warner audit", "date": "2026-04-22", "days_left": 15}]
}
```
CA gör ett anrop till Boot API — får allt, läser inget annat.
- Fördel: deterministiskt, Supabase behålls som SSOT för tasks
- Nackdel: ny endpoint att underhålla

**Option C: Supabase Edge Function**
Samma som B men i Supabase istället för Vercel.

**CA rekommenderar Option B** — lägst risk, bevarar befintlig arkitektur.

### Warner-deadline

En kontextminne i Engrams med Warner-deadline så att den alltid återkommer i loadProject:
```
remember(type:context, project:styr-ai, content:"Warner audit §8.3 startar 22 april 2026. Cure period löper till 22 maj 2026.")
```

---

## SEKTION 2 — CC engrams feedback [scope: engrams]
*CC-engrams. Datum: 2026-04-07*

### DETERMINISTISK BOOT

Option A vs B vs C — vad är rätt arkitektur?
**Option A — vi har redan kört den.** Tasks är migrerade till Engrams task-typ via api/tasks.js. styr_global_todo är inte längre SSOT — det är legacy-data. Fördelen: ett system, ett anrop, samma minneslager för allt. CA bootar via loadProject() per projekt och får tasks direkt. Detta är vad vi gör idag (2026-04-07) och det fungerar.

Option B (Boot API) byggdes också tidigare som /api/boot men den läser fortfarande styr_global_todo. Den är obsolet nu när Option A är genomförd.

Option C (Supabase Edge Function) — overkill, ingen anledning.

Feasibility för Option B (Boot API endpoint):
Redan byggd, men onödig. /api/boot returnerar styr_global_todo-data som inte längre är SSOT. Kan tas bort eller refaktoreras till att läsa Engrams.

Kan vi hämta både Supabase-tasks och Engrams-minnen i ett anrop?
Inte längre relevant — allt är Engrams-minnen. loadProject(project) per projekt är räcker. CA anropar 4 ggr (styr-ai, engrams, tradesys, savage-roar) och får komplett bild.

Risker:
- CA glömmer att anropa loadProject för alla 4 projekt (löst via Project Instructions: explicit lista)
- styr_*-tabellerna existerar fortfarande som backup (planerat: drop när vi vet inget bryter)

CC-notering: Om CA fortfarande läser GitHub-filer vid boot betyder det att Project Instructions inte säger åt henne att INTE göra det. Vi fixade det 2026-04-07 — Project Instructions har nu förbjudslista och explicit per-projekt loadProject-anrop. Verifierat fungerande efter test.

Status: KLAR

### README-PROBLEMET

Finns det fler README eller CLAUDE.md-filer i våra repos som innehåller boot-instruktioner?
Ja. Inventering 2026-04-07:

| Repo | Fil | Status |
|------|-----|--------|
| gustavkall/engrams | CLAUDE.md | OK — uppdaterad till V2 |
| gustavkall/engrams | docs/onboarding-anna.md | Kund-facing, inga CC-instruktioner |
| gustavkall/styr-ai | CLAUDE.md | CA-instruktioner — uppdaterad 2026-04-07 |
| gustavkall/styr-ai | GOVERNANCE.md | Statiska regler, OK |
| gustavkall/tradesys1337 | CLAUDE.md | UPPDATERAD 2026-04-07 till V2 (Engrams SSOT) |
| gustavkall/tradesys1337 | README.md | OBS: kan ha gamla instruktioner — bör verifieras |
| gustavkall/tradesys-models | CLAUDE.md | UPPDATERAD 2026-04-07 till V2, var fel-kopierad från engrams |

CC-notering: README.md i tradesys1337 är inte verifierad. Om CA råkar läsa den vid boot kan den innehålla gamla instruktioner. Snabbfix: lägg explicit i CA Project Instructions att README.md aldrig läses vid boot — bara CLAUDE.md (om alls).

Status: KLAR

---

## SEKTION 3 — Syntes
*Status: EJ PÅBÖRJAD*

---

## SEKTION 4 — Deployment [scope: engrams]
*Status: EJ PÅBÖRJAD*
