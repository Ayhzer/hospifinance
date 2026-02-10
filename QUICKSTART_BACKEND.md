# 🚀 Guide de démarrage rapide - Backend MongoDB

## Étapes pour démarrer l'API avec MongoDB

### 1️⃣ Démarrer MongoDB avec Docker

```bash
# Depuis la racine du projet hospifinance
docker-compose up -d
```

✅ Cela démarre :
- **MongoDB** sur `localhost:27017`
- **Mongo Express** (interface web) sur `http://localhost:8081`

### 2️⃣ Installer les dépendances du backend

```bash
cd backend
npm install
```

### 3️⃣ Démarrer le serveur API

```bash
# Mode développement (avec auto-reload)
npm run dev
```

Le serveur API sera accessible sur : **http://localhost:3001**

### 4️⃣ Tester l'API

#### Test de connexion
```bash
curl http://localhost:3001/health
```

#### Test de login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'
```

Vous recevrez un token JWT à utiliser pour les autres requêtes.

### 5️⃣ Accéder à Mongo Express (optionnel)

Ouvrez http://localhost:8081 dans votre navigateur
- Username: `admin`
- Password: `admin`

Vous pouvez y visualiser et gérer vos données MongoDB.

---

## 🔧 Commandes utiles

### Docker

```bash
# Voir les logs MongoDB
docker logs hospifinance-mongodb -f

# Arrêter les conteneurs
docker-compose down

# Redémarrer les conteneurs
docker-compose restart

# Supprimer les volumes (⚠️ efface les données)
docker-compose down -v
```

### Backend

```bash
# Mode production
npm start

# Voir les logs en temps réel
npm run dev
```

---

## 📡 Endpoints API disponibles

### Authentification
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Info utilisateur

### Utilisateurs (admin)
- `GET /api/users` - Liste
- `POST /api/users` - Créer
- `PUT /api/users/:id` - Modifier
- `DELETE /api/users/:id` - Supprimer

### OPEX
- `GET /api/opex` - Liste
- `POST /api/opex` - Créer
- `PUT /api/opex/:id` - Modifier
- `DELETE /api/opex/:id` - Supprimer

### CAPEX
- `GET /api/capex` - Liste
- `POST /api/capex` - Créer
- `PUT /api/capex/:id` - Modifier
- `DELETE /api/capex/:id` - Supprimer

### Settings
- `GET /api/settings` - Récupérer
- `PUT /api/settings` - Mettre à jour
- `POST /api/settings/custom-columns` - Ajouter colonne
- `DELETE /api/settings/custom-columns/:type/:id` - Supprimer colonne

---

## 🔐 Compte par défaut

- **Username**: `admin`
- **Password**: `admin`
- **Role**: `superadmin`

⚠️ **Changez ce mot de passe en production !**

---

## ❓ Problèmes courants

### MongoDB ne démarre pas
```bash
# Vérifier que le port 27017 n'est pas utilisé
netstat -an | findstr 27017

# Redémarrer Docker Desktop si nécessaire
```

### Port 3001 déjà utilisé
Modifiez le port dans `backend/.env` :
```env
PORT=3002
```

### Erreur de connexion MongoDB
Vérifiez que les conteneurs Docker sont bien démarrés :
```bash
docker ps
```

Vous devriez voir `hospifinance-mongodb` dans la liste.
