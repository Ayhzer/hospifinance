# 🔑 Création du compte Admin - Instructions Rapides

## Contexte

Les credentials `pottieralexandre01_db_user:uPtD80iUJPZeXn93` sont pour **MongoDB Atlas** (la base de données).

Le compte `admin/admin` est pour **l'application Hospifinance** et doit être créé dans MongoDB.

---

## ✅ Solution la plus simple : Via MongoDB Atlas UI

### Étape 1 : Accéder à MongoDB Atlas

1. Allez sur https://cloud.mongodb.com
2. Connectez-vous avec votre compte
3. Sélectionnez votre cluster (probablement `Cluster0`)
4. Cliquez sur **Browse Collections**

### Étape 2 : Créer le compte admin

1. Dans la base `hospifinance`, allez dans la collection **`users`**
   - Si la collection n'existe pas, créez-la : **Add My Own Data** > Collection Name: `users`

2. Cliquez sur **Insert Document**

3. Passez en mode **{ }** (JSON View) et collez :

```json
{
  "id": 1,
  "username": "admin",
  "passwordHash": "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918",
  "role": "superadmin",
  "createdAt": {"$date": "2024-01-01T00:00:00.000Z"},
  "updatedAt": {"$date": "2024-01-01T00:00:00.000Z"}
}
```

4. Cliquez sur **Insert**

### Étape 3 : Créer les settings

1. Créez une nouvelle collection **`settings`**

2. Cliquez sur **Insert Document**

3. Collez :

```json
{
  "_id": "global",
  "customColumns": {
    "opex": [],
    "capex": []
  },
  "columnVisibility": {},
  "createdAt": {"$date": "2024-01-01T00:00:00.000Z"},
  "updatedAt": {"$date": "2024-01-01T00:00:00.000Z"}
}
```

4. Cliquez sur **Insert**

---

## 🧪 Test

Une fois fait, testez le login :

```bash
curl -X POST https://hospifinance.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'
```

Vous devriez recevoir :
```json
{
  "token": "eyJhbGciOiJIUz...",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "superadmin"
  }
}
```

---

## 🌐 Connexion à l'application

1. Allez sur https://ayhzer.github.io/hospifinance/
2. Connectez-vous avec :
   - **Username** : `admin`
   - **Password** : `admin`

3. ⚠️ **Changez immédiatement le mot de passe** via **Paramétrage** > **Utilisateurs**

---

## 📝 Note sur le mot de passe

Le hash `8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918` correspond au mot de passe `admin` encodé en SHA-256.

Pour générer un autre hash si besoin :
```javascript
crypto.createHash('sha256').update('votre_mot_de_passe').digest('hex')
```

---

## 🔄 Alternative : Script automatique

Si vous préférez automatiser, consultez [backend/INIT_DATABASE.md](backend/INIT_DATABASE.md) pour lancer le script d'initialisation.
