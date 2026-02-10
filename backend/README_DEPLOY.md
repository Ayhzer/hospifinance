# Backend Hospifinance - Déploiement Render.com

Ce document explique comment déployer le backend Hospifinance sur Render.com.

## 📋 Prérequis

- Compte MongoDB Atlas avec un cluster configuré
- Compte Render.com
- Repository GitHub avec le code source

## 🚀 Configuration rapide

### 1. Préparer MongoDB Atlas

Créez votre base de données MongoDB Atlas et récupérez la chaîne de connexion :

```
mongodb+srv://username:password@cluster.mongodb.net/hospifinance?retryWrites=true&w=majority
```

### 2. Déployer sur Render.com

Deux méthodes de déploiement :

#### Méthode A : Via render.yaml (Automatique)

Le fichier `render.yaml` est déjà configuré dans ce dossier.

1. Sur Render.com, cliquez sur **"New +"** → **"Blueprint"**
2. Connectez votre dépôt GitHub
3. Render détectera automatiquement `render.yaml`
4. Configurez les variables d'environnement (voir ci-dessous)
5. Cliquez sur **"Apply"**

#### Méthode B : Via l'interface Web (Manuel)

1. Sur Render.com, cliquez sur **"New +"** → **"Web Service"**
2. Connectez votre dépôt GitHub
3. Configurez :
   - **Name** : `hospifinance-api`
   - **Root Directory** : `backend`
   - **Runtime** : Node
   - **Build Command** : `npm install`
   - **Start Command** : `npm start`
   - **Plan** : Free

### 3. Variables d'environnement

Ajoutez ces variables dans Render.com (Settings → Environment) :

| Variable | Valeur | Description |
|----------|--------|-------------|
| `NODE_ENV` | `production` | Mode de production |
| `PORT` | `10000` | Port du serveur (par défaut Render) |
| `MONGODB_URI` | Votre URI MongoDB Atlas | Chaîne de connexion complète |
| `MONGODB_DB_NAME` | `hospifinance` | Nom de la base de données |
| `JWT_SECRET` | Secret généré | Clé secrète pour JWT (voir ci-dessous) |
| `JWT_EXPIRES_IN` | `7d` | Durée de validité du token |
| `CORS_ORIGIN` | `https://ayhzer.github.io` | URL du frontend autorisée |

**Générer JWT_SECRET** :
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Vérifier le déploiement

Une fois déployé, testez votre API :

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

## 🔧 Configuration avancée

### Health Check

Render effectue automatiquement des health checks sur :
- **Path** : `/health`
- **Interval** : Toutes les 30 secondes
- **Timeout** : 10 secondes

### Logs

Accédez aux logs en temps réel :
1. Dashboard Render → Votre service
2. Onglet **"Logs"**

### Redéploiement

Le backend se redéploie automatiquement à chaque push sur `main` :

```bash
git add .
git commit -m "Update backend"
git push origin main
```

Ou redéploiement manuel depuis Render :
1. Dashboard → Votre service
2. Cliquez sur **"Manual Deploy"** → **"Deploy latest commit"**

## 🐛 Dépannage

### Erreur : "MONGODB_URI is not defined"

**Solution** : Vérifiez que la variable `MONGODB_URI` est bien définie dans Render.

### Erreur : "MongoServerError: Authentication failed"

**Solutions** :
1. Vérifiez le username et password dans `MONGODB_URI`
2. Vérifiez que l'utilisateur existe dans MongoDB Atlas (Database Access)
3. Vérifiez que l'IP 0.0.0.0/0 est autorisée (Network Access)

### Service en veille (Plan gratuit)

Le service gratuit se met en veille après 15 minutes d'inactivité.

**Solutions** :
1. Utilisez [UptimeRobot](https://uptimerobot.com) pour pinguer l'API toutes les 5 minutes
2. Passez au plan payant ($7/mois) pour un service actif 24/7

### Erreur CORS

**Solution** : Vérifiez que `CORS_ORIGIN` correspond exactement à l'URL du frontend (sans `/` à la fin).

## 📊 Monitoring

### Métriques disponibles

Dashboard Render → Votre service → **Metrics** :
- CPU usage
- Memory usage
- Bandwidth usage
- Request count
- Response times

### Alertes

Configurez des alertes dans Render :
1. Dashboard → Votre service → Settings
2. **"Notifications"**
3. Ajoutez votre email ou webhook Slack

## 🔐 Sécurité

### Checklist

- ✅ Utilisez un `JWT_SECRET` fort (64+ caractères)
- ✅ Ne commitez jamais les fichiers `.env`
- ✅ Limitez `CORS_ORIGIN` à votre domaine frontend uniquement
- ✅ Utilisez HTTPS (activé par défaut sur Render)
- ✅ Activez 2FA sur Render et MongoDB
- ✅ Revoyez les logs régulièrement

### Rotation des secrets

Changez régulièrement `JWT_SECRET` :
1. Générez un nouveau secret
2. Mettez à jour la variable dans Render
3. Le service redémarrera automatiquement
4. ⚠️ Tous les utilisateurs devront se reconnecter

## 💰 Coûts

### Plan gratuit (Free)

- **750 heures/mois** de runtime
- Mise en veille après 15 min d'inactivité
- 100 GB/mois de bande passante
- Partagé avec d'autres services

### Plan Starter ($7/mois)

- Service actif 24/7 (pas de mise en veille)
- 100 GB/mois de bande passante
- Support par email

### Estimation utilisation

Pour un établissement hospitalier (10-50 utilisateurs actifs) :
- **Plan gratuit** : Largement suffisant (< 100h/mois d'utilisation réelle)
- **Bande passante** : ~ 1-5 GB/mois

## 📚 Ressources

- [Documentation Render](https://render.com/docs)
- [Guide MongoDB Atlas](https://www.mongodb.com/docs/atlas/)
- [Node.js sur Render](https://render.com/docs/deploy-node-express-app)

---

**Support** : Pour toute question, consultez [DEPLOY_GUIDE.md](../DEPLOY_GUIDE.md) dans le répertoire racine.
