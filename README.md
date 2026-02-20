# Tableau de Bord Financier DSI Hospitalière

## 📋 Description

Application React interactive **professionnelle** pour le suivi et le reporting financier d'une Direction des Systèmes d'Information (DSI) hospitalière. Solution complète de gestion budgétaire avec authentification multi-rôles, suivi des commandes, référentiels paramétrables et synchronisation GitHub.

### ⚡ Version 3.2 — Référentiels paramétrables & UX améliorée

**Nouveautés v3.2 :**
- 📋 **Listes de choix paramétrables** — Fournisseurs OPEX, Catégories OPEX, Enveloppes CAPEX gérées dans les paramètres
- 🖱️ **Tous les onglets déplaçables** — Réorganisation par drag-and-drop, ordre persisté
- 🔡 **Filtres de colonnes stables** — Saisie sans perte de focus
- 👤 **Gestion comptes renforcée** — Superadmin peut changer le rôle et réinitialiser le mot de passe d'un utilisateur
- 📥 **Import CSV → référentiels** — Les nouvelles valeurs importées s'ajoutent automatiquement aux listes
- 🖱️ **Fix sélection de texte** — La sélection reste active même si la souris sort de la fenêtre

---

## ✨ Fonctionnalités

### 🔐 Authentification & Sécurité
- **Gestion multi-utilisateurs** avec 3 niveaux de rôles (superadmin / admin / user)
- **Hashage sécurisé** des mots de passe
- **Gestion des comptes** — Création, suppression, activation/désactivation
- **Changement de mot de passe** — Par l'utilisateur lui-même ou par un admin
- **Changement de rôle** — Par le superadmin uniquement
- **Journal d'audit** complet (connexions, modifications)
- **Identifiants par défaut** : `admin` / `Admin2024!` (à changer en production)

### 📦 Gestion des Commandes
- **Suivi complet du cycle** — 6 statuts : En attente → Commandée → Livrée → Facturée → Payée → Annulée
- **Impact budgétaire automatique** — Engagement vs Dépense selon le statut
- **Tables dédiées** — Commandes OPEX et CAPEX séparées
- **Informations détaillées** — Référence, dates commande/facture, notes

### 💰 Gestion OPEX
- Suivi des **fournisseurs** et **catégories** de dépenses (référentiels configurables)
- Budget annuel, dépenses actuelles, engagements, disponible
- Taux d'utilisation en temps réel avec alertes visuelles
- Filtres, tri, redimensionnement et réorganisation des colonnes
- Import/export CSV et JSON

### 🏗️ Gestion CAPEX
- Suivi des **projets d'investissement** par enveloppe budgétaire (référentiel configurable)
- **5 statuts** (Planifié, En cours, Terminé, Suspendu, Annulé)
- Période de réalisation (dates début/fin)
- Filtres, tri, redimensionnement et réorganisation des colonnes
- Import/export CSV et JSON

### 📊 Dashboard & Visualisation
- **Vue consolidée** OPEX + CAPEX en temps réel
- **Graphiques interactifs** (Recharts) — Barres, camemberts
- **Indicateurs clés** (KPI) — Budget, Dépenses, Engagements, Disponible
- **Alertes automatiques** en cas de dépassement des seuils
- **Tableaux de bord personnalisés** — Créez vos propres vues avec les widgets disponibles

### ⚙️ Paramétrage Avancé
- **Apparence** — Nom de l'application, 6 couleurs de thème
- **Colonnes** — Masquer/afficher colonnes OPEX/CAPEX
- **Colonnes personnalisées** — Ajout de champs métier (texte, nombre, date)
- **Règles budgétaires** — Seuils d'alerte configurables (défaut : 75 % / 90 %)
- **Listes de choix** *(admin)* — Gestion des référentiels :
  - Fournisseurs OPEX
  - Catégories OPEX
  - Enveloppes CAPEX
- **Utilisateurs** *(admin)* — CRUD complet, gestion des rôles
- **Logs** *(admin)* — Journal d'authentification avec purge
- **GitHub Sync** — Persistance des données dans un dépôt Git privé
- **Données** *(superadmin)* — Vider les tableaux OPEX/CAPEX

### 🛠️ Fonctionnalités Techniques
- ✏️ **Édition inline** des données
- ➕ **CRUD complet** — Fournisseurs, projets, commandes
- 📊 **Export des données** CSV et JSON
- 📥 **Import CSV** avec validation et mise à jour automatique des référentiels
- 💾 **Persistance automatique** — LocalStorage avec synchronisation GitHub optionnelle
- 🎨 **Interface responsive** avec Tailwind CSS
- 🖱️ **Onglets réorganisables** par drag-and-drop
- 🔡 **Filtres stables** — Saisie multi-caractères sans perte de focus
- 📐 **Colonnes redimensionnables** et réordonnables

---

## 🌐 Démo en Ligne

Accessible via GitHub Pages : `https://Ayhzer.github.io/hospifinance/`

---

## 🚀 Installation Locale

### Prérequis
- Node.js >= 16.x
- npm

### Étapes

```bash
git clone https://github.com/Ayhzer/hospifinance.git
cd hospifinance
npm install
npm run dev
```

L'application est accessible sur `http://localhost:5173`

---

## 🏗️ Architecture du Projet

```
src/
├── components/
│   ├── auth/
│   │   ├── LoginPage.jsx
│   │   └── ChangePasswordButton.jsx
│   ├── common/
│   │   ├── Button.jsx
│   │   ├── Modal.jsx
│   │   ├── Input.jsx          # Input, TextArea, Select
│   │   ├── ProgressBar.jsx
│   │   ├── AlertBanner.jsx
│   │   ├── ConfirmDialog.jsx
│   │   └── ImportModal.jsx
│   ├── dashboard/
│   │   ├── TabNavigation.jsx  # Drag-and-drop universel
│   │   ├── BudgetCard.jsx
│   │   ├── ConsolidatedBudget.jsx
│   │   └── BudgetCharts.jsx
│   ├── dashboard-builder/     # Tableaux de bord personnalisés
│   │   ├── DashboardBuilder.jsx
│   │   ├── CreateDashboardModal.jsx
│   │   └── AddWidgetModal.jsx
│   ├── opex/
│   │   ├── OpexTable.jsx
│   │   └── OpexModal.jsx
│   ├── capex/
│   │   ├── CapexTable.jsx
│   │   └── CapexModal.jsx
│   ├── orders/
│   │   ├── OrderTable.jsx
│   │   └── OrderModal.jsx
│   └── settings/
│       ├── SettingsPanel.jsx  # Panneau multi-onglets
│       └── CustomColumnsManager.jsx
├── contexts/
│   ├── AuthContext.jsx        # Auth + utilisateurs (dual-mode LS/API)
│   ├── SettingsContext.jsx    # Paramètres + référentiels (dual-mode LS/API)
│   └── PermissionsContext.jsx # Permissions par rôle
├── hooks/
│   ├── useOpexData.js
│   ├── useCapexData.js
│   ├── useOrderData.js
│   ├── useDashboardData.js
│   ├── useBudgetCalculations.js
│   ├── useTableControls.jsx   # Filtres, tri — FilterInput stable (React.memo)
│   ├── useColumnResize.jsx    # Redimensionnement colonnes
│   ├── useColumnOrder.js      # Réorganisation colonnes
│   └── useSettingsShortcut.js
├── utils/
│   ├── formatters.js
│   ├── calculations.js
│   ├── exportUtils.js
│   ├── importUtils.js
│   ├── validators.js
│   ├── authUtils.js
│   └── orderCalculations.js
├── services/
│   ├── storageService.js      # Persistence LocalStorage
│   ├── apiService.js          # Client API REST (mode backend)
│   └── githubStorageService.js # Sync GitHub
├── constants/
│   ├── budgetConstants.js     # OPEX_CATEGORIES, ENVELOPPES_CAPEX (valeurs par défaut)
│   └── orderConstants.js
├── App.jsx
├── main.jsx
└── index.css
```

---

## 📊 Utilisation

### Première Connexion
1. Ouvrir `http://localhost:5173`
2. Se connecter avec `admin` / `Admin2024!`
3. **Recommandé** : changer immédiatement le mot de passe admin

### Configurer les Référentiels (Admin)
1. `Ctrl+Shift+P` → **Listes de choix**
2. Gérer les fournisseurs OPEX, catégories OPEX, enveloppes CAPEX
3. Les valeurs importées via CSV s'ajoutent automatiquement

### Gérer les Utilisateurs (Admin)
1. `Ctrl+Shift+P` → **Utilisateurs**
2. Créer des comptes avec les rôles appropriés :
   - **superadmin** : accès total (réservé au compte admin principal)
   - **admin** : gestion utilisateurs + référentiels + données
   - **user** : consultation uniquement
3. Le superadmin peut changer le rôle et réinitialiser le MDP de n'importe quel compte

### Gérer les Fournisseurs OPEX
1. Onglet **OPEX** → **Nouveau fournisseur**
2. Sélectionner le fournisseur et la catégorie depuis les listes paramétrées
3. Les dépenses/engagements sont agrégés depuis les commandes associées

### Gérer les Projets CAPEX
1. Onglet **CAPEX** → **Nouveau projet**
2. Sélectionner l'enveloppe budgétaire depuis la liste paramétrée
3. Les dépenses/engagements sont agrégés depuis les commandes associées

### Suivre les Commandes
1. Onglet **Commandes OPEX** ou **Commandes CAPEX**
2. **Impact automatique** :
   - **En attente / Annulée** : aucun impact
   - **Commandée / Livrée** : comptabilisée en Engagement
   - **Facturée / Payée** : comptabilisée en Dépense

### Importer des Données
- Bouton **Import CSV** dans chaque tableau
- Les nouveaux fournisseurs, catégories et enveloppes sont automatiquement ajoutés aux référentiels
- Les lignes invalides ou doublons sont rejetés avec détail des erreurs

### Réorganiser les Onglets
- **Glisser-déposer** n'importe quel onglet pour le repositionner
- L'ordre est mémorisé entre les sessions

### Synchronisation GitHub
1. `Ctrl+Shift+P` → **GitHub**
2. Configurer le token, le dépôt et le dossier de données
3. Les modifications sont poussées automatiquement (délai 800 ms)

---

## ✨ Historique des Versions

### Version 3.2 (Février 2026) — Actuelle
- ✅ **Listes de choix paramétrables** — Fournisseurs OPEX, Catégories OPEX, Enveloppes CAPEX
- ✅ **Import CSV → référentiels** — Mise à jour automatique des listes lors des imports
- ✅ **Tous les onglets déplaçables** — Drag-and-drop universel avec persistance
- ✅ **Filtres de colonnes stables** — Plus de perte de focus lors de la saisie
- ✅ **Gestion des comptes renforcée** — Superadmin : reset MDP + changement de rôle
- ✅ **Fix sélection de texte** — Sélection stable même si la souris quitte la fenêtre

### Version 3.1 (Février 2026)
- ✅ Pilotage budgétaire renforcé — Synthèse OPEX/CAPEX optimisée
- ✅ Protection des données — Pas d'écrasement lors des mises à jour
- ✅ Stabilité améliorée

### Version 3.0 (Février 2026)
- ✅ Authentification complète — Gestion utilisateurs avec rôles
- ✅ Système de commandes — Suivi cycle complet + impact budgétaire
- ✅ Paramétrage avancé — Apparence, colonnes, règles, utilisateurs
- ✅ Journal d'audit — Logs de connexion
- ✅ Synchronisation GitHub

### Version 2.0 (2025)
- ✅ Refonte architecture — Modulaire (36 fichiers)
- ✅ Persistance automatique — LocalStorage
- ✅ Graphiques interactifs — Recharts
- ✅ Hooks optimisés

### Version 1.0 (2024)
- ✅ Version initiale — Dashboard OPEX/CAPEX monolithique

### 🎯 Feuille de Route

#### Court terme (Q2-Q3 2026)
- [ ] **Tests unitaires** — Jest + React Testing Library
- [ ] **Migration TypeScript** — Type-safety complète
- [ ] **Mode sombre** — Dark mode avec persistance
- [ ] **Export PDF** — Rapports formatés

#### Moyen terme (Q3-Q4 2026)
- [ ] **Backend API** — Node.js + PostgreSQL
- [ ] **JWT Authentication** — Remplacement LocalStorage
- [ ] **Notifications** — Email + push
- [ ] **PWA** — Installation sur mobile/desktop
- [ ] **Multi-tenancy** — Plusieurs établissements

#### Long terme (2027+)
- [ ] **Module Biomédical** — Suivi équipements médicaux
- [ ] **Intégration ERP** — SAP, Oracle Financials
- [ ] **Analytics BI** — Tableaux de bord avancés

---

## 🛠️ Technologies

| Technologie | Rôle |
|---|---|
| React 18 | Framework UI avec hooks optimisés |
| Vite | Build tool avec HMR |
| Tailwind CSS | Framework CSS utilitaire |
| Lucide React | Icônes |
| Recharts | Graphiques interactifs |
| GitHub API | Synchronisation des données |

---

## 🤝 Contribution

1. Forker le projet
2. Créer une branche (`git checkout -b feature/amelioration`)
3. Commiter (`git commit -m 'Description'`)
4. Pousser (`git push origin feature/amelioration`)
5. Ouvrir une Pull Request

## 📝 Licence

MIT License

## 👤 Auteur

**Alex** — Directeur adjoint des systèmes d'information, établissement hospitalier privé

---

*Ce projet est conçu pour un usage professionnel dans le secteur de la santé. Les données d'exemple sont fictives.*
