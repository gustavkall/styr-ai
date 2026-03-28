# Cross-Project Learnings
*Uppdaterad: 2026-03-28*

---

## Systemarkitektur

- **URL-first instruktioner:** Project Instructions i Claude.ai pekar på CLAUDE.md i repo. Uppdatera repot — UI behöver aldrig ändras.
- **Separata repos per syfte:** Träningsdata (tradesys-models) ska inte ligga i samma repo som dashboard-kod (tradesys1337). Håll concerns separerade.
- **Privata repos:** Känslig data (handelsstrategi, juridiska processer) ska ligga i privata repos.
- **State-filer reflekterar inte alltid faktiskt läge:** COO-agenten läser state-filer, inte kod. Om Gustav byggt något utanför sessionen måste state uppdateras.
- **CC↔Claude.ai sync:** active_context.md är det delade whiteboardet. CC läser det via `sync`-alias. cc_session_log.md är CC:s rapport tillbaka. Båda skrivs vid handoff.
- **Handoff måste skriva till decisions + learnings:** Inte bara session_handoff.md. Viktiga beslut och resonemang som INTE skrivs dit försvinner vid nästa boot.
- **Sync = samma som handoff för context-delen:** När `sync` körs mitt i en session ska active_context.md uppdateras med senaste beslut — inte bara vid sessionslut.

## Engrams — marknad och strategi

- **Existerande alternativ:** Mem0 (developer-first, kräver integration), Zep (LLM-minneslager, developer-first), MemGPT/Letta (forskningsprojekt, komplext), Rewind (spelar in skärm, annat angreppssätt), Claude Memory (inbyggt, begränsat, kontrollerat av Anthropic).
- **Engrams differentiering:** MCP-native, plug-and-play, ingen kod krävs, funkar direkt i Claude.ai via Project Instructions, cross-tool sync mellan Claude.ai och Claude Code, persistent minne per projekt.
- **Timing:** MCP lanserades sent 2024. Connectors i Claude.ai är ännu nyare. Ekosystemet är inte moget. Rätt ögonblick att etablera sig.
- **Existensrisk:** Anthropic bygger detta själva (Claude Memory). Fönstret är troligen 12-18 månader. Strategi: bli etablerad i MCP-registret snabbt, bygg enterprise-features de inte kommer bygga (white-label, custom agents, multi-tool).
- **Onboarding-arkitektur beslutad:** Database-only default. Kund behöver inget repo. Flöde: betalar → API-nyckel via mail → klistrar in i Claude → klar.

## Modellträning (TRADESYS)

- **Regime > TA:** Regimklassificering är starkaste enskilda signal.
- **HYG/LQD > VIX:** Kreditmarknad är bättre strukturellt makrofilter.
- **SECTOR_HOT-edge:** sektor-rotation laggards (secMom>6) ger 71.8% WR på 85 trades (backtest 2022-2026). Defense + Financials starkast.
- **SC_TREND-edge:** trend-confirmed laggards (secMom>4, pearsonR>0.2) ger 62.6% WR på 131 trades.
- **vixElevated är starkaste filter:** corr=-0.326 mot vinst. WR 76% när vixElevated=0, 32% när elevated.
- **CONTRARIAN har ingen edge:** 24.8% WR i alla konfigurationer. Ersatt av SC_TREND.
- **MEAN_REVERSION har ingen edge:** 25.5% WR. Ersatt av SECTOR_HOT.
- **agent-trainer.js leaf bug:** buildTree skriver `{v: leafVal}` men intern predict letade efter `node.value`. En rad-fix: `node.v || 0`. +11.4pp precision.

## Trading-edge (kvantitativt bekräftad)

- FPS = köp underpresterare (rs5 neg) + frisk kredit (HYG) + panik (VIX spike) + fundamentalt stark
- Extended ovanför EMA20 = starkaste WAIT-signal
- RSI oversold = aktier fortsätter falla (inte V-bounce)
- Sektoralignment (+0.18) — ticker + sektor i trend = bättre

## Processer

- **Session boot:** Läs alltid CLAUDE.md via URL → läs state-filer inkl cc_session_log.md → aggregera → presentera
- **Session handoff:** Uppdatera session_handoff.md + work_queue.md + decisions.md + cross_project_learnings.md + active_context.md. Alla fem.
- **Sync:** Uppdatera active_context.md direkt när beslut tas — inte bara vid sessionslut. CC kör `sync` för att hämta.
- **Parallella sessioner:** CC och Claude.ai kan jobba parallellt. CC äger kod-exekvering, Claude.ai äger strategi.
- **Warner-tvist:** Gustav hanterar personligen. Ska inte eskaleras av COO-agenten.
