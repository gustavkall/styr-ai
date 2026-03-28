# COMMANDS.md — styr-ai
*Alla kommandon som Gustav kan ge. Läses av Claude vid session boot.*
*När ett nytt kommando läggs till: uppdatera denna fil. Alla sessioner känner till det direkt.*

---

## Hur kommandon fungerar

Gustav skriver ett kommando i chatten. Claude känner igen det och exekverar det definierade beteendet omedelbart — utan frågor, utan recap.

Kommandona är **inte** skiftleskänsliga. `TODO`, `todo`, `Todo` — alla fungerar.

---

## SESSION-KOMMANDON

### `session boot`
Kör hela Session Boot Protocol från CLAUDE.md.
Läser alla state-filer, presenterar statussummering, engrams todo-tabell och nästa task.
**Använd:** Vid start av ny session, eller när du vill återställa full kontext mitt i en session.

### `session handoff`
Kör hela Session Handoff Protocol från CLAUDE.md.
Skriver alla sex filer, uppdaterar engrams_todo.md, committar och pushar.
**Använd:** Innan du avslutar en session. Innan du byter verktyg (Claude.ai → CC).

### `sync`
Uppdaterar `state/active_context.md` med senaste beslut, prioriteringar och engrams todo-tabell.
**Använd:** När du vill att CC ska se vad som beslutats. När något viktigt har ändrats mitt i sessionen.

---

## TODO-KOMMANDON

### `todo`
Hämtar `state/engrams_todo.md` och presenterar hela listan.
Visar: status per task, nästa ⬜-task i ordning, eventuella blockerare.
**Format:**
```
ENGRAMS TODO — [datum]

| # | Task | Status | Notering |
|---|------|--------|----------|
| 1 | MULTI-PROJECT-001 — SQL-schema | ⬜ | Blockerare för #2, #3, #6 |
| 2 | ONBOARD-001 — Mail till Anna | ⬜ | Väntar på #1 |
...

NÄSTA: #1 — MULTI-PROJECT-001
BLOCKERADE: #2, #3, #6 väntar på #1
```

### `todo add [beskrivning]`
Lägger till en ny task i engrams_todo.md direkt.
Claude tilldelar nästa lediga nummer och lägger till med ⬜.
**Exempel:** `todo add Bygg kund-dashboard`

### `todo done [nummer]`
Markerar en task som klar. Ändrar ⬜ → ✅, flyttar till KLART-tabellen med dagens datum.
**Exempel:** `todo done 1`

### `todo block [nummer] [anledning]`
Markerar en task som blockerad med en notering.
**Exempel:** `todo block 3 Väntar på Stripe-konto`

---

## INFORMATIONSKOMMANDON

### `status`
Kort statussummering av alla aktiva projekt. En mening per projekt.
Ingen filhämtning — baseras på vad som redan lästs vid boot eller under sessionen.

### `decisions`
Visar de senaste 5 besluten från `project_memory/decisions.md`.
**Använd:** När du vill påminna dig om varuför något byggdes på ett visst sätt.

### `queue`
Visar `state/work_queue.md` — aktiva och planerade tasks över alla projekt.
Skillnad från `todo`: work_queue täcker ALLA projekt, todo är bara Engrams.

---

## WARNER-KOMMANDON

### `warner status`
Visar nuläge för Warner-tvisten: deadlines, kontakter, senaste händelse, nästa steg.
Läser från `gustavkall/savage-roar-music/project_memory/project_context.md`.

---

## TRADESYS-KOMMANDON

### `regime`
Visar senaste marknadsregim från `tradesys1337/state/market_regime.md`.

### `gainers`
Visar senaste top gainers-rapport från `tradesys1337/state/top_gainers_report.md`.

### `positions`
Visar öppna positioner från senaste session handoff.

---

## LÄGGA TILL NYTT KOMMANDO

När ett nytt kommando skapas eller överenskommes:
1. Lägg till det i denna fil under rätt sektion
2. Committa: `docs: add command [namn]`
3. Alla framtida sessioner känner till det via session boot

**Gustav behöver aldrig förklara ett kommando två gånger.**
