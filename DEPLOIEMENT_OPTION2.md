# 🚀 Hospifinance - Option 2 : Déploiement Séparé

Ce document résume la configuration pour déployer Hospifinance avec l'**Option 2** :
- **Frontend** sur GitHub Pages
- **Backend** sur Render.com
- **Base de données** sur MongoDB Atlas

## 📁 Fichiers de configuration créés

### Backend (Render.com)

- ✅ `backend/render.yaml` - Configuration Render pour déploiement automatique
- ✅ `backend/.env.production.example` - Exemple de variables d'environnement production
- ✅ `backend/README_DEPLOY.md` - Guide de déploiement détaillé du backend

### Frontend (GitHub Pages)

- ✅ `.env.production.example` - Exemple de variables d'environnement frontend
- ✅ `.github/workflows/deploy.yml` - Workflow GitHub Actions pour déploiement automatique
- ✅ Configuration Vite déjà présente dans `vite.config.js`

### Documentation

- ✅ `DEPLOY_GUIDE.md` - **Guide complet de déploiement étape par étape** (COMMENCEZ ICI !)

## 🎯 Démarrage rapide

### Étape 1 : MongoDB Atlas

1. Créez un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Créez un cluster gratuit (M0)
3. Créez un utilisateur de base de données
4. Autorisez l'accès depuis n'importe quelle IP (0.0.0.0/0)
5. Récupérez votre chaîne de connexion

### Étape 2 : Backend sur Render.com

1. Créez un compte sur [Render.com](https://render.com)
2. Créez un nouveau **Web Service**
3. Connectez votre dépôt GitHub `Ayhzer/hospifinance`
4. Configuration :
   - Root Directory : `backend`
   - Build Command : `npm install`
   - Start Command : `npm start`
5. Ajoutez les variables d'environnement (voir `.env.production.example`)
6. Déployez

### Étape 3 : Frontend sur GitHub Pages

1. Créez un fichier `.env.production` avec votre URL backend Render :
   ```env
   VITE_API_URL=https://votre-api.onrender.com/api
   ```
2. Ajoutez cette variable comme secret GitHub :
   - Settings → Secrets and variables → Actions
   - New repository secret
   - Name : `VITE_API_URL`
   - Value : `https://votre-api.onrender.com/api`
3. Poussez sur `main` → GitHub Actions déploiera automatiquement

**OU** déploiement manuel :
```bash
npm run build
npm run deploy
```

## 📚 Documentation complète

Pour le guide complet avec toutes les étapes détaillées, captures d'écran et dépannage :

👉 **Consultez [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md)**

## 🔗 URLs après déploiement

- **Frontend** : https://ayhzer.github.io/hospifinance
- **Backend** : https://votre-nom-de-service.onrender.com
- **Health Check** : https://votre-nom-de-service.onrender.com/health

## ⚙️ Variables d'environnement nécessaires

### Backend (Render.com)

| Variable | Exemple | Obligatoire |
|----------|---------|-------------|
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/hospifinance` | ✅ Oui |
| `JWT_SECRET` | `généré avec crypto.randomBytes(64)` | ✅ Oui |
| `CORS_ORIGIN` | `https://ayhzer.github.io` | ✅ Oui |
| `NODE_ENV` | `production` | ✅ Oui |
| `PORT` | `10000` | ⚠️ Par défaut |
| `MONGODB_DB_NAME` | `hospifinance` | ⚠️ Par défaut |
| `JWT_EXPIRES_IN` | `7d` | ⚠️ Par défaut |

### Frontend (GitHub Actions Secret)

| Variable | Exemple | Obligatoire |
|----------|---------|-------------|
| `VITE_API_URL` | `https://hospifinance-api.onrender.com/api` | ✅ Oui |

## 🧪 Tester le déploiement

### 1. Vérifier le backend

```bash
curl https://votre-api.onrender.com/health
```

Réponse attendue :
```json
{
  "status": "ok",
  "timestamp": "2024-XX-XXTXX:XX:XX.XXXZ"
}
```

### 2. Vérifier le frontend

Ouvrez https://ayhzer.github.io/hospifinance

### 3. Se connecter

- Username : `admin`
- Password : `admin123`

⚠️ **Changez immédiatement le mot de passe** dans les paramètres !

## 🆘 Aide et dépannage

### Problèmes courants

- **Backend 502** → Service en veille, attendez 30-60s
- **Erreur CORS** → Vérifiez `CORS_ORIGIN` dans Render
- **Pas de connexion MongoDB** → Vérifiez `MONGODB_URI` et Network Access
- **Frontend ne charge pas les données** → Vérifiez `VITE_API_URL`

👉 **Consultez la section Dépannage dans [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md)**

## 💰 Coûts

Totalement **GRATUIT** pour commencer :

- **MongoDB Atlas M0** : Gratuit (512 MB)
- **Render.com Free** : Gratuit (750h/mois)
- **GitHub Pages** : Gratuit (1 GB, 100 GB/mois)

## 🎯 Prochaines étapes

1. Suivez le [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md) complet
2. Déployez MongoDB Atlas
3. Déployez le backend sur Render
4. Déployez le frontend sur GitHub Pages
5. Testez votre application
6. Configurez des sauvegardes régulières

## 📞 Support

- **Questions** : Consultez [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md)
- **Problèmes** : Section "Dépannage" du guide
- **Documentation backend** : [backend/README_DEPLOY.md](./backend/README_DEPLOY.md)

---

**Version** : 3.2.0
**Dernière mise à jour** : Février 2024

🚀 **Bonne chance avec votre déploiement !**
