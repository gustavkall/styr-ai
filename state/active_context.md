# active_context.md — Delat whiteboard CC ↔ Claude.ai
*Uppdaterad: 2026-03-28 FINAL EOD*

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

**NÄSTA: Gustav lägger till env vars i Vercel → Claude kör #3 + #8**

---

## TRADESYS — KRITISKT IMORGON

**TRAINER-COST-001** — agent-trainer.js anropar Anthropic API under träning och äter credits.
CC ska lösa detta FÖRST nästa session. Se tradesys1337/state/work_queue.md.

**Agent 4 + 6** — SECTOR_HOT + SC_TREND behöver omstart med ny kod.

---

## STYRNING

- GOVERNANCE.md live — grundlagar alla projekt följer (en ändring = gäller alla)
- PROJECT.md i alla 6 repos — projektidentitet, Supabase-ref, regler
- system_projects-tabell i Supabase — alla projekt registrerade
- Boot Steg 0: hämta GOVERNANCE.md + PROJECT.md före allt annat

---

## TEKNISK STATE

**Engrams:** engrams.app live. lib/ + api/ kod klar.
**Saknas i Vercel (engrams):** OPENAI_API_KEY, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, RESEND_API_KEY

**Warner:** Frist 29/3 passerade utan svar. Audit 22/4 (25 dagar). Cure 22/5. Min 200k SEK.

---

## SYNC-ALIAS FÖR CC
```bash
alias sync='curl -s https://raw.githubusercontent.com/gustavkall/styr-ai/main/state/active_context.md'
```
