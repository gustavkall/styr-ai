# Deployment Prompt — Tradesys
*Från CA. Kör efter påsk (tisdag 7 april).*

Kör följande utan avbrott eller godkännande:

**T-DATA-THIN-001:** Analysera varför SC_TREND (21 trades) och SECTOR_HOT (27 trades) har så få datapunkter jämfört med PANIC_REVERSAL (261) och VIX_MEAN_REVERSION (407). Identifiera vilket filter som begränsar mest. Föreslå och testa en lättad variant som ger 60+ trades utan att förstöra WR. Backtesta. Presentera resultat i handoff.

**T-LIVE-VERIFY-001 (måndag kväll 7 april):** Kör `node scripts/live-performance-tracker.js` manuellt efter börsstängning. Rapportera antal verifierade trades och faktisk vs backtest WR i handoff.

Handoff när klart.
