# Guide de Migration - Hospifinance

## 🔄 Protection des Données de Production

À partir de la version 3.1, Hospifinance **protège automatiquement vos données de production** contre l'écrasement lors des mises à jour.

---

## 📊 Comportement Actuel (v3.1+)

### Principe de Fonctionnement

L'application utilise maintenant un système de **détection intelligente** pour préserver vos données :

```javascript
Au démarrage de l'application:

1. Y a-t-il des données dans LocalStorage ?
   ├─ OUI → Charger les données existantes (VOS DONNÉES)
   │         ❌ NE PAS charger les données par défaut
   │
   └─ NON → Première utilisation
             ✅ Charger les données par défaut (exemples)
             ✅ Marquer l'application comme initialisée
```

### Flags de Protection

Deux mécanismes protègent vos données :

1. **Flag `hospifinance_initialized`** - Indique que l'app a déjà été initialisée
2. **Détection de données existantes** - Vérifie si les clés LocalStorage existent

---

## 🆕 Nouvelles Fonctions (storageService.js)

### `isInitialized()`

Vérifie si l'application a déjà été initialisée avec des données.

```javascript
import { isInitialized } from '../services/storageService';

if (isInitialized()) {
  console.log('Application déjà initialisée - Données protégées');
}
```

**Retourne**: `true` si l'app a déjà été utilisée, `false` sinon

### `markAsInitialized()`

Marque l'application comme initialisée (appelé automatiquement au premier chargement).

```javascript
import { markAsInitialized } from '../services/storageService';

// Appelé automatiquement dans useOpexData et useCapexData
markAsInitialized();
```

**Effet**:
- Sauvegarde le flag `hospifinance_initialized = 'true'`
- Sauvegarde la version actuelle `hospifinance_version = '3.1.0'`

### `hasOpexData()` / `hasCapexData()`

Vérifie si des données OPEX/CAPEX existent dans LocalStorage.

```javascript
import { hasOpexData, hasCapexData } from '../services/storageService';

if (hasOpexData()) {
  console.log('Données OPEX présentes');
}

if (hasCapexData()) {
  console.log('Données CAPEX présentes');
}
```

**Retourne**: `true` si la clé existe (même si tableau vide), `false` sinon

---

## 🔀 Scénarios de Migration

### Scénario 1: Première Installation (Nouveau)

**Situation**: Utilisateur installe Hospifinance pour la première fois

**Comportement**:
1. ✅ Aucune donnée dans LocalStorage
2. ✅ Chargement des données par défaut (3 fournisseurs OPEX, 3 projets CAPEX)
3. ✅ Sauvegarde des données par défaut
4. ✅ Flag `initialized = true`

**Résultat**: L'utilisateur voit les exemples pour comprendre l'application.

---

### Scénario 2: Mise à Jour v2.0 → v3.1 (Données Existantes)

**Situation**: Utilisateur utilise déjà v2.0 avec ses propres données

**Comportement**:
1. ✅ Données existantes détectées dans LocalStorage
2. ✅ Chargement des données de production (PAS de données par défaut)
3. ✅ Flag `initialized = true` ajouté
4. ❌ Les données par défaut NE SONT PAS chargées

**Résultat**: Les données de l'utilisateur sont **préservées intactes**.

---

### Scénario 3: Utilisateur Supprime Toutes les Données

**Situation**: L'utilisateur supprime manuellement tous ses fournisseurs/projets

**Comportement**:
1. ✅ Tableau vide `[]` sauvegardé dans LocalStorage
2. ✅ Au prochain chargement, tableau vide restauré
3. ❌ Les données par défaut NE SONT PAS rechargées

**Résultat**: Respect du choix de l'utilisateur (tableau vide intentionnel).

---

### Scénario 4: Réinitialisation Complète (Force Reset)

**Situation**: L'utilisateur veut repartir de zéro avec les exemples

**Solutions**:

#### Option A: Fonction `resetToDefaults()` (Recommandée)

```javascript
// Dans le composant
const { resetToDefaults } = useOpexData();
resetToDefaults(); // Recharge les données par défaut
```

**Effet**: Remplace les données actuelles par les données par défaut.

#### Option B: Effacer LocalStorage (Manuel)

1. Ouvrir les DevTools (F12)
2. Onglet **Application** → **Local Storage**
3. Supprimer les clés:
   - `hospifinance_opex_suppliers`
   - `hospifinance_capex_projects`
   - `hospifinance_initialized`
4. Rafraîchir la page (F5)

**Effet**: L'application se comporte comme une première installation.

#### Option C: Fonction `clearAllData()` (Totale)

```javascript
import { clearAllData } from '../services/storageService';

clearAllData(); // Efface TOUTES les données (OPEX, CAPEX, Auth, Settings, etc.)
window.location.reload(); // Recharger l'app
```

**⚠️ Attention**: Efface aussi les utilisateurs, sessions, commandes, paramètres !

---

## 📝 Changements de Code

### useOpexData.js

**Avant (v3.0)**:
```javascript
useEffect(() => {
  const storedData = loadOpexData();
  setSuppliers(storedData || DEFAULT_OPEX_DATA); // ❌ Écrasement possible
  setLoading(false);
}, []);
```

**Après (v3.1)**:
```javascript
useEffect(() => {
  const storedData = loadOpexData();

  if (storedData && storedData.length > 0) {
    setSuppliers(storedData); // ✅ Charger données production
  } else if (!hasOpexData()) {
    setSuppliers(DEFAULT_OPEX_DATA); // ✅ Uniquement si première fois
    saveOpexData(DEFAULT_OPEX_DATA);
    markAsInitialized();
  } else {
    setSuppliers([]); // ✅ Respecter tableau vide
  }

  setLoading(false);
}, []);
```

**Changements**:
- Détection intelligente des données existantes
- Pas de chargement par défaut si données présentes
- Respect du tableau vide (choix utilisateur)

### useCapexData.js

Même logique que `useOpexData.js` (voir ci-dessus).

---

## 🧪 Tests de Migration

### Test 1: Nouvelle Installation

```bash
# 1. Effacer LocalStorage
localStorage.clear()

# 2. Rafraîchir l'app
F5

# Résultat attendu:
✅ 3 fournisseurs OPEX par défaut
✅ 3 projets CAPEX par défaut
✅ Flag initialized = true
```

### Test 2: Mise à Jour avec Données

```bash
# 1. Créer des données personnalisées (ajouter fournisseurs/projets)
# 2. Simuler une mise à jour (rafraîchir ou redéployer)

# Résultat attendu:
✅ Vos données personnalisées intactes
❌ Pas de données par défaut ajoutées
✅ Flag initialized = true ajouté
```

### Test 3: Suppression Totale des Données

```bash
# 1. Supprimer manuellement tous les fournisseurs
# 2. Supprimer manuellement tous les projets
# 3. Rafraîchir l'app

# Résultat attendu:
✅ Tableaux vides []
❌ Pas de rechargement des données par défaut
```

### Test 4: Reset Manuel

```bash
# Dans la console DevTools
import { clearAllData } from '../services/storageService';
clearAllData();
location.reload();

# Résultat attendu:
✅ Toutes les données effacées
✅ Retour aux données par défaut (comme nouvelle installation)
```

---

## 🔍 Vérification de l'État

### Vérifier les Données dans LocalStorage

**Via DevTools**:
1. F12 → Onglet **Application**
2. **Local Storage** → `http://localhost:5173`
3. Chercher les clés:
   - `hospifinance_opex_suppliers`
   - `hospifinance_capex_projects`
   - `hospifinance_initialized`
   - `hospifinance_version`

**Via Console**:
```javascript
// Voir les fournisseurs OPEX
JSON.parse(localStorage.getItem('hospifinance_opex_suppliers'));

// Voir les projets CAPEX
JSON.parse(localStorage.getItem('hospifinance_capex_projects'));

// Vérifier flag initialized
localStorage.getItem('hospifinance_initialized'); // 'true' ou null

// Vérifier version
localStorage.getItem('hospifinance_version'); // '3.1.0'
```

---

## 🚨 Cas Particuliers

### Cas 1: Corruption de Données

**Symptômes**: L'app ne charge plus, erreurs JavaScript

**Solution**:
1. Ouvrir DevTools (F12)
2. Console: `localStorage.clear()`
3. Rafraîchir: `F5`
4. L'app redémarre avec données par défaut

### Cas 2: Version Incohérente

**Symptômes**: Version stockée différente de version code

**Solution**: Le système ignore la version et se base sur la présence de données.

```javascript
// Version stockée: '2.0.0'
// Version code: '3.1.0'

// Comportement:
if (hasOpexData()) {
  // Charger données (ignore la version)
  // La version sera mise à jour automatiquement
}
```

### Cas 3: Migration de v1.0 (Monolithique)

**Si vous aviez des données dans une ancienne structure**:

Les clés ont changé entre versions:
- v1.0: Pas de clés standardisées
- v2.0+: `hospifinance_opex_suppliers`, etc.

**Migration manuelle** (si nécessaire):
```javascript
// Lire anciennes données (exemple)
const oldData = localStorage.getItem('old_key_name');

// Convertir au nouveau format
const newData = convertOldFormat(oldData);

// Sauvegarder avec nouvelle clé
localStorage.setItem('hospifinance_opex_suppliers', JSON.stringify(newData));
```

---

## 📊 Tableau Récapitulatif

| Situation | Données Chargées | Flag `initialized` | Notes |
|-----------|------------------|-------------------|-------|
| **Première installation** | Données par défaut | ✅ `true` | Exemples pour découvrir l'app |
| **Mise à jour avec données** | Données production | ✅ `true` | Protection complète |
| **Tableau vide intentionnel** | `[]` vide | ✅ `true` | Respect choix utilisateur |
| **LocalStorage effacé** | Données par défaut | ✅ `true` | Comme première installation |
| **Reset manuel** | Données par défaut | ✅ `true` | Via `resetToDefaults()` |

---

## 🎯 Bonnes Pratiques

### Pour les Utilisateurs

1. ✅ **Faire des backups réguliers** - Exporter CSV/JSON de vos données
2. ✅ **Tester en environnement de dev** - Avant de déployer en production
3. ✅ **Vérifier après mise à jour** - Que vos données sont intactes
4. ❌ **Ne pas effacer LocalStorage** - Sans savoir que vous perdrez vos données

### Pour les Développeurs

1. ✅ **Utiliser `hasOpexData()`** - Au lieu de vérifier `loadOpexData() === null`
2. ✅ **Appeler `markAsInitialized()`** - Après premier chargement données par défaut
3. ✅ **Tester les 4 scénarios** - Nouvelle install, mise à jour, tableau vide, reset
4. ✅ **Documenter les migrations** - Si structure de données change

---

## 🔮 Futur (v4.0 - Backend)

Avec un backend, la migration sera automatisée :

```
Flux de migration automatique:

1. User login → Backend vérifie version user
2. Si version < actuelle → Migration script lancé
3. Données transformées au nouveau format
4. Version mise à jour en base
5. Confirmation à l'utilisateur

Avantages:
✅ Pas de perte de données
✅ Migration transparente
✅ Rollback possible
✅ Logs de migration
```

---

## ❓ FAQ Migration

**Q: Mes données seront-elles perdues lors de la mise à jour ?**
R: Non, à partir de v3.1, les données sont **automatiquement protégées**.

**Q: Comment revenir aux données par défaut ?**
R: Utiliser la fonction `resetToDefaults()` dans les hooks ou effacer LocalStorage.

**Q: Le flag `initialized` sert à quoi exactement ?**
R: À indiquer que l'app a déjà été utilisée, pour éviter de recharger les exemples.

**Q: Puis-je supprimer toutes mes données sans recharger les exemples ?**
R: Oui, supprimez manuellement tous les items. Le tableau vide sera respecté.

**Q: Que se passe-t-il si je change de navigateur ?**
R: LocalStorage est local au navigateur. Vos données ne suivent pas (sauf export/import manuel).

**Q: Comment migrer mes données vers un autre ordinateur ?**
R: Exporter en JSON, puis importer sur le nouvel ordinateur (fonctionnalité prévue v4.0).

---

**Version**: 3.1.0
**Dernière mise à jour**: Février 2026
**Auteur**: Alex - Deputy Director of Information Systems

---

## 🔗 Liens Utiles

- [README.md](README.md) - Vue d'ensemble du projet
- [CHANGELOG.md](CHANGELOG.md) - Historique des versions
- [ARCHITECTURE.md](ARCHITECTURE.md) - Architecture technique
- [storageService.js](src/services/storageService.js) - Code source du service de stockage
