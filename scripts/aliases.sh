# Styr-AI alias
# Lägg till i ~/.zshrc:
# source ~/styr-ai/scripts/aliases.sh

# Global todo
alias todo='cd ~/styr-ai && git pull --rebase origin main -q && bash ~/styr-ai/scripts/todo.sh'

# Boot — hämtar tasks från Supabase + kollar protokoll
alias boot='git pull --rebase origin main && bash scripts/boot.sh'

# Sync — feedback-runda på protokoll
alias sync='git pull --rebase origin main && bash scripts/sync.sh'

# Deploy — kör godkänd plan
alias deploy='git pull --rebase origin main && bash scripts/deploy.sh'

# Uppdatera styr-ai lokalt
alias styr='cd ~/styr-ai && git pull --rebase origin main -q'
