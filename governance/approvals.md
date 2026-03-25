# styr-ai — Approvals
*Gustav godkänner eller avvisar agent-förslag här.*
*Agenten läser denna fil vid varje körning och agerar på godkända items.*

---

## FORMAT

```
APPROVE: ID     — godkänn och exekvera detta work item autonomt
REJECT: ID      — avvisa, lägg inte till i queue igen
```

---

## Aktiva beslut

APPROVE: SCAFFOLD-AUDIT
REJECT: WARNER-DEADLINE  # Gustav hanterar Warner personligen

---

## Logg — exekverade beslut

| Datum | ID | Beslut | Resultat |
|-------|----|---------|---------|
| 2026-03-25 | SCAFFOLD-AUDIT | APPROVE | Avveckla min-analytiker + adminassistent scaffold-repos |
| 2026-03-25 | WARNER-DEADLINE | REJECT | Gustav hanterar dialogen personligen |


<!-- COO-agent 2026-03-25 -->
PENDING: WARNER-DEADLINE  # Sätt ultimatum för Warner breach-respons [TODAY]
PENDING: SCAFFOLD-AUDIT  # Avveckla värdelösa scaffold-projekt [THIS_WEEK]
