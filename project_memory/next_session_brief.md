# Next Session Brief
*Följ dessa instruktioner exakt vid nästa sessionstart.*

---

## Rekommenderat kommando att starta med

```
session boot engrams
```

## Fokus: Bygga Engrams V1 — Stripe + Memory API

TVÅ parallella spår nästa session:

**Spår A — Stripe (kräver Gustav):**
Först måste Gustav lägga till miljövariabler i Vercel (engrams-projekt):
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- RESEND_API_KEY
- OPENAI_API_KEY

När det är gjort: Claude bygger `lib/api-key.js` + `api/stripe-webhook.js` + `lib/email.js`

**Spår B — Memory API (kan startas direkt):**
Databas är klar. Claude kan börja med `lib/embeddings.js` + `api/mcp` endpoints direkt.
Kräver bara OPENAI_API_KEY i Vercel.

## Vad Gustav behöver göra

1. Lägg till i Vercel → engrams-projekt → Environment Variables:
   ```
   OPENAI_API_KEY    sk-...
   STRIPE_SECRET_KEY sk_live_... (eller sk_test_... för test)
   STRIPE_WEBHOOK_SECRET whsec_...
   RESEND_API_KEY    re_...
   ```
2. Koppla Supabase MCP till CC (en gång):
   ```bash
   claude mcp add --scope project --transport http supabase "https://mcp.supabase.com/mcp?project_ref=crsonxfrylkpgrddovhu"
   ```

## Warner
- Frist 29 mars passerade. Audit 22 april = 25 dagar.
- Fråga Gustav: har Warner hört av sig?

## TRADESYS
- Agent 4 + 6 behöver omstart i CC med ny kod
- FMP $29/mån låser upp short interest
