# Multi-projekt arkitektur — Designdokument
*Skapad: 2026-03-27. Implementeras imorgon 2026-03-28 FÖRST.*

> **BLOCKERARE:** Anna får INTE onboardas förrän Steg 1 är deployad.
> Risken: Om Anna har 2+ projekt blandas minnena ihop med nuvarande arkitektur.

---

## Nuläget (problemet)

```
projects-tabell:
  id | api_key | name | plan
  
Supabase RLS: sessions.project_id = projects.id
```

En kund med två projekt måste idag skapa två separata konton (två olika mail). Det är inte skalbart och skapar förvirring.

---

## Steg 1 — Fix för Anna (30 min, imorgon morgon)

**Princip:** En nyckel per projekt. Kunden skapar N nycklar, en per projekt. Ingen databasändring krävs — bara tydligare instruktion + `project_name` i svaret.

**Ändring i `read_memory`-svaret:**
Lägg till `project_name` och `project_id` explicit i svaret så kunden ser vilket projekt nyckeln tillhör.

**Ändring i CLAUDE.md-template för kunder:**
```markdown
## Persistent Memory
API: https://app.savageroar.se/api/mcp
Key: [PROJEKT-SPECIFIK-NYCKEL]   ← en nyckel per projekt
agent_id: [projektnamn-maskin]   ← identifierar vilket projekt
```

**Supabase:** Lägg till `project_name` kolumn i projects-tabellen om den saknas.
```sql
ALTER TABLE projects ADD COLUMN IF NOT EXISTS project_name TEXT;
UPDATE projects SET project_name = name WHERE project_name IS NULL;
```

Detta löser Anna direkt — hon skapar en nyckel per projekt, varje nyckel har sitt eget minne.

---

## Steg 2 — Skalbar multi-projekt arkitektur (2h, parallellt med Stripe)

**Princip:** accounts ovanför projects. En kund = ett konto = N projekt = N nycklar.

### Databasschema

```sql
-- Nytt: accounts-tabell
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT,
  plan TEXT DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Uppdatera: projects får account_id
ALTER TABLE projects ADD COLUMN account_id UUID REFERENCES accounts(id);

-- api_keys får egen tabell (en per projekt)
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES accounts(id),
  project_id UUID REFERENCES projects(id),
  key TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
  name TEXT,  -- ex: "iOS App", "Backend API"
  created_at TIMESTAMPTZ DEFAULT now(),
  revoked_at TIMESTAMPTZ
);
```

### API-ändring

Authenticate-funktionen i `api/mcp.js` uppdateras:
```javascript
async function authenticate(req) {
  const key = req.headers['authorization']?.replace('Bearer ', '').trim();
  if (!key) throw new Error('Missing API key');
  
  // Slå upp nyckeln i api_keys-tabellen
  const { data, error } = await sb
    .from('api_keys')
    .select('*, projects(*), accounts(*)')
    .eq('key', key)
    .is('revoked_at', null)
    .single();
    
  if (error || !data) throw new Error('Invalid API key');
  return { ...data.projects, account: data.accounts, key_name: data.name };
}
```

### Dashboard-uppdatering

Kunden loggar in med email → ser alla sina projekt → kan skapa/ta bort nycklar per projekt.

```
Kund Anna:
  Konto: anna@gmail.com
  └── Projekt: "iOS App"
      └── Nyckel: abc-123 (aktiv)
  └── Projekt: "Backend API"  
      └── Nyckel: def-456 (aktiv)
      └── Nyckel: ghi-789 (revokad)
```

### Stripe-webhook (när vi bygger STRIPE-001)

```javascript
// POST /api/stripe-webhook
// checkout.session.completed → skapa account + första projekt + första api_key
const account = await createAccount(email, stripeCustomerId);
const project = await createProject(account.id, 'Default Project');
const apiKey = await createApiKey(account.id, project.id, 'Default Key');
await sendWelcomeEmail(email, apiKey.key);
```

---

## Bakåtkompatibilitet

Nuvarande api_key i projects-tabellen funkar under migreringsperioden:
1. authenticate() kollar api_keys-tabellen FÖRST
2. Om inte hittat — fallback till gamla projects.api_key
3. Efter migration: ta bort fallback

Inget bryts för befintliga kunder under övergången.

---

## Implementeringsordning imorgon

1. Kör SQL-migration Steg 1 i Supabase (5 min)
2. Uppdatera CLAUDE.md-template med tydligare nyckel-per-projekt instruktion (5 min)
3. Deploya — Anna kan onboardas (20 min)
4. Bygg Steg 2 parallellt med Stripe (2h)
5. Migrera befintliga nycklar till nya tabellen (15 min)
6. Testa hela flödet med Annas nyckel (15 min)
