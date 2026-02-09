# Guide d'Import/Export - Hospifinance v3.1+

## 📋 Vue d'ensemble

Hospifinance permet maintenant d'**importer et exporter des données** via des fichiers CSV, facilitant ainsi la migration de données depuis d'autres outils (Excel, autres systèmes) ou la saisie en masse.

---

## 📤 Export de Données

### Types d'Export Disponibles

| Type | Description | Format | Usage |
|------|-------------|--------|-------|
| **CSV** | Export des données actuelles | CSV (Excel) | Backup, analyse Excel |
| **JSON** | Export format structuré | JSON | Backup technique, API |
| **Modèle** | Fichier vierge à remplir | CSV | Import de nouvelles données |

### Export des Données Actuelles

#### OPEX - Fournisseurs

1. Aller dans l'onglet **OPEX**
2. Cliquer sur **CSV** ou **JSON**
3. Fichier téléchargé: `opex_fournisseurs_2026-02-09.csv`

**Contenu**: Tous vos fournisseurs avec budgets, dépenses, engagements

#### CAPEX - Projets

1. Aller dans l'onglet **CAPEX**
2. Cliquer sur **CSV** ou **JSON**
3. Fichier téléchargé: `capex_projets_2026-02-09.csv`

**Contenu**: Tous vos projets avec budgets, statuts, dates

---

## 📥 Import de Données

### Processus d'Import en 3 Étapes

```
1. Télécharger un modèle vierge
   ↓
2. Remplir le fichier CSV (Excel, LibreOffice, etc.)
   ↓
3. Importer le fichier complété
```

---

## 📋 Import OPEX - Fournisseurs

### Étape 1: Télécharger le Modèle

1. Onglet **OPEX**
2. Cliquer sur le bouton **Modèle** (📄)
3. Fichier téléchargé: `modele_opex.csv`

### Étape 2: Remplir le Modèle

Ouvrir `modele_opex.csv` dans Excel ou LibreOffice Calc.

**Colonnes requises**:

| Colonne | Type | Requis | Description | Exemple |
|---------|------|--------|-------------|---------|
| `supplier` | Texte | ✅ | Nom du fournisseur | `IBM France` |
| `category` | Texte | ✅ | Catégorie | `Logiciels` |
| `budgetAnnuel` | Nombre | ✅ | Budget total (€) | `150000` |
| `depenseActuelle` | Nombre | ❌ | Dépense actuelle (€) | `50000` |
| `engagement` | Nombre | ❌ | Engagement (€) | `30000` |
| `notes` | Texte | ❌ | Notes libres | `Contrat annuel` |

**Catégories valides**:
- Logiciels
- Licences
- Support matériel
- Maintenance
- Cloud & Hébergement
- Télécommunications
- Services externes
- Formation

**Exemple de remplissage**:

```csv
supplier,category,budgetAnnuel,depenseActuelle,engagement,notes
IBM France,Logiciels,150000,50000,30000,Contrat annuel
SAP,Logiciels,200000,100000,50000,ERP
Cisco Systems,Télécommunications,80000,40000,20000,Équipements réseau
```

### Étape 3: Importer le Fichier

1. Onglet **OPEX**
2. Cliquer sur **Importer** (📥)
3. Sélectionner votre fichier CSV complété
4. Cliquer sur **Importer**

**Résultat**: Les fournisseurs sont ajoutés à vos données existantes.

---

## 🏗️ Import CAPEX - Projets

### Étape 1: Télécharger le Modèle

1. Onglet **CAPEX**
2. Cliquer sur le bouton **Modèle** (📄)
3. Fichier téléchargé: `modele_capex.csv`

### Étape 2: Remplir le Modèle

Ouvrir `modele_capex.csv` dans Excel.

**Colonnes requises**:

| Colonne | Type | Requis | Description | Exemple |
|---------|------|--------|-------------|---------|
| `project` | Texte | ✅ | Nom du projet | `Migration ERP` |
| `budgetTotal` | Nombre | ✅ | Budget total (€) | `500000` |
| `depense` | Nombre | ❌ | Dépense actuelle (€) | `200000` |
| `engagement` | Nombre | ❌ | Engagement (€) | `100000` |
| `dateDebut` | Date | ❌ | Date début | `2026-01-01` |
| `dateFin` | Date | ❌ | Date fin | `2026-12-31` |
| `status` | Texte | ❌ | Statut | `En cours` |
| `notes` | Texte | ❌ | Notes libres | `Phase 2 en cours` |

**Statuts valides**:
- Planifié
- En cours
- Terminé
- Suspendu
- Annulé

**Format des dates**: `YYYY-MM-DD` (ex: `2026-02-09`)

**Exemple de remplissage**:

```csv
project,budgetTotal,depense,engagement,dateDebut,dateFin,status,notes
Migration ERP,500000,200000,100000,2026-01-01,2026-12-31,En cours,Phase 2 en cours
Nouvelle infrastructure,300000,0,50000,2026-03-01,2026-09-30,Planifié,Appel d'offres en cours
Mise à jour sécurité,100000,90000,0,2025-10-01,2026-01-31,Terminé,Projet finalisé
```

### Étape 3: Importer le Fichier

1. Onglet **CAPEX**
2. Cliquer sur **Importer** (📥)
3. Sélectionner votre fichier CSV
4. Cliquer sur **Importer**

---

## ✅ Validation des Données

L'import vérifie automatiquement la **cohérence et la validité** des données.

### Vérifications Effectuées

#### Pour OPEX

✅ **Champs requis** - supplier, category, budgetAnnuel présents
✅ **Catégorie valide** - Catégorie dans la liste autorisée
✅ **Montants positifs** - Tous les montants ≥ 0
✅ **Cohérence budgétaire** - depense + engagement ≤ budgetAnnuel
✅ **Nom unique** - Pas de doublon avec fournisseurs existants
✅ **Nom unique dans le fichier** - Pas de doublon dans le CSV

#### Pour CAPEX

✅ **Champs requis** - project, budgetTotal présents
✅ **Statut valide** - Statut dans la liste autorisée
✅ **Montants positifs** - Tous les montants ≥ 0
✅ **Cohérence budgétaire** - depense + engagement ≤ budgetTotal
✅ **Cohérence des dates** - dateDebut < dateFin
✅ **Format des dates** - YYYY-MM-DD valide
✅ **Nom unique** - Pas de doublon avec projets existants

---

## ❌ Gestion des Erreurs

### Si des Erreurs Sont Détectées

L'import est **ANNULÉ** et un rapport d'erreurs détaillé s'affiche :

**Exemple**:

```
❌ Erreurs détectées lors de l'import

• Ligne 2: Catégorie invalide "Matériels". Valeurs acceptées: Logiciels, Licences, ...
• Ligne 3: Le fournisseur "IBM France" existe déjà
• Ligne 5: Dépense (80000) + Engagement (50000) dépasse le budget (100000)
• Ligne 7: Champs requis manquants - budgetAnnuel
```

**Action**: Corrigez les erreurs dans votre fichier CSV et réessayez.

### Types d'Erreurs Courantes

| Erreur | Cause | Solution |
|--------|-------|----------|
| **Champs requis manquants** | Colonne vide | Remplir toutes les colonnes requises |
| **Catégorie/Statut invalide** | Valeur non reconnue | Utiliser exactement les valeurs listées |
| **Montant négatif** | Nombre < 0 | Utiliser des nombres positifs |
| **Dépassement budget** | depense+engagement > budget | Ajuster les montants |
| **Doublon** | Nom déjà existant | Utiliser un nom unique |
| **Date invalide** | Format incorrect | Utiliser YYYY-MM-DD |
| **Dates incohérentes** | dateDebut > dateFin | Inverser les dates |

---

## 🔄 Import Partiel

Si **certaines lignes sont valides** mais d'autres contiennent des erreurs:

- ✅ L'import est annulé (aucune donnée ajoutée)
- ℹ️ Le nombre de lignes valides est affiché
- ❌ Toutes les erreurs sont listées

**Raison**: Garantir la **cohérence des données** (tout ou rien).

---

## 💡 Bonnes Pratiques

### Avant l'Import

1. ✅ **Télécharger le modèle** - Ne pas créer le CSV manuellement
2. ✅ **Sauvegarder vos données** - Exporter en CSV avant d'importer
3. ✅ **Tester sur 1-2 lignes** - Vérifier le format avant import massif
4. ✅ **Vérifier les doublons** - Noms uniques requis

### Pendant le Remplissage

1. ✅ **Respecter les majuscules** - `Logiciels` pas `logiciels`
2. ✅ **Pas de caractères spéciaux** - Éviter `<>` dans les noms
3. ✅ **Format des nombres** - `150000` pas `150 000` ni `150.000`
4. ✅ **Format des dates** - `2026-02-09` pas `09/02/2026`
5. ✅ **Laisser vides les colonnes optionnelles** - Ne pas mettre `0` partout

### Après l'Import

1. ✅ **Vérifier les données** - Contrôler que tout est correct
2. ✅ **Conserver le fichier CSV** - Backup de la source
3. ✅ **Exporter immédiatement** - Backup post-import

---

## 📊 Cas d'Usage

### Scénario 1: Migration depuis Excel

**Situation**: Vous gérez actuellement vos budgets dans Excel

**Solution**:
1. Télécharger le modèle OPEX/CAPEX
2. Copier-coller vos données Excel dans le modèle
3. Ajuster les noms de colonnes si nécessaire
4. Importer le fichier

### Scénario 2: Initialisation Rapide

**Situation**: Première utilisation, vous voulez saisir 50 fournisseurs

**Solution**:
1. Télécharger le modèle OPEX
2. Remplir les 50 lignes dans Excel
3. Importer en une seule fois
4. Gain de temps vs saisie manuelle

### Scénario 3: Mise à Jour Annuelle

**Situation**: Nouveau budget annuel, nouveaux projets

**Solution**:
1. Exporter les données actuelles (backup)
2. Télécharger le modèle CAPEX
3. Lister les nouveaux projets
4. Importer les nouveaux projets (les anciens restent)

### Scénario 4: Partage entre Collègues

**Situation**: Votre collègue prépare les données, vous les importez

**Solution**:
1. Envoyer le modèle à votre collègue
2. Il remplit le fichier
3. Vous recevez le CSV complété
4. Vous l'importez directement

---

## 🔒 Sécurité des Données

### Protection contre l'Écrasement

- ✅ **Import additionnel** - Les données sont **ajoutées**, pas remplacées
- ✅ **Données existantes préservées** - Vos fournisseurs/projets actuels restent intacts
- ✅ **Doublons rejetés** - Impossible d'importer un nom déjà existant

### Validation Stricte

- ✅ **Tous les imports validés** - Aucune donnée invalide acceptée
- ✅ **Rapport d'erreurs complet** - Savoir exactement ce qui ne va pas
- ✅ **Transaction atomique** - Tout passe ou rien ne passe

---

## 📝 Format CSV Détaillé

### Encodage

- **Charset**: UTF-8 avec BOM
- **Séparateur**: Virgule `,`
- **Quote**: Guillemets doubles `"` pour valeurs avec virgules
- **Ligne d'en-tête**: Obligatoire (noms de colonnes)

### Échappement des Valeurs

Si une valeur contient une **virgule** ou des **guillemets** :

```csv
supplier,notes
"IBM France, Société","Contrat ""Premium"""
```

Résultat:
- supplier: `IBM France, Société`
- notes: `Contrat "Premium"`

### Lignes Vides

Les **lignes vides** sont ignorées automatiquement.

---

## ❓ FAQ

**Q: Puis-je importer des données qui existent déjà ?**
R: Non, l'import rejette les doublons (même nom). Utilisez la modification manuelle.

**Q: L'import remplace-t-il mes données existantes ?**
R: Non, l'import **ajoute** aux données existantes. Vos données actuelles sont préservées.

**Q: Puis-je importer des commandes (orders) ?**
R: Pas encore en v3.1. Fonctionnalité prévue en v3.2. Vous devez d'abord importer les fournisseurs/projets, puis créer les commandes manuellement.

**Q: Combien de lignes puis-je importer en une fois ?**
R: Illimité techniquement, mais recommandé de ne pas dépasser 500 lignes par import pour des raisons de performance.

**Q: Puis-je modifier le format du CSV ?**
R: Non, respectez strictement le modèle fourni. Toute modification des noms de colonnes causera un échec d'import.

**Q: Les montants doivent-ils être en euros ?**
R: Oui, l'application utilise exclusivement l'euro. Les montants sont sans symbole (ex: `150000` pas `150000€`).

**Q: Puis-je importer des dates au format français (DD/MM/YYYY) ?**
R: Non, utilisez obligatoirement le format ISO `YYYY-MM-DD` (ex: `2026-02-09`).

**Q: Que se passe-t-il si je mets 0 dans depenseActuelle et engagement ?**
R: C'est valide. Cela signifie "aucune dépense/engagement pour l'instant".

**Q: Puis-je laisser les colonnes optionnelles vides ?**
R: Oui, les colonnes marquées ❌ (non requises) peuvent être vides.

---

## 🆕 Roadmap (Futures Versions)

### v3.2 (Prévu)

- [ ] Import de commandes OPEX/CAPEX
- [ ] Import avec mise à jour (modifier existants)
- [ ] Import JSON (en plus de CSV)

### v4.0 (Avec Backend)

- [ ] Import via API REST
- [ ] Import asynchrone (gros fichiers)
- [ ] Historique des imports
- [ ] Rollback d'import
- [ ] Validation côté serveur
- [ ] Import Excel natif (.xlsx)

---

## 📚 Liens Utiles

- [README.md](README.md) - Vue d'ensemble du projet
- [QUICK_START_v3.md](QUICK_START_v3.md) - Guide de démarrage
- [MIGRATION.md](MIGRATION.md) - Guide de migration
- [DATA_PROTECTION.md](DATA_PROTECTION.md) - Protection des données

---

**Version**: 3.1.0
**Dernière mise à jour**: Février 2026
**Auteur**: Alex - Deputy Director of Information Systems
