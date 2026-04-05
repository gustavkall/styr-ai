# Protocol — tradesys specs batch
*Skapad av CA: 2026-04-06*
*Scope: [tradesys]*
*Status: REDO FÖR DEPLOYMENT*

---

## SEKTION 1 — CA:s specs
*(se tidigare version)*

---

## SEKTION 2 — CC tradesys feedback [scope: tradesys]
*CC-tradesys. Datum: 2026-04-05. Status: KLAR*

### TRADESYS-REGIME-001
Feasibility: Medium
Risker: Overfit till specifika historiska perioder. Lösning: leave-one-period-out korsvalidering.
Ordning: (1) PANIC_ONLY per-period analys → (2) SECTOR_HOT filter-lättnad → (3) VIX sub-regime → (4) SECTOR_CONTAGION HYG-layer
CC-notering: ticker-betas redan byggda (data/ticker_betas.json) — integrera som första steg för gratis +2.8pp på SECTOR_HOT. Leave-one-period-out validering måste implementeras före filteroptimering.
Status: KLAR

### T1 — ADD-NEW-AGENT3-001
Feasibility: Enkel (prioriteringsbeslut)
CC-notering: RISK_OFF_BOUNCE har 45% WR i sin designregim — under slump. Parkera helt.
Status: KLAR

### T-DATA-THIN-001
CC-notering: Löst. Yahoo backfill gav 2,066/1,658 trades. Stäng.
Status: KLAR — DONE

---

## SEKTION 3 — Syntes
*Status: KLAR*

Godkända och redo:
- TRADESYS-REGIME-001: Implementera leave-one-period-out + integrera ticker-betas + itereraf filter per strategi
- T1: Frys agent 3, kör inte fler trades
- T-DATA-THIN-001: Stängd

---

## SEKTION 4 — Deployment [scope: tradesys]
*Status: GODKÄND — REDO ATT KÖRAS*

**CC Tradesys: klistra in denna prompt och kör:**

```
Läs state/todo.md och scripts/regime-matched-backtest.js.

Kör dessa items i ordning:

1. T1 — Frys agent 3:
   Stoppa shadowbot agent 3 om den kör.
   Uppdatera state i Supabase: UPDATE styr_global_todo SET status='done', notes='Fryst: 45% WR i designregim, under slump. Återupppna när SECTOR_HOT >65% WR.' WHERE id='T1';
   Rapportera bekräftelse.

2. TRADESYS-REGIME-001 — Steg 1: Integrera ticker-betas för SECTOR_HOT:
   Läs data/ticker_betas.json.
   Uppdatera SECTOR_HOT-filtret i backtest-agent.js att multiplicera confidence med ticker_beta för aktuell regim.
   Kör node scripts/regime-matched-backtest.js och jämför SECTOR_HOT WR före/efter.
   Rapportera: WR-delta och antal perioder konsekvent.

3. TRADESYS-REGIME-001 — Steg 2: Leave-one-period-out validering:
   Lägg till leave-one-period-out funktion i regime-matched-backtest.js:
   - För varje PANIC-period: träna på alla andra perioder, validera på den utelämnade
   - Rapportera: out-of-sample WR per period
   Kör mot PANIC_ONLY först — det är vår starkaste strategi.

Nota varje steg som klart. Kör sync när allt är klart.
```
