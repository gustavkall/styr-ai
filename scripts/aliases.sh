# Styr-AI alias
# Lägg till i ~/.zshrc:
# source ~/styr-ai/scripts/aliases.sh

# Global todo
alias todo='cd ~/styr-ai && git pull --rebase origin main -q && bash ~/styr-ai/scripts/todo.sh'

# Sync (kör från valfritt repo)
alias sync='git pull --rebase origin main && bash scripts/sync.sh'

# Deploy (kör från valfritt repo när plan är godkänd)
alias deploy='git pull --rebase origin main && bash scripts/deploy.sh'

# Boot = sync vid sessionstart
alias boot='git pull --rebase origin main && bash scripts/sync.sh'

# Uppdatera styr-ai lokalt
alias styr='cd ~/styr-ai && git pull --rebase origin main -q'
