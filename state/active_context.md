# active_context.md
*Uppdaterad: 2026-04-02 CA sync från CC-session*
*Boot-data hämtas från Supabase (crsonxfrylkpgrddovhu). Denna fil är sekundär referens.*

---

## SUPABASE ÄR SSOT

Alla tasks, beslut, sessioner och state läses från Supabase — inte från GitHub-filer.
Boot-protokoll: se CLAUDE.md steg 1 (SQL-queries mot crsonxfrylkpgrddovhu).

---

## DAGENS PROGRESS (2026-04-02)

### Klart (CC)
- **E9 ✅ SUPABASE-SPLIT** — Engrams-tabeller migrerade från TradeSys (hxikaojzwjtztyuwlxra) till Styr.AI (crsonxfrylkpgrddovhu). Alla endpoints verifierade. TradeSys rensat.
- **S5 ✅ Gamla repos städade** — styrAI-product arkiverat, styr.ai raderat av Gustav
- **E7 ✅ ChatGPT Action** — klar sedan igår, live

### Arkitektur — bekräftad
- `gustavkall/engrams` = Engrams produktrepo (live på engrams.app via Vercel)
- `gustavkall/styr-ai` = meta-system, state-filer, agenter
- `gustavkall/styrAI-product` = arkiverat, irrelevant
- Engrams Supabase: `crsonxfrylkpgrddovhu` (Styr.AI projekt)
- TradeSys Supabase: `hxikaojzwjtztyuwlxra` — nu rent, bara trading-tabeller

### Öppna beslut (Gustav)
- **E12/E13** — CC bygger dashboard + connect-flow. Stack: static HTML + Supabase Auth (magic link). Gustav bekräftad.
- **E10 Stripe** — Gustav sätter upp Stripe-konto. CC väntar på nycklar.
- **Anna-mail (E8)** — väntar på E12/E13 (dashboard klart → skicka)
- **D1 Agent 3** — stäng RS_MOMENTUM (31.8% WR) eller redesigna?

---

## NÄSTA FÖR CC

1. **E12** — Bygga dashboard.html (Supabase Auth magic link, projektsida, API-nyckel, minnesanvändning)
2. **E13** — Utöka start.html med connect-flow per plattform

## NÄSTA FÖR CA

1. Bevaka E12/E13-progress från CC
2. Warner: audit §8.3 startar 22 april — 20 dagar kvar
3. Session handoff vid dagens slut

---

## TEKNISK STATE

**Engrams API:** live, 5/5 e2e — /api/remember /api/recall /api/profile /api/load_project /api/openapi
**Engrams Supabase:** crsonxfrylkpgrddovhu — separerat från TradeSys, rent schema
**ChatGPT GPT:** https://chatgpt.com/g/g-69cd232e3d488191af492dc12a9931f1-engrams — 5 actions live
**TradeSys Supabase:** hxikaojzwjtztyuwlxra — oförändrat, bara trading
**Annas API-nyckel:** eng_d98ad48a4fe579e04b8abc61aa3ea6ba562e4fa5331c1aef1d1847087c966cd8
**Env vars saknas i Vercel:** STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, RESEND_API_KEY
