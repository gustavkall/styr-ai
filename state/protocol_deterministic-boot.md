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
*Status: VÄNTAR*

**CC: läs brain-architecture-spec.md och detta protokoll. Svara på:**

### DETERMINISTISK BOOT
Option A vs B vs C — vad är rätt arkitektur?
Feasibility för Option B (Boot API endpoint):
Kan vi hämta både Supabase-tasks och Engrams-minnen i ett anrop?
Risker:
CC-notering:
Status:

### README-PROBLEMET
Finns det fler README eller CLAUDE.md-filer i våra repos som innehåller boot-instruktioner?
CC-notering:
Status:

---

## SEKTION 3 — Syntes
*Status: EJ PÅBÖRJAD*

---

## SEKTION 4 — Deployment [scope: engrams]
*Status: EJ PÅBÖRJAD*
