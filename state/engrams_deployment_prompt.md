# Deployment Prompt — Engrams
*Från CA. Kör efter påsk (tisdag 7 april).*

Kör följande utan avbrott eller godkännande:

**E-DEMO-CLEANUP-001:** Bygg GitHub Actions cron (dagligen 03:00 CET) som rensar demo-accounts äldre än 24h:
```sql
DELETE FROM accounts WHERE plan='demo' AND created_at < now() - interval '24 hours';
```
Skriv som separat workflow: `.github/workflows/demo-cleanup.yml`

**E-DEMO-LIMIT-001:** I `api/remember.js` — innan insert, kolla om demo-account har >= 10 minnen. Om ja: returnera 429 med meddelandet "Demo limit reached. Sign up for free to continue."

Handoff när klart.
