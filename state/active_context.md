# active_context.md — Delat whiteboard CC ↔ Claude.ai
*Uppdateras av Claude.ai vid varje beslut. Läses av CC vid boot och vid `sync`.*
*Senast uppdaterad: 2026-03-28*

---

## ENGRAMS TODO — MASTER LISTA
*Fullständig lista: `state/engrams_todo.md`*

| # | Task | Status |
|---|------|--------|
| 1 | MULTI-PROJECT-001 — SQL-schema i Supabase | ⬜ EJ KLAR |
| 2 | ONBOARD-001 — Mail till Anna | ⬜ väntar på #1 |
| 3 | STRIPE-001 — Betalning → nyckel automatiskt | ⬜ väntar på #1 |
| 4 | MCP-CONNECTOR-001 — Officiell Claude Connector | ⬜ EJ KLAR |
| 5 | OPENAPI-001 — ChatGPT + Gemini spec | ⬜ väntar på #4 |
| 6 | PRICING-001 — Prissektion på sajten | ⬜ väntar på #3 |
| 7 | DASHBOARD-001 — Kund-dashboard | ⬜ EJ KLAR |

**Nästa att köra: #1 — SQL-schema (30 min, blockerare för allt)**

---

## TRADESYS — NULÄGE

- Agent 4: SECTOR_HOT (71.8% WR) — behöver omstart med ny kod
- Agent 6: SC_TREND (62.6% WR) — behöver omstart med ny kod
- ML v10 + bugfix live (BUY_BREAKOUT 68.8%)
- Marknadsregim: RISK-OFF
- squeeze-probability.js väntar på FMP $29/mån

**Öppna positioner:**
- Agent2: STRL, ETN, CAT, EME, PWR
- Agent4: OXY, AGX, STRL, ETN, CAT
- Agent5: ETN, PWR, EME
- Agent6: COIN, NOC, RTX, HII, LMT

---

## SAVAGE ROAR / WARNER

- Frist 29 mars passerade — inget formellt svar från Warner
- Stärkt juridiskt läge
- Audit §8.3: 22 april
- Minimum settlement: 200k SEK

---

## SYNC-ALIAS FÖR CC

```bash
alias sync='curl -s https://raw.githubusercontent.com/gustavkall/styr-ai/main/state/active_context.md'
```
