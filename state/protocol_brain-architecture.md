# Protocol — brain architecture
*Skapad av CA: 2026-04-06*
*Scope: [engrams]*
*Status: SEKTION 3 KLAR — VÄNTAR PÅ GODKÄNNANDE FÖR DEPLOYMENT*

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
WHERE COALESCE(last_accessed_at, created_at) < now() - interval '30 days'
  AND type IN ('context', 'learning')
  AND superseded_by IS NULL
  AND pinned = false;

-- Soft-delete vid threshold
UPDATE memory_items
SET superseded_by = '00000000-0000-0000-0000-000000000001',
    decay_reason = 'auto-decay threshold 0.1'
WHERE relevance_score < 0.1
  AND type IN ('context', 'learning')
  AND pinned = false;
```

**priority_weight** (nytt fält):
```sql
ALTER TABLE memory_items ADD COLUMN priority_weight float DEFAULT 1.0;
ALTER TABLE memory_items ADD COLUMN pinned boolean DEFAULT false;
ALTER TABLE memory_items ADD COLUMN decay_reason text;
```
- Vid `remember` med `priority: high` → `priority_weight = 2.0`
- Vid recall → `relevance_score * 1.05` (förstärkning)
- Vid decay → `relevance_score * 0.95`
- `pinned = true` → decay körs aldrig (manuellt satt)

**Sentinel-rad (kör en gång):**
```sql
INSERT INTO memory_items (id, content, type, project_id)
VALUES ('00000000-0000-0000-0000-000000000001', 'decay-agent sentinel', 'profile', (SELECT id FROM projects LIMIT 1));
```

**Undantag:** `episode` och `profile` decay:ar ALDRIG.

---

### FAS 3: Striatum — Habituellt Minne

**Villkor:** Aktivera när projektet har 100+ memory_items (env var `ENABLE_CONSOLIDATION=true`).

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
*CC-engrams. Datum: 2026-04-06*

### FAS 2: Amygdala
Feasibility: Enkel. Decay-agenten är en GitHub Actions cron med två SQL-queries. priority_weight är en ALTER TABLE + minor API-ändring.

Risker med decay: Medel. En viktig learning som inte recall:as på 60 dagar når 0.1 och soft-deletes. Mitigering: superseded_by-modellen gör det reversibelt — decay sätter superseded_by='decay-agent', inte hård DELETE. Kan återställas. Rekommendation: lägg till en "pinned" boolean — manuellt pinnade minnen decay:ar aldrig.

Saknas något i last_recalled_at?: Ja — last_accessed_at uppdateras av boost_relevance() vid recall, men bara för minnen som faktiskt returneras (similarity > threshold). Minnen som aldrig matchar en query får aldrig last_accessed_at satt. Det betyder att decay-agentens WHERE last_recalled_at < 30d bör använda COALESCE(last_accessed_at, created_at) för att hantera minnen som aldrig recall:ats.

Ordning: (1) ALTER TABLE: priority_weight + eventuellt pinned. (2) Uppdatera remember.js att sätta priority_weight vid priority:high. (3) Decay-agent cron (.github/workflows/memory-decay.yml). (4) Verifiera.

CC-notering: superseded_by-kolumnen är uuid FK till memory_items(id). Att sätta den till strängen 'decay-agent' kraschar — det är inte en giltig UUID. Lösning: använd en sentinel UUID (00000000-0000-0000-0000-000000000001) eller NULL + en separat decay_reason-kolumn. Enklast: skapa en dummy memory_item-rad med känt ID som decay-agent-markör.

Status: KLAR

### FAS 3: Striatum
Feasibility: Komplex. Kräver LLM-anrop (inte bara SQL). Bör vänta tills 100+ minnen.

Cosine similarity i Supabase: Ja, pgvector stöder det direkt. Query: SELECT a.id, b.id, 1-(a.embedding <=> b.embedding) as sim FROM memory_items a CROSS JOIN memory_items b WHERE a.id < b.id AND a.project_id = b.project_id AND 1-(a.embedding <=> b.embedding) > 0.92. Fungerar men O(n²) — vid 1000+ minnen behövs batching eller en IVF-index med probes.

Episod→Learning: Kräver LLM-anrop. SQL hittar kluster av liknande episoder, men att extrahera insikten som en concise learning kräver att man skickar episoderna till Claude/GPT API och ber om en syntes. Cost: ~/bin/zsh.01 per konsolidering vid Haiku. GitHub Action → Claude API → remember(type:learning).

Mönsterigenkänning: text-embedding-3-small (1536 dim) räcker för semantic clustering. K-means eller DBSCAN på embedding-vektorer identifierar kluster. Kan köras i Python i GitHub Action. Begränsning: embedding-modellen fångar semantik men inte temporala mönster ("detta diskuteras varje måndag"). Temporal analys kräver separat logik.

CC-notering: Fas 3 är rätt att vänta med. 30 minnen ger inte meningsfulla kluster. Rekommendation: bygg decay-agenten (Fas 2) nu, aktivera Fas 3 med en feature flag (env var ENABLE_CONSOLIDATION=true) när datavolymen motiverar det.

Status: KLAR

---

## SEKTION 3 — Syntes [scope: alla]
*CA-syntes. Datum: 2026-04-07*

### Vad CC:s feedback förändrar i specen

**Tre konkreta korrektioner absorberade:**

1. **superseded_by är UUID FK — inte sträng.** CA:s ursprungliga spec satte `superseded_by = 'decay-agent'` vilket kraschar DB. Fix: sentinel-rad med känt UUID `00000000-0000-0000-0000-000000000001` + separat `decay_reason text`-kolumn. Sektion 1 uppdaterad.

2. **COALESCE(last_accessed_at, created_at) — inte last_recalled_at.** Minnen som aldrig recall:ats har NULL i last_accessed_at. Utan COALESCE → de decay:as aldrig oavsett ålder. Fix absorberad i decay-query ovan.

3. **`pinned` boolean är nödvändig — inte optional.** Utan den finns inget sätt att skydda kritiska minnen (t.ex. profil-facts, system-instruktioner) från automatisk decay. Lägg till i ALTER TABLE.

### Rekommendation: deployment-ordning

**Fas 2 (Amygdala) — bygg nu:**
1. Migration: `priority_weight float`, `pinned boolean`, `decay_reason text`
2. Sentinel-rad insert (UUID 000...001)
3. Uppdatera `remember.js` — sätt `priority_weight = 2.0` vid `priority: high`
4. GitHub Action `memory-decay.yml` — cron 04:30 UTC
5. Verifiera: skapa ett minne, vänta ej — kör agenten manuellt, kontrollera att `pinned=true`-minnen inte berörs

**Fas 3 (Striatum) — feature-flaggad, aktivera vid 100+ minnen:**
- Feature flag: env var `ENABLE_CONSOLIDATION=true` i GitHub Action
- Ingen kod-deploy krävs för aktivering — agenten checkar flaggan vid start
- Bygg agenten nu (koden är klar att skriva), men starta den inte

### Riskbedömning

| Risk | Sannolikhet | Mitigering |
|------|-------------|------------|
| Decay tar viktigt minne | Medel | `pinned=true`, sentinel-UUID, reversibelt via superseded_by |
| UUID FK kraschar | Hög om ej fixat | Sentinel-rad löser |
| Fas 3 ger meningslösa kluster vid låg volym | Hög | Feature flag — aktivera vid 100+ |
| O(n²) similarity vid stor volym | Låg (<1000 minnen) | IVF-index när nödvändigt |

### Slutsats

Fas 2 är redo för deployment. CC behöver bara godkännande — ingen ytterligare spec-iteration krävs.
Fas 3 ska byggas men inte aktiveras. Feature flag = noll-kostnad safeguard.

Status: KLAR — VÄNTAR PÅ GUSTAVES GODKÄNNANDE FÖR SEKTION 4 (DEPLOYMENT)

---

## SEKTION 4 — Deployment [scope: engrams]
*Status: VÄNTAR PÅ GODKÄNNANDE*

När Gustav godkänner: CC kör deployment av Fas 2 enligt ordningen i Sektion 3.
