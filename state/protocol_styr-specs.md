# Protocol — styr-ai specs batch
*Skapad av CA: 2026-04-06*
*Scope: [engrams] [tradesys]*
*Status: SEKTION 3 KLAR — VÄNTAR PÅ GUSTAVES GODKÄNNANDE FÖR SEKTION 4*

---

## SEKTION 1 — CA:s specs [scope: alla]

---

### SPEC: MASTER-CONFIG-001
**Manifest-driven sync via styr-ai/config/master.yml**

Problem: sync.sh och deploy.sh duplicerar konfiguration (API-nycklar, repo-namn, Engrams-nyckel) i varje repo. Ändrar vi något måste vi uppdatera tre filer.

Lösning: En `master.yml` i styr-ai definierar all konfiguration. sync.sh/deploy.sh laddar den vid körning.

```yaml
# styr-ai/config/master.yml
projects:
  engrams:
    repo: gustavkall/engrams
    protocol_scope: engrams
    engrams_key: eng_9d3d7...
    todo_file: state/todo.md
  tradesys:
    repo: gustavkall/tradesys-models
    protocol_scope: tradesys
    engrams_key: eng_9d3d7...
    todo_file: state/todo.md (från tradesys1337)

global:
  styr_repo: gustavkall/styr-ai
  supabase_url: https://crsonxfrylkpgrddovhu.supabase.co
  engrams_url: https://www.engrams.app/api
```

sync.sh laddar master.yml med gh api:
```bash
MASTER=$(gh api repos/gustavkall/styr-ai/contents/config/master.yml --jq '.content' | base64 -d)
ENGRAMS_KEY=$(echo "$MASTER" | python3 -c "import sys,yaml; d=yaml.safe_load(sys.stdin); print(d['global']['engrams_key'])")
```

Säkerhet: styr-ai är ett privat repo. Rollback: git revert på master.yml.

Värde: Ändra en fil → gäller alla repos.

---

### SPEC: PROTO-REVIEW-001
**Konsolidera alla protokoll till ett master-dokument**

Problem: boot, handoff, sync, deploy, engrams-kommando — distribuerade över CLAUDE.md i tre repos, delvis överlappande och driftande.

Lösning:
1. Skapa `styr-ai/docs/protocol-master.md` — ett dokument som definierar alla protokoll med syfte, ägare, trigger, output, och livscykel
2. CLAUDE.md i styr-ai refererar master-dokumentet istället för att duplicera innehållet
3. CC-repos CLAUDE.md krymps till: "Läs styr-ai/docs/protocol-master.md för fullständigt protokoll"

Protokoll att dokumentera:
| Protokoll | Trigger | Ägare | Output |
|-----------|---------|-------|--------|
| boot | Session start | CA + CC | State-översikt |
| sync | Gustav skriver `sync` | CC | Sektion 2 i protokollfil |
| deploy | Gustav skriver `deploy` | CC | Sektion 4 implementerad |
| handoff | Session slut | CA + CC | Engrams episode |
| engrams sync | Gustav skriver `engrams sync` | CA | Sektion 3 i protokollfil |

Detta är ett [CA]-jobb. CC implementerar ingen kod.

---

### SPEC: S7 — OPTIMISTIC-LOCKING
**Konflikthantering i styr_global_todo**

Prioritет: Låg. Bygg när vi ser faktiska konflikter. SQL klar för snabb deploy vid behov. Parkerad.

---

### SPEC: FUTURE-PERSONA-001 + ENGRAMS-PERSONA-001
**Personlighetsagent via persistent memory**

Status: Parkerad tills Engrams V1 validerad (5 betalande, Anna dagligen).

---

## SEKTION 2 — CC engrams feedback [scope: engrams]
*CC-engrams. Datum: 2026-04-07*

### MASTER-CONFIG-001
Feasibility: Enkel.
Stödjer CC-tradesys förslag att använda `gh api` istället för raw curl.
Tillägg: (1) lägg till `version`-nyckel i master.yml — CC kontrollerar vid load, faila tydligt om version ej stöds. (2) Lägg varningsrubrik överst i master.yml.
Status: KLAR

### PROTO-REVIEW-001
Feasibility: Medel (dokumentationsarbete, ingen kod).
Risk: master-dokumentet kan drifa från CLAUDE.md i underrepos — regel behövs: protokoll-ändringar går alltid via protocol-master.md först.
Tillägg: (1) Inkludera protocol_*.md-livscykel — när skapas, vem äger sektionerna, när stängs, var arkiveras. (2) Inkludera sekvensdiagram per protokoll.
Status: KLAR

### FUTURE-PERSONA-001
Sett. Arkitektoniskt rimligt med profile-typen som grund. Parkera tills V1 validerad.
Status: KLAR

---

## SEKTION 2 — CC tradesys feedback [scope: tradesys]
*CC-tradesys. Datum: 2026-04-07*

### MASTER-CONFIG-001
Feasibility: Enkel. Förslag: `gh api` istället för raw curl — hanterar auth automatiskt.
S7 (Optimistic locking): Håller med om låg prio. SQL i specen korrekt, kan köras direkt via Supabase MCP när det behövs. Parkera.
Status: KLAR

---

## SEKTION 3 — Syntes [scope: alla]
*CA-syntes. Datum: 2026-04-07*

### MASTER-CONFIG-001 — tre CC-tillägg absorberade

Båda CC-instanser stödjer förslaget. Tre konkreta förbättringar från CC:

1. **`gh api` istället för raw curl.** CC-tradesys föreslog, CC-engrams stödjer. `gh api repos/.../config/master.yml --jq '.content' | base64 -d` hanterar auth automatiskt, ger tydliga felmeddelanden, inga token-hanteringsproblem. Absorberat i spec.

2. **`version`-nyckel i master.yml.** CC-engrams tillägg: om master.yml uppgraderas ska CC faila tydligt istället för att gissa på inkompatibel config. Implementeras som: `if [ "$MASTER_VERSION" != "1" ]; then echo "ERROR: Unsupported master.yml version"; exit 1; fi`

3. **Varningsrubrik i master.yml.** Förhindrar oavsiktliga ändringar. Absorberas i filen vid skapande.

**Deployment-ordning för MASTER-CONFIG-001:**
1. CA skapar `styr-ai/config/master.yml` med version-nyckel och varningsrubrik
2. CC-engrams uppdaterar `sync.sh` + `deploy.sh` att ladda master.yml med `gh api`, med fallback till hårdkodade defaults
3. CC-tradesys gör detsamma i tradesys-repos
4. Verifiering: kör sync.sh med och utan nätverksåtkomst — fallback ska aktiveras vid fel

### PROTO-REVIEW-001 — tre CC-tillägg absorberade

CC bekräftar att tre olika tolkningar av "sync" existerar parallellt i CLAUDE.md-filerna. Det är ett faktiskt problem, inte en hypotetisk risk.

Trе förbättringar från CC:

1. **Explicit livscykel för protocol_*.md-filer.** CC saknar rutin för "protokoll klart — vad gör vi med filen?". Livscykeln ska definieras i master-dokumentet: skapad (CA) → sektion 2 (CC sync) → sektion 3 (CA engrams sync) → sektion 4 (CC deploy) → **DEPLOYED** (status uppdateras) → arkiveras till `state/archive/` efter 30 dagar.

2. **Regel: protokoll-ändringar går alltid via protocol-master.md.** Förhindrar att CLAUDE.md i underrepos driftar ifrån master. Regel läggs in i protocol-master.md och i varje CLAUDE.md.

3. **Sekvensdiagram per protokoll.** CA skriver dessa som en del av protokollfilen — text räcker inte för att kommunicera CA→CC→Gustav-flödet entydigt.

**Deployment-ordning för PROTO-REVIEW-001:**
1. CA skriver `styr-ai/docs/protocol-master.md` — komplett med livscykel, sekvensdiagram, ägarmatris
2. CA uppdaterar CLAUDE.md i styr-ai att referera till master-dokumentet
3. CC uppdaterar CLAUDE.md i engrams + tradesys-repos att hänvisa till protocol-master.md

### S7 — Parkerad

Båda CC-instanser bekräftar: ingen konflikt observerad, SQL korrekt, aktivera vid behov. Ingen action.

### FUTURE-PERSONA-001 — Parkerad

CC bekräftar. Aktivera när V1 validerad.

### Prioriteringsordning

| Prio | Task | Ägare | Blockerare |
|------|------|-------|------------|
| 1 | MASTER-CONFIG-001: CA skapar master.yml | [CA] | — |
| 2 | MASTER-CONFIG-001: CC uppdaterar sync.sh/deploy.sh | [CC-eng] + [CC-tdy] | master.yml skapad |
| 3 | PROTO-REVIEW-001: CA skriver protocol-master.md | [CA] | — |
| 4 | PROTO-REVIEW-001: CC uppdaterar CLAUDE.md i underrepos | [CC-eng] + [CC-tdy] | protocol-master.md klar |
| — | S7, PERSONA | Parkerade | — |

---

## SEKTION 4 — Deployment [scope: alla]
*Status: VÄNTAR PÅ GUSTAVES GODKÄNNANDE*

**Prio 1 — CA skapar master.yml (CA-jobb, ingen CC-deploy):**

CA skapar `styr-ai/config/master.yml`:
```yaml
# WARNING: Ändra inte utan att förstå konsekvenserna.
# Alla sync.sh/deploy.sh i alla repos läser denna fil.
# Ändringar här påverkar HELA systemet.
version: "1"

projects:
  engrams:
    repo: gustavkall/engrams
    protocol_scope: engrams
  tradesys:
    repo: gustavkall/tradesys-models
    protocol_scope: tradesys

global:
  styr_repo: gustavkall/styr-ai
  engrams_url: https://www.engrams.app/api
```

OBS: API-nycklar läggs INTE i master.yml — de hanteras som GitHub Secrets. master.yml innehåller bara strukturell konfiguration.

**Prio 2 — CC uppdaterar sync.sh/deploy.sh:**

CC-engrams och CC-tradesys uppdaterar sina respektive scripts att ladda master.yml via `gh api` med fallback:
```bash
if gh api repos/gustavkall/styr-ai/contents/config/master.yml --jq '.content' > /tmp/master_b64 2>/dev/null; then
  MASTER=$(base64 -d /tmp/master_b64)
  MASTER_VERSION=$(echo "$MASTER" | python3 -c "import sys,yaml; print(yaml.safe_load(sys.stdin)['version'])")
  if [ "$MASTER_VERSION" != "1" ]; then echo "ERROR: Unsupported master.yml version $MASTER_VERSION"; exit 1; fi
else
  echo "WARNING: Could not load master.yml — using local defaults"
fi
```

**Prio 3 — CA skriver protocol-master.md:** Separat CA-task, nästa session.

**Godkännande-signal:** Gustav skriver "kör styr-specs deploy" → CC kör prio 2 (sync.sh/deploy.sh-uppdateringar). CA kör prio 1 och 3 utan deploy-gate.
