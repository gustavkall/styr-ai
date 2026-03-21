# System Rules — styr-ai
*Immutable unless explicitly changed via decisions.md*

---

## CORE RULES

1. **Stateless Model** — LLM lacks inter-session memory. All context must be persisted.
2. **Persisted Truth Only** — Uncommitted work doesn't exist. Push = done.
3. **Source Hierarchy** — Supabase API > GitHub repo > chat history.
4. **No Assumption Mode** — Read current state before structural changes.
5. **Explicit Work State** — One active priority max (work_queue.md).
6. **Evidence Before Done** — Implementation + verified behavior + state update = done.
7. **Drift Prevention** — Misaligned repo/deployment/state triggers stop.
8. **No Fabrication** — Unverified claims marked `[UNVERIFIED]`.
9. **Round-Trip Verification** — Features complete when input → logic → output verifies.
10. **Automate Repetition** — Recurring tasks should be automated.

---

## PROJECT-SPECIFIC RULES

Hej på dig styr.ai
