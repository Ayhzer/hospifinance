# 📦 Migration vers MongoDB - Hospifinance v3.3

## ✅ Ce qui a été créé

### 1. Infrastructure Docker
- ✅ `docker-compose.yml` - Configuration MongoDB + Mongo Express
- ✅ `backend/init-mongo.js` - Script d'initialisation de la base
- ✅ `backend/.env` - Variables d'environnement

### 2. Backend API (Node.js/Express)
- ✅ `backend/server.js` - Serveur Express principal
- ✅ `backend/config/database.js` - Configuration MongoDB
- ✅ `backend/middleware/auth.js` - Authentification JWT
- ✅ `backend/middleware/errorHandler.js` - Gestion des erreurs
- ✅ `backend/routes/auth.js` - Routes d'authentification
- ✅ `backend/routes/users.js` - CRUD utilisateurs
- ✅ `backend/routes/opex.js` - CRUD OPEX
- ✅ `backend/routes/capex.js` - CRUD CAPEX
- ✅ `backend/routes/settings.js` - Gestion des paramètres
- ✅ `backend/package.json` - Dépendances backend
- ✅ `backend/README.md` - Documentation backend

### 3. Frontend - Service API
- ✅ `src/services/apiService.js` - Client API pour remplacer localStorage
- ✅ `.env` - Configuration URL de l'API

### 4. Documentation
- ✅ `QUICKSTART_BACKEND.md` - Guide de démarrage rapide
- ✅ `MIGRATION_MONGODB.md` - Ce fichier

## 🚀 Comment démarrer ?

### Étape 1 : Démarrer MongoDB

Ouvre PowerShell ou CMD dans le dossier `hospifinance` :

```powershell
docker-compose up -d
```

Vérification :
```powershell
docker ps
```

Tu devrais voir 2 conteneurs :
- `hospifinance-mongodb` (port 27017)
- `hospifinance-mongo-express` (port 8081)

### Étape 2 : Installer les dépendances du backend

```powershell
cd backend
npm install
```

### Étape 3 : Démarrer l'API

```powershell
npm run dev
```

L'API sera accessible sur : http://localhost:3001

### Étape 4 : Tester l'API

Test de connexion :
```powershell
curl http://localhost:3001/health
```

Test de login :
```powershell
curl -X POST http://localhost:3001/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"username":"admin","password":"admin"}'
```

## 📊 Accès à Mongo Express

Interface web pour gérer MongoDB :
- URL : http://localhost:8081
- Username : `admin`
- Password : `admin`

## 🔄 Prochaines étapes

### Pour migration complète :

1. **Modifier les contexts** pour utiliser `apiService` au lieu de `storageService`
   - AuthContext.jsx
   - SettingsContext.jsx
   - useOpexData.js
   - useCapexData.js

2. **Créer un script de migration** des données localStorage vers MongoDB

3. **Tester l'application** avec le backend

4. **Déployer** le backend en production

## 🔧 Modification des contexts (à faire)

### AuthContext.jsx
Remplacer les appels localStorage par :
```javascript
import * as api from '../services/apiService';

const login = async (username, password) => {
  const data = await api.login(username, password);
  setUser(data.user);
};
```

### SettingsContext.jsx
```javascript
import * as api from '../services/apiService';

const loadSettings = async () => {
  const settings = await api.getSettings();
  setSettings(settings);
};
```

### useOpexData.js
```javascript
import * as api from '../services/apiService';

const loadData = async () => {
  const suppliers = await api.getOpex();
  setSuppliers(suppliers);
};

const addSupplier = async (data) => {
  const newSupplier = await api.createOpex(data);
  setSuppliers(prev => [...prev, newSupplier]);
};
```

## 🐛 Dépannage

### MongoDB ne démarre pas
```powershell
# Vérifier les logs
docker logs hospifinance-mongodb

# Redémarrer
docker-compose restart
```

### Port 27017 déjà utilisé
```powershell
# Vérifier quel processus utilise le port
netstat -ano | findstr :27017

# Arrêter MongoDB s'il tourne en service Windows
net stop MongoDB
```

### Erreur "command not found: docker"
Installe Docker Desktop : https://www.docker.com/products/docker-desktop/

## 📝 Notes importantes

### Sécurité
⚠️ **En production, changez absolument :**
- Les mots de passe MongoDB
- Le JWT_SECRET
- Les credentials Mongo Express
- Activez HTTPS

### Données
- Les données sont persistées dans un volume Docker `mongodb_data`
- Pour effacer les données : `docker-compose down -v`
- Pour sauvegarder : utiliser `mongodump`

### Performance
- MongoDB gère automatiquement les connexions (pool)
- Les index sont créés au démarrage
- Ajoutez des index supplémentaires si nécessaire

## 🎯 Avantages de cette architecture

✅ **Multi-utilisateurs** : Plusieurs personnes peuvent travailler simultanément
✅ **Centralisé** : Une seule source de vérité pour les données
✅ **Sécurisé** : Authentification JWT + rôles
✅ **Scalable** : Peut gérer des milliers d'enregistrements
✅ **Sauvegardable** : Exports MongoDB standards
✅ **Auditable** : Timestamps sur toutes les opérations

## 📞 Support

Si tu rencontres des problèmes, vérifie dans l'ordre :
1. Docker est bien installé et démarré
2. Les conteneurs MongoDB tournent (`docker ps`)
3. Le backend est démarré (`npm run dev`)
4. Les logs du backend (`npm run dev` affiche les erreurs)
5. Les logs MongoDB (`docker logs hospifinance-mongodb`)
