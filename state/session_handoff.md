# styr-ai — SESSION HANDOFF
*Global session close: 2026-03-25*

---

## DENNA SESSION

### Byggt
- tradesys-models/ repo: komplett modelltränings-pipeline
- regime-agent.js: daglig klassificering VIX/HYG/LQD/SPX/IWM + 9 sektor-ETFer
- generate-training-data.js: 17,907 samples, 91 tickers, sektorflödes-features
- train-model.js: gradient descent + walk-forward validering
- BUY_5D + WAIT_5D modeller tränade och validerade
- Repos gjorda privata: tradesys1337, savage-roar-music

### Beslut
- tradesys-models/ är separat repo (privat) — träningsdata bloatar inte tradesys1337
- Regime-agenten äger regimklassificering — Gustav verifierar output men agenten har bättre systematik
- Daglig VIX (inte 4H/1H) för modellträning — matchar 1D-bars
- HYG + LQD viktigare makrofilter än VIX ensamt
- PANIC = separat kategori (VIX>30 eller spike>15%) — inte RISK-OFF
- Warner-dispyt nedprioriterad — Gustav hanterar personligen
- Scaffold-projekt (min-analytiker/adminassistent) — beslut skjuts fram

### Kvantitativa insikter (modellträning)
- PANIC-dagar: 37.9% BUY-rate vs RISK-ON 33.9% — fear premium bekräftad
- rs5 (mean reversion) = starkaste BUY-signal (-0.62)
- creditStress (HYG/LQD-divergens) = starkaste WAIT-signal (+0.73)
- VIX-spike = köpsignal, inte säljsignal
- HYG viktigare makrofilter än VIX-nivå

---

## MODELL-EKVATIONER (BUY_5D / WAIT_5D)

**BUY_5D:**
```
score = -0.62*rs5 - 0.45*regimeRiskOff - 0.37*regimeRiskOn
      + 0.22*hygAboveEma20 + 0.18*sectorAligned + 0.15*regimePanic
      + 0.10*nearEma20 + 0.10*rsiMomentum + 0.02
```

**WAIT_5D:**
```
score = +0.73*creditStress + 0.30*extendedAboveEma20
      - 0.25*vixSpike - 0.21*hygAboveEma20 + 0.13*regimeRiskOff
      + 0.13*rsiOversold + 0.77
```

---

## NÄSTA SESSION

### Claude.ai styr-ai:
```
session boot
```

### CC i ~/tradesys-models:
```bash
cd ~/tradesys-models && claude
session boot
```
Prioritet:
1. Scanner-labels som features (EMS/FPS/STS) i generate-training-data.js
2. EPS surprise från Polygon — eps_surprise_pct feature
3. SELL/HOLD-modeller — kräver position-simulation
4. Implementera BUY/WAIT-ekvationer i tradesys1337/index.html

---

## AGENT-SCHEMA

| Tid | Agent | Output |
|-----|-------|--------|
| 03:00 CET natt | autonomous-agent | state/autonomous_report.md |
| 06:00 CET vardagar | coo-agent | state/daily_briefing.md |
| 08:00 CET vardagar | market-regime-agent | tradesys1337/state/market_regime.md |
| 22:30 CET vardagar | top-gainers-agent v2 | tradesys1337/state/top_gainers_report.md |
| 04:00 CET söndagar | memory-integrity-agent | state/memory_integrity_report.md |

**Secrets på plats:** ANTHROPIC_API_KEY, POLYGON_KEY, ALPHA_VANTAGE_KEY

---

## KRITISKA DATUM
- **22 maj 2026:** Warner cure period — Gustav hanterar
