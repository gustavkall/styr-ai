# active_context.md — Delat whiteboard CC ↔ Claude.ai
*Uppdateras av Claude.ai vid varje beslut. Läses av CC vid boot och vid `sync`.*
*Senast uppdaterad: 2026-03-28 EOD*

---

## ENGRAMS TODO

| # | Task | Status |
|---|------|--------|
| 1 | MULTI-PROJECT-001 — SQL-schema i Supabase | ✅ KLAR |
| 2 | ONBOARD-001 — Mail till Anna | ⬜ väntar på #3 |
| 3 | STRIPE-001 — Betalning → nyckel automatiskt | ⬜ NÄSTA |
| 4 | MCP-CONNECTOR-001 — Officiell Claude Connector | ⬜ |
| 5 | OPENAPI-001 — ChatGPT + Gemini spec | ⬜ väntar på #4 |
| 6 | PRICING-001 — Prissektion på sajten | ⬜ väntar på #3 |
| 7 | DASHBOARD-001 — Kund-dashboard | ⬜ |
| 8 | MEMORY-001 — remember/recall/forget/profile API | ⬜ databas klar, kod saknas |
| 9 | MEMORY-002 — Auto-remember vid handoff | ⬜ väntar på #8 |
| 10 | MEMORY-003 — Auto-recall vid session boot | ⬜ väntar på #8 |
| 11 | ENGRAMS-TEAM-001 — Team-plan (V2) | ⬜ planerad |
| 12 | CC-SUPABASE-MCP-001 — Koppla Supabase MCP till CC | ⬜ 2 min, Gustav kör |

**NÄSTA: #3 STRIPE-001** — kräver miljövariabler i Vercel först

---

## SENASTE BESLUT (2026-03-28)

- **Engrams = Styr.AI:s produkt.** När Supabase Pro köps: dedikerat Engrams-projekt, separeras från Styr.AI/TRADESYS
- **`session boot [projekt]`** — alla underprojekt har nu projektspecifik boot
- **Alla CLAUDE.md uppdaterade** — savage-roar, adminassistent, engrams, tradesys1337
- **Supabase MCP kör SQL autonomt** — Claude behöver inte fråga Gustav
- **Memory-arkitektur (4 typer):** profile (permanent) + context (projekt) + learning (semantisk) + episode (session) — parallell med hjärnans minnessystem

---

## TRADESYS — NULÄGE

- Agent 4: SECTOR_HOT (71.8% WR) — behöver omstart med ny kod
- Agent 6: SC_TREND (62.6% WR) — behöver omstart med ny kod
- ML v10 + bugfix live (BUY_BREAKOUT 68.8%)
- Marknadsregim: RISK-OFF
- squeeze-probability.js väntar på FMP $29/mån

**Öppna positioner:** Agent2: STRL/ETN/CAT/EME/PWR | Agent4: OXY/AGX/STRL/ETN/CAT | Agent5: ETN/PWR/EME | Agent6: COIN/NOC/RTX/HII/LMT

---

## SAVAGE ROAR / WARNER

- Frist 29 mars passerade — inget formellt svar (stärkt juridiskt läge)
- Audit §8.3: 22 april | Cure period: 22 maj | Min settlement: 200k SEK

---

## SYNC-ALIAS FÖR CC
```bash
alias sync='curl -s https://raw.githubusercontent.com/gustavkall/styr-ai/main/state/active_context.md'
```
