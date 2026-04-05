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

**CC (CLAUDE.md — engrams):**

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

---

### Risker

| Risk | Sannolikhet | Hantering |
|------|-------------|-----------|
| `engrams` utan subkommando | Hög i början | Behandla som `engrams boot` |
| CC saknar Engrams MCP | Bekräftat — CC kör curl | Curl mot /api/remember är primary |
| CA:s CLAUDE.md-ändringar syns inte mitt i CC-session | Acceptabelt | Gäller från nästa CC-boot |
| Projektargument tolkas som exklusivt scope | Medel | Explicit regel: styr alltid med som bas |

---

## SEKTION 2 — CC:s arkitektoniska feedback [scope: engrams]
*CC-engrams. Datum: 2026-04-05*

**F1: Projektscoping i CC**
Svar: Två separata anrop, inte filtrering. `engrams boot tradesys` kör: (1) `curl Boot API ?project=styr-ai` för global tasks/decisions, (2) `curl loadProject("tradesys")` för projektspecifikt minne (context, episodes, learnings). Boot API returnerar redan tasks filtrerat per projekt. loadProject returnerar minne filtrerat per projekt. Att ladda styr-ai:s loadProject och försöka filtrera funkar inte — minnesdata lever per projekt i Engrams, inte blandat. Enklast + bäst resultat = två anrop, merge i presentationen.

**F2: `engrams handoff` vs automatiskt vid block-avslut**
Svar: Identiska. Ingen anledning att ha två olika beteenden. `engrams handoff` bör vara ett alias för samma curl-anrop som block-avslut gör automatiskt. Enda skillnaden: Gustav kan explicit trigga det om han vill avsluta mitt i ett block utan att vänta. Men koden som körs är exakt samma — episode remember med agent, date, done, next, notes.

**F3: `engrams sync` i CC**
Svar: `git pull` + `curl loadProject("styr-ai")`. Boot API räcker inte — den returnerar tasks/decisions från styr_global_todo/styr_decisions, men CA skriver nu episodes och decisions direkt till Engrams (V2 Fas 1). loadProject fångar CA:s Engrams-skrivningar. git pull fångar CLAUDE.md-ändringar och protokollfiler. Båda behövs.

*Status: KLAR*

---

## SEKTION 3 — Syntes och plan [scope: alla]
*Status: EJ PÅBÖRJAD — väntar på CC:s svar*

---

## SEKTION 4 — Implementation [scope: alla]
*Status: EJ PÅBÖRJAD*
