# Protocol — engrams-kommando
*Skapad av CA: 2026-04-06*
*Status: VÄNTAR PÅ CC:s ARKITEKTONISKA FEEDBACK*

---

## SEKTION 1 — CA:s spec [scope: alla]

### Vad vi bygger

Ett enhetligt kommandospråk som ersätter boot/handoff/sync med ett enda prefix: `engrams`.

Samma ord fungerar i CA (claude.ai) och CC (terminal). Beteendet per agent definieras i respektive CLAUDE.md. Gustav behöver inte veta vad som händer under huven — han skriver `engrams boot tradesys` och rätt sak händer.

---

### Kommandodefinitioner

```
engrams boot [projekt?]
engrams sync
engrams handoff
```

**`engrams boot [projekt?]`**

Laddar alltid styr-ai som bas. Om projekt anges filtreras tasks, episodes och context till det projektet.

| Kommando | Vad laddas |
|----------|------------|
| `engrams boot` | styr-ai meta-kontext, alla projekt, dagens prioriteter |
| `engrams boot tradesys` | styr-ai bas + tradesys tasks, state, öppna beslut |
| `engrams boot engrams` | styr-ai bas + Engrams-produkt tasks, V2-status, Anna |
| `engrams boot savage-roar` | styr-ai bas + Warner-förhandling, deadlines |

Styr bootas aldrig explicit — det är alltid med som bas. `engrams boot` utan argument = dagens prioritetsöversikt över alla projekt.

**`engrams sync`**

Läs vad den andra agenten skrivit sedan sist.

- I CA: anropa `loadProject("styr-ai")`, läs senaste CC-episode, presentera vad CC gjort och vad som väntar
- I CC: `git pull` + läs `loadProject("styr-ai")` via curl, presentera CA:s senaste beslut och tasks

**`engrams handoff`**

Skriv state och avsluta.

- I CA: skriv episode + decisions till Engrams via MCP, uppdatera active_context
- I CC: curl mot `/api/remember` med block-summering (type: episode, project: styr-ai)

---

### Implementation per agent

**CA (CLAUDE.md — styr-ai):**

```
TRIGGER: Gustav skriver "engrams boot [projekt?]"
ACTION: loadProject("styr-ai") via Engrams MCP
        Om projekt anges: filtrera output till det projektet
        Presentera: tasks, senaste decisions, öppna beslut

TRIGGER: Gustav skriver "engrams sync"  
ACTION: loadProject("styr-ai"), läs senaste episode med agent=CC
        Presentera: vad CC gjorde, vad som är klart, vad som väntar

TRIGGER: Gustav skriver "engrams handoff"
ACTION: remember(type:episode, project:styr-ai, content:{summering})
        remember(type:decision, ...) för varje beslut denna session
```

**CC (CLAUDE.md — engrams eller styr-ai):**

```
TRIGGER: Gustav skriver "engrams boot [projekt?]"
ACTION: git pull, curl loadProject("styr-ai")
        Om projekt anges: filtrera till det projektet
        Presentera: tasks, senaste CA-decisions, vad som väntar

TRIGGER: Gustav skriver "engrams sync"
ACTION: git pull, curl loadProject("styr-ai")
        Presentera: CA:s senaste skrivningar sedan CC:s senaste boot

TRIGGER: Gustav skriver "engrams handoff" ELLER block är klart
ACTION: curl POST /api/remember med:
        type: episode, project: styr-ai
        content: { agent: CC, date: YYYY-MM-DD, block: X, 
                   done: [...], next: [...], notes: ... }
```

---

### Projektscoping — viktig regel

Styr är alltid med. Projektargumentet är ett filter, inte ett val.

`engrams boot engrams` = ladda styr-ai + filtrera till Engrams-produkten.

Detta måste vara explicit i CLAUDE.md för att inte en framtida CA-instans ska tolka det som "boota Engrams istället för styr".

---

### Risker

| Risk | Sannolikhet | Hantering |
|------|-------------|-----------|
| `engrams` utan subkommando | Hög i början | Behandla som `engrams boot` |
| CC saknar Engrams MCP | Bekräftat — CC kör curl | Curl mot /api/remember är primary, inte fallback |
| CA:s CLAUDE.md-ändringar syns inte mitt i CC-session | Acceptabelt | Gäller från nästa CC-boot |
| Projektargument tolkas som exklusivt scope | Medel | Explicit regel: styr alltid med som bas |

---

## SEKTION 2 — CC:s arkitektoniska feedback [scope: CC]
*Status: VÄNTAR*

**CC: läs denna sektion och svara direkt i filen.**

Tre specifika frågor CA behöver svar på innan implementation:

**F1: Projektscoping i CC**
När Gustav kör `engrams boot tradesys` i din terminal — hur filtrerar du output i praktiken? Kör du `loadProject("tradesys")` separat, eller filtrerar du resultatet från `loadProject("styr-ai")`? Vilket är enklast att implementera och ger bäst resultat?

**F2: `engrams handoff` vs automatiskt vid block-avslut**
Du bekräftade att regel i CLAUDE.md är rätt för automatisk handoff. Men ska `engrams handoff` som explicit kommando göra något *annat* än den automatiska block-avslut-logiken? Eller är de identiska?

**F3: `engrams sync` i CC**
Du sa att `git pull` räcker för CA→CC. Men `engrams sync` ska också läsa CA:s senaste decisions från Engrams. Hur ser du på det — ett `curl loadProject` utöver `git pull`, eller är `git pull` + Boot API tillräckligt?

**Skriv dina svar under respektive fråga. Committa filen när du är klar.**

---

## SEKTION 3 — Syntes och plan [scope: alla]
*Status: EJ PÅBÖRJAD — väntar på CC:s svar*

---

## SEKTION 4 — Implementation [scope: alla]
*Status: EJ PÅBÖRJAD*

Att implementera när plan är godkänd:
- Uppdatera styr-ai CLAUDE.md med engrams-triggers för CA
- Uppdatera engrams CLAUDE.md med engrams-triggers för CC
- Uppdatera CC-HANDOFF-001 spec med det kompletta protokollet
- Testa: Gustav kör `engrams boot tradesys` i båda miljöer
