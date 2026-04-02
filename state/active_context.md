# active_context.md
*Uppdaterad: 2026-04-02 CC final handoff*
*Boot-data hämtas från Supabase (crsonxfrylkpgrddovhu). Denna fil är sekundär referens.*

---

## SUPABASE ÄR SSOT

Boot-protokoll: se CLAUDE.md steg 1 (SQL-queries mot crsonxfrylkpgrddovhu).

---

## CC SESSION 2026-04-02 — SAMMANFATTNING

### Klart idag
- **E9** SUPABASE-SPLIT — Engrams separerat från TradeSys
- **E12** DASHBOARD — login, projects, memory viewer, setup, commands tabbar
- **E13** CONNECT-FLOW — per-plattform setup i dashboard
- **S5** Gamla repos städade
- **Infrastruktur:** commands.json SSOT, docs refaktorerad, Supabase Auth, Resend SMTP, Vercel CLI, go-alias

### Nya filer i engrams-repot
login.html, dashboard.html, api/dashboard.js, api/load_project.js, data/commands.json, docs/openapi.yaml, docs/architecture-teams-v2.md

### Arkitekturbeslut
- commands.json = SSOT för alla Engrams-commands
- Session boot/handoff/sync = styr-ai, INTE Engrams-features
- Magic link auth, Resend SMTP (hello@engrams.app)
- Teams V2 plan skriven — E17/E18/E19 registrerade

---

## NÄSTA

### CA
1. Full content/UX-review: engrams.app, /login, /dashboard, /docs
2. Skriv detaljerad spec för E17 Teams V2
3. E8 Anna onboarding — väntar på polerad produkt

### CC
1. Implementera CA:s UX-feedback
2. E10 STRIPE — väntar på Gustav (Stripe-konto)
3. E8 Anna onboarding

---

## TEKNISK STATE

**Dashboard:** https://www.engrams.app/dashboard
**Docs:** https://www.engrams.app/docs
**API:** /api/remember /api/recall /api/profile /api/load_project /api/dashboard /api/mcp
**ChatGPT GPT:** https://chatgpt.com/g/g-69cd232e3d488191af492dc12a9931f1-engrams
**Auth:** Supabase Auth + Resend (hello@engrams.app)
**Engrams DB:** crsonxfrylkpgrddovhu | **TradeSys DB:** hxikaojzwjtztyuwlxra
