# Protocol — brain architecture
*Skapad av CA: 2026-04-06*
*Scope: [engrams]*
*Status: VÄNTAR PÅ CC:s FEEDBACK*

---

## SEKTION 1 — CA:s spec [scope: alla]

Engrams implementerar ett minnessystem efter hjärnans distribuerade struktur.
Tre lager är live. Två ska byggas.

Full spec: `gustavkall/engrams/docs/brain-architecture-spec.md`
Whitepaper: `gustavkall/engrams/docs/whitepaper-v3.md`

---

### FAS 2: Amygdala — Prioriterat Minne

**Vad:** Decay-agent + priority_weight fält

**Decay-agent** (GitHub Actions cron 04:30 UTC):
```sql
-- Sänk relevance_score för ej-använda minnen
UPDATE memory_items 
SET relevance_score = relevance_score * 0.95
WHERE last_recalled_at < now() - interval '30 days'
  AND type IN ('context', 'learning')
  AND superseded_by IS NULL;

-- Soft-delete vid threshold
UPDATE memory_items
SET superseded_by = 'decay-agent'
WHERE relevance_score < 0.1
  AND type IN ('context', 'learning');
```

**priority_weight** (nytt fält):
```sql
ALTER TABLE memory_items ADD COLUMN priority_weight float DEFAULT 1.0;
```
- Vid `remember` med `priority: high` → `priority_weight = 2.0`
- Vid recall → `relevance_score * 1.05` (förstärkning)
- Vid decay → `relevance_score * 0.95`

**Undantag:** `episode` och `profile` decay:ar ALDRIG.

---

### FAS 3: Striatum — Habituellt Minne

**Villkor:** Aktivera när projektet har 100+ memory_items.

**Konsolideringsagent** (daglig cron):

1. **Deduplicering:** Hitta minnen med cosine similarity > 0.92. Behåll högst relevance_score, soft-delete övriga.

2. **Episod → Learning:** Om samma insikt dyker upp i 3+ episoder inom 30 dagar → extrahera som explicit learning.

3. **Mönsterigenkänning:** Semantic clustering på episoder → identifiera återkommande teman → skapa learning.

**Audit-tabell:**
```sql
CREATE TABLE memory_audit (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  operation text NOT NULL,
  source_id uuid REFERENCES memory_items(id),
  target_id uuid REFERENCES memory_items(id),
  reason text,
  created_at timestamptz DEFAULT now()
);
```

---

## SEKTION 2 — CC engrams feedback [scope: engrams]
*Status: VÄNTAR*

**CC: Läs brain-architecture-spec.md först. Svara på:**

### FAS 2: Amygdala
Feasibility:
Risker med decay (kan viktig info försvinna?):
Saknas något i last_recalled_at-spårningen idag?:
Ordning (vad måste byggas först?):
CC-notering:
Status:

### FAS 3: Striatum
Feasibility:
Hur kör vi cosine similarity-jämförelse i Supabase? (pgvector?):
Episod→Learning — hur extraherar CC insikten? (LLM-anrop?):
Mönsterigenkänning — räcker vår embedding-modell?:
CC-notering:
Status:

---

## SEKTION 3 — Syntes [scope: alla]
*Status: EJ PÅBÖRJAD*

---

## SEKTION 4 — Deployment [scope: engrams]
*Status: EJ PÅBÖRJAD*
