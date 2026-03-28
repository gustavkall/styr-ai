# active_context.md — Delat whiteboard CC ↔ Claude.ai
*Uppdateras av Claude.ai vid varje beslut. Läses av CC vid boot och vid `sync`.*
*Senast uppdaterad: 2026-03-28 av Claude.ai*

---

**SYNC-TEST: Om du ser detta fungerar CC↔Claude.ai-synken. 2026-03-28**

---

## NULÄGE — 2026-03-28

### Vad vi just diskuterat (Claude.ai)
Bidirektionellt sync-protokoll designat och implementerat. Problemet var:
- CC läste inte state vid boot automatiskt
- CC skrev inte till state vid handoff automatiskt
- Claude.ai hade inget ställe att skriva realtidsbeslut som CC kan läsa

Lösning implementerad nu:
- `state/active_context.md` (denna fil) — Claude.ai skriver hit, CC läser
- `state/cc_session_log.md` — CC skriver dit, Claude.ai läser vid boot
- Alias `sync` i CC för att hämta kontext under aktiv session

---

## PRIO-ORDNING IDAG

1. **MULTI-PROJECT-001** — SQL migration i Supabase (blockerare för Anna + Stripe)
   - Se `project_memory/architecture/multi_project_design.md` i styr-ai
   - Anna-draft i Gmail (ID: r5404878031968918972) — SKICKA EJ förrän klar

2. **CC-SYNC-001** — Nu implementerat. Klistra in alias i CC (se nedan)

3. **FMP Starter $29/mån** — https://financialmodelingprep.com/pricing
   - Låser upp short interest i squeeze-probability.js

4. **MarketData.app** — testa gratis options flow
   - GET /v1/options/chain/AGX/?token=KEY

5. **STYRAI-NAME-001** — Besluta produktnamn (Engram / Exocortex / Axon / Mnemo)

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

## STYRAI-PRODUCT

- Live: https://app.savageroar.se
- MCP-endpoint: https://app.savageroar.se/api/mcp
- Bearer: e5a93009-8ad9-4b44-9f6f-840d9c8c32da
- VERIFY-001 ✅, PROTOCOL-001 ✅, DOMAIN-001 ✅
- MULTI-PROJECT-001 = nästa blockerare

---

## FÖR AKTIV CC-SESSION — KÖR DETTA NU

```bash
curl -s https://raw.githubusercontent.com/gustavkall/styr-ai/main/state/active_context.md
```

Alias (lägg till i ~/.zshrc):
```bash
alias sync='curl -s https://raw.githubusercontent.com/gustavkall/styr-ai/main/state/active_context.md'
```
