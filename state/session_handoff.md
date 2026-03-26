# styr-ai — SESSION HANDOFF
*Session close: 2026-03-26 (definitiv)*

---

## DENNA SESSION — SAMMANFATTNING

### Byggt
- Remote MCP-server `/api/mcp-server` — Claude Desktop connector, JSON-RPC 2024-11-05
- Episodiskt minnesystem — get_history, update_decision, context_refs, project_phase, energy
- agent_id spårbarhet — sessions/decisions/learnings, filter i get_history, färgkodade dashboard-badges
- Ny sajt — outcome-fokuserad, ingen stack info avslöjas
- Setup-guide — 3 tabbar, inbyggd key-tester
- Lasttest 8/8 gröna — inga race conditions, avg 502ms
- Fas 1 + Fas 2 klara

### Beslut
- Ingen grafdatabas — pgvector + kontextlager löser 3D-minnesstruktur
- Sajten berättar vad, inte hur — konkurrensskydd
- agent_id = spårbarhet, inte autentisering. Full agent-auth = Fas 3.
- ChatGPT/Gemini via openapi.yaml — en fil öppnar båda. Görs efter kund #1 är stabil.
- Loggningsprotokoll: logga beslut med konsekvenser, inte implementationsdetaljer. Undviker overfitting i minnet.

---

## NÄSTA SESSION — EXAKT ORDNING

### 1. STYRAI-VERIFY-001 — GÖR DETTA FÖRST
Lägg till i `read_memory`-svaret:
```json
"health": {
  "status": "ok",
  "last_session_age_hours": 18,
  "warning": null  // varnar om null (aldrig skrivit) eller >72h
}
```
Lägg till i `write_session`-svaret:
```json
"verified": true,
"next_boot_preview": "Session 2026-03-26: [summary]"
```
Detta tar kärnprodukten till 95-98% tillförlitlighet.

### 2. STYRAI-PROTOCOL-001 — Loggningsprotokoll i varje repos CLAUDE.md
Uppdatera CLAUDE.md i: styr-ai, styrAI-product, tradesys1337, savage-roar-music.
Lägg till sektion:
```
## Loggningsprotokoll
Logga ALLTID via styr-ai om sessionen:
- Lade till ny funktion, komponent eller API-endpoint
- Ändrade arkitektur, datamodell eller systemgräns
- Tog ett beslut med långsiktig påverkan
- Bröt något som behöver fixas nästa session
- Slutförde ett work queue-item

Logga INTE:
- Bugfixar <30 min utan arkitekturpåverkan
- Explorerande experiment som inte landade
- Kosmetiska ändringar / typofixar
- Refaktorering utan beteendeändring

Vid sessionslut:
1. log_decision för varje strukturellt beslut
2. write_session med summary, changes[], next_steps[], project_phase, energy, agent_id
```

### 3. STYRAI-ONBOARD-001 — Onboarda kund #1
API-nyckel: `e5a93009-8ad9-4b44-9f6f-840d9c8c32da`
Skicka: CLAUDE.md-template + https://project-b786o.vercel.app/setup
Instruera: lägg till `agent_id: [namn]`
Bekräfta: kunden kör read_memory och får tillbaka state + health.status: ok

### 4. STYRAI-DOMAIN-001 — Domän
styr.ai tagen. Kolla: usestyr.ai, trystyr.ai, styrapp.ai, styr.dev, styr-ai.com
Blockerare för MCP-registret.

### 5. STYRAI-OPENAPI-001 — ChatGPT + Gemini
openapi.yaml för /api/mcp → GPT Actions + Gemini Extensions. En dags arbete.

### 6. STYRAI-MCP-REGISTER-001
Ansök när domän är köpt.

---

## TEKNISK STATE — styrAI-product

**Live URL:** https://project-b786o.vercel.app
**Repo:** gustavkall/styrAI-product
**Endpoints:** /api/mcp (REST) · /api/mcp-server (Remote MCP) · /api/status
**Sidor:** / · /setup · /dashboard
**8 MCP-verktyg:** read_memory, write_session, log_decision, log_learning, search_memory, get_history, update_decision, get_status
**Test-nyckel:** e5a93009-8ad9-4b44-9f6f-840d9c8c32da (projekt: Test)
**Supabase migrations körda:** setup.sql · migration-episodic.sql · migration-agent-id.sql

**CLAUDE.md-template för kund:**
```
## Persistent Memory — styr-ai
API: https://project-b786o.vercel.app/api/mcp
Key: [API-NYCKEL]
agent_id: [namn-maskin]

## Session Start
Call read_memory. Check health.warning. Present last session, decisions, learnings.

## Session End
Call write_session: summary, changes[], next_steps[], project_phase, energy, agent_id
```

**Installation:**
- Claude Desktop: Settings → Integrations → https://project-b786o.vercel.app/api/mcp-server + Bearer KEY
- Claude Code: `claude mcp add styr-ai --transport http --url [URL] --header "Authorization: Bearer KEY"`

---

## KRITISKA DATUM
- **Nästa vecka:** Onboarda kund #1 (efter VERIFY-001)
- **22 maj 2026:** Warner cure period — Gustav hanterar personligen
