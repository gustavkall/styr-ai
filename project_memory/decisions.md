# styr-ai — Decision Log
*Cumulative log. Append-only.*

---

### 2026-03-24 — Goals layer definierad (VISION-001)
**Context:** styr-ai saknade ett explicit mål.
**Decision:** goals.md definierar systemets syfte som leverage-multiplikator.
**Why:** Utan tydligt mål optimeras systemet för fel saker.
**Impact:** Alla work items värderas mot goals.md.

### 2026-03-24 — Autonomigränser definierade (VISION-004)
**Context:** VISION-005 kräver tydliga ramar.
**Decision:** governance/system_rules.md — tre nivåer: autonomt, kräver godkännande, aldrig autonomt.
**Why:** Tydliga gränser är förutsättning för autonom exekvering.
**Impact:** VISION-005 kunde planeras och exekveras.

### 2026-03-26 — Warner-tvist hanteras personligen
**Context:** COO-agenten eskalerade Warner-deadline som systemuppgift.
**Decision:** Gustav hanterar personligen. Inte en systemuppgift.
**Why:** Juridiska förhandlingar kräver personlig bedömning.
**Impact:** COO ska inte eskalera WARNER-DEADLINE framöver.

### 2026-03-26 — MODEL-002 och MODEL-003 bekräftat byggda
**Context:** COO flaggade EMS/FPS/STS och EPS surprise som saknade.
**Decision:** Gustav bekräftar att båda är implementerade.
**Why:** State-filer reflekterade inte faktiskt läge.
**Impact:** Båda markerade completed. MODEL-004 är nästa steg.

### 2026-03-26 — styrAI-product arkitektur
**Context:** Behövde bestämma arkitektur för persistent memory-produkten.
**Decision:** MCP-server (Vercel) + Supabase PostgreSQL + pgvector + OpenAI embeddings. Managed hosting hos Gustav.
**Why:** MCP är rätt leveransmekanism. Managed ger zero friktion för kund. pgvector i Supabase eliminerar separat vektordatabas.
**Impact:** Fas 1 byggd och live samma dag. COGS <$1/mån per kund.

### 2026-03-26 — Separata repos för meta-system och produkt
**Context:** styr-ai repot används som meta-system med state-filer och agenter.
**Decision:** styrAI-product är separat repo — deployas på Vercel. styr-ai förblir internt.
**Why:** Separation of concerns. Produktkod ska inte blandas med state-filer.
**Impact:** Ren arkitektur. Vercel deployar styrAI-product, inte styr-ai.
