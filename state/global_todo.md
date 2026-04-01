# Global Todo — Alla Projekt
*Single source of truth. Läses vid varje session boot oavsett projekt.*
*Uppdateras av både Claude.ai och CC vid session close/sync.*
*Format: [PROJ] Task — Status — Not*

---

## ENGRAMS

| # | Task | Status | Not |
|---|------|--------|-----|
| E1 | SQL-schema + API endpoints | ✅ KLAR | remember/recall/profile/load_project live |
| E2 | MCP-CONNECTOR-001 | ✅ KLAR | Verifierad Claude.ai + CC |
| E3 | CC-VERIFY-001 | ✅ KLAR | 5/5 e2e pass |
| E4 | ENGRAMS-RECALL-FIX | ✅ KLAR | Threshold 0.3, fungerar |
| E5 | Multi-project support | ✅ KLAR | `project`-parameter, get_or_create_project() |
| E6 | **OPENAPI-001** — ChatGPT Custom GPT Action | ⬜ PRIORITET 1 | Auto-remember kräver Actions, ej Custom Instructions |
| E7 | **Anna onboarding** | ⬜ PRIORITET 2 | Alla blockerare lösta. Mail klart i Gmail drafts |
| E8 | **ENGRAMS-SUPABASE-SPLIT** | ⬜ PRIORITET 3 | Engrams delar nu DB med TradeSys (hxikaojzwjtztyuwlxra) |
| E9 | STRIPE-001 — Betalning | ⬜ | |
| E10 | PRICING-001 — Prissektion på sajten | ⬜ | |
| E11 | DASHBOARD-001 — Inloggning + projektsida | ⬜ | |
| E12 | CONNECT-001 — Connect-flow per plattform | ⬜ | Väntar på E11 |
| E13 | GEMINI-NATIVE-001 | ⬜ V2 | Sandbox blockerar, kräver native integration |
| E14 | MEMORY-FORGETTING-001 — Forgetting curve | ⬜ V2 | |
| E15 | MEMORY-CONSOLIDATION-001 | ⬜ V2 | episode → learning automatiskt |

---

## TRADESYS

| # | Task | Status | Not |
|---|------|--------|-----|
| T1 | ADD-NEW-AGENT3-001 — Ny strategi agent 3 | ⬜ | Kandidat: RISK-OFF bounce (creditStress corr=0.480) |
| T2 | DATA-EXTEND-001 — TW CSV-export 2019-2026 | ⬜ | ~85 tickers behöver mer data. Kräver Gustav |
| T3 | MODEL-SCOREBOARD-001 — Precision v5-v10 | ⬜ | retrain_log.jsonl loggar ej precision |
| T4 | FMP-LIVE-001 — Short float live | ⬜ | Väntar på FMP Starter $29/mån |
| T5 | INFRA-003 — Stateful backend | ⬜ | Stort jobb, hög prio när redo |
| T6 | WQ-008 / WQ-001 — Scanners + watchlist live | ⬜ | Kräver öppen marknad |

---

## SAVAGE ROAR / WARNER

| # | Task | Status | Not |
|---|------|--------|-----|
| W1 | Warner audit §8.3 — cure period aktiv | ⬜ | Gustav hanterar personligen |
| W2 | Settlement-strategi | ⬜ | Nils (legal advisor) involverad |

---

## STYR-AI / META

| # | Task | Status | Not |
|---|------|--------|-----|
| S1 | GOVERNANCE.md | ✅ KLAR | |
| S2 | Bidirektionell sync CC ↔ Claude.ai | ✅ KLAR | active_context.md + cc_session_log.md |
| S3 | **GLOBAL-TODO-001** — denna fil | ✅ KLAR | |
| S4 | PAT_TOKEN scope mot tradesys1337 | ⬜ | top-gainers-agent failar |
| S5 | styrai-product repo — radera? | ⬜ | Rekommendation: ja |

---

## ÖPPNA BESLUT (Gustav)

| # | Fråga | Kontext |
|---|-------|--------|
| D1 | Agent 3 — stäng permanent eller redesigna? | RS_MOMENTUM 31.8% WR |
| D2 | ENGRAMS-SUPABASE-SPLIT — nu eller vänta på Pro? | Styr.AI-projekt (crsonxfrylkpgrddovhu) finns redo |
| D3 | DATA-EXTEND-001 — exportera TW CSV när du har tid | ~85 tickers |

---

## INSTRUKTIONER FÖR AGENTER

Vid session boot: läs denna fil och rapportera vad som är aktivt.
Vid session close/sync: uppdatera status på tasks som är gjorda.
Lägg till nya tasks direkt här, inte i projekt-specifika filer (de är backup).
Format för ny task: `| XX | TASK-ID — Beskrivning | ⬜ | Not |`
