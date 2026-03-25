# styr-ai — Approvals
*Gustav godkänner eller avvisar agent-förslag här.*
*Agenten läser denna fil vid varje körning och agerar på godkända items.*

---

## FORMAT

```
APPROVE: ID     — godkänn och exekvera detta work item autonomt
REJECT: ID      — avvisa, lägg inte till i queue igen
```

## Exempel
```
APPROVE: DEADLINE-004
REJECT: VALUE-001
```

---

## Aktiva beslut

*(inga ännu — Gustav skriver APPROVE: eller REJECT: här)*

---

## Logg — exekverade beslut

| Datum | ID | Beslut | Resultat |
|-------|----|---------|---------|


<!-- COO-agent 2026-03-25 -->
PENDING: WARNER-DEADLINE  # Sätt ultimatum för Warner breach-respons [TODAY]
PENDING: SCAFFOLD-AUDIT  # Avveckla värdelösa scaffold-projekt [THIS_WEEK]