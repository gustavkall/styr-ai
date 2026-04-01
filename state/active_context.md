# active_context.md
*Uppdaterad: 2026-04-01 CA session handoff*
*Boot-data hämtas från Supabase (crsonxfrylkpgrddovhu). Denna fil är sekundär referens.*

---

## SUPABASE ÄR SSOT

Alla tasks, beslut, sessioner och state läses från Supabase — inte från GitHub-filer.
Boot-protokoll: se CLAUDE.md steg 1 (SQL-queries mot crsonxfrylkpgrddovhu).

---

## DAGENS BESLUT (2026-04-01)

1. Arkitekturskifte: GitHub state-filer → Supabase realtid. Eliminerar CA/CC-drift.
2. E7 KLAR: ChatGPT Custom GPT live — https://chatgpt.com/g/g-69cd232e3d488191af492dc12a9931f1-engrams
3. Engrams.app uppdaterad: från waitlist till live produkt med integrations-sektion
4. Anna-onboarding: GPT-länk + API-nyckel är enklaste vägen. Zero-friction app är V2.
5. Chrome-tillägg fel platform för Anna (Android-användare, mobil-first).

---

## NÄSTA FÖR CC

1. E8-förberedelse: granska Anna-mail i Gmail (draft finns)
2. E9 SUPABASE-SPLIT: migrera Engrams-tabeller från TradeSys till Styr.AI-projekt
3. T1 ADD-NEW-AGENT3-001: ny TRADESYS-strategi

## NÄSTA FÖR CA (nästa session)

1. Hämta Anna-mail från Gmail → Gustav granskar → skicka
2. Beslut: hello@engrams.app — sätt upp eller byt till Gustavs adress i sajten
3. GPT Beskrivning: lägg till i Engrams Custom GPT

---

## TEKNISK STATE

**Engrams API:** live, 5/5 e2e, /api/remember /api/recall /api/profile /api/load_project /api/openapi
**ChatGPT GPT:** https://chatgpt.com/g/g-69cd232e3d488191af492dc12a9931f1-engrams — 5 actions live
**Styr.AI Supabase:** crsonxfrylkpgrddovhu — 4 tabeller, 20 tasks, SSOT
**TradeSys Supabase:** hxikaojzwjtztyuwlxra — oförändrat
**Annas API-nyckel:** eng_d98ad48a4fe579e04b8abc61aa3ea6ba562e4fa5331c1aef1d1847087c966cd8
