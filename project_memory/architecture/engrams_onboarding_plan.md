# Engrams — Onboarding & Arkitekturplan
*Skapad: 2026-03-28. Läs denna i nästa session innan implementation startar.*

---

## Beslutad arkitektur

**Database-only (default)** — kunden behöver inget eget repo.
Allt minne lagras i Engrams Supabase, isolerat per projekt via API-nyckel.
Engrams skriver ALDRIG till kundens repo eller databas — det är kundens agents uppgift.

**Hybrid (enterprise-option, byggs senare)** — state-filer i kundens repo + Engrams som API-lager.

---

## Databasschema

```sql
-- Kör i styr-ai Supabase-projekt (hxikaojzwjtztyuwlxra)

-- 1. Accounts (en per betalande kund)
CREATE TABLE IF NOT EXISTS accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'team')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  cancelled_at TIMESTAMPTZ
);

-- 2. Projects (N per account)
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  project_name TEXT NOT NULL,
  api_key TEXT UNIQUE NOT NULL,  -- visa bara vid skapande, lagra hashad
  api_key_hash TEXT NOT NULL,    -- bcrypt/sha256 av api_key
  created_at TIMESTAMPTZ DEFAULT now(),
  last_used_at TIMESTAMPTZ
);

-- 3. Sessions (allt minne per projekt)
CREATE TABLE IF NOT EXISTS sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  agent_id TEXT,
  summary TEXT,
  changes JSONB,
  next_steps JSONB,
  project_phase TEXT,
  energy TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Decisions (strukturella beslut per projekt)
CREATE TABLE IF NOT EXISTS decisions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  decision TEXT NOT NULL,
  rationale TEXT,
  impact TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Waitlist (redan skapad)
-- waitlist-tabellen finns redan

-- Index
CREATE INDEX ON projects (account_id);
CREATE INDEX ON projects (api_key_hash);
CREATE INDEX ON sessions (project_id, created_at DESC);
CREATE INDEX ON decisions (project_id, created_at DESC);
```

---

## Stripe-webhook flöde

```
Kund betalar på engrams.app
  → Stripe skapar subscription
  → Webhook POST till engrams.app/api/stripe-webhook
  → Vercel serverless function:
      1. Verifiera Stripe-signatur
      2. Skapa rad i accounts (email, plan, stripe_customer_id)
      3. Skapa första projekt i projects (project_name='default')
      4. Generera API-nyckel (crypto.randomUUID() + prefix 'eng_')
      5. Spara api_key_hash i projects, returnera api_key ALDRIG i DB
      6. Skicka bekräftelsemail med api_key via Resend/SendGrid
  → Kund får mail: "Your Engrams API key: eng_xxxx"
```

---

## Filer att bygga

```
engrams/
  api/
    stripe-webhook.js     ← NY: hanterar Stripe-events
    create-project.js     ← NY: kund skapar extra projekt
    waitlist.js           ← finns redan
  lib/
    supabase.js           ← NY: supabase client (delas av alla API-routes)
    api-key.js            ← NY: generera + validera API-nycklar
    email.js              ← NY: skicka bekräftelsemail
```

---

## Implementationsordning

### Steg 1 — SQL (15 min)
Kör schema ovan i Supabase SQL Editor.
Kontrollera att waitlist-tabellen inte krockar.

### Steg 2 — lib/api-key.js (15 min)
```javascript
import crypto from 'crypto';

export function generateApiKey() {
  const raw = 'eng_' + crypto.randomBytes(32).toString('hex');
  const hash = crypto.createHash('sha256').update(raw).digest('hex');
  return { raw, hash };
}

export function hashApiKey(raw) {
  return crypto.createHash('sha256').update(raw).digest('hex');
}
```

### Steg 3 — api/stripe-webhook.js (45 min)
Hanterar `checkout.session.completed` och `customer.subscription.deleted`.
Kräver: `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET` i Vercel env vars.

### Steg 4 — lib/email.js (30 min)
Använd Resend (gratis 3000 mail/mån): https://resend.com
Kräver: `RESEND_API_KEY` i Vercel env vars.
Mall: bekräftelsemail med API-nyckel + länk till /docs.

### Steg 5 — Stripe-produkter (15 min)
Skapa i Stripe Dashboard:
- Free (0 kr) — 1 projekt, 30 dagars minne
- Pro (190 kr/mån) — 5 projekt, obegränsat minne
- Team (490 kr/mån) — 20 projekt, team-delning

### Steg 6 — Stripe-betalknapp på sajten (30 min)
Lägg till prissektion på engrams.app med Stripe Checkout-länkar.

---

## Miljövariabler att lägga till i Vercel (engrams-projekt)

```
STRIPE_SECRET_KEY          sk_live_...
STRIPE_WEBHOOK_SECRET      whsec_...
RESEND_API_KEY             re_...
SUPABASE_URL               https://hxikaojzwjtztyuwlxra.supabase.co
SUPABASE_SERVICE_KEY       [finns redan]
```

---

## Kundens upplevelse (hela flödet)

```
1. Kund besöker engrams.app
2. Klickar "Get early access" eller "Pro"
3. Stripe Checkout → betalar
4. Får mail inom 30 sekunder:
   Ämne: "Your Engrams API key"
   Innehåll:
     API key: eng_a3f9...
     Project: default
     Docs: https://engrams.app/docs

     Add to Claude Project Instructions:
     Engrams API key: eng_a3f9...
     Engrams endpoint: https://engrams.app/api/mcp

5. Kund klistrar in i Claude → klar
```

---

## Vad Engrams INTE gör (viktigt)

- Skriver INTE till kundens repo
- Har INTE tillgång till kundens kodbas
- Läser INTE kundens privata filer
- Allt minne lagras i Engrams Supabase, isolerat per API-nyckel
- Kunden äger sitt minne — kan exportera via API när som helst

---

## Nästa session — exakt ordning

1. Kör SQL-schema i Supabase
2. Bygg lib/api-key.js
3. Bygg api/stripe-webhook.js
4. Skapa Resend-konto + lib/email.js
5. Skapa Stripe-produkter
6. Lägg till prissektion på sajten
7. Testa hela flödet end-to-end med testkort
