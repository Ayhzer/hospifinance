# Rapport de tests QA — Hospifinance HFAR

**Campagne de test :** semaine du 26 au 30 mai 2026  
**Date d'exécution :** 29 mai 2026  
**Environnement testé :** `http://localhost:5173`  
**API attendue :** `http://localhost:3001`  
**Application :** Dashboard Financier DSI — Suivi OPEX & CAPEX [file:2]

## Contexte

Le présent rapport documente l'exécution du plan de tests fonctionnels Hospifinance HFAR couvrant les modules d'import, projection, vue analytique, reclassement, calculs budgétaires, corrections diverses et anomalies.[file:2] L'objectif était de dérouler l'ensemble du plan, de poursuivre les vérifications malgré les blocages, puis de consolider un état détaillé des résultats observés sur l'application en cours d'exécution.[file:2]

Le plan de référence comporte 46 points de contrôle répartis sur 7 modules, avec une attention particulière sur les imports SAGE/MAGH2, le drill-down de projection sur 4 niveaux, la cohérence EPRD, la qualité du moteur de reclassement et la non-régression des calculs budgétaires.[file:2]

## Synthèse des résultats

| Statut | Nombre | Commentaire |
|---|---:|---|
| PASS | 19 | Comportements conformes au plan ou conformes avec réserve mineure |
| PARTIEL | 5 | Vérification incomplète faute de données métier importées |
| FAIL / anomalie | 2 | Anomalies fonctionnelles nettes détectées |
| BLOQUÉ | 14 | Exécution impossible sans fichiers XLSX de test |

La majorité des scénarios exécutables sans jeu de données importé ont pu être testés jusqu'au bout.[file:2] Les blocages constatés proviennent principalement de l'absence de fichiers `.xlsx` SAGE et MAGH2 nécessaires à l'alimentation de l'application pour les scénarios d'import, de commandes et de drill-down détaillé.[file:2]

## Résultats par module

### Module 1 — Import SAGE / MAGH2

Les scénarios T1.1 à T1.6 n'ont pas pu être menés à terme faute de fichiers d'entrée conformes, mais l'accès à la modale d'import et sa structure générale ont été vérifiés.[file:2] La modale expose un bouton de sélection de fichier, des instructions d'import et un message indiquant que l'import remplace les données existantes, ce qui est cohérent avec le plan sur le mode non cumulatif attendu.[file:2]

Statut détaillé :

- T1.1 : bloqué, fichier SAGE ancien avec onglet `2026` non disponible.[file:2]
- T1.2 : bloqué, fichier MAGH2 avec onglet `Commandes IT` non disponible.[file:2]
- T1.3 : bloqué, dépend de la détection d'un format importé.[file:2]
- T1.4 : bloqué, conversion TTC vers HT non vérifiable sans fichier MAGH2.[file:2]
- T1.5 : bloqué, remplacement vs accumulation non vérifiable sans double import réel.[file:2]
- T1.6 : bloqué, contrôle des dates de commandes impossible sans commandes importées.[file:2]

### Module 2 — Projection

Le niveau 1 du tableau de projection ainsi que le sélecteur de mois réalisés ont pu être validés sur l'interface courante, mais les niveaux de drill-down dépendant de commandes importées sont restés inaccessibles.[file:2] Les colonnes principales attendues sont présentes, le sélecteur de mois est visible et le recalcul de la projection linéaire se comporte conformément à la formule décrite dans le plan.[file:2]

Statut détaillé :

- T2.1 : validé partiellement, avec colonnes présentes et ligne total visible, mais sans lignes exploitables par compte alimentées par des commandes.[file:2]
- T2.2 : validé, passage de `5 — Jan-Mai` à `3 — Jan-Mar` correctement reflété avec adaptation de la formule linéaire et stabilité des coefficients Best/Central/Worst.[file:2]
- T2.3 à T2.6 : bloqués, faute de données de commandes permettant l'ouverture des niveaux trimestriels, fournisseurs et commandes individuelles.[file:2]

### Module 3 — Vue analytique IT

La vérification du classement du compte H62881100 est conforme, mais une incohérence de total EPRD a été relevée entre la vue analytique et la projection.[file:2] Le plan attend un EPRD total DSITM de 3 925 000 €, alors que la vue analytique affiche 3 800 000 € dans les indicateurs de tête.[file:2]

Statut détaillé :

- T3.1 : validé avec anomalie, absence du bug massif de multiplication sur la famille Applications, mais écart de 125 000 € sur le total EPRD DSITM.[file:2]
- T3.2 : validé, le compte H62881100 « ABONNEMENT RDV EN LIGNE » apparaît bien dans la famille Applications plutôt que dans « Hors périmètre DSI ».[file:2]

### Module 4 — Reclassement

Le module de reclassement est la zone la plus aboutie de la campagne, avec validation du chargement du référentiel, de la recherche, de l'ajout, de l'édition, de la suppression, des règles mots-clés et de la persistance après rechargement.[file:2] Une incohérence demeure sur le mapping comptes, notamment autour du compte H62881100 absent du sous-onglet attendu alors qu'il existe ailleurs dans l'application.[file:2]

Statut détaillé :

- T4.1 : validé, référentiel correctement chargé avec environ 201 fournisseurs et sans lignes vides.[file:2]
- T4.2 : validé, recherche `DOCTOLIB` fonctionnelle avec filtrage cohérent.[file:2]
- T4.3 : validé, ajout d'un fournisseur de test et incrément du compteur observés.[file:2]
- T4.4 : validé, édition inline enregistrée sans rechargement de page.[file:2]
- T4.5 : validé, suppression immédiate et retour du compteur à son niveau initial.[file:2]
- T4.6 : validé, règle mots-clés créée avec badges et contrôles de priorité visibles.[file:2]
- T4.7 : validé partiellement, simulation fonctionnelle mais priorité observée du mapping compte sur les mots-clés pour le cas CROWDSTRIKE / H61526100.[file:2]
- T4.8 : en anomalie, H62881100 est attendu dans le mapping comptes avec famille Applications mais n'apparaît pas dans la liste concernée.[file:2]

### Module 5 — Calculs budgétaires

Les cartes budgétaires ne peuvent être pleinement évaluées sans données d'import, mais leur comportement à vide reste cohérent avec un environnement non alimenté.[file:2] Les contrôles de seuils partagent la même limite : la configuration semble présente, mais aucune charge réelle ne permet de valider les transitions Normal, Surveiller et Critique.[file:2]

Statut détaillé :

- T5.1 : partiel, budget, dépensé et taux à zéro cohérents avec l'absence de données, mais cohérence budgétaire métier non démontrable.[file:2]
- T5.2 : partiel, seuils visibles mais non testables dynamiquement.[file:2]
- T5.3 : bloqué, réimport CAPEX non cumulatif impossible à valider sans fichier MAGH2.[file:2]

### Module 6 — Corrections diverses

Les corrections liées au renommage d'enveloppe CAPEX et à la persistance du moteur de reclassement ont été testées dans la mesure du possible.[file:2] Les scénarios dépendant des imports SAGE restent bloqués, notamment la normalisation des noms fournisseurs et la restitution fine des statuts de commande.[file:2]

Statut détaillé :

- T6.1 : validé partiellement, renommage d'enveloppe visible dans les paramètres, sans possibilité de mesurer l'impact sur des projets CAPEX réels importés.[file:2]
- T6.2 : validé, persistance de l'entrée `PERSIST TEST` après rechargement de la page.[file:2]
- T6.3 : bloqué, absence de fichier SAGE contenant des préfixes numériques fournisseurs.[file:2]
- T6.4 : bloqué, absence de commandes SAGE importées pour contrôler les statuts `Payée`, `Annulée` et assimilés.[file:2]

### Module 7 — Anomalies et cohérence transverse

L'onglet Anomalies se comporte correctement en état vide, ce qui est cohérent tant qu'aucune donnée métier n'est importée.[file:2] En revanche, la cohérence entre la projection et la vue analytique n'est pas assurée sur les montants EPRD globaux, ce qui confirme une anomalie transverse et non un simple défaut d'affichage isolé.[file:2]

Statut détaillé :

- T7.1 : validé, état vide sans anomalie détectée et règles A1, A2, A5, A7 visibles.[file:2]
- T7.2 : partiel avec anomalie, cohérence impossible à vérifier sur les charges réelles, mais incohérence confirmée sur l'EPRD total entre écrans.[file:2]

## Anomalies détectées

| ID | Sévérité | Description | Impact |
|---|---|---|---|
| BUG-01 | Critique | La Vue analytique affiche un EPRD total OPEX DSITM de 3 800 000 € alors que la Projection et le plan attendent 3 925 000 €. | Rupture de confiance sur les indicateurs consolidés et risque d'erreur d'arbitrage budgétaire [file:2] |
| BUG-02 | Élevée | Le compte H62881100 est absent du sous-onglet « Mapping comptes » alors qu'il est reconnu ailleurs comme compte Applications. | Incohérence de paramétrage et risque de mauvais reclassement ou d'explicabilité incomplète [file:2] |
| BUG-03 | Moyenne | Une entrée SIGILIUM présente une famille erronée ou corrompue dans le référentiel. | Dégradation de la qualité des données de reclassement et risque de catégorisation incorrecte [file:2] |

## Évaluation QA

La campagne met en évidence une application globalement stable sur la navigation, la gestion de référentiels, la persistance et une partie des écrans analytiques, avec un bon niveau de maturité sur le module de reclassement.[file:2] Les principaux risques résiduels se concentrent toutefois sur les données d'import, les projections détaillées et la cohérence inter-écrans des indicateurs financiers, qui sont précisément les zones les plus sensibles fonctionnellement.[file:2]

En l'état, un feu vert complet ne peut pas être accordé pour une recette finale métier, car les cas critiques d'import et de drill-down ne sont pas couverts et une anomalie de cohérence budgétaire transverse subsiste.[file:2] En revanche, un feu vert conditionnel pour poursuite de qualification est envisageable après fourniture des fichiers de test attendus et correction prioritaire des écarts EPRD et mapping comptes.[file:2]

## Prérequis pour compléter la campagne

Les éléments suivants sont nécessaires pour finaliser les tests bloqués et lever l'incertitude sur les scénarios critiques.[file:2]

- Un fichier SAGE ancien contenant un onglet annuel nommé `2026`.[file:2]
- Un fichier MAGH2 contenant un onglet `Commandes IT`.[file:2]
- Un fichier MAGH2 représentatif permettant de vérifier la conversion TTC vers HT, les projets CAPEX et les commandes OPEX.[file:2]
- Un fichier SAGE contenant des fournisseurs préfixés numériquement pour valider la normalisation des noms.[file:2]
- Des données de commandes suffisantes pour ouvrir les niveaux N2, N3 et N4 de la projection.[file:2]

## Recommandations de reprise

1. Corriger en priorité l'écart de 125 000 € entre Vue analytique et Projection, puis rejouer T3.1 et T7.2.[file:2]
2. Réparer la source de mapping du compte H62881100 et rejouer T4.8 avec contrôle croisé sur la vue analytique.[file:2]
3. Fournir les fichiers XLSX de référence et relancer intégralement les tests T1.1 à T1.6, T2.3 à T2.6, T5.3, T6.3 et T6.4.[file:2]
4. Après alimentation en données, contrôler de nouveau la cohérence des KPIs OPEX, des seuils d'alerte et des statuts de commandes.[file:2]
