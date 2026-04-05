# Protocol — tradesys v2 specs
*Skapad av CA: 2026-04-06*
*Scope: [tradesys]*
*Status: VÄNTAR PÅ CC:s FEEDBACK*

---

## SEKTION 1 — CA:s specs [scope: alla]

---

### SPEC: T3 — MODEL-SCOREBOARD-001
**Precision v5-v10 scoreboard**

Problem: Vi har tränade modeller v5-v10 men ingen jämförelsetabell över precision, recall, F1 per modell och strategi.

Lösning: Script som kör alla modeller mot valideringsdatan och producerar en markdown-tabell.

```javascript
// scripts/model-scoreboard.js
// Läs weights_v5.json ... weights_v10.json
// Kör mot data/training/*.csv
// Output: state/model_scoreboard.md
```

Output-format:
| Modell | Version | WR | Edge vs random | Perioder konsekvent | Trades |

CC: Kör autonomt, ingen Gustavs input behövs. Rapportera scoreboard.

---

### SPEC: T5 — INFRA-003
**Stateful backend**

Problem: Dashboard är stateless — all state lever i localStorage. Det gör det omöjligt att dela state mellan enheter, köra agenter på server-sidan, eller spara session-data persistent.

Lösning: Flytta state från localStorage till Supabase (hxikaojzwjtztyuwlxra). Tabeller:
- `sessions` — aktiv trading-session per användare
- `watchlist` — bevakningslista med scores
- `trade_decisions` — redan finns

Fas 1 (minimal): Bara `sessions` och `watchlist`. localStorage behålls som fallback.
Fas 2: API-nycklar i Supabase, inte localStorage.

Prioritet: Medium. Bygg när grundstrategierna är stabila.

CC: Är detta rätt prioritering? Finns tekniska hinder vi måste lösa först?

---

### SPEC: T6 — SCANNERS + WATCHLIST LIVE
**EMS, FPS, STS, EXIT-scanners mot live marknadsdata**

Problem: Scanners körs idag mot 15-min delayed data (Polygon Starter). Live-scanners kräver antingen Polygon Advanced eller en work-around.

Lösning alt A: Uppgradera Polygon till Advanced ($79/mån) — får live data.
Lösning alt B: Kör scanners 15 min försenat men automatiserat via GitHub Actions cron.
Lösning alt C: Yahoo Finance som komplement för live-priser på en begränsad watchlist.

CA rekommenderar: Alt B kortsiktigt — automatisera med delay istället för manuellt med live. Kosta inget extra.

CC: Vad är enklast att implementera med nuvarande infrastruktur?

---

### SPEC: T4 — FMP-LIVE-001
**Short float live via Financial Modeling Prep**

Problem: Short float är en stark signal för SECTOR_HOT men saknas idag. FMP Starter ($29/mån) ger short float data.

Lösning: Gustav aktiverar FMP Starter. CC integrerar `shortFloat` som feature i SECTOR_HOT-filtret.

Beroende: Gustav måste fatta beslut om $29/mån först.

CC: När Gustav godkänner — hur lång tid tar integrationen?

---

## SEKTION 2 — CC tradesys feedback [scope: tradesys]
*Status: VÄNTAR*

**CC: svara på T3, T5, T6, T4.**

### T3 — MODEL-SCOREBOARD-001
Feasibility:
Risker:
CC-notering:
Status:

### T5 — INFRA-003
Feasibility:
Risker:
CC-notering:
Status:

### T6 — SCANNERS LIVE
Feasibility:
Risker:
CC-notering:
Status:

### T4 — FMP-LIVE-001
Feasibility:
Tidsestimat när Gustav godkänner:
CC-notering:
Status:

---

## SEKTION 3 — Syntes [scope: alla]
*Status: EJ PÅBÖRJAD*

---

## SEKTION 4 — Deployment [scope: tradesys]
*Status: EJ PÅBÖRJAD*
