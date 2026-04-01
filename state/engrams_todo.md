# Engrams Todo — Master
*Uppdaterad: 2026-04-01*

| # | Task | Status | Not |
|---|------|--------|-----|
| 1 | SQL-schema i Supabase | ✅ KLAR | |
| 2 | Onboarding-mail till Anna | ⬜ | Väntar på MCP-connector |
| 3 | STRIPE-001 — Betalning → konto skapas | ⬜ | |
| 4 | **MCP-CONNECTOR-001** | ⬜ PRIORITET 1 | Claude.ai kräver MCP — inte sandbox |
| 5 | OPENAPI-001 — ChatGPT Custom GPT Action | ⬜ PRIORITET 2 | Auto-remember kräver Action, inte Custom Instructions |
| 6 | GEMINI-NATIVE-001 — Gemini native integration | ⬜ PRIORITET 3 | Gems stöder ej fetch() |
| 7 | PRICING-001 — Prissektion | ⬜ | Väntar på #3 |
| 8 | DASHBOARD-001 — Inloggning + projektsida | ⬜ | |
| 9 | CONNECT-001 — Connect-flow per plattform | ⬜ | Väntar på #8 |
| 10 | MEMORY-001 — API-endpoints | ✅ KLAR | remember/recall/profile live |
| 11 | MEMORY-002 — Auto-remember | ✅ KLAR | Fungerar i ChatGPT + CC |
| 12 | MEMORY-003 — Auto-recall boot | ✅ KLAR | Fungerar i ChatGPT + CC |
| 13 | ENGRAMS-TEAM-001 (V2) | ⬜ | |
| 14 | AGENT-HAIKU-001 | ⬜ | |
| — | ENGRAMS-SUPABASE-SPLIT | ⬜ | Migrera från TradeSys till eget projekt |
| — | MEMORY-FORGETTING-001 | ⬜ V2 | Forgetting curve — nattlig decay |
| — | MEMORY-CONSOLIDATION-001 | ⬜ V2 | episode → learning automatiskt |

---

## Integration-status per plattform

| Plattform | Recall (läsa) | Remember (spara) | Metod | Status |
|-----------|--------------|-----------------|-------|--------|
| Claude Code | ✅ | ✅ | CLAUDE.md | Fungerar |
| ChatGPT Custom Instructions | ✅ | ❌ | Kräver explicit trigger | Halvt |
| ChatGPT Custom GPT | ✅ | ✅ | OpenAI Action | OPENAPI-001 |
| Claude.ai | ❌ sandbox | ❌ sandbox | Kräver MCP | MCP-CONNECTOR-001 |
| Gemini Gems | ❌ sandbox | ❌ sandbox | Kräver native | GEMINI-NATIVE-001 |
| Cursor | ✅ | ✅ | .cursorrules | Otestat |

---

## Lansering‐plan

**Inga kunder onboardas förrän MCP-connector är klar.**
Anna väntar. Rätt beslut.

1. MCP-CONNECTOR-001 → Claude.ai fungerar → Anna onboardas
2. OPENAPI-001 → ChatGPT full integration
3. GEMINI-NATIVE-001 → Gemini full integration
4. Bredare lansering

---

## MCP-CONNECTOR-001 — Plan

Engrams som MCP-server som Claude.ai kan ansluta via Settings → Connections.

**Vad som krävs:**
- MCP-server endpoint (SSE eller HTTP) på `mcp.engrams.app`
- Tools: `remember`, `recall`, `profile`
- Auth: Bearer-token via MCP auth-flöde
- Publicering i Anthropic connector registry (eller self-hosted)

**Stack:**
- Vercel Edge Function som MCP-server
- Använder befintliga API-endpoints internt
- Ny subdomain: `mcp.engrams.app`

**Blockas av:** Inget — kan starta nu.

---

## OPENAPI-001 — Plan

ChatGPT Custom GPT med tre Actions: remember, recall, profile.

**Vad som krävs:**
- `openapi.json` på `www.engrams.app/openapi.json`
- Custom GPT skapad i OpenAI med Actions kopplat till Engrams API
- Auth: API Key (Bearer) som användaren anger vid setup
- Publicering: privat eller publik GPT

**Blockas av:** Inget — kan starta efter MCP.

---

## Minnessystemet — neurobiologisk grund

| Minnestyp | Neurologiskt system | Funktion |
|-----------|--------------------|-----------|
| `profile` | Cerebellum | Permanent identitet |
| `context` | Amygdala | Projektspecifik kontext |
| `learning` | Cerebral cortex | Beslut, fakta, arkitektur |
| `episode` | Hippocampus | Sessionshandoff |
