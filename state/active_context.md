# active_context.md — Delat whiteboard CC ↔ Claude.ai
*Uppdaterad: 2026-03-28 FINAL*

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

**NÄSTA: Gustav lägger till env vars i Vercel, sedan #3 + #8**

---

## STYRNING (nytt idag)

- GOVERNANCE.md live — grundlagar alla projekt följer
- PROJECT.md i alla 6 repos — projektidentitet + regler
- system_projects-tabell i Supabase — alla projekt registrerade
- Boot Steg 0: hämta GOVERNANCE.md + PROJECT.md före allt annat

---

## TEKNISK STATE

**Engrams:** engrams.app live. lib/ + api/ kod klar. Saknar env vars i Vercel.
**TRADESYS:** Agent 4+6 behöver omstart. FMP $29/mån väntar.
**Warner:** Frist passerade, inget svar. Audit 22/4. Cure 22/5.

---

## SYNC-ALIAS FÖR CC
```bash
alias sync='curl -s https://raw.githubusercontent.com/gustavkall/styr-ai/main/state/active_context.md'
```
