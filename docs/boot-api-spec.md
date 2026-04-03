# Boot API + CLAUDE.md-standard — Implementation Spec
*Skriven av CA 2026-04-03. Baserad på CA+CC arkitekturanalys.*
*Godkänd av Gustav. Redo för CC att exekvera i ordning.*

---

## Problemet som löses

TradeSys CC vet inte vad CA prioriterat. Varje projekts CLAUDE.md är unik och
inkompatibel med de andra. Inget standardiserat sätt att bootat ett nytt projekt.

**Lösningen:** Ett Boot API som exponerar global state via HTTP — så att alla
projekt kan läsa styr_global_todo och styr_decisions med ett curl-anrop,
oavsett vilket Supabase-projekt de har tillgång till.

---

## Lagermodell (efter implementation)

```
Lager 1 — GLOBAL BOOT API
  GET https://www.engrams.app/api/boot?project=X&token=INTERN
  → tasks, beslut, CA/CC-kontext för projektet
  → Alla CLAUDE.md:s anropar detta vid boot
  → En källa, alla projekt synkade

Lager 2 — PROJEKTSPECIFIK STATE
  styr-ai    → crsonxfrylkpgrddovhu (styr_*)
  engrams    → crsonxfrylkpgrddovhu (styr_*)
  tradesys   → hxikaojzwjtztyuwlxra (egna tabeller)
  savage-roar → inget (nedprioriterat)

Lager 3 — PRODUKTDATA (Engrams-kunder)
  accounts, projects, memory_items, oauth_*
  Isolerat via RLS + api_key_hash
  Gustav är kund i sin egen produkt — nås via eng_-nyckel
  Separeras till eget Supabase-projekt vid 100 kunder
```

---

## STEG 1 — Boot API endpoint (api/boot.js)

Ny fil i `gustavkall/engrams` repot.

```javascript
// api/boot.js
// Intern endpoint — inte för Engrams-kunder
// Autentisering: BOOT_TOKEN env var (sätt i Vercel)

const { createClient } = require('@supabase/supabase-js');

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Auth: intern token
  const token = req.query.token || req.headers['x-boot-token'];
  if (token !== process.env.BOOT_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const project = req.query.project || 'styr-ai';
  const supabase = getSupabase();

  // Aktiva tasks för detta projekt
  const { data: tasks } = await supabase
    .from('styr_global_todo')
    .select('id, title, status, priority, notes, blocked_by')
    .eq('project', project)
    .neq('status', 'done')
    .order('priority');

  // Senaste beslut för detta projekt
  const { data: decisions } = await supabase
    .from('styr_decisions')
    .select('decision, rationale, decided_by, decided_at')
    .eq('project', project)
    .order('decided_at', { ascending: false })
    .limit(5);

  // Senaste CA-kontext
  const { data: caContext } = await supabase
    .from('styr_system_state')
    .select('value, updated_at')
    .eq('id', 'ca_context')
    .maybeSingle();

  // Senaste CC-session för detta projekt
  const { data: ccSession } = await supabase
    .from('styr_session_log')
    .select('summary, next_steps, logged_at')
    .eq('project', project)
    .eq('agent', 'CC')
    .order('logged_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  return res.status(200).json({
    ok: true,
    project,
    tasks: tasks || [],
    decisions: decisions || [],
    ca_context: caContext?.value || null,
    cc_last_session: ccSession || null,
    generated_at: new Date().toISOString()
  });
};
```

**Vercel env var att lägga till:**
```
BOOT_TOKEN=<generera med: openssl rand -hex 32>
```

**vercel.json — lägg till route:**
```json
{ "source": "/api/boot", "destination": "/api/boot" }
```

**Test:**
```bash
curl "https://www.engrams.app/api/boot?project=tradesys&token=DITT_TOKEN"
# Ska returnera aktiva T-tasks + senaste beslut
```

---

## STEG 2 — Standardiserad CLAUDE.md-mall

Sparas som `docs/claude-md-template.md` i styr-ai repot.
Används när nya projekt skapas och för att uppgradera befintliga.

```markdown
# CLAUDE.md — [PROJEKTNAMN]
*[Kort beskrivning av projektet]*

> Instruktioner hämtas från detta repo + global state via Boot API.
> Uppdatera denna fil när protokollet förändras.

---

## SESSION BOOT — OBLIGATORISK

### Steg 1: Global state
Kör:
```
curl -s "https://www.engrams.app/api/boot?project=[PROJEKT-ID]&token=[BOOT_TOKEN]"
```
Absorbera tasks, beslut och kontext. Presentera:
```
BOOT — [PROJEKT] — [DATUM]

AKTIVA TASKS:
  [lista från tasks[]]

SENASTE BESLUT:
  [lista från decisions[]]

CC SENAST:
  [från cc_last_session]
```

### Steg 2: Projektspecifikt
[Projektets egna instruktioner här]
[State-filer, Supabase-queries, etc]

---

## SESSION HANDOFF — OBLIGATORISK

### Steg 1: Uppdatera global state
Kör mot Supabase (crsonxfrylkpgrddovhu) eller via styr-ai MCP:
```sql
-- Uppdatera slutförda tasks
UPDATE styr_global_todo SET status = 'done' WHERE id = '[ID]';

-- Logga session
INSERT INTO styr_session_log (project, agent, summary, next_steps)
VALUES ('[PROJEKT-ID]', 'CC', '[vad gjordes]', '[nästa steg]');

-- Logga beslut
INSERT INTO styr_decisions (project, decision, rationale, decided_by)
VALUES ('[PROJEKT-ID]', '[beslut]', '[varför]', 'CC');
```

### Steg 2: Projektspecifikt
[Commit state-filer, push, etc]

---

## Projektidentitet

| Nyckel | Värde |
|--------|-------|
| Projekt-ID | [används i Boot API + Supabase] |
| Repo | gustavkall/[repo-namn] |
| Supabase | [projekt-ref] |
| Prioritet | [1-4] |

---

## Autonomigränser
Se gustavkall/styr-ai GOVERNANCE.md.
```

---

## STEG 3 — Uppdatera tradesys CLAUDE.md

Läs nuvarande tradesys CLAUDE.md. Lägg till Boot API-anropet i boot-protokollet
som Steg 1, före allt annat. Håll alla projektspecifika instruktioner intakta.

Struktur:
```
## SESSION BOOT
### Steg 1: Global state (Boot API)
curl "https://www.engrams.app/api/boot?project=tradesys&token=$BOOT_TOKEN"

### Steg 2: TradeSys-specifikt (befintliga instruktioner)
[allt som redan finns]
```

BOOT_TOKEN lagras i CC:s miljö — lägg till i `~/.zshrc`:
```bash
export BOOT_TOKEN="[token från Vercel]"
```

---

## STEG 4 — CLAUDE.md-mall som ny-projekt-standard

Uppdatera `go`-aliaset i `~/.zshrc` så att när ett nytt projekt skapas:
1. Repo skapas på GitHub
2. CLAUDE.md skapas från mallen automatiskt med rätt projekt-ID
3. Task läggs till i styr_global_todo via Boot API

Detta är ett separat jobb — lägg som S7 i Supabase.

---

## Vad som INTE ändras

- TradeSys behåller eget Supabase (rätt arkitekturbeslut)
- Savage-roar: inget görs nu
- Engrams API-endpoints: oförändrade
- Kunddataisolering: RLS räcker tills 100 kunder
- Gustav är kund i sin egen produkt — hans memory_items nås via eng_-nyckel

---

## Implementationsordning för CC

| Steg | Repo | Vad |
|------|------|-----|
| 1 | engrams | Skapa api/boot.js |
| 2 | engrams | Lägg till BOOT_TOKEN i Vercel |
| 3 | engrams | Uppdatera vercel.json med /api/boot route |
| 4 | engrams | Testa: curl /api/boot?project=tradesys |
| 5 | tradesys1337 | Uppdatera CLAUDE.md med Boot API i Steg 1 |
| 6 | styr-ai | Spara claude-md-template.md |
| 7 | lokalt | Lägg till BOOT_TOKEN i ~/.zshrc |

**Testa steg 1-4 noggrant innan du rör tradesys CLAUDE.md.**

---

## Commit-konvention
```
feat: boot-api — [vad]
chore: claude-md — [vad]
```
