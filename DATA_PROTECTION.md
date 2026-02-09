# 🛡️ Protection des Données de Production - Guide Technique

## 📋 Vue d'ensemble

À partir de la version **3.1.0**, Hospifinance implémente un système de **protection automatique** des données de production pour éviter leur écrasement lors des mises à jour de code.

---

## ❌ Problème Résolu

### Comportement AVANT v3.1 (Problématique)

```javascript
// useOpexData.js - ANCIEN CODE
useEffect(() => {
  const storedData = loadOpexData();
  setSuppliers(storedData || DEFAULT_OPEX_DATA); // ⚠️ PROBLÈME ICI
  setLoading(false);
}, []);
```

**Problème**:
```
1. Utilisateur a 50 fournisseurs de production
2. Mise à jour du code vers nouvelle version
3. Au chargement: loadOpexData() retourne les 50 fournisseurs
4. MAIS si une erreur survient ou si storedData est falsy
   → Les 3 fournisseurs par défaut écrasent les 50 fournisseurs ! ❌
```

**Conséquences**:
- ❌ Perte de données de production
- ❌ Confusion utilisateur
- ❌ Nécessité de restaurer depuis backup

---

## ✅ Solution Implémentée v3.1

### Nouveau Comportement

```javascript
// useOpexData.js - NOUVEAU CODE
useEffect(() => {
  const storedData = loadOpexData();

  // Protection à 3 niveaux
  if (storedData && storedData.length > 0) {
    // Niveau 1: Données existantes avec contenu
    setSuppliers(storedData); ✅
  }
  else if (!hasOpexData()) {
    // Niveau 2: Première installation (aucune clé)
    setSuppliers(DEFAULT_OPEX_DATA); ✅
    saveOpexData(DEFAULT_OPEX_DATA);
    markAsInitialized();
  }
  else {
    // Niveau 3: Tableau vide intentionnel (choix utilisateur)
    setSuppliers([]); ✅
  }

  setLoading(false);
}, []);
```

**Avantages**:
- ✅ Données de production jamais écrasées
- ✅ Respect du choix utilisateur (tableau vide)
- ✅ Chargement par défaut uniquement à la première utilisation
- ✅ Protection multi-niveaux

---

## 🔍 Mécanismes de Protection

### 1. Vérification de Présence des Données

**Fonction**: `hasOpexData()` / `hasCapexData()`

```javascript
// storageService.js
export const hasOpexData = () => {
  return localStorage.getItem(STORAGE_KEYS.OPEX) !== null;
};
```

**Logique**:
- Retourne `true` si la clé existe (même si `[]` ou `null`)
- Retourne `false` si la clé n'existe pas (première installation)

**Usage**:
```javascript
if (!hasOpexData()) {
  // Première installation → Charger données par défaut
  setSuppliers(DEFAULT_OPEX_DATA);
}
```

---

### 2. Flag d'Initialisation

**Fonction**: `isInitialized()` / `markAsInitialized()`

```javascript
// storageService.js
export const isInitialized = () => {
  return localStorage.getItem(STORAGE_KEYS.INITIALIZED) === 'true';
};

export const markAsInitialized = () => {
  saveData(STORAGE_KEYS.INITIALIZED, 'true');
  saveData(STORAGE_KEYS.VERSION, CURRENT_VERSION);
};
```

**Clé LocalStorage**: `hospifinance_initialized`

**Valeurs**:
- `'true'` - Application déjà utilisée
- `null` - Première utilisation

**Usage**:
```javascript
// Appelé automatiquement lors du premier chargement
if (!hasOpexData()) {
  setSuppliers(DEFAULT_OPEX_DATA);
  saveOpexData(DEFAULT_OPEX_DATA);
  markAsInitialized(); // ← Marquer comme initialisé
}
```

---

### 3. Détection de Données Vides

**Cas d'usage**: Utilisateur supprime volontairement toutes ses données

```javascript
// Données dans LocalStorage: []
const storedData = loadOpexData(); // Retourne []

// Vérification
if (storedData && storedData.length > 0) {
  // NON (length = 0)
}
else if (!hasOpexData()) {
  // NON (clé existe)
}
else {
  // OUI → Respecter le choix (tableau vide)
  setSuppliers([]); ✅
}
```

**Résultat**: Le tableau vide est respecté, pas de rechargement des données par défaut.

---

## 🔄 Flux Complet

### Scénario 1: Première Installation

```
1. User ouvre l'app pour la première fois
   ↓
2. loadOpexData() retourne null
   ↓
3. hasOpexData() retourne false (clé n'existe pas)
   ↓
4. Charger DEFAULT_OPEX_DATA
   ↓
5. saveOpexData(DEFAULT_OPEX_DATA)
   ↓
6. markAsInitialized()
   ↓
7. Résultat: 3 fournisseurs exemples + flag initialized = true
```

### Scénario 2: Mise à Jour avec Données Production

```
1. User a 50 fournisseurs (v3.0)
   ↓
2. Mise à jour vers v3.1
   ↓
3. loadOpexData() retourne les 50 fournisseurs
   ↓
4. storedData.length > 0 → true
   ↓
5. Charger les 50 fournisseurs (production)
   ↓
6. markAsInitialized() (si pas déjà fait)
   ↓
7. Résultat: 50 fournisseurs PRÉSERVÉS ✅
```

### Scénario 3: Tableau Vide Intentionnel

```
1. User supprime tous ses fournisseurs
   ↓
2. saveOpexData([]) - Tableau vide sauvegardé
   ↓
3. Rechargement de l'app
   ↓
4. loadOpexData() retourne []
   ↓
5. storedData.length > 0 → false
   ↓
6. hasOpexData() → true (clé existe)
   ↓
7. Charger [] (respecter le choix)
   ↓
8. Résultat: Tableau vide respecté ✅
```

---

## 📊 Diagramme de Décision

```
                    Application démarre
                           |
                           ↓
                  loadOpexData()
                           |
              ┌────────────┴─────────────┐
              |                          |
        Retourne data                Retourne null/[]
              |                          |
              ↓                          ↓
     data.length > 0 ?          hasOpexData() ?
         |        |                 |        |
        OUI      NON               NON      OUI
         |        |                 |        |
         ↓        |                 ↓        |
    Charger data  |          Charger défaut |
    (Production)  |          + markInit     |
         ↓        |                 ↓        |
         ✅       |                 ✅       |
                  ↓                          ↓
            hasOpexData() ?          Charger []
                |        |           (Tableau vide)
               OUI      NON                ↓
                |        |                 ✅
                ↓        ↓
          Charger []  Charger défaut
          (Vide OK)   + markInit
                ↓        ↓
                ✅       ✅
```

---

## 🧪 Tests Unitaires (Recommandés v4.0)

### Test 1: Première Installation

```javascript
describe('useOpexData - Première Installation', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('devrait charger les données par défaut', () => {
    const { result } = renderHook(() => useOpexData());

    expect(result.current.suppliers).toHaveLength(3);
    expect(result.current.suppliers[0].supplier).toBe('Oracle Health');
    expect(localStorage.getItem('hospifinance_initialized')).toBe('true');
  });
});
```

### Test 2: Données Existantes

```javascript
describe('useOpexData - Données Existantes', () => {
  beforeEach(() => {
    const productionData = [
      { id: 1, supplier: 'Production Supplier 1' },
      { id: 2, supplier: 'Production Supplier 2' }
    ];
    localStorage.setItem('hospifinance_opex_suppliers', JSON.stringify(productionData));
  });

  it('devrait charger les données de production', () => {
    const { result } = renderHook(() => useOpexData());

    expect(result.current.suppliers).toHaveLength(2);
    expect(result.current.suppliers[0].supplier).toBe('Production Supplier 1');
  });

  it('ne devrait PAS charger les données par défaut', () => {
    const { result } = renderHook(() => useOpexData());

    expect(result.current.suppliers).not.toContainEqual(
      expect.objectContaining({ supplier: 'Oracle Health' })
    );
  });
});
```

### Test 3: Tableau Vide

```javascript
describe('useOpexData - Tableau Vide', () => {
  beforeEach(() => {
    localStorage.setItem('hospifinance_opex_suppliers', JSON.stringify([]));
    localStorage.setItem('hospifinance_initialized', 'true');
  });

  it('devrait respecter le tableau vide', () => {
    const { result } = renderHook(() => useOpexData());

    expect(result.current.suppliers).toHaveLength(0);
  });

  it('ne devrait PAS recharger les données par défaut', () => {
    const { result } = renderHook(() => useOpexData());

    expect(result.current.suppliers).toHaveLength(0);
    expect(result.current.suppliers).not.toContainEqual(
      expect.objectContaining({ supplier: 'Oracle Health' })
    );
  });
});
```

---

## 🔧 Fonctions Ajoutées

### storageService.js

| Fonction | Description | Retour |
|----------|-------------|--------|
| `isInitialized()` | Vérifie si l'app a déjà été utilisée | `boolean` |
| `markAsInitialized()` | Marque l'app comme initialisée | `void` |
| `hasOpexData()` | Vérifie si données OPEX existent | `boolean` |
| `hasCapexData()` | Vérifie si données CAPEX existent | `boolean` |

### Constantes Ajoutées

```javascript
const STORAGE_KEYS = {
  // ... existant
  INITIALIZED: 'hospifinance_initialized' // ← NOUVEAU
};

const CURRENT_VERSION = '3.1.0'; // Mis à jour de 3.0.0
```

---

## 📝 Checklist de Migration

Pour migrer un hook vers la protection des données :

- [ ] Importer `hasOpexData` et `markAsInitialized` depuis storageService
- [ ] Remplacer `setData(storedData || DEFAULT_DATA)` par la logique à 3 niveaux
- [ ] Appeler `markAsInitialized()` lors du premier chargement des données par défaut
- [ ] Retirer la condition `data.length > 0` de la sauvegarde automatique
- [ ] Tester les 3 scénarios (nouvelle install, données existantes, tableau vide)
- [ ] Documenter le comportement dans les commentaires

---

## 🚨 Points d'Attention

### 1. Ne PAS Modifier la Sauvegarde Automatique

**Avant (v3.0) - PROBLÉMATIQUE**:
```javascript
useEffect(() => {
  if (!loading && suppliers.length > 0) { // ← Problème ici
    saveOpexData(suppliers);
  }
}, [suppliers, loading]);
```

**Après (v3.1) - CORRECT**:
```javascript
useEffect(() => {
  if (!loading) { // ← Pas de condition sur length
    saveOpexData(suppliers); // Sauvegarder même si []
  }
}, [suppliers, loading]);
```

**Raison**: Si on ne sauvegarde pas `[]`, la prochaine fois on ne saura pas que l'utilisateur a vidé volontairement.

### 2. Fonction `resetToDefaults()` Toujours Disponible

```javascript
const resetToDefaults = useCallback(() => {
  setSuppliers(DEFAULT_OPEX_DATA);
  setError(null);
}, []);
```

**Usage**: Permet à l'utilisateur de réinitialiser manuellement aux données par défaut.

### 3. Version Stockée

```javascript
const CURRENT_VERSION = '3.1.0';

// À chaque sauvegarde
export const saveOpexData = (data) => {
  saveData(STORAGE_KEYS.VERSION, CURRENT_VERSION); // ← Mise à jour version
  return saveData(STORAGE_KEYS.OPEX, data);
};
```

**Utilité**: Permet de savoir quelle version a écrit les données (utile pour migrations futures).

---

## 📖 Documentation Associée

- [MIGRATION.md](MIGRATION.md) - Guide complet de migration
- [CHANGELOG.md](CHANGELOG.md) - Historique des changements
- [README.md](README.md) - Vue d'ensemble du projet
- [ARCHITECTURE.md](ARCHITECTURE.md) - Architecture technique

---

**Version**: 3.1.0
**Auteur**: Alex - Deputy Director of Information Systems
**Date**: Février 2026
