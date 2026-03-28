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

### `session handoff`
Kör hela Session Handoff Protocol från CLAUDE.md.
Skriver alla sex filer, uppdaterar engrams_todo.md, committar och pushar.

### `sync`
Uppdaterar `state/active_context.md` med senaste beslut, prioriteringar och engrams todo-tabell.

---

## TODO-KOMMANDON

### `todo`
Hämtar `state/engrams_todo.md` och presenterar hela listan med nästa task och blockerare.

### `todo add [beskrivning]`
Lägger till en ny task direkt. Claude tilldelar nästa nummer.
**Exempel:** `todo add Bygg kund-dashboard`

### `todo done [nummer]`
Markerar task som klar. ⬜ → ✅, flyttar till KLART med datum.
**Exempel:** `todo done 1`

### `todo block [nummer] [anledning]`
Markerar task som blockerad.
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
Visar senaste top gainers-rapport.

### `positions`
Visar öppna positioner från senaste session handoff.

---

## TILLGÄNGLIGA MCP-VERKTYG (Claude kan använda dessa autonomt)

Dessa verktyg är kopplade och kända av Claude. **Claude ska använda dem direkt utan att fråga Gustav.**

### Supabase MCP
**Project:** Styr.AI | **Project ID:** `hxikaojzwjtztyuwlxra`
**Kan:** Köra SQL, migrations, läsa tabeller, skriva data
**Används för:** Alla databasändringar för Engrams och TRADESYS
**Viktigt:** Claude.ai har detta kopplat. CC kopplas via:
```bash
claude mcp add --scope project --transport http supabase "https://mcp.supabase.com/mcp?project_ref=crsonxfrylkpgrddovhu"
```

**Engrams-tabeller (skapade 2026-03-28):**
- `accounts` — en per kund (email, plan, stripe_ids)
- `projects` — N per account (project_name, api_key_hash)
- `engrams_sessions` — episodiskt minne per projekt
- `engrams_decisions` — strukturella beslut per projekt
- `memory_items` — fyra typer (profile/context/learning/episode) + pgvector 1536-dim
- `waitlist` — email-lista från engrams.app
- pgvector extension aktiv, ivfflat-index på embedding

**TRADESYS-tabeller (befintliga):**
- `sessions`, `trade_decisions`, `trading_learnings`, `observations`, `portfolio`, `trade_log`, `watchlist`, `shadowbot_agents`, `analysis_requests`, `analysis_results`

### GitHub MCP
**Kan:** Läsa/skriva alla repos, committa, pusha
**Repos:** gustavkall/styr-ai, gustavkall/engrams, gustavkall/tradesys1337, gustavkall/tradesys-models, gustavkall/savage-roar-music

### Vercel MCP
**Project ID:** `prj_j911dRTHm9EQrwrHG3AZ9sHGSHx8` | **Team ID:** `team_pp2fvMpvzRPz7AfSGFMVttPs`
**Kan:** Deploya, lista projekt, hämta loggar

### Gmail MCP
**Kan:** Läsa mail, skapa drafts
**Viktigt:** Kan EJ skicka mail utan Gustavs explicita godkännande

---

## REGEL: Claude löser uppgifter själv med tillgängliga verktyg

När en uppgift kan lösas med något av ovanstående MCP-verktyg:
- **Kör det direkt** — fråga inte Gustav om han ska göra det
- **Rapportera vad som gjordes** — inte vad Gustav ska göra
- **Undantag:** skicka mail, transaktioner, permanent radering — kräver explicit godkännande

Exempel på vad Claude kör autonomt:
- SQL-migrationer i Supabase
- Skriva/uppdatera filer i GitHub
- Läsa databastabeller för att förstå struktur
- Committa state-uppdateringar
- Hämta Vercel-loggar

---

## LÄGGA TILL NYTT KOMMANDO

1. Lägg till i denna fil under rätt sektion
2. Committa: `docs: add command [namn]`
3. Alla framtida sessioner känner till det via session boot

**Gustav behöver aldrig förklara ett kommando två gånger.**
