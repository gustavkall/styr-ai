# Protocol — brain architecture
*Skapad av CA: 2026-04-06*
*Scope: [engrams]*
*Status: DEPLOYED — Fas 2 live, Fas 3 byggd (inaktiv)*

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

**Konsolideringsagent** (daglig cron): Byggd, inaktiv. Aktiveras via `ENABLE_CONSOLIDATION=true` i GitHub Actions vars.

---

## SEKTION 2 — CC engrams feedback
*Status: KLAR (2026-04-06)*

## SEKTION 3 — Syntes
*Status: KLAR (2026-04-07)*

## SEKTION 4 — Deployment
*Status: DEPLOYED och VERIFIERAD av CC (2026-04-07)*

Fas 2 live: migration körd, sentinel-rad OK, memory-decay.yml aktiv, pinned-minnen skyddade.
Fas 3 byggd men inaktiv: consolidation-agent.yml live med feature flag check. Aktivera via `ENABLE_CONSOLIDATION=true` när 100+ minnen.
