# 🚀 Configuration Render.com Free - Guide Pas-à-Pas

Ce guide vous accompagne dans le déploiement du backend Hospifinance sur Render.com (plan gratuit).

---

## ⏱️ Temps estimé : 10-15 minutes

## 📋 Prérequis

✅ MongoDB Atlas configuré (voir [SETUP_MONGODB_ATLAS.md](./SETUP_MONGODB_ATLAS.md))
✅ Chaîne de connexion MongoDB URI prête
✅ Compte GitHub avec le dépôt `Ayhzer/hospifinance`

---

## 🎯 Étape 1 : Création du compte Render (2 min)

1. **Ouvrez ce lien dans votre navigateur** :
   ```
   https://dashboard.render.com/register
   ```

2. **Créez votre compte** :
   - Option A : **Sign up with GitHub** (recommandé, plus rapide)
     - Cliquez sur "Sign up with GitHub"
     - Autorisez Render à accéder à votre compte GitHub
   - Option B : Email + Mot de passe

3. **Vérifiez votre email** (si vous avez choisi l'option B)

4. **Bienvenue sur le Dashboard Render !**

---

## 🔗 Étape 2 : Connecter votre dépôt GitHub (1 min)

Si vous avez utilisé "Sign up with GitHub", cette étape est déjà faite. Sinon :

1. Dashboard Render → Cliquez sur votre avatar (en haut à droite)
2. **Account Settings** → **Connect Accounts**
3. Cliquez sur **"Connect"** à côté de GitHub
4. Autorisez Render à accéder à vos dépôts

---

## 🌐 Étape 3 : Créer le Web Service (3 min)

1. Dans le Dashboard Render, cliquez sur **"New +"** (en haut à droite)

2. Sélectionnez **"Web Service"**

3. **Connectez votre dépôt** :
   - Si vous voyez directement la liste de vos dépôts, passez à l'étape suivante
   - Sinon, cliquez sur **"Connect account"** → Autorisez GitHub

4. **Trouvez votre dépôt** :
   - Cherchez : `Ayhzer/hospifinance`
   - OU si vous ne le voyez pas, cliquez sur **"+ Connect a repository"**
   - Dans la popup, cherchez `hospifinance` et cliquez sur **"Connect"**

5. **Cliquez sur "Connect"** à côté du dépôt `Ayhzer/hospifinance`

---

## ⚙️ Étape 4 : Configuration du service (5 min)

Remplissez le formulaire avec ces valeurs **EXACTES** :

### Section : Basic Information

| Champ | Valeur |
|-------|--------|
| **Name** | `hospifinance-api` (ou un nom unique de votre choix) |
| **Region** | **Frankfurt (EU Central)** (le plus proche de la France) |
| **Branch** | `main` (ou votre branche principale) |
| **Root Directory** | `backend` ⚠️ IMPORTANT |
| **Runtime** | **Node** (auto-détecté) |

### Section : Build & Deploy

| Champ | Valeur |
|-------|--------|
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |

### Section : Plan

- ✅ Sélectionnez **"Free"** (0 $/mois)
  - 750 heures/mois
  - 512 MB RAM
  - Mise en veille après 15 min d'inactivité

---

## 🔐 Étape 5 : Ajouter les variables d'environnement (5 min)

**AVANT** de cliquer sur "Create Web Service", descendez jusqu'à la section **"Environment Variables"**.

### Cliquez sur **"Add Environment Variable"** pour chaque variable ci-dessous :

#### 1. NODE_ENV
- **Key** : `NODE_ENV`
- **Value** : `production`

#### 2. PORT
- **Key** : `PORT`
- **Value** : `10000`

💡 Render utilise le port 10000 par défaut pour les services gratuits.

#### 3. MONGODB_URI ⚠️ IMPORTANT
- **Key** : `MONGODB_URI`
- **Value** : Votre chaîne de connexion MongoDB complète

  **Exemple** :
  ```
  mongodb+srv://hospifinance_admin:Xy9mK2pQw7Lz@cluster0.ab1cd.mongodb.net/hospifinance?retryWrites=true&w=majority
  ```

  ⚠️ **Vérifiez bien** :
  - Le username est correct
  - Le mot de passe est correct (sans espaces)
  - `/hospifinance` est présent avant le `?`
  - Pas d'espace en début ou fin

#### 4. MONGODB_DB_NAME
- **Key** : `MONGODB_DB_NAME`
- **Value** : `hospifinance`

#### 5. JWT_SECRET ⚠️ IMPORTANT
- **Key** : `JWT_SECRET`
- **Value** : Générez un secret sécurisé (voir ci-dessous)

**Pour générer JWT_SECRET** :

**Option A** : Avec Node.js installé localement
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Option B** : Utilisez ce secret temporaire (à changer plus tard) :
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4
```

**Option C** : Générez-en un sur https://randomkeygen.com (section "CodeIgniter Encryption Keys")

Copiez et collez le secret généré dans **Value**.

#### 6. JWT_EXPIRES_IN
- **Key** : `JWT_EXPIRES_IN`
- **Value** : `7d`

💡 Les tokens JWT seront valides pendant 7 jours.

#### 7. CORS_ORIGIN ⚠️ IMPORTANT
- **Key** : `CORS_ORIGIN`
- **Value** : `https://ayhzer.github.io`

⚠️ **Attention** :
- Pas de `/` à la fin
- Pas de `/hospifinance` à la fin
- Juste le domaine de base

---

## 🎬 Étape 6 : Déployer ! (3-5 min)

1. **Vérifiez toutes les valeurs** ci-dessus

2. **Cliquez sur "Create Web Service"** en bas de la page

3. **Render va maintenant** :
   - ✅ Cloner votre dépôt GitHub
   - ✅ Installer les dépendances (`npm install`)
   - ✅ Démarrer le serveur (`npm start`)
   - ✅ Tester la connexion MongoDB

4. **Suivez les logs en temps réel** :
   - Vous verrez défiler les logs dans la console
   - Recherchez ces messages :
     ```
     ✅ MongoDB connecté
     🚀 Serveur API démarré sur http://localhost:10000
     ```

5. **Attendez le message** :
   ```
   ==> Your service is live 🎉
   ```

⏳ Le premier déploiement prend environ **2-5 minutes**.

---

## 🔗 Étape 7 : Récupérer l'URL du backend (1 min)

1. Une fois le déploiement terminé, en haut de la page vous verrez :
   ```
   https://hospifinance-api.onrender.com
   ```
   (ou le nom que vous avez choisi)

2. **📋 COPIEZ cette URL complète**

3. **Testez immédiatement** en ouvrant dans un navigateur :
   ```
   https://hospifinance-api.onrender.com/health
   ```

4. **Vous devriez voir** :
   ```json
   {
     "status": "ok",
     "timestamp": "2024-02-10T15:30:45.123Z"
   }
   ```

   **🎉 Si vous voyez cette réponse, votre backend est déployé avec succès !**

---

## 📝 Étape 8 : Sauvegarder les informations (1 min)

Créez un fichier texte `render-info.txt` avec :

```
=== Render.com Configuration ===

Service Name: hospifinance-api
URL: https://hospifinance-api.onrender.com
Health Check: https://hospifinance-api.onrender.com/health

Region: Frankfurt (EU Central)
Plan: Free (750h/mois)

Variables d'environnement configurées:
- NODE_ENV: production
- PORT: 10000
- MONGODB_URI: [configuré]
- MONGODB_DB_NAME: hospifinance
- JWT_SECRET: [configuré]
- JWT_EXPIRES_IN: 7d
- CORS_ORIGIN: https://ayhzer.github.io

=== Pour le frontend ===
Ajoutez cette URL dans GitHub Secrets:
Secret Name: VITE_API_URL
Secret Value: https://hospifinance-api.onrender.com/api

(notez le /api à la fin !)
```

⚠️ **IMPORTANT** : Ne commitez JAMAIS ce fichier dans Git !

---

## 🎯 Étape 9 : Tester les endpoints de l'API (optionnel)

Testez quelques endpoints avec `curl` ou Postman :

### 1. Health Check
```bash
curl https://hospifinance-api.onrender.com/health
```

Réponse attendue : `{"status":"ok","timestamp":"..."}`

### 2. Login (avec utilisateur par défaut)
```bash
curl -X POST https://hospifinance-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

Réponse attendue : `{"token":"...", "user":{...}}`

Si vous voyez un token JWT, **tout fonctionne parfaitement !** 🎉

---

## 🔧 Configuration avancée

### Activer les logs persistants

Par défaut, Render garde 7 jours de logs. Pour en garder plus :

1. Dashboard → Votre service → **Settings**
2. Section **"Advanced"**
3. **Persistent Disk** : Activez si nécessaire (non requis pour ce projet)

### Configurer les notifications

1. Dashboard → Votre service → **Settings**
2. Section **"Notifications"**
3. Ajoutez votre email pour recevoir des alertes en cas de :
   - Échec de déploiement
   - Service down
   - Dépassement de quota

### Redéploiement automatique

✅ **Déjà configuré !**

Chaque fois que vous pushez sur la branche `main`, Render redéploiera automatiquement.

**Tester** :
```bash
# Faites une modification dans backend/
cd backend
echo "// Update" >> server.js

# Commitez et pushez
git add .
git commit -m "Test auto-deploy"
git push origin main
```

Render détectera le push et redéploiera en 2-3 minutes.

---

## 📊 Surveiller votre service

### Dashboard Render

1. **Logs** : Voir les logs en temps réel
2. **Metrics** : CPU, RAM, requêtes par seconde
3. **Events** : Historique des déploiements
4. **Shell** : Accès SSH au conteneur (plan payant uniquement)

### Limites du plan gratuit

- **750 heures/mois** : Largement suffisant pour un service qui se met en veille
- **Mise en veille** : Après 15 minutes d'inactivité
- **Réveil** : 30-60 secondes au premier accès
- **100 GB/mois** : Bande passante sortante
- **512 MB RAM** : Suffisant pour Node.js + MongoDB client

### Éviter la mise en veille (optionnel)

Utilisez [UptimeRobot](https://uptimerobot.com) (gratuit) :

1. Créez un compte sur UptimeRobot
2. Ajoutez un nouveau monitor :
   - Type : **HTTP(s)**
   - URL : `https://hospifinance-api.onrender.com/health`
   - Interval : **5 minutes**
3. UptimeRobot pingera votre API toutes les 5 minutes → pas de mise en veille !

---

## 🆘 Dépannage

### Problème : "Build failed"

**Causes possibles** :
- `Root Directory` incorrect (doit être `backend`)
- Dépendances manquantes dans `package.json`

**Solutions** :
1. Vérifiez les logs du build
2. Dashboard → Votre service → **Logs** → Cherchez les erreurs rouges
3. Vérifiez que `Root Directory` = `backend`
4. Redéployez : **Manual Deploy** → **Deploy latest commit**

### Problème : "MongoServerError: Authentication failed"

**Causes possibles** :
- Username ou password incorrect dans `MONGODB_URI`
- Utilisateur non créé dans MongoDB Atlas

**Solutions** :
1. Dashboard → Votre service → **Environment** → Vérifiez `MONGODB_URI`
2. Vérifiez MongoDB Atlas → **Database Access** → Utilisateur existe
3. Testez la connexion localement avec cette URI
4. Recréez l'utilisateur si nécessaire

### Problème : "Connection timeout to MongoDB"

**Causes possibles** :
- Network Access non configuré dans MongoDB Atlas
- URI incorrecte

**Solutions** :
1. MongoDB Atlas → **Network Access** → Vérifiez `0.0.0.0/0` est autorisé
2. Attendez 1-2 minutes (propagation)
3. Vérifiez que le cluster est "Active"

### Problème : Erreur CORS côté frontend

**Symptôme** :
```
Access to fetch at 'https://...' has been blocked by CORS policy
```

**Solutions** :
1. Dashboard Render → **Environment** → Vérifiez `CORS_ORIGIN`
2. Doit être exactement : `https://ayhzer.github.io` (sans `/` à la fin)
3. Redéployez si vous avez modifié

### Problème : Service en veille (502 Bad Gateway)

**C'est normal !** Le service gratuit se met en veille après 15 min.

**Solutions** :
- Attendez 30-60 secondes, réessayez
- Utilisez UptimeRobot pour éviter la mise en veille
- Passez au plan Starter ($7/mois) pour un service actif 24/7

---

## 🔄 Prochaine étape

Une fois Render.com configuré, passez à :
👉 **[SETUP_GITHUB_PAGES.md](./SETUP_GITHUB_PAGES.md)** pour déployer le frontend

---

## 📞 Support

- **Documentation Render** : https://render.com/docs
- **Dashboard Render** : https://dashboard.render.com
- **Support Render** : https://render.com/support

---

**Temps total : 10-15 minutes**
**Coût : GRATUIT (750h/mois)**
**URL du backend : https://hospifinance-api.onrender.com**
