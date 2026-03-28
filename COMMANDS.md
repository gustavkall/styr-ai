# COMMANDS.md — styr-ai
*Alla kommandon som Gustav kan ge. Läses av Claude vid session boot.*
*När ett nytt kommando läggs till: uppdatera denna fil. Alla sessioner känner till det direkt.*

---

## Hur kommandon fungerar

Gustav skriver ett kommando i chatten. Claude känner igen det och exekverar det definierade beteendet omedelbart — utan frågor, utan recap.
Kommandona är **inte** skiftleskänsliga.

---

## SESSION-KOMMANDON

### `session boot` eller `session boot styr-ai`
Kör full boot för meta-systemet styr-ai.
Läser ALLA state-filer, presenterar status för alla projekt, engrams todo-tabell och nästa task.
**Använd:** Standard vid start av ny session utan specifikt projektfokus.

### `session boot [projekt]`
Kör boot med fokus på ett specifikt projekt. Läser projektets egna state-filer och presenterar projektspecifik status.

| Kommando | Projekt | Fokus |
|----------|---------|-------|
| `session boot engrams` | gustavkall/engrams | Engrams todo, minnearkitektur, V1 |
| `session boot tradesys` | gustavkall/tradesys1337 | ShadowBot-agenter, ML-modeller, positioner |
| `session boot savage-roar` | gustavkall/savage-roar-music | Warner-tvist, Believe, artister |
| `session boot adminassistent` | gustavkall/adminassistent | Mail, kalender, operativa uppgifter |

**Boot-format per projekt:**
```
SESSION BOOT — [PROJEKTNAMN]
Datum: YYYY-MM-DD

STATUS: [en mening]
NÄSTA: [första task]
KRÄVER UPPMÄRKSAMHET: [om något]
[projektspecifik tabell om relevant]
```

### `session handoff`
Kör Session Handoff Protocol. Skriver alla state-filer, uppdaterar engrams_todo.md, committar och pushar.

### `sync`
Uppdaterar `state/active_context.md` med senaste beslut, prioriteringar och engrams todo-tabell.
Kör direkt när Gustav godkänner något eller ett beslut tas.

---

## TODO-KOMMANDON

### `todo`
Hämtar `state/engrams_todo.md` och presenterar hela listan med nästa task och blockerare.

### `todo add [beskrivning]`
Lägger till en ny task direkt. Claude tilldelar nästa lediga nummer.
**Exempel:** `todo add Bygg kund-dashboard`

### `todo done [nummer]`
Markerar task som klar. ⬜ → ✅, flyttar till KLART med datum.
**Exempel:** `todo done 1`

### `todo block [nummer] [anledning]`
Markerar task som blockerad med notering.
**Exempel:** `todo block 3 Väntar på Stripe-konto`

---

## INFORMATIONSKOMMANDON

### `status`
Kort statussummering av alla aktiva projekt. En mening per projekt.

### `decisions`
Visar senaste 5 beslut från `project_memory/decisions.md`.

### `queue`
Visar `state/work_queue.md` — alla projekt. Skillnad från `todo`: todo är bara Engrams.

---

## WARNER-KOMMANDON

### `warner status`
Visar nuläge för Warner-tvisten. Läser `gustavkall/savage-roar-music/project_memory/project_context.md`.

---

## TRADESYS-KOMMANDON

### `regime`
Visar senaste marknadsregim från `tradesys1337/state/market_regime.md`.

### `gainers`
Visar senaste top gainers-rapport från `tradesys1337/state/top_gainers_report.md`.

### `positions`
Visar öppna positioner från senaste session handoff.

---

## TILLGÄNGLIGA MCP-VERKTYG (Claude använder autonomt)

**Regel: Claude kör dessa direkt — frågar inte Gustav att göra det manuellt.**
**Undantag:** Skicka mail, transaktioner, permanent radering — kräver explicit godkännande.

### Supabase MCP
**Project:** Styr.AI | **Project ID:** `hxikaojzwjtztyuwlxra`
**Kan:** Köra SQL, migrations, läsa/skriva tabeller

*När Supabase Pro köps och Engrams får eget projekt: uppdatera project_id här.*

**CC-koppling (kör en gång i terminal):**
```bash
claude mcp add --scope project --transport http supabase "https://mcp.supabase.com/mcp?project_ref=crsonxfrylkpgrddovhu"
# Sedan: claude /mcp → välj supabase → Authenticate
```

**Engrams-tabeller:**
- `accounts`, `projects`, `engrams_sessions`, `engrams_decisions`
- `memory_items` — profile/context/learning/episode + pgvector 1536-dim + ivfflat-index
- `waitlist`

**TRADESYS-tabeller:**
- `sessions`, `trade_decisions`, `trading_learnings`, `observations`, `portfolio`, `trade_log`, `watchlist`, `shadowbot_agents`, `analysis_requests`, `analysis_results`

### GitHub MCP
**Repos:** gustavkall/styr-ai, gustavkall/engrams, gustavkall/tradesys1337, gustavkall/tradesys-models, gustavkall/savage-roar-music, gustavkall/adminassistent
**Kan:** Läsa/skriva alla repos, committa, pusha

### Vercel MCP
**Project ID:** `prj_j911dRTHm9EQrwrHG3AZ9sHGSHx8` | **Team ID:** `team_pp2fvMpvzRPz7AfSGFMVttPs`
**Kan:** Deploya, lista projekt, hämta loggar

### Gmail MCP
**Kan:** Läsa mail, skapa drafts (EJ skicka utan godkännande)

---

## SUPABASE PRO — FRAMTIDA UPPGRADERING

När du köper Supabase Pro:
1. Skapa dedikerat Engrams-projekt i Supabase
2. Kör migrations från `gustavkall/engrams` mot nya projekt-ID
3. Uppdatera OPENAI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY i Vercel (engrams)
4. Uppdatera project_id i denna fil och i engrams/CLAUDE.md
5. Engrams och Styr.AI/TRADESYS delar inte längre samma databas

---

## LÄGGA TILL NYTT KOMMANDO

1. Lägg till i denna fil under rätt sektion
2. Committa: `docs: add command [namn]`
3. Alla framtida sessioner känner till det via session boot

**Gustav behöver aldrig förklara ett kommando två gånger.**
