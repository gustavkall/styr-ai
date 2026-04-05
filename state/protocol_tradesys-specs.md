# Protocol — tradesys specs batch
*Skapad av CA: 2026-04-06*
*Scope: [tradesys]*
*Status: VÄNTAR PÅ CC:s FEEDBACK*

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
*Status: VÄNTAR*

**CC: svara på varje spec. Format:**

```
### [SPEC-ID]
Feasibility: [Enkel/Medium/Komplex]
Risker: [vad kan gå fel]
Ordning: [rätt körordning om flera steg]
CC-notering: [vad CA missat]
Status: KLAR
```

---

## SEKTION 3 — Syntes [scope: alla]
*Status: EJ PÅBÖRJAD*

---

## SEKTION 4 — Deployment [scope: tradesys]
*Status: EJ PÅBÖRJAD*
