# Engrams Todo — Master
*Uppdaterad: 2026-03-31*

| # | Task | Status | Not |
|---|------|--------|-----|
| 1 | SQL-schema i Supabase | ✅ KLAR | |
| 2 | Onboarding-mail till Anna | ⬜ | Väntar på recall-fix |
| 3 | STRIPE-001 — Betalning → nyckel | ⬜ | |
| 4 | MCP-CONNECTOR-001 | ⬜ | Claude-native, Anthropic connector registry |
| 5 | OPENAPI-001 | ⬜ | Väntar på #4 |
| 6 | PRICING-001 — Prissektion | ⬜ | Väntar på #3 |
| 7 | DASHBOARD-001 | ⬜ | |
| 8 | MEMORY-001 — API-endpoints | ✅ KLAR | Kod klar, service_role-nyckel satt |
| 9 | MEMORY-002 — Auto-remember | ⬜ | Väntar på recall-fix |
| 10 | MEMORY-003 — Auto-recall boot | ⬜ | Väntar på recall-fix |
| 11 | ENGRAMS-TEAM-001 (V2) | ⬜ | |
| 12 | CC-SUPABASE-MCP-001 | ⬜ | |
| 13 | AGENT-HAIKU-001 | ⬜ | |
| — | ENGRAMS-RECALL-FIX | ⬜ BLOCKER | recall() returnerar 0 minnen — sänk threshold 0.75→0.3, kolla pgvector-index |
| — | ENGRAMS-SUPABASE-SPLIT | ⬜ | Migrera från TradeSys till eget projekt |
| — | PLATFORM-AGNOSTIC-001 | ⬜ | Se plan nedan |
| — | MEMORY-FORGETTING-001 | ⬜ V2 | Forgetting curve — nattlig cron sänker relevance_score på oanvända minnen |
| — | MEMORY-CONSOLIDATION-001 | ⬜ V2 | Konsolidering — episode-minnen som nås upprepade gånger → learning automatiskt |

---

## Minnessystemet — neurobiologisk grund

Engrams är modellerat på hjärnans minnessystem. Varje minnestyp mappar till ett neurologiskt system:

| Minnestyp | Neurologiskt system | Funktion |
|-----------|--------------------|----|
| `profile` | Cerebellum | Permanent identitet, "vem är detta" — förändras sällan |
| `context` | Amygdala | Projektspecifik kontext, prioritet, emotionell vikt |
| `learning` | Cerebral cortex | Långtidsminne — fakta, beslut, arkitektur |
| `episode` | Hippocampus | Sessionshandoff, korttidsminne → konsolideras till learning |

**Konsolidering (boost_relevance):** Precis som hippocampus stärker minnen som repeteras, ökar `boost_relevance()` relevance_score vid varje recall. Spaced repetition inbyggt.

**Forgetting curve (saknas):** Hjärnan försvagar oanvända minnen. Engrams saknar detta — MEMORY-FORGETTING-001 lägger till nattlig decay på minnen utan recent access.

**Distribuerad lagring:** Hjärnans minne är inte på ett ställe. Engrams löser detta med cross-tool shared memory via samma project_id — PLATFORM-AGNOSTIC-001.

---

## PLATFORM-AGNOSTIC-001 — Plan

**Förutsättningar i systemet (redan uppfyllt):**
- API är ren HTTP POST med Bearer-auth — fungerar från allt
- Inget plattformsspecifikt i koden
- Enda blocker: recall() måste returnera minnen

**Vad användaren behöver:**
- Ett system prompt-block med sin API-nyckel + instruktioner för remember/recall
- Fungerar i alla verktyg med system prompt: Claude, ChatGPT, Cursor, Gemini
- Inget annat — ingen källkodsaccess, ingen plugin

### Fas 1 — System prompt-template (ingen kod, 1 dag)
- Generiskt template som fungerar i alla verktyg
- Dokumentera för: Claude Project Instructions, ChatGPT Custom Instructions, Cursor Rules, Gemini System Instruction
- **Blockas av:** ENGRAMS-RECALL-FIX

### Fas 2 — ChatGPT Custom GPT action
- OpenAI Actions = REST-anrop med OpenAPI-spec
- Skapa openapi.json för /remember, /recall, /profile
- Publicera som Custom GPT action
- **Blockas av:** OPENAPI-001

### Fas 3 — Cursor / Windsurf rules-fil
- .cursorrules och .windsurfrules = system prompt-filer
- Standardiserad Engrams rules-fil per editor
- Publicera i Cursor Directory
- **Blockas av:** Fas 1

### Fas 4 — MCP-connector (Claude-native)
- Publicera Engrams som MCP-server i Anthropic connector registry
- One-click install för Claude-användare
- **Blockas av:** MCP-CONNECTOR-001

**Ingen källkodsaccess till OpenAI/Google/Cursor behövs.**
