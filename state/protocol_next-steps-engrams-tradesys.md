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
*Status: EJ PÅBÖRJAD*

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
