# Global Todo — Alla Projekt
*Single source of truth. Läses vid varje session boot oavsett projekt.*
*Uppdateras av Claude.ai (CA) och CC vid session close. Gustav anger riktning — CA sköter prioritering.*
*Senast uppdaterad: 2026-04-01 — Gustavs beslut absorberade*

---

## PRIORITERING — PROJEKTORDNING

1. **ENGRAMS** — aktiv produkt, blocker för Anna och distribution
2. **TRADESYS** — körs parallellt av CC autonomt
3. **SAVAGE ROAR / WARNER** — nedprioriterat av Gustav, Gustav hanterar
4. **META / STYR-AI** — infrastruktur, körs vid behov

---

## ENGRAMS
*Mål: seamless multi-platform minnessystem. Prio: ChatGPT-integration före Anna-onboarding.*

| # | Task | Status | Prio | Not |
|---|------|--------|------|-----|
| E7 | OPENAPI-001 — ChatGPT Custom GPT Action | ⬜ | **1** | Blockerare för Anna. Auto-remember kräver Actions. CC bygger. |
| E8 | Anna onboarding — skicka mail | 🔄 VÄNTAR | **2** | Väntar på E7. Mail klart. Gustav godkänner när ChatGPT-integration live. |
| E9 | ENGRAMS-SUPABASE-SPLIT | ⬜ | **3** | Engrams delar DB med TradeSys. Separera när tillfälle ges. |
| E10 | STRIPE-001 — Betalning | ⬜ | 4 | Saknar env vars i Vercel |
| E11 | PRICING-001 — Prissektion | ⬜ | 5 | |
| E12 | DASHBOARD-001 — Inloggning + projektsida | ⬜ | 6 | |
| E13 | CONNECT-001 — Connect-flow per plattform | ⬜ | 7 | Väntar på E12 |
| E14 | GEMINI-NATIVE-001 | ⬜ | V2 | Sandbox blockerar. Lägre prio än ChatGPT. |
| E15 | MEMORY-FORGETTING-001 | ⬜ | V2 | |
| E16 | MEMORY-CONSOLIDATION-001 | ⬜ | V2 | |

### Klart
| E1 | SQL-schema + API endpoints | ✅ | | remember/recall/profile/load_project live |
| E2 | MCP-CONNECTOR-001 | ✅ | | Verifierad Claude.ai + CC |
| E3 | CC-VERIFY-001 | ✅ | | 5/5 e2e pass |
| E4 | ENGRAMS-RECALL-FIX | ✅ | | Threshold 0.3, 5/5 e2e pass |
| E5 | Multi-project support | ✅ | | project-parameter, get_or_create_project() |
| E6 | TERMINAL-ONBOARDING-001 | ✅ | | /api/claudemd live |

---

## TRADESYS
*Mål: konsekvent positiv EV per trade. Agenter kör autonomt. CA/CC hanterar modell och infrastruktur.*

| # | Task | Status | Prio | Not |
|---|------|--------|------|-----|
| T1 | ADD-NEW-AGENT3-001 — Ny strategi agent 3 | ⬜ | **1** | Kandidat: RISK-OFF bounce (creditStress corr=0.480). Gustav beslutar: redesigna eller stäng. |
| T2 | DATA-EXTEND-001 — TW CSV-export 2019-2026 | ⬜ | **2** | ~85 tickers. Kräver Gustav. |
| T3 | MODEL-SCOREBOARD-001 — Precision v5-v10 | ⬜ | **3** | CC kör autonomt. |
| T4 | FMP-LIVE-001 — Short float live | ⬜ | 4 | Väntar på Gustav: FMP Starter $29/mån |
| T5 | INFRA-003 — Stateful backend | ⬜ | 5 | Stort jobb, planeras |
| T6 | WQ-008 / WQ-001 — Scanners + watchlist live | ⬜ | 6 | Kräver öppen marknad |

### Klart
| TX1 | AGENT-HAIKU-001 | ✅ | | Alla agenter kör Haiku sedan 31/3 |
| TX2 | Agent 4+6 omstart | ✅ | | Nya filter live 31/3 |
| TX3 | vixElevated filter | ✅ | | Live DEC-015 + DEC-017 |

---

## SAVAGE ROAR / WARNER
*Nedprioriterat av Gustav 2026-04-01. Gustav hanterar personligen. CA/CC eskalerar inte.*

| # | Task | Status | Not |
|---|------|--------|-----|
| W1 | Warner audit §8.3 — 22 april | 🔄 NEDPRIO | Gustav hanterar. CA bevakar deadline passivt. |
| W2 | Settlement-strategi | 🔄 NEDPRIO | Min 200k SEK. Nils involverad. |

---

## META / STYR-AI
*Infrastruktur. Löses löpande.*

| # | Task | Status | Prio | Not |
|---|------|--------|------|-----|
| S4 | PAT_TOKEN scope mot tradesys1337 | ⬜ | 1 | top-gainers-agent failar |
| S5 | styrai-product repo — radera? | ⬜ | 2 | Rekommendation: ja |

### Klart
| S1 | GOVERNANCE.md | ✅ | | |
| S2 | Bidirektionell sync CC ↔ Claude.ai | ✅ | | |
| S3 | GLOBAL-TODO-001 | ✅ | | |
| S6 | work_queue.md borttagen | ✅ | | global_todo.md är SSOT |

---

## ÖPPNA BESLUT (Gustav)
*CA presenterar dessa vid boot. Gustav anger riktning — CA uppdaterar prioritering.*

| # | Fråga | Kontext |
|---|-------|--------|
| D1 | Agent 3 — stäng permanent eller redesigna? | RS_MOMENTUM 31.8% WR |
| D2 | DATA-EXTEND-001 — exportera TW CSV | ~85 tickers |
| D3 | ENGRAMS-SUPABASE-SPLIT — nu eller vänta? | Styr.AI-projekt redo |

---

## INSTRUKTIONER FÖR AGENTER

- Läs denna fil vid boot. Rapportera aktiva ⬜-tasks per projekt i prioritetsordning.
- Uppdatera ⬜→✅ vid close. Lägg till nya tasks direkt när de uppstår.
- Gustav anger riktning verbalt — CA översätter till prioritet och skriver hit. Verbala instruktioner som inte committats är förlorade.
- work_queue.md existerar inte längre.
