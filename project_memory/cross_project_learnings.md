# Cross-Project Learnings
*Uppdaterad: 2026-03-28 EOD*

---

## Systemarkitektur

- **URL-first instruktioner:** Project Instructions i Claude.ai pekar på CLAUDE.md i repo. Uppdatera repot — UI behöver aldrig ändras.
- **Separata repos per syfte:** Träningsdata (tradesys-models) ska inte ligga i samma repo som dashboard-kod (tradesys1337).
- **State-filer reflekterar inte alltid faktiskt läge:** Om Gustav byggt något utanför sessionen måste state uppdateras.
- **CC↔Claude.ai sync:** active_context.md är det delade whiteboardet. cc_session_log.md är CC:s rapport tillbaka.
- **Handoff måste skriva till decisions + learnings:** Kritiskt resonemang försvinner annars vid nästa boot.
- **Supabase MCP kör SQL autonomt:** Claude ska aldrig be Gustav öppna SQL Editor. Koppla CC också via claude mcp add.
- **COMMANDS.md = central kommandoreferens:** Boot läser den. Gustav behöver aldrig förklara kommandon.
- **`session boot [projekt]`:** Ger fokuserad boot per projekt. Minskar brus.

## Engrams — produkt och strategi

- **Engram-metaforen är strukturell, inte metaforisk:** Wikipedia-artikeln om Engram (neuropsychology) beskriver exakt vad vi bygger: distribuerat, semantiskt sökbart, multi-lager minne. Hippocampus = episode→learning. Cortex = distribuerade learnings. Cerebellum = profile (automatisk). Amygdala = context (hög relevance_score).
- **Lashley-parallellen:** Minnet är distribuerat — ingen fast adress. Vår pgvector-approach är identisk.
- **Relevance_score = spaced repetition:** Minnen som hämtas ofta förstärks. Direkt analog med MIT Alzheimer-studien (stärka minnescell-kopplingar, inte lägga till ny info).
- **Fyra minnestyper:** profile (permanent/alltid), context (projekt/aktivt), learning (semantisk sökning), episode (session/alltid).
- **Lazy loading är kritiskt för prestanda:** Ladda INTE allt varje session. Profil + episode alltid. Learnings via recall() med similarity > 0.75.
- **Existerande alternativ saknar MCP-native approach:** Mem0, Zep, Letta — alla developer-first. Engrams är plug-and-play via Project Instructions.
- **Existensrisk:** Anthropic (Claude Memory). Fönster 12-18 månader. Strategi: MCP-register snabbt, enterprise-features de inte bygger.
- **Database-only default:** Kund behöver inget repo. Flöde: betalar → nyckel → klistrar in → klar.
- **V1 för Anna (singel-user) → V2 för team:** Validera V1 först.

## Modellträning (TRADESYS)

- **SECTOR_HOT-edge:** 71.8% WR på 85 trades (Defense + Financials, secMom>6, trailing 1.5%).
- **SC_TREND-edge:** 62.6% WR på 131 trades (secMom>4, pearsonR>0.2).
- **vixElevated är starkaste filter:** corr=-0.326. WR 76% när vixElevated=0.
- **CONTRARIAN + MEAN_REVERSION har ingen edge:** Båda ersatta.
- **agent-trainer.js leaf bug:** `node.v || 0` istället för `node.value`. +11.4pp precision.

## Trading-edge

- FPS = köp underpresterare + frisk kredit + panik + fundamentalt stark
- Extended över EMA20 = starkaste WAIT-signal
- RSI oversold = aktier fortsätter falla

## Processer

- **Session boot [projekt]:** Fokuserad boot per projekt via COMMANDS.md.
- **Handoff:** Skriv session_handoff + work_queue + engrams_todo + decisions + learnings + active_context. Sex filer.
- **Sync:** Uppdatera active_context.md direkt när beslut tas. CC kör `sync` för att hämta.
- **Opt-out todo:** Claude föreslår → Gustav tiger = godkänt.
- **Warner-tvist:** Gustav hanterar personligen. COO-agent eskalerar inte.
