# 🚀 Guide de Démarrage Rapide

## Étape 1 : Créer le dépôt GitHub

1. Allez sur https://github.com/new
2. Nom du dépôt : `hospital-it-finance-dashboard`
3. Description : "Tableau de bord financier pour le suivi OPEX et CAPEX d'une DSI hospitalière"
4. Visibilité : Public ou Private selon votre préférence
5. **Ne cochez PAS** "Add a README file" (nous en avons déjà un)
6. Cliquez sur "Create repository"

## Étape 2 : Télécharger les fichiers

1. Téléchargez tous les fichiers du projet depuis cette conversation
2. Créez un dossier local `hospital-it-finance-dashboard`
3. Placez tous les fichiers dans ce dossier

## Étape 3 : Initialiser Git et pousser vers GitHub

Ouvrez un terminal dans le dossier du projet et exécutez :

```bash
# Initialiser le dépôt Git
git init

# Ajouter tous les fichiers
git add .

# Créer le premier commit
git commit -m "Initial commit - Dashboard financier DSI"

# Ajouter le dépôt distant (remplacez [VOTRE-USERNAME] par votre nom d'utilisateur GitHub)
git remote add origin https://github.com/[VOTRE-USERNAME]/hospital-it-finance-dashboard.git

# Pousser vers GitHub
git branch -M main
git push -u origin main
```

## Étape 4 : Ouvrir dans VS Code

```bash
# Ouvrir le projet dans VS Code
code .
```

Ou depuis VS Code :
- File → Open Folder
- Sélectionnez le dossier `hospital-it-finance-dashboard`

## Étape 5 : Installer les dépendances

Dans le terminal intégré de VS Code :

```bash
npm install
```

## Étape 6 : Lancer le projet

```bash
npm run dev
```

L'application s'ouvrira automatiquement dans votre navigateur sur `http://localhost:5173`

## 🎯 Structure du projet dans VS Code

```
hospital-it-finance-dashboard/
├── 📄 App.jsx              <- Composant principal (COMMENCEZ ICI)
├── 📄 main.jsx             <- Point d'entrée React
├── 📄 index.html           <- HTML de base
├── 📄 index.css            <- Styles Tailwind
├── 📄 package.json         <- Dépendances et scripts
├── 📄 vite.config.js       <- Configuration Vite
├── 📄 tailwind.config.js   <- Configuration Tailwind
├── 📄 postcss.config.js    <- Configuration PostCSS
├── 📄 .eslintrc.cjs        <- Configuration ESLint
├── 📄 .gitignore           <- Fichiers ignorés par Git
├── 📄 README.md            <- Documentation complète
├── 📄 LICENSE              <- Licence MIT
└── 📄 QUICK_START.md       <- Ce fichier
```

## 📝 Prochaines étapes

### Développement local
- Modifiez `App.jsx` pour personnaliser le dashboard
- Ajoutez de nouvelles fonctionnalités
- Testez en temps réel avec le hot reload de Vite

### Synchronisation avec GitHub
```bash
# Après vos modifications
git add .
git commit -m "Description de vos changements"
git push
```

### Déploiement (optionnel)
- **Vercel** : Connectez votre dépôt GitHub → déploiement automatique
- **Netlify** : Même processus que Vercel
- **GitHub Pages** : `npm run build` puis déployez le dossier `dist`

## 🆘 Besoin d'aide ?

### Erreurs courantes

**Port 5173 déjà utilisé** :
```bash
# Changer le port dans vite.config.js ou tuer le processus
npx kill-port 5173
```

**Module non trouvé** :
```bash
# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
```

**Git non configuré** :
```bash
git config --global user.name "Votre Nom"
git config --global user.email "votre.email@example.com"
```

## ✅ Checklist avant de commencer

- [ ] Node.js installé (vérifier : `node --version`)
- [ ] Git installé (vérifier : `git --version`)
- [ ] VS Code installé
- [ ] Compte GitHub créé
- [ ] Tous les fichiers téléchargés
- [ ] Dépôt GitHub créé

---

**Bon développement ! 🚀**
