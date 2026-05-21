# CODEX-REVIEW-CORE-PRINCIPLES-V1

**Review-ID:** CODEX-REVIEW-CORE-PRINCIPLES-V1
**Reviewer:** Codex
**Project:** styr-ai
**Type:** context
**Date:** 2026-05-20
**Reviewed artifacts:**
- `docs/CORE-PRINCIPLES-V1.md` at `gustavkall/styr-ai`, branch `core-principles-v1-draft`, version `v1.2-draft`
- `docs/HEURISTIC-CATALOG-V1.md` at `gustavkall/styr-ai`, branch `core-principles-v1-draft`, version `v1.0`
- Master PR: `https://github.com/gustavkall/styr-ai/pull/1`

## Executive Verdict

**ACCEPT WITH REQUIRED MODIFICATIONS before merge.**

The architecture is directionally correct and materially improves drift resistance. The four-cluster shape is good: TRUTH, EVIDENCE, VISIBILITY, DISCIPLINE is memorable enough for boot-time use and strong enough to drive review gates. S.5 and S.6 are especially valuable because they address a real operational failure mode: review artifacts becoming undiscoverable or summary-only.

The current draft should not merge unchanged. The core risk is not the principles themselves; it is that the document mixes constitutional rules, project-specific TradeSys thresholds, future P2 enforcement, and living CA-owned catalog updates in one authority layer. That creates a new drift vector: agents may treat draft thresholds, future enforcement, or CA appends as already canonical runtime truth.

Required before merge:
1. Mark empirical thresholds as `candidate defaults` unless already validated, and require source/evidence per threshold.
2. Split "principle" from "implementation detail" more explicitly, especially for TradeSys-specific tables.
3. Add governance for HEURISTIC-CATALOG changes: append-only is fine, but each new AH/LH entry needs source incident, author, date, and review status.
4. Fix S.6 to include deterministic conflict handling when multiple reviews target the same spec and when the task output_contract differs from the document table.
5. Update stale PR body language from "4 supporting requirements" to S.1-S.6.

## Principle Review

### Principle 1: Single Canonical Source of Truth

**Verdict: ACCEPT.**

This is the strongest principle in the document and should remain Principle 1. It directly addresses the recurring runtime drift pattern across TradeSys and Engrams: frontend/cache/git/local notes becoming accidental truth.

Modification requested: the canonical owner table is too TradeSys-specific for a cross-project constitution. Keep the table, but label it "current examples, not exhaustive canonical registry". Otherwise a future agent may infer that entities not listed have no canonical owner requirement.

### Principle 2: Empirical Evidence Required for Edge Claims

**Verdict: MODIFY.**

The principle is correct. The threshold table is useful, but currently over-authoritative. Values like `>=100 replay-trades`, `p<0.05`, `>0.5pp overall`, `>=30 trades per bucket`, `divergence <5pp`, and rolling 50-trade triggers may be reasonable, but the document does not prove they are calibrated.

Required change: explicitly classify these as `candidate evidence floors v1` until validated by TradeSys history. Add `Source / rationale / last reviewed` columns or move thresholds into a TradeSys implementation spec. The constitution should say "edge claims require predeclared evidence thresholds"; the project spec should own the exact numbers.

### Principle 3: Deterministic & Auditable Pipelines

**Verdict: ACCEPT.**

This is clean and enforceable. The non-deterministic pipeline treatment is important: LLM/API systems cannot be made deterministic, so input/output persistence is the right audit primitive.

Suggested refinement: replace "Samma input + samma model/version/configuration ger samma output" with "for deterministic pipelines..." because the next sentence already acknowledges LLM/API exceptions.

### Principle 4: Observable Present State

**Verdict: ACCEPT.**

Strong principle. It turns "is the system working?" into a queryable surface. The 30-second test is good because it is human-operational, not abstract.

Modification requested: define accepted exit surfaces consistently with Engrams `VISIBILITY-CONTRACT-RUNTIME`: site row/card/table or AI-client rendered output. Otherwise this spec and the existing runtime visibility contract can drift in terminology.

### Principle 5: Reconstructable Historical State

**Verdict: ACCEPT.**

Correct and necessary. This is the historical complement to Principle 4. It prevents false lineage and "we know current state but not why it happened".

Suggested addition: explicitly state that `null lineage is better than false lineage`, matching the already-established TradeSys governance rule. That phrase prevents agents from fabricating lineage to satisfy the checklist.

### Principle 6: Event & Signal Persistence

**Verdict: ACCEPT.**

This is strong, especially the extension from runtime events to agent-produced review artifacts. It correctly treats specs/reviews/audits as system artifacts, not chat residue.

Modification requested: avoid saying all review artifacts are "canonical" without a status field. Drafts, rejected reviews, superseded audits, and approved specs all need persistence, but not equal authority. Add a required status taxonomy such as `draft`, `reviewed`, `approved`, `superseded`, `rejected`.

### Principle 7: Research != Runtime

**Verdict: ACCEPT.**

This is essential and well-scoped. It protects against replay/research leakage into live decisions.

Suggested refinement: add "research may write to research-owned tables only" rather than relying only on examples. That makes the rule portable beyond the current table names.

### Principle 8: Signal-Driven Runtime

**Verdict: MODIFY.**

The intention is correct: live decisions should not be hardcoded magic values. The problem is that the table currently says threshold values may not be hardcoded but can be empirically validated. That leaves an ambiguity: validated thresholds still have to exist somewhere as config, model metadata, or DB rows.

Required change: distinguish `hardcoded in code` from `declared in versioned config/model metadata`. A validated RVOL threshold in versioned config is acceptable; an RVOL threshold embedded in arbitrary code is not.

### Principle 9: Simplicity Test Before Complexity

**Verdict: ACCEPT.**

This is a high-value principle. It directly counters agent overbuilding and CA exhaustive enumeration. The five-question table is practical.

Modification requested: foundation work exception is too broad. Add a requirement that "foundation work" must still name the simpler alternative and explain why it cannot support the canonical contract. Otherwise every complex infrastructure idea can self-label as foundation.

### Principle 10: Human-Aware Confidence

**Verdict: MODIFY.**

The principle is correct and the HEURISTIC-CATALOG reference is valuable. The risk is that every low-confidence statement could become verbose boilerplate if agents over-apply "heuristic bedömning".

Required change: add a minimum trigger for heuristic labeling:
- required for claims that affect decisions, architecture, persistence, authority, or deployment;
- recommended for exploratory analysis;
- not required for ordinary conversational framing.

This prevents the heuristic catalog from becoming noise.

### Principle 11: Architecture Before Velocity

**Verdict: ACCEPT.**

Correct split between architecture-changing work and local/frontend polish. This is important because over-requiring specs can become velocity drift in the other direction.

Modification requested: "Engrams memories (inte specer)" under "Spec krävs INTE" is ambiguous because Engrams memories can contain specs or can change operational state through pinned instructions/tasks. Rephrase to "ordinary context/episode memories that do not create canonical rules or runtime contracts".

### Principle 12: Agent Authority Boundaries

**Verdict: MODIFY.**

The principle is necessary, but current wording has two issues.

First, "Cross-agent kommunikation går genom Engrams - inte via paste eller URL" is directionally right but too absolute. Gustav paste will always exist as a control plane. The right rule is: paste/URL can transport content, but it is not canonical until persisted to the specified Engrams locus.

Second, CC-eng and CC-tdy as "Autonomous-paper inom repo" may confuse implementation authority with paper-trading authority. A coding agent implementing approved repo changes is not the same authority class as a trading agent producing paper trades. Consider renaming levels or adding a separate implementation authority axis.

## Supporting Requirements Review

### S.1 Ground-Truth Verification

**Verdict: ACCEPT WITH MINOR MODIFICATION.**

Correct. Add "remote branch" to the git verification row: local `git log` alone does not prove push. The documented incidents are exactly about local-vs-remote mismatch.

### S.2 Reversibility by Default

**Verdict: ACCEPT.**

Good operational requirement. Suggested addition: "rollback tested or at least dry-run described" for high-risk migrations.

### S.3 Replay-to-Live Integrity

**Verdict: MODIFY.**

Correct requirement, but the trigger values are unvalidated thresholds. Move exact threshold values to TradeSys implementation spec or mark as candidate defaults. This is the same issue as Principle 2.

### S.4 Failure Analysis Mandatory

**Verdict: MODIFY.**

Correct intent. The values `>2% loss`, `7 days`, `5pp`, `14 days`, `24h` may be useful defaults, but need owner and calibration. Also clarify whether this applies to paper trades, live trades, shadow decisions, or all of them.

### S.5 Fulltext Artefakt Persistens

**Verdict: ACCEPT.**

This is one of the most important parts of the document. It directly fixes a known loss-of-context failure mode. Keep it.

Modification requested: if Engrams body and disk markdown diverge, define the precedence rule. My recommendation: disk markdown and Engrams body must be byte-equivalent for canonical review artifacts where feasible; if they diverge, newest timestamp wins only when accompanied by explicit supersede marker.

### S.6 Output Locus Contract

**Verdict: ACCEPT WITH REQUIRED MODIFICATION.**

This is high leverage. It solves discoverability and makes review cycles reconstructable.

Required changes:
1. Define conflict resolution if the spec Output Locus table and Engrams task `output_contract` disagree. Recommendation: task `output_contract` wins for that task, but the discrepancy must be flagged.
2. Require unique marker conventions for multiple review rounds, e.g. `CODEX-REVIEW-{spec-id}-R1` or timestamp suffix, unless the intended behavior is supersede.
3. Clarify whether reviewers create/replace disk files on branches or only local workspace. For PR-governance, disk output should be committed or explicitly marked local-only.

## HEURISTIC-CATALOG-V1 Review

**Verdict: ACCEPT WITH GOVERNANCE MODIFICATIONS.**

The catalog is useful and the AH/LH split is the right shape. It gives agents vocabulary for drift patterns without bloating the core principles.

What works:
- AH.1, AH.3, AH.5, AH.6, AH.7 are grounded in real recurring failures.
- LH.3 and LH.5 are especially useful because they legitimize pragmatic shortcuts without letting them masquerade as verification.
- The catalog correctly separates descriptive patterns from prescriptive principles.

Required modifications:
1. Add metadata per entry: `First observed`, `Source marker / incident`, `Owner`, `Review status`, `Last reviewed`.
2. Do not allow "CA appends entries löpande utan formal review" without audit trail. CA may propose/append, but each append should be marked `proposed` until next drift audit or Gustav approval.
3. AH.4 currently points to "Pinned profile" rather than a principle. Either connect it to S.1/S.6/Princip 12 or create a small recall-before-claim requirement. A catalog entry should not depend on an implicit profile rule that other agents may not load.
4. AH.8 is too broad and risks making agents ask unnecessary questions. Reframe as "Ambiguous high-impact request interpreted without confirmation".
5. The flag phrase "Ej empiriskt verifierat per Princip 2" should not be universal. Many heuristic claims are not edge claims. Use "not ground-truth verified" or "not fully verified" except when the claim is actually about edge/model performance.

## New Findings / Missing Principles

### Finding 1: Status/Authority Taxonomy Is Missing

The docs persist artifacts but do not clearly separate artifact status from artifact existence. This matters because fulltext persistence means rejected drafts also live forever. Add a lightweight status field or convention:

- `draft`
- `review_requested`
- `reviewed`
- `approved`
- `superseded`
- `rejected`

Without this, S.5 can accidentally make everything feel canonical because everything is preserved.

### Finding 2: Threshold Governance Is Underspecified

Several numeric thresholds are governance-critical but currently lack source, calibration, owner, and review cadence. This creates exactly the drift the document is trying to prevent: agents will quote thresholds as constitutional truth.

Recommendation: Core principles own the requirement that thresholds must be explicit, evidenced, versioned, and reviewed. Project specs own the actual threshold numbers.

### Finding 3: Enforcement State Needs Labels: Active vs Future

The document mixes active enforcement and P2/future checks. That is okay if labeled. Add a simple enforcement status on each rule:

- `ACTIVE-MANUAL`
- `ACTIVE-BOOT`
- `ACTIVE-TEMPLATE`
- `FUTURE-AUTOMATED`

Without this, agents may either overclaim enforcement or ignore future requirements as aspirational.

### Finding 4: Multi-Repo Sync Is a Drift Vector

The document requires updating 4 locations in the same session. Correct, but there is no verification checklist. Add a post-merge sync check:

- same version string in all repos;
- same content hash or explicitly allowed repo-local delta;
- Engrams marker points to the same version;
- PR body and CLAUDE.md references updated.

### Finding 5: "Codex Included In System Prompt" Is Not Operationally True By Itself

Skikt 2 says Codex includes the principles in system prompt at every session. That is not something the repo can enforce unless the Codex environment is actually configured to load them. Safer wording: "Codex sessions must load CORE-PRINCIPLES-V1 during boot via Engrams/repo context." This is actionable and verifiable.

## Merge Recommendation

Do not merge v1.2 unchanged.

Merge after the required modifications above, especially:
- threshold governance;
- artifact status taxonomy;
- heuristic catalog governance;
- S.6 conflict/round handling;
- active-vs-future enforcement labels.

I would not expand from 12 principles. The missing pieces should be supporting requirements or enforcement metadata, not new principles. The 12-principle set is already near the upper bound of what agents will reliably remember during boot.

## Suggested Minimal Patch

If you want the smallest safe v1.3:

1. Add a short `Governance Metadata` section near the top:
   - artifact status taxonomy;
   - enforcement status labels;
   - threshold status labels.
2. Update Principle 2 and S.3/S.4 threshold tables with `Status: candidate default` and `Owner: TradeSys`.
3. Update S.6 with task-contract precedence and marker round/timestamp convention.
4. Update HEURISTIC-CATALOG with per-entry metadata and `proposed/accepted` status.
5. Update PR body to match S.1-S.6.

## Final Assessment

This is a strong governance foundation. The main correction is to prevent the governance artifact itself from creating new false certainty. Keep the constitution small, make project-specific numbers explicitly owned and reviewed, and treat the heuristic catalog as controlled operational memory rather than an unreviewed append-only notebook.
