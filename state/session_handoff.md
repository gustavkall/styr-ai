# styr-ai — SESSION HANDOFF
*Session close: 2026-03-28 EOD*

---

## DENNA SESSION — SAMMANFATTNING

### Byggt
1. **CC↔Claude.ai bidirektionellt sync** — active_context.md + cc_session_log.md live
2. **Engrams** — namn beslutat, engrams.app live, landningssida + waitlist + docs
3. **SQL-schema i Supabase** — kört via Supabase MCP (accounts, projects, engrams_sessions, engrams_decisions, memory_items med pgvector, waitlist)
4. **Memory-arkitektur designad** — fyra minnestyper, lazy loading, semantisk sökning
5. **COMMANDS.md** — alla kommandon + `session boot [projekt]` + MCP-autonomi-regel
6. **Alla underprojekts CLAUDE.md uppdaterade** — savage-roar, adminassistent, engrams, tradesys1337
7. **engrams_todo.md** — master todo-lista skapad, #1 klar, #2-#12 dokumenterade
8. **Opt-out todo-modell** — Claude föreslår tasks med `→ Todo-förslag`, Gustav behöver inte svara
9. **Engrams/Anna-produktdesign** — fyra minnestyper parallell med hjärnans minnessystem (Wikipedia Engram)

### CC (tradesys-models)
- Agent 4: SECTOR_HOT (ny strategi, 71.8% WR)
- Agent 6: SC_TREND (ny strategi, 62.6% WR)
- agent-trainer.js leaf node bugfix (+11.4pp precision)
- Trailing stop implementerat

---

## NÄSTA SESSION — EXAKT ORDNING

Kör: `session boot engrams` för att få fokuserad boot.

### 1. #3 STRIPE-001 — Betalning → API-nyckel automatiskt (~2h)
Först: lägg till miljövariabler i Vercel (engrams):
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- RESEND_API_KEY
- OPENAI_API_KEY

Claude bygger sedan: `lib/api-key.js` + `lib/email.js` + `api/stripe-webhook.js`

### 2. #8 MEMORY-001 — remember/recall/forget/profile (~3h)
Databas klar. Kod saknas. Claude bygger:
- `lib/embeddings.js` — OpenAI text-embedding-3-small
- `api/mcp` endpoints: remember, recall, forget, profile

### 3. #2 ONBOARD-001 — Skicka mail till Anna (5 min)
Efter Stripe är klart. Gmail draft ID: r5404878031968918972

### 4. #12 CC-SUPABASE-MCP-001 — Koppla Supabase MCP till CC (2 min)
```bash
claude mcp add --scope project --transport http supabase "https://mcp.supabase.com/mcp?project_ref=crsonxfrylkpgrddovhu"
```

---

## TEKNISK STATE

**Engrams (engrams.app)**
- Landningssida + docs + waitlist: live
- Supabase: accounts, projects, memory_items (pgvector) live
- MCP-server: https://app.savageroar.se/api/mcp (ska flyttas till engrams.app)
- Repo: gustavkall/engrams

**Saknas i Vercel (engrams):**
- STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, RESEND_API_KEY, OPENAI_API_KEY

**TRADESYS**
- Agent 4 (SECTOR_HOT) + Agent 6 (SC_TREND) — ny kod, behöver omstart i CC
- ML v10 + bugfix (BUY_BREAKOUT 68.8%)
- squeeze-probability.js väntar på FMP $29/mån

**Öppna positioner:**
- Agent2: STRL, ETN, CAT, EME, PWR
- Agent4: OXY, AGX, STRL, ETN, CAT
- Agent5: ETN, PWR, EME
- Agent6: COIN, NOC, RTX, HII, LMT

**Savage Roar / Warner**
- Frist 29 mars passerade — inget formellt svar
- Audit §8.3: 22 april (25 dagar)
- Cure period: 22 maj
- Minimum settlement: 200k SEK
