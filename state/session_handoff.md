# styr-ai — SESSION HANDOFF
*Session close: 2026-03-26 (session 2, slutlig)*

---

## DENNA SESSION

### Byggt — styrAI-product
- **Remote MCP-server** (`/api/mcp-server`) — Claude Desktop connector, JSON-RPC 2024-11-05
- **Episodiskt minnesystem** — `get_history`, `update_decision`, `context_refs`, `project_phase`, `energy`
- **agent_id spårbarhet** — sessions/decisions/learnings taggade. Filter i get_history. Dashboard visar färgkodade agent-badges.
- **Ny sajt** — outcome-fokuserad, ingen stack-info avslöjas
- **Setup-guide** — tre tabbar (Claude Desktop / Claude Code / Manual), inbyggd key-tester
- **Lasttest 8/8** — 10 concurrent writes 100% ok, avg 502ms, inga race conditions
- **Fas 1 + Fas 2 klara**

### Beslut
- Ingen grafdatabas — pgvector + kontextlager löser 3D-minnesstruktur
- Ingen API-nyckelhantering för externa källor — Fas 3
- Sajten berättar vad, inte hur — konkurrensskydd
- agent_id = spårbarhet, inte autentisering. Full agent-auth = Fas 3.
- ChatGPT/Gemini-support via openapi.yaml — en fil öppnar båda. Görs efter kund #1 är stabil.

---

## NÄSTA SESSION — EXAKT ORDNING

### 1. STYRAI-VERIFY-001 — Boot/handoff-verifiering (GÖR DETTA FÖRST)
Lägg till i `read_memory`-svaret:
```json
"health": {
  "status": "ok",
  "last_session_age_hours": 18,
  "warning": null
}
```
Lägg till i `write_session`-svaret:
```json
"verified": true,
"next_boot_preview": "Session 2026-03-26: [summary]"
```
Om `last_session_age_hours` är null (aldrig skrivit) eller >72h — returnera warning. Claude visar det för kunden. Det är detta som tar kärnprodukten till 95-98% tillförlitlighet.

### 2. STYRAI-ONBOARD-001 — Onboarda kund #1
API-nyckel: `e5a93009-8ad9-4b44-9f6f-840d9c8c32da`
Skicka: CLAUDE.md-template + setup-guide (project-b786o.vercel.app/setup)
Instruera: lägg till `agent_id: [namn]` i CLAUDE.md
Bekräfta: kunden kör read_memory och får tillbaka projekt-state

### 3. STYRAI-DOMAIN-001 — Domän
styr.ai tagen. Kolla: usestyr.ai, trystyr.ai, styrapp.ai, styr.dev, styr-ai.com
Domän blockerare för MCP-registret.

### 4. STYRAI-OPENAPI-001 — ChatGPT + Gemini
openapi.yaml som beskriver /api/mcp. Samma fil öppnar GPT Actions + Gemini Extensions.
En dags arbete. Görs efter kund #1 stabil.

### 5. STYRAI-MCP-REGISTER-001 — Anthropics MCP-katalog
Ansök när domän är köpt. Kunder hittar och installerar utan manuell konfiguration.

---

## TEKNISK STATE — styrAI-product

**Live URL:** https://project-b786o.vercel.app
**Repo:** gustavkall/styrAI-product
**Endpoints:** /api/mcp (REST) · /api/mcp-server (Remote MCP) · /api/status
**Sidor:** / · /setup · /dashboard
**8 MCP-verktyg:** read_memory, write_session, log_decision, log_learning, search_memory, get_history, update_decision, get_status
**Test-nyckel:** e5a93009-8ad9-4b44-9f6f-840d9c8c32da (projekt: Test)

**Supabase-tabeller:** projects, sessions, decisions, learnings, embeddings
**Migrations körda:** setup.sql, migration-episodic.sql, migration-agent-id.sql

**Installationsväg för kund:**
- Claude Desktop: Settings → Integrations → https://project-b786o.vercel.app/api/mcp-server + Bearer KEY
- Claude Code: `claude mcp add styr-ai --transport http --url [URL] --header "Authorization: Bearer KEY"`
- Manual: CLAUDE.md med API + Key + agent_id

**CLAUDE.md-template för kund:**
```
## Persistent Memory — styr-ai
API: https://project-b786o.vercel.app/api/mcp
Key: [API-NYCKEL]
agent_id: [namn-maskin]

## Session Start
Call read_memory. Present last session, active decisions, learnings. Check health.warning.

## Session End
Call write_session: summary, changes[], next_steps[], project_phase, energy, agent_id
```

---

## KRITISKA DATUM
- **Nästa vecka:** Onboarda kund #1 (efter VERIFY-001 är klar)
- **22 maj 2026:** Warner cure period — Gustav hanterar personligen
