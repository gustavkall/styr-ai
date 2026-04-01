# active_context.md
*Uppdaterad: 2026-04-01 — session handoff*
*Skriven av Claude.ai, läses av CC via `session boot`*

---

## SENASTE BESLUT FRÅN CLAUDE.AI — 2026-04-01

- MCP-connector verifierad i Claude.ai — auto-save och auto-load fungerar
- Claude.ai-arkitektur: MCP URL globalt + en rad project instructions per projekt
- `load_project "namn"` — nytt MCP-tool som returnerar strukturerad briefing
- Global todo (state/global_todo.md) skapad — SSOT för alla tasks alla projekt
- TERMINAL-ONBOARDING-001 klar: /api/claudemd endpoint + Terminal-flik Mac/Windows
- ChatGPT recall fungerar, auto-remember fungerar EJ — kräver OPENAPI-001
- Gemini fungerar ej (sandbox) — deprioriterad
- Testkonto gustavkall@gmail.com rensat (TaskFlow-minnen raderade)

---

## GLOBAL TODO (aktiva ⎹)

### ENGRAMS
| # | Task | Prio |
|---|------|------|
| E7 | OPENAPI-001 — ChatGPT Custom GPT Action | 1 |
| E8 | Anna onboarding | 2 |
| E9 | ENGRAMS-SUPABASE-SPLIT | 3 |
| E10 | STRIPE-001 | — |
| E11 | PRICING-001 | — |
| E12 | DASHBOARD-001 | — |
| E13 | CONNECT-001 | — |

### TRADESYS
| # | Task |
|---|------|
| T1 | ADD-NEW-AGENT3-001 |
| T2 | DATA-EXTEND-001 (kräver Gustav) |
| T3 | MODEL-SCOREBOARD-001 |

### META
| # | Task |
|---|------|
| S4 | PAT_TOKEN scope mot tradesys1337 |

---

## TEKNISK STATE

**Engrams (www.engrams.app):**
- API: live, 5/5 e2e pass
- MCP-server: /api/mcp?key=eng_... — 4 tools: remember, recall, profile, load_project
- /api/claudemd: returnerar ren text CLAUDE.md för terminal-användare
- Supabase: TradeSys-projektet (hxikaojzwjtztyuwlxra) — ska splitas till eget
- Auth: SUPABASE_SERVICE_KEY strippar whitespace (.replace(/\s/g, ''))
- Vercel: prj_oQk5XQfJmBLJy70FIgApFJZnlHBZ

**Nycklar:**
- Anna: eng_d98ad48a4fe579e04b8abc61aa3ea6ba562e4fa5331c1aef1d1847087c966cd8
- gustavkall@gmail test: eng_d848fe5b5bda0cf7fbb2ff000a43a19a6bf3e7c88a34882986a591e4596bdf3c

---

## ÖPPNA FRÅGOR FÖR CC

- OPENAPI-001: bygg OpenAI Action JSON-schema för ChatGPT Custom GPT
- ENGRAMS-SUPABASE-SPLIT: migrera tabeller till Styr.AI-projektet (crsonxfrylkpgrddovhu)?
- DATA-EXTEND-001: påminn Gustav om TW CSV-export när redo
