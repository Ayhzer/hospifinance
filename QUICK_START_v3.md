# 🚀 Guide de Démarrage Rapide - Hospifinance v3.1

## Installation Express (5 minutes)

### Option 1: Avec les scripts fournis (Windows) ⭐ Recommandé

1. **Double-cliquez sur `INSTALL.bat`**
   - Installe automatiquement toutes les dépendances
   - Vérifie que Node.js est installé

2. **Double-cliquez sur `START.bat`**
   - Lance l'application en mode développement
   - Ouvre automatiquement http://localhost:5173

### Option 2: Ligne de commande

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer l'application
npm run dev
```

## ✅ Vérification de l'Installation

Une fois lancé, vous devriez voir:

```
  VITE v5.0.8  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Ouvrez http://localhost:5173 dans votre navigateur.

---

## 🔐 Première Connexion (NOUVEAU v3.0)

L'application nécessite maintenant une authentification.

### Identifiants par Défaut

```
Username: admin
Password: admin
```

**⚠️ IMPORTANT**: Changez immédiatement le mot de passe en production !

### Écran de Connexion

1. Saisir `admin` comme nom d'utilisateur
2. Saisir `admin` comme mot de passe
3. Cliquer sur **Se connecter**
4. Vous êtes redirigé vers le dashboard

---

## 🎯 Premiers Pas

### 1. Vue d'ensemble (Dashboard)

Onglet par défaut au démarrage:
- **Cartes OPEX/CAPEX** - Résumé budgétaire
- **Budget consolidé** - Total DSI
- **Graphiques interactifs** - Visualisation des données

### 2. Changer le Mot de Passe Admin (Recommandé)

1. Appuyer sur **Ctrl+Shift+P** (ou triple-cliquer sur le titre)
2. Aller dans l'onglet **Utilisateurs**
3. Trouver l'utilisateur `admin`
4. Cliquer sur 🔑 **Changer le mot de passe**
5. Saisir un nouveau mot de passe sécurisé
6. Confirmer

### 3. Créer des Comptes Utilisateurs

**Rôles disponibles**:
- **superadmin** - Accès total (réservé au compte admin)
- **admin** - Gestion utilisateurs + budgets
- **user** - Consultation uniquement

**Créer un utilisateur**:
1. Paramètres (Ctrl+Shift+P) → Onglet **Utilisateurs**
2. Cliquer sur **Ajouter un utilisateur**
3. Remplir:
   - Nom d'utilisateur: ex. `jean.dupont`
   - Mot de passe: ex. `MotDePasse2026!`
   - Rôle: Choisir `user`, `admin` ou `superadmin`
4. Cliquer sur **Créer**

---

## 💰 Gestion des Budgets

### Ajouter un Fournisseur OPEX

1. Cliquer sur l'onglet **OPEX**
2. Cliquer sur **Nouveau fournisseur**
3. Remplir le formulaire:
   - **Fournisseur**: ex. "Cisco Systems"
   - **Catégorie**: ex. "Réseau"
   - **Budget annuel**: ex. 250000
   - **Notes**: Informations complémentaires (optionnel)
4. Cliquer sur **Enregistrer**

**Résultat**: Le fournisseur apparaît dans la table avec budget disponible = budget total.

### Ajouter un Projet CAPEX

1. Cliquer sur l'onglet **CAPEX**
2. Cliquer sur **Nouveau projet**
3. Remplir le formulaire:
   - **Nom du projet**: ex. "Migration Cloud"
   - **Budget total**: ex. 1000000
   - **Statut**: ex. "En cours"
   - **Date début**: ex. 2026-01-01
   - **Date fin**: ex. 2026-12-31
   - **Notes**: Détails du projet (optionnel)
4. Cliquer sur **Enregistrer**

---

## 📦 Gestion des Commandes (NOUVEAU v3.0)

### Créer une Commande OPEX

**Scénario**: Commander des licences logicielles

1. Onglet **Commandes OPEX**
2. Cliquer sur **Nouvelle commande**
3. Remplir le formulaire:
   - **Fournisseur**: Sélectionner "Cisco Systems"
   - **Description**: "Licences Cisco DNA Center (20 licences)"
   - **Montant**: 50000
   - **Statut**: "En attente" (pour commencer)
   - **Date Commande**: (laisser vide pour l'instant)
   - **Référence**: (vide)
   - **Notes**: "Renouvellement annuel"
4. Cliquer sur **Enregistrer**

**Impact**: Aucun pour l'instant (statut "En attente" ne compte pas dans le budget).

### Mettre à Jour le Statut de la Commande

**Quand le BC est émis**:

1. Cliquer sur ✏️ **Éditer** sur la commande
2. Modifier:
   - **Statut**: "Commandée"
   - **Date Commande**: 2026-02-09
   - **Référence**: BC-2026-042
3. Cliquer sur **Enregistrer**

**Impact**: 50 000 € comptabilisés en **Engagement** pour Cisco Systems.
Le budget disponible diminue de 50 000 €.

### Cycle Complet d'une Commande

```
En attente (aucun impact)
    ↓ [BC émis]
Commandée (engagement: 50 000 €)
    ↓ [Réception matériel]
Livrée (engagement: 50 000 €)
    ↓ [Facture reçue]
Facturée (dépense: 50 000 €, engagement: 0 €)
    ↓ [Paiement effectué]
Payée (dépense: 50 000 €)
```

**À chaque changement de statut**, le budget est automatiquement recalculé.

---

## ⚙️ Personnalisation de l'Application (NOUVEAU v3.0)

### Accès aux Paramètres

**3 méthodes**:
1. Clavier: **Ctrl+Shift+P**
2. Souris: **Triple-cliquer** sur le titre de l'application
3. (Future: Bouton paramètres dans l'UI)

### Onglet Apparence

**Personnaliser l'interface**:
- **Nom de l'application**: Changer "Tableau de Bord Financier DSI" en votre nom
- **Couleurs du thème**: Modifier les 6 couleurs (Primary, Success, Warning, Danger, Info, Accent)
- **Aperçu en temps réel**: Les changements s'appliquent immédiatement

**Exemple**:
- Nom: "Finance DSI - Hôpital Saint-Jean"
- Primary: #0066cc (bleu foncé)
- Success: #00cc00 (vert vif)

### Onglet Colonnes

**Masquer/Afficher des colonnes**:
- **OPEX**: 8 colonnes (Fournisseur, Catégorie, Budget, Dépense, etc.)
- **CAPEX**: 9 colonnes (Projet, Budget, Statut, Dates, etc.)

Décocher les colonnes que vous souhaitez masquer dans les tableaux.

### Onglet Règles

**Seuils d'alerte budgétaire**:
- **Seuil d'avertissement**: 75% par défaut (barre jaune)
- **Seuil critique**: 90% par défaut (barre rouge)

Ajuster selon vos besoins (valeurs entre 0 et 100%).

### Onglet Utilisateurs (Admin uniquement)

**Gérer les comptes**:
- Voir la liste des utilisateurs avec leurs rôles
- Créer de nouveaux comptes
- Désactiver/Réactiver des comptes
- Supprimer des comptes (sauf superadmin)
- Changer les mots de passe

### Onglet Logs (Admin uniquement)

**Journal d'audit**:
- Voir les 200 derniers événements
- Types: Connexions, déconnexions, modifications comptes
- Filtrer visuellement par utilisateur/type
- Purger tous les logs (action irréversible)

---

## 📊 Export des Données

### Export CSV (Excel)

**Pour OPEX**:
1. Onglet OPEX → Cliquer sur **CSV**
2. Fichier téléchargé: `opex_2026-02-09.csv`
3. Ouvrir avec Excel/LibreOffice

**Pour CAPEX**:
1. Onglet CAPEX → Cliquer sur **CSV**
2. Fichier téléchargé: `capex_2026-02-09.csv`

**Contenu**:
- Toutes les colonnes visibles dans la table
- Format compatible Excel (encodage UTF-8 avec BOM)
- Dates formatées au format français

### Export JSON (Programmation)

**Même principe mais format JSON**:
- Fichier: `opex_2026-02-09.json` ou `capex_2026-02-09.json`
- Format: JSON indenté (lisible)
- Usage: Import dans d'autres applications, scripts Python, etc.

---

## 💾 Persistence des Données

### Stockage Automatique

**Toutes les données sont sauvegardées automatiquement** dans le LocalStorage du navigateur:
- Fournisseurs OPEX
- Projets CAPEX
- Commandes OPEX/CAPEX
- Utilisateurs et sessions
- Paramètres de l'application
- Journal d'audit

### Important

**Les données restent sur votre machine locale**.

Pour un usage:
- **Multi-utilisateurs** → Backend requis (roadmap v4.0)
- **Multi-appareils** → Synchronisation cloud requise (roadmap v4.0)

### Backup Manuel

**Recommandé régulièrement**:
1. Exporter OPEX en JSON
2. Exporter CAPEX en JSON
3. Sauvegarder les fichiers JSON sur un disque/cloud

En cas de problème, réimporter les données (fonctionnalité v4.0).

---

## 🛠️ Commandes Disponibles

```bash
# Développement
npm run dev          # Lance le serveur de dev (HMR activé)

# Production
npm run build        # Crée un build optimisé dans dist/
npm run preview      # Prévisualise le build de production

# Déploiement
npm run deploy       # Déploie sur GitHub Pages (après build)

# Qualité
npm run lint         # Vérifie le code avec ESLint
```

---

## 📊 Fonctionnalités à Tester

### Authentification
- [ ] Connexion avec admin/admin
- [ ] Changer le mot de passe admin
- [ ] Créer un utilisateur "user"
- [ ] Se déconnecter et reconnecter avec le nouvel utilisateur
- [ ] Vérifier les restrictions (user ne peut pas éditer)

### Budgets OPEX/CAPEX
- [ ] Ajout d'un fournisseur OPEX
- [ ] Modification d'un fournisseur
- [ ] Suppression d'un fournisseur (avec confirmation)
- [ ] Ajout d'un projet CAPEX avec dates
- [ ] Vérifier les calculs automatiques

### Commandes
- [ ] Créer une commande en statut "En attente"
- [ ] Passer en "Commandée" et vérifier l'engagement
- [ ] Passer en "Facturée" et vérifier le passage engagement→dépense
- [ ] Annuler une commande et vérifier le retour au disponible
- [ ] Supprimer une commande

### Paramètres
- [ ] Ctrl+Shift+P pour ouvrir les paramètres
- [ ] Changer le nom de l'application
- [ ] Modifier les couleurs du thème
- [ ] Masquer des colonnes OPEX/CAPEX
- [ ] Ajuster les seuils d'alerte (75%/90%)
- [ ] Consulter les logs d'audit

### Exports
- [ ] Export CSV OPEX (ouvrir dans Excel)
- [ ] Export JSON CAPEX
- [ ] Vérifier le formatage des dates et montants

### Persistence
- [ ] Rafraîchir la page (F5)
- [ ] Vérifier que les données sont toujours là
- [ ] Se déconnecter et reconnecter
- [ ] Vérifier que la session est restaurée

---

## 🎨 Nouveautés v3.0/3.1

### v3.1 (Février 2026)
- 📊 **Pilotage budgétaire renforcé** - Synthèse OPEX/CAPEX améliorée
- 🔐 **Authentification renforcée** - Sécurité et UX login améliorées
- 📚 **Documentation complète** - Guides détaillés (AUTHENTICATION.md, ORDERS.md)

### v3.0 (Février 2026)
- 🔐 **Authentification** - Gestion multi-utilisateurs avec 3 rôles
- 📦 **Système de commandes** - Suivi cycle complet (6 statuts)
- ⚙️ **Paramétrage avancé** - Personnalisation (apparence, colonnes, règles)
- 📜 **Journal d'audit** - Traçabilité complète des actions
- 🎹 **Raccourcis clavier** - Ctrl+Shift+P pour paramètres

### v2.0 (2025)
- ⚡ **Performance** - 40-60% plus rapide (hooks mémorisés)
- 🏗️ **Architecture modulaire** - 36 fichiers vs monolithe
- 📊 **Graphiques interactifs** - Recharts (barres, camemberts)
- 💾 **Persistence automatique** - LocalStorage intégré

---

## 🐛 Dépannage Express

### Problème: Impossible de se connecter

**Solution**:
1. Vérifier que vous utilisez `admin` / `admin` (sensible à la casse)
2. Ouvrir la console navigateur (F12) pour voir les erreurs
3. Vider le cache et LocalStorage:
   - F12 → Application → Local Storage → Supprimer tout
   - Rafraîchir la page

### Problème: Port 5173 déjà utilisé

Le serveur utilisera automatiquement le port suivant (5174, 5175, etc.).

### Problème: npm install échoue

```bash
# Nettoyer le cache npm
npm cache clean --force

# Réessayer
npm install
```

### Problème: Les données ne persistent pas

1. Vérifier que les cookies/LocalStorage ne sont pas bloqués
2. Ouvrir F12 → Application → Local Storage
3. Vérifier les clés `hospifinance_*`

### Problème: Les calculs sont incorrects

1. Vérifier les montants saisis (pas de lettres)
2. Rafraîchir la page (recalcul automatique)
3. Vérifier les statuts des commandes (impact différent selon statut)

### Problème: Paramètres ne s'ouvrent pas

1. Vérifier que vous êtes connecté
2. Essayer Ctrl+Shift+P plutôt que triple-clic
3. Vérifier la console pour erreurs JavaScript

---

## 📖 Documentation Complète

### Guides Principaux

- [README.md](README.md) - Vue d'ensemble du projet
- [STRUCTURE.txt](STRUCTURE.txt) - Architecture détaillée des fichiers
- [CHANGELOG.md](CHANGELOG.md) - Historique des versions

### Guides Fonctionnels (Nouveaux v3.0)

- [AUTHENTICATION.md](AUTHENTICATION.md) - Système d'authentification complet
- [ORDERS.md](ORDERS.md) - Gestion des commandes et impact budgétaire
- [DEPLOYMENT.md](DEPLOYMENT.md) - Déploiement en ligne
- [GITHUB_PAGES_DEPLOY.md](GITHUB_PAGES_DEPLOY.md) - Déploiement GitHub Pages

### Guides Techniques

- [OPTIMISATION_COMPLETE.md](OPTIMISATION_COMPLETE.md) - Détails optimisations v2.0
- [MOBILE_RESPONSIVE.md](MOBILE_RESPONSIVE.md) - Responsive design

---

## 🎓 Ressources d'Apprentissage

### React Hooks Utilisés

- `useState` - Gestion d'état local
- `useEffect` - Effets de bord (chargement/sauvegarde)
- `useCallback` - Mémorisation de fonctions
- `useMemo` - Mémorisation de calculs coûteux
- `useContext` - Partage d'état global (Auth, Settings)

### Technologies à Explorer

- **Vite** - https://vitejs.dev - Build tool ultra-rapide
- **React** - https://react.dev - Framework UI
- **Tailwind CSS** - https://tailwindcss.com - Framework CSS utilitaire
- **Recharts** - https://recharts.org - Graphiques React
- **Web Crypto API** - Hashage SHA-256 natif navigateur

---

## ✨ Prochaines Étapes

### À Court Terme

1. **Personnaliser les données** - Remplacer les exemples par vos données réelles
2. **Créer des comptes utilisateurs** - Un compte par personne
3. **Tester toutes les fonctionnalités** - Suivre la checklist ci-dessus
4. **Configurer les paramètres** - Apparence, colonnes, seuils
5. **Faire des backups réguliers** - Exporter CSV/JSON

### À Moyen Terme

1. **Saisir toutes les commandes** - OPEX et CAPEX
2. **Suivre le cycle de vie** - Mettre à jour les statuts régulièrement
3. **Analyser les graphiques** - Identifier les tendances budgétaires
4. **Former les utilisateurs** - Guide d'utilisation interne
5. **Déployer en ligne** - Suivre DEPLOYMENT.md ou GITHUB_PAGES_DEPLOY.md

### À Long Terme (Roadmap v4.0)

1. **Migration vers backend** - Node.js + PostgreSQL
2. **JWT Authentication** - Sécurité renforcée
3. **Multi-tenancy** - Plusieurs établissements
4. **Import de données** - CSV/Excel
5. **Rapports automatiques** - PDF mensuels

---

## 🆘 Besoin d'Aide?

### Documentation

Consultez les fichiers .md de documentation (13 fichiers disponibles).

### Support Technique

- Vérifier les issues GitHub du projet
- Consulter le CHANGELOG.md pour les changements récents
- Lire AUTHENTICATION.md pour problèmes de connexion
- Lire ORDERS.md pour problèmes de commandes

### Communauté

- Contacter l'équipe de développement
- Proposer des améliorations via GitHub Issues
- Contribuer au projet (voir CONTRIBUTING.md si disponible)

---

## 🚀 Résumé - Prise en Main 5 Minutes

```bash
# 1. Installer
npm install

# 2. Lancer
npm run dev

# 3. Se connecter
Username: admin
Password: admin

# 4. Tester
- Ajouter un fournisseur OPEX
- Créer une commande liée
- Changer le statut de la commande
- Observer l'impact budgétaire

# 5. Personnaliser
Ctrl+Shift+P → Modifier apparence/colonnes/règles
```

---

**Bon développement!** 🚀

*Version 3.1 - Solution Professionnelle Complète | Février 2026*

**Authentification • Commandes • Paramétrage • Audit**
