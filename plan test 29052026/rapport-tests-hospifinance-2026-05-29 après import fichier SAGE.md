Voici le rapport complet au format Markdown, à copier dans un fichier `rapport-qa-dsitm-hfar-2026.md` :

```markdown
# Rapport QA — Tableau de Bord Financier DSI DSITM/HFAR 2026

**URL testée :** http://localhost:5173  
**Date de campagne :** 29/05/2026 — 17h00 CEST  
**Environnement :** localhost (Node + Vite), API backend port 3001  
**Testeur :** QA automation (Comet / browser agent)  
**Périmètre :** T1.1 → T7.2 — 7 modules, 31 sous-tests  

---

## Synthèse exécutive

| Module | Tests | ✅ PASS | ⚠️ PARTIEL | ❌ FAIL | 🔒 BLOQUÉ |
|--------|------:|-------:|-----------:|-------:|----------:|
| M1 — Import SAGE MAGH2 | 6 | 0 | 0 | 0 | 6 |
| M2 — Projection drill-down | 6 | 4 | 2 | 0 | 0 |
| M3 — Vue analytique IT | 2 | 1 | 0 | 1 | 0 |
| M4 — Reclassement | 8 | 7 | 1 | 0 | 0 |
| M5 — Calculs budgétaires | 3 | 0 | 3 | 0 | 0 |
| M6 — Corrections / Commandes | 4 | 4 | 0 | 0 | 0 |
| M7 — Anomalies | 2 | 1 | 0 | 1 | 0 |
| **TOTAL** | **31** | **17 (55 %)** | **6 (19 %)** | **2 (6 %)** | **6 (19 %)** |

> **Taux de réussite hors bloqués :** 23 / 25 = **92 %**  
> **Taux de réussite global :** 17 / 31 = **55 %** *(pénalisé par les 6 tests M1 bloqués)*

---

## Bugs identifiés

| ID | Sévérité | Module | Description | Impact |
|----|----------|--------|-------------|--------|
| BUG-001 | 🔴 CRITIQUE | M3 / M7 | EPRD incohérent : Projection (3 600 000 €) ≠ Vue analytique (3 800 000 €) — écart **200 000 €** | Pilotage budgétaire faussé |
| BUG-002 | 🟠 ÉLEVÉ | M4 | Compte H62881100 absent du mapping analytique bien que présent dans les budgets EPRD | Perte de traçabilité analytique |
| BUG-003 | 🟡 FAIBLE | M5 | Écarts d'arrondi systématiques de **1 €** sur les totaux agrégés OPEX et CAPEX | Confiance dans les chiffres affaiblie |

---

## MODULE 1 — Import SAGE MAGH2 (T1.1–T1.6)

**Statut : 🔒 BLOQUÉ**

| Test | Description | Résultat | Commentaire |
|------|-------------|---------|-------------|
| T1.1 | Import fichier SAGE Ancien (XLSX) | 🔒 BLOQUÉ | Fichiers XLSX non disponibles dans l'environnement d'automation |
| T1.2 | Import extraction MAGH2 | 🔒 BLOQUÉ | Idem |
| T1.3 | Validation colonnes importées | 🔒 BLOQUÉ | Dépend T1.1 / T1.2 |
| T1.4 | Consolidation post-import | 🔒 BLOQUÉ | Dépend T1.1 / T1.2 |
| T1.5 | Gestion doublons | 🔒 BLOQUÉ | Dépend T1.1 / T1.2 |
| T1.6 | Rollback en cas d'erreur | 🔒 BLOQUÉ | Dépend T1.1 / T1.2 |

**Cause :** La modal d'import (bouton "Importer", zone Dropzone) est accessible et fonctionnelle visuellement. Le blocage est lié à l'impossibilité d'accéder au filesystem local via l'automation browser (dialog système natif non controllable).

**Action requise :**
- Fournir les fichiers XLSX de test (SAGE ancien + extraction MAGH2)
- **OU** exposer un endpoint mock `POST /api/opex/import` avec jeu de données préchargé

---

## MODULE 2 — Projection Drill-down (T2.1–T2.6)

**Statut : ✅ PASS partiel**

| Test | Description | Résultat | Valeurs observées |
|------|-------------|---------|-------------------|
| T2.1 | Accès Projection, sélecteur mois | ✅ PASS | Mois réalisés : **5 (Jan–Mai 2026)** |
| T2.2 | Colonne "Best −5 %" affichée en vert | ✅ PASS | Colonne présente, valeurs cohérentes |
| T2.3 | Drill-down par compte (clic chevron) | ✅ PASS | Chevron `>` présent et cliquable sur chaque ligne |
| T2.4 | Drill-down fournisseur dans compte | ⚠️ PARTIEL | Navigation possible mais données limitées sans import MAGH2 |
| T2.5 | Totaux consolidés Projection | ⚠️ PARTIEL | EPRD Projection = **3 600 000 €** ≠ Vue analytique (3 800 000 €) → voir BUG-001 |
| T2.6 | Alerte risque dépassement (bannière rouge) | ✅ PASS | **7 comptes en risque** listés en bannière rouge |

**Comptes en risque de dépassement (worst case) :**
- H61526100 — MAINT INFORM DIVERSES : dépassement estimé 236 067 €
- H65100000 — REDEVANCES, BREVETS, LICENCES : dépassement estimé 258 212 €
- H62630000 — AFFRANCHISSEMENTS : dépassement estimé 323 515 €
- H62631000 — TELEPHONIE A DISTANCE / CALL CENTER : dépassement estimé 163 393 €
- H61325100 — LOC EQUIP MAT INFO : dépassement estimé 39 467 €
- H62650000 — TELEPHONE (CONSOMMATION) : dépassement estimé 66 630 €
- H62882000 — ARCHIVAGES A L'EXT : dépassement estimé 1 069 €

---

## MODULE 3 — Vue Analytique IT (T3.1–T3.2)

**Statut : ⚠️ PASS avec BUG critique**

| Test | Description | Résultat | Valeurs observées |
|------|-------------|---------|-------------------|
| T3.1 | EPRD Vue analytique = EPRD Projection | ❌ FAIL | Vue analytique : **3 800 000 €** / Projection : **3 600 000 €** → écart **200 000 €** |
| T3.2 | Classification H62881100 = "Applications" | ✅ PASS | Famille analytique confirmée dans la vue |

**Détail Vue analytique par famille (TOTAL DSITM) :**

| Famille analytique | EPRD | Charge engagée | Taux réal. | Reste à engager | Alerte |
|--------------------|-----:|---------------:|----------:|----------------:|--------|
| Applications | 1 850 000 € | 1 706 696 € | 92.3 % | 143 304 € | Critique |
| Infrastructures | 1 200 000 € | 639 937 € | 53.3 % | 560 063 € | Surveiller |
| Hors périmètre DSI | 390 000 € | 463 431 € | 118.8 % | −73 431 € | Critique |
| Prestations externes récurrentes | 360 000 € | 332 148 € | 92.3 % | 27 852 € | Critique |
| Support et services utilisateurs | 0 € | 315 806 € | — | −315 806 € | Normal |
| Data et pilotage | 0 € | 182 016 € | — | −182 016 € | Normal |
| Cybersécurité | 0 € | 68 882 € | — | −68 882 € | Normal |
| **TOTAL DSITM** | **3 800 000 €** | **3 708 916 €** | **97.6 %** | **91 084 €** | |

**🐛 BUG-001 :** La Projection totalise 3 600 000 € d'EPRD alors que la Vue analytique en recense 3 800 000 €. Les familles "Support et services utilisateurs", "Data et pilotage" et "Cybersécurité" ont un EPRD à 0 € dans la Vue analytique mais sont peut-être absentes ou partiellement couvertes dans la Projection. Hypothèse : comptes sans EPRD saisi côté Projection mais chargés côté Vue analytique.

---

## MODULE 4 — Reclassement (T4.1–T4.8)

**Statut : ✅ PASS majoritaire**

| Test | Description | Résultat | Commentaire |
|------|-------------|---------|-------------|
| T4.1 | Ajout fournisseur OPEX | ✅ PASS | "FOURNISSEUR TEST" créé, persisté après reload |
| T4.2 | Édition inline fournisseur | ✅ PASS | Modification catégorie/famille inline fonctionnelle |
| T4.3 | Suppression fournisseur | ✅ PASS | Modal de confirmation + suppression effective |
| T4.4 | Filtres / recherche fournisseur | ✅ PASS | Filtre texte fonctionnel (ex : DOCTOLIB → résultat immédiat) |
| T4.5 | Tri colonnes | ✅ PASS | Tri par Fournisseur, Catégorie, Famille opérationnel |
| T4.6 | Règles Mots-clés automatiques | ✅ PASS | Interface de création de règles accessible et fonctionnelle |
| T4.7 | Simulation / Application de règles | ✅ PASS | Simulation fonctionnelle avant application |
| T4.8 | Mapping comptes analytiques | ⚠️ ANOMALIE | H62881100 présent dans les budgets EPRD mais absent du mapping comptes → BUG-002 |

---

## MODULE 5 — Calculs Budgétaires (T5.1–T5.3)

**Statut : ⚠️ QUASI-PASS**

| Test | Description | Résultat | Attendu | Affiché | Écart |
|------|-------------|---------|---------|---------|-------|
| T5.1 | Cohérence TOTAL OPEX (Dépensé + Engagé = Charge engagée) | ⚠️ QUASI-PASS | 3 708 917 € | 3 708 916 € | −1 € |
| T5.2 | Consolidation Vue d'ensemble OPEX + CAPEX | ⚠️ QUASI-PASS | 4 745 159 € | 4 745 158 € | −1 € |
| T5.3 | Synthèse CAPEX par enveloppe (Infrastructures) | ⚠️ QUASI-PASS | −350 411 € | −350 412 € | −1 € |

**Données consolidées vérifiées :**

| | OPEX | CAPEX | TOTAL |
|--|-----:|------:|------:|
| Dépensé | 1 247 344 € | 614 569 € | **1 861 913 €** ✅ |
| Engagé | 2 461 573 € | 2 283 586 € | **4 745 159 €** (affiché 4 745 158 €) |
| Disponible | −3 708 916 € | −2 898 155 € | **−6 607 071 €** ✅ |

**Synthèse CAPEX par enveloppe :**

| Enveloppe | Projets | Dépensé | Engagé | Disponible |
|-----------|--------:|--------:|-------:|----------:|
| Applications | 32 | 241 339 € | 893 037 € | −1 134 376 € |
| Cybersécurité | 1 | 0 € | 128 546 € | −128 546 € |
| Infrastructures | 12 | 63 448 € | 286 963 € | −350 412 € |
| Non classé | 20 | 309 232 € | 791 490 € | −1 100 722 € |
| Prestations externes récurrentes | 8 | 120 € | 70 442 € | −70 562 € |
| Support et services utilisateurs | 7 | 430 € | 113 107 € | −113 537 € |

**🐛 BUG-003 :** Erreurs d'arrondi cumulées de 1 € sur les totaux agrégés. À corriger côté backend en utilisant des calculs entiers en centimes plutôt qu'en flottants euros.

---

## MODULE 6 — Corrections / Commandes (T6.1–T6.4)

**Statut : ✅ PASS complet**

| Test | Description | Résultat | Commentaire |
|------|-------------|---------|-------------|
| T6.1 | Renommage enveloppe CAPEX | ✅ PASS | "Infrastructure" → "Infrastructure DSI" persisté après reload |
| T6.2 | Persistance des modifications | ✅ PASS | Toutes les modifications persistent correctement |
| T6.3 | Création / édition / suppression Commande OPEX | ✅ PASS | Commande TEST-QA-001 créée (9 999 €, DOCTOLIB SAS, En attente 29/05/2026) puis supprimée. Total avant : 894 cmd / 3 753 671 €. Total après suppression : 893 cmd / 3 743 672 € (delta = 9 999 € ✅) |
| T6.4 | Structure Commandes CAPEX | ✅ PASS | Modal "Nouvelle commande CAPEX" fonctionnelle avec champ "Projet" (format F