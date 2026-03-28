# Cross-Project Learnings
*Uppdaterad: 2026-03-28 FINAL*

---

## Systemarkitektur

- **URL-first instruktioner:** CLAUDE.md läses via URL. Uppdatera repot — UI behöver aldrig ändras.
- **GOVERNANCE.md = grundlagar:** En fil, alla projekt följer den. Ändras här, gäller överall direkt.
- **PROJECT.md = projektidentitet:** Varje repo har sin egen. PROJECT_ID, LAYER, SUPABASE_REF, projektspecifika regler.
- **system_projects-tabell:** Alla projekt registrerade i Supabase. Agenter slår upp vart de ska skriva.
- **Tvånivå-styrning:** Grundlagar (GOVERNANCE) + projektlagar (PROJECT) + session-state (CLAUDE/state). Samma som rättssystem.
- **CC↔Claude.ai sync:** active_context.md är whiteboardet. cc_session_log.md är CC:s rapport.
- **Supabase MCP kör SQL autonomt:** Claude behöver inte fråga Gustav.
- **Proaktivitetsgap:** GOVERNANCE/PROJECT-strukturen var uppenbar från problemen (inkonsistenta regler, ingen isolation) men föreslogs inte av Claude. Ska föreslås proaktivt nästa gång ett liknande mönster syns.

## Engrams — produkt och strategi

- **Engram-metaforen är strukturell:** Fyra minnestyper parallella med hjärnans system. Hippocampus=episode→learning. Cortex=learnings. Cerebellum=profile. Amygdala=context.
- **Lashley-parallellen:** Minne är distribuerat — pgvector = ingen fast adress.
- **Relevance_score = spaced repetition:** Minnen som hämtas förstärks. MIT Alzheimer-analogi.
- **Lazy loading kritiskt:** Profil + episode alltid. Learnings via recall() similarity > 0.75.
- **Database-only default:** Kund behöver inget repo. Betalar → nyckel → klistrar → klar.
- **Existensrisk:** Anthropic (Claude Memory). Fönster 12-18 månader. MCP-register snabbt.
- **V1 för Anna (singel-user) valideras innan V2 (team).**

## TRADESYS

- **SECTOR_HOT:** 71.8% WR, Defense+Financials, secMom>6, trailing 1.5%.
- **SC_TREND:** 62.6% WR, secMom>4, pearsonR>0.2.
- **vixElevated filter:** corr=-0.326. WR 76% när vixElevated=0.
- **agent-trainer leaf bug:** `node.v || 0`. +11.4pp precision.

## Processer

- **Boot Steg 0:** Hämta GOVERNANCE.md + PROJECT.md före allt annat.
- **Handoff:** 6 filer alltid. engrams_todo.md är en av dem.
- **Sync:** Uppdatera active_context.md direkt vid beslut.
- **Opt-out todo:** Claude föreslår → Gustav tiger = godkänt.
- **Warner:** Gustav hanterar personligen. COO eskalerar inte.
