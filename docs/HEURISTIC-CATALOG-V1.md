# HEURISTIC-CATALOG-V1 — Cross-Project Mental Shortcuts & Drift-Patterns

**Doc-ID:** HEURISTIC-CATALOG-V1
**Project:** styr-ai (meta-governance)
**Type:** Living reference document (kompletterar SPEC-S-CORE-PRINCIPLES-V1)
**Version:** v1.0
**Author:** CA (Claude.ai)
**Status:** Active living document — CA uppdaterar löpande
**Created:** 2026-05-19
**Applies to:** Alla agenter (CA, CC-eng, CC-tdy, Codex, ChatGPT, Shadowbot-v2)

---

## ═══════════════════════════════════════
## 1. VAD ÄR DETTA?
## ═══════════════════════════════════════

**Heuristik (Wikipedia, kort):** Pragmatisk tumregel eller mental genväg som ger "tillräckligt bra" svar snabbt, istället för optimal lösning som tar lång tid. Heuristik prioriterar hastighet och praktisk användbarhet över garanterad korrekthet.

**I agent-kontext:** Heuristik är när en agent tar en mental genväg istället för att göra full empirisk verifiering. Detta är **ibland legitimt** (snabb första gissning som flaggas och senare verifieras) och **ibland drift** (slutsats dras utan verifiering, presenteras som sanning).

**Detta dokument katalogiserar två kategorier:**

| Kategori | Prefix | Vad det är |
|----------|--------|------------|
| Anti-pattern heuristik | `AH.X` | Mental genväg som leder till drift — dokumenterad för igenkänning |
| Legitim heuristik | `LH.X` | Mental genväg som är OK — men måste flaggas som heuristik, inte presenteras som verifierad |

**Relation till SPEC-S-CORE-PRINCIPLES-V1:**

- Heuristik-katalog är *beskrivande* (vilka mönster ser vi)
- Principer är *preskriptiva* (vad agenter måste/får inte göra)
- Princip 10 (Human-Aware Confidence) kräver att heuristiska slutsatser flaggas
- Princip 9 (Simplicity Test) skyddar mot heuristik AH.1, AH.6
- S.1 (Ground-Truth Verification) skyddar mot heuristik AH.3
- S.5 (Fulltext Persistence) skyddar mot heuristik AH.1

**Hur den används:**

1. **Agent-output:** När agenten gör en heuristisk slutsats, ska den flaggas explicit. Format: "Heuristisk bedömning (LH.X): {claim}. Ej empiriskt verifierat per Princip 2."
2. **CA boot:** Listar kända drift-patterns från katalogen som agenten ska aktivt motverka.
3. **Spec review:** CA kontrollerar om en spec gör heuristiska antaganden som matchar någon AH.X.
4. **Drift-detection:** När CA upptäcker ny drift-pattern → ny entry i katalogen.

**Levande dokument:** Detta dokument uppdateras löpande av CA när nya drift-patterns observeras. Versionsbump (v1.0 → v1.1 → v2.0) görs bara vid betydande strukturändring, inte vid nya entries. Vid varje quarterly review (2026-08-19): Gustav reviewar katalogen och bekräftar relevans.

---

## ═══════════════════════════════════════
## 2. ANTI-PATTERN HEURISTIKER (drift)
## ═══════════════════════════════════════

Mönster där agenter tar dålig mental genväg som leder till drift, fel slutsats eller förlorad information.

### AH.1 — "Sammanfattning räcker"

**Heuristisk genväg:** "Det här dokumentet är långt, jag sparar bara sammanfattningen i Engrams så blir det enklare att läsa senare."

**Varför drift:** Sammanfattningar driftar från originaltext. Resonemang, evidens-citationer, specifika datastrukturer försvinner. Efter 3 månader är original-tänket borta.

**När legitim:** I `content`-fältet (Engrams metadata för boot-listning) är sammanfattning rätt. Body-fältet ska vara fulltext.

**Skydd:** S.5 (Fulltext Artefakt Persistens) — kräver Engrams body + disk markdown med ord-för-ord original.

**Documented incident:**
- 2026-05-19 parallell session: Agent sparade backtest-audit korrekt som Level-2 artifact, men sparade "Agents" och "Models" audits endast som sammanfattningar. Original-resonemang förlorat tills agenten själv upptäckte misstaget.

**Flag-fras agenten ska använda (om legitimt fall):** "Sammanfattning sparad i content-fältet, fulltext i body per S.5."

---

### AH.2 — "Senaste replay = sanning"

**Heuristisk genväg:** "Replay visar 62.63% WR, det är vår baseline."

**Varför drift:** Replay-resultat kan vara optimistiska (survivorship bias, in-sample bias, overfitting). En enskild replay-körning är *en datapunkt*, inte ground truth om edge.

**När legitim:** Som första gissning för storleksordning ("ungefär 55-65% är realistiskt") — flaggat som heuristisk.

**Skydd:** Princip 2 (Empirical Evidence Required for Edge Claims) — kräver ≥30 live-trades med divergens <5pp för att hävda att live matchar replay. Princip 8 (Signal-Driven Runtime) — survivorship-justerad baseline ska kommuniceras.

**Documented incident:**
- 2026-05-18 CC-tdy session: Alla 7 docs refererade 62.63% baseline ojusterat trots att CC-tdy:s egen meta-review flaggade survivorship-bias-risk.

**Flag-fras:** "Replay baseline: 62.63% (heuristisk uppskattning, survivorship-bias ej justerat — realistisk live-uppskattning ~57%)."

---

### AH.3 — "Agent claimar Y, alltså Y"

**Heuristisk genväg:** "CC-tdy säger att docs är pushade till main, alltså är de pushade."

**Varför drift:** Agent-claims är inte ground truth. Agenten kan ha pushat till lokal branch, sparad till disk men inte committed, eller hallucinerat operationen.

**När legitim:** Aldrig — Princip 12 är glasklart. Agent-claims kräver verifiering.

**Skydd:** S.1 (Ground-Truth Verification) — `git log`, `SELECT count(*)`, `get_by_marker()`, `view`, `curl` per artefakt-typ.

**Documented incidents:**
- 2026-05-15 RVOL-bug: CC-tdy claimade fix pushed, faktiskt var fil bara commitad lokalt.
- 2026-05-18 7 docs: CC-tdy claimade docs på main, faktiskt fanns de bara på lokal branch.

**Flag-fras (om CA):** "Verifierar agent-claim via ground-truth check innan acceptans" + utfall.

---

### AH.4 — "Detta liknar X som vi gjorde innan"

**Heuristisk genväg:** "Detta problem påminner om något vi gjorde i Engrams förra månaden, jag skissar lösningen direkt."

**Varför drift:** Likhet är ytlig. Detaljer skiljer sig (datatyp, scope, agent-authority). Att inte göra `recall()` först leder till duplicated research, missade befintliga lösningar, eller divergerande mönster i olika delar av systemet.

**När legitim:** Som första intuition för var att leta — flaggat som hypotes som ska verifieras via `recall()` eller `get_by_marker()`.

**Skydd:** Pinned profile "CA must run recall before making claims about what exists." (Drift-pattern CA-DUPLICATE-RESEARCH-WITHOUT-RECALL från memory).

**Documented incident:**
- Återkommande hos CA (självdokumenterat i pinned rules).

**Flag-fras:** "Detta liknar X (heuristisk koppling). Kör `recall()` för att verifiera om relaterad lösning finns innan jag skissar nytt."

---

### AH.5 — "Det fungerar i isolation, alltså fungerar det i prod"

**Heuristisk genväg:** "Syntaxcheck pass, function returnerar förväntat värde i test — kan deployas."

**Varför drift:** Production-environment har integrationsberoenden, side effects, race conditions, edge cases som test miss:ar. Conviction modifiers-buggen 2026-05-18 är ett konkret exempel — syntaxcheck pass men dry-run mot real data hittade 3 buggar.

**När legitim:** För minimala isolerade förändringar (typo-fix, comment-update) räcker syntax. För canonical state-changes räcker det aldrig.

**Skydd:** Princip 3 (Deterministic & Auditable Pipelines), Princip 11 (Architecture Before Velocity — spec krävs för canonical state).

**Documented incident:**
- 2026-05-18 conviction modifiers: tre buggar i production-koden upptäcktes endast via dry-run, inte via unit tests.

**Flag-fras:** "Isolation test pass (syntax/unit). Production-validation pending: [dry-run / staging / shadow mode]."

---

### AH.6 — "Composite weights ser rimliga ut"

**Heuristisk genväg:** "30/25/20/15/10 viktning för composite confidence känns balanserad — låt oss köra."

**Varför drift:** Vikter som ser "rimliga" ut är ovaliderade hypoteser. De kan vara helt fel. Princip 9 (Simplicity) kräver att ny komplexitet motiveras med metric-förbättring + namngivet enklare alternativ + revertplan.

**När legitim:** Som hypotes att testa — flaggat som "föreslagen vikt, kräver replay-validation".

**Skydd:** Princip 9 (Simplicity Test Before Complexity), Princip 2 (Empirical Evidence Required).

**Documented incident:**
- 2026-05-18 CC-tdy doc 6: presenterade 30/25/20/15/10 composite confidence som arkitekturlösning utan empirisk grund. CC-tdy:s egen meta-review fångade detta.

**Flag-fras:** "Föreslagna composite weights 30/25/20/15/10 (heuristisk hypotes — kräver per-multiplier backtest innan deployment per Princip 2)."

---

### AH.7 — "Exhaustive enumeration = grundlighet"

**Heuristisk genväg:** "Bättre att täcka in alla möjliga edge cases, scenarier och varianter i specen för att vara grundlig."

**Varför drift:** Exhaustive specs blir oöverskådliga, svåra att reviewa, och leder till att viktiga punkter försvinner i mängden. CA-EXHAUSTIVE-ENUMERATION är documented drift-pattern.

**När legitim:** För canonical reference-dokument (constitution, schema definition) där completeness är poängen. För review-specer, behåll fokus.

**Skydd:** Princip 9 (Simplicity Test) — om en spec föreslår 19 principer kan den oftast göras till 12 i kluster utan informationsförlust.

**Documented incident:**
- Återkommande hos CA. Konkret: original ChatGPT 15-principer kunde reduceras till 12 i 4 kluster utan förlust (denna spec).

**Flag-fras:** "Spec innehåller N items. Övervägd alternative: kluster N i M grupper för bättre översikt."

---

### AH.8 — "Min tolkning är förmodligen rätt"

**Heuristisk genväg:** "Användaren skrev X, jag tolkar det som Y och kör på det."

**Varför drift:** Tolkningar kan vara fel. Bättre att be om förtydligande för en tvetydig request än att producera 30 minuter av output baserat på fel tolkning.

**När legitim:** För tydliga requests utan tvetydighet. För tvetydiga: använd `ask_user_input_v0` eller fråga.

**Skydd:** Princip 10 (Human-Aware Confidence) — agenten ska vara explicit med när den vet vs. gissar.

**Documented incident:**
- Återkommande pattern (inte ett specifikt drift-event men generell risk).

**Flag-fras:** "Tolkar requesten som X. Om Y istället, säg till — jag justerar."

---

## ═══════════════════════════════════════
## 3. LEGITIMA HEURISTIKER (snabba första gissningar OK med flaggning)
## ═══════════════════════════════════════

Mentala genvägar som är OK att använda — men måste flaggas explicit som heuristik, inte presenteras som verifierade slutsatser.

### LH.1 — "Magnitude check innan precision"

**Heuristisk genväg:** "Värdet är ~0.2, inte ~2.0 — det är fel storleksordning."

**Varför legitim:** Storleksordning är robust signal som kan bedömas snabbt. Precision kräver mer arbete. Vid felsökning är magnitude-check ofta tillräcklig för att lokalisera bugg.

**När använd:** För snabb diagnos av numeriska värden där threshold är känd. Exempel: RVOL threshold 2.0, observerad 0.19 → magnitude-check säger "fel storleksordning, sannolikt bug i beräkning eller datakälla".

**Hur flaggas:** "Magnitude check: värdet är fel storleksordning (~0.2 vs ~2.0 threshold). Root cause kräver djupare analys."

**Relation till principer:** Stödjer Princip 4 (Observable Present State) genom snabb sanity-check.

---

### LH.2 — "Sanity-check via outlier-detektion"

**Heuristisk genväg:** "Om resultatet är >3 stddev från medel är något fel — antingen data eller min analys."

**Varför legitim:** Outliers är ofta tecken på bug eller datafel snarare än genuint signal. Att stanna upp och verifiera när resultat verkar för bra (eller för dåligt) är robust.

**När använd:** För backtest-resultat, model-predictions, performance metrics som verkar avvika kraftigt från förväntat.

**Hur flaggas:** "Resultatet avviker kraftigt från baseline (X stddev). Sanity-check: [data integrity / calculation / methodology]. Verifierar innan jag drar slutsats."

**Relation till principer:** Stödjer S.3 (Replay-to-Live Integrity), S.4 (Failure Analysis Mandatory).

---

### LH.3 — "Ground-truth spot-check innan full audit"

**Heuristisk genväg:** "Innan jag granskar 30 dokument, sample-check 2-3 stycken för att se om strukturen är som förväntad."

**Varför legitim:** Spot-check filtrerar bort uppenbara fel eller missförstånd tidigt. Sparar tid jämfört med full audit av allt.

**När använd:** Vid mottagande av stor mängd output från annan agent. Vid review av många artefakter. Innan stora investeringar i analys.

**Hur flaggas:** "Spot-check av N av M artefakter komplett. Resultat: [confirmed / divergence-detected]. Full audit [proceeding / postponed pending clarification]."

**Relation till principer:** Stödjer S.1 (Ground-Truth Verification) — pragmatisk variant.

---

### LH.4 — "Konsistens-check mellan agenter"

**Heuristisk genväg:** "Codex säger X, CC-tdy säger inte-X — det här är värt att titta närmare på."

**Varför legitim:** Cross-agent disagreement är signal om reell ambiguitet eller fel. Att flagga och undersöka är produktivt.

**När använd:** När convergence review producerar oeniga slutsatser. När parallella audits kommer till olika resultat.

**Hur flaggas:** "Cross-agent divergence: [Agent A: X] vs [Agent B: inte-X]. Eskalerar för human review eller djupare verifiering."

**Relation till principer:** Stödjer Princip 12 (Agent Authority Boundaries), Princip 10 (Human-Aware Confidence).

---

### LH.5 — "Boring-first-pass"

**Heuristisk genväg:** "Innan jag föreslår fancy lösning, skissar jag den tråkigaste möjliga lösningen som baseline."

**Varför legitim:** Tråkig lösning är ofta robust och billig att underhålla. Princip 9 (Simplicity) gillar tråkigt. Om tråkig lösning räcker, behöver vi inte fancy.

**När använd:** Vid arkitekturbeslut, ny komponent, refactor-förslag.

**Hur flaggas:** "Boring-first-pass: [enklaste lösningen]. Fancy alternative: [komplexare lösning] — motiverad bara om boring inte räcker per Princip 9."

**Relation till principer:** Stödjer Princip 9 (Simplicity Test Before Complexity).

---

## ═══════════════════════════════════════
## 4. HUR KATALOGEN UPPDATERAS
## ═══════════════════════════════════════

**Trigger för ny entry:**

| Situation | Action |
|-----------|--------|
| CA upptäcker ny drift-pattern i agent-output | Lägg till som AH.{N+1} |
| Gustav identifierar mönster | Säg till CA, CA lägger till |
| Codex/CC observerar mönster | Skriv till Engrams marker `HEURISTIC-CATALOG-PROPOSAL-{date}`, CA reviewar och inkorporerar |
| Befintlig entry visar sig fel/oklar | Bumpa version, ändra entry |

**Storlek-cap:**
- Anti-patterns: Inget hårt cap, men om vi närmar oss 20 → konsolidera relaterade entries
- Legitima heuristiker: Soft cap ~10 entries (om fler, fundera över om de är genuint olika)

**Versioning:**
- v1.0 → v1.1: Nya entries, mindre justeringar
- v1.X → v2.0: Strukturändringar, breaking changes i format

**Engrams storage:**
- Marker: `HEURISTIC-CATALOG-V1` (eller `-V2` vid major bump)
- Type: `context`
- Project: `styr-ai`
- Level-2 body med fulltext per S.5

**Disk storage:**
- `gustavkall/styr-ai/docs/HEURISTIC-CATALOG-V1.md` (master copy)
- Behöver inte synkroniseras till andra repos — refereras via URL från CORE-PRINCIPLES

---

## ═══════════════════════════════════════
## 5. SUMMARY TABLE
## ═══════════════════════════════════════

### Anti-pattern heuristiker

| ID | Heuristik | Princip som skyddar | Documented incident |
|----|-----------|---------------------|---------------------|
| AH.1 | "Sammanfattning räcker" | S.5 | 2026-05-19 parallell session |
| AH.2 | "Senaste replay = sanning" | Princip 2, 8 | 2026-05-18 CC-tdy 62.63% baseline |
| AH.3 | "Agent claimar Y, alltså Y" | S.1 | 2026-05-15 RVOL, 2026-05-18 7 docs |
| AH.4 | "Detta liknar X" (utan recall) | Pinned profile | Återkommande CA |
| AH.5 | "Fungerar i isolation = funkar prod" | Princip 3, 11 | 2026-05-18 conviction modifiers |
| AH.6 | "Composite weights ser rimliga ut" | Princip 9, 2 | 2026-05-18 CC-tdy doc 6 |
| AH.7 | "Exhaustive enumeration = grundlighet" | Princip 9 | Återkommande CA |
| AH.8 | "Min tolkning är förmodligen rätt" | Princip 10 | Generell risk |

### Legitima heuristiker

| ID | Heuristik | Stödjer princip | Användning |
|----|-----------|-----------------|------------|
| LH.1 | "Magnitude check innan precision" | Princip 4 | Snabb numerisk diagnos |
| LH.2 | "Sanity-check via outlier-detektion" | S.3, S.4 | Validering av oväntade resultat |
| LH.3 | "Ground-truth spot-check innan full audit" | S.1 | Tidsbesparing innan full granskning |
| LH.4 | "Konsistens-check mellan agenter" | Princip 10, 12 | Cross-agent divergence detection |
| LH.5 | "Boring-first-pass" | Princip 9 | Arkitekturbeslut, ny komponent |

---

## ═══════════════════════════════════════
## 6. REFERENCES
## ═══════════════════════════════════════

**Source materials:**
- Wikipedia, Heuristik (https://sv.wikipedia.org/wiki/Heuristik)
- Gustav prompt 2026-05-19 (begäran om heuristik-användning i arbetet)
- CA accumulated observations över sessions 2026-05-15, 05-18, 05-19

**Related artifacts:**
- SPEC-S-CORE-PRINCIPLES-V1 v1.2 (denna katalog refereras från Princip 10)
- Engrams pinned drift-patterns (per project)
- Session memories där varje incident dokumenterades

**Quarterly review schedule:**
- 2026-08-19 (med CORE-PRINCIPLES quarterly review)

---

**Author:** CA (ca-2026-05-19-1300)
**Status:** Active living document
**Updates:** CA appends entries löpande utan formal review (Princip-revision krävs INTE för katalog-tillägg)
