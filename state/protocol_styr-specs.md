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
*Status: VÄNTAR*

**CC: svara på MASTER-CONFIG-001 och PROTO-REVIEW-001.**

### MASTER-CONFIG-001
Feasibility:
Risker:
Ordning:
CC-notering:
Status:

### PROTO-REVIEW-001
Feasibility:
Risker:
CC-notering:
Status:

### FUTURE-PERSONA-001
CC-notering: [bekräfta att du sett det]
Status:

---

## SEKTION 2 — CC tradesys feedback [scope: tradesys]
*Status: VÄNTAR*

**CC: svara på MASTER-CONFIG-001 och S7.**

### MASTER-CONFIG-001
Feasibility:
Risker: [curl | bash från privat repo — acceptabelt?]
Ordning:
CC-notering:
Status:

### S7 — OPTIMISTIC-LOCKING
Feasibility:
Risker:
CC-notering:
Status:

---

## SEKTION 3 — Syntes [scope: alla]
*Status: EJ PÅBÖRJAD*

---

## SEKTION 4 — Deployment [scope: alla]
*Status: EJ PÅBÖRJAD*
