# Protocol — next-steps-engrams-tradesys
*Skapad av CA: 2026-04-03*
*Scope: [engrams] [tradesys]*

---

## SEKTION 1 — CA:s plan [scope: alla]
*Status: GODKÄND*

### Engrams — förslag att utvärdera

**E-USAGE-001** [scope: engrams]
Bygg usage_log-tabell i Supabase. Logga varje remember/recall/profile-anrop med timestamp, project, type, account_id. Visa räknare i dashboarden: anrop per dag senaste 7 dagarna, aktiva projekt, minnestillväxt.

**E-MONITORING-001** [scope: engrams]
Enkel uptime-check. GitHub Actions cron var 5:e minut som anropar /api/recall med intern test-nyckel. Om svar >2s eller error: logga till styr_session_log. Ska köras som GitHub Actions, inte Vercel-funktion.

**E-ONBOARDING-002** [scope: engrams]
Uppgradera befintlig Setup-tab till guided 3-stegs wizard. Steg 1: välj verktyg. Steg 2: kopiera connection string. Steg 3: live verify-knapp mot /api/recall som bekräftar att nyckeln fungerar.

**E-PUBLIC-DEMO-001** [scope: engrams]
Anonymt demo-läge på startsidan. Temp-nyckel med 24h TTL och max 10 minnen. Besökaren skriver ett minne, laddar om, minnet finns kvar. Rate-limit: 1 temp-nyckel per IP per dag.

---

### TRADESYS — förslag att utvärdera

**T-LIVE-PERF-001** [scope: tradesys]
Live performance tracker. GitHub Actions cron dagligen 23:00 CET: hämta shadowbot-beslut från Supabase, hämta EOD-priser via Polygon, beräkna faktiskt utfall, logga till trade_outcomes-tabell, skriv summary till state/live_performance.md.

**T-LIVE-CRITERIA-001** [scope: tradesys]
Skapa docs/go_live_criteria.md. Definierade kriterier för när en shadowbot är redo för live: agent, WR-tröskel, min antal live paper trades, max drawdown, status. Ingen kod — bara dokumentet.

**T-REGIME-ALERT-001** [scope: tradesys]
Intradag regime-check. GitHub Actions cron var 30:e minut 15:30-21:30 CET vardagar. Om VIX >10% från dagöppning: skriv till state/regime_alert.md + logga till Supabase. INGEN automatisk agentpaus — bara alert.

**T-WATCHLIST-FEEDBACK-001** [scope: tradesys]
Watchlist scoring feedback. Återanvänd T-LIVE-PERF-001-infrastruktur. Dagligen 22:30: jämför top 10 watchlist-scorade mot EOD-utfall, logga korrelation till Supabase, veckosammanfattning till state/scoring_feedback.md.

---

## SEKTION 2 — CC engrams [scope: engrams]
*CC-engrams. Datum: 2026-04-05*

### E-USAGE-001: Usage metering
Svar: Byggt och live. usage_log-tabell i Supabase, logging i remember/recall/profile endpoints (fire-and-forget). Dashboard visar API calls (7d), total memories, active projects. Inga prestandaproblem — INSERT är asynkron.

### E-MONITORING-001: Uptime check
Svar: Byggt. .github/workflows/uptime.yml — cron var 5:e minut, anropar /api/recall med intern nyckel, loggar till styr_session_log agent=monitoring vid status!=200 eller latency>2s. Kräver E2E_API_KEY secret i GitHub repo settings (ej satt ännu).

### E-ONBOARDING-002: Setup wizard
Svar: Byggt och live. Setup-tab uppgraderad till 3-stegs wizard: (1) Välj verktyg, (2) Kopiera connection string, (3) Live verify-knapp mot /api/profile. Step indicators visar progress. Fallback-meddelande om API-nyckel saknas.

### E-PUBLIC-DEMO-001: Anonymt demo
Svar: Byggt och live. api/waitlist.js omgjord till demo-endpoint. Skapar temp-account med plan=demo, 24h TTL (implicit via created_at), 1/IP/dag rate limit. Startsidan har "Try it live"-sektion med remember+recall. Demo-cleanup cron ej byggt ännu (E-DEMO-CLEANUP-001 i backlog).

### Noteringar
- 12/12 Vercel Hobby functions — gränsen nådd. Nästa endpoint kräver konsolidering.
- V2 versionsmodell (steg 1-3) live: version + superseded_by på memory_items, task-typ med CRUD, strukturerad loadProject.
- Ghost-state migrerad (steg 4): project_memory/ och state/session_handoff.md → Engrams memories.

*Status: KLAR*

---

## SEKTION 2 — CC tradesys [scope: tradesys]
*Status: EJ PÅBÖRJAD*

---

## SEKTION 3 — Master plan [scope: alla]
*Status: EJ PÅBÖRJAD*

---

## SEKTION 4 — Deployment engrams [scope: engrams]
*Status: EJ PÅBÖRJAD*

---

## SEKTION 4 — Deployment tradesys [scope: tradesys]
*Status: EJ PÅBÖRJAD*
