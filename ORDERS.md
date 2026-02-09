# Guide de Gestion des Commandes - Hospifinance v3.0+

## 📋 Vue d'ensemble

Hospifinance v3.0 introduit un système complet de gestion des commandes avec suivi du cycle de vie, impact budgétaire automatique, et tables dédiées pour OPEX et CAPEX. Ce guide explique le fonctionnement, l'utilisation et l'intégration du système.

---

## 🏗️ Architecture

### Composants Principaux

| Composant | Rôle | Fichier |
|-----------|------|---------|
| **OrderTable** | Affichage liste commandes | [src/components/orders/OrderTable.jsx](src/components/orders/OrderTable.jsx) |
| **OrderModal** | Formulaire ajout/édition | [src/components/orders/OrderModal.jsx](src/components/orders/OrderModal.jsx) |
| **useOrderData** | Hook gestion état | [src/hooks/useOrderData.js](src/hooks/useOrderData.js) |
| **orderCalculations** | Calculs impact budgétaire | [src/utils/orderCalculations.js](src/utils/orderCalculations.js) |
| **orderConstants** | Constantes statuts | [src/constants/orderConstants.js](src/constants/orderConstants.js) |

### Flux de Données

```
1. Création Commande
   OrderModal → Validation → useOrderData.addOrder()
             → LocalStorage → State update → Re-render

2. Calcul Impact Budgétaire
   Order Status → orderCalculations.computeOrderImpact()
               → { engagement, depense } par parent
               → Agrégation dans OpexTable/CapexTable

3. Mise à Jour Budget Parent
   Orders changes → useBudgetCalculations (useMemo)
                 → Recalcul Disponible = Budget - Depense - Engagement
                 → Display BudgetCard avec nouveau %
```

---

## 📦 Cycle de Vie des Commandes

### Les 6 Statuts

```
┌─────────────┐
│ En attente  │ → Commande en préparation (aucun impact budgétaire)
└──────┬──────┘
       ↓
┌─────────────┐
│ Commandée   │ → Bon de commande émis (impact = ENGAGEMENT)
└──────┬──────┘
       ↓
┌─────────────┐
│  Livrée     │ → Réception physique (impact = ENGAGEMENT)
└──────┬──────┘
       ↓
┌─────────────┐
│  Facturée   │ → Facture reçue (impact = DÉPENSE, engagement effacé)
└──────┬──────┘
       ↓
┌─────────────┐
│   Payée     │ → Paiement effectué (impact = DÉPENSE)
└──────┬──────┘

       OU

┌─────────────┐
│  Annulée    │ → Commande annulée (aucun impact budgétaire)
└─────────────┘
```

### Impact Budgétaire par Statut

| Statut | Impact Budget | Type | Explications |
|--------|---------------|------|--------------|
| **En attente** | ❌ Aucun | - | Commande en préparation interne |
| **Commandée** | ✅ Engagement | Engagement | Fonds réservés (BC émis) |
| **Livrée** | ✅ Engagement | Engagement | Fonds toujours réservés |
| **Facturée** | ✅ Dépense | Dépense | Passage engagement → dépense |
| **Payée** | ✅ Dépense | Dépense | Confirmation paiement |
| **Annulée** | ❌ Aucun | - | Commande annulée |

### Calcul du Budget Disponible

```javascript
// Budget Disponible = Budget Total - Dépenses Réelles - Engagements

Disponible = budgetTotal - depense - engagement

Exemples:
- Budget: 100 000 €
- Dépense: 30 000 € (commandes payées/facturées)
- Engagement: 20 000 € (commandes commandées/livrées)
→ Disponible = 100 000 - 30 000 - 20 000 = 50 000 €

Taux d'utilisation = (depense + engagement) / budget * 100
                   = (30 000 + 20 000) / 100 000 * 100 = 50%
```

---

## 🎨 Interface Utilisateur

### Onglets Commandes

**5 onglets dans TabNavigation**:
1. Vue d'ensemble (Dashboard)
2. OPEX (Fournisseurs)
3. CAPEX (Projets)
4. **Commandes OPEX** ← Nouveau v3.0
5. **Commandes CAPEX** ← Nouveau v3.0

### Table des Commandes

**Colonnes affichées**:
- **Fournisseur/Projet** - Nom du parent
- **Description** - Détails de la commande
- **Montant** - Montant en euros (formaté)
- **Statut** - Badge coloré selon l'état
- **Date Commande** - Date d'émission BC
- **Date Facture** - Date de facturation
- **Référence** - Numéro BC/Facture
- **Actions** - Éditer / Supprimer

**Badges de Statut**:
- 🟡 **En attente** - Gris clair
- 🔵 **Commandée** - Bleu
- 🟣 **Livrée** - Violet
- 🟠 **Facturée** - Orange
- 🟢 **Payée** - Vert
- 🔴 **Annulée** - Rouge

### Formulaire de Commande

**Champs du formulaire**:

| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| **Fournisseur/Projet** | Select | ✅ | Parent de la commande |
| **Description** | TextArea | ✅ | Détails (produit, service, etc.) |
| **Montant** | Number | ✅ | Montant en € (> 0) |
| **Statut** | Select | ✅ | 1 des 6 statuts disponibles |
| **Date Commande** | Date | ❌ | Date d'émission du BC |
| **Date Facture** | Date | ❌ | Date de réception facture |
| **Référence** | Text | ❌ | Numéro BC ou facture |
| **Notes** | TextArea | ❌ | Informations complémentaires |

**Validation**:
- Parent requis (sélection dans la liste)
- Description non vide
- Montant > 0
- Statut requis
- Messages d'erreur en rouge sous chaque champ

---

## 🚀 Utilisation

### Créer une Commande OPEX

**Scénario**: Commander une licence Microsoft Office

1. Onglet **Commandes OPEX**
2. Cliquer sur **Nouvelle commande**
3. Remplir le formulaire:
   - **Fournisseur**: Microsoft
   - **Description**: Licences Office 365 E3 (10 licences)
   - **Montant**: 1 500 €
   - **Statut**: En attente
   - **Référence**: (vide pour l'instant)
   - **Notes**: Renouvellement annuel
4. Cliquer sur **Enregistrer**

**Résultat**:
- Commande créée avec statut "En attente"
- Aucun impact sur le budget Microsoft (encore)
- Visible dans la table Commandes OPEX

### Mettre à Jour le Statut

**Scénario**: Le BC a été émis

1. Dans la table, cliquer sur ✏️ **Éditer** pour la commande
2. Modifier:
   - **Statut**: Commandée
   - **Date Commande**: 2026-02-09
   - **Référence**: BC-2026-001
3. Cliquer sur **Enregistrer**

**Résultat**:
- Statut change en "Commandée" (badge bleu)
- **Impact budget**: 1 500 € ajoutés en **Engagement**
- Budget disponible Microsoft diminue de 1 500 €
- Taux d'utilisation recalculé automatiquement

### Passer en Facturée

**Scénario**: Facture reçue

1. Éditer la commande à nouveau
2. Modifier:
   - **Statut**: Facturée
   - **Date Facture**: 2026-02-15
   - **Référence**: FACT-MS-2026-042
3. Enregistrer

**Résultat**:
- Statut change en "Facturée" (badge orange)
- **Impact budget**: Bascule de Engagement → Dépense
- Engagement: -1 500 €
- Dépense: +1 500 €
- Budget disponible reste inchangé (toujours réservé)

### Annuler une Commande

**Scénario**: Commande annulée avant livraison

1. Éditer la commande
2. **Statut**: Annulée
3. Enregistrer

**Résultat**:
- Statut change en "Annulée" (badge rouge)
- **Impact budget**: Tout impact supprimé
- Les 1 500 € redeviennent disponibles
- Budget disponible augmente

### Supprimer une Commande

**⚠️ Action définitive**

1. Dans la table, cliquer sur 🗑️ **Supprimer**
2. Confirmer la suppression dans le dialogue

**Résultat**:
- Commande supprimée de la base
- Impact budgétaire retiré
- Irréversible

---

## 📊 Impact sur les Budgets

### Exemple Détaillé - Fournisseur OPEX

**Fournisseur**: Microsoft
**Budget Annuel**: 300 000 €

**Commandes**:
1. Licences Office 365 - 10 000 € - **Payée**
2. Azure Cloud - 5 000 € - **Facturée**
3. Serveurs Windows - 20 000 € - **Commandée**
4. Support Premium - 15 000 € - **Livrée**
5. Formation - 8 000 € - **En attente**

**Calculs**:
```
Dépense = Commandes (Payée + Facturée)
        = 10 000 + 5 000 = 15 000 €

Engagement = Commandes (Commandée + Livrée)
           = 20 000 + 15 000 = 35 000 €

Disponible = Budget - Dépense - Engagement
           = 300 000 - 15 000 - 35 000 = 250 000 €

Taux = (Dépense + Engagement) / Budget * 100
     = (15 000 + 35 000) / 300 000 * 100 = 16,67%
```

**Affichage dans OpexTable**:
- **Budget Annuel**: 300 000 €
- **Dépense**: 15 000 €
- **Engagement**: 35 000 €
- **Disponible**: 250 000 € (vert, car < 75%)
- **Taux**: 16,67% (barre verte)

### Exemple - Projet CAPEX

**Projet**: Renouvellement Datacenter
**Budget Total**: 2 000 000 €

**Commandes**:
1. Serveurs Dell - 500 000 € - **Payée**
2. Switches Cisco - 200 000 € - **Facturée**
3. Câblage - 100 000 € - **Livrée**
4. Installation - 150 000 € - **Commandée**
5. Formation - 50 000 € - **En attente**

**Calculs**:
```
Dépense = 500 000 + 200 000 = 700 000 €
Engagement = 100 000 + 150 000 = 250 000 €
Disponible = 2 000 000 - 700 000 - 250 000 = 1 050 000 €
Taux = (700 000 + 250 000) / 2 000 000 * 100 = 47,5%
```

---

## 🔧 Développement

### Hook useOrderData

**Signature**:
```javascript
const {
  orders,          // Array des commandes
  addOrder,        // Ajouter une commande
  updateOrder,     // Mettre à jour
  deleteOrder      // Supprimer
} = useOrderData(type); // type = 'opex' ou 'capex'
```

**Exemple d'utilisation**:
```javascript
import { useOrderData } from '../hooks/useOrderData';

function OrdersOpexTab() {
  const { orders, addOrder, updateOrder, deleteOrder } = useOrderData('opex');

  const handleAdd = (orderData) => {
    addOrder(orderData);
  };

  return (
    <div>
      {orders.map(order => (
        <div key={order.id}>{order.description}</div>
      ))}
    </div>
  );
}
```

### Structure de Données

**Objet Commande**:
```javascript
{
  id: "1707478920123-0.123456789", // Unique
  parentId: "supplier-or-project-id", // Lien parent
  description: "Licences Office 365",
  montant: 10000, // En euros (number)
  status: "Commandée", // Clé ORDER_STATUS
  dateCommande: "2026-02-09", // ISO date string (YYYY-MM-DD)
  dateFacture: "2026-02-15", // ISO date string
  reference: "BC-2026-001", // Numéro BC/Facture
  notes: "Renouvellement annuel" // Informations additionnelles
}
```

### Fonctions de Calcul

**orderCalculations.js**

#### computeOrderImpact(orders)

Calcule l'impact total d'une liste de commandes.

```javascript
import { computeOrderImpact } from '../utils/orderCalculations';

const orders = [
  { status: 'Commandée', montant: 10000 },
  { status: 'Facturée', montant: 5000 },
  { status: 'En attente', montant: 2000 }
];

const impact = computeOrderImpact(orders);
// { engagement: 10000, depense: 5000 }
```

#### computeOrderImpactByParent(orders)

Calcule l'impact par fournisseur/projet.

```javascript
import { computeOrderImpactByParent } from '../utils/orderCalculations';

const orders = [
  { parentId: 'supplier-1', status: 'Commandée', montant: 10000 },
  { parentId: 'supplier-1', status: 'Payée', montant: 5000 },
  { parentId: 'supplier-2', status: 'Livrée', montant: 8000 }
];

const impactByParent = computeOrderImpactByParent(orders);
// {
//   'supplier-1': { engagement: 10000, depense: 5000 },
//   'supplier-2': { engagement: 8000, depense: 0 }
// }
```

#### computeTotalOrderImpact(orders)

Alias de `computeOrderImpact` pour cohérence API.

### Constantes

**orderConstants.js**

```javascript
export const ORDER_STATUS = {
  PENDING: 'En attente',
  ORDERED: 'Commandée',
  DELIVERED: 'Livrée',
  INVOICED: 'Facturée',
  PAID: 'Payée',
  CANCELLED: 'Annulée'
};

export const ORDER_IMPACT = {
  'En attente': null,
  'Commandée': 'engagement',
  'Livrée': 'engagement',
  'Facturée': 'depense',
  'Payée': 'depense',
  'Annulée': null
};

export const ORDER_STATUS_COLORS = {
  'En attente': 'bg-gray-100 text-gray-800',
  'Commandée': 'bg-blue-100 text-blue-800',
  'Livrée': 'bg-purple-100 text-purple-800',
  'Facturée': 'bg-orange-100 text-orange-800',
  'Payée': 'bg-green-100 text-green-800',
  'Annulée': 'bg-red-100 text-red-800'
};

export const ORDER_STATUS_LIST = Object.values(ORDER_STATUS);
```

### Validation

**validators.js - validateOrderData()**

```javascript
import { validateOrderData } from '../utils/validators';

const orderData = {
  parentId: 'supplier-123',
  description: 'Licences Office',
  montant: 10000,
  status: 'Commandée'
};

const { isValid, errors } = validateOrderData(orderData);

if (!isValid) {
  console.error('Erreurs:', errors);
  // ['Description requise', 'Montant doit être supérieur à 0', ...]
}
```

**Règles de validation**:
- `parentId` requis
- `description` requise et non vide
- `montant` requis et > 0
- `status` requis
- `dateCommande` optionnelle (format date valide si fournie)
- `dateFacture` optionnelle (format date valide si fournie)

---

## 💾 Persistence

### LocalStorage Keys

```
hospifinance_opex_orders     → Commandes OPEX (array)
hospifinance_capex_orders    → Commandes CAPEX (array)
```

### Chargement Initial

Au montage du hook `useOrderData`:
1. Lecture de la clé correspondante (`opex_orders` ou `capex_orders`)
2. Parsing JSON
3. Initialisation du state `orders`

### Sauvegarde Automatique

À chaque modification (add/update/delete):
1. Mise à jour du state `orders`
2. Sauvegarde immédiate dans LocalStorage via `storageService`
3. Recalcul des impacts budgétaires

**Exemple**:
```javascript
// Dans useOrderData.js
const addOrder = (orderData) => {
  const newOrder = { id: generateId(), ...orderData };
  const updatedOrders = [...orders, newOrder];
  setOrders(updatedOrders);
  storageService.saveOpexOrders(updatedOrders); // Sauvegarde auto
};
```

---

## 📈 Cas d'Usage Avancés

### Scénario 1: Suivi Budget Annuel

**Contexte**: Suivre l'évolution budgétaire d'un fournisseur sur l'année

**Étapes**:
1. Créer toutes les commandes prévues en statut "En attente"
2. Au fur et à mesure des BCs émis, passer en "Commandée"
3. À réception, passer en "Livrée"
4. À facturation, passer en "Facturée"
5. Après paiement, passer en "Payée"

**Avantage**: Vision en temps réel de l'engagement vs dépense réelle

### Scénario 2: Prévision de Fin d'Année

**Contexte**: Anticiper les dépenses du dernier trimestre

**Méthode**:
1. Lister toutes les commandes "En attente" et "Commandée"
2. Calculer le total potentiel:
   ```
   Prévision = Dépense actuelle + Engagements + Commandes en attente
   ```
3. Comparer au budget annuel pour ajuster

### Scénario 3: Audit d'un Projet CAPEX

**Contexte**: Vérifier toutes les dépenses d'un projet

**Méthode**:
1. Onglet "Commandes CAPEX"
2. Filtrer visuellement par nom du projet (dans la colonne Projet)
3. Exporter en CSV pour analyse Excel:
   - Colonne Montant → Total dépensé
   - Colonne Statut → Répartition par état
   - Dates → Timeline du projet

### Scénario 4: Gestion Multi-Devises (Future)

**Limitation actuelle**: Toutes les commandes en euros

**Solution v4.0**:
- Ajouter champ `devise` (EUR, USD, GBP, etc.)
- Ajouter champ `tauxChange` (taux de conversion)
- Calculer montant en euros via API de change
- Afficher montant original + converti

---

## 🚨 Limitations & Améliorations Futures

### Limitations Actuelles (v3.0/3.1)

1. **Pas de pièces jointes** - Impossible de joindre BC/Factures PDF
2. **Pas de workflow approbation** - Validation manuelle des commandes
3. **Pas d'historique versions** - Modifications non tracées
4. **Pas de notifications** - Aucune alerte sur changements de statut
5. **Pas de recherche/filtres** - Filtrage manuel dans la table
6. **Pas de multi-devises** - Uniquement euros
7. **Pas d'intégration ERP** - Saisie manuelle

### Roadmap v4.0+

- [ ] **Upload fichiers** - Pièces jointes BC/Factures (PDF, images)
- [ ] **Workflow approbation** - Validation à plusieurs niveaux
- [ ] **Historique complet** - Audit trail des modifications
- [ ] **Notifications email** - Alertes sur changements de statut
- [ ] **Recherche avancée** - Filtres par montant, date, statut, etc.
- [ ] **Multi-devises** - Support EUR/USD/GBP avec conversion
- [ ] **Intégration ERP** - Import/Export SAP, Oracle Financials
- [ ] **Tableau de bord** - Graphiques spécifiques aux commandes
- [ ] **Rapports automatiques** - Export PDF formaté mensuel
- [ ] **Mobile app** - Scan factures avec OCR

---

## 📚 Références Techniques

### Fichiers Concernés

- [src/components/orders/OrderTable.jsx](src/components/orders/OrderTable.jsx) - Table générique (180 lignes)
- [src/components/orders/OrderModal.jsx](src/components/orders/OrderModal.jsx) - Formulaire (250 lignes)
- [src/hooks/useOrderData.js](src/hooks/useOrderData.js) - Hook gestion (150 lignes)
- [src/utils/orderCalculations.js](src/utils/orderCalculations.js) - Calculs (80 lignes)
- [src/constants/orderConstants.js](src/constants/orderConstants.js) - Constantes (40 lignes)
- [src/utils/validators.js](src/utils/validators.js) - Validation orders (30 lignes)

### Dépendances

**Aucune dépendance externe** - Utilisation uniquement de:
- React hooks (`useState`, `useEffect`)
- LocalStorage API
- Composants communs internes (Button, Modal, Input)

### Intégration avec Autres Modules

**OpexTable / CapexTable**:
```javascript
// Récupération des commandes
const { orders: opexOrders } = useOrderData('opex');

// Calcul impact par fournisseur
const impactBySupplier = computeOrderImpactByParent(opexOrders);

// Intégration dans affichage budget
suppliers.map(supplier => {
  const impact = impactBySupplier[supplier.id] || { engagement: 0, depense: 0 };
  const disponible = supplier.budgetAnnuel - impact.depense - impact.engagement;
  // ...
});
```

---

## ❓ FAQ

**Q: Puis-je avoir plusieurs commandes en "En attente" pour le même fournisseur ?**
R: Oui, il n'y a pas de limite. Elles n'auront aucun impact budgétaire tant qu'elles ne sont pas "Commandées".

**Q: Que se passe-t-il si je change une commande de "Facturée" à "Commandée" ?**
R: L'impact budgétaire bascule de Dépense → Engagement. Le budget disponible reste inchangé.

**Q: Puis-je supprimer une commande "Payée" ?**
R: Oui, mais c'est déconseillé. Préférer passer en "Annulée" pour garder une trace.

**Q: Comment exporter les commandes ?**
R: Actuellement, via les boutons CSV/JSON dans les onglets OPEX/CAPEX (exporte fournisseurs + leurs commandes agrégées). Export dédié prévu en v4.0.

**Q: Les dates sont-elles obligatoires ?**
R: Non, seuls description, montant, statut et parent sont requis. Les dates sont optionnelles mais recommandées.

**Q: Peut-on avoir une commande sans référence ?**
R: Oui, le champ "Référence" est optionnel. Utile pour commandes en attente n'ayant pas encore de numéro.

**Q: Combien de commandes puis-je créer ?**
R: Illimité (dans la limite du LocalStorage navigateur, ~5-10 MB).

**Q: Les commandes sont-elles partagées entre utilisateurs ?**
R: Non, le LocalStorage est local au navigateur. Avec un backend (v4.0), elles seront synchronisées.

---

**Version**: 3.1
**Dernière mise à jour**: Février 2026
**Contact**: Consulter [README.md](README.md) pour support
