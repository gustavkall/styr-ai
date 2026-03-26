# styr-ai — SESSION HANDOFF
*Session close: 2026-03-26*

---

## DENNA SESSION

### Byggt
- styrAI-product repo skapad och deployad på Vercel (project-b786o.vercel.app)
- Supabase schema: projects, sessions, decisions, learnings, embeddings + pgvector
- MCP-server live med 6 verktyg: read_memory, write_session, log_decision, log_learning, search_memory, get_status
- RLS policies fixade (service role access)
- OpenAI embeddings aktiva (text-embedding-3-small)
- Testat live — 5/5 verktyg fungerar
- Test-projekt provisionerat (API-nyckel: e5a93009-8ad9-4b44-9f6f-840d9c8c32da)
- fetch-state.js MARKNADSREGIM-bug fixad i tradesys1337
- Teknisk spec committad: product/TECHNICAL_SPEC.md
- Konkurrensanalys gjord: Mem0 ($24M Series A) är närmaste konkurrent
- Whitepaper v2.0 läst och analyserat — arkitektur validerad

### Beslut
- styr-ai (meta-system) och styrAI-product (produkt) är separata repos
- Managed Supabase hos Gustav — inte self-hosted per kund
- OpenAI för embeddings (inte Anthropic — saknar embeddings-API)
- MCP-server är leveransmekanismen, inte REST-sajt
- Warner-tvist hanteras personligen av Gustav — inte systemuppgift
- MODEL-002 (scanner-labels) och MODEL-003 (EPS surprise) bekräftat byggda
- AdminAssistent tas upp på Gustavs initiativ — lågprio

### Fas-status (styrAI-product)
- **Fas 1:** ✅ KLAR — MCP-server live, 6 verktyg, embeddings, kund #1 provisionerad
- **Fas 2:** 🔲 NÄSTA — Sajt, setup-guide, dashboard
- **Fas 3:** 🔲 VÄNTANDE — Stripe, självbetjäning (efter 3-5 kunder)
- **Fas 4:** 🔲 VÄNTANDE — MCP-register, npm-paket, distribution

---

## NÄSTA SESSION

### Prioritet 1 — Fas 2: Sajt och onboarding
- Landningssida med riktig copy (inte placeholder)
- Setup-guide: steg-för-steg, max 10 min från noll till fungerande
- Dashboard: read-only vy för kund (senaste session, beslut, learnings)
- Domän: styr.ai är tagen — kolla usestyr.ai, trystyr.ai, styr-ai.com

### Prioritet 2 — Onboarda kund #1
- Skicka API-nyckel + CLAUDE.md-template
- Verifiera att kunden är live
- Samla feedback

### Prioritet 3 — TRADESYS MODEL-004
- Implementera BUY/WAIT-ekvationer i dashboard (calcBuyScore5d, calcWaitScore5d)

---

## KRITISKA DATUM
- **22 maj 2026:** Warner cure period — Gustav hanterar personligen
