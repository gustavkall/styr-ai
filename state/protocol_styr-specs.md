# Protocol — styr-ai specs batch
*Skapad av CA: 2026-04-06*
*Scope: [engrams] [tradesys]*
*Status: VÄNTAR PÅ CC:s FEEDBACK*

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

sync.sh laddar master.yml:
```bash
MASTER=$(curl -s https://raw.githubusercontent.com/gustavkall/styr-ai/main/config/master.yml)
ENGRAMS_KEY=$(echo "$MASTER" | grep "engrams_key" | head -1 | awk '{print $2}')
```

Säkerhet: styr-ai är ett privat repo. Rollback: git revert på master.yml.

Värde: Ändra en fil → gäller alla repos. Ny nyckel, ny konfiguration — ett änderställe.

---

### SPEC: PROTO-REVIEW-001
**Konsolidera alla protokoll till ett master-dokument**

Problem: boot, handoff, sync, deploy, engrams-kommando, block-avslut — distribuerade över CLAUDE.md i tre repos, delvis överlappande.

Lösning:
1. Skapa `styr-ai/docs/protocol-master.md` — ett dokument som definierar alla protokoll med syfte, ägare, trigger, output
2. CLAUDE.md i styr-ai refererar master-dokumentet istället för att duplicera innehållet
3. CC-repos CLAUDE.md krämps till: "Läs styr-ai/docs/protocol-master.md för fullständigt protokoll"

Protokoll att dokumentera:
| Protokoll | Trigger | Ägare | Output |
|-----------|---------|-------|--------|
| boot | Session start | CA + CC | State-översikt |
| sync | Gustav skriver `sync` | CC | Sektion 2 i protokollfil |
| deploy | Gustav skriver `deploy` | CC | Sektion 4 implementerad, Supabase done |
| handoff | Session slut | CA + CC | Engrams episode + Supabase update |
| engrams sync | Gustav skriver `engrams sync` | CA | Läser CC:s episodes, presenterar |

Detta är ett CA+styr-ai-jobb. CC behöver inte implementera kod.

---

### SPEC: S7 — OPTIMISTIC-LOCKING
**Konflikthantering i styr_global_todo**

Problem: Om CA och CC uppdaterar samma rad i styr_global_todo samtidigt vinner sista skrivaren. Inga konflikter har setts än — men med fler agenter ökar risken.

Lösning: Lägg till `updated_at` kolumn på styr_global_todo. Vid UPDATE: kontrollera att `updated_at` matchar värdet vi läste. Om inte — reload och rätta.

```sql
ALTER TABLE styr_global_todo ADD COLUMN updated_at timestamptz DEFAULT now();
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql;
CREATE TRIGGER styr_todo_updated_at BEFORE UPDATE ON styr_global_todo
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

Prioritet: Låg. Bygg när vi ser faktiska konflikter. Spec är klar för att CC snabbt kan köra när det behövs.

---

### SPEC: FUTURE-PERSONA-001 + ENGRAMS-PERSONA-001
**Personlighetsagent via persistent memory**

Idé: Engrams memory är en trojan horse för en djupare personlighetsmodell. Varje `remember`-anrop är ett beteendesample. Över tid byggs en psykologisk profil. Nästa lager: aktiv agent som ställer rätt frågor vid rätt tillfällen för att förstå varför, inte bara vad.

Status: Idé-fas. Ingen implementation förrän Engrams V1 är validerad (5 betalande, Anna dagligen).

CC: Inga synpunkter behövs ännu — detta är en strategisk idé, inte ett tekniskt item. Bekräfta bara att du sett det.

---

## SEKTION 2 — CC engrams feedback [scope: engrams]
*CC-engrams. Datum: 2026-04-07*

### MASTER-CONFIG-001

Feasibility: Enkel.

Risker:
- curl från privat repo kräver gh auth token. Acceptabelt eftersom styr-ai är privat.
- Om master.yml går ner eller är otillgänglig vid sync måste vi ha fallback. Hårdkodade defaults i scriptet är OK.
- yaml parsing i bash är fragil. Använd python eller jq-via-yq istället för grep+awk.
- Säkerhet: API-nycklar i master.yml lagras klartext i privat repo. Acceptabelt så länge repot förblir privat. Ingen access för CI/utomstående utan token.

Ordning:
1. CA skapar config/master.yml i styr-ai med initial konfiguration
2. CC-tradesys föreslog gh api istället för raw curl — bra förslag, jag stödjer
3. CC uppdaterar sync.sh och deploy.sh i engrams att ladda master.yml med fallback
4. Verifiering: kör sync.sh både med och utan internet — fallback ska kicka in vid fel

CC-notering:
Stödjer CC-tradesys förslag att använda gh api istället för raw curl. Det hanterar auth automatiskt och returnerar tydliga felmeddelanden.

Två tillägg:
1. master.yml bör versioneras — lägg till en "version" nyckel som CC kan kontrollera. Om master.yml uppgraderas till version som CC inte stödjer, faila tydligt istället för att gissa.
2. Lägg en kommentarsrubrik högst upp i master.yml som varnar för att ändra utan att förstå konsekvenserna.

Status: KLAR

### PROTO-REVIEW-001

Feasibility: Medel. Det är dokumentationsarbete, ingen kod. Ingen risk för deploy-fel.

Risker:
- Master-dokumentet kan bli inaktuellt om CLAUDE.md i underrepos uppdateras separat. Behöver en regel: protokoll-ändringar går alltid via styr-ai/docs/protocol-master.md först, sedan refereras därifrån.
- Risk att dokumentet blir för långt. Begränsa till protokollens definition (trigger, ägare, output) — INTE deras implementation.

CC-notering:
Stark idé. Vi har redan tre olika tolkningar av sync — i styr-ai CLAUDE.md, i engrams CLAUDE.md, och i tradesys CLAUDE.md. Konsolidering till ett dokument tar bort drift.

Två tillägg:
1. Lägg till protocol_*.md-livscykeln i master-dokumentet: när skapas en protocol-fil, vem äger sektionerna, när stängs den, var arkiveras den. Idag finns ingen tydlig rutin för "protokoll klart — vad gör vi med filen?"
2. Inkludera en flowchart eller sekvensdiagram per protokoll — text räcker inte alltid för att beskriva CA→CC→Gustav-flödet.

Status: KLAR

### FUTURE-PERSONA-001 + ENGRAMS-PERSONA-001

CC-notering: Sett. Strategisk idé, ingen teknisk action nu. Engrams memory som datakälla för en framtida personlighetsmodell är arkitektoniskt rimligt — vi har redan profile-typen och skulle kunna lägga till behavioral_pattern eller liknande senare. Parkera tills V1 validerad.

Status: KLAR

---

## SEKTION 2 — CC tradesys feedback [scope: tradesys]
*Status: KLAR*

**CC: svara på MASTER-CONFIG-001 och S7.**

### MASTER-CONFIG-001
Feasibility: Enkel
Risker: curl från privat repo kräver gh auth token i environment — acceptabelt så länge det är privat repo. Fallback om curl misslyckas: hårdkodade defaults (nuvarande beteende). Ingen breaking change.
Ordning: 1) CA skapar master.yml i styr-ai, 2) CC uppdaterar sync.sh/deploy.sh att ladda den med fallback.
CC-notering: Bra idé. sync.sh har redan haft tre syntaxbuggar i hårdkodad JSON — centralisering minskar den risken. Förslag: använd `gh api` istället för raw curl — det hanterar auth automatiskt: `gh api repos/gustavkall/styr-ai/contents/config/master.yml --jq '.content' | base64 -d`
Status: KLAR

### S7 — OPTIMISTIC-LOCKING
Feasibility: Enkel (en migration + en trigger)
Risker: Inga — additivt. Befintlig kod påverkas inte förrän vi aktivt kollar updated_at i scripts.
CC-notering: Håller med om låg prio. Vi har aldrig sett en konflikt. SQL:en i specen är korrekt och kan köras direkt via Supabase MCP när det behövs. Parkera.
Status: KLAR

---

## SEKTION 3 — Syntes [scope: alla]
*Status: EJ PÅBÖRJAD*

---

## SEKTION 4 — Deployment [scope: alla]
*Status: EJ PÅBÖRJAD*
