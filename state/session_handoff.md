# styr-ai — SESSION HANDOFF
*Session close: 2026-03-28*

---

## DENNA SESSION — SAMMANFATTNING

### Claude.ai
1. **CC↔Claude.ai bidirektionellt sync byggt** — `state/active_context.md` + `state/cc_session_log.md` live. CLAUDE.md uppdaterad i styr-ai + tradesys1337. Alias `sync` för CC.
2. **Engrams** — produktnamn beslutat, engrams.app köpt (180 kr), landningssida live på Vercel, waitlist-API mot styr-ai Supabase.
3. **Work queue omstrukturerad** — Engrams-projekt tillagt med korrekt prioritetsordning.
4. **CC-session (tradesys-models)** — Agent 4+6 redesign: SECTOR_HOT 71.8% WR, SC_TREND 62.6% WR. agent-trainer.js leaf node bugfix +11.4pp. Trailing stop implementerat.

---

## NÄSTA SESSION — EXAKT ORDNING

### 1. ENGRAMS-MULTI-PROJECT-001 — GÖR DETTA ABSOLUT FÖRST
Se `project_memory/architecture/multi_project_design.md`
- Steg 1: SQL migration i Supabase — lägg till `project_name` i projects-tabell
- Steg 2: accounts-tabell ovanför projects (1 konto → N projekt)
Anna får INTE onboardas förrän Steg 1 är klar.

### 2. ENGRAMS-ONBOARD-001 — Skicka mail till Anna
Gmail draft ID: r5404878031968918972

### 3. ENGRAMS-STRIPE-001 — Betalning → nyckel automatiskt
Bygg parallellt med MULTI-PROJECT Steg 2.

### 4. ENGRAMS-MCP-CONNECTOR-001 — Officiell Claude Connector
- Skriv openapi.yaml
- Flytta MCP-server till engrams.app/api/mcp-server
- Ansök till Anthropics MCP-register

### 5. TRADESYS-SECTOR-HOT-001 — Expandera watchlist
Defense + Financials, 8-10 tickers per sektor → 60-80 trades/år

### 6. TRADESYS-FMP-001 — FMP Starter $29/mån
https://financialmodelingprep.com/pricing

---

## TEKNISK STATE

**Engrams**
- Live: https://engrams.app
- Repo: gustavkall/engrams
- Supabase: styr-ai projektet (hxikaojzwjtztyuwlxra) — waitlist-tabell
- MCP-server (gammal domän): https://app.savageroar.se/api/mcp-server
- Bearer: e5a93009-8ad9-4b44-9f6f-840d9c8c32da

**TRADESYS**
- Agent 4: SECTOR_HOT (ny) — behöver omstart med ny kod
- Agent 6: SC_TREND (ny) — behöver omstart med ny kod
- ML v10 live (69.0% BREAKOUT, BUY_BREAKOUT nu 68.8% efter bugfix)
- squeeze-probability.js live (short interest väntar FMP)

**Savage Roar / Warner**
- Frist 29 mars — IMORGON, inget formellt svar ännu
- Audit §8.3: 22 april (25 dagar)
- Cure period: 22 maj
- Minimum settlement: 200k SEK

**Öppna positioner:**
- Agent2: STRL, ETN, CAT, EME, PWR
- Agent4: OXY, AGX, STRL, ETN, CAT
- Agent5: ETN, PWR, EME
- Agent6: COIN, NOC, RTX, HII, LMT
