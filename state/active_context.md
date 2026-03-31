# active_context.md — Delat whiteboard CC ↔ Claude.ai
*Uppdaterad: 2026-03-31 19:55 — session handoff*

---

## NULÄGE — ENGRAMS

**Status:** API live men ej fullt fungerande. 4/5 e2e-tester passerar.

**Rotproblem kvarstår:**
- `SUPABASE_SERVICE_KEY` i Vercel pekade på fel Supabase-projekt (Styr.AI istf TradeSys)
- CC fixade: rätt nyckel + `.replace(/\s/g, '')` sanitering i API-filerna
- Men: Runtime-loggar visar fortfarande 500 på `/api/remember` — oklart om CC:s fix är deployad
- `recall()` returnerar 0 minnen (search-relevance/embedding-threshold, ej infra)

**Öppen fråga — prioritet 1 imorgon:**
Kör e2e-test och verifiera att remember() returnerar `{ok:true, id:"..."}`. Om ej — kolla Vercel runtime logs.

**Anna Garmen:** Onboarding-mail ej skickat. Väntar på att API fungerar.

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

**Aktiva positioner:** NBIS +36% | COIN +13% | PWR +3.9% | MU, STX, RTX, GLDD

---

## ENGRAMS TODO (master)

| # | Task | Status |
|---|------|--------|
| 1 | SQL-schema i Supabase | ✅ KLAR |
| 2 | Onboarding-mail till Anna | ⬜ väntar på API-fix |
| 3 | STRIPE-001 — Betalning → nyckel | ⬜ |
| 4 | MCP-CONNECTOR-001 | ⬜ |
| 5 | OPENAPI-001 | ⬜ |
| 6 | PRICING-001 — Prissektion | ⬜ |
| 7 | DASHBOARD-001 | ⬜ |
| 8 | MEMORY-001 — API-endpoints | ⬜ kod klar, env var-fix deployad |
| 9 | MEMORY-002 — Auto-remember | ⬜ väntar på #8 |
| 10 | MEMORY-003 — Auto-recall boot | ⬜ väntar på #8 |
| 11 | ENGRAMS-TEAM-001 (V2) | ⬜ |
| 12 | CC-SUPABASE-MCP-001 | ⬜ |
| 13 | AGENT-HAIKU-001 | ⬜ |
| — | ENGRAMS-RECALL-FIX | ⬜ recall() 0 minnen |
| — | ENGRAMS-SUPABASE-SPLIT | ⬜ migrera från TradeSys-projekt |

---

## TRADESYS WORK QUEUE

1. ADD-NEW-AGENT3-001 — Ny strategi agent 3 (RISK-OFF bounce, creditStress corr=0.480)
2. DATA-EXTEND-001 — 85 tickers behöver TW-export 2019-2026 (56 st har bara 1 år)
3. MODEL-SCOREBOARD-001 — Precision-scoreboard v5-v10

---

## ÖPPNA BESLUT FÖR GUSTAV

1. **RS_MOMENTUM agent 3** — 31.8% WR. Stäng permanent eller redesigna med RISK-OFF bounce?
2. **ENGRAMS-SUPABASE-SPLIT** — Migrera Engrams-tabeller till Styr.AI-projektet (crsonxfrylkpgrddovhu) nu eller vänta på Supabase Pro?
3. **DATA-EXTEND-001** — Exportera TW CSV 2019-2026 för ~85 tickers (CC väntar på datan)

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
