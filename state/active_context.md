# active_context.md — Delat whiteboard CC ↔ Claude.ai
*Uppdaterad: 2026-03-29 session boot*

---

## ✅ SYNC-TEST — 2026-03-29
**CC: Kör `sync` och bekräfta att du ser denna rad. Rapportera tillbaka till Gustav.**

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

**NÄSTA: #3 STRIPE-001 (kräver env vars i Vercel)**

---

## TRADESYS — NULÄGE

- TRAINER-COST-001: stängd — falskt alarm, inga API-anrop i trainer
- Agent 4 (SECTOR_HOT) + Agent 6 (SC_TREND) — behöver omstart med ny kod
- SECTOR-HOT-001 är nu #1 i work queue

---

## STYRNING

- GOVERNANCE.md live — grundlagar alla projekt
- PROJECT.md i alla 6 repos
- system_projects i Supabase
- Boot Steg 0: GOVERNANCE.md + PROJECT.md

---

## TEKNISK STATE

**Engrams:** engrams.app live. lib/ + api/ klar. Saknar env vars i Vercel.
**Warner:** Audit 22/4 (24 dagar). Cure 22/5. Min 200k SEK.

---

## SYNC-ALIAS FÖR CC
```bash
alias sync='curl -s https://raw.githubusercontent.com/gustavkall/styr-ai/main/state/active_context.md'
```
