# Engrams Todo — Master
*Uppdaterad: 2026-04-01 (synkad från CC-session)*

## Integration-status per plattform

| Plattform | Recall | Remember | Metod | Status |
|-----------|--------|----------|-------|--------|
| Claude.ai (MCP) | ✅ | ✅ | MCP-connector + project instructions | VERIFIERAD |
| Claude Code (CC) | ✅ | ✅ | CLAUDE.md direkt API | VERIFIERAD (5/5 e2e pass) |
| ChatGPT Custom Instructions | ✅ boot | ❌ auto-save | Recall OK, save kräver trigger | Halvt |
| ChatGPT Custom GPT | ✅ | ✅ | OpenAI Action | OPENAPI-001 |
| Cursor | ✅ | ✅ | .cursorrules | Otestat |
| Gemini Gems | ❌ sandbox | ❌ sandbox | Kräver native | GEMINI-NATIVE-001 |

---

## Todo

| # | Task | Status | Not |
|---|------|--------|-----|
| 1 | SQL-schema | ✅ KLAR | |
| 2 | MCP-CONNECTOR-001 | ✅ KLAR | Verifierad i Claude.ai |
| 3 | CC-VERIFY-001 | ✅ KLAR | 5/5 e2e pass |
| 4 | ENGRAMS-RECALL-FIX | ✅ KLAR | Threshold 0.3, fungerar |
| 5 | **Anna onboarding** | ⬜ PRIORITET 1 | Alla blockerare lösta |
| 6 | **OPENAPI-001** — ChatGPT Custom GPT Action | ⬜ PRIORITET 2 | Auto-remember kräver Actions |
| 7 | **ENGRAMS-SUPABASE-SPLIT** | ⬜ PRIORITET 3 | Engrams delar nu DB med TradeSys |
| 8 | STRIPE-001 | ⬜ | |
| 9 | GEMINI-NATIVE-001 | ⬜ V2 | |
| 10 | PRICING-001 | ⬜ | |
| 11 | DASHBOARD-001 | ⬜ | |
| 12 | CONNECT-001 | ⬜ | Väntar på dashboard |
| — | MEMORY-FORGETTING-001 | ⬜ V2 | |
| — | MEMORY-CONSOLIDATION-001 | ⬜ V2 | |

---

## Vad som är byggt och verifierat

**API (live på www.engrams.app):**
- `remember`, `recall`, `profile` — alla endpoints live, 5/5 e2e pass
- Multi-project: samma nyckel, isolerade minnen via `project`-parameter
- `get_or_create_project()` Supabase-funktion
- Whitespace-strippning på env vars (fix för Vercel paste-radbrytning)

**MCP-server (`/api/mcp`):**
- JSON-RPC 2.0, CommonJS, auth via URL `?key=eng_...`
- Tools: `remember`, `recall`, `profile`, `load_project`
- CORS-headers satta

**Verifierat i Claude.ai:**
- Auto-save och auto-load bekräftade
- `load_project` returnerar strukturerad briefing

**Verifierat i CC:**
- 5/5 e2e pass efter Supabase-fix
- SUPABASE_SERVICE_KEY pekade på fel projekt (Styr.AI istf TradeSys) — fixat
- Nyckel hade radbrytning från paste — fixat med `.replace(/\s/g, '')`

**Infra:**
- `git config --global user.email me@gustavkall.com` — fixar Vercel Hobby deploy-blockering
- Vercel CLI installerat globalt på Gustavs Mac
- CC auto-approve konfigurerat i ~/.claude/settings.json

---

## Nycklar och IDs

- Supabase TradeSys (engrams DB): `hxikaojzwjtztyuwlxra`
- Supabase Styr.AI (framtida engrams DB): `crsonxfrylkpgrddovhu`
- Vercel engrams: `prj_oQk5XQfJmBLJy70FIgApFJZnlHBZ`
- Vercel team: `team_pp2fvMpvzRPz7AfSGFMVttPs`
- Anna API-nyckel: `eng_d98ad48a4fe579e04b8abc61aa3ea6ba562e4fa5331c1aef1d1847087c966cd8`
- gustavkall@gmail testkonto: `eng_d848fe5b5bda0cf7fbb2ff000a43a19a6bf3e7c88a34882986a591e4596bdf3c`
