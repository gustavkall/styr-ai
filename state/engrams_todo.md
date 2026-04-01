# Engrams Todo — Master
*Uppdaterad: 2026-04-01*

## Integration-status per plattform

| Plattform | Recall | Remember | Metod | Status |
|-----------|--------|----------|-------|--------|
| Claude.ai (MCP) | ✅ | ✅ | MCP-connector + project instructions | VERIFIERAD |
| Claude Code (CC) | ✅ | ✅ | CLAUDE.md direkt API | EJ TESTAD efter MCP-rebuild |
| ChatGPT Custom Instructions | ✅ boot | ❌ auto-save | Recall OK, save kräver trigger | Halvt |
| ChatGPT Custom GPT | ✅ | ✅ | OpenAI Action | OPENAPI-001 |
| Cursor | ✅ | ✅ | .cursorrules | Otestat |
| Gemini Gems | ❌ sandbox | ❌ sandbox | Kräver native | GEMINI-NATIVE-001 |

---

## Lansering-plan

1. **CC-verifiering** → uppdatera CLAUDE.md för MCP-tools → testa
2. **Anna onboardas** → när CC bekräftad
3. **OPENAPI-001** → ChatGPT Custom GPT Action
4. **Bredare lansering**

---

## Todo

| # | Task | Status | Not |
|---|------|--------|-----|
| 1 | SQL-schema | ✅ KLAR | |
| 2 | MCP-CONNECTOR-001 | ✅ KLAR | Verifierad i Claude.ai |
| 3 | **CC-VERIFY-001** — verifiera CC + uppdatera CLAUDE.md | ⬜ PRIORITET 1 | Blockar Anna |
| 4 | **Anna onboarding** | ⬜ PRIORITET 2 | Väntar på #3 |
| 5 | **OPENAPI-001** — ChatGPT Custom GPT Action | ⬜ PRIORITET 3 | Auto-remember kräver Actions |
| 6 | CLEANUP-001 — radera TaskFlow-testminnen | ⬜ | gustavkall@gmail.com |
| 7 | STRIPE-001 | ⬜ | |
| 8 | GEMINI-NATIVE-001 | ⬜ V2 | |
| 9 | PRICING-001 | ⬜ | |
| 10 | DASHBOARD-001 | ⬜ | |
| 11 | CONNECT-001 | ⬜ | Väntar på dashboard |
| — | ENGRAMS-SUPABASE-SPLIT | ⬜ | Migrera från TradeSys till eget projekt |
| — | MEMORY-FORGETTING-001 | ⬜ V2 | |
| — | MEMORY-CONSOLIDATION-001 | ⬜ V2 | |

---

## Vad som är byggt och verifierat (2026-04-01)

**API (live på www.engrams.app):**
- `remember`, `recall`, `profile` — alla endpoints live
- Multi-project: samma nyckel, isolerade minnen via `project`-parameter
- `get_or_create_project()` Supabase-funktion

**MCP-server (`/api/mcp`):**
- JSON-RPC 2.0, CommonJS
- Auth via URL `?key=eng_...`
- Tools: `remember`, `recall`, `profile`, `load_project`
- `load_project` returnerar strukturerad briefing
- CORS-headers satta

**Verifierat i Claude.ai:**
- MCP-connector installerad med nyckel i URL
- Auto-save: Claude sparade `profile` + `context` automatiskt
- Auto-load: ny chat laddade minnen från föregående session
- Minnen bekräftade i Supabase

**Claude flöde (rätt arkitektur):**
- Steg 1: MCP URL i Settings → Connections (en gång globalt)
- Steg 2: En rad i varje Claude Project Instructions (projekt-isolation)
- Kommando: `load_project "projektnamn"` — full briefing on demand

**ChatGPT:**
- Recall fungerar vid boot via Custom Instructions
- Auto-remember fungerar INTE — kräver Custom GPT Action (OPENAPI-001)

---

## Nycklar och IDs

- Supabase TradeSys (engrams DB): `hxikaojzwjtztyuwlxra`
- Vercel engrams: `prj_oQk5XQfJmBLJy70FIgApFJZnlHBZ`
- Vercel team: `team_pp2fvMpvzRPz7AfSGFMVttPs`
- Anna API-nyckel: `eng_d98ad48a4fe579e04b8abc61aa3ea6ba562e4fa5331c1aef1d1847087c966cd8`
- gustavkall@gmail testkonto: `eng_d848fe5b5bda0cf7fbb2ff000a43a19a6bf3e7c88a34882986a591e4596bdf3c`
