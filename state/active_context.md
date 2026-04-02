# active_context.md
*Uppdaterad: 2026-04-02 CC session handoff (komplett)*
*Boot-data hämtas från Supabase (crsonxfrylkpgrddovhu). Denna fil är sekundär referens.*

---

## SUPABASE ÄR SSOT

Alla tasks, beslut, sessioner och state läses från Supabase — inte från GitHub-filer.
Boot-protokoll: se CLAUDE.md steg 1 (SQL-queries mot crsonxfrylkpgrddovhu).

---

## VAD CC BYGGT IDAG (2026-04-02)

### E9 SUPABASE-SPLIT — KLAR
- Engrams-tabeller migrerade från TradeSys till Styr.AI (crsonxfrylkpgrddovhu)
- Functions återskapade, pgvector flyttad till public schema
- Vercel env vars uppdaterade via CLI, TradeSys rensat

### E12 DASHBOARD-001 — KLAR
- login.html: magic link auth via Supabase Auth + Resend SMTP (hello@engrams.app)
- dashboard.html: Projects | Setup | Commands tabbar
- Memory viewer: lista, semantisk sökning, radera per minne
- api/dashboard.js: authenticated API med ownership-verifiering + RLS

### E13 CONNECT-001 — KLAR
- Setup-tab i dashboard: Claude MCP, Terminal, ChatGPT, Cursor
- Instruktionsblock populeras med användarens API-nyckel

### Infrastruktur
- data/commands.json: SSOT för alla Engrams-commands
- docs/index.html: refaktorerad att läsa från commands.json
- S5 klar: gamla repos städade
- Shell alias: go/go engrams/go tradesys

### Nya filer i engrams-repot
```
login.html, dashboard.html, api/dashboard.js, api/load_project.js
data/commands.json, docs/openapi.yaml
```

### Arkitekturbeslut
- Session boot/handoff/sync = styr-ai workflows, INTE Engrams-produkt-features
- commands.json = SSOT — uppdatera där → docs + dashboard uppdateras
- Magic link auth (inte password)
- Engrams DB i crsonxfrylkpgrddovhu, TradeSys i hxikaojzwjtztyuwlxra (separerade)

---

## NÄSTA FÖR CA

1. **Full content/UX-review** av engrams.app — startsida, /login, /dashboard (alla tabbar), /docs
2. Granska: texter tydliga för första användare? Flöde logiskt? Saknas något?
3. Uppdatera commands.json om innehållet behöver justeras
4. E8 Anna onboarding — väntar tills produkt polerad

## NÄSTA FÖR CC

1. Väntar på CA:s UX-review → implementera feedback
2. E10 STRIPE-001 — betalning (kräver Gustav: Stripe-konto)
3. E8 Anna onboarding

---

## TEKNISK STATE

**Engrams API:** live, /api/remember /api/recall /api/profile /api/load_project /api/dashboard /api/mcp
**ChatGPT GPT:** https://chatgpt.com/g/g-69cd232e3d488191af492dc12a9931f1-engrams
**Dashboard:** https://www.engrams.app/dashboard (login krävs)
**Docs:** https://www.engrams.app/docs
**Styr.AI Supabase:** crsonxfrylkpgrddovhu — styr_* + engrams-tabeller
**TradeSys Supabase:** hxikaojzwjtztyuwlxra — bara trading
**Auth:** Supabase Auth, magic link, SMTP via Resend (hello@engrams.app)
