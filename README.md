# Tableau de Bord Financier DSI Hospitalière

## 📋 Description

Application React interactive **optimisée** pour le suivi et le reporting financier d'une Direction des Systèmes d'Information (DSI) hospitalière. Permet de gérer efficacement les budgets OPEX (dépenses d'exploitation) et CAPEX (investissements).

### ⚡ Version 2.0 - Optimisée

Architecture complètement refactorisée avec:
- 🏗️ **Architecture modulaire** - Composants réutilisables et maintenables
- 🚀 **Performances optimisées** - Hooks mémorisés et rendu optimisé
- 💾 **Persistence automatique** - LocalStorage intégré
- 📊 **Graphiques interactifs** - Visualisations avec Recharts
- ✅ **Validation robuste** - Contrôles de saisie avancés
- 🎨 **UI/UX améliorée** - Modales élégantes et dialogues de confirmation

## ✨ Fonctionnalités

### Vue d'ensemble
- **Dashboard consolidé** avec indicateurs clés (KPI)
- **Alertes automatiques** en cas de dépassement budgétaire (>90% d'utilisation)
- **Visualisations** avec barres de progression colorées selon le taux d'utilisation

### Gestion OPEX
- Suivi des **fournisseurs** et **catégories** de dépenses
- Budget annuel, dépenses actuelles, engagements
- Calcul automatique du budget disponible
- Taux d'utilisation en temps réel

### Gestion CAPEX
- Suivi des **projets d'investissement**
- Statuts de projets (Planifié, En cours, Terminé, Suspendu, Annulé)
- Période de réalisation (dates début/fin)
- Tracking budgétaire détaillé

### Fonctionnalités avancées
- ✏️ **Édition inline** des données
- ➕ **Ajout/Suppression** de fournisseurs et projets
- 📊 **Export des données** (CSV et JSON)
- 🎨 **Interface responsive** avec Tailwind CSS
- 🔔 **Alertes visuelles** pour les dépassements budgétaires

## 🌐 Démo en Ligne

**Version hébergée sur GitHub Pages**: Suivez le guide [GITHUB_PAGES_DEPLOY.md](GITHUB_PAGES_DEPLOY.md) pour déployer votre propre version.

Une fois déployé, accessible via: `https://VOTRE-USERNAME.github.io/hospifinance/`

## 🚀 Installation Locale

### Prérequis
- Node.js >= 16.x
- npm ou yarn

### Étapes d'installation

```bash
# Cloner le dépôt
git clone https://github.com/[VOTRE-USERNAME]/hospital-it-finance-dashboard.git

# Aller dans le répertoire
cd hospital-it-finance-dashboard

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## 📦 Structure du projet

```
hospital-it-finance-dashboard/
├── App.jsx                 # Composant principal
├── main.jsx               # Point d'entrée React
├── index.html             # HTML de base
├── package.json           # Dépendances
├── vite.config.js         # Configuration Vite
├── tailwind.config.js     # Configuration Tailwind CSS
├── postcss.config.js      # Configuration PostCSS
└── README.md              # Documentation
```

## 🛠️ Technologies utilisées

- **React 18** - Framework UI avec hooks optimisés
- **Vite** - Build tool ultra-rapide avec HMR
- **Tailwind CSS** - Framework CSS utilitaire
- **Lucide React** - Icônes modernes
- **Recharts** - Graphiques interactifs
- **JavaScript ES6+** - Langage de programmation moderne

## 🏗️ Architecture du Projet

```
src/
├── components/
│   ├── common/           # Composants réutilisables
│   │   ├── Button.jsx
│   │   ├── Modal.jsx
│   │   ├── Input.jsx
│   │   ├── ProgressBar.jsx
│   │   ├── AlertBanner.jsx
│   │   └── ConfirmDialog.jsx
│   ├── dashboard/        # Composants du dashboard
│   │   ├── TabNavigation.jsx
│   │   ├── BudgetCard.jsx
│   │   ├── ConsolidatedBudget.jsx
│   │   └── BudgetCharts.jsx
│   ├── opex/            # Composants OPEX
│   │   ├── OpexTable.jsx
│   │   └── OpexModal.jsx
│   └── capex/           # Composants CAPEX
│       ├── CapexTable.jsx
│       └── CapexModal.jsx
├── hooks/               # Hooks personnalisés
│   ├── useOpexData.js
│   ├── useCapexData.js
│   └── useBudgetCalculations.js
├── utils/               # Fonctions utilitaires
│   ├── formatters.js    # Formatage (devise, dates)
│   ├── calculations.js  # Calculs budgétaires
│   ├── exportUtils.js   # Exports CSV/JSON
│   └── validators.js    # Validation des données
├── services/            # Services externes
│   └── storageService.js # Persistence LocalStorage
├── constants/           # Constantes
│   └── budgetConstants.js
├── App.jsx             # Composant principal
├── main.jsx            # Point d'entrée
└── index.css           # Styles globaux
```

## 📊 Utilisation

### Ajouter un fournisseur OPEX
1. Cliquer sur l'onglet "OPEX"
2. Cliquer sur "Nouveau fournisseur"
3. Remplir le formulaire
4. Cliquer sur "Enregistrer"

### Ajouter un projet CAPEX
1. Cliquer sur l'onglet "CAPEX"
2. Cliquer sur "Nouveau projet"
3. Remplir le formulaire
4. Cliquer sur "Enregistrer"

### Exporter les données
- Boutons **CSV** et **JSON** disponibles dans chaque onglet
- Les exports incluent toutes les données avec horodatage

## ✨ Nouveautés Version 2.0

### ✅ Implémenté
- [x] **Persistance automatique** - LocalStorage intégré
- [x] **Graphiques interactifs** - Barres et camemberts
- [x] **Architecture modulaire** - 20+ composants réutilisables
- [x] **Hooks optimisés** - useMemo/useCallback pour performances
- [x] **Validation robuste** - Contrôles de saisie avancés
- [x] **UI/UX améliorée** - Modales et dialogues élégants
- [x] **Export amélioré** - CSV/JSON avec formatage

### 🎯 Feuille de route

#### Court terme (Q1 2026)
- [ ] Tests unitaires (Jest + React Testing Library)
- [ ] Migration TypeScript pour type-safety
- [ ] Import de données CSV/Excel
- [ ] Mode sombre (Dark mode)
- [ ] Impression et export PDF

#### Moyen terme (Q2-Q3 2026)
- [ ] Backend API (Node.js + PostgreSQL)
- [ ] Authentification utilisateur (JWT)
- [ ] Historique et audit des modifications
- [ ] Dashboard multi-utilisateurs avec rôles
- [ ] Notifications par email
- [ ] Progressive Web App (PWA)

#### Long terme (2026+)
- [ ] Module RH (gestion des ressources)
- [ ] Module Biomédical
- [ ] Intégration ERP (SAP, Oracle)
- [ ] Analytics avancées (BI)
- [ ] Mobile apps (React Native)

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Forker le projet
2. Créer une branche (`git checkout -b feature/amelioration`)
3. Commiter vos changements (`git commit -m 'Ajout de fonctionnalité'`)
4. Pusher vers la branche (`git push origin feature/amelioration`)
5. Ouvrir une Pull Request

## 📝 License

MIT License - voir le fichier LICENSE pour plus de détails

## 👤 Auteur

**Alex** - Deputy Director of Information Systems
- Rôle : Directeur adjoint des systèmes d'information
- Organisation : Établissement hospitalier privé

## 🙏 Remerciements

Développé pour faciliter le reporting financier et la gestion budgétaire des DSI hospitalières.

---

**Note** : Ce projet est conçu pour un usage professionnel dans le secteur de la santé. Les données d'exemple sont fictives.
