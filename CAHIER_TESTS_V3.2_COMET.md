# Cahier de Tests Fonctionnels — HospiFinance v3.2
**Application :** Tableau de Bord Financier DSI
**URL locale :** http://localhost:5173
**Version :** 3.2.0 (2026-02-21)
**Testeur :** Comet
**Date prévue :** _____________

---

## 📋 Objectifs de la Campagne de Tests

Cette campagne couvre les **nouvelles fonctionnalités v3.2** :
- ✅ Référentiels paramétrables (Fournisseurs, Catégories OPEX, Enveloppes CAPEX)
- ✅ Import CSV → Ajout automatique aux référentiels
- ✅ Réorganisation des onglets par drag-and-drop
- ✅ Gestion des rôles utilisateurs (superadmin)
- ✅ Réinitialisation des mots de passe (superadmin)
- ✅ Filtres de colonnes (correction bug focus)
- ✅ Redimensionnement colonnes (correction bug sélection texte)
- ✅ Dashboard Builder (widgets personnalisés)
- ✅ GitHub Storage Service

**Total attendu :** 73 tests (modules 1-13)

---

## Légende

| Symbole | Signification |
|---------|---------------|
| ✅ | PASS — Comportement conforme |
| ❌ | FAIL — Comportement incorrect |
| ⚠️ | PARTIEL — Fonctionne partiellement |
| 🔄 | À RETESTER — Correction nécessaire |
| ⏭️ | SKIP — Test non applicable |

---

## PRÉREQUIS AVANT TESTS

### Étape 1 : Démarrage de l'Application
```bash
cd h:\DEV\hospifinance
npm run dev
```

### Étape 2 : Réinitialisation Complète (IMPORTANT)
1. Ouvrir http://localhost:5173 dans Chrome/Edge
2. Ouvrir la console (F12 → Console)
3. Exécuter :
```javascript
localStorage.clear()
location.reload()
```

### Étape 3 : Connexion Superadmin
- Utilisateur : `admin`
- Mot de passe : `Admin2024!`

---

## MODULE 1 — RÉFÉRENTIELS PARAMÉTRABLES (NOUVEAU v3.2)

### TEST 1.1 — Accès au panneau "Listes de choix"
**Précondition :** Connecté en tant que `admin`
**Actions :**
1. Ouvrir les Paramètres (`Ctrl+Shift+P`)
2. Cliquer sur l'onglet "Listes de choix"

**Résultat attendu :**
- 3 sections visibles : "Fournisseurs OPEX", "Catégories OPEX", "Enveloppes CAPEX"
- Chaque section affiche les valeurs par défaut

**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL  [ ] ⚠️ PARTIEL

---

### TEST 1.2 — Ajouter un nouveau fournisseur OPEX au référentiel
**Actions :**
1. Dans "Fournisseurs OPEX", cliquer sur "Ajouter"
2. Saisir `Cisco Systems`
3. Valider (icône ✓ ou Entrée)

**Résultat attendu :**
- "Cisco Systems" apparaît dans la liste des fournisseurs
- Message de confirmation affiché
- Fermer et rouvrir les paramètres → "Cisco Systems" toujours présent

**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

### TEST 1.3 — Renommer un fournisseur OPEX (propagation)
**Actions :**
1. Aller sur l'onglet OPEX
2. Ajouter un fournisseur test :
   - Fournisseur : `Cisco Systems` (celui créé au test 1.2)
   - Catégorie : `Logiciels`
   - Budget : `100000`
3. Retourner dans Paramètres → Listes de choix
4. Cliquer sur ✏️ à côté de "Cisco Systems"
5. Renommer en `Cisco Networks`
6. Valider
7. Retourner sur l'onglet OPEX

**Résultat attendu :**
- Le fournisseur de la ligne créée s'affiche maintenant "Cisco Networks"
- Le renommage a propagé sur toutes les lignes existantes

**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

### TEST 1.4 — Tentative d'ajout de doublon dans le référentiel
**Actions :**
1. Paramètres → Listes de choix → Fournisseurs OPEX
2. Cliquer sur "Ajouter"
3. Saisir `Oracle Health` (déjà existant)
4. Valider

**Résultat attendu :**
- Message d'erreur "Ce fournisseur existe déjà"
- La valeur n'est pas ajoutée en double

**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

### TEST 1.5 — Supprimer un fournisseur du référentiel (avec données liées)
**Actions :**
1. Paramètres → Listes de choix
2. Supprimer "Cisco Networks" (créé au test 1.2)
3. Confirmer la suppression
4. Aller sur l'onglet OPEX

**Résultat attendu :**
- Le fournisseur "Cisco Networks" a disparu du référentiel
- **CRITIQUE** : La ligne OPEX créée au test 1.3 avec "Cisco Networks" :
  - Soit affiche encore "Cisco Networks" (valeur orpheline)
  - Soit est supprimée automatiquement
  - Soit affiche une erreur
- **Documenter le comportement observé**

**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL  [ ] ⚠️ PARTIEL
**Comportement observé :** _______________

---

### TEST 1.6 — Ajouter une catégorie OPEX personnalisée
**Actions :**
1. Paramètres → Listes de choix → Catégories OPEX
2. Ajouter `Cloud Computing`
3. Aller sur OPEX → Ajouter un fournisseur
4. Observer le menu déroulant "Catégorie"

**Résultat attendu :**
- "Cloud Computing" apparaît dans les options du select
- Possible de créer un fournisseur avec cette catégorie

**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

### TEST 1.7 — Ajouter une enveloppe CAPEX personnalisée
**Actions :**
1. Paramètres → Listes de choix → Enveloppes CAPEX
2. Ajouter `Intelligence Artificielle`
3. Aller sur CAPEX → Ajouter un projet
4. Observer le menu déroulant "Enveloppe"

**Résultat attendu :**
- "Intelligence Artificielle" apparaît dans les options
- Création d'un projet avec cette enveloppe fonctionne

**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

### TEST 1.8 — Persistance des référentiels après rechargement
**Actions :**
1. Vérifier que les référentiels contiennent les ajouts des tests précédents
2. Recharger la page (F5)
3. Rouvrir Paramètres → Listes de choix

**Résultat attendu :**
- Toutes les valeurs ajoutées (catégories, enveloppes) sont toujours présentes
- Pas de perte de données

**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

## MODULE 2 — IMPORT CSV & RÉFÉRENTIELS (NOUVEAU v3.2)

### TEST 2.1 — Import CSV OPEX avec nouveau fournisseur
**Actions :**
1. Créer un fichier `import_test_opex.csv` :
```csv
Fournisseur,Catégorie,Budget Annuel,Dépense Actuelle,Engagement,Notes
AWS,Cloud Computing,250000,80000,50000,Infrastructure cloud
```
2. Aller sur OPEX → Importer CSV
3. Sélectionner le fichier
4. Ouvrir Paramètres → Listes de choix → Fournisseurs OPEX

**Résultat attendu :**
- Ligne AWS ajoutée dans le tableau OPEX
- **"AWS" automatiquement ajouté au référentiel Fournisseurs**
- **"Cloud Computing" automatiquement ajouté au référentiel Catégories** (si pas déjà présent)

**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

### TEST 2.2 — Import CSV CAPEX avec nouvelle enveloppe
**Actions :**
1. Créer un fichier `import_test_capex.csv` :
```csv
Enveloppe,Projet,Budget,Dépensé,Engagement,Date Début,Date Fin,Statut,Notes
Intelligence Artificielle,Chatbot RH,150000,30000,20000,2024-01-01,2024-12-31,En cours,POC IA
```
2. Aller sur CAPEX → Importer CSV
3. Sélectionner le fichier
4. Ouvrir Paramètres → Listes de choix → Enveloppes CAPEX

**Résultat attendu :**
- Projet "Chatbot RH" ajouté dans le tableau CAPEX
- **"Intelligence Artificielle" automatiquement ajouté au référentiel Enveloppes** (si pas déjà présent du test 1.7)

**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

### TEST 2.3 — Import CSV avec fournisseurs/catégories existants (déduplication)
**Actions :**
1. Créer un fichier `import_dedupe.csv` :
```csv
Fournisseur,Catégorie,Budget Annuel,Dépense Actuelle,Engagement,Notes
Oracle Health,Logiciels,500000,200000,100000,Doublon test
Microsoft,Maintenance,400000,150000,50000,Doublon test 2
```
2. Importer ce fichier (OPEX)
3. Ouvrir Paramètres → Listes de choix → Fournisseurs OPEX

**Résultat attendu :**
- Les 2 lignes sont importées dans OPEX
- **Aucun doublon créé dans le référentiel** (Oracle Health et Microsoft existent déjà)
- Le nombre de fournisseurs dans le référentiel n'a pas augmenté

**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

## MODULE 3 — DRAG-AND-DROP ONGLETS (NOUVEAU v3.2)

### TEST 3.1 — Réorganiser les onglets fixes
**Actions :**
1. Noter l'ordre actuel des onglets (ex: Vue d'ensemble, OPEX, CAPEX, Commandes OPEX, Commandes CAPEX)
2. Cliquer et maintenir sur l'onglet "CAPEX"
3. Glisser-déposer à la première position (avant "Vue d'ensemble")

**Résultat attendu :**
- L'onglet "CAPEX" se déplace à la première position
- L'ordre est : CAPEX, Vue d'ensemble, OPEX, Commandes OPEX, Commandes CAPEX
- Indicateur visuel pendant le drag (curseur, ligne de drop)

**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL  [ ] ⚠️ PARTIEL

---

### TEST 3.2 — Persistance de l'ordre des onglets
**Actions :**
1. Vérifier que l'ordre modifié au test 3.1 est appliqué
2. Recharger la page (F5)

**Résultat attendu :**
- L'ordre personnalisé est conservé après rechargement
- L'onglet "CAPEX" reste en première position

**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

### TEST 3.3 — Réinitialiser l'ordre par défaut
**Actions :**
1. Exécuter dans la console :
```javascript
localStorage.removeItem('hospifinance_tab_order')
location.reload()
```

**Résultat attendu :**
- L'ordre revient à : Vue d'ensemble, OPEX, CAPEX, Commandes OPEX, Commandes CAPEX

**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

### TEST 3.4 — Drag-and-drop avec dashboards personnalisés (si disponibles)
**Précondition :** Avoir créé au moins 1 dashboard personnalisé (voir MODULE 12)
**Actions :**
1. Créer un dashboard custom "Test Dashboard"
2. Glisser-déposer ce dashboard entre deux onglets fixes (ex: entre OPEX et CAPEX)

**Résultat attendu :**
- Le dashboard personnalisé se déplace à la position souhaitée
- L'ordre est conservé après rechargement

**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL  [ ] ⏭️ SKIP (pas de dashboard custom créé)

---

## MODULE 4 — GESTION DES RÔLES UTILISATEURS (NOUVEAU v3.2)

### TEST 4.1 — Changer le rôle d'un utilisateur (superadmin → admin)
**Précondition :** Connecté en tant que `admin` (superadmin)
**Actions :**
1. Paramètres → Utilisateurs
2. Cliquer sur le bouton "Rôle" pour l'utilisateur `user`
3. Observer le rôle actuel (devrait être "Utilisateur")
4. Changer le rôle en "Administrateur"
5. Se déconnecter
6. Se connecter avec `user` / `User2024!`
7. Essayer d'accéder aux Paramètres

**Résultat attendu :**
- Le rôle de `user` est passé à "admin"
- L'utilisateur `user` peut maintenant accéder aux Paramètres
- Les boutons Supprimer/Export sont visibles sur OPEX/CAPEX

**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

> **Nettoyage :** Reconnecter `admin` et remettre `user` au rôle "Utilisateur"

---

### TEST 4.2 — Changer le rôle d'un admin en superadmin
**Actions :**
1. Connecté en tant que `admin` (superadmin)
2. Créer un nouvel utilisateur :
   - Nom : `admin2`
   - Mot de passe : `Admin2024!`
   - Rôle : `Administrateur`
3. Changer le rôle de `admin2` en "Superadmin"
4. Se déconnecter et se connecter avec `admin2` / `Admin2024!`
5. Paramètres → Utilisateurs → Essayer de changer le rôle de `admin`

**Résultat attendu :**
- `admin2` a maintenant les droits superadmin
- `admin2` peut changer le rôle d'autres utilisateurs (y compris `admin`)

**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

> **Nettoyage :** Reconnecter `admin`, supprimer `admin2`

---

### TEST 4.3 — Utilisateur "user" ne peut pas changer de rôle
**Actions :**
1. Se connecter avec `user` / `User2024!`
2. Tenter d'accéder aux Paramètres

**Résultat attendu :**
- Pas d'accès aux Paramètres (bouton absent ou inactif)
- Impossible de changer son propre rôle

**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

## MODULE 5 — RÉINITIALISATION MOTS DE PASSE (NOUVEAU v3.2)

### TEST 5.1 — Superadmin réinitialise le mot de passe d'un utilisateur
**Précondition :** Connecté en tant que `admin` (superadmin)
**Actions :**
1. Paramètres → Utilisateurs
2. Cliquer sur "Réinitialiser MDP" pour l'utilisateur `user`
3. Saisir un nouveau mot de passe : `NewPassword2024!`
4. Confirmer
5. Se déconnecter
6. Se connecter avec `user` / `NewPassword2024!`

**Résultat attendu :**
- Connexion réussie avec le nouveau mot de passe
- L'ancien mot de passe `User2024!` ne fonctionne plus

**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

> **Nettoyage :** Remettre le mot de passe `user` à `User2024!`

---

### TEST 5.2 — Admin simple ne peut pas réinitialiser les mots de passe
**Actions :**
1. Créer un utilisateur avec rôle "Administrateur" (pas superadmin) :
   - Nom : `admin_simple`
   - Mot de passe : `Admin2024!`
   - Rôle : `Administrateur`
2. Se déconnecter et se connecter avec `admin_simple`
3. Paramètres → Utilisateurs
4. Observer la présence/absence du bouton "Réinitialiser MDP"

**Résultat attendu :**
- Le bouton "Réinitialiser MDP" **n'est pas visible** pour un admin simple
- Seul le superadmin peut réinitialiser les mots de passe

**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL  [ ] ⚠️ PARTIEL (bouton visible mais inactif)

> **Nettoyage :** Supprimer `admin_simple`

---

### TEST 5.3 — Réinitialiser son propre mot de passe (superadmin)
**Actions :**
1. Connecté en tant que `admin` (superadmin)
2. Paramètres → Utilisateurs
3. Cliquer sur "Changer mot de passe" pour son propre compte
4. Saisir :
   - Ancien mot de passe : `Admin2024!`
   - Nouveau : `Admin2025!`
5. Se déconnecter
6. Se reconnecter avec `admin` / `Admin2025!`

**Résultat attendu :**
- Connexion réussie avec le nouveau mot de passe

**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

> **Nettoyage :** Remettre le mot de passe à `Admin2024!`

---

## MODULE 6 — FILTRES DE COLONNES (CORRECTION BUG v3.2)

### TEST 6.1 — Filtrer sans perte de focus
**Actions :**
1. Aller sur l'onglet OPEX
2. Cliquer dans le champ de filtre sous l'en-tête "Fournisseur"
3. Commencer à taper lentement : `O` puis `r` puis `a` puis `c` puis `l` puis `e`
4. Observer le comportement du curseur à chaque lettre

**Résultat attendu :**
- Le curseur reste dans le champ de filtre pendant toute la saisie
- **PAS de perte de focus** entre les lettres
- Le tableau filtre progressivement pour n'afficher que "Oracle Health"

**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL (perte de focus)

---

### TEST 6.2 — Filtres multiples simultanés
**Actions :**
1. Filtrer "Fournisseur" : `Microsoft`
2. Filtrer "Catégorie" : `Logiciels`

**Résultat attendu :**
- Seule la ligne "Microsoft" avec catégorie "Logiciels" s'affiche
- Pas de perte de focus lors du passage d'un filtre à l'autre

**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

### TEST 6.3 — Effacer un filtre
**Actions :**
1. Vider le champ de filtre "Fournisseur"
2. Observer le tableau

**Résultat attendu :**
- Toutes les lignes réapparaissent (filtré uniquement par "Logiciels")

**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

## MODULE 7 — REDIMENSIONNEMENT COLONNES (CORRECTION BUG v3.2)

### TEST 7.1 — Redimensionner une colonne sans perdre la sélection de texte
**Actions :**
1. Aller sur OPEX
2. Sélectionner du texte dans une cellule (ex: "Oracle Health")
3. **Sans relâcher la sélection**, déplacer la souris vers le bord droit de la colonne "Fournisseur"
4. Cliquer et glisser pour redimensionner la colonne
5. Relâcher la souris **à l'extérieur de la fenêtre du navigateur** (simuler un mouvement rapide)

**Résultat attendu :**
- La sélection de texte "Oracle Health" **ne disparaît pas** pendant/après le redimensionnement
- Le redimensionnement fonctionne correctement même si la souris sort de la fenêtre

**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL (sélection perdue)

---

### TEST 7.2 — Redimensionner plusieurs colonnes successivement
**Actions :**
1. Redimensionner la colonne "Fournisseur" à 200px
2. Redimensionner la colonne "Budget Annuel" à 150px
3. Recharger la page

**Résultat attendu :**
- Les largeurs personnalisées sont conservées après rechargement

**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

## MODULE 8 — RENOMMAGE ONGLETS

### TEST 8.1 — Renommer un onglet fixe
**Actions :**
1. Cliquer sur l'icône ✏️ à côté de "OPEX"
2. Saisir `Dépenses Courantes`
3. Valider (Entrée)
4. Recharger la page

**Résultat attendu :**
- L'onglet s'affiche "Dépenses Courantes"
- Persisté après rechargement

**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

> **Nettoyage :** Remettre le nom "OPEX"

---

## MODULE 9 — OPEX (TESTS DE RÉGRESSION)

### TEST 9.1 — Ajouter un fournisseur avec nouvelle catégorie personnalisée
**Actions :**
1. Ajouter un fournisseur :
   - Fournisseur : `Google Workspace`
   - Catégorie : `Cloud Computing` (créée au test 1.6)
   - Budget : `80000`
   - Dépense : `20000`
   - Engagement : `10000`

**Résultat attendu :**
- Ligne ajoutée avec catégorie "Cloud Computing"
- Disponible = 50 000 €
- Utilisation = 37.5%

**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

### TEST 9.2 — Dépassement de budget (disponible négatif)
**Actions :**
1. Modifier "Google Workspace"
2. Mettre dépense = `70000` et engagement = `15000` (total = 85k > 80k)
3. Observer la colonne "Disponible"

**Résultat attendu :**
- Disponible affiché en **rouge** : `-5 000 €`

**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

### TEST 9.3 — Export CSV OPEX
**Actions :**
1. Cliquer sur "CSV" dans la barre OPEX
2. Ouvrir le fichier téléchargé

**Résultat attendu :**
- Fichier `.csv` contient toutes les lignes OPEX
- Colonnes correctement séparées par des virgules
- Pas d'erreur d'encodage (accents)

**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

## MODULE 10 — CAPEX (TESTS DE RÉGRESSION)

### TEST 10.1 — Ajouter un projet avec enveloppe personnalisée
**Actions :**
1. Ajouter un projet :
   - Enveloppe : `Intelligence Artificielle` (créée au test 1.7)
   - Projet : `OCR Documentaire`
   - Budget : `200000`
   - Dépensé : `50000`
   - Engagement : `30000`
   - Date début : `2024-03-01`
   - Date fin : `2024-12-31`
   - Statut : `En cours`

**Résultat attendu :**
- Projet ajouté dans le tableau
- Apparaît dans le résumé par enveloppe "Intelligence Artificielle"

**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

### TEST 10.2 — Résumé par enveloppe avec nouvelle enveloppe
**Actions :**
1. Cliquer sur l'enveloppe "Intelligence Artificielle" dans le résumé

**Résultat attendu :**
- Section dépliée avec le projet "OCR Documentaire" + "Chatbot RH" (si importé au test 2.2)
- Totaux Budget/Dépensé/Engagement/Disponible corrects

**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

## MODULE 11 — COMMANDES (TESTS DE RÉGRESSION)

### TEST 11.1 — Créer une commande OPEX et vérifier l'impact
**Actions :**
1. Onglet "Commandes OPEX" → Nouvelle commande
2. Remplir :
   - Fournisseur : `Google Workspace`
   - Description : `Abonnement annuel`
   - Montant : `30000`
   - Statut : `Commandée`
   - Date : `2024-02-01`
3. Aller sur OPEX → Observer la ligne "Google Workspace"

**Résultat attendu :**
- L'engagement de "Google Workspace" a **augmenté de 30 000 €**

**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

### TEST 11.2 — Passer une commande de "Commandée" à "Facturée"
**Actions :**
1. Modifier la commande "Abonnement annuel"
2. Changer le statut en "Facturée"
3. Retourner sur OPEX → "Google Workspace"

**Résultat attendu :**
- Engagement **diminue** de 30 000 €
- Dépense actuelle **augmente** de 30 000 €

**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

## MODULE 12 — DASHBOARD BUILDER (NOUVEAU v3.2)

### TEST 12.1 — Créer un dashboard personnalisé
**Actions :**
1. Cliquer sur le bouton "Créer un dashboard" (ou équivalent)
2. Nom : `Dashboard Test`
3. Enregistrer

**Résultat attendu :**
- Un nouvel onglet "Dashboard Test" apparaît dans la barre de navigation
- Le dashboard est vide (état initial)

**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL  [ ] ⏭️ SKIP (fonctionnalité non trouvée)

---

### TEST 12.2 — Ajouter un widget KPI au dashboard
**Précondition :** Dashboard créé au test 12.1
**Actions :**
1. Aller sur "Dashboard Test"
2. Cliquer sur "Ajouter un widget"
3. Sélectionner type "KPI"
4. Configurer :
   - Titre : `Budget OPEX Total`
   - Source de données : OPEX
   - Métrique : Budget Total
5. Enregistrer

**Résultat attendu :**
- Widget KPI affiché avec le total du budget OPEX
- Valeur numérique correcte

**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL  [ ] ⏭️ SKIP

---

### TEST 12.3 — Ajouter un widget graphique (Bar Chart)
**Actions :**
1. Ajouter un widget "Graphique en barres"
2. Configurer :
   - Titre : `Budget par Fournisseur`
   - Source : OPEX
   - Axe X : Fournisseur
   - Axe Y : Budget Annuel
3. Enregistrer

**Résultat attendu :**
- Graphique en barres affiché avec un bar par fournisseur
- Valeurs cohérentes avec les données OPEX

**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL  [ ] ⏭️ SKIP

---

### TEST 12.4 — Supprimer un dashboard personnalisé
**Actions :**
1. Cliquer sur l'icône de suppression du "Dashboard Test"
2. Confirmer

**Résultat attendu :**
- L'onglet "Dashboard Test" disparaît
- Les widgets sont supprimés

**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL  [ ] ⏭️ SKIP

---

## MODULE 13 — GITHUB STORAGE SERVICE (NOUVEAU v3.2)

### TEST 13.1 — Activer GitHub Storage (si configuré)
**Précondition :** Variables d'environnement GitHub configurées (`.env`)
**Actions :**
1. Paramètres → onglet "Stockage" (ou équivalent)
2. Activer "Sauvegarde GitHub"
3. Ajouter un fournisseur OPEX
4. Observer la console (F12) pour les appels API GitHub

**Résultat attendu :**
- Données sauvegardées sur GitHub (commit visible dans le repo)
- Message de confirmation dans la console

**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL  [ ] ⏭️ SKIP (GitHub non configuré)

---

### TEST 13.2 — Synchronisation bidirectionnelle
**Actions :**
1. Modifier un fichier JSON directement sur GitHub (fournisseur OPEX)
2. Recharger l'application
3. Observer si les données GitHub sont chargées

**Résultat attendu :**
- Les modifications GitHub sont reflétées dans l'application

**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL  [ ] ⏭️ SKIP

---

## RÉCAPITULATIF

| Module | Tests | Pass | Fail | Partiel | Skip |
|--------|-------|------|------|---------|------|
| 1 — Référentiels Paramétrables | 8 | | | | |
| 2 — Import CSV & Référentiels | 3 | | | | |
| 3 — Drag-and-Drop Onglets | 4 | | | | |
| 4 — Gestion Rôles | 3 | | | | |
| 5 — Réinitialisation MDP | 3 | | | | |
| 6 — Filtres Colonnes (Bug Fix) | 3 | | | | |
| 7 — Redimensionnement (Bug Fix) | 2 | | | | |
| 8 — Renommage Onglets | 1 | | | | |
| 9 — OPEX (Régression) | 3 | | | | |
| 10 — CAPEX (Régression) | 2 | | | | |
| 11 — Commandes (Régression) | 2 | | | | |
| 12 — Dashboard Builder | 4 | | | | |
| 13 — GitHub Storage | 2 | | | | |
| **TOTAL** | **40** | | | | |

---

## NOTES & ANOMALIES DÉTECTÉES

```
Date de test : _______________
Testeur : Comet
Environnement : Windows 11 / Chrome ou Edge

Anomalie 1 : Référentiel - Suppression avec données liées
-----------
Module : 1 (TEST 1.5)
Sévérité : [ ] Bloquante [ ] Majeure [ ] Mineure
Comportement observé : _______________
Comportement attendu : _______________


Anomalie 2 :
-----------
Module : _______________
Sévérité : [ ] Bloquante [ ] Majeure [ ] Mineure
Comportement observé : _______________
Comportement attendu : _______________


Anomalie 3 :
-----------
Module : _______________
Sévérité : [ ] Bloquante [ ] Majeure [ ] Mineure
Comportement observé : _______________
Comportement attendu : _______________


Anomalie 4 :
-----------


Anomalie 5 :
-----------

```

---

## TESTS DE NON-RÉGRESSION (OPTIONNELS)

### Anciens tests critiques à revérifier

**Authentification (Module 1 v3.0) :**
- [ ] Connexion superadmin fonctionne
- [ ] Connexion user (droits limités)
- [ ] Déconnexion
- [ ] Persistance session

**Vue d'ensemble :**
- [ ] Cartes budget OPEX/CAPEX affichées
- [ ] Totaux corrects
- [ ] Graphiques s'affichent

**Persistance :**
- [ ] localStorage fonctionne
- [ ] Données survivent au rechargement
- [ ] `localStorage.clear()` réinitialise correctement

---

## CHECKLIST PRÉ-LIVRAISON

Avant de valider la v3.2 en production :

- [ ] **Tous les tests PASS** (0 FAIL bloquant)
- [ ] **Anomalies documentées** dans le rapport
- [ ] **Tests de régression OK** (fonctionnalités v3.0/3.1 toujours opérationnelles)
- [ ] **Référentiels paramétrables** fonctionnels
- [ ] **Import CSV → Référentiels** fonctionne
- [ ] **Drag-and-drop onglets** sans bug
- [ ] **Gestion rôles & MDP** sécurisée
- [ ] **Filtres colonnes** sans perte de focus
- [ ] **Performance** acceptable (pas de lag visible)

---

## SIGNATURE

**Testeur :** Comet
**Date :** _______________
**Durée des tests :** _______________
**Résultat global :** [ ] ✅ Validé  [ ] ❌ Non validé  [ ] ⚠️ Validé avec réserves

**Commentaires finaux :**
```
_______________________________________________________________________________
_______________________________________________________________________________
_______________________________________________________________________________
```

---

*Cahier de tests généré le 2026-02-21 pour HospiFinance v3.2 — Tests pour validation Comet*
