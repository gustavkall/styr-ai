# active_context.md — Delat whiteboard CC ↔ Claude.ai
*Uppdaterad: 2026-04-01 — session handoff kväll*

---

## PRIORITET 1 IMORGON — ENGRAMS-RECALL-FIX

remember() fungerar (200 OK). recall() returnerar 0 minnen.
Fix: sänk threshold 0.75→0.3 i recall.js, deploy, testa.
Om fortfarande 0 — kontrollera pgvector ivfflat-index på memory_items.embedding.
När recall fungerar → skicka Anna-onboarding-mail (draft klar i Gmail).

---

## NULÄGE — ENGRAMS

**API:** remember() ✅ | recall() ❌ 0 minnen | profile() ✅
**Vercel:** production READY, service_role-nyckel satt
**Sajt:** platform-agnostic copy, opak (ingen impl-info exponerad)
**Anna:** konto klart, onboarding-draft klar, väntar på recall-fix
**Supabase Styr.AI:** RLS fixat (projects + waitlist var exponerade — nu stängt)

## GJORT IDAG (2026-03-31)

- Supabase service_role-nyckel satt i Vercel (var anon → fixat)
- match_memories() + boost_relevance() omskrivna med SECURITY DEFINER + SET search_path
- RLS-policies på TradeSys (projects, memory_items, accounts)
- RLS fixat på Styr.AI-projektet (projects + waitlist var publikt exponerade)
- Sajt uppdaterad: platform-agnostic (Claude · ChatGPT · Cursor · Gemini)
- Sajt uppdaterad: opak copy — ingen impl-detaljer exponerade
- Anna-onboarding-mail omskrivet (ingen API-nyckel, ingen teknisk info)
- DASHBOARD-001 + CONNECT-001 planerade (zero-technical UX)
- Minnessystem neurobiologiskt mappat (profile/context/learning/episode)
- MEMORY-FORGETTING-001 + MEMORY-CONSOLIDATION-001 tillagda i todo
- GitHub Actions: autonomous-agent + coo-agent saknade on: — CC fixar nu
- GitHub Actions: top-gainers failade — troligen PAT_TOKEN scope mot tradesys1337

---

## GITHUB ACTIONS STATUS

| Agent | Status | Problem |
|-------|--------|---------|
| autonomous-agent | ⚠️ | Saknade on: — CC lägger till workflow_dispatch |
| coo-agent | ⚠️ | Saknade on: — CC lägger till workflow_dispatch |
| top-gainers | ❌ | Kraschade i scriptet — troligen PAT_TOKEN write-access till tradesys1337 |
| market-regime | ✅ | Kör på schema |
| memory-integrity | ✅ | Kör söndagar |

**PAT_TOKEN-check:** Verifiera att PAT_TOKEN har repo-scope på tradesys1337 i GitHub Settings → Developer settings → Personal access tokens.

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
