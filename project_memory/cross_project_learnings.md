# Cross-Project Learnings

*Aggregerade insikter fran alla underprojekt. Uppdateras av styr-ai vid session boot.*

---

## Systeminsikter

### 2026-03-23 — Persistent memory setup
- GitHub MCP Connector maste INSTALLERAS (inte bara auktoriseras) for write-access
- Privata repos kraver installation via github.com/apps/anthropic-github-mcp-connector
- Alternativ: gor repos publika (inga hemligheter i state-filer)
- `tr '-' ''` i zsh ger tomt resultat — anvand `tr -d '-'` istallet
- Claude.ai-appar som tajmar ut kan inte exportera — skapa sammanfattning i ny chat och skriv till repo manuellt
- Session boot-instruktioner i Claude.ai Project Instructions ar tillrackligt for att driva read/write-cykeln
- Globala instruktioner (kontoniva) + projekt-instruktioner = komplett kontext utan upprepning

---

## Cross-project patterns

*(Fylls pa efterhand som projekten genererar learnings)*
