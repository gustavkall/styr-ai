# Active Context
*Skriven av Claude.ai — 2026-04-01*

## Aktivt projekt: Engrams

## Vad som hände idag (2026-04-01)

### MCP-connector — KLAR OCH VERIFIERAD
- MCP-server byggd på `https://www.engrams.app/api/mcp`
- JSON-RPC 2.0, CommonJS, auth via URL `?key=eng_...`
- Tools: `remember`, `recall`, `profile`, `load_project`
- Auto-save och auto-load verifierade i Claude.ai
- Minnen bekräftade i Supabase (profile + context sparades automatiskt)

### Arkitektur för Claude.ai
- Steg 1: MCP URL i Settings → Connections (globalt, en gång)
- Steg 2: En rad i varje Project Instructions för projekt-isolation
- Kommando: `load_project "projektnamn"` — returnerar strukturerad briefing

### /start-sidan uppdaterad
- Claude-fliken: MCP URL + project instructions (en rad)
- ChatGPT-fliken: komprimerat block <1500 tecken
- Gemini borttagen (sandbox-begränsning)
- `load_project`-kommandot dokumenterat på sidan

### Multi-project
- Samma nyckel, isolerade minnen via `project`-parameter
- `get_or_create_project()` Supabase-funktion skapar automatiskt nya projekt

### Testkonto (gustavkall@gmail.com)
- Nyckel: `eng_d848fe5b5bda0cf7fbb2ff000a43a19a6bf3e7c88a34882986a591e4596bdf3c`
- Testminnen raderade (TaskFlow/Gusten)
- Projektet i Claude.ai behålls för vidare testning

---

## Nästa steg (prioritetsordning)

### PRIORITET 1 — CC-VERIFY-001
Verifiera att CC-integrationen fungerar med ny MCP-arkitektur.
- Kolla befintlig CLAUDE.md i engrams-repot
- Testa recall + remember via direkta API-anrop
- Uppdatera CLAUDE.md om nödvändigt
- CC kan använda direkta API-anrop (Bearer token) eller MCP-tools

### PRIORITET 2 — Anna onboardas
- Väntar på CC-verifiering
- Nyckel: `eng_d98ad48a4fe579e04b8abc61aa3ea6ba562e4fa5331c1aef1d1847087c966cd8`
- Onboarding-mail finns i Gmail drafts

### PRIORITET 3 — OPENAPI-001
- ChatGPT Custom GPT med Actions
- Auto-remember fungerar EJ med Custom Instructions
- Kräver OpenAPI JSON-schema på `/openapi.json`

---

## Integration-status

| Plattform | Recall | Remember | Status |
|-----------|--------|----------|--------|
| Claude.ai (MCP) | ✅ | ✅ | VERIFIERAD |
| Claude Code | ✅ | ✅ | EJ TESTAD efter MCP-rebuild |
| ChatGPT Custom Instructions | ✅ boot | ❌ auto | Halvt |
| ChatGPT Custom GPT | ✅ | ✅ | OPENAPI-001 |
| Cursor | ✅ | ✅ | Otestat |
| Gemini | ❌ | ❌ | Sandbox |

---

## Nycklar och IDs
- Supabase engrams DB: `hxikaojzwjtztyuwlxra`
- Vercel engrams: `prj_oQk5XQfJmBLJy70FIgApFJZnlHBZ`
- Vercel team: `team_pp2fvMpvzRPz7AfSGFMVttPs`
- Anna: `eng_d98ad48a4fe579e04b8abc61aa3ea6ba562e4fa5331c1aef1d1847087c966cd8`
- Testkonto: `eng_d848fe5b5bda0cf7fbb2ff000a43a19a6bf3e7c88a34882986a591e4596bdf3c`
