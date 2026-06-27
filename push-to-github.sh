#!/bin/bash
# ============================================================
# Script de déploiement Vectra vers GitHub + Vercel
# ============================================================
# Usage:
#   1. Crée un repo vide sur GitHub (sans README, sans .gitignore)
#      https://github.com/new
#   2. Renseigne l'URL du repo ci-dessous
#   3. Lance: bash push-to-github.sh
# ============================================================

# 👇 REMPLACE CECI par l'URL de ton repo GitHub
GITHUB_URL="https://github.com/VOTRE-USERNAME/vectra.git"

echo "=========================================="
echo "  Vectra — Push vers GitHub"
echo "=========================================="
echo ""
echo "Repo cible: $GITHUB_URL"
echo ""

# Vérifier qu'on est dans le bon dossier
if [ ! -f "package.json" ] || [ ! -d "src" ]; then
  echo "❌ Erreur: lance ce script depuis la racine du projet Vectra"
  exit 1
fi

# Ajouter le remote
echo "📦 Ajout du remote 'origin'..."
git remote remove origin 2>/dev/null
git remote add origin "$GITHUB_URL"

# Pousser
echo "🚀 Push vers GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Code poussé avec succès sur GitHub !"
  echo ""
  echo "Prochaines étapes pour déployer sur Vercel :"
  echo "  1. Va sur https://vercel.com/new"
  echo "  2. Importe ton repo GitHub"
  echo "  3. Vercel détecte Next.js automatiquement"
  echo "  4. Clique sur 'Deploy'"
  echo ""
  echo "🎉 Ton site sera en ligne en ~2 minutes."
else
  echo ""
  echo "❌ Erreur lors du push."
  echo ""
  echo "Causes possibles :"
  echo "  - Authentification: configure un Personal Access Token (PAT)"
  echo "    https://docs.github.com/fr/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens"
  echo "  - Le repo n'existe pas encore sur GitHub"
  echo "  - L'URL est incorrecte"
fi
