# 🚀 Guide de Déploiement GitHub Pages - Hospifinance

Ce guide vous explique comment déployer Hospifinance sur GitHub Pages en quelques étapes simples.

## 📋 Prérequis

- Un compte GitHub (gratuit)
- Git installé sur votre ordinateur
- Node.js et npm installés

## 🔧 Étape 1: Préparer le Projet (DÉJÀ FAIT ✅)

Le projet est déjà configuré pour GitHub Pages avec:
- ✅ `gh-pages` installé dans `package.json`
- ✅ Scripts de déploiement (`npm run deploy`)
- ✅ Configuration Vite adaptative (local vs production)
- ✅ `.gitignore` approprié

## 📦 Étape 2: Créer le Dépôt GitHub

### Option A: Via le site GitHub (Recommandé)

1. **Connectez-vous** sur https://github.com

2. **Créez un nouveau dépôt**:
   - Cliquez sur le **+** en haut à droite
   - Sélectionnez **"New repository"**

3. **Configurez le dépôt**:
   - **Repository name**: `hospifinance` (IMPORTANT: utilisez ce nom exact)
   - **Description**: "Tableau de bord financier DSI - Suivi OPEX & CAPEX"
   - **Visibility**: Public (pour GitHub Pages gratuit)
   - ⚠️ **NE COCHEZ PAS** "Initialize this repository with a README"
   - Cliquez sur **"Create repository"**

4. **Notez l'URL** du dépôt (elle ressemble à):
   ```
   https://github.com/VOTRE-USERNAME/hospifinance.git
   ```

### Option B: Via GitHub CLI

```bash
gh repo create hospifinance --public --description "Tableau de bord financier DSI"
```

## 🌐 Étape 3: Configurer le Nom d'Utilisateur

**IMPORTANT**: Avant de continuer, modifiez le fichier `package.json`:

```json
"homepage": "https://VOTRE-USERNAME.github.io/hospifinance",
```

Remplacez `VOTRE-USERNAME` par votre vrai nom d'utilisateur GitHub.

Exemple: Si votre username est `alex-dsi`, modifiez en:
```json
"homepage": "https://alex-dsi.github.io/hospifinance",
```

## 📤 Étape 4: Initialiser Git et Pusher

Ouvrez un terminal dans le dossier `Hospifinance` et exécutez:

```bash
# 1. Initialiser Git
git init

# 2. Ajouter tous les fichiers
git add .

# 3. Créer le premier commit
git commit -m "Initial commit - Hospifinance v2.0 optimisé"

# 4. Renommer la branche en main
git branch -M main

# 5. Ajouter le dépôt distant (remplacez VOTRE-USERNAME)
git remote add origin https://github.com/VOTRE-USERNAME/hospifinance.git

# 6. Pousser vers GitHub
git push -u origin main
```

Si demandé, entrez vos identifiants GitHub (ou utilisez un token d'accès personnel).

## 🚀 Étape 5: Installer gh-pages et Déployer

```bash
# 1. Installer gh-pages (si pas déjà fait)
npm install

# 2. Déployer sur GitHub Pages
npm run deploy
```

Cette commande va:
1. Créer un build de production optimisé
2. Le pousser sur une branche `gh-pages`
3. GitHub Pages servira automatiquement ce contenu

**Attendez 1-2 minutes** que GitHub Pages se configure.

## 🌍 Étape 6: Activer GitHub Pages (Vérification)

1. Allez sur votre dépôt GitHub: `https://github.com/VOTRE-USERNAME/hospifinance`

2. Cliquez sur **Settings** (onglet en haut)

3. Dans le menu de gauche, cliquez sur **Pages**

4. Vérifiez la configuration:
   - **Source**: Deploy from a branch
   - **Branch**: `gh-pages` / `root`
   - Cliquez sur **Save** si nécessaire

5. **URL de votre site**: Vous verrez un message:
   ```
   Your site is live at https://VOTRE-USERNAME.github.io/hospifinance/
   ```

## ✅ Étape 7: Tester Votre Site

Ouvrez l'URL: `https://VOTRE-USERNAME.github.io/hospifinance/`

Vous devriez voir votre application Hospifinance fonctionner en ligne! 🎉

## 🔄 Mettre à Jour le Site

Chaque fois que vous voulez publier des changements:

```bash
# 1. Faites vos modifications dans le code

# 2. Committez vos changements
git add .
git commit -m "Description de vos changements"
git push

# 3. Redéployez sur GitHub Pages
npm run deploy
```

## 🛠️ Scripts Disponibles

```bash
npm run dev      # Développement local (http://localhost:5173)
npm run build    # Build de production (dossier dist/)
npm run preview  # Prévisualiser le build local
npm run deploy   # Déployer sur GitHub Pages
```

## 🔍 Vérifications

### Le site ne s'affiche pas?

1. **Vérifiez le nom du dépôt**: Doit être exactement `hospifinance`
2. **Vérifiez la branche**: `gh-pages` doit exister
3. **Attendez**: Première activation = 1-5 minutes
4. **Videz le cache**: Ctrl+Shift+R ou Ctrl+F5

### Les styles ne s'affichent pas?

1. **Vérifiez package.json**:
   ```json
   "homepage": "https://VOTRE-USERNAME.github.io/hospifinance"
   ```
2. **Vérifiez vite.config.js**:
   ```javascript
   base: process.env.NODE_ENV === 'production' ? '/hospifinance/' : '/'
   ```

### Erreur 404?

L'URL doit être: `https://VOTRE-USERNAME.github.io/hospifinance/` (avec le slash final)

## 📱 Personnalisation du Domaine (Optionnel)

Pour utiliser votre propre domaine (ex: `hospifinance.votredomaine.com`):

1. Créez un fichier `CNAME` dans le dossier `public/`:
   ```
   hospifinance.votredomaine.com
   ```

2. Configurez vos DNS chez votre registrar:
   ```
   Type: CNAME
   Name: hospifinance
   Value: VOTRE-USERNAME.github.io
   ```

3. Dans GitHub Settings > Pages, ajoutez votre custom domain

## 🔒 Sécurité

- Les données sont stockées en **LocalStorage** (dans le navigateur de chaque utilisateur)
- **Aucune donnée n'est envoyée** à un serveur
- Tout reste **privé et local**
- Pour un usage multi-utilisateurs, un backend sera nécessaire

## 🆘 Support

### Commandes Git Utiles

```bash
git status              # Voir l'état des fichiers
git log --oneline       # Voir l'historique
git remote -v           # Voir les dépôts distants
git branch -a           # Voir toutes les branches
```

### Ressources

- **GitHub Pages**: https://pages.github.com
- **Documentation GitHub**: https://docs.github.com/pages
- **Support**: https://github.com/VOTRE-USERNAME/hospifinance/issues

## 🎯 Checklist de Déploiement

- [ ] Compte GitHub créé
- [ ] Dépôt `hospifinance` créé sur GitHub
- [ ] `package.json` modifié avec votre username
- [ ] Git initialisé localement (`git init`)
- [ ] Fichiers commitées (`git commit`)
- [ ] Push vers GitHub (`git push`)
- [ ] Dependencies installées (`npm install`)
- [ ] Déployé sur gh-pages (`npm run deploy`)
- [ ] GitHub Pages activé dans Settings
- [ ] Site accessible via l'URL
- [ ] Tests fonctionnels effectués

## ✨ Fonctionnalités Testées en Ligne

Une fois déployé, testez:

- [ ] Page se charge correctement
- [ ] Styles Tailwind appliqués
- [ ] Graphiques s'affichent
- [ ] Ajout/Modification/Suppression de données
- [ ] Persistence LocalStorage
- [ ] Export CSV/JSON
- [ ] Responsive design (mobile)

---

## 🎉 C'est Prêt!

Votre application est maintenant en ligne et accessible à tous via:
```
https://VOTRE-USERNAME.github.io/hospifinance/
```

Partagez ce lien avec vos collègues! 🚀

---

**Version**: 2.0.0
**Dernière mise à jour**: Février 2026
**Compatibilité**: Local (npm run dev) + GitHub Pages
