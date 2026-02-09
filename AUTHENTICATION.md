# Guide d'Authentification - Hospifinance v3.0+

## 📋 Vue d'ensemble

Hospifinance v3.0 introduit un système d'authentification complet avec gestion multi-utilisateurs, rôles et permissions, et audit trail. Ce guide détaille l'implémentation, l'utilisation et l'administration du système.

---

## 🏗️ Architecture

### Composants Principaux

| Composant | Rôle | Fichier |
|-----------|------|---------|
| **AuthContext** | Gestion état authentification | [src/contexts/AuthContext.jsx](src/contexts/AuthContext.jsx) |
| **LoginPage** | Interface de connexion | [src/components/auth/LoginPage.jsx](src/components/auth/LoginPage.jsx) |
| **authUtils** | Utilitaires crypto (SHA-256) | [src/utils/authUtils.js](src/utils/authUtils.js) |
| **storageService** | Persistence (LocalStorage) | [src/services/storageService.js](src/services/storageService.js) |

### Flux d'Authentification

```
1. LoginPage → Saisie username/password
       ↓
2. authUtils.hashPassword(password) → Hash SHA-256
       ↓
3. AuthContext.login(username, hash)
       ↓
4. Vérification dans users[] (LocalStorage)
       ↓
5. Si OK → Création session + Log
       ↓
6. localStorage: hospifinance_auth_session
       ↓
7. AuthContext.user mis à jour → App render
```

---

## 👥 Rôles et Permissions

### Hiérarchie des Rôles

```
superadmin (admin uniquement)
    ↓
   admin (utilisateurs admin)
    ↓
   user (utilisateurs standards)
```

### Tableau des Permissions

| Action | superadmin | admin | user |
|--------|------------|-------|------|
| **Visualisation budgets** | ✅ | ✅ | ✅ |
| **Création/Édition budgets** | ✅ | ✅ | ❌ |
| **Suppression budgets** | ✅ | ✅ | ❌ |
| **Export données** | ✅ | ✅ | ✅ |
| **Accès paramètres** | ✅ | ✅ | ⚠️ Limité |
| **Créer utilisateurs** | ✅ | ✅ | ❌ |
| **Supprimer utilisateurs** | ✅ | ✅* | ❌ |
| **Désactiver comptes** | ✅ | ✅* | ❌ |
| **Changer mots de passe** | ✅ | ✅* | ❌ |
| **Voir logs audit** | ✅ | ✅ | ❌ |
| **Purger logs** | ✅ | ✅ | ❌ |
| **Modifier admin principal** | ✅ | ❌ | ❌ |

**Note**: Les admins ne peuvent pas modifier/supprimer le compte superadmin ni d'autres comptes admin.

---

## 🔐 Sécurité

### Hashage des Mots de Passe

**Algorithme**: SHA-256 via Web Crypto API (natif browser)

```javascript
// authUtils.js
export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
```

**Caractéristiques**:
- Hash unidirectionnel (non réversible)
- 64 caractères hexadécimaux
- Pas de salt (à améliorer en production avec backend)
- Asynchrone (non-bloquant)

### Stockage Sécurisé

**LocalStorage Keys**:
```
hospifinance_auth_users     → Liste utilisateurs (id, username, hash, role, disabled)
hospifinance_auth_session   → Session active (user, timestamp)
hospifinance_auth_logs      → Journal audit (max 200 entrées)
```

**Structure Utilisateur**:
```javascript
{
  id: "unique-timestamp-random",
  username: "john.doe",
  passwordHash: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
  role: "admin", // ou "user" ou "superadmin"
  disabled: false,
  createdAt: "2026-02-09T10:30:00.000Z"
}
```

### Session Management

**Création de Session**:
```javascript
// À la connexion
{
  user: { id, username, role, disabled },
  timestamp: Date.now()
}
```

**Auto-Restauration**:
- Au chargement de l'app, vérification de la session
- Si session valide → Auto-connexion
- Pas d'expiration automatique (jusqu'à logout manuel)

---

## 🚀 Utilisation

### Connexion Initiale

**Identifiants par défaut**:
- Username: `admin`
- Password: `admin`
- Rôle: `superadmin`

**⚠️ Important**: Changer immédiatement en production !

### Créer un Utilisateur

1. Se connecter avec un compte admin/superadmin
2. Ouvrir les paramètres (`Ctrl+Shift+P` ou triple-clic sur titre)
3. Aller dans l'onglet **Utilisateurs**
4. Cliquer sur **Ajouter un utilisateur**
5. Remplir le formulaire:
   - **Nom d'utilisateur** (requis, unique)
   - **Mot de passe** (minimum 4 caractères)
   - **Rôle** (user/admin/superadmin)
6. Cliquer sur **Créer**

**Validation**:
- Username unique (vérification automatique)
- Password minimum 4 caractères
- Le nouveau compte est immédiatement actif

### Désactiver un Compte

**Sans suppression**:
1. Paramètres → Onglet Utilisateurs
2. Trouver l'utilisateur dans la liste
3. Cliquer sur **Désactiver** (ou **Activer** si déjà désactivé)

**Effet**:
- L'utilisateur ne peut plus se connecter
- Les données sont préservées
- Le compte peut être réactivé à tout moment

**Icône**: 🔴 Rouge = Désactivé

### Supprimer un Compte

**Suppression définitive**:
1. Paramètres → Onglet Utilisateurs
2. Trouver l'utilisateur
3. Cliquer sur le bouton 🗑️ **Supprimer**
4. Confirmer la suppression

**⚠️ Attention**:
- Suppression irréversible
- Le compte `admin` (superadmin) ne peut PAS être supprimé
- Les admins ne peuvent pas supprimer d'autres admins

### Changer un Mot de Passe

**Par un administrateur**:
1. Paramètres → Onglet Utilisateurs
2. Trouver l'utilisateur
3. Cliquer sur 🔑 **Changer le mot de passe**
4. Saisir le nouveau mot de passe
5. Confirmer

**Effet**:
- Le nouveau mot de passe est hashé et sauvegardé
- L'utilisateur doit se reconnecter
- Un log d'audit est créé

---

## 📜 Journal d'Audit (Logs)

### Types de Logs

| Type | Description | Icône |
|------|-------------|-------|
| `login_success` | Connexion réussie | ✅ |
| `login_failed` | Échec de connexion | ❌ |
| `logout` | Déconnexion | 🚪 |
| `account_disabled` | Compte désactivé | 🔴 |
| `account_enabled` | Compte réactivé | 🟢 |

### Structure d'un Log

```javascript
{
  id: "unique-timestamp",
  type: "login_success",
  username: "john.doe",
  timestamp: "2026-02-09T10:30:00.000Z",
  ip: "192.168.1.100", // Si disponible
  details: "Additional info"
}
```

### Consulter les Logs

1. Se connecter en tant qu'admin/superadmin
2. Ouvrir les paramètres (`Ctrl+Shift+P`)
3. Aller dans l'onglet **Logs**
4. Voir les 200 derniers logs (du plus récent au plus ancien)

**Informations affichées**:
- Type d'événement avec icône colorée
- Nom d'utilisateur
- Date et heure formatée
- Détails supplémentaires si disponibles

### Purger les Logs

**Action**: Supprimer tous les logs du journal

1. Onglet Logs → Cliquer sur **Purger les logs**
2. Confirmer la suppression
3. Les logs sont effacés de LocalStorage

**⚠️ Action irréversible** !

---

## 🔧 Développement

### AuthContext API

#### Hook d'Utilisation

```javascript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const {
    user,           // Utilisateur connecté (null si non connecté)
    users,          // Liste de tous les utilisateurs
    authLogs,       // Logs d'authentification
    loading,        // État de chargement
    isAdmin,        // Boolean: role = admin ou superadmin
    isSuperAdmin,   // Boolean: role = superadmin
    login,          // Fonction de connexion
    logout,         // Fonction de déconnexion
    addUser,        // Ajouter un utilisateur
    deleteUser,     // Supprimer un utilisateur
    toggleUserDisabled, // Activer/Désactiver
    changePassword, // Changer mot de passe
    clearLogs       // Purger les logs
  } = useAuth();

  // Utilisation...
}
```

#### Méthodes Principales

**login(username, password)**
```javascript
const result = await login('john.doe', 'mypassword');
if (result.success) {
  // Connexion réussie
} else {
  console.error(result.error); // "Identifiants incorrects"
}
```

**logout()**
```javascript
logout();
// Efface la session, log d'audit créé
```

**addUser(username, password, role)**
```javascript
const result = await addUser('jane.doe', 'password123', 'admin');
if (result.success) {
  console.log('Utilisateur créé:', result.user);
} else {
  console.error(result.error); // "Nom d'utilisateur déjà utilisé"
}
```

**deleteUser(userId)**
```javascript
const result = deleteUser('user-id-123');
if (result.success) {
  console.log('Utilisateur supprimé');
} else {
  console.error(result.error); // "Impossible de supprimer cet utilisateur"
}
```

**toggleUserDisabled(userId)**
```javascript
toggleUserDisabled('user-id-123');
// Inverse l'état disabled, log créé
```

**changePassword(userId, newPassword)**
```javascript
const result = await changePassword('user-id-123', 'newpassword456');
if (result.success) {
  console.log('Mot de passe modifié');
}
```

**clearLogs()**
```javascript
clearLogs();
// Efface tous les logs d'audit
```

### Protection de Routes/Composants

**Exemple**: Afficher un composant uniquement pour admins

```javascript
function SettingsPanel() {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return <div>Accès refusé. Droits administrateur requis.</div>;
  }

  return <div>Panneau d'administration...</div>;
}
```

**Exemple**: Conditionner une action

```javascript
function UserManagement() {
  const { user, isSuperAdmin, deleteUser } = useAuth();

  const handleDelete = (targetUser) => {
    // Empêcher admins de supprimer d'autres admins
    if (targetUser.role === 'admin' && !isSuperAdmin) {
      alert('Vous ne pouvez pas supprimer un administrateur');
      return;
    }
    deleteUser(targetUser.id);
  };

  return (
    // UI...
  );
}
```

---

## 🚨 Limitations & Améliorations Futures

### Limitations Actuelles (v3.0/3.1)

1. **Stockage client-side**: LocalStorage non chiffré
2. **Pas de salt**: Hash SHA-256 sans salt personnalisé
3. **Pas d'expiration session**: Session illimitée jusqu'à logout
4. **Pas de limitation tentatives**: Aucun rate-limiting
5. **Pas de 2FA**: Authentification simple username/password
6. **Pas de récupération MDP**: Impossible de récupérer un mot de passe oublié
7. **Pas d'historique complet**: Logs limités à 200 entrées

### Roadmap v4.0+ (avec Backend)

- [ ] **Backend API** (Node.js + PostgreSQL)
- [ ] **JWT Authentication** - Token sécurisé avec expiration
- [ ] **Bcrypt/Argon2** - Hash avec salt automatique
- [ ] **Rate Limiting** - Protection contre brute-force
- [ ] **2FA/TOTP** - Authentification à deux facteurs
- [ ] **Récupération MDP** - Email avec token temporaire
- [ ] **Audit trail complet** - Base de données avec historique illimité
- [ ] **Permissions granulaires** - Contrôle d'accès par fonctionnalité
- [ ] **Sessions multi-device** - Gestion des sessions actives
- [ ] **OAuth/SSO** - Intégration Active Directory, Google, etc.

---

## 🛡️ Bonnes Pratiques

### Pour les Administrateurs

1. ✅ Changer le mot de passe `admin` par défaut immédiatement
2. ✅ Créer des comptes individuels (ne pas partager admin)
3. ✅ Utiliser des mots de passe robustes (12+ caractères, mixte)
4. ✅ Désactiver les comptes au lieu de les supprimer (traçabilité)
5. ✅ Vérifier régulièrement les logs d'audit
6. ✅ Limiter les droits superadmin (1-2 comptes max)
7. ✅ Former les utilisateurs sur les bonnes pratiques sécurité

### Pour les Développeurs

1. ✅ Ne jamais logger les mots de passe en clair
2. ✅ Valider les entrées côté client ET serveur (future backend)
3. ✅ Utiliser HTTPS en production
4. ✅ Limiter les informations d'erreur (pas de détails techniques)
5. ✅ Implémenter un rate-limiting pour le backend
6. ✅ Auditer les actions sensibles (création/suppression utilisateurs)
7. ✅ Tester les permissions pour chaque rôle

---

## 📚 Références Techniques

### Fichiers Concernés

- [src/contexts/AuthContext.jsx](src/contexts/AuthContext.jsx) - Contexte principal (250 lignes)
- [src/components/auth/LoginPage.jsx](src/components/auth/LoginPage.jsx) - Interface login (120 lignes)
- [src/utils/authUtils.js](src/utils/authUtils.js) - Utilitaires crypto (30 lignes)
- [src/services/storageService.js](src/services/storageService.js) - Fonctions persistence

### Dépendances

**Aucune dépendance externe** - Le système utilise uniquement les APIs natives du navigateur:
- `window.localStorage` - Stockage persistant
- `crypto.subtle.digest()` - Hashage SHA-256
- `TextEncoder` - Encodage UTF-8

### Standards Web

- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [LocalStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [SHA-256 Algorithm](https://en.wikipedia.org/wiki/SHA-2)

---

## ❓ FAQ

**Q: Puis-je récupérer un mot de passe oublié ?**
R: Non, les mots de passe sont hashés (non réversibles). Un admin doit réinitialiser le mot de passe.

**Q: Le compte admin peut-il être supprimé ?**
R: Non, le compte superadmin par défaut est protégé contre la suppression.

**Q: Combien de tentatives de connexion sont autorisées ?**
R: Illimité actuellement (pas de rate-limiting en v3.0/3.1).

**Q: Les sessions expirent-elles automatiquement ?**
R: Non, la session persiste jusqu'à un logout manuel ou effacement du LocalStorage.

**Q: Comment changer mon propre mot de passe ?**
R: Actuellement, seuls les admins peuvent changer les mots de passe (fonctionnalité v4.0 prévue).

**Q: Les logs sont-ils sécurisés ?**
R: Ils sont stockés en LocalStorage (non chiffré). Pour une sécurité accrue, migrer vers un backend.

**Q: Peut-on utiliser des caractères spéciaux dans les usernames ?**
R: Oui, mais éviter les caractères `<>` (sanitization automatique).

---

**Version**: 3.1
**Dernière mise à jour**: Février 2026
**Contact**: Consulter [README.md](README.md) pour support
