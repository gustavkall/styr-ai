# Engrams Todo — Master
*Uppdaterad: 2026-03-31*

| # | Task | Status | Not |
|---|------|--------|-----|
| 1 | SQL-schema i Supabase | ✅ KLAR | |
| 2 | Onboarding-mail till Anna | ⬜ | Väntar på att API fungerar |
| 3 | STRIPE-001 — Betalning → nyckel | ⬜ | |
| 4 | MCP-CONNECTOR-001 | ⬜ | Claude-native, Anthropic connector registry |
| 5 | OPENAPI-001 | ⬜ | Väntar på #4 |
| 6 | PRICING-001 — Prissektion | ⬜ | Väntar på #3 |
| 7 | DASHBOARD-001 | ⬜ | |
| 8 | MEMORY-001 — API-endpoints | ⬜ | Kod klar, env var deployad |
| 9 | MEMORY-002 — Auto-remember | ⬜ | Väntar på #8 |
| 10 | MEMORY-003 — Auto-recall boot | ⬜ | Väntar på #8 |
| 11 | ENGRAMS-TEAM-001 (V2) | ⬜ | |
| 12 | CC-SUPABASE-MCP-001 | ⬜ | |
| 13 | AGENT-HAIKU-001 | ⬜ | |
| — | ENGRAMS-RECALL-FIX | ⬜ BLOCKER | recall() returnerar 0 minnen |
| — | ENGRAMS-SUPABASE-SPLIT | ⬜ | Migrera från TradeSys till eget projekt |
| — | PLATFORM-AGNOSTIC-001 | ⬜ | Se plan nedan |

---

## PLATFORM-AGNOSTIC-001 — Plan

**Mål:** Engrams fungerar med Claude, ChatGPT, Cursor, Gemini och alla andra AI-verktyg.

**Nuläge:** API:et är redan plattformsagnostiskt — det är ren HTTP POST. Inget som blockerar andra verktyg tekniskt. Det saknas bara adaptrar och dokumentation per plattform.

### Fas 1 — System prompt-adapter (ingen kod krävs)
Engrams fungerar redan med *alla* verktyg som accepterar ett system prompt.
- Skriv ett generiskt system prompt-template som instruerar AI:n att anropa `/api/remember` och `/api/recall` via fetch
- Dokumentera hur man klistrar in det i: ChatGPT Custom Instructions, Cursor Rules, Gemini System Instruction
- Kräver noll tillgång till källkod för dessa plattformar

### Fas 2 — ChatGPT Custom GPT action
- OpenAI Actions = REST-anrop med OpenAPI-spec
- Skapa `openapi.json` som beskriver `/remember`, `/recall`, `/profile`
- Publicera som Custom GPT action — användaren autentiserar med sin Engrams API-nyckel
- **Kräver:** OPENAPI-001 (redan i todo)

### Fas 3 — Cursor / Windsurf rules
- Cursor `.cursorrules` och Windsurf `.windsurfrules` = system prompt-filer
- Skriv en standardiserad Engrams rules-fil per editor
- Publicera i Cursor Directory och Windsurf Marketplace
- **Kräver:** Noll access till Cursor/Windsurf källkod

### Fas 4 — Gemini / Google AI Studio
- Google AI Studio accepterar system instructions = samma som system prompt
- Gemini API accepterar `system_instruction` parameter = direkt API-integration möjlig
- **Kräver:** Noll access till Google källkod

### Fas 5 — Native MCP (Claude-first)
- MCP-CONNECTOR-001: publicera Engrams som MCP-server i Anthropic connector registry
- Ger Claude-användare one-click install
- Samma API, bara ett annat transport-lager
- **Kräver:** MCP-CONNECTOR-001

### Prioritetsordning
1. System prompt-template (docs) — 1 dag, noll kod
2. ChatGPT Custom GPT action — kräver OPENAPI-001
3. Cursor rules-fil — 1 dag, noll kod
4. MCP-connector — kräver mer infra

**Ingen källkod från OpenAI/Google/Cursor behövs. Allt bygger på publika API:er och system prompts.**
