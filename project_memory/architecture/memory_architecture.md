# Engrams — Memory Architecture
*Designdokument för persistent memory-lagret. Läs innan implementation av #8-#10.*
*Skapad: 2026-03-28*

---

## Problemet vi löser

Anna lägger 2 timmar på att träna sin juridiska rådgivare-chat:
- "Du är min juridiska rådgivare, du känner till svensk rätt"
- Laddar upp avtal, bakgrund, preferenser
- Får hjälp med sitt ärende

Sex månader senare har hon ett nytt juridiskt problem. Hon vill inte börja om.
Engrams ska göra att all den tid hon lade på att "instruera och lära" chatten hänger med.

---

## De fyra minnestyperna

### Typ 1 — Profil (permanent)
**Vad:** Vem är användaren, hur vill de bli hjälpte, personliga preferenser.
**Exempel:** "Anna Garmen, driver [företag], föredrar direkt ton och punktform, räddar sig för långa svar"
**Livscykel:** Månader–år. Ändras sällan.
**Laddning:** Alltid vid boot. Liten fil, statisk.

### Typ 2 — Kontext (semi-permanent, projektspecifik)
**Vad:** Bakgrund för ett specifikt projekt, avtal, dokument, nyckelfakta.
**Exempel:** "Juridiskt projekt: Warner-avtal. Signerat april 2025. Sex dokumenterade brott."
**Livscykel:** Veckor–månader. Lever så länge projektet är aktivt.
**Laddning:** Bara när projektet är aktivt i sessionen.

### Typ 3 — Lärdomar (permanent, sökbar)
**Vad:** Beslut, strategier, insikter som ska överleva enskilda projekt.
**Exempel:** "Juridisk strategi: avslöja aldrig beräkningsmetod i informella kanaler"
**Livscykel:** Permanent. Relevanta lärdomar dyker upp när ämnet är liknande.
**Laddning:** Semantisk sökning, similarity > 0.75.

### Typ 4 — Episodiskt (temporärt, session-baserat)
**Vad:** Vad som hände i senaste sessionen, nästa steg, öppna frågor.
**Exempel:** "Diskuterade §8.3, nästa steg är audit 22 april"
**Livscykel:** Dagar–veckor. Ersätts av ny episode vid nästa handoff.
**Laddning:** Alltid vid boot (senaste episode per projekt).

---

## Databas-schema

```sql
CREATE TABLE memory_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('profile', 'context', 'learning', 'episode')),
  content TEXT NOT NULL,
  embedding VECTOR(1536),            -- OpenAI text-embedding-3-small
  tags TEXT[],                       -- valfria komplement till semantisk sökning
  relevance_score FLOAT DEFAULT 1.0, -- ökar när minnet hämtas (förstärkning)
  created_at TIMESTAMPTZ DEFAULT now(),
  last_accessed_at TIMESTAMPTZ
);

-- Semantisk sökning (pgvector)
CREATE INDEX ON memory_items USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- Snabb filtrering per projekt + typ
CREATE INDEX ON memory_items (project_id, type);
CREATE INDEX ON memory_items (project_id, relevance_score DESC);
```

---

## API-endpoints

### POST /api/mcp — tool: remember
```json
{
  "tool": "remember",
  "input": {
    "content": "Anna föredrar juridiska svar i punktform, max 3 alternativ",
    "type": "profile",
    "tags": ["preferenser", "juridik"]
  }
}
```
Systemet genererar embedding automatiskt via OpenAI.

### POST /api/mcp — tool: recall
```json
{
  "tool": "recall",
  "input": {
    "query": "Anna behöver hjälp med ett hyresavtal",
    "types": ["profile", "learning", "context"],
    "limit": 5,
    "threshold": 0.75
  }
}
```
Returnerar top-N minnen sorterade på similarity × relevance_score.

### POST /api/mcp — tool: forget
```json
{
  "tool": "forget",
  "input": { "memory_id": "uuid" }
}
```

### POST /api/mcp — tool: profile
```json
{
  "tool": "profile",
  "input": { "action": "read" }
}
// eller
{
  "tool": "profile",
  "input": {
    "action": "write",
    "content": "Anna Garmen, driver [företag], föredrar direkt ton"
  }
}
```

---

## Lazy loading-logik (viktigt för prestanda)

```
Vid varje ny session:

1. ALLTID ladda (snabbt, statisk):
   - profile (typ 1) för detta projekt
   - senaste episode (typ 4) för detta projekt

2. När användaren skriver sitt första meddelande:
   - Kör recall() med meddelandet som query
   - Hämta top-5 learnings med similarity > 0.75
   - Hämta aktiv context om projekt matchar

3. Ladda INTE:
   - Alla minnen från alla sessioner någonsin
   - Minnen med låg similarity
   - Andra projekts minnen
```

Med 10 000 minnen: semantisk sökning tar ~50ms i pgvector. Inte segt.

---

## Hur det känns för Anna

```
Anna: "Jag behöver hjälp med ett hyresavtal"

[Engrams kör recall("hyresavtal") i bakgrunden]
[Hittar: juridisk rådgivare-profil, tidigare avtalsstrategi, preferenser]

Claude: "Hej Anna. Vill du att jag tittar på avtalet ur samma perspektiv
som förra gången — fokus på ansvarsbegränsning och uppskovsrätt?

Ladda gerna upp avtalet så kör vi."
```

Anna förklarar inget från grunden. Claude vet redan hur hon vill ha det.

---

## Taggning vs vektorsökning

Taggar (är komplement, inte primär sökmetod):
- Används för filtrering: `tags @> '{juridik}'`
- Används när användaren explicit vill hämta något: `recall #juridik`
- Genereras automatiskt av Claude vid remember() — Anna ska aldrig behöva tagga manuellt

Vektorsökning (är primär sökmetod):
- Semantisk likhet utan att Anna vet vad som finns
- Hittar "hyresavtal" även om minnet sa "kommersiell lokalhyra"
- Kräver OpenAI embedding-API (text-embedding-3-small, $0.02/1M tokens — billigt)

---

## Implementationsordning (när #1 SQL-schema är klart)

1. Aktivera pgvector i Supabase (Settings → Database → Extensions)
2. Kör memory_items SQL
3. Bygg `lib/embeddings.js` — wrapper runt OpenAI embeddings API
4. Bygg `api/mcp` endpoints: remember, recall, forget, profile
5. Uppdatera CLAUDE.md boot-protokoll med recall-steg
6. Testa med Anna: lär systemet något, starta ny session, verifiera att det minns

---

## Miljövariabler som krävs

```
OPENAI_API_KEY     sk-... (för embeddings)
SUPABASE_URL       https://hxikaojzwjtztyuwlxra.supabase.co
SUPABASE_SERVICE_KEY  [finns redan]
```

---

## V2 — Team-minnesarkitektur (byggs efter V1)

När Anna-flödet valideras:
- `team_memory_items` — delade minnen alla team-members kan läsa
- `member_memory_items` — individuella minnen per person
- `recall` tar en `scope`-parameter: 'personal' | 'team' | 'both'
- @assign i todo kopplas till member_id
