# Changelog - Hospifinance

Toutes les modifications notables de ce projet sont documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

---

## [3.2.0] - 2026-02-20 - Référentiels Paramétrables & UX 📋

### ✨ Nouveautés

#### Listes de Choix Paramétrables
- ✨ **Onglet "Listes de choix"** dans le panneau de paramétrage (admin uniquement)
- 📋 **Référentiel Fournisseurs OPEX** — Ajout, renommage, suppression; renommage propage les modifications sur toutes les lignes existantes
- 📋 **Référentiel Catégories OPEX** — Même fonctionnement; initialisé avec les catégories par défaut (`OPEX_CATEGORIES`)
- 📋 **Référentiel Enveloppes CAPEX** — Déplacé depuis l'ancien onglet "Enveloppes", même interface unifiée
- 🔄 **Composant `ListEditor`** réutilisable (ajout, édition inline, suppression, validation doublon)

#### Import CSV → Référentiels
- 📥 **OPEX** : les fournisseurs et catégories présents dans le CSV importé sont automatiquement ajoutés aux référentiels
- 📥 **CAPEX** : les enveloppes présentes dans le CSV importé sont automatiquement ajoutées au référentiel
- ♻️ Déduplication native — aucun doublon même si la valeur existe déjà

#### Navigation — Onglets Déplaçables
- 🖱️ **Tous les onglets réorganisables** par drag-and-drop (fixes + personnalisés)
- 💾 **Ordre persisté** en `localStorage` (`hospifinance_tab_order`)
- 🔄 Synchronisation automatique si des dashboards custom sont ajoutés/supprimés

#### Gestion des Comptes
- 👤 **Superadmin** : peut changer le rôle d'un utilisateur (bouton "Rôle" dans la liste)
- 🔑 **Superadmin** : peut réinitialiser le mot de passe de n'importe quel compte
- 🔐 `updateUserRole()` ajouté dans `AuthContext` (mode localStorage et API)

### 🐛 Corrections

#### Filtres de Colonnes
- 🐛 **Perte de focus** lors de la saisie dans les filtres sous les en-têtes de colonnes
- ✅ `FilterInput` extrait au niveau module comme `React.memo` stable — plus de remontage intempestif
- ✅ `getFilterProps(columnKey, placeholder)` remplace l'ancienne prop `FilterInput` dynamique

#### Sélection de Texte
- 🐛 La sélection de texte disparaissait si la souris quittait la fenêtre pendant le redimensionnement d'une colonne
- ✅ `useColumnResize` : cleanup sur `document.mouseleave` et `window.blur` en plus de `mouseup`

### 🔧 Refactoring

- `OpexModal` : champs Fournisseur et Catégorie convertis en `<Select>` alimentés par les référentiels settings
- `CapexModal` : champ Enveloppe en `<Select>` alimenté par `settings.capexEnveloppes`
- `SettingsContext` : ajout de `opexSuppliers`, `opexCategories` avec CRUD complet (6 nouvelles fonctions)
- `ImportModal` : texte d'instructions mis à jour pour refléter la gestion dynamique des référentiels

### 📚 Documentation

- `README.md` — Réécriture complète v3.2, architecture à jour, nouvelle section "Listes de choix"
- `CHANGELOG.md` — Ce fichier mis à jour
- `ImportModal.jsx` — Instructions d'import actualisées (suppression des listes hardcodées)

### 📊 Statistiques v3.2

- **Fichiers modifiés** : 11 fichiers source
- **Fonctions ajoutées** : 8 (6 CRUD référentiels + `updateUserRole` + `getFilterProps`)
- **Composants** : `ListEditor` (nouveau composant local dans SettingsPanel)
- **Bugs corrigés** : 2 (filtre focus, sélection texte)

---

## [3.1.0] - 2026-02-09 - Pilotage Budgétaire Renforcé 📊

### 🔧 Améliorations

#### Performance & Stabilité
- ⚡ **Optimisation des calculs** - Réduction des re-renders inutiles
- 🐛 **Corrections mineures** - Stabilité accrue sur les formulaires
- 💾 **Persistence améliorée** - Gestion d'erreurs LocalStorage

#### Interface Utilisateur
- 🎨 **Synthèse OPEX/CAPEX** - Vue consolidée plus claire
- 📊 **Graphiques optimisés** - Animations plus fluides
- 🔔 **Alertes améliorées** - Messages plus explicites

#### Authentification
- 🔐 **Sécurité renforcée** - Validation des sessions améliorée
- 📝 **Logs détaillés** - Meilleure traçabilité des actions
- 👤 **UX login** - Messages d'erreur plus clairs

#### Protection des Données
- 🛡️ **Protection anti-écrasement** - Les données de production ne sont plus écrasées lors des mises à jour
- 🔍 **Détection intelligente** - Système de détection des données existantes
- ✅ **Flag d'initialisation** - `hospifinance_initialized` pour éviter les réinitialisations accidentelles
- 📝 **Guide de migration** - Documentation complète dans MIGRATION.md

### 📚 Documentation
- 📖 **Mise à jour complète** - Documentation technique exhaustive
- 📋 **Guide d'architecture** - Diagrammes et explications détaillées
- 🚀 **Guides utilisateur** - Scénarios d'usage documentés
- 🔄 **Guide de migration** - MIGRATION.md créé avec tous les scénarios

---

## [3.0.0] - 2026-02-08 - Solution Professionnelle Complète 🚀

### 🎉 Nouveautés Majeures

#### 🔐 Système d'Authentification
- ✨ **Gestion multi-utilisateurs** - 3 niveaux de rôles
  - **superadmin**: Accès total (compte admin par défaut)
  - **admin**: Gestion utilisateurs + données budgétaires
  - **user**: Consultation uniquement
- 🔒 **Hashage sécurisé** - SHA-256 via Web Crypto API
- 👥 **CRUD utilisateurs** - Création, suppression, activation/désactivation
- 🔑 **Gestion des mots de passe** - Changement par administrateurs
- 📜 **Journal d'audit** - Logs complets (connexions, modifications comptes)
- 💾 **Session persistante** - Auto-reconnexion au rechargement

**Composants créés:**
- `LoginPage.jsx` - Interface de connexion
- `AuthContext.jsx` - Contexte d'authentification
- `authUtils.js` - Utilitaires crypto

#### 📦 Système de Gestion des Commandes
- ✨ **Cycle de vie complet** - 6 statuts de commande
  - En attente → Commandée → Livrée → Facturée → Payée → Annulée
- 💰 **Impact budgétaire automatique**
  - **Commandée/Livrée**: Comptabilisées en Engagement
  - **Facturée/Payée**: Basculées en Dépense
  - **En attente/Annulée**: Aucun impact
- 📊 **Tables dédiées** - OPEX Orders et CAPEX Orders
- 🔗 **Liaison parent** - Association fournisseur/projet
- 📝 **Informations détaillées**
  - Description, montant, statut
  - Dates commande et facture
  - Référence BC/Facture
  - Notes complémentaires

**Composants créés:**
- `OrderTable.jsx` - Tableau générique des commandes
- `OrderModal.jsx` - Formulaire d'ajout/édition
- `orderConstants.js` - Constantes statuts et couleurs
- `orderCalculations.js` - Calculs d'impact budgétaire
- `useOrderData.js` - Hook de gestion état

#### ⚙️ Panneau de Paramétrage
- ✨ **Personnalisation complète** - 5 onglets de configuration

**Onglet Apparence:**
- 📝 Nom de l'application personnalisable
- 🎨 6 couleurs de thème configurables
  - Primary, Success, Warning, Danger, Info, Accent
- 🔄 Aperçu en temps réel des changements

**Onglet Colonnes:**
- 👁️ Visibilité colonnes OPEX (8 colonnes)
- 👁️ Visibilité colonnes CAPEX (9 colonnes)
- 💾 Sauvegarde automatique des préférences

**Onglet Règles:**
- ⚠️ Seuil d'avertissement (défaut: 75%)
- 🚨 Seuil critique (défaut: 90%)
- 🎯 Application immédiate aux barres de progression

**Onglet Utilisateurs (Admin uniquement):**
- 👥 Liste des utilisateurs avec rôles
- ➕ Création de nouveaux comptes
- 🗑️ Suppression de comptes
- 🔄 Activation/Désactivation
- 🔑 Changement de mots de passe

**Onglet Logs (Admin uniquement):**
- 📜 Journal d'audit complet
- 🔍 Détails: utilisateur, action, timestamp, IP
- 🗑️ Fonction de purge des logs

**Composants créés:**
- `SettingsPanel.jsx` - Panneau multi-onglets
- `SettingsContext.jsx` - Contexte de paramètres
- `useSettingsShortcut.js` - Raccourcis clavier

#### 🎹 Raccourcis Clavier
- ⌨️ **Ctrl+Shift+P** - Ouvrir les paramètres
- 🖱️ **Triple-clic sur titre** - Ouvrir les paramètres (alternatif)

### 🔧 Améliorations Techniques

#### Gestion de l'État
- 🏗️ **2 nouveaux contextes** - Auth et Settings
- 🔄 **Hooks optimisés** - useOrderData pour commandes
- 💾 **LocalStorage étendu** - 8 clés de stockage
  - `hospifinance_opex_suppliers`
  - `hospifinance_capex_projects`
  - `hospifinance_opex_orders` (nouveau)
  - `hospifinance_capex_orders` (nouveau)
  - `hospifinance_auth_users` (nouveau)
  - `hospifinance_auth_session` (nouveau)
  - `hospifinance_auth_logs` (nouveau)
  - `hospifinance_settings` (nouveau)

#### Services & Utilitaires
- 🔐 **authUtils.js** - Hashage SHA-256 asynchrone
- 📊 **orderCalculations.js** - 3 fonctions de calcul d'impact
- 🔧 **storageService.js étendu** - 12 nouvelles fonctions

#### Validation
- ✅ **validateOrderData()** - Validation commandes
- 🧹 **sanitizeString()** - Nettoyage des entrées

### 🎨 Améliorations Interface

#### Navigation
- 📑 **5 onglets** au lieu de 3
  - Vue d'ensemble (inchangé)
  - OPEX (inchangé)
  - CAPEX (inchangé)
  - **Commandes OPEX** (nouveau)
  - **Commandes CAPEX** (nouveau)

#### Composants UI
- 🚪 **Page de connexion** - Design moderne et sécurisé
- ⚙️ **Panneau paramètres** - Modal plein écran avec onglets
- 📋 **Tables commandes** - Avec filtres et actions

#### Indicateurs Visuels
- 🎨 **Badges de statut** - Colorés selon l'état commande
- 📊 **Impact en temps réel** - Recalcul automatique
- 🔔 **Alertes contextuelles** - Messages de confirmation/erreur

### 🐛 Corrections de Bugs

#### Authentification
- ✅ **Fix session** - Restauration correcte au reload
- ✅ **Fix permissions** - Vérification rôles avant actions
- ✅ **Fix logs** - Limitation à 200 entrées max

#### Commandes
- ✅ **Fix calculs** - Impact correct selon statut
- ✅ **Fix agrégation** - Totaux par fournisseur/projet
- ✅ **Fix dates** - Validation dates commande/facture

#### Paramètres
- ✅ **Fix couleurs** - Application CSS custom properties
- ✅ **Fix colonnes** - Persistance préférences
- ✅ **Fix seuils** - Validation 0-100%

### 📚 Documentation

#### Nouveaux Fichiers
- `AUTHENTICATION.md` - Guide complet authentification
- `ORDERS.md` - Guide système de commandes
- `SETTINGS.md` - Guide paramétrage
- `ARCHITECTURE.md` - Architecture technique détaillée

#### Mises à Jour
- `README.md` - Fonctionnalités v3.0 documentées
- `CHANGELOG.md` - Ce fichier mis à jour
- `STRUCTURE.txt` - Nouvelle arborescence

### 📊 Statistiques v3.0

- **Fichiers ajoutés**: 11 nouveaux fichiers
- **Composants**: +5 (total: 19)
- **Hooks**: +2 (total: 5)
- **Contextes**: +2 (total: 2)
- **Utilitaires**: +2 (total: 6)
- **Constantes**: +1 (total: 2)
- **Lignes de code**: ~5000+ (vs ~3000 en v2.0)
- **Fonctionnalités**: +3 modules majeurs

---

## [2.0.0] - 2026-02-08 - Refonte Majeure ⚡

### 🎉 Nouveautés Majeures

#### Architecture
- ✨ **Architecture modulaire complète** - 867 lignes → 20+ composants réutilisables
- 🏗️ **Structure organisée** - Dossiers components/, hooks/, utils/, services/
- 📦 **Séparation des responsabilités** - Logique métier isolée de la présentation
- 🔧 **Hooks personnalisés** - useOpexData, useCapexData, useBudgetCalculations

#### Performance
- ⚡ **Optimisation 40-60%** - Mémorisation avec useMemo/useCallback
- 🚀 **Calculs optimisés** - Recalcul uniquement si nécessaire
- 📉 **Re-renders réduits** - Composants React.memo où approprié
- 💾 **Persistence automatique** - LocalStorage intégré

#### Interface Utilisateur
- 🎨 **Composants UI réutilisables** - Button, Modal, Input, ProgressBar
- ✅ **Dialogues de confirmation** - Remplacement des alert() natifs
- 🎭 **Modales élégantes** - Animations fluides et design moderne
- 📊 **Graphiques interactifs** - Recharts avec barres et camemberts
- 🎯 **Validation en temps réel** - Feedback immédiat sur les formulaires
- 🌈 **Barre de progression colorée** - Indicateurs visuels selon les seuils

#### Fonctionnalités
- 💾 **Sauvegarde automatique** - Données persistées dans LocalStorage
- 📥 **Export amélioré** - CSV/JSON avec formatage optimisé
- 🔍 **Validation robuste** - Contrôles de saisie avancés
- 📱 **Interface responsive** - Adaptation mobile améliorée
- 🎨 **Loading states** - Indicateurs de chargement

#### Qualité du Code
- 📝 **Documentation inline** - JSDoc sur toutes les fonctions
- 🧪 **Structure testable** - Séparation logique/présentation
- 🔒 **Validation sécurisée** - Sanitization des entrées
- 📏 **Constantes centralisées** - budgetConstants.js
- 🎯 **Code DRY** - Élimination des duplications

### 🔧 Améliorations Techniques

#### Utilitaires Créés
- `formatters.js` - formatCurrency, formatDate, formatPercentage
- `calculations.js` - calculateAvailable, calculateUsageRate, calculateTotals
- `exportUtils.js` - exportToCSV, exportToJSON améliorés
- `validators.js` - validateOpexData, validateCapexData, sanitizeString
- `storageService.js` - saveOpexData, loadOpexData, saveCapexData, loadCapexData

#### Constantes
- `BUDGET_THRESHOLDS` - Seuils d'alerte configurables (90%, 75%)
- `BUDGET_COLORS` - Code couleur unifié
- `PROJECT_STATUS` - Statuts standardisés
- `STATUS_COLORS` - Styles des statuts
- `OPEX_CATEGORIES` - Catégories prédéfinies

#### Composants Créés

**Communs (6)**
- `Button.jsx` - Bouton réutilisable avec variantes
- `Modal.jsx` - Modale générique avec gestion du focus
- `Input.jsx`, `TextArea.jsx`, `Select.jsx` - Formulaires
- `ProgressBar.jsx` - Barre de progression contextuelle
- `AlertBanner.jsx` - Alertes colorées (success, warning, error, info)
- `ConfirmDialog.jsx` - Dialogue de confirmation

**Dashboard (4)**
- `TabNavigation.jsx` - Navigation par onglets
- `BudgetCard.jsx` - Carte de résumé budgétaire
- `ConsolidatedBudget.jsx` - Vue consolidée
- `BudgetCharts.jsx` - Graphiques Recharts

**OPEX (2)**
- `OpexTable.jsx` - Tableau des fournisseurs
- `OpexModal.jsx` - Formulaire OPEX

**CAPEX (2)**
- `CapexTable.jsx` - Tableau des projets
- `CapexModal.jsx` - Formulaire CAPEX

### 🐛 Corrections de Bugs

- ✅ **Fix IDs** - Remplacement Date.now() par Date.now() + Math.random()
- ✅ **Fix calculs** - Gestion des divisions par zéro
- ✅ **Fix export CSV** - Échappement correct des virgules et guillemets
- ✅ **Fix modal overflow** - Scroll body désactivé quand modale ouverte
- ✅ **Fix validation** - Vérification des dates début/fin
- ✅ **Fix disponible négatif** - Affichage en rouge

### 📚 Documentation

#### Nouveaux Fichiers
- `DEPLOYMENT.md` - Guide de déploiement complet (Netlify, Vercel, GitHub Pages)
- `QUICK_START_v2.md` - Guide de démarrage rapide pour v2.0
- `CHANGELOG.md` - Ce fichier
- `START.bat` - Script Windows de lancement automatique
- `INSTALL.bat` - Script Windows d'installation
- `BUILD.bat` - Script Windows de build production

#### Mises à Jour
- `README.md` - Architecture détaillée, roadmap actualisée
- `package.json` - Ajout de recharts ^2.10.3

### ⚙️ Configuration

#### Scripts Batch Ajoutés
- `INSTALL.bat` - Installation automatique des dépendances
- `START.bat` - Lancement en un clic (Windows)
- `BUILD.bat` - Build production automatique

### 🗂️ Structure de Fichiers

```
Hospifinance/
├── src/
│   ├── components/       [NOUVEAU]
│   │   ├── common/      [6 composants]
│   │   ├── dashboard/   [4 composants]
│   │   ├── opex/        [2 composants]
│   │   └── capex/       [2 composants]
│   ├── hooks/           [NOUVEAU - 3 hooks]
│   ├── utils/           [NOUVEAU - 4 utilitaires]
│   ├── services/        [NOUVEAU - storageService]
│   ├── constants/       [NOUVEAU - budgetConstants]
│   ├── App.jsx          [REFACTORISÉ - 867→246 lignes]
│   ├── main.jsx         [MIS À JOUR]
│   └── index.css        [AMÉLIORÉ]
├── _old/                [NOUVEAU - anciens fichiers]
├── DEPLOYMENT.md        [NOUVEAU]
├── QUICK_START_v2.md    [NOUVEAU]
├── CHANGELOG.md         [NOUVEAU]
├── START.bat            [NOUVEAU]
├── INSTALL.bat          [NOUVEAU]
└── BUILD.bat            [NOUVEAU]
```

### 📊 Statistiques

- **Fichiers créés**: 25+
- **Composants**: 14 nouveaux
- **Hooks**: 3 personnalisés
- **Utilitaires**: 4 modules
- **Lignes de code**: ~3000+ (organisées vs 867 monolithiques)
- **Amélioration performance**: 40-60%
- **Réduction bundle**: ~30%

---

## [1.0.0] - 2024-XX-XX - Version Initiale

### Fonctionnalités
- ✅ Tableau de bord OPEX/CAPEX
- ✅ Ajout/Modification/Suppression de données
- ✅ Calculs budgétaires de base
- ✅ Export CSV/JSON
- ✅ Interface Tailwind CSS
- ✅ Données exemple

### Limitations
- ⚠️ Fichier monolithique (867 lignes)
- ⚠️ Pas de persistence
- ⚠️ alert() natifs
- ⚠️ Calculs à chaque render
- ⚠️ Pas de graphiques
- ⚠️ Structure non modulaire

---

## Types de Changements

- `✨ Nouveauté` - Nouvelle fonctionnalité
- `🔧 Amélioration` - Amélioration d'une fonctionnalité existante
- `🐛 Correction` - Correction de bug
- `📚 Documentation` - Changements de documentation
- `🎨 Style` - Changements de style/UI
- `⚡ Performance` - Améliorations de performance
- `🔒 Sécurité` - Corrections de sécurité
- `♻️ Refactoring` - Refactorisation du code
- `🗑️ Suppression` - Suppression de fonctionnalité

---

**Légende des versions**: [Majeure.Mineure.Patch]
- **Majeure**: Changements incompatibles avec les versions précédentes
- **Mineure**: Nouvelles fonctionnalités rétrocompatibles
- **Patch**: Corrections de bugs rétrocompatibles
