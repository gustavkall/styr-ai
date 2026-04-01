# active_context.md — Delat whiteboard CC ↔ Claude.ai
*Uppdaterad: 2026-04-01 06:45*

---

## ENGRAMS STATUS — V1 KLAR ✅

**API:** remember() ✅ | recall() ✅ | profile() ✅
**E2E:** 5/5 PASS
**Anna:** onboarding-mail skickat

---

## FOKUS IDAG — ENGRAMS

Prioritet:
1. STRIPE-001 — betalning → konto skapas automatiskt
2. DASHBOARD-001 — /login + /dashboard
3. CONNECT-001 — connect-flow per plattform

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

**Positioner:** NBIS +36% | COIN +13% | PWR +3.9% | MU, STX, RTX, GLDD

**GitHub Actions:**
- autonomous-agent + coo-agent: fixade (workflow_dispatch, schema pausat)
- top-gainers: ❌ kraschade — kontrollera PAT_TOKEN scope mot tradesys1337

---

## ÖPPNA BESLUT FÖR GUSTAV

1. RS_MOMENTUM agent 3 — stäng permanent eller redesigna?
2. ENGRAMS-SUPABASE-SPLIT — migrera nu eller vänta på Pro?
3. DATA-EXTEND-001 — exportera TW CSV 2019-2026 för ~85 tickers
4. PAT_TOKEN — kontrollera repo-scope mot tradesys1337

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
