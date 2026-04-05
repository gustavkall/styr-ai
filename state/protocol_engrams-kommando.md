# Protocol — engrams-kommando
*Skapad av CA: 2026-04-06*
*Status: VÄNTAR PÅ GUSTAVS GODKÄNNANDE*

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
Laddar alltid styr-ai som bas. Om projekt anges: två separata anrop (CC:s F1-svar) — Boot API för global tasks + loadProject(projekt) för projektspecifikt minne. Merge i presentationen.

**`engrams sync`**
Läs vad den andra agenten skrivit sedan sist.
- I CA: loadProject("styr-ai"), läs senaste CC-episode, presentera vad CC gjort
- I CC: git pull + curl loadProject("styr-ai"). Båda behövs — git fångar CLAUDE.md/protokoll, loadProject fångar CA:s Engrams-skrivningar (CC:s F3-svar)

**`engrams handoff`**
Identiskt med automatiskt block-avslut (CC:s F2-svar). Alias för samma curl-anrop. Gustav kan trigga explicit om han vill avsluta mitt i ett block.

---

## SEKTION 2 — CC:s arkitektoniska feedback [scope: engrams]
*CC-engrams. Datum: 2026-04-05*

**F1: Projektscoping i CC**
Svar: Två separata anrop, inte filtrering. `engrams boot tradesys` kör: (1) Boot API ?project=styr-ai för global tasks/decisions, (2) loadProject("tradesys") för projektspecifikt minne. Minnesdata lever per projekt i Engrams, inte blandat.

**F2: `engrams handoff` vs automatiskt vid block-avslut**
Svar: Identiska. `engrams handoff` är ett alias för samma curl-anrop som block-avslut gör automatiskt.

**F3: `engrams sync` i CC**
Svar: git pull + curl loadProject("styr-ai"). Boot API räcker inte — CA skriver nu direkt till Engrams (V2 Fas 1), inte till Supabase-tabellerna.

*Status: KLAR*

---

## SEKTION 3 — Syntes och plan [scope: alla]
*Status: KLAR*

### Arkitekturbeslut (baserat på CA spec + CC feedback)

| Kommando | CA-beteende | CC-beteende |
|----------|-------------|-------------|
| `engrams boot` | loadProject("styr-ai"), presentera alla projekt | git pull + curl loadProject("styr-ai") |
| `engrams boot [projekt]` | loadProject("styr-ai") + loadProject(projekt), merge | git pull + Boot API + loadProject(projekt), merge |
| `engrams sync` | loadProject("styr-ai"), läs senaste CC-episode | git pull + curl loadProject("styr-ai") |
| `engrams handoff` | remember(episode + decisions) | curl remember(episode) — identiskt med block-avslut |
| `engrams` (utan subkommando) | Behandla som `engrams boot` | Behandla som `engrams boot` |

### Viktiga regler
- Styr är alltid med som bas — projektargument är ett filter, inte ett val
- CC kör curl mot REST API (ingen Engrams MCP i CC)
- `engrams handoff` = alias för block-avslut, inte ett separat beteende
- CA:s CLAUDE.md-ändringar gäller från nästa CC-boot — acceptabelt gap

---

## SEKTION 4 — Implementation [scope: alla]
*Status: EJ PÅBÖRJAD — väntar på Gustavs godkännande*

### Att implementera

**styr-ai CLAUDE.md — lägg till triggers för CA:**
```
TRIGGER: "engrams boot [projekt?]"
TRIGGER: "engrams sync"
TRIGGER: "engrams handoff"
```

**engrams CLAUDE.md — uppdatera CC-triggers:**
```
TRIGGER: "engrams boot [projekt?]" → git pull + Boot API + loadProject(projekt)
TRIGGER: "engrams sync" → git pull + curl loadProject("styr-ai")
TRIGGER: "engrams handoff" → curl remember(episode) [alias för block-avslut]
```

**CC-HANDOFF-001** — uppdatera spec med det kompletta protokollet

**Test:** Gustav kör `engrams boot tradesys` i CA och CC — verifiera att båda presenterar rätt state
