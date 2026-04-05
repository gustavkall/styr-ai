# Protocol — engrams specs batch
*Skapad av CA: 2026-04-06*
*Scope: [engrams]*
*Status: REDO FÖR DEPLOYMENT*

---

## SEKTION 2 — CC engrams feedback [scope: engrams]
*Status: KLAR*

### E-DEMO-CLEANUP-001
Feasibility: Enkel. DELETE i rätt ordning: memory_items → projects → accounts. Kräver SUPABASE_SERVICE_KEY.
### E-DEMO-LIMIT-001
Feasibility: Enkel. Hämta account.plan via projects → accounts join i remember.js.
### CC-HANDOFF-001
Feasibility: Redan implementerat. Verifiera att episodes syns i loadProject.

---

## SEKTION 3 — Syntes
*Status: KLAR*

---

## SEKTION 4 — Deployment [scope: engrams]
*Status: GODKÄND — REDO ATT KÖRAS*

**CC Engrams — kör `sync` för att hämta denna prompt, implementera sedan:**

1. **E-DEMO-LIMIT-001** — `api/remember.js`:
   - Hämta project → account → plan före INSERT
   - Om plan='demo' och count >= 10: returnera 429 `{ error: 'Demo limit reached', limit: 10 }`
   - När verifierat: `UPDATE styr_global_todo SET status='done' WHERE id='E-DEMO-LIMIT-001';` i Supabase (crsonxfrylkpgrddovhu)

2. **E-DEMO-CLEANUP-001** — `.github/workflows/demo-cleanup.yml`:
   - Cron: dagligen 03:00 UTC
   - SQL i ordning: (1) DELETE memory_items för demo-accounts >24h, (2) DELETE projects, (3) DELETE accounts
   - Kräver SUPABASE_URL + SUPABASE_SERVICE_KEY som GitHub secrets (Gustav sätter manuellt)
   - När verifierat: `UPDATE styr_global_todo SET status='done' WHERE id='E-DEMO-CLEANUP-001';`

3. **CC-HANDOFF-001** — Verifiera:
   - Kör remember(type:episode, project:styr-ai)
   - Kontrollera att det syns i loadProject("styr-ai") under episodes-nyckeln
   - När verifierat: `UPDATE styr_global_todo SET status='done' WHERE id='CC-HANDOFF-001';`

**Efter varje item: kör Supabase SQL via MCP för att markera done.**
**När alla tre klara: kör `sync`.**
