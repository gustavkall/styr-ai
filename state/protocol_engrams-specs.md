# Protocol — engrams specs batch
*Skapad av CA: 2026-04-06*
*Scope: [engrams]*
*Status: REDO FÖR DEPLOYMENT*

---

## SEKTION 1 — CA:s specs
*(se tidigare version)*

---

## SEKTION 2 — CC engrams feedback [scope: engrams]
*CC-engrams. Datum: 2026-04-05. Status: KLAR*

### E-DEMO-CLEANUP-001
Feasibility: Enkel
Risker: CASCADE delete — kör DELETE i rätt ordning: memory_items först, projects, accounts sist.
Ordning: (1) DELETE memory_items, (2) DELETE projects, (3) DELETE accounts
CC-notering: Kräver SUPABASE_SERVICE_KEY (inte anon key) — sätt som GitHub secret.
Status: KLAR

### E-DEMO-LIMIT-001
Feasibility: Enkel
Risker: Minimala. Extra query för plan-check behövs i remember.js.
CC-notering: Hämta account.plan via projects → accounts join, inte från projectId direkt.
Status: KLAR

### E17 — TEAMS-V2
Feasibility: Komplex (2-3 veckor)
Risker: Schema-migration under live trafik. Kör steg 1-3 och verifiera före API-kod.
CC-notering: Spec-filen är komplett.
Status: KLAR

### CC-HANDOFF-001
Feasibility: Redan implementerat
CC-notering: Block-avslut curl körs. Episoder syns i loadProject.
Status: KLAR

---

## SEKTION 3 — Syntes
*Status: KLAR*

Godkända och redo:
- E-DEMO-CLEANUP-001: Enkel, kör först
- E-DEMO-LIMIT-001: Enkel, kör andra
- CC-HANDOFF-001: Verifiera att episodes loggas korrekt
- E17 TEAMS-V2: Komplex, kör sist och separat

---

## SEKTION 4 — Deployment [scope: engrams]
*Status: GODKÄND — REDO ATT KÖRAS*

**CC Engrams: klistra in denna prompt och kör:**

```
Läs state/todo.md och docs/engrams-v2-spec.md.

Kör dessa tre items i ordning:

1. E-DEMO-LIMIT-001:
   I api/remember.js, lägg till före INSERT:
   - Hämta project → account → plan
   - Om plan = 'demo': räkna minnena för projektet
   - Om count >= 10: returnera 429 { error: 'Demo limit reached', limit: 10 }
   Testa med demo-nyckel.

2. E-DEMO-CLEANUP-001:
   Skapa .github/workflows/demo-cleanup.yml
   Cron: dagligen 03:00 UTC
   Kör SQL i rätt ordning:
   (1) DELETE FROM memory_items WHERE project_id IN (SELECT id FROM projects WHERE account_id IN (SELECT id FROM accounts WHERE plan='demo' AND created_at < now()-interval '24 hours'))
   (2) DELETE FROM projects WHERE account_id IN (SELECT id FROM accounts WHERE plan='demo' AND created_at < now()-interval '24 hours')
   (3) DELETE FROM accounts WHERE plan='demo' AND created_at < now()-interval '24 hours'
   Kräver: SUPABASE_URL + SUPABASE_SERVICE_KEY som GitHub secrets (Gustav sätter dem manuellt).

3. CC-HANDOFF-001 verifiering:
   Kör ett remember-anrop med type:episode, project:styr-ai.
   Verifiera att det syns i loadProject("styr-ai") under episodes-nyckeln.
   Rapportera: ok eller vad som saknas.

Nota varje item som done i state/todo.md när det är verifierat.
Kör sync när allt är klart.
```
