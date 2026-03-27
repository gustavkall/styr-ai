# styr-ai — WORK QUEUE
*Uppdaterad: 2026-03-27 session (VERIFY-001 completed)*

---

## ACTIVE
*(inget aktivt)*

---

## READY — PRIORITY ORDER

### STYRAI-PROTOCOL-001 — Loggningsprotokoll per repo
**Priority:** MAX
**Project:** styr-ai / alla repos
**Description:** Lägg till loggningsprotokoll i CLAUDE.md för varje repo (styr-ai, styrAI-product, tradesys1337, savage-roar-music). Protokollet definierar när en session ska logga till styr-ai och när inte. Mål: traceability utan noise. Regel: logga beslut med konsekvenser, inte implementationsdetaljer.
**Template att lägga in:**
```
## Loggningsprotokoll
Logga ALLTID via styr-ai om sessionen:
- Lade till ny funktion, komponent eller API-endpoint
- Ändrade arkitektur, datamodell eller systemgräns
- Tog ett beslut med långsiktig påverkan
- Bröt något som behöver fixas nästa session
- Slutförde ett work queue-item

Logga INTE:
- Bugfixar under 30 min utan arkitekturpåverkan
- Explorerande experiment som inte landade
- Kosmetiska ändringar / typofixar
- Refaktorering utan beteendeändring

Vid sessionslut (om något ska loggas):
1. log_decision för varje strukturellt beslut
2. write_session med summary, changes[], next_steps[], project_phase, energy, agent_id
```

### STYRAI-ONBOARD-001 — Onboarda kund #1
**Priority:** MAX
**Project:** styrAI-product
**Description:** Skicka API-nyckel (e5a93009-8ad9-4b44-9f6f-840d9c8c32da) + CLAUDE.md-template + setup-guide URL. Instruera om agent_id. Bekräfta live. Samla feedback. VERIFY-001 är nu klar — detta är nästa steg.

### STYRAI-DOMAIN-001 — Domän
**Priority:** HIGH
**Project:** styrAI-product
**Description:** styr.ai tagen. Kolla: usestyr.ai, trystyr.ai, styrapp.ai, styr.dev, styr-ai.com. Köp och peka på Vercel. Domänen är blockerare för MCP-registret.

### STYRAI-OPENAPI-001 — openapi.yaml — ChatGPT + Gemini
**Priority:** HIGH
**Project:** styrAI-product
**Description:** Skriv openapi.yaml för /api/mcp med alla 8 verktyg. Öppnar både ChatGPT (GPT Actions) och Gemini (Extensions) simultant. En dags arbete. Görs efter kund #1 är stabil.

### STYRAI-MCP-REGISTER-001 — Ansök till Anthropics MCP-register
**Priority:** HIGH
**Project:** styrAI-product
**Description:** När domän är köpt. Kunden hittar styr-ai direkt i Claude Desktop, klickar Install. Krav: stabil domän (saknas), Bearer auth (klart), tools/list (klart).

### STYRAI-ROLLBACK-001 — restore_session
**Priority:** MEDIUM
**Project:** styrAI-product
**Description:** Nytt MCP-verktyg. Hämtar state från specifikt session_id. Append-only, inget raderas.

### MODEL-004 — BUY/WAIT-ekvationer i dashboard
**Priority:** HIGH
**Project:** tradesys1337
**Description:** calcBuyScore5d() + calcWaitScore5d() i index.html. Körs parallellt i CC.

### MODEL-005 — SELL/HOLD-modeller
**Priority:** HIGH
**Project:** tradesys-models

### STYRAI-003 — Fas 3: Stripe + självbetjäning
**Priority:** MEDIUM
**Project:** styrAI-product
**Description:** Aktiveras efter 3-5 kunder.

### SETUP-BATCH-001 — Setup-batch för stagnerade projekt
**Priority:** HIGH
**Project:** cross-project
**Description:** Kör Supabase setup + deploy för savage-roar-music, min-analytiker, adminassistent samtidigt för att ta dem från scaffold till fungerande v1

### TRADESYS-PROD-001 — sectorMomentum i produktion
**Priority:** HIGH
**Project:** tradesys1337
**Description:** Implementera cross-ticker sectorMomentum feature för att ta v6/v8 ML-förbättringar till full produktion

### ADMINASSISTENT-001 — Bygg EA-system
**Priority:** LOW
**Description:** På Gustavs initiativ.

---

## COMPLETED

| ID | Task | Date | Outcome |
|----|------|------|--------|
| VISION-001 | Goals layer | 2026-03-24 | ✅ |
| VISION-004 | Autonomigränser | 2026-03-24 | ✅ |
| VISION-005 | Autonom execution | 2026-03-24 | ✅ 5 agenter live |
| COO-001 | COO-agent | 2026-03-24 | ✅ |
| ARCH-001/002 | URL-first + proaktiv regel | 2026-03-24 | ✅ |
| MODEL-001 | Training pipeline | 2026-03-25 | ✅ 48k samples |
| SECURITY-001 | Repos privata | 2026-03-25 | ✅ |
| MODEL-002 | Scanner-labels EMS/FPS/STS | 2026-03-26 | ✅ Bekräftat av Gustav |
| MODEL-003 | EPS surprise Polygon | 2026-03-26 | ✅ Bekräftat av Gustav |
| BUGFIX-001 | fetch-state.js crash | 2026-03-26 | ✅ |
| STYRAI-FAS1 | Fas 1 — kärnprodukt | 2026-03-26 | ✅ MCP-server live, 8 verktyg |
| STYRAI-FAS2 | Fas 2 — sajt, setup, dashboard, remote MCP, episodiskt minne, agent_id | 2026-03-26 | ✅ |
| STYRAI-LASTTEST | Lasttest 8/8 | 2026-03-26 | ✅ Inga race conditions, 502ms avg |
| STYRAI-VERIFY-001 | Boot/handoff-verifiering | 2026-03-27 | ✅ health i read_memory, verified + next_boot_preview i write_session |
