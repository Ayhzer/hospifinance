# 🚀 Configuration Production - Hospifinance

## ✅ Backend déployé sur Render

### URLs
- **API Production** : https://hospifinance.onrender.com
- **Frontend Production** : https://ayhzer.github.io/hospifinance/
- **MongoDB** : MongoDB Atlas (hébergé)

### Compte par défaut
- **Username** : `admin`
- **Password** : `admin`
- ⚠️ **À FAIRE** : Changer ce mot de passe via l'interface après le premier login

---

## 🔧 Configuration Frontend

### Détection automatique de l'environnement
Le frontend détecte automatiquement l'environnement :
- **En local** (`localhost`) : Utilise `http://localhost:3001/api`
- **En production** (`ayhzer.github.io`) : Utilise `https://hospifinance.onrender.com/api`

### Variables d'environnement

#### `.env` (développement local)
```env
VITE_API_URL=http://localhost:3001/api
```

#### `.env.production` (production)
```env
VITE_API_URL=https://hospifinance.onrender.com/api
```

---

## 📡 Endpoints API

### Authentification
- `POST /api/auth/login` - Connexion (retourne JWT token)
- `POST /api/auth/logout` - Déconnexion
- `GET /api/auth/me` - Informations utilisateur connecté

### Utilisateurs (Admin uniquement)
- `GET /api/users` - Liste des utilisateurs
- `POST /api/users` - Créer un utilisateur
- `PUT /api/users/:id` - Modifier un utilisateur
- `DELETE /api/users/:id` - Supprimer un utilisateur
- `PUT /api/users/:id/password` - Changer le mot de passe

### OPEX
- `GET /api/opex` - Liste des fournisseurs OPEX
- `POST /api/opex` - Créer un fournisseur
- `PUT /api/opex/:id` - Modifier un fournisseur
- `DELETE /api/opex/:id` - Supprimer un fournisseur

### CAPEX
- `GET /api/capex` - Liste des projets CAPEX
- `POST /api/capex` - Créer un projet
- `PUT /api/capex/:id` - Modifier un projet
- `DELETE /api/capex/:id` - Supprimer un projet

### Settings
- `GET /api/settings` - Récupérer les paramètres
- `PUT /api/settings` - Mettre à jour les paramètres
- `POST /api/settings/custom-columns` - Ajouter une colonne personnalisée
- `DELETE /api/settings/custom-columns/:type/:id` - Supprimer une colonne

---

## 🧪 Tester l'API en production

### Avec curl
```bash
# Test de santé
curl https://hospifinance.onrender.com/health

# Login
curl -X POST https://hospifinance.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'

# Récupérer les settings (avec token)
curl https://hospifinance.onrender.com/api/settings \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Avec le navigateur
Ouvrez la console (F12) sur https://ayhzer.github.io/hospifinance/ et tapez :
```javascript
// Voir l'URL de l'API utilisée
console.log(window.location.hostname);
```

---

## 🚀 Déploiement

### Frontend (GitHub Pages)
```bash
# Commit et push
git add .
git commit -m "feat: Configure production API"
git push origin main

# Le déploiement GitHub Pages se fait automatiquement
```

### Backend (Render)
Le backend est déjà déployé et configuré avec :
- ✅ MongoDB Atlas connecté
- ✅ CORS configuré pour `https://ayhzer.github.io`
- ✅ Variables d'environnement sécurisées
- ✅ Auto-déploiement depuis GitHub

---

## ⚠️ Points Importants

### Instance gratuite Render
- **Sommeil après 15 min d'inactivité**
- Premier appel après sommeil : ~30-50 secondes
- Solution : Upgrader vers plan payant ($7/mois) ou accepter le délai

### Sécurité
- ✅ JWT_SECRET généré de manière sécurisée
- ✅ MongoDB URI protégée (masquée)
- ✅ CORS configuré uniquement pour votre domaine
- ⚠️ **À FAIRE** : Changer le mot de passe admin (`admin/admin`)

### Données
- Les données sont stockées dans **MongoDB Atlas** (cloud)
- Accessibles depuis n'importe quel poste
- Sauvegarde automatique MongoDB Atlas

---

## 🐛 Dépannage

### Erreur CORS
Si vous voyez une erreur CORS dans la console :
1. Vérifiez que vous êtes sur `https://ayhzer.github.io/hospifinance/`
2. Vérifiez les logs Render : https://dashboard.render.com
3. Le CORS est configuré pour accepter uniquement `https://ayhzer.github.io`

### API lente ou timeout
- L'instance gratuite s'endort après 15 min
- Premier appel : attendre 30-50 secondes
- Ensuite : normal (~200-500ms)

### Erreur de connexion MongoDB
- Vérifiez les logs sur Render Dashboard
- MongoDB Atlas doit être accessible (whitelist IP 0.0.0.0/0)

### Token expiré
- Les tokens JWT expirent après 7 jours
- Reconnectez-vous pour obtenir un nouveau token

---

## 📊 Monitoring

### Logs Render
https://dashboard.render.com → Services → hospifinance → Logs

### Métriques
- Temps de réponse API
- Utilisation mémoire
- Connexions MongoDB actives

---

## 🔐 Changement du mot de passe admin

**IMPORTANT** : Changez le mot de passe par défaut après le premier déploiement !

1. Connectez-vous avec `admin/admin`
2. Allez dans **Paramétrage** > **Utilisateurs**
3. Cliquez sur le bouton **MDP** pour le compte admin
4. Changez le mot de passe

---

## 📞 Support

En cas de problème :
1. Vérifiez les logs Render
2. Vérifiez la console navigateur (F12)
3. Testez l'API directement avec curl
4. Vérifiez que MongoDB Atlas est accessible
