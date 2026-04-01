# active_context.md
*Uppdaterad: 2026-04-01 15:30 — ARKITEKTURBESLUT*
*Skriven av CA. CC: läs detta innan du gör något annat.*

---

## KRITISKT ARKITEKTURBESLUT — IMPLEMENTERA NU

Gustav har godkänt ett arkitekturskifte. Du implementerar det. Ingen diskussion behövs.

### Beslutet
GitHub state-filer ersätts med Supabase. All state lever i Styr.AI-projektet (`crsonxfrylkpgrddovhu`). Båda instanser (CA + CC) läser och skriver mot samma källa i realtid. Ingen drift, ingen sync, ingen latens.

### Varför
CA och CC har haft återkommande drift — CA bootar mot gamla filer, CC vet inte vad CA gjort. Supabase löser detta strukturellt: realtid, delad källa, inga merge-konflikter.

### Vad som INTE ändras
- TradeSys Supabase (`hxikaojzwjtztyuwlxra`) — oförändrat, egna operativa tabeller
- GitHub — kod, CLAUDE.md, GitHub Actions stannar kvar
- Engrams API och tabeller — oförändrat tills vidare

---

## DIN UPPGIFT — KÖR I DENNA ORDNING

### Steg 1: Skapa tabeller i Styr.AI Supabase (`crsonxfrylkpgrddovhu`)

```sql
-- System state: ersätter active_context.md + session_handoff.md
CREATE TABLE IF NOT EXISTS styr_system_state (
  id          text PRIMARY KEY,
  project     text,
  content     jsonb,
  updated_by  text,
  updated_at  timestamptz DEFAULT now()
);

-- Global todo: ersätter global_todo.md
CREATE TABLE IF NOT EXISTS styr_global_todo (
  id          text PRIMARY KEY,
  project     text,
  title       text,
  status      text DEFAULT 'todo',
  priority    int,
  notes       text,
  blocked_by  text,
  updated_at  timestamptz DEFAULT now()
);

-- Decisions log: ersätter decisions.md
CREATE TABLE IF NOT EXISTS styr_decisions (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  project     text,
  decision    text,
  rationale   text,
  decided_by  text,
  decided_at  timestamptz DEFAULT now()
);

-- Session log: ersätter cc_session_log.md + daily_briefing.md
CREATE TABLE IF NOT EXISTS styr_session_log (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  agent       text,
  project     text,
  summary     text,
  decisions   jsonb,
  next_steps  jsonb,
  logged_at   timestamptz DEFAULT now()
);
```

### Steg 2: Migrera global_todo.md till styr_global_todo

Läs `state/global_todo.md` och INSERT alla aktiva tasks i tabellen. Använd ID från filen (E7, T1, S4 etc).

### Steg 3: Skriv första system_state

```sql
INSERT INTO styr_system_state (id, project, content, updated_by)
VALUES (
  'global',
  'styr-ai',
  '{"status": "migration complete", "ca_last_decision": "Supabase-arkitektur godkänd av Gustav 2026-04-01", "cc_task": "implementera migration"}',
  'CA'
);
```

### Steg 4: Rapportera tillbaka

När migrationen är klar — skriv en rad i `styr_session_log` med vad du gjort. CA läser det vid nästa boot.

### Steg 5: Bekräfta till Gustav

Skriv i terminalen vad som är klart och vad som eventuellt behöver Gustavs input.

---

## NUVARANDE PRIORITETSORDNING (oförändrad under migrationen)

### ENGRAMS
1. E7 — OPENAPI-001 ChatGPT Action (blockerare för Anna)
2. E8 — Anna onboarding (väntar på E7)
3. E9 — SUPABASE-SPLIT (lägre prio, ej blockerare)

### TRADESYS
1. T1 — ADD-NEW-AGENT3-001
2. T2 — DATA-EXTEND-001 (kräver Gustav)
3. T3 — MODEL-SCOREBOARD-001

### META
1. S4 — PAT_TOKEN tradesys1337

---

## TEKNISK STATE

**Engrams:** live, 5/5 e2e, API + MCP fungerar
**Styr.AI Supabase:** `crsonxfrylkpgrddovhu` — hit ska ny state
**TradeSys Supabase:** `hxikaojzwjtztyuwlxra` — oförändrat
**Engrams nyckel Anna:** eng_d98ad48a4fe579e04b8abc61aa3ea6ba562e4fa5331c1aef1d1847087c966cd8
