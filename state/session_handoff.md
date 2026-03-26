# styr-ai — SESSION HANDOFF
*Session close: 2026-03-26 (session 2)*

---

## DENNA SESSION

### Byggt — styrAI-product
- **Remote MCP-server** (`/api/mcp-server`) — Claude Desktop connector, JSON-RPC 2024-11-05, SSE + Streamable HTTP
- **Episodiskt minnesystem** — `get_history`, `update_decision`, `context_refs`, `project_phase`, `energy` på alla tabeller
- **agent_id spårbarhet** — sessions, decisions, learnings taggade med vem som skapade dem. Filter i `get_history`. Dashboard visar agent-badges med unik färg per agent.
- **Ny sajt** — outcome-fokuserad copy, ingen stack-info avslöjas. Remote MCP som primär onboarding.
- **Setup-guide** med tre tabbar: Claude Desktop (primär), Claude Code (CLI), Manual (CLAUDE.md). Inbyggd key-tester.
- **Dashboard uppdaterad** — agents-bar, agent-badges på sessions och beslut
- **Lasttest genomfört** — 8/8 tester gröna. 10 concurrent writes 100% ok, avg latency 502ms, inga race conditions.

### Migrationer körda i Supabase
- `migration-episodic.sql` — context_refs, project_phase, energy, supersedes/superseded_by, get_episode_history()
- `migration-agent-id.sql` — agent_id på sessions/decisions/learnings, uppdaterad get_episode_history() med p_agent_id filter

### Beslut
- Ingen grafdatabas — pgvector + kontextlager (context_refs + project_phase) löser 3D-minnesstruktur utan infrastrukturkomplexitet
- Ingen API-nyckelhantering för externa källor (Polygon etc) — Fas 3, inte kärnprodukt
- Sajten berättar vad, inte hur — konkurrensskydd
- agent_id är spårbarhet, inte autentisering — full agent-auth är Fas 3

### Fas-status styrAI-product
- **Fas 1:** ✅ KLAR — MCP-server, 8 verktyg, embeddings, kund #1 provisionerad
- **Fas 2:** ✅ KLAR — Sajt, setup-guide, dashboard, remote MCP connector, episodiskt minne, agent_id
- **Fas 3:** 🔲 VÄNTANDE — Stripe, självbetjäning (efter 3-5 kunder)
- **Fas 4:** 🔲 VÄNTANDE — MCP-register, npm-paket, distribution

---

## NÄSTA SESSION — PRIORITERINGSORDNING

### 1. Onboarda kund #1 (nästa vecka)
- Skicka: API-nyckel `e5a93009-8ad9-4b44-9f6f-840d9c8c32da` + CLAUDE.md-template + länk till setup-guide
- Instruera: lägg till `agent_id: deras-namn` i CLAUDE.md
- Följ upp: bekräfta att de är live, samla feedback

### 2. Domän
- styr.ai är tagen
- Kolla: `usestyr.ai`, `trystyr.ai`, `styrapp.ai`, `styr.dev`, `styr-ai.com`
- Peka på Vercel när köpt

### 3. TRADESYS MODEL-004 (parallellt i CC)
- calcBuyScore5d() + calcWaitScore5d() i index.html
- Confidence-filter bredvid calcSetupScore()

### 4. rollback-verktyg (`restore_session`)
- Hämtar state från ett specifikt session_id
- Returnerar det som om det vore nuvarande state
- Append-only — inget raderas

### 5. Fas 3 (efter 3-5 kunder)
- Stripe, självbetjäning, admin-dashboard

---

## TEKNISK STATE — styrAI-product

**Live URL:** https://project-b786o.vercel.app  
**Repo:** gustavkall/styrAI-product  
**API endpoint:** /api/mcp (REST) + /api/mcp-server (Remote MCP)  
**Supabase:** Styr.AI projekt  
**8 MCP-verktyg:** read_memory, write_session, log_decision, log_learning, search_memory, get_history, update_decision, get_status  
**Test-nyckel:** e5a93009-8ad9-4b44-9f6f-840d9c8c32da (projekt: Test)  

**Installation kund:**  
Claude Desktop: Settings → Integrations → https://project-b786o.vercel.app/api/mcp-server  
Claude Code: `claude mcp add styr-ai --transport http --url ... --header "Authorization: Bearer KEY"`  

**CLAUDE.md för kund:**
```
## Persistent Memory — styr-ai
API: https://project-b786o.vercel.app/api/mcp
Key: [API-NYCKEL]
agent_id: [namn-maskin]

## Session Start
Call read_memory. Present last session, active decisions, learnings.

## Session End  
Call write_session: summary, changes[], next_steps[], project_phase, energy, agent_id
```

---

## KRITISKA DATUM
- **Nästa vecka:** Onboarda kund #1
- **22 maj 2026:** Warner cure period — Gustav hanterar personligen
