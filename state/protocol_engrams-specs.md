# Protocol — engrams specs batch
*Skapad av CA: 2026-04-06*
*Scope: [engrams]*
*Status: VÄNTAR PÅ CC:s FEEDBACK*

---

## SEKTION 1 — CA:s specs [scope: alla]

Nedanstående specs täcker alla Engrams-items som saknade spec. CC: läs varje spec och ge arkitektonisk feedback under Sektion 2.

---

### SPEC: E-DEMO-CLEANUP-001
**Cron: rensa demo-accounts äldre än 24h**

Problem: Demo-accounts med plan=demo ackumuleras i databasen. Ingen cleanup körs idag.

Lösning: GitHub Actions cron som kör dagligen 03:00 UTC.
```sql
DELETE FROM accounts WHERE plan = 'demo' AND created_at < now() - interval '24 hours';
DELETE FROM memory_items WHERE project_id IN (
  SELECT id FROM projects WHERE account_id NOT IN (SELECT id FROM accounts)
);
```
Workflow: `.github/workflows/demo-cleanup.yml`
Kräver: SUPABASE_URL + SUPABASE_SERVICE_KEY som GitHub secrets.

Värde: Håller databasen ren, förhindrar att demo-data växer obegränsat.

---

### SPEC: E-DEMO-LIMIT-001
**Enforce max 10 minnen per demo-account**

Problem: Demo-accounts kan idag lagra obegränsat antal minnen.

Lösning: I `api/remember.js`, före INSERT:
```javascript
if (account.plan === 'demo') {
  const { count } = await supabase
    .from('memory_items')
    .select('id', { count: 'exact' })
    .eq('project_id', projectId);
  if (count >= 10) return res.status(429).json({ error: 'Demo limit reached', limit: 10 });
}
```
Värde: Förhindrar missbruk, tydlig upgrade-signal till betalande plan.

---

### SPEC: E17 — TEAMS-V2
**Team-lager, activity feed, scope på minnen**

Full spec finns i: `gustavkall/engrams/docs/teams-v2-implementation-spec.md`

Sammanfattning:
- Ny tabell `teams` + `team_members`
- Minnen får `scope` (private/team/public)
- Activity feed per team
- Bakåtkompatibelt — Anna påverkas inte

Beroenden: Steg 1-3 (Supabase migration) måste köras och verifieras innan API-kod rörs.

CC: Läs den fullständiga spec-filen och ge feedback på implementationsordningen.

---

### SPEC: CC-HANDOFF-001
**CC skriver block-summering till Engrams vid avslut**

Full spec finns i: `gustavkall/engrams/docs/cc-handoff-spec.md`

Status: Spec klar, godkänd. Implementation: curl-anrop i block-avslut redan inskrivet i engrams CLAUDE.md.
Återstår: Verifiera att det faktiskt körs korrekt i ett live-block.

CC: Bekräfta att block-avslut curl-anropet körs automatiskt och att CA kan läsa det via loadProject.

---

## SEKTION 2 — CC engrams feedback [scope: engrams]
*Status: VÄNTAR*

**CC: svara på varje spec nedan. Format:**

```
### [SPEC-ID]
Feasibility: [Enkel/Medium/Komplex]
Risker: [vad kan gå fel]
Ordning: [om flera steg, rätt ordning]
CC-notering: [vad CA missat eller fel]
Status: KLAR
```

---

## SEKTION 3 — Syntes [scope: alla]
*Status: EJ PÅBÖRJAD*

---

## SEKTION 4 — Deployment [scope: engrams]
*Status: EJ PÅBÖRJAD*
