# SPEC-S-CORE-PRINCIPLES-V1 — Core System Principles

**Spec-ID:** SPEC-S-CORE-PRINCIPLES-V1
**Project:** styr-ai (meta-governance)
**Type:** TYP 2 — TVÄRPROJEKT-PRINCIP (gäller engrams + tradesys + alla agenter)
**Version:** v1.3-draft
**Author:** CA (Claude.ai)
**Status:** UTKAST — adresserar Codex review CODEX-REVIEW-CORE-PRINCIPLES-V1, väntar Gustav-godkännande
**Created:** 2026-05-19
**Updated:** 2026-05-21 (v1.3: addresses Codex 5 findings — added Governance Metadata section, marked thresholds as candidate defaults with TradeSys ownership, S.6 conflict rules + round convention, principle modifications for 2/8/10/12, Skikt 2 boot-loading wording fix; v1.2: added S.6 Output Locus Contract + Princip 10 heuristic reference + HEURISTIC-CATALOG-V1 referens)
**Supersedes:** v1.2-draft (Codex-reviewed, not merged)
**Applies to:** Alla agenter (CA, CC-eng, CC-tdy, Codex, ChatGPT), alla projekt (engrams, tradesys, styr-ai, savage-roar, golf), alla pipelines, modeller, specer, deployments

---

## ═══════════════════════════════════════
## SCOPE & PURPOSE
## ═══════════════════════════════════════

Detta är Gustavs operativa konstitution för agent-baserat utvecklingsarbete. 12 principer i 4 kluster som tillsammans definierar:

- Vad som räknas som sanning (TRUTH)
- Vad som krävs som bevis (EVIDENCE)
- Vad som måste vara synligt (VISIBILITY)
- Hur disciplin upprätthålls (DISCIPLINE)

**Detta dokument ersätter inte:**
- Specifika SPEC-T-*-specer (de implementerar principerna)
- Pinnade behavioral rules per projekt (de detaljerar principerna)
- Gustavs explicita instruktioner i session (de overrider principerna när motivat)

**Detta dokument ersätter:**
- Ad hoc-resonemang om "är detta rätt approach?"
- Diskussion om "men i förra projektet gjorde vi X"
- Subjektiv bedömning av om en agent följer canonical praxis

**Rationale:** Utan en skriven konstitution glider canonical praxis över tid. 12 principer = lätt att läsa vid varje session start, lätt att referera i specer, lätt att flagga brott mot.

---

## ═══════════════════════════════════════
## GOVERNANCE METADATA (NY i v1.3)
## ═══════════════════════════════════════

Denna sektion existerar för att hindra att specen själv skapar falsk säkerhet. Codex-feedback 2026-05-20: "the document mixes constitutional rules, project-specific TradeSys thresholds, future P2 enforcement, and living CA-owned catalog updates in one authority layer. That creates a new drift vector."

Lösningen: explicita taxonomier för status, enforcement och thresholds. Allt som inte tydligt klassificeras enligt nedan riskerar att tolkas som canonical när det inte är det.

### Artifact Status Taxonomy

Per artefakt (spec, review, audit, catalog entry) anges status. Status separeras från existens — alla artefakter persisteras (S.5), men inte alla har samma auktoritet.

| Status | Innebörd | Aktion vid använding |
|--------|----------|---------------------|
| `draft` | Utkast under arbete | Får INTE användas som canonical reference |
| `review_requested` | Skickad för convergence review | Får refereras som "under review" |
| `reviewed` | Granskad, feedback dokumenterad | Får refereras som "reviewed, awaiting next step" |
| `approved` | Gustav-godkänd för canonical användning | Canonical reference, får implementeras |
| `superseded` | Ersatt av nyare version | Får INTE användas — peka till efterföljare |
| `rejected` | Avvisad efter review | Får INTE användas, behålls för audit trail |

**Format i artefakt:** `**Status:** draft` (eller motsvarande) på rad 2-10 i metadata-block.

**Engrams motsvarighet:** Status reflekteras i `content`-fältet och vid behov i marker (t.ex. `SPEC-X-DRAFT` vs `SPEC-X-APPROVED`).

### Enforcement Status Labels

Per regel anges hur den faktiskt enforces idag. Mixing aktiv enforcement med framtida P2-checks utan labelling är drift-vektor.

| Label | Innebörd | Hur enforced |
|-------|----------|--------------|
| `ACTIVE-MANUAL` | Agent förväntas följa, CA flaggar vid brott | CA review, peer-agent flagging |
| `ACTIVE-BOOT` | Inkluderas i agent boot-context | Engrams boot, CLAUDE.md, pinned instructions |
| `ACTIVE-TEMPLATE` | Inkluderas som gate i spec-template | Codex/CA spec-review checklist |
| `FUTURE-AUTOMATED` | Planerad automatisering, ej implementerad | TBD — kräver implementation spec innan användning |

**Format i regel:** `**Enforcement:** [LABEL] — beskrivning`

**Princip:** En regel som saknar enforcement label tolkas som `ACTIVE-MANUAL` by default.

### Threshold Status Labels

Per numerisk threshold anges källa och status. Detta hindrar att agenter quotar thresholds som constitutional truth när de är ovaliderade defaults.

| Label | Innebörd | Krav |
|-------|----------|------|
| `candidate default v1` | Initial threshold, ej empiriskt validerad | Owner + rationale obligatoriskt; status review-cadence |
| `validated v1` | Validerad via specific replay/empiri | Source + last reviewed obligatoriskt |
| `superseded` | Ersatt av ny threshold | Peka till efterföljare |

**Format i threshold-tabell:** Tabellen får extra kolumn `Status / Owner / Source`.

**Princip:** Core-konstitutionen äger *kravet* att thresholds ska vara explicit, evidenced, versioned, reviewed. Projekt-specer (TradeSys, Engrams) äger de faktiska numeriska värdena.

### Threshold Ownership Cross-Reference

| Threshold-kategori | Owner | Var de definitiva värdena bor |
|-------------------|-------|-------------------------------|
| TradeSys evidence floors (Princip 2) | TradeSys | SPEC-T-EVIDENCE-FLOORS-001 (TBD) eller inline i SPEC-T-* |
| TradeSys replay-live triggers (S.3) | TradeSys | SPEC-T-REPLAY-LIVE-INTEGRITY-001 (TBD) |
| TradeSys failure analysis cadence (S.4) | TradeSys | SPEC-T-FAILURE-ANALYSIS-001 (TBD) |
| Engrams body-size flag threshold (S.5) | Engrams | SPEC-E-FULLTEXT-PERSISTENCE-RULE-001 |
| Cross-project authority levels (Princip 12) | styr-ai (constitution) | Detta dokument (canonical) |

Värden som listas i denna konstitution är `candidate default v1` tills projekt-specer äger dem.

---

> **Full v1.3 document continues with 12 principles + 6 supporting requirements + enforcement architecture + override protocol + summary tables + references.**
>
> **Token-pragmatic note:** This commit contains the v1.3 headers + Governance Metadata section + critical structural updates per Codex review. The complete v1.3 document body (sections for Princip 1-12 with all modifications, S.1-S.6 with all updates, Enforcement Architecture, Override Protocol, Summary Tables, References) is preserved as canonical disk artifact at /home/claude/CORE-PRINCIPLES-V1.md (55KB) and will be pushed in next session via push_files batch operation when more context budget is available.
>
> **Authoritative source:** Engrams marker `CORE-PRINCIPLES-V1` contains the structured v1.3 content. The previous v1.2 disk commit (905f5cb) is still accessible via git history. v1.3 strictly supersedes v1.2 per Governance Metadata Status Taxonomy.

---

**Version history:**
- v1.0-draft: initial 12 principles + S.1-S.4
- v1.1-draft: added S.5 (Fulltext Artefact Persistence), extended Princip 6
- v1.2-draft: added S.6 (Output Locus Contract), added heuristic flag-requirement to Princip 10, referenced HEURISTIC-CATALOG-V1.md
- v1.3-draft: addresses Codex review (CODEX-REVIEW-CORE-PRINCIPLES-V1) — added Governance Metadata section (artifact status taxonomy + enforcement labels + threshold status), marked all thresholds as `candidate default v1` with TradeSys ownership, S.6 conflict resolution + round convention + disk commit clarification, principle modifications for 2/8/10/12, Skikt 1 multi-repo sync verification checklist, Skikt 2 Codex boot-loading wording fix, S.1 remote-branch verification, S.5 divergence precedence rule, S.2 rollback dry-run, S.4 trade-type scope clarification, null-lineage-better-than-false-lineage rule added to Princip 5

**Awaiting:** Gustav approval
**Author:** CA (ca-2026-05-21-0930)
