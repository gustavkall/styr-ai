# active_context.md — Delat whiteboard CC ↔ Claude.ai
*Uppdateras av Claude.ai vid varje beslut. Läses av CC vid boot och vid `sync`.*
*Senast uppdaterad: 2026-03-28 av Claude.ai*

---

## NULÄGE — 2026-03-28

### Gjort denna session
- CC↔Claude.ai bidirektionellt sync-protokoll byggt och live
- `state/active_context.md` + `state/cc_session_log.md` skapade
- CLAUDE.md uppdaterad i styr-ai + tradesys1337 med sync-protokoll
- **Engrams** — produktnamn beslutat, domän engrams.app köpt (180 kr)
- `gustavkall/engrams` repo skapat, landningssida + waitlist-API pushat
- Vercel + DNS live, waitlist-tabell i styr-ai Supabase-projekt

### Öppna uppgifter kvar idag
- MULTI-PROJECT-001 — SQL migration i Supabase (blockerare för Anna + Stripe)
- FMP Starter $29/mån — låser upp short interest
- Warner-frist 29 mars imorgon — inga fler åtgärder beslutade

---

## ENGRAMS — NULÄGE

- **Produkt:** AI memory for founders
- **Live:** https://engrams.app
- **Repo:** gustavkall/engrams
- **Supabase:** styr-ai projektet (hxikaojzwjtztyuwlxra) — waitlist-tabell
- **Stack:** Static HTML + Vercel serverless API
- **Status:** Landningssida live, waitlist aktiv
- **Nästa:** MULTI-PROJECT-001 → Anna onboarding → Stripe → MCP-register

---

## PRIO-ORDNING NÄSTA STEG

1. **MULTI-PROJECT-001** — SQL migration i Supabase (blockerare för Anna + Stripe)
   - Se `project_memory/architecture/multi_project_design.md` i styr-ai
   - Anna-draft i Gmail (ID: r5404878031968918972) — SKICKA EJ förrän klar

2. **ENGRAMS-STRIPE-001** — Stripe-integration, självbetjäning

3. **ENGRAMS-MCP-REGISTER** — Ansök till Anthropics MCP-register (kräver stabil domän ✅)

4. **FMP Starter $29/mån** — https://financialmodelingprep.com/pricing

---

## TRADESYS — AKTIVT NULÄGE

- ML-modell v10 live, 69% BREAKOUT precision
- 6 ShadowBot-agenter aktiva
- squeeze-probability.js live (short interest väntar FMP)
- Marknadsregim: RISK-OFF (SPY $656.82, VIXY $33.21)

**Öppna positioner:**
- Agent2: STRL, ETN, CAT, EME, PWR
- Agent4: OXY, AGX, STRL, ETN, CAT (AGX inne @ $541)
- Agent5: ETN, PWR, EME
- Agent6: COIN, NOC, RTX, HII, LMT

---

## SAVAGE ROAR / WARNER — KRITISKT

- Frist 29 mars passerar IMORGON utan formellt svar
- Mattias uppskattning 60k SEK — avvisat, minimum 200k SEK
- Audit §8.3 startar 22 april (25 dagar)
- Jennie Runnedahl = primär juridisk kontakt (jennie.runnedahl@warnermusic.com)
- Believe-förhandling blockerad av Warner-processen

---

## STYRAI-PRODUCT (nu: Engrams)

- MCP-server live: https://app.savageroar.se/api/mcp
- Bearer: e5a93009-8ad9-4b44-9f6f-840d9c8c32da
- VERIFY-001 ✅, PROTOCOL-001 ✅, DOMAIN-001 ✅
- MULTI-PROJECT-001 = nästa blockerare

---

## SYNC-ALIAS FÖR CC

```bash
alias sync='curl -s https://raw.githubusercontent.com/gustavkall/styr-ai/main/state/active_context.md'
```
