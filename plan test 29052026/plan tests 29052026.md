Plan de tests — Hospifinance HFAR

Modifications semaine du 26–30 mai 2026

Contexte et accès

URL : http://localhost:5173

Login : admin / Admin2024!

Serveur de données : doit écouter sur http://localhost:3001

Convention : chaque test indique les étapes, le résultat attendu (✅), et le résultat d'échec (❌)

MODULE 1 — Import SAGE / MAGH2 (ImportModal)

T1.1 — Détection automatique du format fichier

Étapes :



Aller dans l'onglet OPEX

Cliquer sur le bouton Importer

Sélectionner un fichier .xlsx contenant un onglet nommé 2026 (format SAGE ancien)

Attendu ✅ :



Un bandeau vert apparaît avec le texte "Format SAGE ancien détecté — onglet annuel"

Un sélecteur d'exercice (2021–2026) est visible, présélectionné sur 2026

PAS de checkbox "Convertir TTC → HT"

Échec ❌ : Bandeau absent, bandeau violet, ou bandeau "Format inconnu"



T1.2 — Détection format MAGH2

Étapes :



Même modale, sélectionner un fichier .xlsx contenant un onglet nommé Commandes IT

Attendu ✅ :



Bandeau violet : "Format MAGH2 détecté — onglet Commandes IT"

Sélecteur d'exercice visible

Checkbox "Convertir montants TTC → HT (recommandé)" cochée par défaut

Échec ❌ : Bandeau vert (format SAGE), ou checkbox absente



T1.3 — Sélecteur d'exercice actif dans les deux formats

Étapes :



Avec un fichier SAGE détecté, changer l'exercice de 2026 → 2025 dans le sélecteur

Vérifier que les instructions d'import reflètent le changement

Attendu ✅ :



La liste "Instructions d'import" affiche Format SAGE ancien — onglet "2025"

T1.4 — Import MAGH2 : montants TTC → HT

Étapes :



Sélectionner le fichier MAGH2 (Extraction\_Commandes\_MAGH2\_20260528.xlsx)

Vérifier que la checkbox "Convertir TTC → HT" est cochée

Cliquer sur Importer

Attendu ✅ :



Message de succès : "Import MAGH2 réussi (2026) (montants TTC→HT) : X fournisseurs OPEX, Y projets CAPEX, Z commandes"

La fenêtre se ferme automatiquement après 3 secondes

Échec ❌ : Erreur, ou message sans mention "TTC→HT", ou fenêtre qui ne se ferme pas



T1.5 — Import en mode remplacement (pas d'accumulation)

Étapes :



Importer le fichier MAGH2 une première fois → noter le nombre de fournisseurs OPEX affiché

Aller dans l'onglet OPEX → noter le nombre de lignes dans le tableau

Importer à nouveau le même fichier MAGH2 sans rien changer

Revenir dans l'onglet OPEX

Attendu ✅ :



Le nombre de fournisseurs est identique après le 2e import (pas de doublement)

Échec ❌ : Le nombre de fournisseurs double (accumulation)



T1.6 — Dates des commandes après import MAGH2

Étapes :



Après import MAGH2, aller dans l'onglet Commandes OPEX

Vérifier la colonne "Date cmd" pour plusieurs lignes

Attendu ✅ :



Les dates affichées sont au format YYYY-MM-DD (ex. 2022-01-03)

Aucune ligne n'affiche - comme date cmd (sauf si la date est réellement absente dans SAGE)

Échec ❌ : Toutes les dates sont - ou affichent des nombres comme 44926



MODULE 2 — Onglet Projection (drill-down 4 niveaux)

T2.1 — Niveau 1 : tableau de projection

Étapes :



Aller dans l'onglet Projection

Attendu ✅ :



Le tableau affiche des lignes par compte ordonnateur (H61526100, H65100000, etc.)

Colonnes présentes : Compte, Libellé, EPRD, Charge (5M), Linéaire, Best −5%, Central +10%, Worst +25%, Reste

La colonne "Best −5%" est en vert

Le sélecteur "Mois réalisés" (1–12) est visible dans l'en-tête à droite

Une ligne TOTAL DSITM en bas avec les totaux consolidés

Échec ❌ : Colonne "Best −5%" absente, sélecteur absent, tableau vide sans message



T2.2 — Sélecteur de mois réalisés

Étapes :



Dans l'onglet Projection, changer le sélecteur de "5 — Jan–Mai" à "3 — Jan–Mar"

Observer les colonnes Linéaire et projections

Attendu ✅ :



Les valeurs de la colonne Linéaire changent (charge × 12 / 3 au lieu de × 12 / 5)

Le libellé du sélecteur affiche "3 — Jan–Mar"

Les valeurs Best/Central/Worst ne changent PAS (elles sont × coefficient fixe de la charge, pas du nombre de mois)

Échec ❌ : Valeurs inchangées, ou toutes les colonnes changent y compris Best/Central/Worst



T2.3 — Niveau 2 : répartition trimestrielle

Étapes :



Cliquer sur le chevron > d'une ligne compte qui a des commandes (ex. H65100000 — 145 commandes)

Observer le panneau qui s'ouvre

Attendu ✅ :



Sous-section "Répartition trimestrielle — X commande(s)" visible

4 lignes : Q1 Jan·Fév·Mar, Q2 Avr·Mai·Jun, Q3 Jul·Aoû·Sep, Q4 Oct·Nov·Déc

Q1/Q2 (mois réalisés) affichent un montant > 0 € et un nb de commandes > 0

Q3/Q4 (non réalisés) sont grisés et affichent "Non réalisé"

Q1/Q2 avec données ont un chevron cliquable >

Échec ❌ : Toutes les lignes affichent "0 cmd", ou Q3/Q4 non grisés, ou pas de chevron



T2.4 — Niveau 3 : fournisseurs par trimestre

Étapes :



Sur une ligne Q1 ou Q2 avec des commandes, cliquer sur le chevron >

Attendu ✅ :



Liste des fournisseurs/éditeurs avec : nom réel (pas "Fournisseur #ID"), nb commandes, %, montant

Les fournisseurs sont triés par montant décroissant

Chaque fournisseur a un chevron > cliquable

Échec ❌ : Noms affichés comme "Fournisseur #1780033092712-2u5xxm", ou liste vide



T2.5 — Niveau 4 : commandes individuelles

Étapes :



Cliquer sur le chevron > d'un fournisseur au niveau 3

Attendu ✅ :



Tableau de commandes avec colonnes : Date cmd, Référence, Désignation, Statut, Montant

Les dates sont au format YYYY-MM-DD (pas -)

Les commandes sont triées par date décroissante

Aucun chevron (niveau terminal)

Échec ❌ : Dates -, colonnes manquantes, nouveau niveau d'expansion



T2.6 — Accordéon exclusif par niveau

Étapes :



Ouvrir le compte H61526100 (N1)

Dans Q1, ouvrir un fournisseur (N3)

Cliquer sur un autre fournisseur au niveau N3

Attendu ✅ :



Le précédent fournisseur se ferme, le nouveau s'ouvre (un seul ouvert par niveau)

Échec ❌ : Les deux fournisseurs restent ouverts simultanément



MODULE 3 — Vue analytique IT

T3.1 — EPRD par famille non multiplié

Étapes :



Aller dans l'onglet Vue analytique

Observer le graphique "Charge engagée vs EPRD par famille"

Survoler la barre "Applications"

Attendu ✅ :



L'EPRD Applications = environ 1 850 000 € (H61526100: 1.2M + H65100000: 450K + H62881100: 200K)

L'EPRD total DSITM dans les KPIs = 3 925 000 €

Échec ❌ : EPRD Applications > 10 000 000 € (bug de multiplication par nb suppliers)



T3.2 — Compte H62881100 correctement classé

Étapes :



Dans la Vue analytique, chercher dans le tableau si la famille "Applications" inclut le compte ABONNEMENT RDV EN LIGNE

Attendu ✅ :



H62881100 apparaît dans la famille Applications (pas dans "Hors périmètre DSI")

MODULE 4 — Onglet Reclassement

T4.1 — Chargement du référentiel

Étapes :



Aller dans l'onglet Reclassement (icône tag dans la navigation)

Observer le sous-onglet "Référentiel fournisseurs"

Attendu ✅ :



La liste affiche des fournisseurs avec leur nom (ex. "DOCTOLIB SAS"), leur famille et sous-catégorie

Le compteur en bas affiche "201 fournisseurs" (ou proche)

PAS de lignes vides (bug précédent : champs nom/famille absents)

Échec ❌ : Lignes vides avec seulement les icônes crayon/poubelle, ou compteur 0



T4.2 — Recherche dans le référentiel

Étapes :



Dans le sous-onglet "Référentiel fournisseurs", taper "DOCTOLIB" dans la barre de recherche

Attendu ✅ :



Seules les entrées contenant "DOCTOLIB" restent visibles

Le compteur affiche "X fournisseurs sur 201"

T4.3 — Ajout d'un fournisseur

Étapes :



Cliquer sur "+ Ajouter fournisseur"

Remplir : Nom = "FOURNISSEUR TEST", Famille = "Cybersécurité", Sous-catégorie = (choisir une valeur disponible)

Cliquer "Ajouter"

Attendu ✅ :



Le fournisseur "FOURNISSEUR TEST" apparaît dans la liste

Le compteur passe à 202 (ou +1)

T4.4 — Édition inline d'un fournisseur

Étapes :



Sur "FOURNISSEUR TEST", cliquer sur l'icône crayon

Modifier la famille → "Infrastructures"

Cliquer "Enregistrer"

Attendu ✅ :



La ligne reflète "Infrastructures" sans rechargement de page

Le formulaire d'édition se ferme

T4.5 — Suppression d'un fournisseur

Étapes :



Sur "FOURNISSEUR TEST", cliquer sur l'icône poubelle

Attendu ✅ :



L'entrée disparaît immédiatement de la liste

Le compteur revient à 201

T4.6 — Règles mots-clés : ajout et priorité

Étapes :



Aller dans le sous-onglet "Mots-clés"

Cliquer "+ Nouvelle règle"

Libellé = "Test antivirus", Mots-clés = "antivirus, edr", Famille = "Cybersécurité"

Cliquer "Ajouter"

Vérifier les boutons ▲▼ sur la nouvelle règle

Attendu ✅ :



La règle "Test antivirus" apparaît avec les badges "antivirus" et "edr"

Les boutons ▲▼ permettent de la monter/descendre dans la liste

T4.7 — Simuler \& appliquer (sous-onglet Simulation)

Étapes :



Aller dans le sous-onglet "Simuler \& appliquer"

Dans le test unitaire, taper : Fournisseur = "CROWDSTRIKE", Désignation = "", Compte = "H61526100"

Cliquer sur le bouton de test (▶)

Attendu ✅ :



Un résultat s'affiche avec Famille = "Cybersécurité" (ou selon le référentiel) et la source (Référentiel / Mots-clés / etc.)

La simulation sur tous les fournisseurs affiche des statistiques (% par source, % par famille)

T4.8 — Mapping comptes

Étapes :



Aller dans le sous-onglet "Mapping comptes"

Vérifier que le compte H62881100 (ABONNEMENT RDV EN LIGNE) est présent

Attendu ✅ :



H62881100 apparaît dans la liste avec famille = "Applications"

MODULE 5 — Calculs budgétaires (Vue d'ensemble)

T5.1 — Cohérence des totaux OPEX

Étapes :



Aller dans l'onglet Vue d'ensemble

Observer la carte "OPEX - Dépenses d'exploitation"

Attendu ✅ :



Le Budget est aux alentours de 3 925 000 € (EPRD OPEX DSI)

Le Dépensé est inférieur ou proche du budget (pas 9M€ sur 4M€ de budget)

Le Taux d'utilisation est < 200% (si supérieur, double comptage non résolu)

L'alerte "Budget presque épuisé" n'apparaît que si taux réel > 85%

Échec ❌ : Dépensé ou Engagé > 3× le budget, taux = 100% systématiquement



T5.2 — Seuils d'alerte unifiés

Étapes :



Observer l'alerte dans la carte OPEX (Vue d'ensemble)

Aller dans Vue analytique → tableau par famille

Comparer les niveaux d'alerte (Normal/Surveiller/Critique)

Attendu ✅ :



Le seuil Critique est à 85% dans les deux vues (plus 90% vs 85%)

Le seuil Surveiller est à 50% dans les deux vues

T5.3 — Import CAPEX non cumulatif

Étapes :



Importer le fichier MAGH2 → noter le nombre de projets CAPEX dans le message de succès

Aller dans l'onglet CAPEX → compter les lignes

Réimporter le même fichier

Revérifier l'onglet CAPEX

Attendu ✅ :



Nombre de projets CAPEX identique après les deux imports

Échec ❌ : Nombre doublé (accumulation)



MODULE 6 — Corrections bugs divers

T6.1 — Renommage d'enveloppe CAPEX

Étapes :



Aller dans Paramètres (icône engrenage ou raccourci)

Chercher la section "Renommer une enveloppe CAPEX"

Renommer une enveloppe existante (ex. "Infrastructure" → "Infrastructure DSI")

Aller dans l'onglet CAPEX

Attendu ✅ :



Les projets ayant l'enveloppe "Infrastructure" affichent maintenant "Infrastructure DSI"

Aucun projet ne perd ses autres données (budget, dépense, engagement)

Échec ❌ : Renommage sans effet, ou projets vidés après renommage



T6.2 — Sauvegarde du moteur de reclassement

Étapes :



Dans le sous-onglet "Référentiel fournisseurs", ajouter un fournisseur "PERSIST TEST"

Recharger la page (F5)

Revenir dans l'onglet Reclassement

Attendu ✅ :



"PERSIST TEST" est toujours présent après rechargement

Échec ❌ : L'entrée disparaît (sauvegarde via PUT /api/reclassement échoue)



T6.3 — Normalisation des noms fournisseurs à l'import

Étapes :



Importer un fichier SAGE ancien contenant des fournisseurs avec préfixe numérique (ex. "3127 2J PARTNERS")

Aller dans l'onglet OPEX

Attendu ✅ :



Le fournisseur apparaît avec son nom court "2J PARTNERS" (ou dans un seul groupe fusionné si plusieurs lignes)

PAS de doublon "2J PARTNERS" + "3127 2J PARTNERS"

T6.4 — Statuts de commandes SAGE

Étapes :



Aller dans l'onglet Commandes OPEX

Observer la colonne "Statut"

Attendu ✅ :



Les statuts sont : "Commandée", "Livrée", "Facturée", "Payée", "Annulée" (pas seulement "Commandée" / "Livrée")

Les lignes SAGE de type "Soldée" affichent "Payée" (pas "Facturée")

Les lignes "Annulée" affichent "Annulée" avec badge rouge

MODULE 7 — Anomalies et projection cohérence

T7.1 — Onglet Anomalies charge

Étapes :



Aller dans l'onglet Anomalies

Observer les règles A1 (>150% budget), A2 (<20% consommé), A5, A7

Attendu ✅ :



Les anomalies sont cohérentes avec les montants OPEX visibles dans les autres onglets

Pas d'anomalie si aucune donnée n'est importée (état vide)

T7.2 — Cohérence Projection vs Vue analytique

Étapes :



Dans Projection, noter la ligne H61526100 : EPRD et Charge

Dans Vue analytique, vérifier que la famille Applications contient les mêmes montants

Attendu ✅ :



La somme des Charges par famille (Vue analytique) correspond à la somme des Charges par compte dans la Projection

Matrice de criticité des tests

Test	Criticité	Fonctionnalité

T1.5 — Import non cumulatif	🔴 Critique	Données

T1.6 — Dates commandes	🔴 Critique	Drill-down

T2.3 à T2.5 — Drill-down N2/N3/N4	🔴 Critique	Projection

T3.1 — EPRD non multiplié	🔴 Critique	Calculs

T4.1 — Chargement référentiel	🔴 Critique	Reclassement

T5.1 — Totaux OPEX cohérents	🔴 Critique	Dashboard

T1.1/T1.2 — Détection format	🟠 Élevée	Import

T4.6/T4.7 — Règles + simulation	🟠 Élevée	Reclassement

T5.2 — Seuils unifiés	🟡 Moyenne	Alertes

T6.1 — Renommage enveloppe	🟡 Moyenne	CAPEX

T6.2 — Persistance reclassement	🟡 Moyenne	Sauvegarde

T2.2 — Sélecteur mois	🟢 Faible	UX

T6.4 — Statuts commandes	🟢 Faible	Import



