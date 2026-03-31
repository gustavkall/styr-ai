# active_context.md — Delat whiteboard CC ↔ Claude.ai
*Uppdaterad: 2026-03-31*

---

## ENGRAMS TODO

| # | Task | Status |
|---|------|--------|
| 1 | SQL-schema i Supabase | ✅ KLAR |
| 2 | Onboarding-mail till Anna | ⬜ väntar på #3 |
| 3 | STRIPE-001 — Betalning → nyckel | ⬜ NÄSTA |
| 4 | MCP-CONNECTOR-001 | ⬜ |
| 5 | OPENAPI-001 | ⬜ väntar på #4 |
| 6 | PRICING-001 — Prissektion | ⬜ väntar på #3 |
| 7 | DASHBOARD-001 | ⬜ |
| 8 | MEMORY-001 — API-endpoints | ⬜ kod klar, saknar env vars |
| 9 | MEMORY-002 — Auto-remember | ⬜ väntar på #8 |
| 10 | MEMORY-003 — Auto-recall boot | ⬜ väntar på #8 |
| 11 | ENGRAMS-TEAM-001 (V2) | ⬜ planerad |
| 12 | CC-SUPABASE-MCP-001 | ⬜ 2 min, Gustav kör |

**NÄSTA: #3 kräver env vars i Vercel**

---

## TRADESYS — NULÄGE (uppdaterat från CC session 2026-03-31)

**SECTOR_HOT breakthrough:** WR 22% → 58.1% efter tre nya filter (relVolNorm>-0.3, vixElevated=0, adxNorm<0)
**Dataset:** 72,225 snapshots (+6,766 Finance+Defense)
**Agent 4:** omstartad med ny kod ✅

**Aktiva positioner:** NBIS +36% | COIN +13% | PWR +3.9% | MU, STX, RTX, GLDD

**Work queue #1:** RS-MOMENTUM-FIX-001 — agent 3 på 31.8% WR (under break-even)
**ADD-VIX-FILTER-001:** kan stängas — vixElevated=0 redan implementerat i SECTOR_HOT (DEC-015)

---

## STYRNING
- GOVERNANCE.md live | PROJECT.md i alla 6 repos | Boot Steg 0: GOVERNANCE + PROJECT

---

## WARNER
Audit 22/4 (22 dagar). Cure 22/5. Min 200k SEK.

---

## SYNC-ALIAS FÖR CC
```bash
alias sync='curl -s https://raw.githubusercontent.com/gustavkall/styr-ai/main/state/active_context.md'
```
