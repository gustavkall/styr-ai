# PROJECT.md — Styr.AI
*Projektidentitet för styr-ai meta-systemet.*
*Läses vid boot efter GOVERNANCE.md.*

---

## Identitet

```
PROJECT_ID:     styr-ai
DISPLAY_NAME:   Styr.AI
LAYER:          meta
REPO:           gustavkall/styr-ai
SUPABASE_REF:   hxikaojzwjtztyuwlxra
GOVERNANCE:     https://raw.githubusercontent.com/gustavkall/styr-ai/main/GOVERNANCE.md
```

---

## Syfte

Meta-system. Övervakar, koordinerar och minns alla underprojekt.
Gustav godkänner riktning — systemet exekverar och rapporterar.

---

## Projektspecifika regler

- Äger GOVERNANCE.md — grundlagar för alla projekt
- Äger COMMANDS.md — alla kommandon
- Äger engrams_todo.md — Engrams master todo
- COO-agent och autonomous-agent: pausade (API-kostnad)
- market-regime-agent + top-gainers-agent: aktiva vardagar
- memory-integrity-agent: aktiv söndagar

---

## MCP-verktyg (autonomt)

- Supabase MCP: hxikaojzwjtztyuwlxra — alla tabeller
- GitHub MCP: alla repos
- Vercel MCP: team_pp2fvMpvzRPz7AfSGFMVttPs
- Gmail MCP: läsa/drafta (ej skicka)

---

## Autonomigränser (utover GOVERNANCE.md)

Får autonomt:
- Läsa alla state-filer i alla repos
- Skriva state-filer, committa
- Köra SQL-migrations i Supabase
- Uppdatera work_queue, engrams_todo, active_context

Kräver godkännande:
- Ändra GOVERNANCE.md
- Ändra goals.md eller system_rules.md
- Starta nya agenter
- Skapa nya projekt i Supabase
