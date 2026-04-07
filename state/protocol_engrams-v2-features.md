# Protocol — engrams v2 features
*Skapad av CA: 2026-04-06*
*Scope: [engrams]*
*Status: SEKTION 4 KLAR — VÄNTAR PÅ GUSTAVES GODKÄNNANDE*

---

## SEKTION 1 — CA:s specs [scope: alla]

---

### SPEC: E17 — TEAMS-V2
**Team-lager, activity feed, scope på minnen**

Full spec: `gustavkall/engrams/docs/teams-v2-implementation-spec.md`

Sammanfattning:
- Ny tabell `teams` + `team_members`
- Minnen får `scope` (private/team/public)
- Activity feed per team
- Bakåtkompatibelt — Anna påverkas inte

Ordning: Steg 1-3 (Supabase migration) måste köras och verifieras innan API-kod rörs.

CC: Läs den fullständiga spec-filen. Bekräfta att implementationsordningen är korrekt och att du är redo att köra steg 1 när Gustav godkänner.

---

### SPEC: E8 — ANNA ONBOARDING
**Skicka onboarding-mail och verifiera att Anna aktiverar**

Status: Mail draftat, väntar på Gustavs godkännande. Skickas tisdag 8 april.

Nästa steg efter skickat:
1. Verifiera att Anna skapar konto via GPT-länken
2. Verifiera att hennes API-nyckel fungerar (minst ett remember-anrop)
3. Om inget hänt efter 48h: följdmail

CC: Bygg en enkel monitor — kolla en gång per dag om Anna:s konto har minnen. Om ja: logga till Engrams. Kan vara ett GitHub Actions cron-jobb.

---

### SPEC: E14 — GEMINI-NATIVE-001
**Gemini-integration för Engrams**

Problem: Sandbox blockerar Gemini Extensions API. Lägre prio än ChatGPT.

Status: Parkerad tills sandbox-restriktioner lättas eller alternativ väg hittas.

CC: Undersök om Google AI Studio har ett alternativ till Extensions som inte kräver sandbox-godkännande. Rapportera vad som krävs.

---

### SPEC: E15 — MEMORY-FORGETTING-001
**Automatisk förgletelse av gamla/inaktuella minnen**

Problem: Minnen ackumuleras utan utgångsdatum. Gamla context-minnen kan ge fel information vid recall.

Lösning: relevance_score decay — minnen får lägre score över tid om de inte recall:as.
```sql
-- Daglig cron: sänk relevance_score för ej-recall:ade minnen
UPDATE memory_items 
SET relevance_score = relevance_score * 0.95
WHERE last_recalled_at < now() - interval '30 days'
  AND type IN ('context', 'learning');
```

Episodes och profiles: aldrig decay.
Threshold för borttagning: relevance_score < 0.1.

CC: Är decay-modellen rimlig? Risk för att viktig information försvinner?

---

### SPEC: E16 — MEMORY-CONSOLIDATION-001
**Konsolidera duplikata/liknande minnen**

Problem: Samma faktum kan lagras flera gånger med lite olika formulering. Fyller upp minnesutrymmet och sänker recall-precision.

Lösning: Konsolideringsagent kör dagligen:
1. Hitta minnen med cosine similarity > 0.92
2. Behåll det med högst relevance_score, soft-delete de andra
3. Logga konsolideringar till en audit-tabell

CC: Har vi tillräcklig data för att testa detta nu? Vad är lämplig similarity-threshold?

---

## SEKTION 2 — CC engrams feedback [scope: engrams]
*CC-engrams. Datum: 2026-04-05*

### E17 — TEAMS-V2
Feasibility: Komplex (2-3 veckor)
Implementationsordning korrekt?: Ja. Steg 1-3 (schema: teams, team_members, scope-kolumn) måste köras och verifieras innan API-kod rörs. Spec i docs/teams-v2-implementation-spec.md är komplett.
Redo att starta steg 1?: Ja, när Gustav godkänner. Inga blockerare.
Status: KLAR

### E8 — Anna monitor
Feasibility: Enkel. GitHub Actions cron dagligen som kollar om Annas account (anna.garmen@gmail.com) har memory_items med created_at senaste 24h. Om ja: logga till Engrams. Om 48h utan aktivitet: logga alert.
CC-notering: Kräver SUPABASE_URL + SUPABASE_SERVICE_KEY som GitHub secrets — samma som demo-cleanup och uptime. E-GITHUB-SECRET-001 är blockerare för alla tre workflows.
Status: KLAR

### E14 — GEMINI
Alternativ till sandbox?: Google AI Studio stöder "Grounding with Google Search" men inte custom API-anrop som Engrams kräver. Gemini API har function calling — det är vägen. Man bygger en Gemini "tool" som anropar Engrams REST API (remember/recall). Ingen sandbox-godkännande behövs — det är vanlig function calling. Kräver: en docs-sida med Gemini function-definition JSON + instruktioner.
CC-notering: Enklare än vi trodde. Gemini function calling + Engrams REST API = funkar idag utan ny kod. Bara dokumentation.
Status: KLAR

### E15 — FORGETTING
Decay-modell rimlig?: Ja, 0.95 per dag för ej-recall:ade >30 dagar är rimligt. Ett minne som inte recall:as på 30 dagar tappar ~78% efter 30 dagar till (0.95^30 = 0.21). Efter 60 dagar utan recall: under 0.1-tröskeln.
Risk för informationsförlust?: Medel. En viktig learning som är relevant men inte sökts på 60 dagar försvinner. Lösning: soft-delete (superseded_by-modellen) istället för hård DELETE. Minnet kan återställas via audit-endpoint. Profiler och episodes ska aldrig decay:a — det är korrekt i specen.
Status: KLAR

### E16 — CONSOLIDATION
Tillräcklig data nu?: Nej. Vi har ~30 memory_items, mest E2E-testdata. Konsolidering ger värde vid 100+ minnen per projekt. Bygga nu = overengineering.
Lämplig threshold?: 0.92 cosine similarity är rimligt för near-duplicates. 0.85 fångar parafraseringar men riskerar att slå ihop relaterade-men-olika minnen. Rekommendation: börja med 0.92, sänk till 0.88 efter manuell granskning av första batchens resultat.
Status: KLAR

---

## SEKTION 3 — Syntes [scope: alla]
*CA-syntes. Datum: 2026-04-07*

### Vad CC:s feedback förändrar i specen

**E14 (Gemini) — status ändras från parkerad till klar utan kod:**
CC:s insikt: Gemini function calling fungerar med Engrams REST API redan idag. Inget sandbox-godkännande krävs. Enda leverabeln är en dokumentationssida med Gemini function-definition JSON. Det är ett [CA]-jobb — ingen CC-implementation behövs.

**E15 (Forgetting) — absorberas i brain-architecture:**
Decay-logiken i E15 är identisk med Amygdala-fas 2 (protocol_brain-architecture). CC bekräftar modellen som rimlig med soft-delete som säkerhetsnät. E15 är redundant — den löses av brain-arch deploy. Ingen separat implementation.

**E16 (Consolidation) — absorberas i brain-architecture:**
Identisk med Striatum-fas 3. CC bekräftar: bygg nu, aktivera vid 100+ minnen. Feature-flaggad. E16 är redundant — löses av brain-arch deploy. Ingen separat implementation.

**E8 (Anna monitor) — blockat av GitHub secrets:**
CC:s Anna-monitor är redo att bygga, men E-GITHUB-SECRET-001 (sätt SUPABASE_URL + SUPABASE_SERVICE_KEY i GitHub) är blockerare. Ingen deploy av Anna-monitor förrän secrets är satta. Det är ett [Gustav]-jobb.

**E17 (Teams) — redo att starta steg 1 när Gustav godkänner:**
CC bekräftar att implementationsordningen är korrekt och att inga blockerare finns.

### Prioriteringsordning för deployment

| Prio | Spec | Vad | Ägare | Blockerare |
|------|------|-----|-------|-----------|
| 1 | E-GITHUB-SECRET-001 | Sätt GitHub secrets | [Gustav] | — |
| 2 | E8 Anna monitor | GitHub Action cron | [CC-eng] | GitHub secrets |
| 3 | E14 Gemini-docs | Docs-sida med function JSON | [CA] | — |
| 4 | E17 Teams steg 1-3 | Supabase schema | [CC-eng] | Gustavs godkännande |
| 5 | E15/E16 | Ingenting separat — löses av brain-arch | — | brain-arch deploy |

### Slutsats

Tre av fem specs konvergerar: E15 och E16 är täckta av brain-architecture-protokollet. E14 kräver bara dokumentation av CA. Blockeraren för E8 är Gustav (GitHub secrets) — inte CC.

---

## SEKTION 4 — Deployment [scope: engrams]
*CA-plan. Datum: 2026-04-07*
*Status: VÄNTAR PÅ GUSTAVES GODKÄNNANDE*

### CC-instruktioner

**TASK 1: E8 — Anna monitor (kör efter E-GITHUB-SECRET-001)**

Bygg `.github/workflows/anna-monitor.yml`:

```yaml
name: Anna Onboarding Monitor
on:
  schedule:
    - cron: '0 9 * * *'    # 09:00 UTC dagligen
  workflow_dispatch:

jobs:
  monitor:
    runs-on: ubuntu-latest
    steps:
      - name: Check Anna activity
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_KEY: ${{ secrets.SUPABASE_SERVICE_KEY }}
          ENGRAMS_KEY: ${{ secrets.ENGRAMS_KEY }}
        run: |
          # Hämta Annas account (anna.garmen@gmail.com) memory_items senaste 24h
          RESULT=$(curl -s "$SUPABASE_URL/rest/v1/memory_items?select=id,created_at&user_email=eq.anna.garmen@gmail.com&created_at=gte.$(date -d '24 hours ago' --iso-8601=seconds)" \
            -H "apikey: $SUPABASE_SERVICE_KEY" \
            -H "Authorization: Bearer $SUPABASE_SERVICE_KEY")
          COUNT=$(echo $RESULT | python3 -c "import json,sys; print(len(json.load(sys.stdin)))")
          if [ "$COUNT" -gt "0" ]; then
            echo "Anna active — $COUNT memories in last 24h"
            # Logga till Engrams
            curl -s -X POST "https://engrams.app/api/remember" \
              -H "Authorization: Bearer $ENGRAMS_KEY" \
              -H "Content-Type: application/json" \
              -d "{\"content\":\"Anna Garmen aktiv i Engrams — $COUNT minnen senaste 24h\",\"type\":\"episode\",\"project\":\"engrams\"}"
          else
            echo "Anna not yet active"
          fi
```

OBS: CC anpassar Supabase-queryn till faktisk schema (user_id via email lookup, inte user_email direkt).

**TASK 2: E17 — Teams steg 1 (kör separat, efter Gustavs godkännande)**

Kör migration från `docs/teams-v2-implementation-spec.md` steg 1-3. Verifiera varje steg innan nästa. Logga som episode i Engrams.

**TASK 3: E14 — Gemini docs (CA-jobb, ej CC)**

CA skriver Gemini integration-sida till `engrams/docs/gemini-integration.md`. Innehåller: function definition JSON för remember + recall, exempel på Gemini system prompt, teststeg. Ingen CC-implementation krävs.

### Vad CC INTE ska göra
- Inte implementera E15 eller E16 separat — täcks av brain-architecture
- Inte starta E17 förrän Gustavs godkännande
- Inte starta E8 förrän GitHub secrets är satta

### Godkännande-signal
Gustav skriver "kör engrams-v2 deploy" → CC kör Task 1 (Anna monitor) om secrets är satta.
Gustav skriver "kör teams deploy" → CC kör Task 2 (Teams steg 1-3).
