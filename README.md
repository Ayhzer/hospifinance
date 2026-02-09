# Tableau de Bord Financier DSI Hospitalière

## 📋 Description

Application React interactive **professionnelle** pour le suivi et le reporting financier d'une Direction des Systèmes d'Information (DSI) hospitalière. Solution complète de gestion budgétaire avec authentification, suivi des commandes et pilotage avancé.

### ⚡ Version 3.1 - Solution Professionnelle Complète

**Nouveautés majeures v3.0/3.1:**
- 🔐 **Authentification robuste** - Gestion utilisateurs avec rôles (superadmin/admin/user)
- 📦 **Gestion des commandes** - Suivi du cycle complet avec impact budgétaire
- ⚙️ **Paramétrage avancé** - Personnalisation complète (couleurs, colonnes, seuils)
- 📊 **Pilotage budgétaire** - Synthèse OPEX/CAPEX consolidée en temps réel

**Architecture v2.0 (maintenue):**
- 🏗️ **Architecture modulaire** - 36 fichiers source organisés
- 🚀 **Performances optimisées** - Hooks mémorisés et rendu optimisé
- 💾 **Persistence automatique** - LocalStorage intégré
- 📊 **Graphiques interactifs** - Visualisations avec Recharts
- ✅ **Validation robuste** - Contrôles de saisie avancés
- 🎨 **UI/UX améliorée** - Modales élégantes et dialogues de confirmation
- 📱 **100% Responsive** - Optimisé pour smartphones et tablettes

## ✨ Fonctionnalités

### 🔐 Authentification & Sécurité
- **Gestion multi-utilisateurs** avec 3 niveaux de rôles (superadmin/admin/user)
- **Hashage sécurisé** des mots de passe (SHA-256)
- **Gestion des comptes** - Création, suppression, activation/désactivation
- **Changement de mot de passe** par les administrateurs
- **Journal d'audit** complet (connexions, modifications)
- **Identifiants par défaut**: admin/admin (à changer en production)

### 📦 Gestion des Commandes
- **Suivi complet du cycle** - 6 statuts (En attente → Commandée → Livrée → Facturée → Payée → Annulée)
- **Impact budgétaire automatique** - Engagement vs Dépense selon le statut
- **Tables dédiées** - Commandes OPEX et CAPEX séparées
- **Informations détaillées** - Référence, dates commande/facture, notes
- **Calculs en temps réel** - Agrégation automatique par fournisseur/projet

### 💰 Gestion OPEX
- Suivi des **fournisseurs** et **8 catégories** de dépenses
- Budget annuel, dépenses actuelles, engagements
- **Calcul automatique** du budget disponible
- Taux d'utilisation en temps réel avec alertes
- **Fournisseurs par défaut**: Oracle Health, Microsoft, Dell Technologies

### 🏗️ Gestion CAPEX
- Suivi des **projets d'investissement**
- **5 statuts** (Planifié, En cours, Terminé, Suspendu, Annulé)
- Période de réalisation (dates début/fin)
- Tracking budgétaire détaillé par projet
- **Projets par défaut**: Datacenter, VDI, Cybersécurité

### 📊 Dashboard & Visualisation
- **Vue consolidée** OPEX + CAPEX en temps réel
- **Graphiques interactifs** (Recharts) - Barres, camemberts, tendances
- **Indicateurs clés** (KPI) - Budget, Dépenses, Engagements, Disponible
- **Alertes automatiques** en cas de dépassement (>90%)
- **Barres de progression** colorées (vert/jaune/rouge)

### ⚙️ Paramétrage Avancé
- **Apparence personnalisable** - Nom de l'app, couleurs du thème (6 couleurs)
- **Visibilité des colonnes** - Masquer/afficher colonnes OPEX/CAPEX
- **Règles budgétaires** - Seuils d'alerte configurables (défaut: 75%/90%)
- **Gestion utilisateurs** - CRUD complet (admin uniquement)
- **Journal d'audit** - Accès aux logs d'authentification
- **Raccourci clavier** - Ctrl+Shift+P ou triple-clic sur le titre

### 🛠️ Fonctionnalités Techniques
- ✏️ **Édition inline** des données
- ➕ **CRUD complet** - Fournisseurs, projets, commandes
- 📊 **Export des données** (CSV et JSON formatés)
- 💾 **Persistence automatique** - LocalStorage avec auto-sauvegarde
- 🎨 **Interface responsive** avec Tailwind CSS
- 🔔 **Validation en temps réel** - Contrôles de saisie avancés

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
├── components/           # 19 composants React
│   ├── auth/            # Authentification (1)
│   │   └── LoginPage.jsx
│   ├── common/          # Composants réutilisables (6)
│   │   ├── Button.jsx
│   │   ├── Modal.jsx
│   │   ├── Input.jsx
│   │   ├── ProgressBar.jsx
│   │   ├── AlertBanner.jsx
│   │   └── ConfirmDialog.jsx
│   ├── dashboard/       # Composants du dashboard (4)
│   │   ├── TabNavigation.jsx
│   │   ├── BudgetCard.jsx
│   │   ├── ConsolidatedBudget.jsx
│   │   └── BudgetCharts.jsx
│   ├── opex/           # Composants OPEX (2)
│   │   ├── OpexTable.jsx
│   │   └── OpexModal.jsx
│   ├── capex/          # Composants CAPEX (2)
│   │   ├── CapexTable.jsx
│   │   └── CapexModal.jsx
│   ├── orders/         # Gestion des commandes (2) [NOUVEAU v3.0]
│   │   ├── OrderTable.jsx
│   │   └── OrderModal.jsx
│   └── settings/       # Paramétrage (1) [NOUVEAU v3.0]
│       └── SettingsPanel.jsx
├── contexts/           # Contextes React (2) [NOUVEAU v3.0]
│   ├── AuthContext.jsx      # Authentification & utilisateurs
│   └── SettingsContext.jsx  # Paramètres de l'application
├── hooks/              # Hooks personnalisés (5)
│   ├── useOpexData.js
│   ├── useCapexData.js
│   ├── useOrderData.js      # [NOUVEAU v3.0]
│   ├── useBudgetCalculations.js
│   └── useSettingsShortcut.js # [NOUVEAU v3.0]
├── utils/              # Fonctions utilitaires (6)
│   ├── formatters.js        # Formatage (devise, dates)
│   ├── calculations.js      # Calculs budgétaires
│   ├── exportUtils.js       # Exports CSV/JSON
│   ├── validators.js        # Validation des données
│   ├── authUtils.js         # [NOUVEAU v3.0] Hashage passwords
│   └── orderCalculations.js # [NOUVEAU v3.0] Impact commandes
├── services/           # Services (1)
│   └── storageService.js    # Persistence LocalStorage étendue
├── constants/          # Constantes (2)
│   ├── budgetConstants.js
│   └── orderConstants.js    # [NOUVEAU v3.0]
├── App.jsx            # Composant principal
├── main.jsx           # Point d'entrée
└── index.css          # Styles globaux

Total: 36 fichiers source
```

## 📊 Utilisation

### Première Connexion
1. Ouvrir l'application sur `http://localhost:5173`
2. Se connecter avec **admin** / **admin**
3. **Recommandé**: Changer immédiatement le mot de passe admin
4. Créer d'autres utilisateurs si nécessaire

### Gestion des Utilisateurs (Admin)
1. Appuyer sur **Ctrl+Shift+P** ou triple-cliquer sur le titre
2. Aller dans l'onglet **Utilisateurs**
3. Créer des comptes avec les rôles appropriés:
   - **superadmin**: Accès total (réservé au compte admin)
   - **admin**: Gestion utilisateurs + budgets
   - **user**: Consultation uniquement
4. Désactiver/Réactiver des comptes sans les supprimer

### Gérer les Fournisseurs OPEX
1. Onglet **OPEX**
2. Cliquer sur **Nouveau fournisseur**
3. Remplir: nom, catégorie, budget annuel, notes
4. Les dépenses/engagements sont calculés depuis les commandes

### Gérer les Projets CAPEX
1. Onglet **CAPEX**
2. Cliquer sur **Nouveau projet**
3. Remplir: nom, budget, statut, dates début/fin, notes
4. Les dépenses/engagements sont calculés depuis les commandes

### Suivre les Commandes
1. Onglet **Commandes OPEX** ou **Commandes CAPEX**
2. Cliquer sur **Nouvelle commande**
3. Sélectionner le fournisseur/projet parent
4. Renseigner: description, montant, statut, dates, référence
5. **Impact automatique**:
   - **En attente/Annulée**: Aucun impact
   - **Commandée/Livrée**: Comptabilisée en Engagement
   - **Facturée/Payée**: Comptabilisée en Dépense

### Personnaliser l'Application
1. **Ctrl+Shift+P** → Paramètres
2. **Apparence**: Modifier nom et couleurs du thème
3. **Colonnes**: Masquer/afficher colonnes des tableaux
4. **Règles**: Ajuster seuils d'alerte (75%/90% par défaut)

### Exporter les Données
- Boutons **CSV** et **JSON** disponibles dans chaque onglet
- Les exports incluent toutes les données avec horodatage
- Compatible Excel (CSV) et analyse programmée (JSON)

## ✨ Historique des Versions

### Version 3.1 (Février 2026) - Actuelle
- [x] **Pilotage budgétaire renforcé** - Synthèse OPEX/CAPEX optimisée
- [x] **Authentification renforcée** - Améliorations sécurité et UX
- [x] **Protection des données** - Les données de production ne sont plus écrasées lors des mises à jour 🛡️
- [x] **Stabilité améliorée** - Corrections bugs mineurs

### Version 3.0 (Février 2026)
- [x] **Authentification complète** - Gestion utilisateurs avec rôles
- [x] **Système de commandes** - Suivi cycle complet + impact budgétaire
- [x] **Paramétrage avancé** - Apparence, colonnes, règles, utilisateurs
- [x] **Journal d'audit** - Logs de connexion et modifications
- [x] **Raccourcis clavier** - Ctrl+Shift+P pour paramètres

### Version 2.0 (2025)
- [x] **Refonte architecture** - 867 lignes → 36 fichiers modulaires
- [x] **Persistance automatique** - LocalStorage intégré
- [x] **Graphiques interactifs** - Recharts (barres, camemberts)
- [x] **Hooks optimisés** - useMemo/useCallback (-40% renders)
- [x] **Validation robuste** - Contrôles de saisie avancés
- [x] **UI/UX moderne** - Modales, dialogues, animations

### Version 1.0 (2024)
- [x] **Version initiale** - Dashboard OPEX/CAPEX monolithique
- [x] **CRUD de base** - Fournisseurs et projets
- [x] **Export simple** - CSV/JSON basique

### 🎯 Feuille de route

#### Court terme (Q2 2026)
- [ ] **Tests unitaires** - Jest + React Testing Library
- [ ] **Migration TypeScript** - Type-safety complète
- [ ] **Import de données** - CSV/Excel
- [ ] **Mode sombre** - Dark mode avec persistance
- [ ] **Export PDF** - Rapports formatés

#### Moyen terme (Q3-Q4 2026)
- [ ] **Backend API** - Node.js + PostgreSQL
- [ ] **JWT Authentication** - Remplacement LocalStorage
- [ ] **Historique versions** - Audit trail complet
- [ ] **Notifications** - Email + push notifications
- [ ] **PWA** - Installation sur mobile/desktop
- [ ] **Multi-tenancy** - Plusieurs établissements

#### Long terme (2027+)
- [ ] **Module RH** - Gestion des ressources humaines
- [ ] **Module Biomédical** - Suivi équipements médicaux
- [ ] **Intégration ERP** - SAP, Oracle Financials
- [ ] **Analytics BI** - Tableaux de bord avancés
- [ ] **Apps natives** - React Native iOS/Android

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
