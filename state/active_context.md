# active_context.md — Delat whiteboard CC ↔ Claude.ai
*Uppdaterad: 2026-03-31 20:15 — session handoff*

---

## PRIORITET 1 IMORGON — ENGRAMS-RECALL-FIX

remember() fungerar (200 OK). recall() returnerar 0 minnen.
Trolig orsak: embedding-likhetströskel för hög (0.75) eller pgvector-index saknas.
Fix: sänk threshold till 0.3 i recall.js, testa. Om ej — kontrollera att ivfflat-index finns på memory_items.embedding.

När recall fungerar → skicka onboarding-mail till Anna direkt.

---

## NULÄGE — ENGRAMS

**API:** remember() ✅ | recall() ❌ 0 minnen | profile() ✅
**Vercel:** production READY (service_role-nyckel satt)
**Supabase:** hxikaojzwjtztyuwlxra (delar med TradeSys)
**Sajt:** uppdaterad till platform-agnostic copy (Claude · ChatGPT · Cursor · Gemini)

**Anna Garmen:** konto skapat, API-nyckel klar, onboarding-draft i Gmail. Väntar på recall-fix.

---

## NULÄGE — TRADESYS

| Agent | Strategi | WR | Status |
|-------|----------|----|--------|
| 1 | BREAKOUT | — | Kör |
| 2 | VIX_SWING+EARNINGS | — | Kör |
| 3 | RS_MOMENTUM | 31.8% | STÄNGD |
| 4 | SECTOR_HOT | 58.1% | Kör |
| 5 | SECTOR_CONTAGION | 47.7% | Kör |
| 6 | SC_TREND | 75.9% | Kör |

**Positioner:** NBIS +36% | COIN +13% | PWR +3.9% | MU, STX, RTX, GLDD aktiva

---

## ÖPPNA BESLUT FÖR GUSTAV

1. **RS_MOMENTUM agent 3** — 31.8% WR. Stäng permanent eller redesigna med RISK-OFF bounce?
2. **ENGRAMS-SUPABASE-SPLIT** — Migrera Engrams till eget Supabase-projekt nu eller vänta på Pro?
3. **DATA-EXTEND-001** — Exportera TW CSV 2019-2026 för ~85 tickers när du har tid

---

## TEKNISKA IDENTIFIKATORER

- Supabase TradeSys: hxikaojzwjtztyuwlxra
- Supabase Styr.AI: crsonxfrylkpgrddovhu
- Vercel engrams: prj_oQk5XQfJmBLJy70FIgApFJZnlHBZ
- Vercel team: team_pp2fvMpvzRPz7AfSGFMVttPs
- Anna API-nyckel: eng_d98ad48a4fe579e04b8abc61aa3ea6ba562e4fa5331c1aef1d1847087c966cd8
- E2E test-nyckel: eng_c8c20c283b1bfc93c8b330ae31c0a31035dfe6228f851850647e76587c28558e

---

## SYNC-ALIAS FÖR CC
```bash
alias sync='curl -s https://raw.githubusercontent.com/gustavkall/styr-ai/main/state/active_context.md'
```
