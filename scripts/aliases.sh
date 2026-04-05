# Styr-AI alias
# Lägg till i ~/.zshrc:
# source ~/styr-ai/scripts/aliases.sh

# Global todo
alias todo='bash ~/styr-ai/scripts/todo.sh'

# Sync (kör från valfritt repo)
alias sync='git pull --rebase origin main && bash scripts/sync.sh'

# Boot
alias boot='git pull --rebase origin main && bash scripts/sync.sh'

# Uppdatera styr-ai lokalt
alias styr-update='cd ~/styr-ai && git pull --rebase origin main'
