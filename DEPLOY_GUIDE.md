# Guide de Déploiement Hospifinance
# Frontend (GitHub Pages) + Backend (Render.com) + MongoDB Atlas

Ce guide vous accompagne dans le déploiement de Hospifinance avec une architecture séparée :
- **Frontend** : GitHub Pages (https://ayhzer.github.io/hospifinance)
- **Backend** : Render.com (gratuit jusqu'à 750h/mois)
- **Base de données** : MongoDB Atlas (gratuit jusqu'à 512 MB)

---

## 📋 Prérequis

- Compte GitHub
- Compte Render.com
- Compte MongoDB Atlas
- Git installé localement
- Node.js 18+ installé

---

## 🗄️ Étape 1 : Configuration MongoDB Atlas

### 1.1 Créer un cluster gratuit

1. Allez sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Créez un compte gratuit
3. Créez un nouveau cluster (FREE M0)
   - Choisissez le provider : **AWS** ou **Google Cloud**
   - Région : **Europe (Frankfurt)** ou la plus proche
   - Cluster Name : `hospifinance-cluster`

### 1.2 Configurer la sécurité

1. **Database Access** :
   - Cliquez sur "Database Access" dans le menu de gauche
   - Cliquez sur "Add New Database User"
   - Méthode : **Password**
   - Username : `hospifinance_admin`
   - Password : Générez un mot de passe sécurisé (copiez-le !)
   - Database User Privileges : **Atlas admin** (ou Read and write to any database)
   - Cliquez sur "Add User"

2. **Network Access** :
   - Cliquez sur "Network Access" dans le menu de gauche
   - Cliquez sur "Add IP Address"
   - Choisissez **"Allow Access from Anywhere"** (0.0.0.0/0)
   - Cliquez sur "Confirm"

   ⚠️ Note : Pour plus de sécurité en production, limitez l'accès aux IPs de Render.com

### 1.3 Récupérer la chaîne de connexion

1. Retournez sur "Database" dans le menu de gauche
2. Cliquez sur "Connect" sur votre cluster
3. Choisissez "Connect your application"
4. Driver : **Node.js**, Version : **6.3 or later**
5. Copiez la chaîne de connexion :
   ```
   mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
   ```
6. Remplacez :
   - `<username>` par `hospifinance_admin`
   - `<password>` par votre mot de passe
   - Ajoutez `/hospifinance` avant le `?` :
   ```
   mongodb+srv://hospifinance_admin:VOTRE_MOT_DE_PASSE@cluster0.xxxxx.mongodb.net/hospifinance?retryWrites=true&w=majority
   ```

**🔐 Gardez cette chaîne de connexion en sécurité !**

---

## 🚀 Étape 2 : Déploiement du Backend sur Render.com

### 2.1 Créer un compte Render

1. Allez sur [Render.com](https://render.com)
2. Créez un compte gratuit (vous pouvez vous connecter avec GitHub)
3. Confirmez votre email

### 2.2 Créer un nouveau Web Service

1. Dans le dashboard Render, cliquez sur **"New +"** puis **"Web Service"**
2. Connectez votre dépôt GitHub :
   - Cliquez sur "Connect account" si ce n'est pas déjà fait
   - Autorisez Render à accéder à vos dépôts
   - Cherchez et sélectionnez le dépôt `Ayhzer/hospifinance`

### 2.3 Configurer le Web Service

Remplissez les champs suivants :

- **Name** : `hospifinance-api` (ou un nom unique)
- **Region** : **Frankfurt (EU Central)** (le plus proche)
- **Branch** : `main` (ou votre branche principale)
- **Root Directory** : `backend`
- **Runtime** : **Node**
- **Build Command** : `npm install`
- **Start Command** : `npm start`
- **Plan** : **Free**

### 2.4 Variables d'environnement

Cliquez sur "Advanced" puis ajoutez les variables d'environnement suivantes :

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `MONGODB_URI` | Votre chaîne de connexion MongoDB Atlas complète |
| `MONGODB_DB_NAME` | `hospifinance` |
| `JWT_SECRET` | Générez un secret sécurisé (voir ci-dessous) |
| `JWT_EXPIRES_IN` | `7d` |
| `CORS_ORIGIN` | `https://ayhzer.github.io` |

**Pour générer JWT_SECRET** (exécutez dans un terminal Node.js) :
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2.5 Déployer

1. Cliquez sur **"Create Web Service"**
2. Render va :
   - Cloner votre dépôt
   - Installer les dépendances
   - Démarrer le serveur

   ⏳ Le premier déploiement prend environ 2-3 minutes.

3. Une fois déployé, vous verrez votre URL backend :
   ```
   https://hospifinance-api.onrender.com
   ```

   **📝 Copiez cette URL, vous en aurez besoin pour le frontend !**

### 2.6 Vérifier le déploiement

Testez votre API en ouvrant dans un navigateur :
```
https://hospifinance-api.onrender.com/health
```

Vous devriez voir :
```json
{
  "status": "ok",
  "timestamp": "2024-XX-XXTXX:XX:XX.XXXZ"
}
```

⚠️ **Note importante** : Les services gratuits de Render se mettent en veille après 15 minutes d'inactivité. Le premier accès après une période d'inactivité peut prendre 30-60 secondes.

---

## 🎨 Étape 3 : Déploiement du Frontend sur GitHub Pages

### 3.1 Configurer les variables d'environnement

1. Dans le répertoire racine du projet, créez un fichier `.env.production` :
   ```bash
   cp .env.production.example .env.production
   ```

2. Éditez `.env.production` et remplacez l'URL de l'API :
   ```env
   VITE_API_URL=https://hospifinance-api.onrender.com/api
   ```

   ⚠️ **Important** : Remplacez par votre URL Render.com réelle

### 3.2 Vérifier la configuration Vite

Le fichier `vite.config.js` est déjà configuré pour GitHub Pages :
```javascript
base: process.env.NODE_ENV === 'production' ? '/hospifinance/' : '/'
```

### 3.3 Vérifier package.json

Le fichier `package.json` doit contenir :
```json
{
  "homepage": "https://Ayhzer.github.io/hospifinance",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

### 3.4 Installer gh-pages (si ce n'est pas déjà fait)

```bash
npm install --save-dev gh-pages
```

### 3.5 Builder et déployer

```bash
# Build du frontend avec les variables de production
npm run build

# Déploiement sur GitHub Pages
npm run deploy
```

### 3.6 Activer GitHub Pages

1. Allez sur votre dépôt GitHub : `https://github.com/Ayhzer/hospifinance`
2. Cliquez sur **Settings** > **Pages**
3. Source : **Deploy from a branch**
4. Branch : **gh-pages** / **/ (root)**
5. Cliquez sur **Save**

Votre site sera disponible à :
```
https://ayhzer.github.io/hospifinance
```

⏳ Le déploiement prend environ 1-2 minutes.

---

## ✅ Étape 4 : Vérification et Tests

### 4.1 Vérifier les URLs

- **Frontend** : https://ayhzer.github.io/hospifinance
- **Backend** : https://hospifinance-api.onrender.com (votre URL)
- **Health Check** : https://hospifinance-api.onrender.com/health

### 4.2 Tester l'application

1. Ouvrez le frontend dans votre navigateur
2. Première connexion (utilisateur par défaut) :
   - Username : `admin`
   - Password : `admin123`
3. **⚠️ Changez immédiatement le mot de passe admin** dans les paramètres

### 4.3 Vérifier la console du navigateur

Ouvrez les DevTools (F12) et vérifiez qu'il n'y a pas d'erreurs :
- Onglet **Console** : Pas d'erreurs CORS ou 404
- Onglet **Network** : Les requêtes API fonctionnent (status 200)

### 4.4 Tester les fonctionnalités

- Créer un fournisseur OPEX
- Créer un projet CAPEX
- Ajouter un utilisateur
- Exporter/Importer des données

---

## 🔧 Maintenance et Mises à Jour

### Mettre à jour le backend

Le backend se met à jour automatiquement à chaque push sur la branche `main` :

```bash
git add .
git commit -m "Update backend"
git push origin main
```

Render détectera le changement et redéploiera automatiquement.

### Mettre à jour le frontend

```bash
# Faire vos modifications dans src/

# Builder et déployer
npm run build
npm run deploy
```

### Monitorer le backend

1. Dashboard Render : https://dashboard.render.com
2. Cliquez sur votre service `hospifinance-api`
3. Onglet **Logs** : Voir les logs en temps réel
4. Onglet **Events** : Historique des déploiements
5. Onglet **Metrics** : CPU, RAM, bande passante

### Monitorer MongoDB

1. Dashboard MongoDB Atlas : https://cloud.mongodb.com
2. Cliquez sur votre cluster
3. **Metrics** : Voir l'utilisation (stockage, requêtes, connexions)
4. **Database** : Parcourir les collections (Browse Collections)

---

## 🐛 Dépannage

### Problème : Backend inaccessible (502 Bad Gateway)

**Causes possibles** :
- Service en cours de démarrage (premier accès après veille)
- Erreur de connexion MongoDB
- Variables d'environnement incorrectes

**Solutions** :
1. Attendre 30-60 secondes et réessayer
2. Vérifier les logs Render
3. Vérifier que `MONGODB_URI` est correct
4. Redéployer manuellement depuis Render

### Problème : Erreur CORS

**Symptôme** : Erreur dans la console :
```
Access to fetch at 'https://...' from origin 'https://ayhzer.github.io' has been blocked by CORS policy
```

**Solution** :
1. Vérifier que `CORS_ORIGIN` dans Render est bien `https://ayhzer.github.io`
2. Pas de `/` à la fin de l'URL
3. Redéployer le backend

### Problème : Frontend charge mais pas de données

**Causes possibles** :
- URL de l'API incorrecte
- Backend en veille
- Erreur d'authentification

**Solutions** :
1. Vérifier `.env.production` → `VITE_API_URL`
2. Ouvrir manuellement l'URL backend pour le réveiller
3. Vérifier la console du navigateur
4. Reconstruire et redéployer : `npm run build && npm run deploy`

### Problème : MongoDB connection timeout

**Causes possibles** :
- IP non autorisée dans Network Access
- Chaîne de connexion incorrecte
- Cluster en pause

**Solutions** :
1. MongoDB Atlas → Network Access → Vérifier que 0.0.0.0/0 est autorisé
2. Vérifier `MONGODB_URI` dans Render (username, password, nom du cluster)
3. Vérifier que le cluster est actif (pas en pause)

---

## 💰 Limites du Plan Gratuit

### Render.com (Free)

- **750 heures/mois** de runtime
- Service se met en **veille après 15 minutes** d'inactivité
- Redémarrage en **30-60 secondes**
- **100 GB/mois** de bande passante sortante
- Builds illimités

**💡 Astuce** : Pour éviter la mise en veille, utilisez un service de monitoring comme [UptimeRobot](https://uptimerobot.com) (gratuit) qui ping votre API toutes les 5 minutes.

### MongoDB Atlas (Free - M0)

- **512 MB** de stockage
- Partagé avec d'autres utilisateurs
- **100 connexions simultanées** max
- **Pas de sauvegarde automatique**
- Pas de support prioritaire

**💡 Estimation** : Avec 512 MB, vous pouvez stocker environ :
- 10 000 à 50 000 transactions OPEX/CAPEX
- Largement suffisant pour un établissement hospitalier

### GitHub Pages

- **1 GB** d'espace de stockage
- **100 GB/mois** de bande passante
- **10 builds/heure**
- Site public uniquement (dépôt public)

---

## 🔐 Sécurité en Production

### Checklist de sécurité

- ✅ Utilisez un `JWT_SECRET` fort et unique (64+ caractères)
- ✅ Changez le mot de passe admin par défaut
- ✅ Utilisez HTTPS uniquement (GitHub Pages et Render fournissent SSL/TLS)
- ✅ Ne commitez JAMAIS les fichiers `.env`
- ✅ Limitez les accès MongoDB Atlas aux IPs de Render (si possible)
- ✅ Activez l'authentification à deux facteurs (2FA) sur GitHub, Render et MongoDB
- ✅ Revoyez régulièrement les permissions utilisateurs
- ✅ Effectuez des sauvegardes régulières des données MongoDB

### Sauvegardes MongoDB

Avec le plan gratuit, pas de sauvegarde automatique. Utilisez l'export manuel :

1. MongoDB Atlas → Database → Browse Collections
2. Chaque collection : Export Data → JSON
3. Ou utilisez `mongodump` (CLI) :
   ```bash
   mongodump --uri="mongodb+srv://..." --out=./backup
   ```

**💡 Recommandation** : Exportez vos données mensuellement.

---

## 📊 Alternatives aux Services Gratuits

Si vous atteignez les limites du plan gratuit, voici des alternatives :

### Backend

- **Railway.app** : $5/mois avec crédits gratuits
- **Fly.io** : Gratuit avec limites, puis $1.94/mois
- **Vercel** : Gratuit pour serverless functions
- **DigitalOcean App Platform** : À partir de $5/mois

### Base de données

- **MongoDB Atlas M2** : $9/mois (2 GB, sauvegardes)
- **PlanetScale** : Gratuit (5 GB), MySQL
- **Supabase** : Gratuit (500 MB), PostgreSQL

### Frontend

- **Vercel** : Gratuit, 100 GB/mois
- **Netlify** : Gratuit, 100 GB/mois
- **Cloudflare Pages** : Gratuit, bande passante illimitée

---

## 📞 Support et Ressources

- **Documentation Render** : https://render.com/docs
- **Documentation MongoDB Atlas** : https://www.mongodb.com/docs/atlas/
- **Documentation GitHub Pages** : https://docs.github.com/pages
- **Documentation Vite** : https://vitejs.dev

---

## 🎉 Félicitations !

Votre application Hospifinance est maintenant déployée et accessible en production ! 🚀

**URLs importantes** :
- Frontend : https://ayhzer.github.io/hospifinance
- Backend : https://hospifinance-api.onrender.com
- Dashboard Render : https://dashboard.render.com
- MongoDB Atlas : https://cloud.mongodb.com

---

**Dernière mise à jour** : Février 2024
**Version** : 3.2.0
