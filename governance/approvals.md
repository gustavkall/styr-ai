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
