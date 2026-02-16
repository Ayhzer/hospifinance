# Cahier de Tests — HospiFinance v3.2
**Application :** Tableau de Bord Financier DSI
**URL locale :** http://localhost:5175
**Date :** 2026-02-15

---

## Légende
- ✅ PASS — Le comportement est conforme
- ❌ FAIL — Le comportement est incorrect
- ⚠️ PARTIEL — Fonctionne partiellement
- [ ] Case à cocher pour suivi

---

## PRÉREQUIS

Avant de commencer :
1. Ouvrir http://localhost:5175 dans le navigateur
2. Ouvrir la console (F12 → Console)
3. Taper `localStorage.clear()` et appuyer sur Entrée
4. Recharger la page (F5)

---

## MODULE 1 — AUTHENTIFICATION

### TEST 1.1 — Connexion avec identifiants incorrects
**Précondition :** Page de login affichée
**Actions :**
1. Saisir `admin` dans le champ utilisateur
2. Saisir `mauvaismdp` dans le champ mot de passe
3. Cliquer sur "Se connecter"

**Résultat attendu :** Message d'erreur "Identifiants incorrects" affiché, pas de redirection
**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

### TEST 1.2 — Connexion superadmin
**Actions :**
1. Saisir `admin` / `Admin2024!`
2. Cliquer sur "Se connecter"

**Résultat attendu :** Redirection vers le tableau de bord, les 5 onglets sont visibles
**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

### TEST 1.3 — Persistance de session
**Précondition :** Être connecté en tant que admin
**Actions :**
1. Recharger la page (F5)

**Résultat attendu :** Toujours connecté, tableau de bord affiché sans repasser par le login
**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

### TEST 1.4 — Déconnexion
**Actions :**
1. Cliquer sur le bouton "Déconnexion" (en haut à droite)

**Résultat attendu :** Retour à la page de login, session effacée
**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

### TEST 1.5 — Connexion rôle "user"
**Actions :**
1. Se connecter avec `user` / `User2024!`

**Résultat attendu :**
- Tableau de bord visible
- **Onglet Paramètres absent ou inaccessible**
- Boutons "Supprimer", "Exporter", "Importer" absents sur OPEX/CAPEX

**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

### TEST 1.6 — Changer son propre mot de passe
**Précondition :** Connecté en tant que `admin`
**Actions :**
1. Ouvrir les Paramètres (Ctrl+Shift+P)
2. Aller dans l'onglet "Utilisateurs"
3. Cliquer sur "Changer mot de passe" pour son propre compte
4. Saisir l'ancien mot de passe `Admin2024!`
5. Saisir un nouveau mot de passe `Admin2025!`
6. Valider
7. Se déconnecter et se reconnecter avec `Admin2025!`

**Résultat attendu :** Connexion réussie avec le nouveau mot de passe
**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

> **Nettoyage :** Remettre le mot de passe à `Admin2024!` après ce test

---

## MODULE 2 — NAVIGATION & ONGLETS

### TEST 2.1 — Navigation entre onglets
**Précondition :** Connecté en tant que admin
**Actions :**
1. Cliquer sur chaque onglet : "Vue d'ensemble", "OPEX", "CAPEX", "Commandes OPEX", "Commandes CAPEX"

**Résultat attendu :** Chaque onglet s'affiche sans page blanche ni erreur
**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

### TEST 2.2 — Renommer un onglet
**Actions :**
1. Cliquer sur l'icône crayon (✏️) à côté du nom d'un onglet (ex: "OPEX")
2. Saisir "Dépenses courantes"
3. Valider (Entrée ou clic ailleurs)
4. Recharger la page

**Résultat attendu :** L'onglet s'appelle "Dépenses courantes" même après rechargement
**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

> **Nettoyage :** Remettre le nom d'origine "OPEX"

---

## MODULE 3 — OPEX

### TEST 3.1 — Affichage des données par défaut
**Précondition :** Connecté admin, onglet OPEX
**Actions :**
1. Aller sur l'onglet OPEX

**Résultat attendu :** 3 fournisseurs affichés : Oracle Health, Microsoft, Dell Technologies
**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

### TEST 3.2 — Ajouter un fournisseur (données valides)
**Actions :**
1. Cliquer sur "Ajouter un fournisseur"
2. Remplir :
   - Fournisseur : `SAP`
   - Catégorie : `Logiciels`
   - Budget annuel : `200000`
   - Dépense actuelle : `50000`
   - Engagement : `30000`
   - Notes : `Licences ERP`
3. Cliquer sur "Enregistrer"

**Résultat attendu :**
- Ligne SAP ajoutée dans le tableau
- Disponible affiché = 120 000 €
- Utilisation = 40%

**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

### TEST 3.3 — Ajouter un fournisseur (données invalides)
**Actions :**
1. Cliquer sur "Ajouter un fournisseur"
2. Laisser "Fournisseur" vide
3. Mettre budget = `0`
4. Cliquer sur "Enregistrer"

**Résultat attendu :** Messages d'erreur de validation, pas d'ajout
**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

### TEST 3.4 — Modifier un fournisseur
**Actions :**
1. Cliquer sur l'icône ✏️ de "Microsoft"
2. Changer le budget annuel de `300000` à `350000`
3. Enregistrer

**Résultat attendu :** Ligne Microsoft mise à jour avec 350 000 €
**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

### TEST 3.5 — Supprimer un fournisseur
**Actions :**
1. Cliquer sur l'icône 🗑️ du fournisseur "SAP" (créé au test 3.2)
2. Confirmer la suppression dans la boîte de dialogue

**Résultat attendu :** SAP retiré du tableau
**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

### TEST 3.6 — Calcul disponible négatif (dépassement)
**Actions :**
1. Modifier "Dell Technologies"
2. Mettre dépense = `140000` et engagement = `20000` (total = 160k > budget 150k)
3. Enregistrer

**Résultat attendu :** Disponible affiché en **rouge** avec valeur négative (-10 000 €)
**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

> **Nettoyage :** Remettre les valeurs originales de Dell

---

### TEST 3.7 — Export CSV
**Actions :**
1. Cliquer sur "CSV" dans la barre OPEX

**Résultat attendu :** Fichier `.csv` téléchargé avec les données OPEX
**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

### TEST 3.8 — Export JSON
**Actions :**
1. Cliquer sur "JSON" dans la barre OPEX

**Résultat attendu :** Fichier `.json` téléchargé
**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

### TEST 3.9 — Télécharger le template CSV
**Actions :**
1. Cliquer sur "Modèle CSV" (ou icône de téléchargement template)

**Résultat attendu :** Fichier CSV vierge téléchargé avec les colonnes OPEX
**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

### TEST 3.10 — Persistance des données OPEX
**Actions :**
1. Ajouter un fournisseur test (ex: `Test Persist` / `Maintenance` / budget 10000)
2. Recharger la page (F5)

**Résultat attendu :** Le fournisseur "Test Persist" toujours présent après rechargement
**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

> **Nettoyage :** Supprimer "Test Persist"

---

## MODULE 4 — CAPEX

### TEST 4.1 — Affichage des projets par défaut
**Précondition :** Onglet CAPEX
**Résultat attendu :** 3 projets : Renouvellement Datacenter, Déploiement VDI, Cybersécurité - SIEM
**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

### TEST 4.2 — Ajouter un projet (données valides)
**Actions :**
1. Cliquer sur "Ajouter un projet"
2. Remplir :
   - Enveloppe : `Cybersécurité`
   - Projet : `EDR - Endpoint Detection`
   - Budget : `250000`
   - Dépensé : `80000`
   - Engagement : `60000`
   - Date début : `2024-01-01`
   - Date fin : `2024-12-31`
   - Statut : `En cours`
   - Notes : `Déploiement en cours`
3. Enregistrer

**Résultat attendu :** Projet ajouté, apparaît dans la liste et dans le résumé Cybersécurité
**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

### TEST 4.3 — Validation des dates
**Actions :**
1. Ajouter un projet avec :
   - Date début : `2024-12-31`
   - Date fin : `2024-01-01` (antérieure au début)
2. Tenter d'enregistrer

**Résultat attendu :** Erreur de validation, pas d'ajout
**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

### TEST 4.4 — Résumé par enveloppe
**Actions :**
1. Cliquer sur une enveloppe dans le résumé (ex: "Infrastructure")

**Résultat attendu :** Section dépliée avec le/les projet(s) de cette enveloppe et les totaux
**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

### TEST 4.5 — Modifier le statut d'un projet
**Actions :**
1. Modifier "Déploiement VDI"
2. Changer le statut de "En cours" à "Terminé"
3. Enregistrer

**Résultat attendu :** Statut mis à jour dans le tableau (badge "Terminé")
**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

> **Nettoyage :** Remettre statut "En cours"

---

### TEST 4.6 — Supprimer un projet
**Actions :**
1. Supprimer le projet "EDR - Endpoint Detection" créé au test 4.2
2. Confirmer

**Résultat attendu :** Projet supprimé, résumé Cybersécurité mis à jour
**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

## MODULE 5 — COMMANDES

### TEST 5.1 — Ajouter une commande OPEX
**Précondition :** Onglet "Commandes OPEX"
**Actions :**
1. Cliquer sur "Nouvelle commande"
2. Remplir :
   - Fournisseur : `Oracle Health`
   - Description : `Renouvellement licence 2025`
   - Montant : `125000`
   - Statut : `Commandée`
   - Date commande : `2025-01-15`
   - Référence : `BC-2025-001`
3. Enregistrer

**Résultat attendu :** Commande ajoutée dans le tableau
**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

### TEST 5.2 — Impact budget d'une commande (Engagement)
**Précondition :** Commande créée au TEST 5.1 (statut "Commandée")
**Actions :**
1. Aller sur l'onglet OPEX
2. Observer la colonne "Engagement" pour Oracle Health

**Résultat attendu :** L'engagement d'Oracle a **augmenté de 125 000 €** (statut "Commandée" = engagement)
**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

### TEST 5.3 — Impact budget : Facturée → Dépense
**Actions :**
1. Retourner sur "Commandes OPEX"
2. Modifier la commande "Renouvellement licence 2025"
3. Changer le statut de "Commandée" à "Facturée"
4. Enregistrer
5. Aller sur l'onglet OPEX → Oracle Health

**Résultat attendu :**
- Engagement **diminue** de 125 000 €
- Dépense actuelle **augmente** de 125 000 €

**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

### TEST 5.4 — Commande "En attente" = pas d'impact
**Actions :**
1. Ajouter une commande OPEX :
   - Fournisseur : `Microsoft`
   - Description : `Test en attente`
   - Montant : `50000`
   - Statut : `En attente`
2. Vérifier l'onglet OPEX → Microsoft

**Résultat attendu :** Ni l'engagement ni la dépense de Microsoft ne changent
**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

### TEST 5.5 — Ajouter une commande CAPEX
**Précondition :** Onglet "Commandes CAPEX"
**Actions :**
1. Cliquer sur "Nouvelle commande"
2. Remplir :
   - Projet : `Renouvellement Datacenter`
   - Description : `Achat serveurs blade`
   - Montant : `200000`
   - Statut : `Commandée`
3. Enregistrer

**Résultat attendu :** Commande ajoutée
**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

### TEST 5.6 — Supprimer une commande
**Actions :**
1. Supprimer la commande "Test en attente" (test 5.4)
2. Confirmer

**Résultat attendu :** Commande supprimée du tableau
**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

## MODULE 6 — VUE D'ENSEMBLE (DASHBOARD)

### TEST 6.1 — Affichage des cartes budget
**Précondition :** Onglet "Vue d'ensemble"
**Résultat attendu :**
- Carte OPEX : budget total = 950 000 €
- Carte CAPEX : budget total = 3 300 000 €
- Totaux cohérents avec les données OPEX/CAPEX

**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

### TEST 6.2 — Affichage du budget consolidé
**Résultat attendu :** Section "Budget consolidé" = somme OPEX + CAPEX
**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

### TEST 6.3 — Alerte seuil critique
**Actions :**
1. Sur l'onglet OPEX, modifier "Microsoft"
2. Mettre dépense = `295000` et engagement = `5000` (300k sur 300k = 100%)
3. Retourner sur Vue d'ensemble

**Résultat attendu :** Bandeau d'alerte rouge ou indicateur critique visible pour OPEX
**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

> **Nettoyage :** Remettre les valeurs Microsoft d'origine

---

## MODULE 7 — PARAMÈTRES

### TEST 7.1 — Ouverture des paramètres
**Actions :**
1. Appuyer sur `Ctrl+Shift+P`

**Résultat attendu :** Panneau paramètres s'ouvre
**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

### TEST 7.2 — Changer la couleur principale
**Actions :**
1. Paramètres → onglet "Apparence"
2. Modifier la couleur "Principal" (primary) par `#e11d48` (rouge)
3. Fermer les paramètres

**Résultat attendu :** Les boutons primaires deviennent rouges dans toute l'interface
**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

> **Nettoyage :** Remettre la couleur primary à `#2563eb`

---

### TEST 7.3 — Masquer une colonne OPEX
**Actions :**
1. Paramètres → onglet "Colonnes"
2. Désactiver la colonne "Notes" dans OPEX
3. Fermer les paramètres → aller sur OPEX

**Résultat attendu :** Colonne "Notes" absente du tableau OPEX
**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

> **Nettoyage :** Réactiver la colonne "Notes"

---

### TEST 7.4 — Modifier les seuils d'alerte
**Actions :**
1. Paramètres → onglet "Règles"
2. Modifier le seuil d'avertissement à `60%`
3. Modifier le seuil critique à `80%`
4. Enregistrer

**Résultat attendu :** La barre de progression de Microsoft (93%) passe en rouge, Dell (~77%) passe en orange
**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

> **Nettoyage :** Remettre seuils à 75% / 90%

---

### TEST 7.5 — Créer une colonne personnalisée OPEX
**Actions :**
1. Paramètres → onglet "Colonnes personnalisées"
2. Sélectionner type "OPEX"
3. Ajouter une colonne :
   - Nom : `Responsable`
   - Type : `Texte`
   - Obligatoire : Non
4. Enregistrer

**Résultat attendu :** Colonne "Responsable" visible dans le tableau OPEX et dans les formulaires d'ajout/modification
**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

### TEST 7.6 — Supprimer une colonne personnalisée
**Actions :**
1. Supprimer la colonne "Responsable" créée au test 7.5

**Résultat attendu :** Colonne retirée du tableau
**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

### TEST 7.7 — Gestion des utilisateurs (créer)
**Précondition :** Connecté admin
**Actions :**
1. Paramètres → "Utilisateurs"
2. Ajouter un utilisateur :
   - Nom : `test.user`
   - Mot de passe : `Test2024!`
   - Rôle : `Utilisateur`
3. Se déconnecter
4. Se connecter avec `test.user` / `Test2024!`

**Résultat attendu :** Connexion réussie avec le nouveau compte
**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

### TEST 7.8 — Désactiver un utilisateur
**Précondition :** Connecté admin
**Actions :**
1. Paramètres → "Utilisateurs"
2. Désactiver le compte `test.user`
3. Se déconnecter
4. Tenter de se connecter avec `test.user` / `Test2024!`

**Résultat attendu :** Connexion refusée (compte désactivé)
**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

### TEST 7.9 — Supprimer un utilisateur
**Précondition :** Connecté admin
**Actions :**
1. Réactiver `test.user`
2. Supprimer le compte `test.user`

**Résultat attendu :** Compte supprimé, n'apparaît plus dans la liste
**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

### TEST 7.10 — Logs de connexion
**Actions :**
1. Paramètres → onglet "Logs"

**Résultat attendu :** Historique des connexions/déconnexions avec timestamps, types (login_success, login_failed, logout)
**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

### TEST 7.11 — Purger les logs
**Actions :**
1. Cliquer sur "Purger" dans l'onglet Logs

**Résultat attendu :** Liste des logs vidée
**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

## MODULE 8 — CONTRÔLE D'ACCÈS (rôle USER)

**Précondition :** Se connecter avec `user` / `User2024!`

### TEST 8.1 — Accès refusé aux paramètres
**Résultat attendu :** Bouton Paramètres absent ou grisé, Ctrl+Shift+P ne fait rien
**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

### TEST 8.2 — Boutons Supprimer absents (OPEX)
**Actions :** Aller sur l'onglet OPEX
**Résultat attendu :** Les icônes 🗑️ sont absentes dans la colonne Actions
**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

### TEST 8.3 — Boutons Export absents (OPEX)
**Résultat attendu :** Boutons "CSV", "JSON", "Modèle" absents sur l'onglet OPEX
**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

### TEST 8.4 — Ajout autorisé (OPEX)
**Actions :**
1. Cliquer sur "Ajouter un fournisseur"
2. Remplir les champs valides
3. Enregistrer

**Résultat attendu :** Le fournisseur est bien ajouté (l'ajout est autorisé pour le rôle user)
**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

> **Nettoyage :** Supprimer ce fournisseur en reconnectant admin

---

## MODULE 9 — IMPORT CSV

### TEST 9.1 — Import CSV OPEX valide
**Précondition :** Connecté admin
**Actions :**
1. Télécharger le template OPEX (test 3.9)
2. L'ouvrir et ajouter une ligne :
   ```
   Cisco Systems,Logiciels,100000,40000,10000,Test import
   ```
3. Sauvegarder le fichier
4. Utiliser le bouton "Importer CSV" sur OPEX
5. Sélectionner ce fichier

**Résultat attendu :** Cisco Systems importé et visible dans le tableau
**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

> **Nettoyage :** Supprimer Cisco Systems

---

### TEST 9.2 — Import CSV avec données invalides
**Actions :**
1. Préparer un CSV avec une ligne vide / budget = 0
2. Tenter l'import

**Résultat attendu :** Message d'erreur, données invalides rejetées
**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

## MODULE 10 — PERSISTANCE GLOBALE

### TEST 10.1 — Toutes les données survivent au rechargement
**Actions :**
1. Vérifier que des données OPEX, CAPEX, Commandes sont présentes
2. Fermer et rouvrir le navigateur
3. Aller sur http://localhost:5175

**Résultat attendu :** Toutes les données sont toujours là après fermeture du navigateur
**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

### TEST 10.2 — Réinitialisation aux données par défaut
**Actions :**
1. Dans la console (F12) : `localStorage.clear()` + F5

**Résultat attendu :** Retour aux 3 fournisseurs et 3 projets par défaut après reconnexion
**Résultat obtenu :** _______________
[ ] ✅ PASS  [ ] ❌ FAIL

---

## RÉCAPITULATIF

| Module | Tests | Pass | Fail | Partiel |
|--------|-------|------|------|---------|
| 1 — Authentification | 6 | | | |
| 2 — Navigation | 2 | | | |
| 3 — OPEX | 10 | | | |
| 4 — CAPEX | 6 | | | |
| 5 — Commandes | 6 | | | |
| 6 — Dashboard | 3 | | | |
| 7 — Paramètres | 11 | | | |
| 8 — Contrôle d'accès | 4 | | | |
| 9 — Import CSV | 2 | | | |
| 10 — Persistance | 2 | | | |
| **TOTAL** | **52** | | | |

---

## NOTES & ANOMALIES DÉTECTÉES

```
Date : _______________
Testeur : _______________

Anomalie 1 :
-----------


Anomalie 2 :
-----------


Anomalie 3 :
-----------

```

---

*Cahier de tests généré le 2026-02-15 — HospiFinance v3.2*
