# styr-ai — WORK QUEUE
*Uppdaterad: 2026-04-01 — CA/CC synkad*

---

## ACTIVE
*(inget aktivt)*

---

## READY — PRIORITETSORDNING

---

### ENGRAMS-ONBOARD-001 — Skicka onboarding-mail till Anna
**Prioritet:** MAX
**Blockerare:** Löst — API live, 5/5 e2e pass, OPENAI_API_KEY finns i Vercel
**Action:** Gustav godkänner → CA skickar Gmail-draft (ID: r5404878031968918972)

---

### ENGRAMS-OPENAPI-001 — ChatGPT Custom GPT Action
**Prioritet:** HIGH
**Project:** styrAI-product
**Description:** Bygg OpenAI Action JSON-schema för ChatGPT auto-remember. CC kör.

---

### ENGRAMS-SUPABASE-SPLIT — Migrera Engrams-tabeller
**Prioritet:** HIGH
**Project:** engrams / Supabase
**Description:** Migrera Engrams-tabeller från TradeSys-projektet (hxikaojzwjtztyuwlxra) till Styr.AI-projektet (crsonxfrylkpgrddovhu). CC kör.

---

### ENGRAMS-MULTI-PROJECT-001 — Multi-projekt arkitektur
**Prioritet:** HIGH (krävs för skalning, ej blockerare för Anna V1)
**Description:** 1 nyckel → 1 projekt nu. Multi-projekt krävs för betalande kunder med 2+ projekt.
- Steg 1: `project_name` i projects-tabell
- Steg 2: accounts-tabell ovanför projects

---

### ENGRAMS-STRIPE-001 — Stripe-integration
**Prioritet:** HIGH (kräver Gustav: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, RESEND_API_KEY i Vercel)
**Description:** Stripe webhook → skapar projekt + API-nyckel → bekräftelsemail.

---

### ENGRAMS-PRICING-001 — Besluta prismodell
**Prioritet:** MEDIUM (före Stripe-implementation)
**Description:** Free / Pro $19 / Team $49 — diskutera med Gustav.

---

### ENGRAMS-MCP-CONNECTOR-001 — Officiell Claude Connector
**Prioritet:** HIGH
**Description:** Ansök till Anthropic MCP-register. openapi.yaml → engrams.app/api/mcp-server → ansökan.

---

### TRADESYS-ADD-NEW-AGENT3-001 — Ny strategi agent 3
**Prioritet:** HÖG
**Project:** tradesys-models (CC)
**Description:** RS_MOMENTUM agent 3 hade 31.8% WR — stäng eller redesigna? Gustav beslutar.

---

### TRADESYS-DATA-EXTEND-001 — TW CSV-export 2019-2026
**Prioritet:** HÖG (kräver Gustav)
**Description:** 85 tickers behöver TradingView CSV-export för modellträning. Gustav exporterar.

---

### TRADESYS-MODEL-SCOREBOARD-001 — Precision-scoreboard v5-v10
**Prioritet:** MEDIUM
**Project:** tradesys-models (CC)
**Description:** Bygg scoreboard för att jämföra modell-versioner v5-v10 precision.

---

### TRADESYS-FMP-001 — FMP Starter $29/mån
**Prioritet:** MEDIUM (kräver Gustav)
**Description:** Låser upp short interest live. Gustav subscribar manuellt.

---

### META-PAT-TOKEN-001 — PAT_TOKEN scope mot tradesys1337
**Prioritet:** MEDIUM
**Description:** Agenter behöver PAT_TOKEN med repo+workflow-scope för cross-repo writes till tradesys1337.

---

### ADMINASSISTENT-001 — Bygg EA-system
**Prioritet:** LOW

---

## COMPLETED

| ID | Task | Date | Outcome |
|----|------|------|---------|
| VISION-001 | Goals layer | 2026-03-24 | ✅ |
| COO-001 | COO-agent | 2026-03-24 | ✅ |
| ARCH-001/002 | URL-first + proaktiv regel | 2026-03-24 | ✅ |
| MODEL-001/002/003 | Training pipeline | 2026-03-25/26 | ✅ |
| SECURITY-001 | Repos privata | 2026-03-25 | ✅ |
| STYRAI-FAS1/FAS2 | MCP-server + sajt + dashboard | 2026-03-26 | ✅ |
| STYRAI-VERIFY-001 | Boot/handoff-verifiering | 2026-03-27 | ✅ |
| STYRAI-PROTOCOL-001 | Loggningsprotokoll | 2026-03-27 | ✅ |
| DOMAIN-001 | app.savageroar.se live | 2026-03-27 | ✅ |
| STYRAI-ONBOARD-001 | Draft till anna.garmen@gmail.com | 2026-03-27 | ✅ |
| AGENT-PAUSE-001 | coo-agent + autonomous-agent pausade | 2026-03-27 | ✅ |
| TRADESYS-SHADOWBOT-6 | 6 agenter live + Supabase-sync | 2026-03-27 | ✅ |
| TRADESYS-AGENTS-TAB | AGENTS-tab live P&L | 2026-03-27 | ✅ |
| CC-SYNC-001 | CC↔Claude.ai bidirektionellt sync | 2026-03-28 | ✅ |
| STYRAI-NAME-001 | Produktnamn: Engrams | 2026-03-28 | ✅ |
| ENGRAMS-DOMAIN-001 | engrams.app köpt + DNS live | 2026-03-28 | ✅ |
| ENGRAMS-LANDING-001 | Landningssida + waitlist live | 2026-03-28 | ✅ |
| TRADESYS-SECTOR-HOT | Agent 4+6 redesign 71.8%/62.6% WR | 2026-03-28 | ✅ |
| TRADESYS-TRAINER-BUG | agent-trainer.js leaf bugfix +11.4pp | 2026-03-28 | ✅ |
| AGENT-HAIKU-001 | Alla styr-ai agenter → Haiku | 2026-03-31 | ✅ |
| TRADESYS-AGENT-RESTART | Agent 4+6 omstartade med nya filter | 2026-03-31 | ✅ |
| TRADESYS-VIX-FILTER-001 | vixElevated filter live (DEC-015/017) | 2026-03-31 | ✅ |
| ENGRAMS-API-LIVE | API live, 5/5 e2e pass | 2026-04-01 | ✅ |
| ENGRAMS-MCP-LIVE | MCP-connector verifierad i Claude.ai | 2026-04-01 | ✅ |
| ENGRAMS-RECALL-FIX | recall() threshold fix, 5/5 e2e | 2026-04-01 | ✅ |
