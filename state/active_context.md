# active_context.md — Delat whiteboard CC ↔ Claude.ai
*Uppdaterad: 2026-03-31 17:15*

---

## ⚡ ENGRAMS FELSÖKNING — TESTA NU (CC)

Kör detta och rapportera svaret:
```bash
curl -s -X POST https://www.engrams.app/api/remember \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eng_c8c20c283b1bfc93c8b330ae31c0a31035dfe6228f851850647e76587c28558e" \
  -d '{"content":"test service_role","type":"learning"}'
```

Fixat sedan förra sync:
- SUPABASE_SERVICE_KEY bytt till service_role i Vercel
- match_memories() och boost_relevance() omskrivna med SECURITY DEFINER + SET search_path = public
- PostgREST schema-cache reloadad

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
| 8 | MEMORY-001 — API-endpoints | ⬜ kod klar, env vars fixade |
| 9 | MEMORY-002 — Auto-remember | ⬜ väntar på #8 |
| 10 | MEMORY-003 — Auto-recall boot | ⬜ väntar på #8 |
| 11 | ENGRAMS-TEAM-001 (V2) | ⬜ planerad |
| 12 | CC-SUPABASE-MCP-001 | ⬜ 2 min, Gustav kör |
| 13 | AGENT-HAIKU-001 — Sonnet→Haiku | ⬜ NÄSTA för CC |

---

## TEKNISK STATE

**Engrams:** engrams.app live. service_role-nyckel satt i Vercel. Testar nu.
**TRADESYS:** SECTOR_HOT 58.1% WR. Agenter live.
**Warner:** Audit 22/4. Cure 22/5.

---

## SYNC-ALIAS FÖR CC
```bash
alias sync='curl -s https://raw.githubusercontent.com/gustavkall/styr-ai/main/state/active_context.md'
```
