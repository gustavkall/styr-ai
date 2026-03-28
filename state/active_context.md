# active_context.md — Delat whiteboard CC ↔ Claude.ai
*Uppdateras av Claude.ai vid varje beslut. Läses av CC vid boot och vid `sync`.*
*Senast uppdaterad: 2026-03-28 EOD av Claude.ai*

---

## NÄSTA SESSION — PRIORITETSORDNING

1. **ENGRAMS-MULTI-PROJECT-001** — SQL migration i Supabase (blockerare för Anna + Stripe)
   - Steg 1: `ALTER TABLE projects ADD COLUMN project_name TEXT`
   - Se `project_memory/architecture/multi_project_design.md`
   - Anna-draft Gmail ID: r5404878031968918972 — SKICKA EJ förrän klar

2. **ENGRAMS-ONBOARD-001** — Skicka mail till Anna (efter #1)

3. **ENGRAMS-STRIPE-001** — Självbetjäning, betalning → nyckel automatiskt

4. **ENGRAMS-MCP-CONNECTOR-001** — Officiell Claude Connector
   - openapi.yaml → engrams.app/api/mcp-server → Anthropic MCP-register

5. **TRADESYS-SECTOR-HOT-001** — Expandera Defense/Financials watchlist
   - Agent 4+6 behöver omstart med ny kod

6. **TRADESYS-FMP-001** — FMP Starter $29/mån (short interest live)

---

## ENGRAMS — NULÄGE

- Live: https://engrams.app
- Repo: gustavkall/engrams
- Stack: Static HTML + Vercel serverless + Supabase (styr-ai projekt)
- Waitlist aktiv, formulär live
- MCP-server: https://app.savageroar.se/api/mcp-server (ska flyttas till engrams.app)

---

## TRADESYS — NULÄGE

- Agent 4: SECTOR_HOT (ny strategi, 71.8% WR) — behöver omstart
- Agent 6: SC_TREND (ny strategi, 62.6% WR) — behöver omstart
- ML v10 + bugfix live (BUY_BREAKOUT 68.8%)
- Marknadsregim: RISK-OFF

**Öppna positioner:**
- Agent2: STRL, ETN, CAT, EME, PWR
- Agent4: OXY, AGX, STRL, ETN, CAT
- Agent5: ETN, PWR, EME
- Agent6: COIN, NOC, RTX, HII, LMT

---

## SAVAGE ROAR / WARNER

- Frist 29 mars passerar IMORGON — inget formellt svar
- Stärkt juridiskt läge ju längre de dröjer
- Audit §8.3: 22 april (25 dagar)
- Minimum settlement: 200k SEK
- Jennie Runnedahl: jennie.runnedahl@warnermusic.com

---

## SYNC-ALIAS FÖR CC

```bash
alias sync='curl -s https://raw.githubusercontent.com/gustavkall/styr-ai/main/state/active_context.md'
```
