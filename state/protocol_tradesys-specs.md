# Protocol — tradesys specs batch
*Skapad av CA: 2026-04-06*
*Scope: [tradesys]*
*Status: FEEDBACK KLAR*

---

## SEKTION 1 — CA:s specs [scope: alla]

---

### SPEC: TRADESYS-REGIME-001
**Förbättra modell-WR 51-60% → 70-80% via regime-matched iteration**

Problem: Dagens backtest testar strategier över alla regimer blandat — späder ut signalen. SC_TREND är overfit (78% WR på 29 trades). SECTOR_HOT och VIX_MEAN_REVERSION har för låg konsistens (19-20% av perioder).

Metodologi (redan byggd av CC):
- `scripts/regime-matched-backtest.js` — testar varje strategi BARA i designregim
- Jämför mot random baseline i samma regimperioder
- Rapporterar konsistens per period, inte bara aggregat-WR

Nästa steg per strategi:

**PANIC_ONLY bounce** (65% perioder konsekvent, +5.1pp edge) — primärstrategi, integrera beta-layer.

**SECTOR_HOT** (19% perioder, +4.3pp edge) — lös filter gradvis, testa varje lättnad mot regime-matched baseline. Mål: 35%+ perioder konsekvent vid 63%+ WR.

**VIX_MEAN_REVERSION** (20% perioder, +1.7pp edge) — svag edge. Undersök om specifika sub-regimer (t.ex. VIX 20-30 vs 30+) ger bättre konsistens.

**SECTOR_CONTAGION** (24% perioder, +2.6pp edge) — undersök om credit stress-nivå (HYG spread) förbättrar period-konsistens.

**SC_TREND** — bekräftad overfit. Parkera tills mer data finns.

Körs: `node scripts/regime-matched-backtest.js` som baseline efter varje filterändring.

Värde: System med bevisad edge i rätt regim, inte aggregat-WR som döljer inkonsistens.

---

### SPEC: T1 — ADD-NEW-AGENT3-001
**Ny strategi för agent 3 (RISK-OFF bounce)**

Problem: Agent 3 (RISK_OFF_BOUNCE) är kandidat för redesign. creditStress korrelation = 0.480 — starkaste signalen för RISK-OFF bounce.

Alternativ:
A) Redesigna agent 3 med creditStress som primärsignal + regime-matched backtest
B) Stäng agent 3, fokusera resurser på PANIC_ONLY (bevisad) + SECTOR_HOT (lovande)

CA rekommenderar: Alternativ B kortsiktigt. Fokusera på att förbättra de strategier som redan visar konsistent edge. Återöppna agent 3 när PANIC_ONLY och SECTOR_HOT är stabila.

CC: Är detta rätt prioritering? Finns det skäl att behålla agent 3 aktiv?

---

### SPEC: T-DATA-THIN-001
**Bredda datamängd SC_TREND och SECTOR_HOT**

Problem: SC_TREND har 21 trades, SECTOR_HOT har 27 trades — statistiskt för tunt för slutsatser.

Lösning: Bredda datumspann med TW CSV-export 2019-2026 (T2 — kräver Gustav).

Alternativt utan ny data: Lätta filter försiktigt för SECTOR_HOT:
- secMom threshold: 4% → 3%
- Testa varje lättnad mot regime-matched baseline
- Acceptera om WR håller >60% med >150 trades

CC: Kör SECTOR_HOT filter-sweep med secMom 3% och rapportera regime-matched resultat.

---

### SPEC: PROTO-REVIEW-001
**Utreda och organisera alla protokoll**

Problem: boot, handoff, sync, engrams-kommando, block-avslut — överlappande, otydliga, distribuerade över flera CLAUDE.md-filer.

Lösning:
1. Kartlägg alla protokoll med syfte, ägare, trigger, output
2. Konsolidera till ett master-protokolldokument
3. Uppdatera CLAUDE.md i styr-ai att referera master-dokumentet

Detta är ett CA+styr-ai-jobb, inte CC. Parkeras tills specs ovan är körda.

---

## SEKTION 2 — CC tradesys feedback [scope: tradesys]
*Status: KLAR*

### TRADESYS-REGIME-001
Feasibility: Medium
Risker: Att vi optimerar filter per period och overfittar till specifika historiska regimperioder istället för att hitta generell edge. Måste använda walk-forward eller leave-one-period-out validering.
Ordning: 1) PANIC_ONLY per-period feature analysis (varför 8/23 perioder misslyckas) → 2) SECTOR_HOT filter-lättnad med regime-matched validering → 3) VIX_MEAN_REVERSION sub-regime-analys → 4) SECTOR_CONTAGION HYG-spread-layer
CC-notering: CA:s prioriteringsordning är korrekt. Ett tillägg: vi bör implementera leave-one-period-out korsvalidering — optimera på N-1 perioder, validera på den utelämnade. Annars riskerar vi att fittas till specifika PANIC-perioder (t.ex. COVID mars 2020) som inte generaliserar. Redan byggda ticker-betas (`data/ticker_betas.json`) bör integreras som första steg — det är gratis +2.8pp för SECTOR_HOT.
Status: KLAR

### T1 — ADD-NEW-AGENT3-001
Feasibility: Enkel
Risker: Inga — det är en prioriteringsfråga, inte teknisk risk.
Ordning: Stäng agent 3 nu. Återöppna efter PANIC_ONLY och SECTOR_HOT når >65% WR i regime-matched test.
CC-notering: Håller med om alternativ B. Men data visar att RISK_OFF_BOUNCE i RISK-OFF-regim har 45% WR (under slump). Den är inte bara svag — den förlorar pengar i sin designregim. Att redesigna den med creditStress som primärsignal kräver ny hypotes och ny data. Parkera helt.
Status: KLAR

### T-DATA-THIN-001
Feasibility: Enkel (redan löst)
Risker: Inga.
Ordning: Redan genomfört. Yahoo Finance backfill gav 88 tickers till 2010 + Polygon 56 tickers. Snapshots gick från 77K → 321K. SECTOR_HOT har nu 2,066 trades (regime-matched) och SC_TREND 1,658 trades. Trade-antal är inte längre problemet — problemet är att WR faller med mer data (SC_TREND 78% → 51.4%). CA:s siffror (21/27 trades) är från förra sessionen.
CC-notering: CA arbetar med gammal data. Uppdaterade siffror efter Yahoo-backfill: SECTOR_HOT 2,066 trades (59.6% WR), SC_TREND 1,658 trades (51.4% WR). Data-bredden är löst. Filteroptimering mot regime-matched baseline är nästa steg, inte mer data.
Status: KLAR

### PROTO-REVIEW-001
Feasibility: Enkel (CA-jobb)
Risker: Inga.
Ordning: Parkera som CA föreslår. CC har inga synpunkter — detta är governance, inte modellarbete.
CC-notering: sync.sh har en återkommande syntaxbugg (extra `}"` i curl JSON, rad 53). Fixad av CC två gånger men remote överskriver. CA bör fixa i styr-ai-repot.
Status: KLAR

---

## SEKTION 3 — Syntes [scope: alla]
*Status: EJ PÅBÖRJAD*

---

## SEKTION 4 — Deployment [scope: tradesys]
*Status: EJ PÅBÖRJAD*
