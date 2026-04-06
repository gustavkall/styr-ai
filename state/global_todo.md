# Global Todo — Alla Projekt
*Single source of truth. Läses vid varje session boot oavsett projekt.*
*Uppdateras av Claude.ai (CA) och CC vid session close. Gustav anger riktning — CA sköter prioritering.*
*Senast uppdaterad: 2026-04-07 — sync mot session_handoff 2026-04-03*

---

## PRIORITERING — PROJEKTORDNING

1. **ENGRAMS** — aktiv produkt, blocker för Anna och distribution
2. **TRADESYS** — körs parallellt av CC autonomt
3. **SAVAGE ROAR / WARNER** — nedprioriterat av Gustav, Gustav hanterar
4. **META / STYR-AI** — infrastruktur, körs vid behov

---

## ENGRAMS
*Mål: seamless multi-platform minnessystem.*

| # | Task | Status | Prio | Not |
|---|------|--------|------|-----|
| E8 | Anna onboarding — skicka mail | 🔄 VÄNTAR | **1** | Mail klart, Gustav godkänner tisdag 7 april |
| E9 | ENGRAMS-SUPABASE-SPLIT | ⬜ | **2** | Engrams delar DB med TradeSys. Separera när tillfälle ges. |
| E-BRAIN-ARCH-001 | Fas 2: Amygdala decay-agent | ⬜ GODKÄNNANDE | **3** | Sektion 3 klar. Väntar på Gustavs godkännande för CC deploy. |
| E-BRAIN-ARCH-002 | Fas 3: Striatum konsolidering | ⬜ | V2 | Bygg nu, aktivera vid 100+ minnen via feature flag |
| E-GITHUB-SECRET-001 | Sätt E2E_API_KEY i engrams repo secrets | ⬜ | **4** | Manuellt — Gustav gör |

### Klart (synkad 2026-04-07)
| E1 | SQL-schema + API endpoints | ✅ | | remember/recall/profile/load_project live |
| E2 | MCP-CONNECTOR-001 | ✅ | | Verifierad Claude.ai + CC |
| E3 | CC-VERIFY-001 | ✅ | | 5/5 e2e pass |
| E4 | ENGRAMS-RECALL-FIX | ✅ | | Threshold 0.3, 5/5 e2e pass |
| E5 | Multi-project support | ✅ | | project-parameter, get_or_create_project() |
| E6 | TERMINAL-ONBOARDING-001 | ✅ | | /api/claudemd live |
| E7 | OPENAPI-001 — ChatGPT Custom GPT Action | ✅ | | 5 actions verifierade: remember, recall, getProfile, setProfile, loadProject |
| E10 | STRIPE-001 — Betalning end-to-end | ✅ | | checkout, webhook, välkomstmail |
| E11 | PRICING-001 — Prissektion | ✅ | | live |
| E-USAGE-001 | usage_log-tabell + dashboard stats | ✅ | | live |
| E-MONITORING-001 | uptime.yml GitHub Actions | ✅ | | live |
| E-ONBOARDING-002 | 3-stegs wizard med verify | ✅ | | live |
| E-PUBLIC-DEMO-001 | Anonymt demo-läge på startsidan | ✅ | | live |

---

## TRADESYS
*Mål: konsekvent positiv EV per trade. Agenter kör autonomt.*

| # | Task | Status | Prio | Not |
|---|------|--------|------|-----|
| T-LIVE-VERIFY-001 | Kör live-performance-tracker.js | ⬜ | **1** | 42 PENDING trades i trade_outcomes. Måndag kväll. |
| MODEL-OPTIMIZER-001 | Implementera topp 5 agent-optimeringar | ⬜ GODKÄNNANDE | **2** | 77-84% WR möjligt. Väntar på CC-session + godkännande. |
| REGIME-DEPTH-001 | Multi-timeframe regime + dynamisk throttling | ⬜ | 3 | |
| EARNINGS-CAL-001 | Earnings-kalender via FMP | ⬜ | 4 | |
| MACRO-NEWS-001 | MT Newswires event classifier | ⬜ | 5 | |
| FUNDAMENTALS-001 | Alpha Vantage OVERVIEW helautomatiskt | ⬜ | 6 | |
| DATA-REGEN-001 | Regenerera training data med pearsonR_5d/10d | ⬜ | 7 | |
| T-GITHUB-SECRETS-001 | Sätt POLYGON_KEY + SUPABASE_URL + SUPABASE_ANON_KEY | ⬜ | **8** | Manuellt — Gustav gör |
| T2 | DATA-EXTEND-001 — TW CSV-export 2019-2026 | ⬜ | 9 | ~85 tickers. Kräver Gustav. |
| T4 | FMP-LIVE-001 — Short float live | ⬜ | 10 | Väntar på Gustav: FMP Starter $29/mån |

### Klart (synkad 2026-04-07)
| TX1 | AGENT-HAIKU-001 | ✅ | | Alla agenter kör Haiku |
| TX2 | Agent 4+6 omstart | ✅ | | Nya filter live |
| TX3 | vixElevated filter | ✅ | | Live |
| T-WATCHLIST-SCORE-REFORM | Fas 1-3 watchlist score + layout redesign | ✅ | | Live 2026-04-03 |
| T-LIVE-PERF-001 | Live performance tracker | ✅ | | 42 trades PENDING |
| T-LIVE-CRITERIA-001 | docs/go_live_criteria.md | ✅ | | |
| T-REGIME-ALERT-001 | Intradag VIX-alert var 30 min | ✅ | | |

---

## SAVAGE ROAR / WARNER
*Nedprioriterat av Gustav. Gustav hanterar personligen. CA bevakar deadlines passivt.*

| # | Task | Status | Not |
|---|------|--------|-----|
| W1 | Warner audit §8.3 — 22 april | 🔄 NEDPRIO | 15 dagar kvar. Gustav hanterar. |
| W2 | Settlement-strategi — min 200k SEK | 🔄 NEDPRIO | Cure period t.o.m. 22 maj. |
| W3 | Believe-förhandling | 🔄 NEDPRIO | Pausad pga Warner-processen. |

---

## META / STYR-AI

| # | Task | Status | Prio | Not |
|---|------|--------|------|-----|
| S4 | PAT_TOKEN scope mot tradesys1337 | ⬜ | 1 | top-gainers-agent failar |
| S5 | styrai-product repo — radera? | ⬜ | 2 | Rekommendation: ja |

### Klart
| S1 | GOVERNANCE.md | ✅ | | |
| S2 | Bidirektionell sync CC ↔ Claude.ai | ✅ | | |
| S3 | GLOBAL-TODO-001 | ✅ | | |
| S6 | work_queue.md borttagen | ✅ | | |

---

## ÖPPNA BESLUT (Gustav)

| # | Fråga | Kontext |
|---|-------|--------|
| D1 | Anna-mail — godkänn och skicka? | Tisdag 7 april = idag |
| D2 | E-BRAIN-ARCH-001 — godkänn Fas 2 deploy? | Sektion 3 klar, CC redo |
| D3 | MODEL-OPTIMIZER-001 — godkänn CC-session? | 77-84% WR på bord |
| D4 | GitHub Secrets — sätt manuellt? | Engrams + Tradesys-models |
| D5 | ACT 3.0 / Rickard Ekberg — skicka draft? | Kommunalstyrelsen onsdag |
| D6 | DATA-EXTEND-001 — exportera TW CSV? | ~85 tickers |
| D7 | FMP Starter $29/mån — go/no-go? | Låser upp short float live |

---

## INSTRUKTIONER FÖR AGENTER

- Läs denna fil vid boot. Rapportera aktiva ⬜-tasks per projekt i prioritetsordning.
- Uppdatera ⬜→✅ vid close. Lägg till nya tasks direkt när de uppstår.
- Gustav anger riktning verbalt — CA översätter till prioritet och skriver hit. Verbala instruktioner som inte committats är förlorade.
- work_queue.md existerar inte längre.
