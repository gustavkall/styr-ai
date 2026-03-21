#!/bin/bash
# Initialize scaffold — replaces all {{PLACEHOLDERS}} with your values
# Usage: ./scripts/init.sh

echo "🔧 Claude Memory Scaffold — Project Setup"
echo ""

read -p "Project name: " PROJECT_NAME
read -p "Description (one line): " DESCRIPTION
read -p "GitHub username: " GITHUB_USER
read -p "Repo name: " REPO_NAME
read -p "Vercel URL (e.g. https://myapp.vercel.app): " VERCEL_URL

DATE=$(date +%Y-%m-%d)

echo ""
echo "Replacing placeholders..."

# Replace in all relevant files
find . -type f \( -name "*.md" -o -name "*.js" -o -name "*.json" -o -name "*.sql" -o -name "*.html" \) \
  ! -path "./node_modules/*" ! -path "./.git/*" | while read file; do
  sed -i '' \
    -e "s|{{PROJECT_NAME}}|$PROJECT_NAME|g" \
    -e "s|{{DESCRIPTION}}|$DESCRIPTION|g" \
    -e "s|{{GITHUB_USER}}|$GITHUB_USER|g" \
    -e "s|{{REPO_NAME}}|$REPO_NAME|g" \
    -e "s|{{VERCEL_URL}}|$VERCEL_URL|g" \
    -e "s|{{DATE}}|$DATE|g" \
    "$file"
done

echo "✅ Done. Next steps:"
echo ""
echo "  1. cp .env.example .env && edit .env (add Supabase keys)"
echo "  2. Run setup-supabase.sql in Supabase SQL Editor"
echo "  3. npm install && source .env && npm run seed"
echo "  4. git init && git add -A && git commit -m 'feat: initial scaffold'"
echo "  5. Create GitHub repo + Vercel project, add env vars"
echo "  6. git remote add origin ... && git push -u origin main"
echo "  7. Test: curl $VERCEL_URL/api/state"
echo ""
echo "🚀 Ready for first session boot!"
