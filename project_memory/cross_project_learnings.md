# Cross-Project Learnings
*Uppdaterad: 2026-03-26*

---

## Systemarkitektur

- **URL-first instruktioner:** Project Instructions i Claude.ai pekar på CLAUDE.md i repo. Uppdatera repot — UI behöver aldrig ändras.
- **Separata repos per syfte:** Träningsdata (tradesys-models) ska inte ligga i samma repo som dashboard-kod (tradesys1337). Håll concerns separerade.
- **Privata repos:** Känslig data (handelsstrategi, juridiska processer) ska ligga i privata repos. tradesys1337 och savage-roar-music är nu privata.
- **Merge-konflikter:** Uppstår när styr-ai och CC pushar till samma repo parallellt. CC löser dem — inget kritiskt.
- **State-filer reflekterar inte alltid faktiskt läge:** COO-agenten läser state-filer, inte kod. Om Gustav byggt något utanför sessionen måste state uppdateras manuellt eller via session handoff.

## Modellträning

- **Regime > TA:** Regimklassificering är starkaste enskilda signal (+11pp separationskraft). TA-indikatorer bidrar 2-5pp var.
- **HYG/LQD > VIX:** Kreditmarknad är bättre strukturellt makrofilter. VIX är stämningsindex, rör sig för snabbt för månadsvis taggning.
- **PANIC ≠ RISK-OFF:** Panik-dagar (VIX>30/spike>15%) har högre BUY-rate än normalt RISK-ON. Fear premium är reell.
- **Mean reversion på 5d:** rs5 (underpresterat SPX senaste 5d) är starkaste BUY-signal. Matchar FPS-edge.
- **Scanner-labels (MODEL-002) bekräftat byggt:** EMS/FPS/STS-logik implementerad. Bekräftat av Gustav 2026-03-26.
- **EPS surprise (MODEL-003) bekräftat byggt:** Polygon earnings-data integrerad. Bekräftat av Gustav 2026-03-26.
- **Precision 34-47%:** Ren TA predicerar inte returns. Modellen används som confidence-filter, inte standalone predictor.

## Trading-edge (kvantitativt bekräftad)

- FPS = köp underpresterare (rs5 neg) + frisk kredit (HYG) + panik (VIX spike) + fundamentalt stark
- Extended ovanför EMA20 = starkaste WAIT-signal
- RSI oversold = aktier fortsätter falla (inte V-bounce)
- Sektoralignment (+0.18) — ticker + sektor i trend = bättre

## Processer

- **Session boot:** Läs alltid CLAUDE.md via URL → läs state-filer → aggregera → presentera
- **Parallella sessioner:** CC och Claude.ai kan jobba parallellt. CC äger kod-exekvering, Claude.ai äger strategi och styr-ai.
- **Handoff-konflikter:** Förväntat när båda skriver till samma fil. CC löser med rebase.
- **Warner-tvist:** Gustav hanterar personligen. Ska inte eskaleras av COO-agenten framåt.
- **AdminAssistent:** Tas upp på Gustavs initiativ. Lågprio tills vidare.
