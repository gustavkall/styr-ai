# active_context.md — Delat whiteboard CC ↔ Claude.ai
*Uppdaterad: 2026-03-31 session handoff*

---

## SENASTE BESLUT FRÅN CLAUDE.AI — 2026-03-31
- Max-plan bekräftat — CC-sessioner är flat rate, ingen API-kostnad
- GitHub Actions-agenter (top-gainers, market-regime, memory-integrity) kör Sonnet — byt till Haiku sparar 80%
- #13 AGENT-HAIKU-001 lagd till i todo
- Handoff-protokoll nu symmetriskt: Claude.ai skriver active_context.md, CC skriver cc_session_log.md
- RS_MOMENTUM agent 3: 31.8% WR — stäng eller redesigna? Gustav avgör.

---

## ENGRAMS TODO

| # | Task | Status |
|---|------|--------|
| 1 | SQL-schema i Supabase | ✅ KLAR |
| 2 | Onboarding-mail till Anna | ⬜ väntar på #3 |
| 3 | STRIPE-001 — Betalning → nyckel | ⬜ kräver env vars i Vercel |
| 4 | MCP-CONNECTOR-001 | ⬜ |
| 5 | OPENAPI-001 | ⬜ väntar på #4 |
| 6 | PRICING-001 — Prissektion | ⬜ väntar på #3 |
| 7 | DASHBOARD-001 | ⬜ |
| 8 | MEMORY-001 — API-endpoints | ⬜ kod klar, saknar env vars |
| 9 | MEMORY-002 — Auto-remember | ⬜ väntar på #8 |
| 10 | MEMORY-003 — Auto-recall boot | ⬜ väntar på #8 |
| 11 | ENGRAMS-TEAM-001 (V2) | ⬜ planerad |
| 12 | CC-SUPABASE-MCP-001 | ⬜ 2 min, Gustav kör |
| 13 | AGENT-HAIKU-001 — Sonnet→Haiku | ⬜ NÄSTA för CC |

---

## ÖPPNA FRÅGOR FÖR CC
- #13 AGENT-HAIKU-001: byt `claude-sonnet-4` → `claude-haiku-4-5-20251001` i scripts/ i styr-ai repo
- RS_MOMENTUM agent 3: 31.8% WR — fråga Gustav om stäng eller redesigna
- ADD-VIX-FILTER-001 i tradesys work queue: kan stängas (vixElevated=0 redan live)

---

## TEKNISK STATE

**Engrams:** engrams.app live. lib/ + api/ klar. Saknar env vars i Vercel.
**TRADESYS:** SECTOR_HOT 58.1% WR. NBIS +36%, COIN +13%, PWR +3.9% aktiva.
**Warner:** Audit 22/4 (22 dagar). Cure 22/5. Min 200k SEK.

---

## SYNC-ALIAS FÖR CC
```bash
alias sync='curl -s https://raw.githubusercontent.com/gustavkall/styr-ai/main/state/active_context.md'
```
